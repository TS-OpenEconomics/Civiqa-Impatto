import { InputField } from '../../ui/InputField'
import { WizardSectionCard, WizardStepHeader } from './primitives'
import { useValutazioneWizard } from '../../../contexts/ValutazioneWizardContext'

export function StepAnagrafica() {
  const { state, setState } = useValutazioneWizard()

  const handleCupChange = (value: string) => {
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
    setState({ cup_code: cleaned })
  }

  return (
    <div>
      <WizardStepHeader
        title="Per prima cosa: dai un'identità al tuo progetto"
        description="Scegli un nome chiaro e riconoscibile e aggiungi il codice CUP se lo hai già. Queste informazioni ci aiutano a configurare il percorso successivo senza alterare i dati che potrai approfondire negli step successivi."
      />

      <WizardSectionCard title="Anagrafica progetto">
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
      </WizardSectionCard>

    </div>
  )
}
