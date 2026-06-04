import { useEffect, useMemo, useState } from 'react'
import { useValutazioneWizard } from '../../../contexts/ValutazioneWizardContext'
import type { OpexLocationData } from '../../../contexts/ValutazioneWizardContext'
import { WizardSectionCard, WizardStepHeader } from './primitives'
import { getOperationalYears } from './yearUtils'

const OPEX_RATIO = 0.03
const DEFAULT_USEFUL_LIFE_YEARS = 25

function parseIT(value: string): number {
  return parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0
}

function formatIT(value: string | number): string {
  const parsed = typeof value === 'string' ? parseIT(value) : value
  if (!Number.isFinite(parsed) || parsed === 0) return ''
  return parsed.toLocaleString('it-IT', { maximumFractionDigits: 0 })
}

function getFallbackOperationalYears(updateYear: number): number[] {
  return Array.from({ length: DEFAULT_USEFUL_LIFE_YEARS }, (_, index) => updateYear + index + 1)
}

function deriveAutoAnnual(totalCapexRaw: string): number {
  const capexTotal = parseIT(totalCapexRaw)
  if (capexTotal <= 0) return 0
  return Math.round(capexTotal * OPEX_RATIO)
}

function getLocationManualTotal(locationData: OpexLocationData, years: number[]): number {
  return years.reduce((sum, year) => sum + parseIT(locationData.yearly_values[year] || ''), 0)
}

function hasManualValues(locationData: OpexLocationData, years: number[]): boolean {
  return years.some((year) => parseIT(locationData.yearly_values[year] || '') > 0)
}

function buildEmptyYearMap(years: number[], source?: Record<number, string>): Record<number, string> {
  const next: Record<number, string> = {}
  years.forEach((year) => {
    next[year] = source?.[year] ?? ''
  })
  return next
}

interface OpexLocationCardProps {
  data: OpexLocationData
  address: string
  years: number[]
  onChange: (updated: OpexLocationData) => void
}

