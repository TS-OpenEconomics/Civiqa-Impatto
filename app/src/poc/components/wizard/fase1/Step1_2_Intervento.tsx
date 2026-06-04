import { useState } from 'react'
import type { CSSProperties } from 'react'
import { useWizard } from '../../../hooks/useWizard'
import { InputField } from '../../ui/InputField'
import { SelectField, type SelectOption } from '../../ui/SelectField'

const FONTE_OPTIONS: SelectOption[] = [
  { value: 'Fondi propri', label: 'Fondi propri' },
  { value: 'PNRR', label: 'PNRR' },
  { value: 'Fondi strutturali UE', label: 'Fondi strutturali UE' },
  { value: 'Mutuo', label: 'Mutuo' },
  { value: 'Contributo statale', label: 'Contributo statale' },
  { value: 'Contributo regionale', label: 'Contributo regionale' },
  { value: 'PPP', label: 'PPP' },
  { value: 'Non definita', label: 'Non definita' },
]

export function Step1_2_Intervento() {
  const { state, setIntervento } = useWizard()
  const [touched, setTouched] = useState({ denominazione: false })

  const denominazioneError =
    touched.denominazione && state.intervento.denominazione.trim().length === 0
      ? "Inserisci la denominazione dell'intervento."
      : undefined

  return (
    <div style={rootStyle}>
      <InputField
        label="Denominazione intervento"
        value={state.intervento.denominazione}
        onChange={(value) => {
          setTouched({ denominazione: true })
          setIntervento({ denominazione: value })
        }}
        required
        maxLength={200}
        errorText={denominazioneError}
        helperText="Massimo 200 caratteri."
      />

      <InputField
        label="CUP/CUI"
        value={state.intervento.cup ?? ''}
        onChange={(value) => setIntervento({ cup: value })}
        placeholder="Lasciare vuoto se non ancora assegnato"
      />

      <SelectField
        label="Fonte finanziamento prevalente"
        value={state.intervento.fonteFinanziamento ?? ''}
        onChange={(value) => setIntervento({ fonteFinanziamento: value })}
        options={FONTE_OPTIONS}
        placeholder="Seleziona una fonte"
      />
    </div>
  )
}

const rootStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-m)',
}

