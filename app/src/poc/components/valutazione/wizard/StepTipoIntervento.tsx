import { useMemo, useState } from 'react'
import { useValutazioneWizard } from '../../../contexts/ValutazioneWizardContext'
import { getInterventionTypes } from '../../../services/taxonomyService'
import type { InterventionType } from '../../../services/taxonomyService'
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

interface TypeCardProps {
  type: InterventionType
  suggested: boolean
  emphasizeSuggestions: boolean
  selected: boolean
  onSelect: () => void
}

function TypeCard({ type, suggested, emphasizeSuggestions, selected, onSelect }: TypeCardProps) {
  const showSuggestedState = emphasizeSuggestions && suggested
  const showMutedState = emphasizeSuggestions && !suggested

  return (
    <button
      onClick={onSelect}
      className={`flex min-h-[140px] flex-col items-center border px-4 py-5 text-center transition-colors
        ${selected
          ? 'border-bluette-700 bg-white'
          : showSuggestedState
          ? 'border-gray-300 bg-white hover:border-bluette-700/50'
          : showMutedState
          ? 'border-gray-200 bg-gray-50 hover:border-gray-400'
          : 'border-gray-300 bg-white hover:border-gray-500'
        }`}
      aria-pressed={selected}
    >
      <p
        className={`mb-2 flex flex-1 items-center text-sm font-semibold ${
          selected ? 'text-gray-900' : showSuggestedState ? 'text-gray-800' : showMutedState ? 'text-gray-500' : 'text-gray-800'
        }`}
      >
        {type.label}
      </p>
      <p
        className={`mb-3 text-xs leading-snug ${
          selected || showSuggestedState ? 'text-gray-600' : showMutedState ? 'text-gray-400' : 'text-gray-600'
        }`}
      >
        {type.description || 'Tipologia disponibile per la categoria selezionata.'}
      </p>
      <RadioCircle selected={selected} />
    </button>
  )
}

const PAGE_SIZE = 4

export function StepTipoIntervento() {
  const { state, setState } = useValutazioneWizard()

  const types = useMemo(
    () =>
      state.sector_id && state.subsector_id && state.category_id
        ? getInterventionTypes(state.sector_id, state.subsector_id, state.category_id)
        : [],
    [state.sector_id, state.subsector_id, state.category_id],
  )

  const [page, setPage] = useState(() => {
    const idx = types.findIndex(({ type }) => type.id === state.intervention_type_id)
    return idx >= 0 ? Math.floor(idx / PAGE_SIZE) : 0
  })

  const handleSelect = (type: InterventionType) => {
    setState({
      intervention_type_id: type.id,
      intervention_type_label: type.label,
    })
  }

  const allSuggested = types.length > 0 && types.every(({ suggested }) => suggested)
  const hasSuggestedTypes = types.some(({ suggested }) => suggested) && !allSuggested
  const totalPages = Math.ceil(types.length / PAGE_SIZE)
  const pageItems = types.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const emptySlots = PAGE_SIZE - pageItems.length

  if (types.length === 0) {
    return <div className="py-16 text-center text-sm text-gray-500">Nessun tipo di intervento disponibile.</div>
  }

  return (
    <div>
      <WizardStepHeader
        title="Indica il tipo di intervento"
        description="Seleziona la tipologia specifica prevista dal progetto. Questo passaggio rafforza la classificazione tecnica dell'intervento e aiuta a confrontarlo con progetti simili."
        caption="Risposta singola"
      />

      {hasSuggestedTypes ? (
        <WizardHint>Alcune tipologie sono suggerite in base al settore e al sotto-settore gia selezionati.</WizardHint>
      ) : null}

      <WizardSectionCard title="Tipo di intervento">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPage((currentPage) => Math.max(0, currentPage - 1))}
            disabled={page === 0}
            className="w-8 h-8 flex items-center justify-center border border-gray-300 text-gray-600 disabled:opacity-30 hover:border-gray-500 transition-colors flex-shrink-0"
            aria-label="Precedente"
          >
            <IconChevronLeft />
          </button>

          <div className="grid flex-1 gap-3" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
            {pageItems.map(({ type, suggested }) => (
              <TypeCard
                key={type.id}
                type={type}
                suggested={suggested && !allSuggested}
                emphasizeSuggestions={hasSuggestedTypes}
                selected={state.intervention_type_id === type.id}
                onSelect={() => handleSelect(type)}
              />
            ))}
            {Array.from({ length: emptySlots }).map((_, index) => (
              <div
                key={`type-placeholder-${index}`}
                aria-hidden="true"
                className="min-h-[140px] border border-transparent pointer-events-none"
              />
            ))}
          </div>

          <button
            onClick={() => setPage((currentPage) => Math.min(totalPages - 1, currentPage + 1))}
            disabled={page >= totalPages - 1}
            className="w-8 h-8 flex items-center justify-center border border-gray-300 text-gray-600 disabled:opacity-30 hover:border-gray-500 transition-colors flex-shrink-0"
            aria-label="Successivo"
          >
            <IconChevronRight />
          </button>
        </div>

        {totalPages > 1 ? (
          <div className="mt-4 flex justify-center gap-1.5">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setPage(index)}
                className={`h-1.5 transition-all ${index === page ? 'w-6 bg-bluette-700' : 'w-3 bg-gray-300'}`}
                aria-label={`Pagina ${index + 1}`}
              />
            ))}
          </div>
        ) : null}
      </WizardSectionCard>
    </div>
  )
}
