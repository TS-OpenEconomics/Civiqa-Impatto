import { Component, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { genieService } from '../../services/genieService'
import type { GenieMessageResponse } from '../../services/genieService'
import { GenieInput } from './GenieInput'
import { GenieMessageBubble } from './GenieMessageBubble'
import type { ChatMessage, SqlBlock } from './GenieMessageBubble'
import systemPrompt from '../../instructions.md?raw'
import './genie.css'

interface GenieChatWindowProps {
  getValidToken: () => Promise<string>
}

class GenieChatErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; message: string }
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false, message: '' }
  }
  static getDerivedStateFromError(err: unknown) {
    return { hasError: true, message: err instanceof Error ? err.message : String(err) }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div
          className="genie-error-message"
          role="alert"
          style={{ padding: 'var(--spacing-inset-m)' }}
        >
          <span aria-hidden="true">⚠</span>
          {' '}Errore nel rendering della risposta: {this.state.message}
        </div>
      )
    }
    return this.props.children
  }
}

function parseAttachments(response: GenieMessageResponse): {
  text: string
  sqlBlocks: SqlBlock[]
  tableResult: ChatMessage['tableResult']
} {
  let text = ''
  const sqlBlocks: SqlBlock[] = []
  let tableResult: ChatMessage['tableResult'] = undefined

  if (response.attachments) {
    for (const att of response.attachments) {
      if ('text' in att) {
        text += (text ? '\n' : '') + att.text.content
      } else if ('query' in att) {
        sqlBlocks.push({ description: att.query.description, query: att.query.query })
        if (att.query.query_result?.manifest?.schema?.columns) tableResult = att.query.query_result
      }
    }
  }

  if (response.query_result?.manifest?.schema?.columns) tableResult = response.query_result

  if (!text && sqlBlocks.length === 0 && !tableResult) {
    text = 'Genie non ha restituito una risposta.'
  }

  return { text, sqlBlocks, tableResult }
}

const EXAMPLE_PROMPTS = [
  'Qual è il reddito medio imponibile per i 10 comuni più popolosi d\'Italia?',
  'Mostrami la popolazione residente nei comuni della Lombardia.',
  'Quali comuni hanno il più alto tasso di veicoli ad alte emissioni ogni 100 abitanti?',
]

export function GenieChatWindow({ getValidToken }: GenieChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const isFirstMessage = useRef(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const emptyHeadingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSubmit(text: string) {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
    }
    const loadingId = `assistant-${Date.now()}`
    const loadingMessage: ChatMessage = {
      id: loadingId,
      role: 'assistant',
      text: '',
      isLoading: true,
    }

    setMessages(prev => [...prev, userMessage, loadingMessage])
    setIsLoading(true)

    try {
      const token = await getValidToken()
      const prependPrompt = isFirstMessage.current && systemPrompt.trim()
      const apiText = prependPrompt ? `${systemPrompt.trim()}\n${text}` : text
      isFirstMessage.current = false
      const { messageId, conversationId } = await genieService.sendMessage(apiText, token)
      const response = await genieService.pollMessage(conversationId, messageId, token)

      if (response.status === 'FAILED') {
        const errorText = response.error?.message ?? 'Genie ha restituito un errore. Riprova.'
        setMessages(prev =>
          prev.map(m => m.id === loadingId ? { ...m, isLoading: false, error: errorText } : m)
        )
      } else {
        const parsed = parseAttachments(response)
        console.log('[genie] parsed tableResult:', parsed.tableResult ? 'present' : 'none', 'attachments:', response.attachments?.length)
        const queryAttachment = !parsed.tableResult
          ? response.attachments?.find(
              a => 'query' in a && a.attachment_id && !a.query.query_result?.manifest?.schema?.columns?.length
            )
          : undefined
        console.log('[genie] queryAttachment found:', !!queryAttachment, queryAttachment && 'query' in queryAttachment ? queryAttachment.attachment_id : '-')
        if (queryAttachment && 'query' in queryAttachment) {
          const queryResult = await genieService.fetchQueryResult(conversationId, messageId, queryAttachment.attachment_id, token)
          if (queryResult) parsed.tableResult = queryResult
        }
        const { text: parsedText, sqlBlocks, tableResult } = parsed
        setMessages(prev =>
          prev.map(m =>
            m.id === loadingId
              ? { ...m, isLoading: false, text: parsedText, sqlBlocks, tableResult }
              : m
          )
        )
      }
    } catch (err) {
      const errorText = err instanceof Error ? err.message : 'Errore sconosciuto.'
      setMessages(prev =>
        prev.map(m => m.id === loadingId ? { ...m, isLoading: false, error: errorText } : m)
      )
    } finally {
      setIsLoading(false)
    }
  }

  function handleReset() {
    genieService.resetConversation()
    isFirstMessage.current = true
    setMessages([])
    // Restore focus to empty state heading on reset
    setTimeout(() => emptyHeadingRef.current?.focus(), 50)
  }

  const isEmpty = messages.length === 0

  return (
    <div className="genie-chat-window">
      {/* Compact header */}
      <div className="genie-header" role="banner">
        <div className="genie-header-identity">
          <div
            className={`genie-status-dot${isLoading ? ' genie-status-dot--loading' : ''}`}
            aria-hidden="true"
          />
          <span className="genie-header-wordmark">DataRoom</span>
          <span className="genie-header-sep" aria-hidden="true">·</span>
          <span className="genie-header-subtitle">Civiqa Analytics</span>
        </div>
        <button
          type="button"
          className="genie-reset-btn"
          aria-label="Avvia una nuova conversazione"
          onClick={handleReset}
          disabled={isLoading && messages.length === 0}
        >
          + Nuova conversazione
        </button>
      </div>

      {/* Empty state */}
      {isEmpty && (
        <div className="genie-empty-state">
          <h2
            className="genie-empty-heading"
            ref={emptyHeadingRef}
            tabIndex={-1}
          >
            Cosa vuoi <em>sapere</em>?
          </h2>
          <div className="genie-empty-prompts" role="list" aria-label="Domande di esempio">
            {EXAMPLE_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                type="button"
                className="genie-empty-prompt"
                role="listitem"
                aria-label={`Prova: ${prompt}`}
                onClick={() => handleSubmit(prompt)}
                disabled={isLoading}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Transcript */}
      {!isEmpty && (
        <div
          className="genie-messages-list"
          aria-live="polite"
          aria-label="Conversazione con Genie"
          role="log"
        >
          <GenieChatErrorBoundary>
            {messages.map(message => (
              <GenieMessageBubble key={message.id} message={message} />
            ))}
          </GenieChatErrorBoundary>
          <div ref={messagesEndRef} aria-hidden="true" />
        </div>
      )}

      {/* Command bar input */}
      <GenieInput
        onSubmit={handleSubmit}
        onReset={handleReset}
        isLoading={isLoading}
      />
    </div>
  )
}
