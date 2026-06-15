// Tab "Analisi del Rischio" — Monte Carlo risk analysis
// Replaces the old deterministic stress-test table with probabilistic results.
//
// Key metric: probBest = fraction of 1000 MC simulations where this alternative
// ranked 1st overall. Answers: "How robust is the recommended ranking?"
import type { CSSProperties } from 'react'
import { useSyncExternalStore } from 'react'
import { wizardStore } from '../../store/wizardStore'
import {
  getAlternativeDisplayLabel,
  getRecommendedAlternativeId,
  getDefinedScores,
  detailEmptyStyle,
  detailRecommendedBadgeStyle,
  RISK_METRIC_LABELS,
  RISK_METRIC_HINTS,
} from './tableHelpers'
import { MC_MOCK_DATA } from '../../engine/riskMonteCarlo'
import { RiskElasticityChart } from './charts/RiskElasticityChart'
import { RiskVarianceChart } from './charts/RiskVarianceChart'
import { RiskHistogram } from './charts/RiskHistogram'
import { RiskHeatmap } from './charts/RiskHeatmap'

// k€ → stringa in M€ (italiano)
const toM = (k: number) => (k / 1000).toLocaleString('it-IT', { maximumFractionDigits: 1 })

// Pallino informativo "ⓘ" con tooltip nativo (spiega l'indicatore al funzionario).
function InfoDot({ hint }: { hint: string }) {
  return (
    <span style={infoDotStyle} title={hint} role="img" aria-label={hint}>ⓘ</span>
  )
}

function probBestColor(p: number): string {
  if (p >= 0.6) return '#1b5e20'
  if (p >= 0.3) return '#e65100'
  return '#c62828'
}

function probNegColor(p: number): string {
  if (p > 0.2) return '#c62828'
  if (p > 0.05) return '#e65100'
  return '#2e7d32'
}

