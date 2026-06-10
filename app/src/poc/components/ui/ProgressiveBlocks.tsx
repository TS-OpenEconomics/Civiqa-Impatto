import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'

export interface ProgressiveBlockDef {
  /** Identificatore stabile del blocco. */
  id: string
  /** Titolo del blocco (il numero viene aggiunto automaticamente). */
  title: string
  /** True quando i dati del blocco sono validi/completi. */
  complete: boolean
  /** Contenuto editabile del blocco. */
  children: ReactNode
  /** Riepilogo mostrato quando il blocco è completato e collassato. */
  summary?: ReactNode
}

interface ProgressiveBlocksProps {
  blocks: ProgressiveBlockDef[]
}

/**
 * Blocchi impilati con avanzamento esplicito:
 * - il blocco attivo (frontiera) resta aperto finché l'utente non preme
 *   "Conferma" — così eventuali campi condizionali o avvisi restano visibili e
 *   il blocco non si chiude da solo al primo click;
 * - i blocchi confermati collassano in una riga di recap con check + "Modifica";
 * - i blocchi successivi alla frontiera sono sbiaditi con un lucchetto.
 *
 * Usato in DOCFAP "Descrivi il Fabbisogno" (3 blocchi) e in Valutazione
 * "Anagrafica" (2 blocchi: anagrafica + stato).
 */
export function ProgressiveBlocks({ blocks }: ProgressiveBlocksProps) {
  // `step` = indice del blocco frontiera (attivo). I blocchi < step sono
  // confermati (recap), quelli > step sono bloccati. Inizializzato al primo
  // blocco incompleto (o a "tutti confermati" se già tutti completi: autofill).
  const [step, setStep] = useState(() => {
    const firstIncomplete = blocks.findIndex((b) => !b.complete)
    return firstIncomplete === -1 ? blocks.length : firstIncomplete
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  return (
    <div style={listStyle}>
      <style>{INTERACTIVE_STYLES}</style>
      {blocks.map((block, index) => {
        const number = index + 1
        const isEditing = editingId === block.id
        const locked = index > step && !isEditing

        if (locked) {
          return <LockedBlock key={block.id} number={number} title={block.title} />
        }

        const expanded = index === step || isEditing

        if (!expanded) {
          return (
            <CompletedBlock
              key={block.id}
              number={number}
              title={block.title}
              summary={block.summary}
              onEdit={() => setEditingId(block.id)}
            />
          )
        }

        return (
          <ActiveBlock
            key={block.id}
            number={number}
            title={block.title}
            complete={block.complete}
            onConfirm={() => {
              if (isEditing) {
                setEditingId(null)
              } else {
                setStep((s) => Math.min(s + 1, blocks.length))
              }
            }}
          >
            {block.children}
          </ActiveBlock>
        )
      })}
    </div>
  )
}

function NumberBadge({ children, variant }: { children: ReactNode; variant: 'active' | 'done' | 'locked' }) {
  return (
    <span
      aria-hidden="true"
      style={{
        ...badgeStyle,
        ...(variant === 'active' ? badgeActiveStyle : null),
        ...(variant === 'done' ? badgeDoneStyle : null),
        ...(variant === 'locked' ? badgeLockedStyle : null),
      }}
    >
      {children}
    </span>
  )
}

function ActiveBlock({
  number,
  title,
  complete,
  onConfirm,
  children,
}: {
  number: number
  title: string
  complete: boolean
  onConfirm: () => void
  children: ReactNode
}) {
  return (
    <section style={{ ...cardStyle, ...cardActiveStyle }}>
      <header style={headerStyle}>
        <NumberBadge variant="active">{number}</NumberBadge>
        <h2 style={titleStyle}>{title}</h2>
      </header>
      <div style={bodyStyle}>{children}</div>
      <div style={footerStyle}>
        <button
          type="button"
          className="pb-interactive"
          style={{ ...confirmButtonStyle, ...(complete ? null : confirmButtonDisabledStyle) }}
          onClick={onConfirm}
          disabled={!complete}
        >
          Conferma
        </button>
      </div>
    </section>
  )
}

function CompletedBlock({
  number,
  title,
  summary,
  onEdit,
}: {
  number: number
  title: string
  summary?: ReactNode
  onEdit: () => void
}) {
  return (
    <section style={{ ...cardStyle, ...cardDoneStyle }}>
      <div style={recapRowStyle}>
        <NumberBadge variant="done">
          <CheckIcon />
        </NumberBadge>
        <div style={recapTextStyle}>
          <span style={recapTitleStyle}>{title}</span>
          {summary ? <span style={recapSummaryStyle}>{summary}</span> : null}
        </div>
        <button type="button" className="pb-interactive" style={editButtonStyle} onClick={onEdit}>
          <PencilIcon />
          Modifica
        </button>
      </div>
    </section>
  )
}

function LockedBlock({ number, title }: { number: number; title: string }) {
  return (
    <section style={{ ...cardStyle, ...cardLockedStyle }} aria-disabled="true">
      <div style={lockedRowStyle}>
        <NumberBadge variant="locked">{number}</NumberBadge>
        <span style={lockedTitleStyle}>{title}</span>
        <span style={lockIconWrapStyle} aria-hidden="true">
          <LockIcon />
        </span>
      </div>
    </section>
  )
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12.5l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 20h4l10-10-4-4L4 16v4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M13.5 6.5l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 10V7a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

const INTERACTIVE_STYLES = `
  .pb-interactive:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--color-border-focus);
  }
`

const listStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-s)',
}

const cardStyle: CSSProperties = {
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-inverse)',
  overflow: 'hidden',
}

