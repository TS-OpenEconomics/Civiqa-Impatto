import type { CSSProperties } from 'react'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { getMatrixQuestions, loadPocData } from '../../data/poc_docfap/evaluation_matrix'
import type { McaQuestion } from '../../data/poc_docfap/evaluation_matrix'
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
  detailRecommendedBadgeStyle,
  detailRowHeaderStyle,
  detailBodyCellStyle,
  detailRecommendedColumnStyle,
  detailBestCellStyle,
  detailFinalRowHeaderStyle,
  detailEmptyStyle,
  detailTableWrapStyle,
  formatScore,
  getAltBadgeStyle,
} from './tableHelpers'
import { buildRankIndexMap } from './rankColors'
import { tabStackStyle } from './chartHelpers'
import { McaProfileRadar } from './charts/McaProfileRadar'

const SCALE_LABELS: Record<string, string> = {
  A: 'Alto',
  M: 'Medio',
  B: 'Basso',
  N: 'Nullo',
}
const SCALE_RANK: Record<string, number> = { A: 4, M: 3, B: 2, N: 1 }

export function TabMCA() {
  const state = useSyncExternalStore(wizardStore.subscribe, wizardStore.getState, wizardStore.getState)
  const scores = getDefinedScores(state.scoreFinale, state.alternativeDefinite)
  const recommendedId = getRecommendedAlternativeId(scores)
  const rankMap = buildRankIndexMap(scores)

  const [questions, setQuestions] = useState<McaQuestion[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const clusterIds = state.clusterId ? [state.clusterId] : []
    let active = true
    loadPocData().then(() => {
      if (!active) return
      setQuestions(getMatrixQuestions(clusterIds))
      setLoaded(true)
    })
    return () => {
      active = false
    }
  }, [state.clusterId])

  if (scores.length === 0) return <p style={emptyStyle}>Nessun dettaglio MCA disponibile.</p>
  if (!loaded) return <p style={emptyStyle}>Caricamento criteri MCA…</p>
  if (questions.length === 0) return <p style={emptyStyle}>Nessun criterio qualitativo disponibile per il cluster selezionato.</p>

  return (
    <div style={tabStackStyle}>
      <McaProfileRadar
        scores={scores}
        alternative={state.alternative}
        questions={questions}
        mcaScores={state.mcaScores}
      />

      <div style={detailTableWrapStyle}>
        <table style={tableStyle}>
          <colgroup>
            <col style={labelColumnStyle} />
            {scores.map((score) => <col key={score.alternativaId} style={alternativeColumnStyle(scores.length)} />)}
          </colgroup>
          <thead>
            <tr>
              <th style={headerCellStyle}>Criterio qualitativo</th>
              {scores.map((score) => {
                const isRecommended = score.alternativaId === recommendedId
                return (
                  <th key={score.alternativaId} style={{ ...headerCellStyle, ...(isRecommended ? recommendedHeaderStyle : null) }}>
                    <div style={headerLabelWrapStyle}>
                      <div style={detailAltHeaderContentStyle}>
                        <span style={getAltBadgeStyle(rankMap[score.alternativaId] ?? 0, scores.length)}>{score.alternativaId}</span>
                        <span style={headerLabelStyle}>{getAlternativeDisplayLabel(score.alternativaId, state.alternative[score.alternativaId])}</span>
                      </div>
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {questions.map((question) => {
              const best = Math.max(...scores.map((score) => SCALE_RANK[state.mcaScores[score.alternativaId]?.[question.qCode] ?? ''] ?? 0))
              return (
              <tr key={question.qCode}>
                <th scope="row" style={rowHeaderStyle}>{question.text}</th>
                {scores.map((score) => {
                  const isRecommended = score.alternativaId === recommendedId
                  const livello = state.mcaScores[score.alternativaId]?.[question.qCode]
                  const text = livello ? (SCALE_LABELS[livello] ?? livello) : '—'
                  const isBest = best > 0 && (SCALE_RANK[livello ?? ''] ?? 0) === best
                  return (
                    <td key={`${question.qCode}-${score.alternativaId}`} style={{ ...bodyCellStyle, ...(isRecommended ? recommendedColumnStyle : null), ...(isBest ? detailBestCellStyle : null) }}>
                      {text}
                    </td>
                  )
                })}
              </tr>
              )
            })}
            <tr>
              <th scope="row" style={finalRowHeaderStyle}>SCORE MCA</th>
              {scores.map((score) => (
                <td key={`mca-${score.alternativaId}`} style={getDetailFinalRecommendedCellStyle(score.alternativaId === recommendedId)}>
                  {formatScore(score.mcaScore)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

const tableStyle: CSSProperties = { width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }
const headerCellStyle: CSSProperties = detailHeaderCellBaseStyle
const recommendedHeaderStyle: CSSProperties = detailRecommendedHeaderStyle
const headerLabelWrapStyle: CSSProperties = detailHeaderLabelWrapStyle
const headerLabelStyle: CSSProperties = detailHeaderLabelStyle
const recommendedBadgeStyle: CSSProperties = detailRecommendedBadgeStyle
const rowHeaderStyle: CSSProperties = detailRowHeaderStyle
const bodyCellStyle: CSSProperties = { ...detailBodyCellStyle, textAlign: 'center', fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)' }
const recommendedColumnStyle: CSSProperties = detailRecommendedColumnStyle
const finalRowHeaderStyle: CSSProperties = detailFinalRowHeaderStyle
const emptyStyle: CSSProperties = detailEmptyStyle