export function TabSensitivita() {
  const state = useSyncExternalStore(wizardStore.subscribe, wizardStore.getState, wizardStore.getState)
  const scores = getDefinedScores(state.scoreFinale, state.alternativeDefinite)
  const recommendedId = getRecommendedAlternativeId(scores)

  if (scores.length === 0) {
    return <p style={detailEmptyStyle}>Nessun dato di Analisi del Rischio disponibile.</p>
  }

  return (
    <div style={wrapStyle}>

      {/* ── 1. Summary card ────────────────────────────────────────────────── */}
      <div style={summaryCardStyle}>
        <h3 style={summaryTitleStyle}>Sintesi Monte Carlo — indicatori chiave</h3>
        <p style={summarySubtitleStyle}>
          1.000 simulazioni con parametri stocastici (CAPEX e OPEX log-normali, Benefici normali).
          La <strong style={{ color: '#5B21F7' }}>Probabilità scelta ottimale</strong> è la percentuale di
          simulazioni in cui l'alternativa ha ottenuto il punteggio composito più alto — misura la robustezza del ranking.
        </p>
        <div style={summaryGridStyle}>
          {scores.map(s => {
            const mc = MC_MOCK_DATA[s.alternativaId]
            if (!mc) return null
            const isRec = s.alternativaId === recommendedId
            const label = getAlternativeDisplayLabel(s.alternativaId, state.alternative[s.alternativaId])
            return (
              <div key={s.alternativaId} style={summaryItemStyle(isRec)}>
                {/* Alt header */}
                <div style={summaryAltHeaderStyle}>
                  <span style={summaryAltLabelStyle}>{label}</span>
                </div>

                {/* Probabilità scelta ottimale — headline metric */}
                <div style={probBestWrapStyle}>
                  <span style={probBestLabelStyle}>{RISK_METRIC_LABELS.probBest}<InfoDot hint={RISK_METRIC_HINTS.probBest} /></span>
                  <span style={{ ...probBestValueStyle, color: probBestColor(mc.summary.probBest) }}>
                    {(mc.summary.probBest * 100).toFixed(0)}%
                  </span>
                  <div style={probBestBarBgStyle}>
                    <div style={{
                      ...probBestBarFillStyle,
                      width: `${mc.summary.probBest * 100}%`,
                      background: probBestColor(mc.summary.probBest),
                    }} />
                  </div>
                  <span style={probBestHintStyle}>
                    {Math.round(mc.summary.probBest * mc.summary.nSimulations)} / {mc.summary.nSimulations} simulazioni
                  </span>
                </div>

                {/* Other stats */}
                <table style={summaryTableStyle}>
                  <tbody>
                    <tr>
                      <td style={tdLabelStyle}>{RISK_METRIC_LABELS.median}<InfoDot hint={RISK_METRIC_HINTS.median} /></td>
                      <td style={tdValueStyle}>{toM(mc.summary.p50)} M€</td>
                    </tr>
                    <tr>
                      <td style={tdLabelStyle}>{RISK_METRIC_LABELS.ci90}<InfoDot hint={RISK_METRIC_HINTS.ci90} /></td>
                      <td style={tdValueStyle}>{toM(mc.summary.p5)} – {toM(mc.summary.p95)} M€</td>
                    </tr>
                    <tr>
                      <td style={tdLabelStyle}>{RISK_METRIC_LABELS.loss}<InfoDot hint={RISK_METRIC_HINTS.loss} /></td>
                      <td style={{ ...tdValueStyle, color: probNegColor(mc.summary.probNegative), fontWeight: 700 }}>
                        {(mc.summary.probNegative * 100).toFixed(1)}%
                      </td>
                    </tr>
                    <tr>
                      <td style={{ ...tdLabelStyle, fontWeight: 700, color: 'var(--color-text-primary)' }}>{RISK_METRIC_LABELS.score}</td>
                      <td style={{ ...tdValueStyle, fontWeight: 700 }}>{s.sensitivityScore.toFixed(1)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── 2. Elasticity spider (per alt) ─────────────────────────────────── */}
      <RiskElasticityChart scores={scores} alternative={state.alternative} />

      {/* ── 3. Variance spider (all alts) ──────────────────────────────────── */}
      <RiskVarianceChart scores={scores} alternative={state.alternative} />

      {/* ── 4. NPV distribution histogram (per alt) ────────────────────────── */}
      <RiskHistogram scores={scores} alternative={state.alternative} />

      {/* ── 5. Cost × benefit heatmap (per alt) ────────────────────────────── */}
      <RiskHeatmap scores={scores} alternative={state.alternative} />

    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────
const wrapStyle: CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: 'var(--spacing-stack-m, 24px)',
}

const summaryCardStyle: CSSProperties = {
  background: 'var(--color-background-inverse)', border: '1px solid #d0d0d0',
  borderRadius: 'var(--radius-smooth)', padding: 'var(--spacing-inset-m)',
}

const summaryTitleStyle: CSSProperties = {
  margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)',
}

const summarySubtitleStyle: CSSProperties = {
  margin: '0 0 16px', fontSize: 13, color: 'var(--color-text-primary-light)',
  lineHeight: 1.5,
}

const summaryGridStyle: CSSProperties = {
  display: 'flex', gap: '16px', flexWrap: 'wrap',
}

function summaryItemStyle(isRec: boolean): CSSProperties {
  return {
    flex: '1 1 200px',
    // Opzione raccomandata evidenziata in verde (schema ranking DOCFAP).
    border: `1px solid ${isRec ? '#108a43' : '#d0d0d0'}`,
    borderRadius: 'var(--radius-smooth)',
    padding: '12px 16px',
    background: isRec ? 'rgba(16,138,67,0.08)' : 'var(--color-background-inverse)',
  }
}

const summaryAltHeaderStyle: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap',
  marginBottom: '12px',
}

const summaryAltLabelStyle: CSSProperties = {
  fontWeight: 700, fontSize: 14, color: 'var(--color-text-primary)',
}

// P(Migliore) highlight block
const probBestWrapStyle: CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '12px',
}
const probBestLabelStyle: CSSProperties = {
  fontSize: 11, color: 'var(--color-text-primary-light)', fontWeight: 600,
  textTransform: 'uppercase', letterSpacing: '0.05em',
}
const probBestValueStyle: CSSProperties = {
  fontSize: 28, fontWeight: 700, lineHeight: 1, margin: '2px 0',
}
const probBestBarBgStyle: CSSProperties = {
  height: 6, background: 'rgba(127,127,140,0.20)', borderRadius: 3, overflow: 'hidden',
}
const probBestBarFillStyle: CSSProperties = {
  height: '100%', borderRadius: 3, transition: 'width 0.3s ease',
}
const probBestHintStyle: CSSProperties = {
  fontSize: 11, color: 'var(--color-text-primary-light)',
}

const summaryTableStyle: CSSProperties = {
  width: '100%', borderCollapse: 'collapse',
}
const tdLabelStyle: CSSProperties = {
  fontSize: 12, color: 'var(--color-text-primary-light)',
  padding: '2px 8px 2px 0', verticalAlign: 'middle',
}
const tdValueStyle: CSSProperties = {
  fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)',
  padding: '2px 0', textAlign: 'right', verticalAlign: 'middle',
}
const infoDotStyle: CSSProperties = {
  display: 'inline-block', marginLeft: 5, fontSize: 11, lineHeight: 1,
  color: 'var(--color-text-primary-light)', cursor: 'help', verticalAlign: 'baseline',
}