const cardActiveStyle: CSSProperties = {
  borderColor: 'var(--color-border-primary-light)',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
}

const cardDoneStyle: CSSProperties = {}

const cardLockedStyle: CSSProperties = {
  background: 'var(--color-background-secondary-lightest, var(--color-background-inverse))',
  opacity: 0.55,
}

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--spacing-inline-xs)',
  padding: 'var(--spacing-inset-s) var(--spacing-inset-s) 0',
}

const titleStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-m-size, 18px)',
  fontWeight: 'var(--type-weight-bold, 700)',
}

const bodyStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-s)',
  padding: 'var(--spacing-inset-s)',
}

const footerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '0 var(--spacing-inset-s) var(--spacing-inset-s)',
}

const recapRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--spacing-inline-xs)',
  padding: 'var(--spacing-inset-s)',
}

const recapTextStyle: CSSProperties = {
  display: 'grid',
  gap: '2px',
  flex: 1,
  minWidth: 0,
}

const recapTitleStyle: CSSProperties = {
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-s-size, 16px)',
  fontWeight: 'var(--type-weight-bold, 700)',
}

const recapSummaryStyle: CSSProperties = {
  color: 'var(--color-text-primary-light)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-xs-size, 14px)',
  lineHeight: 1.4,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}

const lockedRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--spacing-inline-xs)',
  padding: 'var(--spacing-inset-s)',
}

const lockedTitleStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  color: 'var(--color-text-primary-light)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-s-size, 16px)',
  fontWeight: 'var(--type-weight-medium, 500)',
}

const lockIconWrapStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--color-text-primary-light)',
}

const badgeStyle: CSSProperties = {
  flexShrink: 0,
  width: '28px',
  height: '28px',
  aspectRatio: '1 / 1',
  borderRadius: '999px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-xs-size, 14px)',
  fontWeight: 'var(--type-weight-bold, 700)',
  boxSizing: 'border-box',
}

const badgeActiveStyle: CSSProperties = {
  background: 'var(--color-background-primary)',
  color: 'var(--color-text-inverse)',
}

const badgeDoneStyle: CSSProperties = {
  background: 'var(--color-background-primary)',
  color: 'var(--color-text-inverse)',
}

const badgeLockedStyle: CSSProperties = {
  background: 'var(--color-background-disable, var(--color-border-secondary-light))',
  color: 'var(--color-text-primary-light)',
}

const buttonBaseStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-xs-size, 14px)',
  fontWeight: 'var(--type-weight-bold, 700)',
  borderRadius: 'var(--radius-smooth)',
  padding: '8px 16px',
}

const editButtonStyle: CSSProperties = {
  ...buttonBaseStyle,
  flexShrink: 0,
  border: '1px solid var(--color-border-secondary-light)',
  background: 'var(--color-background-inverse)',
  color: 'var(--color-text-primary)',
}

const confirmButtonStyle: CSSProperties = {
  ...buttonBaseStyle,
  border: '1px solid var(--color-background-primary)',
  background: 'var(--color-background-primary)',
  color: 'var(--color-text-inverse)',
}

const confirmButtonDisabledStyle: CSSProperties = {
  cursor: 'not-allowed',
  border: '1px solid var(--color-background-disable, var(--color-border-secondary-light))',
  background: 'var(--color-background-disable, var(--color-border-secondary-light))',
  color: 'var(--color-text-disable, var(--color-text-primary-light))',
}
