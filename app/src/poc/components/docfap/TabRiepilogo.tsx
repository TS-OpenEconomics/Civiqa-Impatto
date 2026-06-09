import type { CSSProperties } from 'react'
import { useSyncExternalStore, useState, useEffect } from 'react'
import { wizardStore } from '../../store/wizardStore'
import { getMatrixQuestions, loadPocData } from '../../data/poc_docfap/evaluation_matrix'
import type { McaQuestion } from '../../data/poc_docfap/evaluation_matrix'
import { RankingChart } from '../wizard/fase5/charts/RankingChart'
import { DimensionChart } from '../wizard/fase5/charts/DimensionChart'
import { DetailAnalysisChart } from '../wizard/fase5/charts/DetailAnalysisChart'
import {
  getAlternativeDisplayLabel,
  getRecommendedAlternativeId,
  getDefinedScores,
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
  detailTableWrapStyle,
  getDetailFinalRecommendedCellStyle,
} from './tableHelpers'

const ROWS = [
  { key: 'cbaScore', label: 'Punteggio Analisi Costi Benefici' },
  { key: 'impattoScore', label: "Punteggio Analisi d'impatto" },
  { key: 'mcaScore', label: 'Punteggio Analisi Multicriteria' },
  { key: 'sensitivityScore', label: 'Punteggio Analisi del Rischio' },
] as const

function fmt(value: number): string {
  return value.toFixed(1)
}

export function TabRiepilogo() {
  const state = useSyncExternalStore(wizardStore.subscribe, wizardStore.getState, wizardStore.getState)
  const scores = getDefinedScores(state.scoreFinale, state.alternativeDefinite)
  const recommendedId = getRecommendedAlternativeId(scores)

  const [mcaQuestions, setMcaQuestions] = useState<McaQuestion[]>([])

  useEffect(() => {
    if (!state.clusterId) return
    loadPocData().then(() => {
      setMcaQuestions(getMatrixQuestions([state.clusterId!]))
    })
  }, [state.clusterId])

  function getLabel(id: Parameters<typeof getAlternativeDisplayLabel>[0]) {
    return getAlternativeDisplayLabel(id, state.alternative[id])
  }

  const rankingItems = [...scores]
    .sort((a, b) => b.scoreFinale - a.scoreFinale)
    .map(s => ({
      id: s.alternativaId,
      label: getLabel(s.alternativaId),
      score: s.scoreFinale,
      isRecommended: s.alternativaId === recommendedId,
    }))

  if (scores.length === 0) return <p style={emptyStyle}>Nessun risultato disponibile.</p>

  return (
    <div style={wrapStyle}>
      <div style={detailTableWrapStyle}>
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
                    <span style={headerLabelStyle}>{getLabel(score.alternativaId)}</span>
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
                <td key={`final-${score.alternativaId}`} style={getDetailFinalRecommendedCellStyle(isRecommended)}>
                  {fmt(score.scoreFinale)}
                </td>
              )
            })}
          </tr>
        </tbody>
      </table>
      </div>

      <div style={chartSectionStyle}>
        <div style={chartCardStyle}>
          <div style={chartHeaderStyle}>
            <span style={chartTitleStyle}>Ranking Score Finale</span>
            <span style={chartSubStyle}>Score composito per alternativa — ordinato decrescente</span>
          </div>
          <div style={chartBodyStyle}>
            <RankingChart items={rankingItems} />
          </div>
        </div>

        <div style={chartCardStyle}>
          <div style={chartHeaderStyle}>
            <span style={chartTitleStyle}>Confronto per Dimensione</span>
            <span style={chartSubStyle}>CBA · Impatto · Multicriteria · Rischio per alternativa</span>
          </div>
          <div style={chartBodyStyle}>
            <DimensionChart ranking={scores} getLabel={getLabel} recommendedId={recommendedId} />
          </div>
        </div>

        <div style={chartCardStyle}>
          <div style={chartHeaderStyle}>
            <span style={chartTitleStyle}>Dettaglio per Analisi</span>
            <span style={chartSubStyle}>Indicatori disaggregati per tipo di analisi</span>
          </div>
          <div style={chartBodyStyle}>
            <DetailAnalysisChart
              ranking={scores}
              getLabel={getLabel}
              recommendedId={recommendedId}
              mcaQuestions={mcaQuestions}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const wrapStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '32px' }
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

const chartSectionStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '24px' }

const chartCardStyle: CSSProperties = {
  background: 'var(--color-background-inverse)',
  border: '1px solid var(--color-border-secondary-light, #e7e7e7)',
  borderRadius: 'var(--radius-smooth)',
  overflow: 'hidden',
}

const chartHeaderStyle: CSSProperties = {
  padding: '14px 20px',
  borderBottom: '1px solid var(--color-border-secondary-light, #e7e7e7)',
  display: 'flex',
  alignItems: 'baseline',
  gap: '10px',
  flexWrap: 'wrap',
}

const chartTitleStyle: CSSProperties = { fontSize: '14px', fontWeight: 700 }

const chartSubStyle: CSSProperties = {
  fontSize: '11px',
  color: 'var(--color-text-primary-lighter, #6e6e6e)',
}

const chartBodyStyle: CSSProperties = { padding: '20px' }
