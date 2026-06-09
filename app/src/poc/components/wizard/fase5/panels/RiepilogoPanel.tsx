// src/components/wizard/fase5/panels/RiepilogoPanel.tsx
import type { CSSProperties } from 'react'
import type { AlternativaId, ScoreComposito } from '../../../../types/docfap'
import type { McaQuestion } from '../../../../data/poc_docfap/evaluation_matrix'
import { Badge } from '../../../ui/Badge'
import { RankingChart } from '../charts/RankingChart'
import { DimensionChart } from '../charts/DimensionChart'
import { DetailAnalysisChart } from '../charts/DetailAnalysisChart'
import { fmt1 } from '../resultUtils'

interface WeightState {
  wCBA: number
  wIMP: number
  wMCA: number
  wSENS: number
}

interface Props {
  localRanking: ScoreComposito[]
  localRecommendedId: AlternativaId | null
  weights: WeightState
  totalWeights: number
  onWeightChange: (key: keyof WeightState, value: string) => void
  getLabel: (id: AlternativaId) => string
  mcaQuestions: McaQuestion[]
  mcaScores: Record<string, Record<string, string>>
}

export function RiepilogoPanel({
  localRanking,
  localRecommendedId,
  weights,
  totalWeights,
  onWeightChange,
  getLabel,
  mcaQuestions,
}: Props) {
  const rankingItems = localRanking.map(item => ({
    id: item.alternativaId,
    label: getLabel(item.alternativaId),
    score: item.scoreFinale,
    isRecommended: item.alternativaId === localRecommendedId,
  }))

  return (
    <div style={rootStyle} role="tabpanel" id="result-panel-riepilogo" aria-labelledby="result-sw-riepilogo">

      {/* ── Score comparativo (tabella full-width) ── */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <span style={cardTitleStyle}>Score comparativo</span>
          <span style={cardSubStyle}>Punteggi 0–100 per dimensione di analisi</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th scope="col" style={thLabelStyle}>Dimensione di analisi</th>
                <th scope="col" style={thWeightStyle}>Peso %</th>
                {localRanking.map(item => (
                  <th
                    key={item.alternativaId}
                    scope="col"
                    style={item.alternativaId === localRecommendedId ? thRecStyle : thAltStyle}
                  >
                    <span style={altLabelStyle}>{getLabel(item.alternativaId)}</span>
                    {item.alternativaId === localRecommendedId && (
                      <Badge label="Raccomandata" variant="success" size="s" />
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { key: 'cba', label: 'Analisi Costi Benefici', wKey: 'wCBA' as keyof WeightState, get: (s: ScoreComposito) => fmt1(s.cbaScore) },
                { key: 'impatto', label: "Analisi d'Impatto", wKey: 'wIMP' as keyof WeightState, get: (s: ScoreComposito) => fmt1(s.impattoScore) },
                { key: 'mca', label: 'Analisi Multicriteria', wKey: 'wMCA' as keyof WeightState, get: (s: ScoreComposito) => fmt1(s.mcaScore) },
                { key: 'sens', label: 'Analisi di Sensitività', wKey: 'wSENS' as keyof WeightState, get: (s: ScoreComposito) => fmt1(s.sensitivityScore) },
              ].map(({ key, label, wKey, get }, rowIdx) => (
                <tr key={key} style={rowIdx % 2 === 1 ? trAltStyle : undefined}>
                  <th scope="row" style={tdLabelStyle}>{label}</th>
                  <td style={tdWeightStyle}>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={1}
                      value={weights[wKey]}
                      onChange={e => onWeightChange(wKey, e.target.value)}
                      aria-label={`Peso ${label}`}
                      style={weightInputStyle}
                      className="step7-weight-input"
                    />
                  </td>
                  {localRanking.map(item => (
                    <td key={`${key}-${item.alternativaId}`} style={item.alternativaId === localRecommendedId ? tdRecStyle : tdStyle}>
                      <span style={monoStyle}>{get(item)}</span>
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td
                  colSpan={2 + localRanking.length}
                  style={{
                    padding: '6px 16px',
                    fontSize: '12px',
                    color: totalWeights !== 100 ? 'var(--color-text-danger, #c0392b)' : 'var(--color-text-primary-lighter)',
                    fontWeight: totalWeights !== 100 ? 700 : 400,
                    background: totalWeights !== 100 ? '#fff0f0' : 'transparent',
                    borderBottom: '1px solid #e7e7e7',
                  }}
                >
                  Totale pesi: {totalWeights}% {totalWeights !== 100 && '(deve essere 100%)'}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td style={tfootLabelStyle}>Score Finale Composito</td>
                <td style={tfootWeightStyle} />
                {localRanking.map(item => (
                  <td key={`finale-${item.alternativaId}`} style={item.alternativaId === localRecommendedId ? tfootRecStyle : tfootStyle}>
                    <strong style={monoStyle}>{fmt1(item.scoreFinale)}</strong>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* ── Grafico 1: Ranking ── */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <span style={cardTitleStyle}>Ranking score finale</span>
          <span style={cardSubStyle}>Score composito 0–100 · ordinate per punteggio decrescente</span>
        </div>
        <div style={cardBodyStyle}>
          <RankingChart items={rankingItems} />
        </div>
      </div>

      {/* ── Grafico 2: Confronto per dimensione ── */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <span style={cardTitleStyle}>Confronto per dimensione</span>
          <span style={cardSubStyle}>Score per ciascuna analisi — confronto tra alternative</span>
        </div>
        <div style={cardBodyStyle}>
          <DimensionChart
            ranking={localRanking}
            getLabel={getLabel}
            recommendedId={localRecommendedId}
          />
        </div>
      </div>

      {/* ── Grafico 3: Dettaglio analisi ── */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <span style={cardTitleStyle}>Dettaglio per analisi</span>
          <span style={cardSubStyle}>Seleziona l'analisi — il grafico aggiorna i dati, la forma rimane invariata</span>
        </div>
        <div style={cardBodyStyle}>
          <DetailAnalysisChart
            ranking={localRanking}
            getLabel={getLabel}
            recommendedId={localRecommendedId}
            mcaQuestions={mcaQuestions}
          />
        </div>
      </div>

      <style>{`
        .step7-weight-input:focus {
          box-shadow: 0 0 0 3px var(--color-border-focus, #0000ff);
          outline: none;
        }
      `}</style>
    </div>
  )
}

// ── Styles ──────────────────────────────────────────────────────────────────

const rootStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '16px' }

const cardStyle: CSSProperties = {
  background: 'var(--color-background-inverse)',
  border: '1px solid var(--color-border-secondary-light, #e7e7e7)',
  borderRadius: 'var(--radius-smooth)',
  overflow: 'hidden',
}

const cardHeaderStyle: CSSProperties = {
  padding: '14px 20px',
  borderBottom: '1px solid var(--color-border-secondary-light, #e7e7e7)',
  display: 'flex',
  alignItems: 'baseline',
  gap: '10px',
  flexWrap: 'wrap',
}

const cardTitleStyle: CSSProperties = { fontSize: '14px', fontWeight: 700 }
const cardSubStyle: CSSProperties = { fontSize: '11px', color: 'var(--color-text-primary-lighter, #6e6e6e)' }
const cardBodyStyle: CSSProperties = { padding: '20px' }

const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '13px',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
}

const thLabelStyle: CSSProperties = {
  textAlign: 'left', padding: '11px 16px', fontSize: '11px', fontWeight: 700,
  background: 'var(--color-background-page, #f1f1f1)',
  borderBottom: '2px solid var(--color-background-primary, #5B21F7)',
  color: 'var(--color-text-primary)', width: '220px',
  textTransform: 'uppercase', letterSpacing: '.4px',
}

const thWeightStyle: CSSProperties = {
  textAlign: 'center', padding: '11px 16px', fontSize: '11px', fontWeight: 700,
  background: 'var(--color-background-page, #f1f1f1)',
  borderBottom: '2px solid var(--color-background-primary, #5B21F7)',
  borderLeft: '1px solid var(--color-border-secondary-light, #e7e7e7)',
  color: 'var(--color-text-primary-lighter, #6e6e6e)',
  textTransform: 'uppercase', letterSpacing: '.4px',
}

const thAltStyle: CSSProperties = {
  textAlign: 'right', padding: '11px 16px', fontSize: '11px', fontWeight: 700,
  background: 'var(--color-background-page, #f1f1f1)',
  borderBottom: '2px solid var(--color-background-primary, #5B21F7)',
  borderLeft: '1px solid var(--color-border-secondary-light, #e7e7e7)',
  color: 'var(--color-text-primary)',
}

const thRecStyle: CSSProperties = {
  ...thAltStyle,
  background: 'var(--color-background-primary, #5B21F7)',
  color: 'var(--color-text-inverse, #ffffff)',
  borderBottom: '2px solid var(--color-background-primary, #5B21F7)',
}

const altLabelStyle: CSSProperties = {
  display: 'block', fontSize: '11px', fontWeight: 700,
  wordBreak: 'break-word', marginBottom: '4px',
}

const trAltStyle: CSSProperties = { background: 'var(--color-background-page, #f1f1f1)' }

const tdLabelStyle: CSSProperties = {
  textAlign: 'left', padding: '10px 16px',
  borderBottom: '1px solid var(--color-border-secondary-light, #e7e7e7)',
  fontSize: '12px', fontWeight: 500, color: 'var(--color-text-primary)',
}

const tdWeightStyle: CSSProperties = {
  padding: '6px 12px',
  borderBottom: '1px solid var(--color-border-secondary-light, #e7e7e7)',
  borderLeft: '1px solid var(--color-border-secondary-light, #e7e7e7)',
  textAlign: 'center',
}

const weightInputStyle: CSSProperties = {
  width: '52px', padding: '4px 6px',
  border: '1px solid var(--color-border-secondary-light, #e7e7e7)',
  borderRadius: 'var(--radius-smooth)',
  fontFamily: 'var(--font-family-0, monospace)', fontSize: '12px',
  textAlign: 'right',
  background: 'var(--color-background-inverse)',
  color: 'var(--color-text-primary)',
}

const tdStyle: CSSProperties = {
  padding: '10px 16px', textAlign: 'right',
  borderBottom: '1px solid var(--color-border-secondary-light, #e7e7e7)',
  borderLeft: '1px solid var(--color-border-secondary-light, #e7e7e7)',
  fontFamily: 'var(--font-family-0, monospace)', fontSize: '13px',
}

const tdRecStyle: CSSProperties = {
  ...tdStyle, background: 'var(--color-background-primary-lighter, #efe5ff)',
}

const tfootLabelStyle: CSSProperties = {
  textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 700,
  background: 'var(--color-background-primary-lighter, #efe5ff)',
  color: 'var(--color-background-primary, #5B21F7)',
  borderTop: '2px solid #b991ff',
}

const tfootWeightStyle: CSSProperties = {
  borderLeft: '1px solid #e7e7e7',
  background: 'var(--color-background-primary-lighter, #efe5ff)',
  borderTop: '2px solid #b991ff',
}

const tfootStyle: CSSProperties = {
  padding: '12px 16px', textAlign: 'right',
  background: 'var(--color-background-primary-lighter, #efe5ff)',
  borderLeft: '1px solid #e7e7e7',
  borderTop: '2px solid #b991ff',
  fontFamily: 'var(--font-family-0, monospace)', fontSize: '14px', fontWeight: 700,
}

const tfootRecStyle: CSSProperties = {
  ...tfootStyle, background: '#d9c1ff',
  color: 'var(--color-background-primary, #5B21F7)',
}

const monoStyle: CSSProperties = {
  fontFamily: 'var(--font-family-0, "Atkinson Hyperlegible Mono", monospace)',
}
