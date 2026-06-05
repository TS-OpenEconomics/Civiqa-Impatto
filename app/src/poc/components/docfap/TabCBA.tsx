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

function fmtCurrency(value: unknown): string {
  return `${(safeNumber(value) / 1_000_000).toLocaleString('it-IT', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} M€`
}

function fmtPercent(value: unknown): string {
  return `${(safeNumber(value) * 100).toFixed(1)}%`
}

export function TabCBA() {
  const state = useSyncExternalStore(wizardStore.subscribe, wizardStore.getState, wizardStore.getState)
  const scores = state.scoreFinale ?? []
  const recommendedId = getRecommendedAlternativeId(scores)
  if (scores.length === 0) return <p style={emptyStyle}>Nessun dettaglio Analisi Costi Benefici disponibile.</p>

  const groups = scores.map((score) => ({
    id: score.alternativaId,
    label: getAlternativeDisplayLabel(score.alternativaId, state.alternative[score.alternativaId]),
    bars: [{ value: Number((safeNumber(score.van) / 1_000_000).toFixed(1)), color: altBarColor(score.alternativaId === recommendedId) }],
  }))
  const fmtM = (v: number) => `${v.toLocaleString('it-IT', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} M€`

  return (
    <div style={tabStackStyle}>
      <ChartCard title="VANE per alternativa" subtitle="Valore Attuale Netto Economico (M€) — in verde l'alternativa raccomandata">
        <BarsChart groups={groups} formatValue={fmtM} />
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
            <th scope="row" style={rowHeaderStyle}>VANE (M€)</th>
            {scores.map((score) => {
              const isRecommended = score.alternativaId === recommendedId
              return <td key={`van-${score.alternativaId}`} style={{ ...bodyCellStyle, ...(isRecommended ? recommendedColumnStyle : null) }}>{fmtCurrency(score.van)}</td>
            })}
          </tr>
          <tr>
            <th scope="row" style={rowHeaderStyle}>TIRE (%)</th>
            {scores.map((score) => {
              const isRecommended = score.alternativaId === recommendedId
              return <td key={`tir-${score.alternativaId}`} style={{ ...bodyCellStyle, ...(isRecommended ? recommendedColumnStyle : null) }}>{fmtPercent(score.tir)}</td>
            })}
          </tr>
          <tr>
            <th scope="row" style={rowHeaderStyle}>BCR (rapporto benefici/costi)</th>
            {scores.map((score) => {
              const isRecommended = score.alternativaId === recommendedId
              return <td key={`bcr-${score.alternativaId}`} style={{ ...bodyCellStyle, ...(isRecommended ? recommendedColumnStyle : null) }}>{safeNumber(score.bcr).toFixed(2)}</td>
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
