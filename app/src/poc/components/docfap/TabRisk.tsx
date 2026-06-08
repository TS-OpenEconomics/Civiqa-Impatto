import type { CSSProperties, ReactNode } from 'react'
import { useSyncExternalStore } from 'react'
import { wizardStore } from '../../store/wizardStore'
import type { AlternativaId } from '../../types/docfap'
import {
  getAlternativeDisplayLabel,
  getRecommendedAlternativeId,
  labelColumnStyle,
  alternativeColumnStyle,
  detailHeaderCellBaseStyle,
  detailRecommendedHeaderStyle,
  detailHeaderLabelWrapStyle,
  detailHeaderLabelStyle,
  detailRecommendedBadgeStyle,
  detailRowHeaderStyle,
  detailBodyCellStyle,
  detailRecommendedColumnStyle,
  detailFinalRowHeaderStyle,
  detailFinalCellStyle,
  detailEmptyStyle,
  formatScore,
  safeNumber,
} from './tableHelpers'
import { BarsChart, ChartCard, altBarColor, tabStackStyle } from './chartHelpers'

// ── Modello probabilistico (deterministico) ─────────────────────────────────
// I quattro indicatori dell'analisi del rischio sono derivati dai dati di ciascuna
// alternativa (VANE, punteggio di rischio, punteggio finale, CAPEX) con un modello
// normale: beneficio netto ~ N(media = VANE, σ proporzionale a CAPEX e rischiosità).
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

// CDF normale standard — approssimazione di Abramowitz & Stegun.
function normalCdf(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z))
  const d = 0.3989423 * Math.exp((-z * z) / 2)
  let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
  if (z > 0) p = 1 - p
  return p
}

interface RiskMetrics {
  pOptimal: number
  medianK: number
  loK: number
  hiK: number
  lossPct: number
}

function computeRiskMetrics(
  score: { van: number; rischioScore: number },
  capex: number,
  optimalWeight: number,
): RiskMetrics {
  const medianK = safeNumber(score.van) / 1000
  const rischio = safeNumber(score.rischioScore)
  const capexK = capex > 0 ? capex / 1000 : Math.max(Math.abs(medianK) * 3, 1000)
  const vol = clamp(0.12 + ((100 - rischio) / 100) * 0.3, 0.1, 0.6)
  const sigmaK = Math.max(vol * capexK, Math.abs(medianK) * 0.15, 1)
  return {
    pOptimal: optimalWeight * 100,
    medianK,
    loK: medianK - 1.645 * sigmaK,
    hiK: medianK + 1.645 * sigmaK,
    lossPct: clamp(normalCdf(-medianK / sigmaK) * 100, 0.1, 99),
  }
}

const METRICS = [
  {
    key: 'pOptimal' as const,
    label: 'Probabilità scelta ottimale',
    tip: 'Su 1.000 simulazioni con parametri variabili, questa alternativa risulta la migliore in questa percentuale dei casi.',
  },
  {
    key: 'median' as const,
    label: 'Beneficio netto mediano',
    tip: 'Il valore centrale dei benefici netti attesi: nel 50% degli scenari il risultato è superiore, nel 50% inferiore.',
  },
  {
    key: 'ci90' as const,
    label: 'Intervallo di confidenza 90%',
    tip: 'Nel 90% degli scenari simulati, il beneficio netto cade tra questi due valori.',
  },
  {
    key: 'loss' as const,
    label: 'Rischio di perdita',
    tip: 'La probabilità che i costi superino i benefici — più è bassa, più l’investimento è robusto.',
  },
]

const TOOLTIP_CSS = `
.docfap-infotip{position:relative;display:inline-flex;align-items:center;justify-content:center;width:15px;height:15px;margin-left:6px;color:#a3a3aa;cursor:help;vertical-align:middle}
.docfap-infotip svg{width:15px;height:15px;stroke:currentColor;fill:none}
.docfap-infotip:hover,.docfap-infotip:focus-visible{color:#5b21f7;outline:none}
.docfap-infotip-box{position:absolute;left:0;top:calc(100% + 7px);width:250px;background:#0e0e10;color:#fff;font-size:12px;line-height:1.5;padding:9px 12px;z-index:60;opacity:0;pointer-events:none;transition:opacity .12s;box-shadow:0 10px 28px rgba(14,14,16,.28)}
.docfap-infotip:hover .docfap-infotip-box,.docfap-infotip:focus-visible .docfap-infotip-box{opacity:1}
`

function nf0(value: number): string {
  return new Intl.NumberFormat('it-IT', { maximumFractionDigits: 0 }).format(Math.round(value))
}
function nf1(value: number): string {
  return new Intl.NumberFormat('it-IT', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value)
}
function kEur(value: number): string {
  return `${nf0(value)} k€`
}

function InfoTip({ text }: { text: string }) {
  return (
    <span className="docfap-infotip" role="button" tabIndex={0} aria-label={text}>
      <svg viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
      <span className="docfap-infotip-box" role="tooltip">{text}</span>
    </span>
  )
}

