// McaProfileRadar — Radar/spider del profilo qualitativo MCA.
// Stesso stile del radar dell'Analisi del Rischio (RiskVarianceChart), ma gli assi
// sono le domande qualitative del cluster e ogni poligono è un'alternativa.
// Valore su ciascun asse = livello di risposta (Alto=100, Medio=60, Basso=20, Nullo=0),
// così tutti gli assi condividono il dominio 0–100.
import type { CSSProperties } from 'react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, Legend,
} from 'recharts'
import type { ScoreComposito, AlternativaId, AlternativaData } from '../../../types/docfap'
import type { McaQuestion } from '../../../data/poc_docfap/evaluation_matrix'
import { getAlternativeDisplayLabel, getRecommendedAlternativeId } from '../tableHelpers'
import { makeAltColorByRank } from '../chartHelpers'

// Codice livello (A/M/B/N) → valore 0–100 per il raggio.
const LEVEL_TO_VALUE: Record<string, number> = { A: 100, M: 60, B: 20, N: 0 }
const LEVEL_LABEL: Record<string, string> = { A: 'Alto', M: 'Medio', B: 'Basso', N: 'Nullo' }
const VALUE_TO_LABEL: Record<number, string> = { 100: 'Alto', 60: 'Medio', 20: 'Basso', 0: 'Nullo' }

function truncate(str: string, max = 26): string {
  return str.length > max ? `${str.slice(0, max - 1)}…` : str
}

interface Props {
  scores: ScoreComposito[]
  alternative: Partial<Record<AlternativaId, AlternativaData>>
  questions: McaQuestion[]
  /** state.mcaScores: altId → { qCode → 'A' | 'M' | 'B' | 'N' } */
  mcaScores: Record<string, Record<string, string>>
}

type RadarRow = { qCode: string; criterio: string; fullText: string } & Record<string, string | number>

export function McaProfileRadar({ scores, alternative, questions, mcaScores }: Props) {
  if (scores.length === 0 || questions.length === 0) return null

  const recommendedId = getRecommendedAlternativeId(scores)
  const colorFor = makeAltColorByRank(scores)

  const chartData: RadarRow[] = questions.map(q => {
    const row: RadarRow = { qCode: q.qCode, criterio: truncate(q.label || q.text), fullText: q.text }
    for (const s of scores) {
      const livello = mcaScores[s.alternativaId]?.[q.qCode] ?? ''
      row[s.alternativaId] = LEVEL_TO_VALUE[livello] ?? 0
    }
    return row
  })

  const CustomTooltip = ({
    active, payload,
  }: { active?: boolean; payload?: Array<{ dataKey: string; value: number; payload: RadarRow }> }) => {
    if (!active || !payload?.length) return null
    const row = payload[0].payload
    return (
      <div style={tooltipStyle}>
        <p style={tooltipTitleStyle}>{row.fullText}</p>
        {payload.map(p => {
          const label = getAlternativeDisplayLabel(p.dataKey as AlternativaId, alternative[p.dataKey as AlternativaId])
          return (
            <p key={p.dataKey} style={{ margin: '2px 0', fontSize: 13, color: colorFor(p.dataKey) }}>
              {label}: <strong>{VALUE_TO_LABEL[p.value] ?? '—'}</strong>
            </p>
          )
        })}
      </div>
    )
  }

  // Tick angolare con etichetta che si allinea al lato del radar.
  const CustomTick = ({ x, y, payload, cx, cy }: {
    x?: number; y?: number; payload?: { value: string }; cx?: number; cy?: number
  }) => {
    if (x === undefined || y === undefined || !payload) return null
    const dx = x - (cx ?? 0)
    const textAnchor = dx > 5 ? 'start' : dx < -5 ? 'end' : 'middle'
    return (
      <text x={x} y={y} textAnchor={textAnchor} fill="var(--color-text-primary-light, #555)" fontSize={12} dominantBaseline="central">
        {payload.value}
      </text>
    )
  }

  return (
    <div style={cardStyle}>
      <h3 style={titleStyle}>Profilo qualitativo — confronto tra alternative</h3>
      <p style={subtitleStyle}>
        Ogni asse è una domanda di valutazione; il raggio indica il livello della risposta
        (Alto, Medio, Basso, Nullo). Più il poligono è esteso, migliore è il profilo qualitativo.
      </p>
      <ResponsiveContainer width="100%" height={360}>
        <RadarChart data={chartData} outerRadius="68%" margin={{ top: 16, right: 60, bottom: 16, left: 60 }}>
          <PolarGrid stroke="#e0e0e0" />
          <PolarAngleAxis dataKey="criterio" tick={<CustomTick />} />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            ticks={[0, 20, 60, 100]}
            tickFormatter={(v: number) => LEVEL_LABEL[Object.keys(LEVEL_TO_VALUE).find(k => LEVEL_TO_VALUE[k] === v) ?? ''] ?? ''}
            tick={{ fontSize: 10, fill: '#aaa' }} axisLine={false} tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 13 }}
            formatter={(value: string) =>
              getAlternativeDisplayLabel(value as AlternativaId, alternative[value as AlternativaId])
            }
          />
          {scores.map(s => (
            <Radar key={s.alternativaId} name={s.alternativaId} dataKey={s.alternativaId}
              stroke={colorFor(s.alternativaId)}
              fill={colorFor(s.alternativaId)}
              fillOpacity={0.12} strokeWidth={2}
              dot={{ r: 3, fill: colorFor(s.alternativaId) }}
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
  borderRadius: 'var(--radius-smooth)', padding: '8px 12px', fontSize: 13, maxWidth: 280,
}
const tooltipTitleStyle: CSSProperties = { margin: '0 0 6px', fontWeight: 700, color: 'var(--color-text-primary)' }
