import type { ReactNode } from 'react'
import type { QueryResult } from '../../services/genieService'
import { GenieChart } from './GenieChart'
import { GenieQueryTable } from './GenieQueryTable'

function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}

function renderMarkdown(text: string): ReactNode {
  const blocks = text.split(/\n{2,}/)
  return (
    <div className="genie-assistant-content">
      {blocks.map((block, bi) => {
        const lines = block.split('\n')
        const isList = lines.some(l => /^[-*]\s/.test(l.trim()))
        if (isList) {
          const items = lines.filter(l => l.trim() !== '')
          return (
            <ul key={bi}>
              {items.map((line, li) => {
                const clean = line.trim().replace(/^[-*]\s/, '')
                return <li key={li}>{renderInline(clean)}</li>
              })}
            </ul>
          )
        }
        return <p key={bi}>{renderInline(block.trim())}</p>
      })}
    </div>
  )
}

export interface SqlBlock {
  description: string
  query: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  sqlBlocks?: SqlBlock[]
  tableResult?: QueryResult
  isLoading?: boolean
  error?: string
}

interface GenieMessageBubbleProps {
  message: ChatMessage
}

export function GenieMessageBubble({ message }: GenieMessageBubbleProps) {
  const { role, text, sqlBlocks, tableResult, isLoading, error } = message

  return (
    <div className={`genie-entry genie-entry--${role}`}>
      {/* Attribution label row */}
      <div className="genie-entry-label" aria-hidden="true">
        <span className={`genie-entry-label-dot genie-entry-label-dot--${role}`} />
        <span className={`genie-entry-label-text genie-entry-label-text--${role}`}>
          {role === 'user' ? 'Tu' : 'DataRoom'}
        </span>
      </div>

      {/* Content */}
      {role === 'user' ? (
        <div className="genie-entry-body--user" aria-label="Il tuo messaggio">
          <p>{text}</p>
        </div>
      ) : (
        <div
          className="genie-entry-body--assistant"
          role="article"
          aria-label="Risposta di Genie"
        >
          {isLoading ? (
            <div
              className="genie-loading-state"
              aria-label="Genie sta elaborando la risposta"
              aria-live="polite"
            >
              <div className="genie-loading-bar-track" aria-hidden="true">
                <div className="genie-loading-bar-fill" />
              </div>
              <span className="genie-loading-text">Elaborazione in corso…</span>
            </div>
          ) : error ? (
            <p className="genie-error-message" role="alert">
              <span aria-hidden="true">⚠</span> {error}
            </p>
          ) : (
            <>
              {text.length > 0 && renderMarkdown(text)}

              {sqlBlocks?.map((block, index) => (
                <details key={index} className="genie-sql-block">
                  <summary>
                    <span className="genie-sql-label-tag">SQL</span>
                    <span className="genie-sql-description">
                      {block.description || 'Visualizza query'}
                    </span>
                    <span className="genie-sql-chevron" aria-hidden="true">›</span>
                  </summary>
                  <pre>
                    <code>{block.query}</code>
                  </pre>
                </details>
              ))}

              {tableResult !== undefined && (
                <>
                  <GenieChart
                    result={tableResult}
                    title={sqlBlocks?.[0]?.description || undefined}
                  />
                  <GenieQueryTable result={tableResult} />
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
