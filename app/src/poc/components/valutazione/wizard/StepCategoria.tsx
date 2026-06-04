/* ══════════════════════════════════════════════════════════════
   StepCategoria.tsx — Step 7: Category selection (vertical list)
   Requires both sector_id + subsector_id (new taxonomy API).
   ══════════════════════════════════════════════════════════════ */

import { useMemo } from 'react'
import { useValutazioneWizard } from '../../../contexts/ValutazioneWizardContext'
import { getCategories } from '../../../services/taxonomyService'
import type { MOPCategory } from '../../../services/taxonomyService'
import { WizardHint, WizardSectionCard, WizardStepHeader } from './primitives'

function RadioCircle({ selected }: { selected: boolean }) {
  return (
    <div
      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
        ${selected ? 'border-bluette-700' : 'border-gray-400'}`}
    >
      {selected && <div className="w-2.5 h-2.5 rounded-full bg-bluette-700" />}
    </div>
  )
}

export function StepCategoria() {
  const { state, setState } = useValutazioneWizard()
  const categories = useMemo(
    () =>
      state.sector_id && state.subsector_id
        ? getCategories(state.sector_id, state.subsector_id)
        : [],
    [state.sector_id, state.subsector_id]
  )

  const handleSelect = (item: MOPCategory) => {
    if (item.id === state.category_id) return
    setState({
      category_id: item.id,
      category_label: item.label,
      intervention_type_id: null,
      intervention_type_label: '',
    })
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 text-sm">
        Nessuna categoria disponibile per il sotto-settore selezionato.
      </div>
    )
  }

  return (
    <div>
      <WizardStepHeader
        title="In quale categoria d'intervento si inserisce il tuo progetto?"
        description="Indica l'ambito specifico all'interno del settore scelto. Questa informazione ci aiuta ad affinare la valutazione e ad associare indicatori più pertinenti."
        caption="Risposta singola"
      />

      <WizardHint>
        Abbiamo già identificato una categoria che riteniamo coerente con le selezioni precedenti.
      </WizardHint>

      <WizardSectionCard title="Categoria di intervento">
        <div className="border border-gray-200 divide-y divide-gray-100 overflow-y-auto max-h-96">
          {categories.map(item => {
            const selected = state.category_id === item.id
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className={`w-full text-left flex items-center justify-between px-5 py-4 transition-colors
                  ${selected ? 'border-l-4 border-l-bluette-700 bg-white' : 'bg-white hover:bg-gray-50'}`}
                aria-pressed={selected}
              >
                <span className={`text-sm leading-snug pr-4 ${selected ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                  {item.label}
                </span>
                <RadioCircle selected={selected} />
              </button>
            )
          })}
        </div>
      </WizardSectionCard>
    </div>
  )
}
