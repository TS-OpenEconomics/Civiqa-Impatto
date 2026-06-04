import { authService } from './authService'

export interface QueryResult {
  statement_id: string
  row_count: number
  manifest: { schema: { columns: Array<{ name: string }> } }
  result: { data_array: string[][] }
}

export interface GenieQueryAttachment {
  description: string
  query: string
  statement_id?: string
  query_result?: QueryResult
  query_result_metadata?: { row_count: number }
}

export interface GenieMessageResponse {
  id: string
  conversation_id: string
  status: 'EXECUTING_QUERY' | 'COMPLETED' | 'FAILED' | 'SUBMITTED' | 'CANCELLED'
  error?: { message: string }
  attachments?: Array<
    | { text: { content: string } }
    | { query: GenieQueryAttachment; attachment_id: string }
  >
  query_result?: QueryResult
}

export interface GenieMessage {
  messageId: string
  conversationId: string
}

const SPACE_ID = import.meta.env.VITE_DATABRICKS_GENIE_SPACE_ID as string
const BASE_URL = '/api/genie'
const POLL_INTERVAL_MS = 1500
const POLL_TIMEOUT_MS = 120_000
const NETWORK_RETRY_COUNT = 3
const NETWORK_RETRY_DELAY_MS = 2000

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function genieRequest<T>(
  path: string,
  options: RequestInit,
  token: string,
): Promise<{ status: number; data: T }> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
  const text = await res.text()
  let data: T
  try {
    data = text ? (JSON.parse(text) as T) : ({} as T)
  } catch {
    throw new Error(`Risposta non valida dal server (${res.status}): ${text.slice(0, 200)}`)
  }
  return { status: res.status, data }
}

class GenieService {
  private conversationId: string | null = null

  async sendMessage(text: string, token: string): Promise<GenieMessage> {
    if (!SPACE_ID) throw new Error('VITE_DATABRICKS_GENIE_SPACE_ID is not configured')

    if (this.conversationId === null) {
      const { status, data } = await genieRequest<{ conversation_id: string; message_id: string }>(
        `/spaces/${SPACE_ID}/start-conversation`,
        { method: 'POST', body: JSON.stringify({ content: text }) },
        token,
      )
      if (status === 401) {
        const fresh = await authService.getValidToken()
        return this.sendMessage(text, fresh)
      }
      this.conversationId = data.conversation_id
      return { messageId: data.message_id, conversationId: data.conversation_id }
    }

    const { status, data } = await genieRequest<{ id: string }>(
      `/spaces/${SPACE_ID}/conversations/${this.conversationId}/messages`,
      { method: 'POST', body: JSON.stringify({ content: text }) },
      token,
    )
    if (status === 401) {
      const fresh = await authService.getValidToken()
      return this.sendMessage(text, fresh)
    }
    return { messageId: data.id, conversationId: this.conversationId }
  }

  async pollMessage(
    conversationId: string,
    messageId: string,
    token: string,
  ): Promise<GenieMessageResponse> {
    const deadline = Date.now() + POLL_TIMEOUT_MS
    let networkErrors = 0

    while (Date.now() < deadline) {
      try {
        const { status, data } = await genieRequest<GenieMessageResponse>(
          `/spaces/${SPACE_ID}/conversations/${conversationId}/messages/${messageId}`,
          { method: 'GET' },
          token,
        )

        if (status === 401) {
          const fresh = await authService.getValidToken()
          token = fresh
          await sleep(POLL_INTERVAL_MS)
          continue
        }

        networkErrors = 0

        if (data.status === 'COMPLETED' || data.status === 'FAILED') {
          return data
        }

        await sleep(POLL_INTERVAL_MS)
      } catch {
        networkErrors++
        if (networkErrors > NETWORK_RETRY_COUNT) {
          throw new Error('Genie non ha risposto dopo più tentativi. Controlla la connessione.')
        }
        await sleep(NETWORK_RETRY_DELAY_MS)
      }
    }

    throw new Error('Genie non ha risposto in tempo. Riprova.')
  }

  async fetchQueryResult(
    conversationId: string,
    messageId: string,
    attachmentId: string,
    token: string,
  ): Promise<QueryResult | null> {
    try {
      const { status, data } = await genieRequest<Record<string, unknown>>(
        `/spaces/${SPACE_ID}/conversations/${conversationId}/messages/${messageId}/attachments/${attachmentId}/query-result`,
        { method: 'GET' },
        token,
      )
      console.log('[genie] fetchQueryResult status:', status, 'raw:', JSON.stringify(data).slice(0, 500))
      if (status !== 200) {
        console.warn('[genie] fetchQueryResult non-200:', status, data)
        return null
      }

      // API wraps the result in statement_response
      const sr = (data.statement_response ?? data) as Record<string, unknown>
      const manifest = sr.manifest as QueryResult['manifest'] | undefined
      const result = sr.result as Record<string, unknown> | undefined

      console.log('[genie] fetchQueryResult manifest columns:', manifest?.schema?.columns?.length ?? 'none')

      if (!manifest?.schema?.columns) return null

      // API returns data_typed_array [{values:[{str:"..."}]}] — normalize to string[][]
      let dataArray: string[][] = []
      if (Array.isArray(result?.data_array)) {
        dataArray = (result.data_array as unknown[][]).map(
          row => row.map(value => value == null ? '' : String(value)),
        )
      } else if (Array.isArray(result?.data_typed_array)) {
        dataArray = (result.data_typed_array as Array<{ values: Array<{ str?: string }> }>).map(
          row => row.values.map(v => v.str ?? '')
        )
      }
      console.log('[genie] fetchQueryResult rows:', dataArray.length)

      const totalRowCount = (manifest as unknown as Record<string, unknown>).total_row_count
      return {
        statement_id: String(sr.statement_id ?? ''),
        row_count: typeof totalRowCount === 'number' ? totalRowCount : dataArray.length,
        manifest,
        result: { data_array: dataArray },
      }
    } catch (err) {
      console.error('[genie] fetchQueryResult error:', err)
      return null
    }
  }

  resetConversation(): void {
    this.conversationId = null
  }
}

export const genieService = new GenieService()
