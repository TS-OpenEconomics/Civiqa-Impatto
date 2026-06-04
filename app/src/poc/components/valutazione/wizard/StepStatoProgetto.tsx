import { RadioGroup } from '../../ui/RadioGroup'
import { WizardSectionCard, WizardStepHeader } from './primitives'
import { useValutazioneWizard } from '../../../contexts/ValutazioneWizardContext'

const OPTIONS = [
  {
    value: 'in_preparazione',
    label: 'In preparazione',
    description:
      'Il progetto è allo stadio iniziale: si raccolgono dati, si definiscono obiettivi e si impostano i primi elementi tecnici ed economici.',
  },
  {
    value: 'in_approvazione',
    label: 'In approvazione',
    description:
      'Il progetto è stato predisposto e presentato agli organi competenti ed è in attesa di autorizzazione o parere.',
  },
  {
    value: 'approvato',
    label: 'Approvato',
    description:
      'Il progetto ha ottenuto l’approvazione formale necessaria e può procedere verso le fasi attuative ed esecutive.',
  },
] as const

export function StepStatoProgetto() {
  const { state, setState } = useValutazioneWizard()

  return (
    <div>
      <WizardStepHeader
        title="Qual è lo stato del progetto?"
        description="Seleziona la fase che rappresenta la situazione attuale del progetto. Questa informazione serve a contestualizzare la valutazione rispetto al momento in cui l'intervento viene analizzato."
        caption="Risposta singola"
      />

      <WizardSectionCard title="Stato progettuale">
        <RadioGroup
          legend="Seleziona lo stato attuale"
          options={OPTIONS.map((option) => ({
            value: option.value,
            label: option.label,
            description: option.description,
          }))}
          value={state.project_status}
          onChange={(value) =>
            setState({
              project_status: value as typeof state.project_status,
            })
          }
          required
        />
      </WizardSectionCard>
    </div>
  )
}
