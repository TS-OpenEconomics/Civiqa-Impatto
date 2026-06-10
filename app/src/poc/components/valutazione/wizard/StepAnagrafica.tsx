import { InputField } from '../../ui/InputField'
import { RadioGroup } from '../../ui/RadioGroup'
import { ProgressiveBlocks } from '../../ui/ProgressiveBlocks'
import type { ProgressiveBlockDef } from '../../ui/ProgressiveBlocks'
import { WizardStepHeader } from './primitives'
import { useValutazioneWizard } from '../../../contexts/ValutazioneWizardContext'

const STATO_OPTIONS = [
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

export function StepAnagrafica() {
  const { state, setState } = useValutazioneWizard()

  const handleCupChange = (value: string) => {
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
    setState({ cup_code: cleaned })
  }

  const statoLabel = STATO_OPTIONS.find((o) => o.value === state.project_status)?.label ?? ''

  const blocks: ProgressiveBlockDef[] = [
    {
      id: 'anagrafica',
      title: 'Anagrafica progetto',
      complete: state.project_name.trim().length > 0,
      summary: state.cup_code ? `${state.project_name} · CUP ${state.cup_code}` : state.project_name,
      children: (
        <>
          <InputField
            label="Nome del progetto"
            value={state.project_name}
            onChange={(value) => setState({ project_name: value.slice(0, 70) })}
            placeholder="Inserisci il nome del progetto"
            maxLength={70}
            required
            helperText="Lunghezza massima 70 caratteri."
          />

          <InputField
            label="Identificativo CUP"
            value={state.cup_code}
            onChange={handleCupChange}
            placeholder="Inserisci il codice CUP"
            helperText="Valore alfanumerico facoltativo."
          />
        </>
      ),
    },
    {
      id: 'stato',
      title: 'Stato del progetto',
      complete: state.project_status !== '',
      summary: statoLabel || undefined,
      children: (
        <RadioGroup
          legend="Seleziona lo stato attuale"
          options={STATO_OPTIONS.map((option) => ({
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
      ),
    },
  ]

  return (
    <div>
      <WizardStepHeader
        title="Per prima cosa: dai un'identità al tuo progetto"
        description="Scegli un nome chiaro e riconoscibile e aggiungi il codice CUP se lo hai già. Dopo aver compilato l'anagrafica potrai indicare lo stato attuale del progetto."
      />

      <ProgressiveBlocks blocks={blocks} />
    </div>
  )
}
