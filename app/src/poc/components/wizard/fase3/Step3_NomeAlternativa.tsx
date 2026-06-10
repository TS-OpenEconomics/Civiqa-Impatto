import { useEffect, useId, useState } from 'react'
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

function buildDefaultName(categoria: string, tipologia: string): string {
  if (!categoria || !tipologia) return ''
  const catRecord = INTERVENTION_CATEGORIES.find((c) => c.code === categoria)
  const catLabel = catRecord?.label ?? categoria
  const tipLabel = TIPOLOGIA_LABELS[tipologia] ?? tipologia
  return `${catLabel} — ${tipLabel}`
}

export function Step3_NomeAlternativa({ alternativaId }: Step3NomeAlternativaProps) {
  const { state, addAlternativa } = useWizard()
  const inputId = useId()
  const helperId = useId()
  const errorId = useId()

  const current = state.alternative[alternativaId]
  const categoria = current?.categoria ?? ''
  const tipologia = current?.tipologia ?? ''
  const defaultName = buildDefaultName(categoria, tipologia)
  const savedName = current?.nome ?? ''

  // Treat the saved name as auto-generated (and replaceable) when empty or
  // when it still uses the old raw-code format "${categoria} — ${tipologia}".
  const oldStyleDefault = `${categoria} — ${tipologia}`
  const savedIsAuto = !savedName || savedName === oldStyleDefault

  const [inputValue, setInputValue] = useState<string>(savedIsAuto ? defaultName : savedName)
  const [touched, setTouched] = useState(false)

  const save = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return
    const base = current ?? { categoria: '', tipologia: '', quantita: 0, capex: 0, opex: 0, nome: '' }
    addAlternativa(alternativaId as AlternativaId, { ...base, nome: trimmed })
  }

  // Refresh the suggestion when categoria/tipologia change, unless the user customised it.
  // Salva subito il nome suggerito nello store così il blocco "Nome" risulta completo
  // senza dover sfocare il campo.
  useEffect(() => {
    const currentOldStyle = `${categoria} — ${tipologia}`
    const currentIsAuto = !savedName || savedName === currentOldStyle
    if (currentIsAuto && defaultName) {
      setInputValue(defaultName)
      save(defaultName)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultName, savedName, categoria, tipologia])

  const isError = touched && inputValue.trim().length === 0

  const handleBlur = () => {
    setTouched(true)
    save(inputValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') e.currentTarget.blur()
  }

  return (
    <div style={rootStyle}>
      <style>{fieldStyles}</style>

      <div className={isError ? 'nome-field nome-field--error' : 'nome-field'}>
        <label htmlFor={inputId} className="nome-field__label">
          Nome alternativa
          <span aria-hidden="true" style={requiredMarkStyle}>{' *'}</span>
        </label>

        <div className="nome-field__wrapper">
          <input
            id={inputId}
            type="text"
            className="nome-field__input"
            value={inputValue}
            onChange={(e) => { setInputValue(e.target.value); save(e.target.value) }}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={`es. "${defaultName || 'Nuova realizzazione asilo nido'}"`}
            maxLength={120}
            aria-required="true"
            aria-invalid={isError ? 'true' : 'false'}
            aria-describedby={`${helperId}${isError ? ` ${errorId}` : ''}`}
          />
        </div>

        {isError ? (
          <span id={errorId} className="nome-field__helper nome-field__helper--error" role="alert">
            Il nome dell&apos;alternativa è obbligatorio
          </span>
        ) : (
          <span id={helperId} className="nome-field__helper">
            {defaultName
              ? `Suggerito da categoria e tipologia. Modificalo se preferisci un nome più riconoscibile (max 120 caratteri).`
              : 'Scegli un nome che la distingua chiaramente dalle altre (max 120 caratteri).'}
          </span>
        )}
      </div>
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────

const fieldStyles = `
  .nome-field { display: flex; flex-direction: column; gap: var(--spacing-stack-xs, 8px); max-width: 560px; }
  .nome-field__label {
    font-family: var(--font-family-1, sans-serif);
    font-size: var(--type-body-s-size, 14px);
    font-weight: 700;
    line-height: 1.3;
    color: var(--color-text-primary);
  }
  .nome-field__wrapper {
    display: flex;
    align-items: center;
    height: 44px;
    padding: 0 var(--spacing-inset-xs, 8px);
    background: var(--color-background-inverse, #fff);
    border: 1px solid var(--color-border-secondary, #545454);
    border-radius: var(--radius-smooth, 2px);
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  .nome-field__wrapper:focus-within {
    border-color: var(--color-border-primary);
    box-shadow: 0 0 0 1px var(--color-border-primary);
    outline: none;
  }
  .nome-field--error .nome-field__wrapper { border-color: var(--color-border-error, #cc0000); }
  .nome-field__input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-family: var(--font-family-1, sans-serif);
    font-size: var(--type-body-m-size, 15px);
    color: var(--color-text-primary, #000);
  }
  .nome-field__helper {
    font-family: var(--font-family-1, sans-serif);
    font-size: var(--type-body-xs-size, 13px);
    line-height: 1.4;
    color: var(--color-text-primary-light, #545454);
  }
  .nome-field__helper--error { color: var(--color-text-error, #cc0000); }
`

const rootStyle: CSSProperties = { display: 'grid', gap: 'var(--spacing-stack-s)' }

const requiredMarkStyle: CSSProperties = { color: 'var(--color-text-error)', marginLeft: '2px' }
