// Dati condivisi per i ResultBox delle analisi DOCFAP.
// Usato sia dai risultati DOCFAP (DocfapDetail) sia dallo step finale del wizard
// (Step7_ScoreFinale), così le tabelle a confronto risultano identiche.
import type { AlternativaData, AlternativaId, ScoreComposito } from '../../types/docfap'
import { MC_MOCK_DATA } from '../../engine/riskMonteCarlo'
import { formatEuro } from '../../utils/format'
import { getAlternativeDisplayLabel, safeNumber, RISK_METRIC_LABELS, RISK_METRIC_HINTS } from './tableHelpers'
import type { ResultBoxMetric, ResultBoxOption } from './ResultBox'

export type DimensionKey = 'impatto' | 'cba' | 'mca' | 'rischio'

// ── Formatters ──────────────────────────────────────────────────────────────────
export function nf(value: number, decimals = 1): string {
  return safeNumber(value).toLocaleString('it-IT', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}
export const fmtScore = (v: number) => `${nf(v, 1)} / 100`
export const fmtEuroM = (vEuro: number) => `${nf(safeNumber(vEuro) / 1_000_000, 1)} M EUR`
export const fmtM = (vMln: number) => `${nf(vMln, 1)} M EUR`
export const fmtPct = (v: number) => `${nf(v, 1)}%`
export const fmtInt = (v: number) => safeNumber(v).toLocaleString('it-IT')

export function giudizioMca(score: number): string {
  const s = safeNumber(score)
  if (s >= 75) return 'Elevato'
  if (s >= 50) return 'Adeguato'
  return 'Limitato'
}

// ── Opzioni (colonne) ─────────────────────────────────────────────────────────
export function buildResultBoxOptions(
  orderedScores: ScoreComposito[],
  recommendedId: AlternativaId | null,
  alternative: Partial<Record<AlternativaId, AlternativaData>>,
): ResultBoxOption[] {
  return orderedScores.map((score) => {
    const alt = alternative[score.alternativaId]
    const details: ResultBoxOption['details'] = []
    if (alt?.capex != null) details.push({ label: 'CAPEX', value: `EUR ${formatEuro(alt.capex)}` })
    if (alt?.opex != null) details.push({ label: 'OPEX', value: `EUR ${formatEuro(alt.opex)}` })
    if (alt?.durataStimata) details.push({ label: 'Durata', value: `${alt.durataStimata} mesi` })
    return {
      id: score.alternativaId,
      label: getAlternativeDisplayLabel(score.alternativaId, alt),
      isRecommended: score.alternativaId === recommendedId,
      details,
    }
  })
}

// ── Metriche (righe) per dimensione ─────────────────────────────────────────────
export function buildDimensionMetrics(dimension: DimensionKey, orderedScores: ScoreComposito[]): ResultBoxMetric[] {
  const vals = (fn: (s: ScoreComposito) => string): string[] => orderedScores.map(fn)
  const barVals = (fn: (s: ScoreComposito) => number): number[] => orderedScores.map((s) => safeNumber(fn(s)))

  if (dimension === 'impatto') {
    return [
      { label: 'Punteggio impatto', values: vals((s) => fmtScore(s.impattoScore)), emphasize: true, barValues: barVals((s) => s.impattoScore) },
      { label: 'PIL attivato', values: vals((s) => fmtM(s.pil)) },
      { label: 'Occupati (ETP)', values: vals((s) => fmtInt(s.occupati)) },
      { label: 'Valore produzione', values: vals((s) => fmtM(s.produzione)) },
    ]
  }
  if (dimension === 'cba') {
    return [
      { label: 'Punteggio CBA', values: vals((s) => fmtScore(s.cbaScore)), emphasize: true, barValues: barVals((s) => s.cbaScore) },
      { label: 'VANE', values: vals((s) => fmtEuroM(s.van)) },
      { label: 'TIRE', values: vals((s) => fmtPct(s.tir)) },
      { label: 'Rapporto B/C', values: vals((s) => nf(s.bcr, 2)) },
    ]
  }
  if (dimension === 'mca') {
    return [
      { label: 'Punteggio MCA', values: vals((s) => fmtScore(s.mcaScore)), emphasize: true, barValues: barVals((s) => s.mcaScore) },
      { label: 'Giudizio sintetico', values: vals((s) => giudizioMca(s.mcaScore)) },
    ]
  }
  // rischio (i valori MC sono in k€ → /1000 per i M€)
  const summaryOf = (s: ScoreComposito) => MC_MOCK_DATA[s.alternativaId]?.summary
  return [
    { label: RISK_METRIC_LABELS.score, values: vals((s) => fmtScore(s.sensitivityScore)), emphasize: true, barValues: barVals((s) => s.sensitivityScore) },
    { label: RISK_METRIC_LABELS.probBest, hint: RISK_METRIC_HINTS.probBest, values: vals((s) => { const m = summaryOf(s); return m ? fmtPct(m.probBest * 100) : '—' }) },
    { label: RISK_METRIC_LABELS.median, hint: RISK_METRIC_HINTS.median, values: vals((s) => { const m = summaryOf(s); return m ? fmtM(m.p50 / 1000) : '—' }) },
    { label: RISK_METRIC_LABELS.ci90, hint: RISK_METRIC_HINTS.ci90, values: vals((s) => { const m = summaryOf(s); return m ? `${nf(m.p5 / 1000, 1)} – ${nf(m.p95 / 1000, 1)} M€` : '—' }) },
    { label: RISK_METRIC_LABELS.loss, hint: RISK_METRIC_HINTS.loss, values: vals((s) => { const m = summaryOf(s); return m ? fmtPct(m.probNegative * 100) : '—' }) },
  ]
}
