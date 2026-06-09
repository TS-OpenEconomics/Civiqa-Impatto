// RiskHistogram — NPV distribution from Monte Carlo simulation
// Red bars = NPV < 0 (negative outcomes), Green bars = NPV ≥ 0 (positive)
// Per-alternative with switcher.
import type { CSSProperties } from 'react'
import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'
import type { ScoreComposito, AlternativaId, AlternativaData } from '../../../types/docfap'
import { getAlternativeDisplayLabel } from '../tableHelpers'
import { MC_MOCK_DATA } from '../../../engine/riskMonteCarlo'
import type { HistogramBin } from '../../../engine/riskMonteCarlo'

const COLOR_POSITIVE = '#43a047'
const COLOR_NEGATIVE = '#e53935'

function probColor(prob: number): string {
  if (prob > 0.2) return '#c62828'
  if (prob > 0.05) return '#e65100'
  return '#2e7d32'
}

interface Props {
  scores: ScoreComposito[]
  alternative: Partial<Record<AlternativaId, AlternativaData>>
}

export function RiskHistogram({ scores, alternative }: Props) {
  const [selectedId, setSelectedId] = useState<AlternativaId>(scores[0]?.alternativaId)
  if (scores.length === 0) return null

  const score = scores.find(s => s.alternativaId === selectedId) ?? scores[0]
  const mc = MC_MOCK_DATA[score.alternativaId]
  if (!mc) return null

  // Find the bin index that crosses zero (for reference line placement)
  const firstPositiveBin = mc.histogram.findIndex(b => b.positive)
  const zeroCrossingLabel = firstPositiveBin > 0 ? mc.histogram[firstPositiveBin].binLabel : undefined

  const CustomTooltip = ({
    active, payload,
  }: { active?: boolean; payload?: Array<{ payload: HistogramBin; value: number }> }) => {
    if (!active || !payload?.length) return null
    const bin = payload[0].payload
    return (
      <div style={tooltipStyle}>
        <p style={tooltipTitleStyle}>
          Bin: {bin.binMin.toLocaleString('it-IT')} – {bin.binMax.toLocaleString('it-IT')} k€
        </p>
        <p style={{ margin: 0, color: bin.positive ? COLOR_POSITIVE : COLOR_NEGATIVE, fontWeight: 700 }}>
          {bin.count} simulazioni
        </p>
        <p style={tooltipHintStyle}>
          {bin.positive ? '✓ NPV positivo' : '✗ NPV negativo'}
        </p>
      </div>
    )
  }

  const { summary } = mc

  return (
    <div style={cardStyle}>
      <div style={headerRowStyle}>
        <div>
          <h3 style={titleStyle}>Distribuzione NPV — simulazioni Monte Carlo</h3>
          <p style={subtitleStyle}>
            {summary.nSimulations.toLocaleString('it-IT')} simulazioni con parametri stocastici.
            <span style={{ color: COLOR_NEGATIVE, fontWeight: 600 }}> Rosso = NPV negativo</span>,{' '}
            <span style={{ color: COLOR_POSITIVE, fontWeight: 600 }}>Verde = NPV positivo</span>.
          </p>
        </div>
        {scores.length > 1 && (
          <div style={switcherStyle} role="group" aria-label="Seleziona alternativa">
            {scores.map(s => {
              const label = getAlternativeDisplayLabel(s.alternativaId, alternative[s.alternativaId])
              const isActive = s.alternativaId === selectedId
              return (
                <button key={s.alternativaId} type="button" style={btnStyle(isActive)}
                  onClick={() => setSelectedId(s.alternativaId)} aria-pressed={isActive}>
                  {label}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={mc.histogram} margin={{ top: 8, right: 16, bottom: 56, left: 16 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
          <XAxis dataKey="binLabel" tick={{ fontSize: 11, fill: 'var(--color-text-primary-light, #555)' }}
            angle={-45} textAnchor="end" interval={2}
            axisLine={{ stroke: '#d0d0d0' }} tickLine={false} />
          <YAxis label={{ value: 'Simulazioni', angle: -90, position: 'insideLeft', offset: 8, style: { fontSize: 11, fill: '#aaa' } }}
            tick={{ fontSize: 11, fill: '#aaa' }} axisLine={false} tickLine={false} />
          {zeroCrossingLabel && (
            <ReferenceLine x={zeroCrossingLabel} stroke="#333" strokeWidth={1.5} strokeDasharray="4 2"
              label={{ value: 'NPV = 0', position: 'top', fontSize: 11, fill: '#555' }} />
          )}
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
          <Bar dataKey="count" maxBarSize={28} radius={[2, 2, 0, 0]}>
            {mc.histogram.map((bin, i) => (
              <Cell key={i} fill={bin.positive ? COLOR_POSITIVE : COLOR_NEGATIVE} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Stats row */}
      <div style={statsRowStyle}>
        <div style={statItemStyle}>
          <span style={statLabelStyle}>P5 / P50 / P95</span>
          <span style={statValueStyle}>
            {summary.p5.toLocaleString('it-IT')} / {summary.p50.toLocaleString('it-IT')} / {summary.p95.toLocaleString('it-IT')} k€
          </span>
        </div>
        <div style={statItemStyle}>
          <span style={statLabelStyle}>Media ± Dev.std</span>
          <span style={statValueStyle}>
            {summary.mean.toLocaleString('it-IT')} ± {summary.std.toLocaleString('it-IT')} k€
          </span>
        </div>
        <div style={statItemStyle}>
          <span style={statLabelStyle}>P(NPV &lt; 0)</span>
          <span style={{ ...statValueStyle, color: probColor(summary.probNegative), fontSize: 15 }}>
            {(summary.probNegative * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  )
}

const cardStyle: CSSProperties = {
  background: 'var(--color-background-inverse)', border: '1px solid #d0d0d0',
  borderRadius: 'var(--radius-smooth)', padding: 'var(--spacing-inset-m)',
}
const headerRowStyle: CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
  flexWrap: 'wrap', gap: '12px', marginBottom: '4px',
}
const titleStyle: CSSProperties = { margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }
const subtitleStyle: CSSProperties = { margin: 0, fontSize: 13, color: 'var(--color-text-primary-light)' }
const switcherStyle: CSSProperties = { display: 'flex', gap: '6px', flexWrap: 'wrap' }
function btnStyle(isActive: boolean): CSSProperties {
  return {
    padding: '4px 12px', border: isActive ? '2px solid #5B21F7' : '1px solid #d0d0d0',
    borderRadius: 'var(--radius-smooth)',
    background: isActive ? '#5B21F7' : 'var(--color-background-inverse)',
    color: isActive ? '#fff' : 'var(--color-text-primary)',
    fontSize: 13, fontWeight: isActive ? 700 : 400, cursor: 'pointer',
    fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
    transition: 'background 0.15s, color 0.15s',
  }
}
const statsRowStyle: CSSProperties = {
  display: 'flex', gap: '24px', flexWrap: 'wrap', marginTop: '12px',
  paddingTop: '12px', borderTop: '1px solid #e8e8e8',
}
const statItemStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '2px' }
const statLabelStyle: CSSProperties = { fontSize: 11, color: 'var(--color-text-primary-light)' }
const statValueStyle: CSSProperties = { fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }
const tooltipStyle: CSSProperties = {
  background: 'var(--color-background-inverse)', border: '1px solid #d0d0d0',
  borderRadius: 'var(--radius-smooth)', padding: '8px 12px', fontSize: 13,
}
const tooltipTitleStyle: CSSProperties = { margin: '0 0 4px', fontWeight: 700, color: 'var(--color-text-primary)' }
const tooltipHintStyle: CSSProperties = { margin: '4px 0 0', fontSize: 11, color: 'var(--color-text-primary-light)' }
