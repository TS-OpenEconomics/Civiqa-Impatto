// RiskElasticityChart — Radar showing NPV elasticity per parameter
// |ε| = % change in NPV per 1% change in the parameter.
// Shown per alternative (switcher) because scales differ significantly.
import type { CSSProperties } from 'react'
import { useState } from 'react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from 'recharts'
import type { ScoreComposito, AlternativaId, AlternativaData } from '../../../types/docfap'
import { getAlternativeDisplayLabel, getRecommendedAlternativeId } from '../tableHelpers'
import { makeAltColorByRank } from '../chartHelpers'
import { MC_MOCK_DATA } from '../../../engine/riskMonteCarlo'

interface Props {
  scores: ScoreComposito[]
  alternative: Partial<Record<AlternativaId, AlternativaData>>
}

export function RiskElasticityChart({ scores, alternative }: Props) {
  const [selectedId, setSelectedId] = useState<AlternativaId>(scores[0]?.alternativaId)
  if (scores.length === 0) return null

  const score = scores.find(s => s.alternativaId === selectedId) ?? scores[0]
  const mc = MC_MOCK_DATA[score.alternativaId]
  if (!mc) return null

  const recommendedId = getRecommendedAlternativeId(scores)
  const colorFor = makeAltColorByRank(scores)
  const chartData = mc.elasticities.map(e => ({ param: e.param, value: e.value }))
  const color = colorFor(score.alternativaId)

  const CustomTooltip = ({
    active, payload,
  }: { active?: boolean; payload?: Array<{ payload: { param: string; value: number } }> }) => {
    if (!active || !payload?.length) return null
    const d = payload[0].payload
    return (
      <div style={tooltipStyle}>
        <p style={tooltipTitleStyle}>{d.param}</p>
        <p style={{ margin: 0, color, fontWeight: 700 }}>|ε| = {d.value.toFixed(2)}</p>
        <p style={tooltipHintStyle}>NPV varia del {d.value.toFixed(2)}% per ogni 1% di variazione</p>
      </div>
    )
  }

  return (
    <div style={cardStyle}>
      <div style={headerRowStyle}>
        <div>
          <h3 style={titleStyle}>Elasticità NPV — sensitività ai parametri</h3>
          <p style={subtitleStyle}>
            Variazione % del NPV per una variazione dell'1% del parametro.
            Valori più alti = maggiore sensitività. Mostra quale variabile "muove" di più il progetto.
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
      <ResponsiveContainer width="100%" height={340}>
        <RadarChart data={chartData} outerRadius="65%" margin={{ top: 16, right: 40, bottom: 16, left: 40 }}>
          <PolarGrid stroke="#e0e0e0" />
          <PolarAngleAxis dataKey="param" tick={{ fontSize: 13, fill: 'var(--color-text-primary-light, #555)' }} />
          <PolarRadiusAxis angle={90} tickCount={5}
            tick={{ fontSize: 11, fill: '#aaa' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Radar name="elasticità" dataKey="value"
            stroke={color} fill={color} fillOpacity={0.18} strokeWidth={2.5}
            dot={{ r: 4, fill: color }} />
        </RadarChart>
      </ResponsiveContainer>
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
const tooltipStyle: CSSProperties = {
  background: 'var(--color-background-inverse)', border: '1px solid #d0d0d0',
  borderRadius: 'var(--radius-smooth)', padding: '8px 12px', fontSize: 13, maxWidth: 240,
}
const tooltipTitleStyle: CSSProperties = { margin: '0 0 4px', fontWeight: 700, fontSize: 13, color: 'var(--color-text-primary)' }
const tooltipHintStyle: CSSProperties = { margin: '4px 0 0', fontSize: 11, color: 'var(--color-text-primary-light)' }
