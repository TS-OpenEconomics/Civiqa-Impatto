import { useEffect, useState } from 'react'
import { useValutazioneWizard } from '../../../contexts/ValutazioneWizardContext'
import type { CapexLocationData, CapexYearData } from '../../../contexts/ValutazioneWizardContext'
import { RobustnessSemaphore } from '../../ui/RobustnessSemaphore'
import { WizardSectionCard, WizardStepHeader } from './primitives'
import {
  getCapexCostUnitLabel,
  getSuggestedCapexAmount,
  getTargetQuantityPrompt,
  getValutazioneCerReference,
} from './parametricCost'
import { getProjectYears } from './yearUtils'

function formatIT(value: string | number): string {
  const parsed = typeof value === 'string' ? parseFloat(value.replace(/\./g, '').replace(',', '.')) : value
  if (isNaN(parsed)) return ''
  return parsed.toLocaleString('it-IT', { maximumFractionDigits: 2 })
}

function parseIT(value: string): number {
  return parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0
}

function IconChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StatusBadge({ complete }: { complete: boolean }) {
  return (
    <span
      className={`px-2 py-0.5 text-xs font-semibold ${
        complete ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
      }`}
    >
      {complete ? 'COMPLETATO' : 'DA COMPLETARE'}
    </span>
  )
}

const COLS_PER_PAGE = 4

interface LocationCardProps {
  locData: CapexLocationData
  locAddress: string
  years: number[]
  onChange: (updated: CapexLocationData) => void
}

