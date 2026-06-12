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
import { ImpactDecompositionChart } from './charts/ImpactDecompositionChart'
import { ImpactMultiplierChart } from './charts/ImpactMultiplierChart'

// pil / produzione / redditi sono già in €M (vedi ScoreComposito)
function fmtM(value: number): string {
  return `${value.toLocaleString('it-IT', { maximumFractionDigits: 1 })} M€`
}

export function TabImpatto() {
  const state = useSyncExternalStore(wizardStore.subscribe, wizardStore.getState, wizardStore.getState)
  const scores = getDefinedScores(state.scoreFinale, state.alternativeDefinite)
  const recommendedId = getRecommendedAlternativeId(scores)

  if (scores.length === 0) return <p style={emptyStyle}>Nessun dettaglio d'impatto disponibile.</p>

  const rows: { key: string; label: string; get: (s: typeof scores[0]) => string }[] = [
    { key: 'pil',      label: 'PIL (M€)',            get: s => fmtM(s.pil) },
    { key: 'occupati', label: 'Occupati (ETP)',       get: s => s.occupati.toLocaleString('it-IT') },
    { key: 'prod',     label: 'Produzione (M€)',      get: s => fmtM(s.produzione) },
    { key: 'redditi',  label: 'Redditi (M€)',         get: s => fmtM(s.redditi) },
  ]

  const rowValue = (key: string, s: typeof scores[0]): number => {
    if (key === 'pil') return s.pil
    if (key === 'occupati') return s.occupati
    if (key === 'prod') return s.produzione
    if (key === 'redditi') return s.redditi
    return 0
  }

  return (
    <div style={wrapStyle}>
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
                  </div>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ key, label, get }, rowIdx) => {
            const best = Math.max(...scores.map(s => rowValue(key, s)))
            return (
              <tr key={key} style={rowIdx % 2 === 1 ? rowAlternateStyle : undefined}>
                <th scope="row" style={rowHeaderStyle}>{label}</th>
                {scores.map(s => {
                  const isRec = s.alternativaId === recommendedId
                  const isBest = rowValue(key, s) === best
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
            <th scope="row" style={finalRowHeaderStyle}>Punteggio d'Impatto</th>
            {scores.map(s => (
              <td key={`imp-${s.alternativaId}`} style={getDetailFinalRecommendedCellStyle(s.alternativaId === recommendedId)}>
                {s.impattoScore.toFixed(1)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      </div>

      <ImpactDecompositionChart scores={scores} alternative={state.alternative} />
      <ImpactMultiplierChart scores={scores} alternative={state.alternative} />
    </div>
  )
}

const wrapStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 'var(--spacing-stack-m, 24px)' }
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
