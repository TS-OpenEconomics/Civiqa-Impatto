import { useMemo, useState } from 'react'
import { useValutazioneWizard } from '../../../contexts/ValutazioneWizardContext'
import { getSubSectors } from '../../../services/taxonomyService'
import type { MOPSubSector } from '../../../services/taxonomyService'
import { WizardHint, WizardSectionCard, WizardStepHeader } from './primitives'

function RadioCircle({ selected }: { selected: boolean }) {
  return (
    <div
      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
        ${selected ? 'border-bluette-700' : 'border-gray-400'}`}
    >
      {selected && <div className="w-2.5 h-2.5 rounded-full bg-bluette-700" />}
    </div>
  )
}

function IconChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M13 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const PAGE_SIZE = 4

export function StepSottoSettore() {
  const { state, setState } = useValutazioneWizard()
  const subSectors = useMemo(
    () => (state.sector_id ? getSubSectors(state.sector_id) : []),
    [state.sector_id],
  )

  const [page, setPage] = useState(() => {
    const idx = subSectors.findIndex((s) => s.id === state.subsector_id)
    return idx >= 0 ? Math.floor(idx / PAGE_SIZE) : 0
  })
  const totalPages = Math.ceil(subSectors.length / PAGE_SIZE)
  const pageItems = subSectors.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const emptySlots = PAGE_SIZE - pageItems.length

  const handleSelect = (item: MOPSubSector) => {
    if (item.id === state.subsector_id) return
    setState({
      subsector_id: item.id,
      subsector_label: item.label,
      category_id: null,
      category_label: '',
      intervention_type_id: null,
      intervention_type_label: '',
    })
  }

  if (subSectors.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 text-sm">
        Nessun sotto-settore disponibile per il settore selezionato.
      </div>
    )
  }

  return (
    <div>
      <WizardStepHeader
        title="In quale sotto-settore d'intervento si inserisce il tuo progetto?"
        description="Indica l'ambito specifico all'interno del settore scelto. Questa informazione consente di affinare la valutazione e di associare indicatori settoriali più pertinenti."
        caption="Risposta singola"
      />

      <WizardHint>
        Abbiamo già identificato un settore d'intervento che riteniamo in linea con la descrizione.
      </WizardHint>

      <WizardSectionCard title="Sotto-settore di intervento">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="w-8 h-8 flex items-center justify-center border border-gray-300 text-gray-600 disabled:opacity-30 hover:border-gray-500 transition-colors flex-shrink-0"
            aria-label="Precedente"
          >
            <IconChevronLeft />
          </button>

          <div className="grid gap-3 flex-1" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
            {pageItems.map((item) => {
              const selected = state.subsector_id === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={`flex flex-col items-center justify-between text-center px-3 py-5 border transition-colors min-h-[100px]
                    ${selected ? 'border-bluette-700 bg-white' : 'border-gray-200 bg-white hover:border-gray-400'}`}
                  aria-pressed={selected}
                >
                  <p className="text-sm font-medium text-gray-800 leading-snug mb-4 flex-1">{item.label}</p>
                  <RadioCircle selected={selected} />
                </button>
              )
            })}
            {Array.from({ length: emptySlots }).map((_, index) => (
              <div
                key={`subsector-placeholder-${index}`}
                aria-hidden="true"
                className="min-h-[100px] border border-transparent pointer-events-none"
              />
            ))}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="w-8 h-8 flex items-center justify-center border border-gray-300 text-gray-600 disabled:opacity-30 hover:border-gray-500 transition-colors flex-shrink-0"
            aria-label="Successivo"
          >
            <IconChevronRight />
          </button>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-1.5 mt-4">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`h-1.5 transition-all ${i === page ? 'w-6 bg-bluette-700' : 'w-3 bg-gray-300'}`}
                aria-label={`Pagina ${i + 1}`}
              />
            ))}
          </div>
        )}
      </WizardSectionCard>
    </div>
  )
}
