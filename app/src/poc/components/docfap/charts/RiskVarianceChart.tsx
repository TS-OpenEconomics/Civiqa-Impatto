// RiskVarianceChart — Radar showing normalised MC variance per parameter
// Domain [0,1] for all alternatives → can compare profiles simultaneously.
// A3 (voucher): CAPEX variance = 0 → flat axis → visually highlights zero-capex risk.
import type { CSSProperties } from 'react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, Legend,
} from 'recharts'
import type { ScoreComposito, AlternativaId, AlternativaData } from '../../../types/docfap'
import { getAlternativeDisplayLabel, getRecommendedAlternativeId } from '../tableHelpers'
import { altColor } from '../chartHelpers'
import { MC_MOCK_DATA } from '../../../engine/riskMonteCarlo'

interface Props {
  scores: ScoreComposito[]
  alternative: Partial<Record<AlternativaId, AlternativaData>>
}

export function RiskVarianceChart({ scores, alternative }: Props) {
  if (scores.length === 0) return null

  const recommendedId = getRecommendedAlternativeId(scores)

  // Build chart data: one row per param, one property per alternative
  const firstMc = MC_MOCK_DATA[scores[0].alternativaId]
  if (!firstMc) return null
  const params = firstMc.variances.map(v => v.param)

  type RowData = { param: string } & Record<string, number>
  const chartData: RowData[] = params.map(param => {
    const row: RowData = { param }
    for (const s of scores) {
      const mc = MC_MOCK_DATA[s.alternativaId]
      const point = mc?.variances.find(v => v.param === param)
      row[s.alternativaId] = point?.value ?? 0
    }
    return row
  })

  const CustomTooltip = ({
    active, payload,
  }: { active?: boolean; payload?: Array<{ dataKey: string; value: number; color: string; payload: RowData }> }) => {
    if (!active || !payload?.length) return null
    const param = payload[0].payload.param
    return (
      <div style={tooltipStyle}>
        <p style={tooltipTitleStyle}>{param}</p>
        {payload.map(p => {
          const label = getAlternativeDisplayLabel(p.dataKey as AlternativaId, alternative[p.dataKey as AlternativaId])
          return (
            <p key={p.dataKey} style={{ margin: '2px 0', fontSize: 13, color: p.color }}>
              {label}: <strong>{(p.value * 100).toFixed(0)}%</strong>
            </p>
          )
        })}
      </div>
    )
  }

  return (
    <div style={cardStyle}>
      <h3 style={titleStyle}>Incertezza dei parametri — varianza normalizzata MC</h3>
      <p style={subtitleStyle}>
        Varianza campionaria scalata [0–1] da 1.000 simulazioni Monte Carlo.
        Indica quali parametri contribuiscono maggiormente all'incertezza del risultato.
        Nota: A3 (Voucher) ha varianza CAPEX = 0 per assenza di investimento iniziale.
      </p>
      <ResponsiveContainer width="100%" height={340}>
        <RadarChart data={chartData} outerRadius="65%" margin={{ top: 16, right: 40, bottom: 16, left: 40 }}>
          <PolarGrid stroke="#e0e0e0" />
          <PolarAngleAxis dataKey="param" tick={{ fontSize: 13, fill: 'var(--color-text-primary-light, #555)' }} />
          <PolarRadiusAxis angle={90} domain={[0, 1]} tickCount={5}
            tickFormatter={v => `${Math.round(v * 100)}%`}
            tick={{ fontSize: 11, fill: '#aaa' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 13 }}
            formatter={(value: string) =>
              getAlternativeDisplayLabel(value as AlternativaId, alternative[value as AlternativaId])
            }
          />
          {scores.map(s => (
            <Radar key={s.alternativaId} name={s.alternativaId} dataKey={s.alternativaId}
              stroke={altColor(s.alternativaId, s.alternativaId === recommendedId)}
              fill={altColor(s.alternativaId, s.alternativaId === recommendedId)}
              fillOpacity={0.12} strokeWidth={2}
              dot={{ r: 3, fill: altColor(s.alternativaId, s.alternativaId === recommendedId) }}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

const cardStyle: CSSProperties = {
  background: 'var(--color-background-inverse)', border: '1px solid #d0d0d0',
  borderRadius: 'var(--radius-smooth)', padding: 'var(--spacing-inset-m)',
}
const titleStyle: CSSProperties = { margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }
const subtitleStyle: CSSProperties = { margin: '0 0 8px', fontSize: 13, color: 'var(--color-text-primary-light)' }
const tooltipStyle: CSSProperties = {
  background: 'var(--color-background-inverse)', border: '1px solid #d0d0d0',
  borderRadius: 'var(--radius-smooth)', padding: '8px 12px', fontSize: 13, maxWidth: 260,
}
const tooltipTitleStyle: CSSProperties = { margin: '0 0 6px', fontWeight: 700, color: 'var(--color-text-primary)' }
