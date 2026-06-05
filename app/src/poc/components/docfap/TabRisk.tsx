import type { CSSProperties } from 'react'
import { useSyncExternalStore } from 'react'
import { CLUSTER_MCA } from '../../data/mca/clusters'
import { wizardStore } from '../../store/wizardStore'
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

const LEVEL_TO_MULTIPLIER = {
  alto: 1.0,
  medio: 0.6,
  basso: 0.2,
  nullo: 0,
} as const

function parsePercent(value: string | number): number {
  if (typeof value === 'number') return value
  const parsed = Number.parseFloat(value.replace('%', '').replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : 0
}

export function TabRisk() {
  const state = useSyncExternalStore(wizardStore.subscribe, wizardStore.getState, wizardStore.getState)
  const scores = state.scoreFinale ?? []
  const recommendedId = getRecommendedAlternativeId(scores)
  const cluster = state.clusterId ? CLUSTER_MCA[state.clusterId] : null
  const fattori = cluster?.fattoriRischio ?? []

  if (scores.length === 0 || fattori.length === 0) return <p style={emptyStyle}>Nessun dettaglio rischio disponibile.</p>

  const groups = scores.map((score) => ({
    id: score.alternativaId,
    label: getAlternativeDisplayLabel(score.alternativaId, state.alternative[score.alternativaId]),
    bars: [{ value: Number(safeNumber(score.rischioScore).toFixed(1)), color: altBarColor(score.alternativaId === recommendedId) }],
  }))

  return (
    <div style={tabStackStyle}>
      <ChartCard title="Punteggio rischio per alternativa" subtitle="Punteggio analisi del rischio 0–100 — in verde l'alternativa raccomandata">
        <BarsChart groups={groups} formatValue={(v) => v.toFixed(1)} />
      </ChartCard>

      <div style={wrapStyle}>
      <table style={tableStyle}>
        <colgroup>
          <col style={labelColumnStyle} />
          {scores.map((score) => <col key={score.alternativaId} style={alternativeColumnStyle(scores.length)} />)}
        </colgroup>
        <thead>
          <tr>
            <th style={headerCellStyle}>Fattore di rischio</th>
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
          {fattori.map((fattore) => {
            const peso = parsePercent(fattore.pesoDefault)
            return (
              <tr key={fattore.id}>
                <th scope="row" style={rowHeaderStyle}>{fattore.fattore}</th>
                {scores.map((score) => {
                  const isRecommended = score.alternativaId === recommendedId
                  const livello = state.rischiScores[score.alternativaId]?.[fattore.id] as keyof typeof LEVEL_TO_MULTIPLIER | undefined
                  const value = Math.round(peso * (livello ? LEVEL_TO_MULTIPLIER[livello] : 0))
                  return <td key={`${fattore.id}-${score.alternativaId}`} style={{ ...bodyCellStyle, ...(isRecommended ? recommendedColumnStyle : null) }}>{value}</td>
                })}
              </tr>
            )
          })}
          <tr>
            <th scope="row" style={finalRowHeaderStyle}>PUNTEGGIO ANALISI DEL RISCHIO</th>
            {scores.map((score) => {
              const isRecommended = score.alternativaId === recommendedId
              return <td key={`risk-${score.alternativaId}`} style={{ ...finalCellStyle, ...(isRecommended ? recommendedHeaderStyle : null) }}>{formatScore(score.rischioScore)}</td>
            })}
          </tr>
        </tbody>
      </table>
      </div>
    </div>
  )
}

const wrapStyle: CSSProperties = { overflowX: 'auto' }
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
