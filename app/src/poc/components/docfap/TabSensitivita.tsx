import type { CSSProperties } from 'react'
import { useSyncExternalStore } from 'react'
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
import { CHART_RECOMMENDED_COLOR, CHART_SERIES_COLORS, ChartCard, LineChartSimple, tabStackStyle } from './chartHelpers'

const SCENARIO_ORDER = [
  'CAPEX +10%',
  'CAPEX +20%',
  'CAPEX -10%',
  'Tasso sconto +0.5%',
  'Tasso sconto -0.5%',
  'Benefici +15%',
  'Benefici -15%',
]

export function TabSensitivita() {
  const state = useSyncExternalStore(wizardStore.subscribe, wizardStore.getState, wizardStore.getState)
  const scores = state.scoreFinale ?? []
  const recommendedId = getRecommendedAlternativeId(scores)
  if (scores.length === 0) return <p style={emptyStyle}>Nessun dettaglio sensitivita disponibile.</p>

  const lines = scores.map((score, index) => ({
    id: score.alternativaId,
    label: getAlternativeDisplayLabel(score.alternativaId, state.alternative[score.alternativaId]),
    color: score.alternativaId === recommendedId ? CHART_RECOMMENDED_COLOR : CHART_SERIES_COLORS[index % CHART_SERIES_COLORS.length],
    width: score.alternativaId === recommendedId ? 3 : 2,
    points: SCENARIO_ORDER.map((label) => {
      const scenario = score.sensitivitaDetail?.scenari.find((item) => item.label === label)
      return scenario ? Number(safeNumber(scenario.score).toFixed(1)) : null
    }),
  }))

  return (
    <div style={tabStackStyle}>
      <ChartCard title="Stabilità del punteggio per scenario di stress" subtitle="Punteggio composito (0–100) di ogni alternativa al variare dei parametri chiave" height={320}>
        <LineChartSimple categories={SCENARIO_ORDER} lines={lines} />
      </ChartCard>

      <div style={wrapStyle}>
      <table style={tableStyle}>
        <colgroup>
          <col style={labelColumnStyle} />
          {scores.map((score) => <col key={score.alternativaId} style={alternativeColumnStyle(scores.length)} />)}
        </colgroup>
        <thead>
          <tr>
            <th style={headerCellStyle}>Scenario</th>
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
          {SCENARIO_ORDER.map((label) => (
            <tr key={label}>
              <th scope="row" style={rowHeaderStyle}>{label}</th>
              {scores.map((score) => {
                const isRecommended = score.alternativaId === recommendedId
                const scenario = score.sensitivitaDetail?.scenari.find((item) => item.label === label)
                return <td key={`${label}-${score.alternativaId}`} style={{ ...bodyCellStyle, ...(isRecommended ? recommendedColumnStyle : null) }}>{scenario ? formatScore(scenario.score) : '—'}</td>
              })}
            </tr>
          ))}
          <tr>
            <th scope="row" style={finalRowHeaderStyle}>PUNTEGGIO ANALISI DI SENSITIVITÀ</th>
            {scores.map((score) => {
              const isRecommended = score.alternativaId === recommendedId
              return <td key={`sens-${score.alternativaId}`} style={{ ...finalCellStyle, ...(isRecommended ? recommendedHeaderStyle : null) }}>{formatScore(score.sensitivityScore)}</td>
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
