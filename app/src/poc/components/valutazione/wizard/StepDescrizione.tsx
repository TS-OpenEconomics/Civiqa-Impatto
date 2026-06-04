import { Textarea } from '../../ui/Textarea'
import { WizardSectionCard, WizardStepHeader } from './primitives'
import { useValutazioneWizard } from '../../../contexts/ValutazioneWizardContext'

const MAX_LEN = 600

export function StepDescrizione() {
  const { state, setState } = useValutazioneWizard()

  return (
    <div>
      <WizardStepHeader
        title="Fornisci una descrizione del progetto"
        description="Inserisci in poche righe finalità, ambiti di intervento e obiettivi del progetto. Queste informazioni servono a contestualizzare la proposta e a indirizzare in modo corretto i percorsi di valutazione successivi."
      />

      <WizardSectionCard
        title="Descrizione del progetto"
        subtitle="La descrizione dovrebbe includere finalità dell'intervento, problema da affrontare, benefici attesi e principali ambiti di attuazione."
      >
        <Textarea
          label="Testo descrittivo"
          value={state.project_description}
          onChange={(value) => setState({ project_description: value.slice(0, MAX_LEN) })}
          placeholder="Inserisci la descrizione del progetto"
          maxLength={MAX_LEN}
          rows={6}
          required
          helperText={`Lunghezza massima ${MAX_LEN} caratteri.`}
        />
      </WizardSectionCard>
    </div>
  )
}
