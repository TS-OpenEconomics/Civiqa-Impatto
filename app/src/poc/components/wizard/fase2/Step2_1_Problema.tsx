import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { NEEDS_DOCFAP } from '../../../data/poc_docfap/fabbisogni_v2'
import { useWizard } from '../../../hooks/useWizard'
import { InputField } from '../../ui/InputField'
import { RadioGroup } from '../../ui/RadioGroup'
import { Textarea } from '../../ui/Textarea'

const PROBLEMA_DOCUMENTATO_OPTIONS = [
  { value: 'si', label: 'Sì', hint: 'Documentato in atti ufficiali' },
  { value: 'parzialmente', label: 'Parzialmente', hint: 'Evidenza parziale' },
  { value: 'no', label: 'No', hint: 'Non ancora documentato' },
]

const URGENZA_OPTIONS = [
  { value: 'Emergenziale (entro 12 mesi)', label: 'Emergenziale (entro 12 mesi)' },
  { value: 'Breve termine (1-3 anni)', label: 'Breve termine (1-3 anni)' },
  { value: 'Medio termine (3-5 anni)', label: 'Medio termine (3-5 anni)' },
  { value: 'Strutturale/programmato', label: 'Strutturale/programmato' },
]

const EMERGENZA_VALUE = 'Emergenziale (entro 12 mesi)'

function DocCircle({
  selected,
  label,
  hint,
  onSelect,
}: {
  selected: boolean
  label: string
  hint: string
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className="problema-interactive"
      style={{ ...docCircleCardStyle, ...(selected ? docCircleCardSelectedStyle : null) }}
    >
      <span className="docfap-option-indicator" aria-hidden="true" style={{ ...docCircleStyle, ...(selected ? docCircleSelectedStyle : null) }}>
        {selected ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M5 12.5l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : null}
      </span>
      <span style={docCircleLabelStyle}>{label}</span>
      <span style={docCircleHintStyle}>{hint}</span>
    </button>
  )
}

export function Step2_1_Problema() {
  const { state, setProblema, setUrgenza } = useWizard()
  const [touchedDescrizione, setTouchedDescrizione] = useState(false)
  const [touchedUrgenza, setTouchedUrgenza] = useState(false)

  const fabDescrizione = useMemo(() => {
    if (!state.fabId) return ''
    return NEEDS_DOCFAP.find((n) => n.code === state.fabId)?.description ?? ''
  }, [state.fabId])

  const descrizioneError =
    touchedDescrizione && state.problema.descrizione.trim().length === 0
      ? 'La descrizione del fabbisogno è obbligatoria.'
      : undefined

  const urgenzaError =
    touchedUrgenza && state.urgenza.trim().length === 0
      ? 'Seleziona il livello di urgenza.'
      : undefined

  const showRiferimentoAtto =
    state.problema.documentato === 'si' || state.problema.documentato === 'parzialmente'
  const showAlert = state.urgenza === EMERGENZA_VALUE

  return (
    <div style={rootStyle}>
      <style>{`
        .problema-interactive:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px var(--color-border-focus);
        }
      `}</style>

      {/* Descrizione del fabbisogno — singolo grande box */}
      <Textarea
        label="Descrizione del fabbisogno"
        value={state.problema.descrizione}
        onChange={(value) => {
          setTouchedDescrizione(true)
          setProblema({ descrizione: value })
        }}
        required
        maxLength={600}
        rows={6}
        placeholder={fabDescrizione ? `Es. criticità legate a ${fabDescrizione}` : 'Descrivi il fabbisogno'}
        helperText={
          fabDescrizione
            ? `Contesto fabbisogno selezionato: ${fabDescrizione}`
            : 'Inserisci una descrizione chiara del fabbisogno.'
        }
        errorText={descrizioneError}
      />

      {/* Documentazione ufficiale — tre cerchi */}
      <fieldset style={fieldsetStyle}>
        <legend style={legendStyle}>Fabbisogno documentato in atti ufficiali?</legend>
        <div style={docCirclesRowStyle}>
          {PROBLEMA_DOCUMENTATO_OPTIONS.map((opt) => (
            <DocCircle
              key={opt.value}
              selected={state.problema.documentato === opt.value}
              label={opt.label}
              hint={opt.hint}
              onSelect={() =>
                setProblema({
                  documentato: opt.value,
                  riferimentoAtto:
                    opt.value === 'si' || opt.value === 'parzialmente' ? state.problema.riferimentoAtto : '',
                })
              }
            />
          ))}
        </div>

        {showRiferimentoAtto && (
          <div style={riferimentoWrapStyle}>
            <InputField
              label="Riferimento delibera/atto"
              value={state.problema.riferimentoAtto ?? ''}
              onChange={(value) => setProblema({ riferimentoAtto: value })}
              placeholder="Delibera, determina o altro riferimento (opzionale)"
            />
          </div>
        )}
      </fieldset>

      {/* Urgenza */}
      <fieldset style={fieldsetStyle}>
        <RadioGroup
          legend="Urgenza dell'intervento"
          options={URGENZA_OPTIONS}
          value={state.urgenza}
          onChange={(value) => {
            setTouchedUrgenza(true)
            setUrgenza(value)
          }}
          required
          errorText={urgenzaError}
        />

        {showAlert && (
          <div role="alert" aria-live="assertive" style={alertStyle}>
            Verificare compatibilità con procedure ordinarie D.Lgs. 36/2023 art. 140 e seguenti
          </div>
        )}
      </fieldset>
    </div>
  )
}

const rootStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-m)',
  maxWidth: '920px',
}

const fieldsetStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-s)',
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-inverse)',
  padding: 'var(--spacing-inset-m)',
  margin: 0,
}

const legendStyle: CSSProperties = {
  padding: 0,
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-s-size, 16px)',
  fontWeight: 700,
}

const docCirclesRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: 'var(--spacing-inline-s)',
}

const docCircleCardStyle: CSSProperties = {
  display: 'grid',
  justifyItems: 'center',
  gap: '6px',
  padding: 'var(--spacing-inset-s)',
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-inverse)',
  cursor: 'pointer',
  textAlign: 'center',
}

const docCircleCardSelectedStyle: CSSProperties = {
  borderColor: 'var(--color-border-primary)',
  background: 'var(--color-background-primary-lighter)',
}

const docCircleStyle: CSSProperties = {
  width: '44px',
  height: '44px',
  borderRadius: '50%',
  border: '2px solid var(--color-border-secondary)',
  background: 'var(--color-background-inverse)',
  color: 'var(--color-text-inverse)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const docCircleSelectedStyle: CSSProperties = {
  borderColor: 'var(--color-background-primary)',
  background: 'var(--color-background-primary)',
}

const docCircleLabelStyle: CSSProperties = {
  color: 'var(--color-text-primary)',
  fontWeight: 700,
  fontSize: 'var(--type-body-s-size, 16px)',
}

const docCircleHintStyle: CSSProperties = {
  color: 'var(--color-text-primary-light)',
  fontSize: 'var(--type-body-xs-size, 13px)',
  lineHeight: 1.3,
}

const riferimentoWrapStyle: CSSProperties = {
  display: 'grid',
}

const alertStyle: CSSProperties = {
  padding: 'var(--spacing-inset-s)',
  borderRadius: 'var(--radius-smooth)',
  border: '1px solid var(--color-border-warning)',
  background: 'var(--color-background-warning-lightest, var(--color-background-inverse))',
  color: 'var(--color-text-warning)',
  fontWeight: 700,
}
