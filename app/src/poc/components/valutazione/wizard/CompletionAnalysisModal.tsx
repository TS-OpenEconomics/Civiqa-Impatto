import type { CSSProperties } from 'react'

type AnalysisChoice = 'EIA' | 'ECBA'

interface Props {
  choice: AnalysisChoice
  onClose: () => void
  onSingle: () => void
  onDual: () => void
}

function IconArrowRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconClose() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M5 5l8 8M13 5l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function CompletionAnalysisModal({ choice, onClose, onSingle, onDual }: Props) {
  const chosenLabel = choice === 'EIA' ? "un'Analisi di Impatto" : 'un’Analisi Costi-Benefici'
  const pairedLabel = choice === 'EIA' ? 'un’Analisi Costi-Benefici' : "un'Analisi di Impatto"

  return (
    <div style={overlayStyle} role="presentation">
      <div role="dialog" aria-modal="true" aria-labelledby="completion-analysis-modal-title" style={dialogStyle}>
        <div style={headerStyle}>
          <h2 id="completion-analysis-modal-title" style={titleStyle}>
            Vuoi eseguire più analisi contemporaneamente?
          </h2>
          <button type="button" onClick={onClose} style={closeButtonStyle}>
            <span>Chiudi</span>
            <IconClose />
          </button>
        </div>

        <div style={bodyStyle}>
          <p style={bodyTextStyle}>
            Hai scelto di eseguire {chosenLabel}. Vorresti eseguire contestualmente anche {pairedLabel}? Le informazioni
            richieste sono le medesime: <strong>con una sola configurazione, potresti ottenere i risultati di due analisi!</strong>
          </p>
        </div>

        <div style={actionsStyle}>
          <button type="button" onClick={onSingle} style={secondaryActionStyle}>
            <span>Esegui solo l’analisi scelta</span>
            <IconClose />
          </button>
          <button type="button" onClick={onDual} style={primaryActionStyle}>
            <span>Esegui entrambe le Analisi</span>
            <IconArrowRight />
          </button>
        </div>
      </div>
    </div>
  )
}

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 260,
  background: 'rgba(12, 10, 22, 0.28)',
  display: 'grid',
  placeItems: 'center',
  padding: '20px',
}

const dialogStyle: CSSProperties = {
  width: 'min(700px, 100%)',
  background: 'var(--color-background-inverse)',
  border: '1px solid var(--color-border-secondary-light)',
  boxShadow: '0 18px 56px rgba(0, 0, 0, 0.16)',
}

const headerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '14px',
  padding: '18px 22px 0',
}

const titleStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary)',
  fontSize: '28px',
  lineHeight: 1.04,
  fontWeight: 700,
  maxWidth: '420px',
}

const closeButtonStyle: CSSProperties = {
  border: 'none',
  background: 'transparent',
  color: 'var(--color-text-secondary)',
  fontSize: '14px',
  fontWeight: 500,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  padding: 0,
}

const bodyStyle: CSSProperties = {
  padding: '18px 22px 22px',
}

const bodyTextStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-text-primary)',
  fontSize: '14px',
  lineHeight: 1.45,
  maxWidth: '620px',
}

const actionsStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  minHeight: '52px',
}

const actionBaseStyle: CSSProperties = {
  border: 'none',
  padding: '0 16px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '10px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 500,
}

const secondaryActionStyle: CSSProperties = {
  ...actionBaseStyle,
  background: '#5d5d5d',
  color: '#ffffff',
}

const primaryActionStyle: CSSProperties = {
  ...actionBaseStyle,
  background: 'var(--color-background-primary)',
  color: 'var(--color-text-inverse)',
}
