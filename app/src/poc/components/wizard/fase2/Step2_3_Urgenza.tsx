import type { CSSProperties } from 'react'
import { useState } from 'react'
import { CheckboxGroup } from '../../ui/CheckboxGroup'
import { RadioGroup } from '../../ui/RadioGroup'
import { useWizard } from '../../../hooks/useWizard'

const URGENZA_OPTIONS = [
  { value: 'Emergenziale (entro 12 mesi)', label: 'Emergenziale (entro 12 mesi)' },
  { value: 'Breve termine (1-3 anni)', label: 'Breve termine (1-3 anni)' },
  { value: 'Medio termine (3-5 anni)', label: 'Medio termine (3-5 anni)' },
  { value: 'Strutturale/programmato', label: 'Strutturale/programmato' },
]

const FATTORI_OPTIONS = [
  { value: 'Obsolescenza patrimonio', label: 'Obsolescenza patrimonio' },
  { value: 'Variazione normativa standard', label: 'Variazione normativa standard' },
  { value: 'Cambiamento demografico', label: 'Cambiamento demografico' },
  {
    value: 'Riduzione servizi privati sostitutivi',
    label: 'Riduzione servizi privati sostitutivi',
  },
  { value: 'Rischio sismico o climatico', label: 'Rischio sismico o climatico' },
]

const EMERGENZA_VALUE = 'Emergenziale (entro 12 mesi)'

export function Step2_3_Urgenza() {
  const { state, setUrgenza, setFattoriAggravamento } = useWizard()
  const [touched, setTouched] = useState(false)

  const urgenzaError =
    touched && state.urgenza.trim().length === 0 ? "Seleziona il livello di urgenza." : undefined

  const showAlert = state.urgenza === EMERGENZA_VALUE

  return (
    <div style={rootStyle}>
      <RadioGroup
        legend="Urgenza dell'intervento"
        options={URGENZA_OPTIONS}
        value={state.urgenza}
        onChange={(value) => {
          setTouched(true)
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

      <CheckboxGroup
        legend="Fattori che potrebbero aggravare il fabbisogno"
        options={FATTORI_OPTIONS}
        values={state.fattoriAggravamento}
        onChange={setFattoriAggravamento}
      />
    </div>
  )
}

const rootStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-m)',
}

const alertStyle: CSSProperties = {
  padding: 'var(--spacing-inset-s)',
  borderRadius: 'var(--radius-smooth)',
  border: '1px solid var(--color-border-warning)',
  background: 'var(--color-background-warning-lightest, var(--color-background-inverse))',
  color: 'var(--color-text-warning)',
  fontWeight: 700,
}

