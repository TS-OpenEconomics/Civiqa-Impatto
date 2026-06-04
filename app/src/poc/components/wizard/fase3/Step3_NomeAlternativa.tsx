import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { INTERVENTION_CATEGORIES } from '../../../data/poc_docfap/intervention_categories_layer3'
import { useWizard } from '../../../hooks/useWizard'
import type { AlternativaId } from '../../../types/docfap'

type NamingAlternativaId = 'A1' | 'A2' | 'A3'

interface Step3NomeAlternativaProps {
  alternativaId: NamingAlternativaId
}

const TIPOLOGIA_LABELS: Record<string, string> = {
  nuova_realizzazione: 'Nuova realizzazione',
  ristrutturazione: 'Ristrutturazione',
  ristrutturazione_efficientamento: 'Ristrutturazione con efficientamento energetico',
  manutenzione_straordinaria_ee: 'Manutenzione straordinaria con EE',
  manutenzione_ordinaria: 'Manutenzione ordinaria',
  restauro: 'Restauro',
  recupero: 'Recupero',
  ampliamento_potenziamento: 'Ampliamento / potenziamento',
  ammodernamento_tecnologico: 'Ammodernamento tecnologico',
  demolizione: 'Demolizione',
  lavori_socialmente_utili: 'Lavori socialmente utili',
  altro: 'Altro',
}

function getAlternativaOrdinalLabel(alternativaId: NamingAlternativaId): string {
  return `Alternativa ${alternativaId.slice(1)}`
}

function buildDefaultName(categoria: string, tipologia: string): string {
  if (!categoria || !tipologia) return ''
  const catRecord = INTERVENTION_CATEGORIES.find(c => c.code === categoria)
  const catLabel = catRecord?.label ?? categoria
  const tipLabel = TIPOLOGIA_LABELS[tipologia] ?? tipologia
  return `${catLabel} — ${tipLabel}`
}

export function Step3_NomeAlternativa({ alternativaId }: Step3NomeAlternativaProps) {
  const { state, addAlternativa } = useWizard()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const inputId = useId()
  const helperId = useId()
  const errorId = useId()

  const current = state.alternative[alternativaId]
  const categoria = current?.categoria ?? ''
  const tipologia = current?.tipologia ?? ''
  const defaultName = buildDefaultName(categoria, tipologia)
  const savedName = current?.nome ?? ''

  // Treat saved name as auto-generated (and replaceable) if it's empty
  // or if it still uses the old raw-code format: "${categoria} — ${tipologia}"
  const oldStyleDefault = `${categoria} — ${tipologia}`
  const savedIsAuto = !savedName || savedName === oldStyleDefault

  const [inputValue, setInputValue] = useState<string>(savedIsAuto ? defaultName : savedName)
  const [touched, setTouched] = useState(false)

  // Refresh when categoria/tipologia change, as long as the user hasn't customised the name
  useEffect(() => {
    const currentOldStyle = `${categoria} — ${tipologia}`
    const currentIsAuto = !savedName || savedName === currentOldStyle
    if (currentIsAuto) {
      setInputValue(defaultName)
    }
  }, [defaultName, savedName, categoria, tipologia])

  // Move focus to heading on mount (WCAG: step change focus management)
  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  const isError = touched && inputValue.trim().length === 0

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleBlur = () => {
    setTouched(true)
    const trimmed = inputValue.trim()
    if (!trimmed) return

    // Persist into store — merge with current alternativa data (category/tipology already saved)
    const base = current ?? {
      categoria: '',
      tipologia: '',
      quantita: 0,
      capex: 0,
      opex: 0,
      nome: '',
    }
    addAlternativa(alternativaId as AlternativaId, { ...base, nome: trimmed })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
    }
  }

  const altLabel = getAlternativaOrdinalLabel(alternativaId)

  return (
    <section aria-labelledby="step-nome-heading" style={sectionStyle}>
      <style>{inputFocusStyle}</style>

      {/* Step heading */}
      <div style={headerStyle}>
        <h2
          id="step-nome-heading"
          ref={headingRef}
          tabIndex={-1}
          style={headingStyle}
        >
          Come vuoi chiamare questa alternativa?
        </h2>
        <p style={subtitleStyle}>
          Assegna un nome chiaro e distintivo all&apos;alternativa{' '}
          <strong>{altLabel}</strong>
        </p>
      </div>

      {/* Card */}
      <div
        role="group"
        aria-label={altLabel}
        style={cardStyle}
      >
        {/* Card header */}
        <div style={cardHeaderStyle}>
          <span style={cardBadgeStyle}>{altLabel}</span>
          <span style={cardSubheadStyle}>Dai un nome a questa alternativa</span>
        </div>

        {/* Card body */}
        <div style={cardBodyStyle}>
          {/* Pre-fill hint */}
          {categoria && tipologia && (
            <p style={hintStyle} aria-live="polite">
              Pre-compilato da:{' '}
              <span style={hintValueStyle}>{defaultName}</span>
            </p>
          )}

          {/* Input field — DS pattern */}
          <div
            className={
              isError
                ? 'input-field input-field--error'
                : 'input-field'
            }
          >
            <label
              htmlFor={inputId}
              className="input-field__label"
            >
              Nome alternativa
              <span aria-hidden="true" style={requiredMarkStyle}>{' *'}</span>
            </label>

            <div
              className="input-field__wrapper"
              style={isError ? { borderColor: 'var(--color-border-error)' } : undefined}
            >
              <input
                id={inputId}
                type="text"
                className="input-field__input"
                value={inputValue}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder={`es. "${defaultName || 'Nuova realizzazione asilo nido'}"`}
                maxLength={120}
                aria-required="true"
                aria-invalid={isError ? 'true' : 'false'}
                aria-describedby={`${helperId}${isError ? ` ${errorId}` : ''}`}
              />
            </div>

            {/* Error message */}
            {isError && (
              <span
                id={errorId}
                className="input-field__helper"
                role="alert"
                aria-live="assertive"
                style={{ color: 'var(--color-text-error)' }}
              >
                Il nome dell&apos;alternativa è obbligatorio
              </span>
            )}

            {/* Helper text */}
            <span
              id={helperId}
              className="input-field__helper"
            >
              Scegli un nome che la distingua chiaramente dalle altre. Max 120 caratteri.
            </span>
          </div>

          {/* Live preview of the label that will appear in the wizard */}
          {inputValue.trim() && (
            <div aria-live="polite" style={previewStyle}>
              <span style={previewLabelStyle}>Etichetta nel wizard:</span>
              <span style={previewValueStyle}>{inputValue.trim()}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────

const inputFocusStyle = `
  .input-field__wrapper:focus-within {
    box-shadow: 0 0 0 1px rgba(110, 26, 255, 0.55);
    outline: none;
  }
  .input-field__input {
    width: 100%;
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-family: var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif);
    font-size: var(--type-body-s-size, 16px);
    font-weight: 400;
    color: var(--color-text-primary-lighter, #6e6e6e);
  }
  .input-field__input:not(:placeholder-shown) {
    color: var(--color-text-primary, #000000);
  }
  .input-field {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-stack-xs, 8px);
    width: 100%;
  }
  .input-field__label {
    font-family: var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif);
    font-size: var(--type-body-s-size, 16px);
    font-weight: 700;
    line-height: 130%;
    color: var(--color-text-primary, #000000);
  }
  .input-field__wrapper {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 11px var(--spacing-inset-xs, 8px);
    background-color: var(--color-background-inverse, #ffffff);
    border: 1px solid var(--color-border-secondary, #545454);
    border-radius: var(--radius-smooth, 2px);
    gap: var(--spacing-inline-xs, 8px);
    box-sizing: border-box;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  .input-field:hover .input-field__wrapper {
    border-color: var(--color-border-secondary-hover, #2c2c2c);
  }
  .input-field--error .input-field__wrapper {
    border-color: var(--color-border-error, #cc0000);
  }
  .input-field__helper {
    font-family: var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif);
    font-size: var(--type-body-xs-size, 14px);
    font-weight: 400;
    line-height: 1.4;
    color: var(--color-text-primary-light, #545454);
  }
`

const sectionStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-l)',
}

const headerStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-xs)',
}

