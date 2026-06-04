import React, { useRef } from 'react'

interface GenieInputProps {
  onSubmit: (text: string) => void
  onReset: () => void
  isLoading: boolean
}

export function GenieInput({ onSubmit, isLoading }: GenieInputProps): React.ReactElement {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (): void => {
    const value = textareaRef.current?.value ?? ''
    if (value.trim() === '') return
    onSubmit(value)
    if (textareaRef.current) {
      textareaRef.current.value = ''
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!isLoading) {
        handleSubmit()
      }
    }
  }

  return (
    <div className="genie-input-bar">
      <div className="genie-input-row">
        <span className="genie-input-prompt" aria-hidden="true">›</span>
        <textarea
          ref={textareaRef}
          className="genie-input-textarea"
          aria-label="Scrivi un messaggio a Genie"
          aria-multiline="true"
          rows={3}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          autoFocus
          placeholder={
            isLoading
              ? 'Elaborazione in corso…'
              : 'Fai una domanda sui tuoi dati…'
          }
        />
        <button
          type="button"
          className="genie-send-btn"
          aria-label="Invia messaggio"
          aria-disabled={isLoading}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          <svg
            className="genie-send-icon"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 8H14M14 8L9 3M14 8L9 13"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <div className="genie-input-hint" aria-hidden="true">
        <span className="genie-input-hint-text">Invio per inviare</span>
        <span className="genie-input-hint-sep">·</span>
        <span className="genie-input-hint-text">Shift+Invio per nuova riga</span>
      </div>
    </div>
  )
}