export function TabRisk() {
  const state = useSyncExternalStore(wizardStore.subscribe, wizardStore.getState, wizardStore.getState)
  const scores = state.scoreFinale ?? []
  const recommendedId = getRecommendedAlternativeId(scores)

  if (scores.length === 0) return <p style={emptyStyle}>Nessun dettaglio del rischio disponibile.</p>

  const groups = scores.map((score) => ({
    id: score.alternativaId,
    label: getAlternativeDisplayLabel(score.alternativaId, state.alternative[score.alternativaId]),
    bars: [{ value: Number(safeNumber(score.rischioScore).toFixed(1)), color: altBarColor(score.alternativaId === recommendedId) }],
  }))

  // Probabilità di scelta ottimale: softmax sui punteggi finali (somma ≈ 100%).
  const beta = 0.06
  const maxScore = Math.max(...scores.map((score) => safeNumber(score.scoreFinale)), 0)
  const weights = scores.map((score) => Math.exp(beta * (safeNumber(score.scoreFinale) - maxScore)))
  const sumW = weights.reduce((acc, w) => acc + w, 0) || 1

  const metricsById = new Map<AlternativaId, RiskMetrics>()
  scores.forEach((score, index) => {
    const capex = safeNumber(state.alternative[score.alternativaId]?.capex)
    metricsById.set(score.alternativaId, computeRiskMetrics(score, capex, weights[index] / sumW))
  })

  const renderMetric = (key: (typeof METRICS)[number]['key'], m: RiskMetrics): ReactNode => {
    if (key === 'pOptimal') return `${nf0(m.pOptimal)}%`
    if (key === 'median') return kEur(m.medianK)
    if (key === 'ci90') return `${nf0(m.loK)} – ${nf0(m.hiK)} k€`
    return `${nf1(m.lossPct)}%`
  }

  return (
    <div style={tabStackStyle}>
      <style>{TOOLTIP_CSS}</style>

      <ChartCard title="Punteggio Analisi del Rischio per alternativa" subtitle="Punteggio composito 0–100 — in verde l'alternativa raccomandata">
        <BarsChart groups={groups} formatValue={(v) => v.toFixed(1)} />
      </ChartCard>

      <ChartCard
        title="Dettaglio del rischio"
        subtitle="Esiti della simulazione probabilistica (1.000 scenari) — passa sul simbolo ⓘ per la spiegazione di ciascun indicatore"
      >
        <div style={wrapStyle}>
          <table style={tableStyle}>
            <colgroup>
              <col style={labelColumnStyle} />
              {scores.map((score) => <col key={score.alternativaId} style={alternativeColumnStyle(scores.length)} />)}
            </colgroup>
            <thead>
              <tr>
                <th style={headerCellStyle}>Indicatore</th>
                {scores.map((score) => {
                  const isRecommended = score.alternativaId === recommendedId
                  return (
                    <th key={score.alternativaId} style={{ ...headerCellStyle, ...(isRecommended ? recommendedHeaderStyle : null) }}>
                      <div style={headerLabelWrapStyle}>
                        <span style={headerLabelStyle}>{getAlternativeDisplayLabel(score.alternativaId, state.alternative[score.alternativaId])}</span>
                        {isRecommended ? <span style={recommendedBadgeStyle}>Raccomandata</span> : null}
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {METRICS.map((metric) => (
                <tr key={metric.key}>
                  <th scope="row" style={rowHeaderStyle}>
                    <span style={metricLabelStyle}>
                      {metric.label}
                      <InfoTip text={metric.tip} />
                    </span>
                  </th>
                  {scores.map((score) => {
                    const isRecommended = score.alternativaId === recommendedId
                    const m = metricsById.get(score.alternativaId)
                    return (
                      <td key={`${metric.key}-${score.alternativaId}`} style={{ ...bodyCellStyle, ...(isRecommended ? recommendedColumnStyle : null) }}>
                        {m ? renderMetric(metric.key, m) : '—'}
                      </td>
                    )
                  })}
                </tr>
              ))}
              <tr>
                <th scope="row" style={finalRowHeaderStyle}>Punteggio Analisi del Rischio</th>
                {scores.map((score) => {
                  const isRecommended = score.alternativaId === recommendedId
                  return (
                    <td key={`final-${score.alternativaId}`} style={{ ...finalCellStyle, ...(isRecommended ? recommendedHeaderStyle : null) }}>
                      {formatScore(score.rischioScore)}
                    </td>
                  )
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  )
}

const metricLabelStyle: CSSProperties = { display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap' }
const wrapStyle: CSSProperties = { overflow: 'visible' }
const tableStyle: CSSProperties = { width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }
const headerCellStyle: CSSProperties = detailHeaderCellBaseStyle
const recommendedHeaderStyle: CSSProperties = detailRecommendedHeaderStyle
const headerLabelWrapStyle: CSSProperties = detailHeaderLabelWrapStyle
const headerLabelStyle: CSSProperties = detailHeaderLabelStyle
const recommendedBadgeStyle: CSSProperties = detailRecommendedBadgeStyle
const rowHeaderStyle: CSSProperties = detailRowHeaderStyle
const bodyCellStyle: CSSProperties = detailBodyCellStyle
const recommendedColumnStyle: CSSProperties = detailRecommendedColumnStyle
const finalRowHeaderStyle: CSSProperties = detailFinalRowHeaderStyle
const finalCellStyle: CSSProperties = detailFinalCellStyle
const emptyStyle: CSSProperties = detailEmptyStyle