function OpexLocationCard({ data, address, years, onChange }: OpexLocationCardProps) {
  const [manualOpen, setManualOpen] = useState(data.manual_enabled)

  const autoAnnual = parseIT(data.auto_annual)
  const autoTotal = autoAnnual * years.length
  const manualTotal = getLocationManualTotal(data, years)
  const manualFilled = years.filter((year) => parseIT(data.yearly_values[year] || '') > 0).length
  const manualActive = hasManualValues(data, years)
  const activeTotal = manualActive ? manualTotal : autoTotal
  const activeModeLabel = manualActive ? 'Valore attivo: inserimento puntuale' : 'Valore attivo: stima automatica'

  const toggleManual = () => {
    const nextOpen = !manualOpen
    setManualOpen(nextOpen)
    onChange({ ...data, manual_enabled: nextOpen })
  }

  const updateYear = (year: number, rawValue: string) => {
    const raw = rawValue.replace(/\./g, '').replace(',', '.')
    onChange({
      ...data,
      manual_enabled: true,
      yearly_values: {
        ...data.yearly_values,
        [year]: raw,
      },
    })
  }

  const resetManual = () => {
    onChange({
      ...data,
      manual_enabled: false,
      yearly_values: buildEmptyYearMap(years),
    })
    setManualOpen(false)
  }

  return (
    <div className="mb-6 border border-gray-200 bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.06)]">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">{activeModeLabel}</p>
      </div>

      <div className="bg-gray-900 px-4 py-3 text-white">
        <p className="text-sm font-medium">{address}</p>
      </div>

      <div className="grid gap-4 p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">OPEX annuo stimato</p>
            <p className="mt-2 text-lg font-semibold text-gray-900">
              {autoAnnual > 0 ? `€ ${autoAnnual.toLocaleString('it-IT')}` : 'Non disponibile'}
            </p>
          </div>

          <div className="border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">OPEX totale su {years.length} anni</p>
            <p className="mt-2 text-lg font-semibold text-gray-900">
              {autoTotal > 0 ? `€ ${autoTotal.toLocaleString('it-IT')}` : 'Non disponibile'}
            </p>
          </div>

          <div className="border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">Totale attivo</p>
            <p className="mt-2 text-lg font-semibold text-gray-900">
              {activeTotal > 0 ? `€ ${activeTotal.toLocaleString('it-IT')}` : 'Non disponibile'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border border-gray-200 bg-white px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">Formula automatica</p>
            <p className="mt-1 text-sm text-gray-600">
              CAPEX localizzazione × 3% = OPEX annuo stimato
            </p>
          </div>

          <button
            type="button"
            onClick={toggleManual}
            className="border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:border-bluette-700 hover:text-bluette-700"
            style={{ borderRadius: 0 }}
          >
            {manualOpen ? 'Nascondi inserimento puntuale' : 'Inserisci OPEX puntuale per anno'}
          </button>
        </div>

        {manualOpen ? (
          <div className="border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">Dettaglio OPEX annuale</p>
                <p className="mt-1 text-xs text-gray-500">
                  Inserisci i valori per gli anni di esercizio, dal {years[0]} al {years[years.length - 1]}.
                </p>
              </div>
              <button
                type="button"
                onClick={resetManual}
                className="text-xs font-medium text-gray-500 transition-colors hover:text-red-600"
              >
                Ripristina stima automatica
              </button>
            </div>

            <div className="max-h-[420px] overflow-y-auto">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">
                      Anno
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">
                      OPEX annuo (€)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {years.map((year) => (
                    <tr key={year} className="border-b border-gray-100">
                      <td className="px-4 py-2 text-sm text-gray-800">{year}</td>
                      <td className="px-4 py-2">
                        <div className="flex max-w-[220px] items-center border border-gray-300 transition-colors focus-within:border-bluette-700">
                          <input
                            type="text"
                            value={data.yearly_values[year] ? formatIT(data.yearly_values[year]) : ''}
                            onChange={(event) => updateYear(year, event.target.value)}
                            placeholder="0"
                            className="flex-1 bg-transparent px-3 py-2 text-right text-sm text-gray-900 focus:outline-none"
                            style={{ borderRadius: 0, fontFamily: 'var(--font-family-0, monospace)' }}
                            aria-label={`OPEX anno ${year}`}
                          />
                          <span className="pr-3 text-sm text-gray-500">€</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 border-t border-gray-200 bg-gray-50 px-4 py-3 md:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">Anni compilati</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {manualFilled} / {years.length}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">Totale OPEX manuale</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {manualTotal > 0 ? `€ ${manualTotal.toLocaleString('it-IT')}` : 'Non disponibile'}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">Media annua manuale</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {manualTotal > 0 ? `€ ${Math.round(manualTotal / years.length).toLocaleString('it-IT')}` : 'Non disponibile'}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function OpexMethodInfoCard({
  totalCapex,
  totalAutoAnnual,
  operationalYears,
}: {
  totalCapex: number
  totalAutoAnnual: number
  operationalYears: number[]
}) {
  const totalAutoOpex = totalAutoAnnual * operationalYears.length

  return (
    <WizardSectionCard
      title="Fonte della stima"
    >
      <dl className="grid gap-3 text-sm">
        <div className="grid gap-1 border-b border-gray-100 pb-3">
          <dt className="text-gray-500">Regola applicata</dt>
          <dd className="m-0 font-semibold text-gray-900">OPEX annuo = 3% del CAPEX</dd>
        </div>

        <div className="grid gap-1 border-b border-gray-100 pb-3">
          <dt className="text-gray-500">Riferimento metodologico</dt>
          <dd className="m-0 text-gray-700">
            Stima OPEX basata sulle Linee Guida per la valutazione degli investimenti pubblici (MEF, 2017). Il 3%
            rappresenta il costo annuo standard di gestione e manutenzione per infrastrutture pubbliche.
          </dd>
        </div>

        <div className="grid gap-1 border-b border-gray-100 pb-3">
          <dt className="text-gray-500">CAPEX considerato</dt>
          <dd className="m-0 font-semibold text-gray-900">
            {totalCapex > 0 ? `€ ${totalCapex.toLocaleString('it-IT')}` : 'Non disponibile'}
          </dd>
        </div>

        <div className="grid gap-1 border-b border-gray-100 pb-3">
          <dt className="text-gray-500">Orizzonte di esercizio</dt>
          <dd className="m-0 font-semibold text-gray-900">
            {operationalYears.length} anni, dal {operationalYears[0]} al {operationalYears[operationalYears.length - 1]}
          </dd>
        </div>

        <div className="grid gap-1">
          <dt className="text-gray-500">OPEX totale automatico</dt>
          <dd className="m-0 font-semibold text-gray-900">
            {totalAutoOpex > 0 ? `€ ${totalAutoOpex.toLocaleString('it-IT')}` : 'Non disponibile'}
          </dd>
        </div>
      </dl>
    </WizardSectionCard>
  )
}

export function StepOpexInput() {
  const { state, setState } = useValutazioneWizard()

  const operationalYears = useMemo(() => {
    const derived = getOperationalYears(state.end_date, DEFAULT_USEFUL_LIFE_YEARS)
    return derived.length > 0 ? derived : getFallbackOperationalYears(state.update_year)
  }, [state.end_date, state.update_year])

  useEffect(() => {
    const synced: OpexLocationData[] = state.locations.map((location) => {
      const capexEntry = state.capex_data.find((entry) => entry.location_id === location.id)
      const existing = state.opex_data.find((entry) => entry.location_id === location.id)
      const autoAnnual = String(deriveAutoAnnual(capexEntry?.total || ''))

      if (existing) {
        return {
          ...existing,
          auto_annual: autoAnnual,
          yearly_values: buildEmptyYearMap(operationalYears, existing.yearly_values),
        }
      }

      return {
        location_id: location.id,
        manual_enabled: false,
        auto_annual: autoAnnual,
        yearly_values: buildEmptyYearMap(operationalYears),
      }
    })

    setState({ opex_data: synced })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.locations.length, state.capex_data.map((entry) => `${entry.location_id}:${entry.total}`).join('|'), operationalYears.join(',')])

  const handleChange = (updated: OpexLocationData) => {
    setState({
      opex_data: state.opex_data.map((entry) =>
        entry.location_id === updated.location_id ? updated : entry,
      ),
    })
  }

  const totalCapex = state.capex_data.reduce((sum, entry) => sum + parseIT(entry.total || ''), 0)
  const totalAutoAnnual = state.opex_data.reduce((sum, entry) => sum + parseIT(entry.auto_annual || ''), 0)

  return (
    <div>
      <WizardStepHeader
        title="Definisci l'OPEX dell'intervento"
        description="L'OPEX viene stimato automaticamente come 3% del CAPEX annuo di esercizio. Se vuoi maggiore precisione, puoi sostituire la stima con un dettaglio puntuale sui 25 anni successivi al cantiere."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.8fr)_320px]">
        <div>
          <WizardSectionCard
            title="OPEX automatico e dettaglio annuale"
            subtitle="La stima automatica è subito disponibile. L'inserimento puntuale è facoltativo e sostituisce il totale automatico solo quando compili i valori annuali."
          >
            {state.opex_data.length === 0 ? (
              <p className="text-sm text-gray-500">
                Nessuna localizzazione configurata. Torna allo step precedente per aggiungere delle localizzazioni.
              </p>
            ) : (
              state.opex_data.map((locationData) => {
                const location = state.locations.find((entry) => entry.id === locationData.location_id)
                const address = location?.address || locationData.location_id

                return (
                  <OpexLocationCard
                    key={locationData.location_id}
                    data={locationData}
                    address={address}
                    years={operationalYears}
                    onChange={handleChange}
                  />
                )
              })
            )}
          </WizardSectionCard>
        </div>

        <div>
          <OpexMethodInfoCard
            totalCapex={totalCapex}
            totalAutoAnnual={totalAutoAnnual}
            operationalYears={operationalYears}
          />
        </div>
      </div>
    </div>
  )
}
