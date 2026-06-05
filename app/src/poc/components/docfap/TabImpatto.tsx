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
import { CHART_SERIES_COLORS, BarsChart, ChartCard, tabStackStyle } from './chartHelpers'

function fmtM(value: unknown): string {
  return `${safeNumber(value).toLocaleString('it-IT', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} M€`
}

export function TabImpatto() {
  const state = useSyncExternalStore(wizardStore.subscribe, wizardStore.getState, wizardStore.getState)
  const scores = state.scoreFinale ?? []
  const recommendedId = getRecommendedAlternativeId(scores)
  if (scores.length === 0) return <p style={emptyStyle}>Nessun dettaglio impatto disponibile.</p>

  const groups = scores.map((score) => ({
    id: score.alternativaId,
    label: getAlternativeDisplayLabel(score.alternativaId, state.alternative[score.alternativaId]),
    bars: [
      { value: safeNumber(score.pil), color: CHART_SERIES_COLORS[0], name: 'PIL' },
      { value: safeNumber(score.produzione), color: CHART_SERIES_COLORS[1], name: 'Produzione' },
      { value: safeNumber(score.redditi), color: CHART_SERIES_COLORS[2], name: 'Redditi' },
    ],
  }))

  return (
    <div style={tabStackStyle}>
      <ChartCard title="Impatto macroeconomico per alternativa" subtitle="PIL, Produzione e Redditi attivati (M€)">
        <BarsChart
          groups={groups}
          formatValue={fmtM}
          legend={[
            { label: 'PIL', color: CHART_SERIES_COLORS[0] },
            { label: 'Produzione', color: CHART_SERIES_COLORS[1] },
            { label: 'Redditi', color: CHART_SERIES_COLORS[2] },
          ]}
        />
      </ChartCard>

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
          <tr>
            <th scope="row" style={rowHeaderStyle}>PIL (M€)</th>
            {scores.map((score) => {
              const isRecommended = score.alternativaId === recommendedId
              return <td key={`pil-${score.alternativaId}`} style={{ ...bodyCellStyle, ...(isRecommended ? recommendedColumnStyle : null) }}>{fmtM(score.pil)}</td>
            })}
          </tr>
          <tr>
            <th scope="row" style={rowHeaderStyle}>Occupati (ETP)</th>
            {scores.map((score) => {
              const isRecommended = score.alternativaId === recommendedId
              return <td key={`occ-${score.alternativaId}`} style={{ ...bodyCellStyle, ...(isRecommended ? recommendedColumnStyle : null) }}>{safeNumber(score.occupati).toLocaleString('it-IT')}</td>
            })}
          </tr>
          <tr>
            <th scope="row" style={rowHeaderStyle}>Produzione (M€)</th>
            {scores.map((score) => {
              const isRecommended = score.alternativaId === recommendedId
              return <td key={`prod-${score.alternativaId}`} style={{ ...bodyCellStyle, ...(isRecommended ? recommendedColumnStyle : null) }}>{fmtM(score.produzione)}</td>
            })}
          </tr>
          <tr>
            <th scope="row" style={rowHeaderStyle}>Redditi (M€)</th>
            {scores.map((score) => {
              const isRecommended = score.alternativaId === recommendedId
              return <td key={`redditi-${score.alternativaId}`} style={{ ...bodyCellStyle, ...(isRecommended ? recommendedColumnStyle : null) }}>{fmtM(score.redditi)}</td>
            })}
          </tr>
          <tr>
            <th scope="row" style={finalRowHeaderStyle}>Punteggio Finale</th>
            {scores.map((score) => {
              const isRecommended = score.alternativaId === recommendedId
              return <td key={`final-${score.alternativaId}`} style={{ ...finalCellStyle, ...(isRecommended ? recommendedHeaderStyle : null) }}>{formatScore(score.scoreFinale)}</td>
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
