import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { NEEDS_DOCFAP } from '../../../data/poc_docfap/fabbisogni_v2'
import { useWizard } from '../../../hooks/useWizard'
import { InputField } from '../../ui/InputField'
import { RadioGroup } from '../../ui/RadioGroup'
import { Textarea } from '../../ui/Textarea'

const PROBLEMA_DOCUMENTATO_OPTIONS = [
  { value: 'si', label: 'Si' },
  { value: 'parzialmente', label: 'Parzialmente' },
  { value: 'no', label: 'No' },
]

const URGENZA_OPTIONS = [
  { value: 'Emergenziale (entro 12 mesi)', label: 'Emergenziale (entro 12 mesi)' },
  { value: 'Breve termine (1-3 anni)', label: 'Breve termine (1-3 anni)' },
  { value: 'Medio termine (3-5 anni)', label: 'Medio termine (3-5 anni)' },
  { value: 'Strutturale/programmato', label: 'Strutturale/programmato' },
]

const EMERGENZA_VALUE = 'Emergenziale (entro 12 mesi)'

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
      ? 'La descrizione del fabbisogno e obbligatoria.'
      : undefined

  const urgenzaError =
    touchedUrgenza && state.urgenza.trim().length === 0
      ? "Seleziona il livello di urgenza."
      : undefined

  const showRiferimentoAtto =
    state.problema.documentato === 'si' || state.problema.documentato === 'parzialmente'
  const showAlert = state.urgenza === EMERGENZA_VALUE

  return (
    <div style={rootStyle}>
      <style>{`
        .step2-fabbisogno-grid {
          display: grid;
          gap: var(--spacing-stack-s);
        }
        @media (min-width: 1200px) {
          .step2-fabbisogno-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            align-items: stretch;
          }
        }
      `}</style>

      <div className="step2-fabbisogno-grid" style={detailGridStyle}>
        <section style={sectionCardStyle}>
          <Textarea
            label="Descrizione del fabbisogno"
            value={state.problema.descrizione}
            onChange={(value) => {
              setTouchedDescrizione(true)
              setProblema({ descrizione: value })
            }}
            required
            maxLength={600}
            rows={4}
            placeholder={fabDescrizione ? `Es. criticita legate a ${fabDescrizione}` : 'Descrivi il fabbisogno'}
            helperText={
              fabDescrizione
                ? `Contesto fabbisogno selezionato: ${fabDescrizione}`
                : 'Inserisci una descrizione chiara del fabbisogno.'
            }
            errorText={descrizioneError}
          />
        </section>

        <section style={sectionCardStyle}>
          <RadioGroup
            legend="Fabbisogno documentato in atti ufficiali?"
            options={PROBLEMA_DOCUMENTATO_OPTIONS}
            value={state.problema.documentato}
            onChange={(value) => {
              setProblema({
                documentato: value,
                riferimentoAtto:
                  value === 'si' || value === 'parzialmente' ? state.problema.riferimentoAtto : '',
              })
            }}
          />

          {showRiferimentoAtto && (
            <InputField
              label="Riferimento delibera/atto"
              value={state.problema.riferimentoAtto ?? ''}
              onChange={(value) => setProblema({ riferimentoAtto: value })}
              placeholder="Delibera, determina o altro riferimento (opzionale)"
            />
          )}
        </section>

        <section style={sectionCardStyle}>
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
              Verificare compatibilita con procedure ordinarie D.Lgs. 36/2023 art. 140 e seguenti
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

const rootStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-s)',
}

const detailGridStyle: CSSProperties = {
  alignItems: 'stretch',
}

const sectionCardStyle: CSSProperties = {
  display: 'grid',
  alignContent: 'start',
  gap: 'var(--spacing-stack-s)',
  padding: 'var(--spacing-inset-s)',
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  background: 'var(--color-background-inverse)',
  minHeight: '100%',
}

const alertStyle: CSSProperties = {
  padding: 'var(--spacing-inset-s)',
  borderRadius: 'var(--radius-smooth)',
  border: '1px solid var(--color-border-warning)',
  background: 'var(--color-background-warning-lightest, var(--color-background-inverse))',
  color: 'var(--color-text-warning)',
  fontWeight: 700,
}
