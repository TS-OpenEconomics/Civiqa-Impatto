import { useValutazioneWizard } from '../../../contexts/ValutazioneWizardContext'
import { WizardSectionCard, WizardStepHeader } from './primitives'

export function StepOpexMode() {
  const { state } = useValutazioneWizard()
  const hasLocations = state.locations.length > 0

  return (
    <div>
      <WizardStepHeader
        title="Inserimento OPEX"
        description="L'OPEX comprende i costi ricorrenti necessari per mantenere il progetto in funzione. Il wizard usa una stima automatica per localizzazione, con possibilita di dettaglio annuale nello step dedicato."
      />

      <WizardSectionCard title="Gestione unificata OPEX">
        <p className="text-sm text-gray-600 leading-relaxed">
          Non e piu necessaria una scelta preliminare della modalita OPEX.
          Per ogni localizzazione verra proposta una stima automatica, con la possibilita
          di inserire i valori puntuali per anno quando serve.
        </p>

        <div className="mt-4 rounded border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
          {hasLocations
            ? `Localizzazioni disponibili: ${state.locations.length}.`
            : 'Aggiungi almeno una localizzazione nei passaggi precedenti per compilare l OPEX.'}
        </div>
      </WizardSectionCard>
    </div>
  )
}
