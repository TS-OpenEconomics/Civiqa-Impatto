/* ══════════════════════════════════════════════════════════════
   StepAnnoAttualizzazione.tsx — Step 11: Update year selection
   Horizontal year carousel with 5 visible items at a time.
   ══════════════════════════════════════════════════════════════ */

import { useState } from 'react'
import { useValutazioneWizard } from '../../../contexts/ValutazioneWizardContext'
import { WizardSectionCard, WizardStepHeader } from './primitives'

const YEAR_MIN = 2022
const YEAR_MAX = 2035
const PAGE_SIZE = 5

const ALL_YEARS = Array.from(
  { length: YEAR_MAX - YEAR_MIN + 1 },
  (_, i) => YEAR_MIN + i,
)

function IconChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M13 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function IconChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

/* ─── Radio circle ─── */
function RadioCircle({ selected }: { selected: boolean }) {
  return (
    <div
      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
        ${selected ? 'border-bluette-700' : 'border-gray-300'}`}
    >
      {selected && <div className="w-2.5 h-2.5 rounded-full bg-bluette-700" />}
    </div>
  )
}

export function StepAnnoAttualizzazione() {
  const { state, setState } = useValutazioneWizard()

  const totalPages = Math.ceil(ALL_YEARS.length / PAGE_SIZE)

  const [windowStart, setWindowStart] = useState(
    Math.max(0, Math.min(ALL_YEARS.indexOf(state.update_year), ALL_YEARS.length - PAGE_SIZE))
  )

  const visibleYears = ALL_YEARS.slice(windowStart, windowStart + PAGE_SIZE)

  const canPrev = windowStart > 0
  const canNext = windowStart + PAGE_SIZE < ALL_YEARS.length

  const currentPage = Math.floor(windowStart / PAGE_SIZE)

  return (
    <div>
      <WizardStepHeader
        title="Quale sarà invece l'anno di attualizzazione?"
        description="L'anno di attualizzazione è il punto di riferimento temporale rispetto al quale vengono scontati i flussi di cassa futuri nelle analisi economico-finanziarie."
      />

      <WizardSectionCard title="Anno di attualizzazione">
        <p className="text-xs text-gray-500 mb-4 font-medium">Risposta singola</p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setWindowStart((w) => Math.max(0, w - 1))}
            disabled={!canPrev}
            className="w-9 h-9 flex items-center justify-center border border-gray-300 text-gray-600
              disabled:opacity-30 hover:border-gray-500 transition-colors flex-shrink-0"
            aria-label="Anno precedente"
          >
            <IconChevronLeft />
          </button>

          <div className="flex gap-3 flex-1">
            {visibleYears.map((year) => {
              const selected = state.update_year === year
              return (
                <button
                  key={year}
                  type="button"
                  onClick={() => setState({ update_year: year })}
                  className={`flex-1 flex flex-col items-center justify-between py-5 px-2 border transition-colors
                    ${selected
                      ? 'border-2 border-bluette-700 bg-white'
                      : 'border border-gray-200 bg-white hover:border-gray-400'
                    }`}
                  style={{ borderRadius: 0, minHeight: 100 }}
                  aria-pressed={selected}
                >
                  <span
                    className="text-2xl font-bold text-gray-900 mb-4"
                    style={{ fontFamily: 'var(--font-family-0, monospace)' }}
                  >
                    {year}
                  </span>
                  <RadioCircle selected={selected} />
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={() => setWindowStart((w) => Math.min(ALL_YEARS.length - PAGE_SIZE, w + 1))}
            disabled={!canNext}
            className="w-9 h-9 flex items-center justify-center border border-gray-300 text-gray-600
              disabled:opacity-30 hover:border-gray-500 transition-colors flex-shrink-0"
            aria-label="Anno successivo"
          >
            <IconChevronRight />
          </button>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-1.5 mt-4">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setWindowStart(i * PAGE_SIZE)}
                className={`h-1.5 transition-all ${i === currentPage ? 'w-6 bg-bluette-700' : 'w-3 bg-gray-300'}`}
                aria-label={`Pagina ${i + 1}`}
              />
            ))}
          </div>
        )}
      </WizardSectionCard>
    </div>
  )
}
