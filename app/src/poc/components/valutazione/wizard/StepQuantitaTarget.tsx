import { useValutazioneWizard } from '../../../contexts/ValutazioneWizardContext'
import { WizardSectionCard, WizardStepHeader } from './primitives'
import { getTargetQuantityPrompt, getValutazioneCerReference } from './parametricCost'

function parsePositiveInteger(raw: string): number | null {
  const parsed = Math.round(Number(raw.replace(',', '.')))
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

export function StepQuantitaTarget() {
  const { state, setState } = useValutazioneWizard()
  const cer = getValutazioneCerReference(state)
  const prompt = getTargetQuantityPrompt(cer)

  return (
    <div>
      <WizardStepHeader
        title="Qual è la quantità target dell'intervento?"
        description="Inserisci il dato quantitativo che dimensiona l'intervento. Questo valore verrà usato negli step economici successivi per costruire la stima parametrica del CAPEX."
      />

      <WizardSectionCard title="Quantità target">
        <div className="max-w-[340px]">
          <label className="mb-2 block text-sm font-semibold text-gray-900">{prompt.label}</label>
          <input
            type="number"
            min="1"
            step="1"
            value={state.target_quantity ?? ''}
            onChange={(event) => setState({ target_quantity: parsePositiveInteger(event.target.value) })}
            placeholder={prompt.placeholder}
            className="w-full border border-gray-300 px-3 py-2 text-sm text-gray-800 transition-colors focus:border-bluette-700 focus:outline-none"
            style={{ borderRadius: 0 }}
            aria-label={prompt.label}
          />
          <p className="mt-2 text-xs text-gray-500">{prompt.helperText}</p>
        </div>
      </WizardSectionCard>
    </div>
  )
}