function LocationCapexCard({ locData, locAddress, years, onChange }: LocationCardProps) {
  const [colPage, setColPage] = useState(0)
  const totalColPages = Math.ceil(years.length / COLS_PER_PAGE)
  const visibleYears = years.slice(colPage * COLS_PER_PAGE, (colPage + 1) * COLS_PER_PAGE)

  const total = parseIT(locData.total)
  const percentageSum = years.reduce((sum, year) => sum + (parseFloat(locData.years[year]?.pct || '0') || 0), 0)
  const percentageOver = percentageSum > 100 ? Math.round((percentageSum - 100) * 100) / 100 : 0
  const isComplete = !!locData.total && Math.abs(percentageSum - 100) < 0.01

  const updateTotal = (value: string) => {
    const raw = value.replace(/\./g, '').replace(',', '.')
    const nextTotal = parseFloat(raw) || 0
    const updatedYears: Record<number, CapexYearData> = {}

    years.forEach((year) => {
      const pct = parseFloat(locData.years[year]?.pct || '0') || 0
      updatedYears[year] = {
        pct: locData.years[year]?.pct || '',
        amount: pct > 0 ? String(Math.round((nextTotal * pct) / 100)) : '',
      }
    })

    onChange({ ...locData, total: raw, years: updatedYears })
  }

  const updatePct = (year: number, pctValue: string) => {
    const pct = parseFloat(pctValue) || 0
    const amount = total > 0 ? String(Math.round((total * pct) / 100)) : ''
    onChange({
      ...locData,
      years: {
        ...locData.years,
        [year]: { pct: pctValue, amount },
      },
    })
  }

  const updateAmount = (year: number, amountValue: string) => {
    const raw = amountValue.replace(/\./g, '').replace(',', '.')
    const amount = parseFloat(raw) || 0
    const pct = total > 0 ? String(Math.round((amount / total) * 10000) / 100) : ''
    onChange({
      ...locData,
      years: {
        ...locData.years,
        [year]: { pct, amount: raw },
      },
    })
  }

  const clearAll = () => {
    const emptyYears: Record<number, CapexYearData> = {}
    years.forEach((year) => {
      emptyYears[year] = { pct: '', amount: '' }
    })
    onChange({ ...locData, total: '', years: emptyYears })
  }

  return (
    <div className="mb-6 border border-gray-200 bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2.5">
        <StatusBadge complete={isComplete} />
      </div>

      <div className="bg-gray-900 px-4 py-3 text-white">
        <p className="text-sm font-medium">{locAddress}</p>
      </div>

      <div className="p-4">
        <div className="mb-5 flex items-center gap-4">
          <label className="whitespace-nowrap text-sm font-semibold text-gray-700">CAPEX complessivo (€)</label>
          <div className="flex flex-1 items-center border border-gray-300 transition-colors focus-within:border-bluette-700">
            <input
              type="text"
              value={locData.total ? formatIT(locData.total) : ''}
              onChange={(event) => updateTotal(event.target.value)}
              placeholder="0"
              className="flex-1 bg-transparent px-3 py-2 text-right text-sm text-gray-900 focus:outline-none"
              style={{ borderRadius: 0, fontFamily: 'var(--font-family-0, monospace)' }}
              aria-label="CAPEX complessivo in euro"
            />
            <span className="pr-3 text-sm text-gray-500">€</span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <button
            type="button"
            onClick={() => setColPage((page) => Math.max(0, page - 1))}
            disabled={colPage === 0}
            className="mt-6 flex h-7 w-7 flex-shrink-0 items-center justify-center border border-gray-300 text-gray-600 disabled:opacity-30 hover:border-gray-500"
            aria-label="Anni precedenti"
          >
            <IconChevronLeft />
          </button>

          <div className="flex-1 overflow-hidden">
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${visibleYears.length}, 1fr)` }}>
              {visibleYears.map((year) => {
                const yearData = locData.years[year] || { pct: '', amount: '' }

                return (
                  <div key={year} className="flex flex-col items-center">
                    <p className="mb-1.5 text-center text-xs font-semibold text-gray-600">% anno {year}</p>
                    <div className="mb-1 flex w-full items-center border border-gray-200 transition-colors focus-within:border-bluette-700">
                      <input
                        type="text"
                        value={yearData.amount ? formatIT(yearData.amount) : ''}
                        onChange={(event) => updateAmount(year, event.target.value)}
                        placeholder="0"
                        className="min-w-0 flex-1 bg-transparent px-1.5 py-1.5 text-right text-xs text-gray-900 focus:outline-none"
                        style={{ borderRadius: 0, fontFamily: 'var(--font-family-0, monospace)' }}
                        aria-label={`Importo anno ${year}`}
                      />
                    </div>
                    <div className="flex w-full items-center border border-gray-200 transition-colors focus-within:border-bluette-700">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={yearData.pct}
                        onChange={(event) => updatePct(year, event.target.value)}
                        placeholder="0"
                        className="min-w-0 flex-1 bg-transparent px-1.5 py-1.5 text-right text-xs text-gray-900 focus:outline-none"
                        style={{ borderRadius: 0, fontFamily: 'var(--font-family-0, monospace)' }}
                        aria-label={`Percentuale anno ${year}`}
                      />
                      <span className="pr-1.5 text-xs text-gray-500">%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setColPage((page) => Math.min(totalColPages - 1, page + 1))}
            disabled={colPage >= totalColPages - 1}
            className="mt-6 flex h-7 w-7 flex-shrink-0 items-center justify-center border border-gray-300 text-gray-600 disabled:opacity-30 hover:border-gray-500"
            aria-label="Anni successivi"
          >
            <IconChevronRight />
          </button>
        </div>

        {percentageOver > 0 ? (
          <p className="mt-3 text-xs font-medium text-red-600">
            Hai superato il totale di {percentageOver}%. Modifica le percentuali in modo che non superino il 100%.
          </p>
        ) : null}

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-gray-500 transition-colors hover:text-red-600"
          >
            Pulisci inserimento
          </button>
        </div>
      </div>
    </div>
  )
}

function ParametricCapexCard() {
  const { state } = useValutazioneWizard()
  const cer = getValutazioneCerReference(state)
  const suggestedCapex = getSuggestedCapexAmount(state.target_quantity, cer)
  const prompt = getTargetQuantityPrompt(cer)

  if (!cer) {
    return (
      <WizardSectionCard title="Costo parametrico">
        <p className="text-sm text-gray-500">
          Il costo parametrico non è disponibile per questa combinazione di categoria e tipologia.
        </p>
      </WizardSectionCard>
    )
  }

  const unitLabel = getCapexCostUnitLabel(cer)

  return (
    <WizardSectionCard
      title={`Costo parametrico (${unitLabel})`}
      subtitle="Riferimento derivato da categoria, tipologia e quantità target."
    >
      <dl className="grid gap-3 text-sm">
        <div className="grid gap-1 border-b border-gray-100 pb-3">
          <dt className="text-gray-500">Valore unitario</dt>
          <dd className="m-0 font-semibold text-gray-900">
            € {Math.round(cer.valoreUnitario).toLocaleString('it-IT')}
          </dd>
        </div>

        <div className="grid gap-1 border-b border-gray-100 pb-3">
          <dt className="text-gray-500">{prompt.label}</dt>
          <dd className="m-0 font-semibold text-gray-900">
            {state.target_quantity != null ? state.target_quantity.toLocaleString('it-IT') : 'Non disponibile'}
          </dd>
        </div>

        <div className="grid gap-1 border-b border-gray-100 pb-3">
          <dt className="text-gray-500">Formula</dt>
          <dd className="m-0 font-semibold text-gray-900">
            {state.target_quantity != null
              ? `${state.target_quantity.toLocaleString('it-IT')} × € ${Math.round(cer.valoreUnitario).toLocaleString('it-IT')}`
              : 'Inserisci la quantità target nello step precedente'}
          </dd>
        </div>

        <div className="grid gap-1 border-b border-gray-100 pb-3">
          <dt className="text-gray-500">CAPEX suggerito</dt>
          <dd className="m-0 font-semibold text-gray-900">
            {suggestedCapex != null ? `€ ${suggestedCapex.toLocaleString('it-IT')}` : 'Non disponibile'}
          </dd>
        </div>

        <div className="grid gap-1 border-b border-gray-100 pb-3">
          <dt className="text-gray-500">Robustezza stima</dt>
          <dd className="m-0">
            <RobustnessSemaphore level={cer.robustezza} nProgetti={cer.nProgetti} />
          </dd>
        </div>

        <div className="grid gap-1">
          <dt className="text-gray-500">Durata media</dt>
          <dd className="m-0 font-semibold text-gray-900">{Math.round(cer.durataMediaMesi)} mesi</dd>
        </div>
      </dl>
    </WizardSectionCard>
  )
}

export function StepCapexValue() {
  const { state, setState } = useValutazioneWizard()
  const cer = getValutazioneCerReference(state)
  const suggestedCapex = getSuggestedCapexAmount(state.target_quantity, cer)

  const projectYears = getProjectYears(state.start_date, state.end_date)
  const years =
    projectYears.length > 0
      ? projectYears
      : [state.update_year, state.update_year + 1, state.update_year + 2, state.update_year + 3]

  useEffect(() => {
    const synced: CapexLocationData[] = state.locations.map((location) => {
      const existing = state.capex_data.find((entry) => entry.location_id === location.id)
      const shouldPrefillSuggestedCapex =
        state.locations.length === 1 && suggestedCapex != null && !existing?.total

      if (existing) {
        const updatedYears = { ...existing.years }
        years.forEach((year) => {
          if (!updatedYears[year]) updatedYears[year] = { pct: '', amount: '' }
        })

        return {
          ...existing,
          total: shouldPrefillSuggestedCapex ? String(suggestedCapex) : existing.total,
          years: updatedYears,
        }
      }

      const emptyYears: Record<number, CapexYearData> = {}
      years.forEach((year) => {
        emptyYears[year] = { pct: '', amount: '' }
      })

      return {
        location_id: location.id,
        total: shouldPrefillSuggestedCapex ? String(suggestedCapex) : '',
        years: emptyYears,
      }
    })

    setState({ capex_data: synced })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.locations.length, years.join(','), suggestedCapex])

  const handleChange = (updated: CapexLocationData) => {
    setState({
      capex_data: state.capex_data.map((entry) =>
        entry.location_id === updated.location_id ? updated : entry,
      ),
    })
  }

  return (
    <div>
      <WizardStepHeader
        title="Definisci il CAPEX dell'intervento"
        description="Inserisci il CAPEX complessivo e distribuiscilo percentualmente sugli anni del progetto. Puoi partire dal valore suggerito dal costo parametrico e correggerlo manualmente."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.8fr)_320px]">
        <div>
          <WizardSectionCard
            title="CAPEX e distribuzione percentuale"
            subtitle="Compila i valori per ciascuna località e ripartiscili sugli anni del progetto."
          >
            {state.capex_data.length === 0 ? (
              <p className="text-sm text-gray-500">
                Nessuna localizzazione configurata. Torna allo step precedente per aggiungere delle localizzazioni.
              </p>
            ) : (
              state.capex_data.map((locData) => {
                const location = state.locations.find((entry) => entry.id === locData.location_id)
                const address = location?.address || locData.location_id

                return (
                  <LocationCapexCard
                    key={locData.location_id}
                    locData={locData}
                    locAddress={address}
                    years={years}
                    onChange={handleChange}
                  />
                )
              })
            )}
          </WizardSectionCard>
        </div>

        <div>
          <ParametricCapexCard />
        </div>
      </div>
    </div>
  )
}