const headingStyle: CSSProperties = {
  margin: 0,
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-heading-m-size, 24px)',
  fontWeight: 700,
  color: 'var(--color-text-primary)',
  outline: 'none',
}

const subtitleStyle: CSSProperties = {
  margin: 0,
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-s-size, 16px)',
  color: 'var(--color-text-primary-light)',
}

const cardStyle: CSSProperties = {
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-inverse)',
}

const cardHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--spacing-inline-s)',
  padding: 'var(--spacing-inset-s)',
  borderBottom: '1px solid var(--color-border-secondary-light)',
}

const cardBadgeStyle: CSSProperties = {
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontWeight: 700,
  fontSize: 'var(--type-body-s-size, 16px)',
  color: 'var(--color-text-primary)',
  background: 'var(--color-background-secondary-lightest)',
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  padding: '2px var(--spacing-inline-xs, 8px)',
}

const cardSubheadStyle: CSSProperties = {
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-s-size, 16px)',
  fontWeight: 700,
  color: 'var(--color-text-primary)',
}

const cardBodyStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-m)',
  padding: 'var(--spacing-inset-s)',
}

const hintStyle: CSSProperties = {
  margin: 0,
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-xs-size, 14px)',
  color: 'var(--color-text-primary-light)',
}

const hintValueStyle: CSSProperties = {
  fontWeight: 700,
  color: 'var(--color-text-primary)',
}

const requiredMarkStyle: CSSProperties = {
  color: 'var(--color-text-error)',
  marginLeft: '2px',
}

const previewStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--spacing-inline-xs)',
  padding: 'var(--spacing-inset-xs)',
  background: 'var(--color-background-secondary-lightest)',
  borderRadius: 'var(--radius-smooth)',
  border: '1px solid var(--color-border-secondary-light)',
}

const previewLabelStyle: CSSProperties = {
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-xs-size, 14px)',
  color: 'var(--color-text-primary-light)',
  flexShrink: 0,
}

const previewValueStyle: CSSProperties = {
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-xs-size, 14px)',
  fontWeight: 700,
  color: 'var(--color-text-primary)',
}
