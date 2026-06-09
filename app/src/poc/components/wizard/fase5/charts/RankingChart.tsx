// src/components/wizard/fase5/charts/RankingChart.tsx
import type { CSSProperties } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList,
} from 'recharts'
import type { AlternativaId } from '../../../../types/docfap'
import { getRankFill } from '../resultUtils'

interface RankingItem {
  id: AlternativaId
  label: string
  score: number
  isRecommended: boolean
}

interface Props {
  items: RankingItem[]
}

export function RankingChart({ items }: Props) {
  const data = [...items]
    .sort((a, b) => b.score - a.score)
    .map((item, i) => ({ ...item, fill: getRankFill(i) }))

  const chartHeight = Math.max(items.length * 56 + 48, 120)

  return (
    <div style={wrapStyle}>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 8, right: 64, left: 8, bottom: 8 }}
        >
          <CartesianGrid horizontal={false} stroke="#e7e7e7" strokeDasharray="3 3" />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: '#6e6e6e' }}
            tickLine={false}
            axisLine={{ stroke: '#e7e7e7' }}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={200}
            tick={{ fontSize: 12, fill: '#000000' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(1)}`, 'Score composito']}
            contentStyle={{ fontSize: 12, border: '1px solid #e7e7e7', borderRadius: 2 }}
          />
          <Bar dataKey="score" radius={[0, 2, 2, 0]} maxBarSize={28}>
            {data.map(entry => (
              <Cell key={entry.id} fill={entry.fill} />
            ))}
            <LabelList
              dataKey="score"
              position="right"
              formatter={(v: number) => v.toFixed(1)}
              style={{ fontSize: 11, fill: '#000', fontFamily: 'var(--font-family-0, monospace)' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

const wrapStyle: CSSProperties = { width: '100%' }
