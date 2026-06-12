import type { CSSProperties } from 'react'
import { useSyncExternalStore } from 'react'
import { wizardStore } from '../../store/wizardStore'
import {
  getAlternativeDisplayLabel,
  getRecommendedAlternativeId,
  getDefinedScores,
  getDetailFinalRecommendedCellStyle,
  labelColumnStyle,
  alternativeColumnStyle,
  detailHeaderCellBaseStyle,
  detailRecommendedHeaderStyle,
  detailHeaderLabelWrapStyle,
  detailHeaderLabelStyle,
  detailAltHeaderContentStyle,
  detailAltBadgeStyle,
  detailRecommendedAltBadgeStyle,
  detailRecommendedBadgeStyle,
  detailRowHeaderStyle,
  detailBodyCellStyle,
  detailRecommendedColumnStyle,
  detailBestCellStyle,
  detailFinalRowHeaderStyle,
  detailEmptyStyle,
  detailTableWrapStyle,
} from './tableHelpers'
import { CbaWaterfallChart } from './charts/CbaWaterfallChart'
import { CbaTrendlineChart } from './charts/CbaTrendlineChart'

function fmtEuro(value: number): string {
  return `${(value / 1_000_000).toLocaleString('it-IT', { maximumFractionDigits: 1 })} M€`
}

function fmtPct(value: number): string {
  return `${(value * 100).toFixed(1)} %`
}

export function TabCBA() {
  const state = useSyncExternalStore(wizardStore.subscribe, wizardStore.getState, wizardStore.getState)
  const scores = getDefinedScores(state.scoreFinale, state.alternativeDefinite)
  const recommendedId = getRecommendedAlternativeId(scores)

  if (scores.length === 0) return <p style={emptyStyle}>Nessun dettaglio CBA disponibile.</p>

  const rows: { key: string; label: string; value: (s: typeof scores[0]) => number; get: (s: typeof scores[0]) => string }[] = [
    { key: 'vane', label: 'VANE', value: s => s.van, get: s => fmtEuro(s.van) },
    { key: 'tire', label: 'TIRE', value: s => s.tir, get: s => fmtPct(s.tir) },
    { key: 'bcr',  label: 'BCR (benefici / costi)', value: s => s.bcr, get: s => s.bcr.toFixed(2) },
  ]

  return (
    <div style={sectionWrapStyle}>
      <p style={metaStyle}>
        Orizzonte: {scores[0]?.orizzonte ?? '—'} anni · Tasso di sconto: {scores[0] ? fmtPct(scores[0].tassoSconto) : '—'}
      </p>
      <div style={detailTableWrapStyle}>
        <table style={tableStyle}>
          <colgroup>
            <col style={labelColumnStyle} />
            {scores.map(s => <col key={s.alternativaId} style={alternativeColumnStyle(scores.length)} />)}
          </colgroup>
          <thead>
            <tr>
              <th style={headerCellStyle}>Indicatore</th>
              {scores.map(s => {
                const isRec = s.alternativaId === recommendedId
                return (
                  <th key={s.alternativaId} style={{ ...headerCellStyle, ...(isRec ? recommendedHeaderStyle : null) }}>
                    <div style={headerLabelWrapStyle}>
                      <div style={detailAltHeaderContentStyle}>
                        <span style={isRec ? detailRecommendedAltBadgeStyle : detailAltBadgeStyle}>{s.alternativaId}</span>
                        <span style={headerLabelStyle}>{getAlternativeDisplayLabel(s.alternativaId, state.alternative[s.alternativaId])}</span>
                      </div>
                      {isRec && <span style={recommendedBadgeStyle}>Raccomandata</span>}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ key, label, value, get }, rowIdx) => {
              const best = Math.max(...scores.map(value))
              return (
                <tr key={key} style={rowIdx % 2 === 1 ? rowAlternateStyle : undefined}>
                  <th scope="row" style={rowHeaderStyle}>{label}</th>
                  {scores.map(s => {
                    const isRec = s.alternativaId === recommendedId
                    const isBest = value(s) === best
                    return (
                      <td key={`${key}-${s.alternativaId}`} style={{ ...bodyCellStyle, ...(isRec ? recommendedColumnStyle : null), ...(isBest ? detailBestCellStyle : null) }}>
                        {get(s)}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
            <tr>
              <th scope="row" style={finalRowHeaderStyle}>Punteggio CBA</th>
              {scores.map(s => (
                <td key={`cba-${s.alternativaId}`} style={{ ...getDetailFinalRecommendedCellStyle(s.alternativaId === recommendedId), ...(s.cbaScore === Math.max(...scores.map(x => x.cbaScore)) ? detailBestCellStyle : null) }}>
                  {s.cbaScore.toFixed(1)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <CbaWaterfallChart scores={scores} alternative={state.alternative} />
      <CbaTrendlineChart scores={scores} alternative={state.alternative} />
    </div>
  )
}

const sectionWrapStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 'var(--spacing-stack-m, 24px)' }
const metaStyle: CSSProperties = { margin: 0, fontSize: 'var(--type-body-xs-size, 13px)', color: 'var(--color-text-primary-light)' }
const tableStyle: CSSProperties = { width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', background: 'var(--color-background-inverse)' }
const headerCellStyle: CSSProperties = detailHeaderCellBaseStyle
const recommendedHeaderStyle: CSSProperties = detailRecommendedHeaderStyle
const headerLabelWrapStyle: CSSProperties = detailHeaderLabelWrapStyle
const headerLabelStyle: CSSProperties = detailHeaderLabelStyle
const recommendedBadgeStyle: CSSProperties = detailRecommendedBadgeStyle
const rowHeaderStyle: CSSProperties = detailRowHeaderStyle
const bodyCellStyle: CSSProperties = detailBodyCellStyle
const recommendedColumnStyle: CSSProperties = detailRecommendedColumnStyle
const finalRowHeaderStyle: CSSProperties = detailFinalRowHeaderStyle
const emptyStyle: CSSProperties = detailEmptyStyle
const rowAlternateStyle: CSSProperties = { background: 'rgba(127,127,140,0.06)' }
