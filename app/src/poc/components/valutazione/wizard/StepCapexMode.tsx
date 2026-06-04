import { RadioGroup } from '../../ui/RadioGroup'
import { WizardSectionCard, WizardStepHeader } from './primitives'
import { useValutazioneWizard } from '../../../contexts/ValutazioneWizardContext'

const OPTIONS = [
  {
    value: 'file',
    label: 'Hai già un quadro economico finanziario',
    description:
      'Caricherai un file Excel compilato a partire dal template fornito, poi verificherai la distribuzione del CAPEX sugli anni del progetto.',
  },
  {
    value: 'total',
    label: 'Hai solo il valore di CAPEX totale',
    description:
      'Nel passaggio successivo inserirai il CAPEX complessivo e potrai verificarne o correggerne la distribuzione percentuale sugli anni.',
  },
] as const

export function StepCapexMode() {
  const { state, setState } = useValutazioneWizard()

  return (
    <div>
      <WizardStepHeader
        title="Come preferisci caricare il CAPEX?"
        description="Scegli la modalità più adatta agli strumenti già disponibili per il progetto. In entrambi i casi manterrai il controllo sulla distribuzione finale dei valori."
        caption="Risposta singola"
      />

      <WizardSectionCard title="Modalità di inserimento CAPEX">
        <RadioGroup
          legend="Seleziona la modalità"
          options={OPTIONS.map((option) => ({
            value: option.value,
            label: option.label,
            description: option.description,
          }))}
          value={state.capex_mode ?? ''}
          onChange={(value) =>
            setState({
              capex_mode: value as typeof state.capex_mode,
            })
          }
          required
        />
      </WizardSectionCard>
    </div>
  )
}
