// src/components/wizard/fase5/charts/DimensionChart.tsx
import { useState } from 'react'
import type { CSSProperties } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts'
import type { AlternativaId, ScoreComposito } from '../../../../types/docfap'
import { getRankFill } from '../resultUtils'
import { buildRankIndexMap } from '../../../docfap/rankColors'

interface Props {
  ranking: ScoreComposito[]
  getLabel: (id: AlternativaId) => string
  recommendedId: AlternativaId | null
}

const DIMENSIONS = [
  { key: 'cbaScore' as keyof ScoreComposito, label: 'CBA' },
  { key: 'impattoScore' as keyof ScoreComposito, label: 'Impatto' },
  { key: 'mcaScore' as keyof ScoreComposito, label: 'Multicriteria' },
  { key: 'sensitivityScore' as keyof ScoreComposito, label: 'Rischio' },
]

export function DimensionChart({ ranking, getLabel, recommendedId: _recommendedId }: Props) {
  const [mode, setMode] = useState<'barre' | 'radar'>('barre')

  const data = DIMENSIONS.map(dim => {
    const point: Record<string, unknown> = { dimension: dim.label }
    for (const item of ranking) {
      point[item.alternativaId] = Number(item[dim.key])
    }
    return point
  })

  // Colore per piazzamento: 1ª verde, 2ª arancione (con 3+ opzioni), resto grigio.
  const rankMap = buildRankIndexMap(ranking)
  const fill = (item: ScoreComposito) => getRankFill(rankMap[item.alternativaId] ?? 0, ranking.length)

  return (
    <div>
      <div style={toggleWrapStyle}>
        <button
          onClick={() => setMode('barre')}
          style={mode === 'barre' ? toggleActiveStyle : toggleStyle}
          aria-pressed={mode === 'barre'}
        >
          Barre
        </button>
        <button
          onClick={() => setMode('radar')}
          style={mode === 'radar' ? toggleActiveStyle : toggleStyle}
          aria-pressed={mode === 'radar'}
        >
          Radar
        </button>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        {mode === 'barre' ? (
          <BarChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 8 }} barGap={2} barCategoryGap="22%">
            <CartesianGrid vertical={false} stroke="#e7e7e7" strokeDasharray="3 3" />
            <XAxis dataKey="dimension" tick={{ fontSize: 11, fill: '#6e6e6e' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#6e6e6e' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontSize: 12, border: '1px solid #e7e7e7', borderRadius: 2 }} />
            <Legend formatter={(value: string) => getLabel(value as AlternativaId)} wrapperStyle={{ fontSize: 11 }} />
            {ranking.map((item) => (
              <Bar
                key={item.alternativaId}
                dataKey={item.alternativaId}
                name={item.alternativaId}
                fill={fill(item)}
                radius={[2, 2, 0, 0]}
                maxBarSize={52}
              />
            ))}
          </BarChart>
        ) : (
          <RadarChart data={data} margin={{ top: 16, right: 16, bottom: 16, left: 16 }}>
            <PolarGrid stroke="#e7e7e7" />
            <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: '#6e6e6e' }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: '#bbb' }} />
            {ranking.map((item) => (
              <Radar
                key={item.alternativaId}
                name={item.alternativaId}
                dataKey={item.alternativaId}
                stroke={fill(item)}
                fill={fill(item)}
                fillOpacity={0.15}
              />
            ))}
            <Legend formatter={(value: string) => getLabel(value as AlternativaId)} wrapperStyle={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ fontSize: 12, border: '1px solid #e7e7e7', borderRadius: 2 }} />
          </RadarChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

// ── Styles ──────────────────────────────────────────────────────────────────

const toggleWrapStyle: CSSProperties = {
  display: 'flex',
  border: '1px solid var(--color-border-secondary-light, #e7e7e7)',
  borderRadius: 'var(--radius-smooth)',
  overflow: 'hidden',
  width: 'fit-content',
  marginBottom: '16px',
}

const baseToggleStyle: CSSProperties = {
  height: '28px',
  padding: '0 14px',
  fontSize: '11px',
  fontWeight: 700,
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
}

const toggleStyle: CSSProperties = {
  ...baseToggleStyle,
  background: 'var(--color-background-inverse, #ffffff)',
  color: 'var(--color-text-primary-lighter, #6e6e6e)',
}

const toggleActiveStyle: CSSProperties = {
  ...baseToggleStyle,
  background: 'var(--color-background-primary, #5B21F7)',
  color: 'var(--color-text-inverse, #ffffff)',
}
