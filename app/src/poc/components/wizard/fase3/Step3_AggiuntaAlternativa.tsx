import { useId, useRef } from 'react'
import type { CSSProperties } from 'react'
import { useWizard } from '../../../hooks/useWizard'
import type { AlternativaId } from '../../../types/docfap'
import { useWizardNavigation } from '../WizardShell'

// ── Constants ─────────────────────────────────────────────────────────────────

const MAX_ALTERNATIVES = 5

const ALTERNATIVE_SEQUENCE: readonly AlternativaId[] = ['A1', 'A2', 'A3', 'A4', 'A5']

const ORDINAL_LABELS: readonly string[] = [
  'Prima', 'Seconda', 'Terza', 'Quarta', 'Quinta',
]

function getNextId(defined: AlternativaId[]): AlternativaId | null {
  const definedSet = new Set(defined)
  return ALTERNATIVE_SEQUENCE.find((id) => !definedSet.has(id)) ?? null
}

function getOrdinalLabel(id: AlternativaId): string {
  const idx = ALTERNATIVE_SEQUENCE.indexOf(id)
  return ORDINAL_LABELS[idx] ?? `${idx + 1}ª`
}

// ── Component ─────────────────────────────────────────────────────────────────

export function Step3_AggiuntaAlternativa() {
  const { state, setAlternativeDefinite, setAlternativeAggiuntaCompletata } = useWizard()
  const { goToNextPhase } = useWizardNavigation()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const tooltipId = useId()
  const groupId = useId()

  const { alternativeDefinite, alternativeAggiuntaCompletata } = state
  const nextId = getNextId(alternativeDefinite)
  const canAddMore = nextId !== null && alternativeDefinite.length < MAX_ALTERNATIVES
  const noDisabled = alternativeDefinite.length < 2

  // ── Handlers ────────────────────────────────────────────────────────────────

  /**
   * "Sì" — adds the next alternative to the store.
   *
   * Because `alternativeDefinite` grows by one, the parent (DocfapPage) rebuilds
   * Fase 3's substeps. New substeps for the next alternative are *inserted before*
   * the "Aggiungi?" substep, so the WizardShell's current substep index now
   * points to the new alternative's "Tipo" step — no explicit navigation needed.
   */
  const handleSi = () => {
    if (!canAddMore || !nextId) return
    setAlternativeAggiuntaCompletata(false)
    setAlternativeDefinite([...alternativeDefinite, nextId])
  }

  /**
   * "No" — marks Fase 3 as complete and immediately navigates to Fase 4.
   * This bypasses the standard "Avanti" button so the card acts as a direct action.
   */
  const handleNo = () => {
    if (noDisabled) return
    setAlternativeAggiuntaCompletata(true)
    goToNextPhase()
  }

  const nextOrdinal = nextId ? getOrdinalLabel(nextId).toLowerCase() : ''
  const currentCount = alternativeDefinite.length
  const noSubtitle = noDisabled
    ? 'Devi definire almeno 2 alternative per proseguire'
    : `${currentCount} ${currentCount === 1 ? 'alternativa definita' : 'alternative definite'} — avanza a Fase 4`

  return (
    <section style={sectionStyle}>
      <style>{focusStyle}</style>

      {/* Visually-hidden heading for screen readers */}
      <h2 ref={headingRef} tabIndex={-1} style={srOnlyStyle}>
        Vuoi aggiungere un&apos;altra alternativa?
      </h2>

      <fieldset style={fieldsetStyle}>
        <legend id={groupId} style={legendStyle}>
          Vuoi aggiungere un&apos;altra alternativa progettuale?
        </legend>

        <div
          role="radiogroup"
          aria-labelledby={groupId}
          style={cardsWrapStyle}
        >
          {/* ── Sì ── */}
          {canAddMore && (
            <button
              type="button"
              className="aggiungi-card"
              onClick={handleSi}
              style={cardButtonStyle(false)}
              aria-label={`Sì, aggiungo la ${nextOrdinal} alternativa (${nextId})`}
            >
              <span style={cardArrowStyle} aria-hidden="true">→</span>
              <span style={cardTitleStyle}>
                Sì, aggiungo un&apos;altra alternativa
              </span>
              <span style={cardSubtitleStyle}>
                Definisci la {nextOrdinal} alternativa ({nextId})
              </span>
            </button>
          )}

          {/* ── No ── */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="aggiungi-card"
              onClick={noDisabled ? undefined : handleNo}
              style={cardButtonStyle(alternativeAggiuntaCompletata, noDisabled)}
              aria-disabled={noDisabled ? 'true' : 'false'}
              aria-describedby={noDisabled ? tooltipId : undefined}
            >
              <span style={cardTitleStyle}>
                No, proseguo con queste alternative →
              </span>
              <span style={cardSubtitleStyle}>{noSubtitle}</span>
            </button>

            {/* Tooltip for SR + hover when "No" is disabled */}
            {noDisabled && (
              <span id={tooltipId} role="tooltip" style={tooltipStyle}>
                Devi definire almeno 2 alternative per proseguire
              </span>
            )}
          </div>
        </div>
      </fieldset>
    </section>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────

const focusStyle = `
  .aggiungi-card:focus-visible {
    outline: none;
    box-shadow: 0 0 0 1px rgba(110, 26, 255, 0.55);
  }
`

const sectionStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-l)',
}

const srOnlyStyle: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
  border: 0,
}

const fieldsetStyle: CSSProperties = {
  border: 'none',
  padding: 0,
  margin: 0,
}

const legendStyle: CSSProperties = {
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-heading-s-size, 22px)',
  fontWeight: 700,
  color: 'var(--color-text-primary)',
  marginBottom: 'var(--spacing-stack-m)',
  float: 'left',
  width: '100%',
}

const cardsWrapStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-m)',
  clear: 'left',
}

const cardButtonStyle = (selected: boolean, disabled = false): CSSProperties => ({
  display: 'grid',
  gap: 'var(--spacing-stack-xs)',
  width: '100%',
  padding: 'var(--spacing-inset-m, 24px)',
  textAlign: 'left',
  cursor: disabled ? 'not-allowed' : 'pointer',
  border: `2px solid ${selected
    ? 'var(--color-border-primary)'
    : disabled
      ? 'var(--color-border-disabled, #999999)'
      : 'var(--color-border-secondary-light)'}`,
  borderRadius: 'var(--radius-smooth)',
  background: selected
    ? 'var(--color-background-primary-lightest, #f0eeff)'
    : disabled
      ? 'var(--color-background-disable, #e7e7e7)'
      : 'var(--color-background-inverse)',
  color: disabled ? 'var(--color-text-disable)' : 'var(--color-text-primary)',
  pointerEvents: disabled ? 'none' : 'auto',
  transition: 'border-color 0.15s ease, background 0.15s ease',
})

const cardArrowStyle: CSSProperties = {
  fontSize: '1.5rem',
  lineHeight: 1,
  color: 'var(--color-text-primary)',
}

const cardTitleStyle: CSSProperties = {
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-s-size, 16px)',
  fontWeight: 700,
  color: 'inherit',
}

const cardSubtitleStyle: CSSProperties = {
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-xs-size, 14px)',
  fontWeight: 400,
  color: 'var(--color-text-primary-light)',
}

const tooltipStyle: CSSProperties = {
  position: 'absolute',
  bottom: 'calc(100% + 6px)',
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'var(--color-background-primary)',
  color: 'var(--color-text-inverse)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-xs-size, 14px)',
  padding: '6px 12px',
  borderRadius: 'var(--radius-smooth)',
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
  zIndex: 10,
}
