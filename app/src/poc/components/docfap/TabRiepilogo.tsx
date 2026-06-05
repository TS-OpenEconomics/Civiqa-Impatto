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
import { BarsChart, ChartCard, altBarColor, tabStackStyle } from './chartHelpers'

const ROWS = [
  { key: 'cbaScore', label: 'Punteggio Analisi Costi Benefici' },
  { key: 'impattoScore', label: "Punteggio Analisi d'impatto" },
  { key: 'rischioScore', label: 'Punteggio Analisi del Rischio' },
  { key: 'sensitivityScore', label: 'Punteggio Analisi di Sensitività' },
] as const

function fmt(value: unknown): string {
  return formatScore(value)
}

export function TabRiepilogo() {
  const state = useSyncExternalStore(wizardStore.subscribe, wizardStore.getState, wizardStore.getState)
  const scores = state.scoreFinale ?? []
  const recommendedId = getRecommendedAlternativeId(scores)

  if (scores.length === 0) return <p style={emptyStyle}>Nessun risultato disponibile.</p>

  const groups = scores.map((score) => ({
    id: score.alternativaId,
    label: getAlternativeDisplayLabel(score.alternativaId, state.alternative[score.alternativaId]),
    bars: [{ value: Number(safeNumber(score.scoreFinale).toFixed(1)), color: altBarColor(score.alternativaId === recommendedId) }],
  }))

  return (
    <div style={tabStackStyle}>
      <ChartCard title="Punteggio finale per alternativa" subtitle="Punteggio composito 0–100 — in verde l'alternativa raccomandata">
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
          {ROWS.map((row) => (
            <tr key={row.key}>
              <th scope="row" style={rowHeaderStyle}>{row.label}</th>
              {scores.map((score) => {
                const isRecommended = score.alternativaId === recommendedId
                return (
                  <td key={`${row.key}-${score.alternativaId}`} style={{ ...bodyCellStyle, ...(isRecommended ? recommendedColumnStyle : null) }}>
                    {fmt(score[row.key])}
                  </td>
                )
              })}
            </tr>
          ))}
          <tr>
            <th scope="row" style={finalRowHeaderStyle}>Punteggio Finale</th>
            {scores.map((score) => {
              const isRecommended = score.alternativaId === recommendedId
              return (
                <td key={`final-${score.alternativaId}`} style={{ ...finalCellStyle, ...(isRecommended ? recommendedHeaderStyle : null) }}>
                  {fmt(score.scoreFinale)}
                </td>
              )
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
