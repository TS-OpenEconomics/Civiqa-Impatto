// src/components/wizard/fase5/panels/RischioPanel.tsx
import type { CSSProperties } from 'react'
import type { AlternativaId, ScoreComposito } from '../../../../types/docfap'
import type { McaQuestion } from '../../../../data/poc_docfap/evaluation_matrix'
import { Badge } from '../../../ui/Badge'
import {
  fmt1,
  getInnerBodyCellStyle, getInnerTotalCellStyle,
  innerTableWrapStyle, innerTableStyle,
  innerLabelHeaderCellStyle, innerAltHeaderCellStyle, innerAltHeaderRecommendedStyle,
  innerRowHeaderStyle, innerTotalRowHeaderStyle, innerRowAlternateStyle,
  monoStyle, metaTextStyle, hintTextStyle,
} from '../resultUtils'

const MCA_CODE_TO_LABEL: Record<string, string> = {
  A: 'Alto', M: 'Medio', B: 'Basso', N: 'Nullo',
}

interface Props {
  localRanking: ScoreComposito[]
  localRecommendedId: AlternativaId | null
  getLabel: (id: AlternativaId) => string
  mcaQuestions: McaQuestion[]
  mcaScores: Record<string, Record<string, string>>
  clusterId: string | null
}

export function RischioPanel({ localRanking, localRecommendedId, getLabel, mcaQuestions, mcaScores, clusterId }: Props) {
  const altLabelStyle: CSSProperties = { display: 'block', fontSize: '11px', fontWeight: 700, wordBreak: 'break-word', marginBottom: '4px' }

  return (
    <div role="tabpanel" id="result-panel-rischio" aria-labelledby="result-sw-rischio" style={panelStyle}>
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <span style={cardTitleStyle}>Analisi del Rischio · Multicriteria</span>
          <span style={cardSubStyle}>Criteri KO e qualitativi per cluster · punteggi per alternativa</span>
        </div>
        {mcaQuestions.length === 0 ? (
          <p style={metaTextStyle}>
            {clusterId ? 'Dati MCA non ancora caricati.' : 'Cluster non disponibile.'}
          </p>
        ) : (
          <div style={innerTableWrapStyle}>
            <table style={innerTableStyle}>
              <colgroup>
                <col style={{ width: '200px' }} />
                {localRanking.map(item => <col key={item.alternativaId} />)}
              </colgroup>
              <thead>
                <tr>
                  <th scope="col" style={innerLabelHeaderCellStyle}>Criterio</th>
                  {localRanking.map(item => {
                    const isRec = item.alternativaId === localRecommendedId
                    return (
                      <th
                        key={item.alternativaId}
                        scope="col"
                        style={{ ...innerAltHeaderCellStyle, ...(isRec ? innerAltHeaderRecommendedStyle : null) }}
                      >
                        <span style={altLabelStyle}>{getLabel(item.alternativaId)}</span>
                        {isRec && <Badge label="Raccomandata" variant="success" size="s" />}
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {mcaQuestions.map((question, rowIdx) => (
                  <tr key={question.qCode} style={rowIdx % 2 === 1 ? innerRowAlternateStyle : undefined}>
                    <th scope="row" style={innerRowHeaderStyle}>
                      <span style={{ fontWeight: 600 }}>{question.label}</span>
                      <span style={hintTextStyle}>{question.text}</span>
                    </th>
                    {localRanking.map(item => {
                      const rawAnswer = mcaScores[item.alternativaId]?.[question.qCode] ?? ''
                      const label = MCA_CODE_TO_LABEL[rawAnswer.toUpperCase()] ?? (rawAnswer || '—')
                      return (
                        <td key={`${question.qCode}-${item.alternativaId}`} style={getInnerBodyCellStyle(item, localRecommendedId)}>
                          <span style={monoStyle}>{label}</span>
                        </td>
                      )
                    })}
                  </tr>
                ))}
                <tr>
                  <th scope="row" style={innerTotalRowHeaderStyle}>Punteggio Analisi Multicriteria</th>
                  {localRanking.map(item => (
                    <td key={`mcascore-${item.alternativaId}`} style={getInnerTotalCellStyle(item, localRecommendedId)}>
                      <span style={monoStyle}>{fmt1(item.mcaScore)}</span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

const panelStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '16px' }
const cardStyle: CSSProperties = { background: 'var(--color-background-inverse)', border: '1px solid var(--color-border-secondary-light, #e7e7e7)', borderRadius: 'var(--radius-smooth)', overflow: 'hidden' }
const cardHeaderStyle: CSSProperties = { padding: '14px 20px', borderBottom: '1px solid var(--color-border-secondary-light, #e7e7e7)', display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }
const cardTitleStyle: CSSProperties = { fontSize: '14px', fontWeight: 700 }
const cardSubStyle: CSSProperties = { fontSize: '11px', color: 'var(--color-text-primary-lighter, #6e6e6e)' }
