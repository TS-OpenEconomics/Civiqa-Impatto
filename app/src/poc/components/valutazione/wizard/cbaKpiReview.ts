import { getCbaKpiCatalog } from '../../../data/cba/kpiCatalog.js'
import type {
  CbaBenefitSeriesInput,
  CbaKpiRow,
  ValutazioneWizardState,
} from '../../../contexts/ValutazioneWizardContext.js'

const CBA_KPI_REVIEW_YEARS = 25

export interface CbaKpiReviewState {
  years: number[]
  rows: CbaKpiRow[]
  distribution: Record<string, Record<number, string>>
  lastMode: 'auto' | 'manual' | null
}

function clampToPositiveInteger(value: number | null | undefined): number {
  if (!Number.isFinite(value)) return 1
  return Math.max(1, Math.round(value ?? 1))
}

function buildEmptyDistribution(rows: CbaKpiRow[], years: number[]): Record<string, Record<number, string>> {
  return rows.reduce<Record<string, Record<number, string>>>((acc, row) => {
    if (!row.editable) return acc
    acc[row.id] = years.reduce<Record<number, string>>((yearAcc, year) => {
      yearAcc[year] = ''
      return yearAcc
    }, {})
    return acc
  }, {})
}

export function buildCbaKpiYears(updateYear: number): number[] {
  return Array.from({ length: CBA_KPI_REVIEW_YEARS }, (_, index) => updateYear + index)
}

export function buildInitialCbaKpiReviewState(
  state: Pick<
    ValutazioneWizardState,
    'update_year' | 'target_quantity' | 'sector_id' | 'subsector_id' | 'category_id' | 'intervention_type_id'
  >,
): CbaKpiReviewState {
  const years = buildCbaKpiYears(state.update_year)
  const quantityFactor = Math.max(1, Math.ceil(clampToPositiveInteger(state.target_quantity) / 100))
  const rows = getCbaKpiCatalog().flatMap((section) =>
    section.rows.map((row) => ({
      ...row,
      estimated_annual_value: row.estimated_annual_value * quantityFactor,
    })),
  )

  return {
    years,
    rows,
    distribution: buildEmptyDistribution(rows, years),
    lastMode: null,
  }
}

export function applyEstimatedValuesToAllYears(
  rows: CbaKpiRow[],
  years: number[],
): Record<string, Record<number, string>> {
  return rows.reduce<Record<string, Record<number, string>>>((acc, row) => {
    if (!row.editable) return acc
    acc[row.id] = years.reduce<Record<number, string>>((yearAcc, year) => {
      yearAcc[year] = String(row.estimated_annual_value)
      return yearAcc
    }, {})
    return acc
  }, {})
}

export function clearCbaKpiDistribution(
  rows: CbaKpiRow[],
  years: number[],
): Record<string, Record<number, string>> {
  return buildEmptyDistribution(rows, years)
}

export function isCbaKpiDistributionComplete(
  rows: CbaKpiRow[],
  years: number[],
  distribution: Record<string, Record<number, string>>,
): boolean {
  return rows
    .filter((row) => row.editable)
    .every((row) =>
      years.every((year) => {
        const value = distribution[row.id]?.[year]
        return typeof value === 'string' && value.trim().length > 0
      }),
    )
}

export function mapCbaKpiDistributionToBenefitSeries(
  rows: CbaKpiRow[],
  years: number[],
  distribution: Record<string, Record<number, string>>,
): CbaBenefitSeriesInput[] {
  return rows
    .filter((row) => row.editable)
    .map((row) => ({
      kpi_id: row.id,
      yearly_values: years.reduce<Record<number, number>>((acc, year) => {
        const raw = distribution[row.id]?.[year] ?? '0'
        const normalized = Number(raw.replace(/\./g, '').replace(',', '.'))
        acc[year] = Number.isFinite(normalized) ? normalized : 0
        return acc
      }, {}),
    }))
}
