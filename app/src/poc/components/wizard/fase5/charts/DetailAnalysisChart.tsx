// src/components/wizard/fase5/charts/DetailAnalysisChart.tsx
import { useState } from 'react'
import type { CSSProperties } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts'
import type { AlternativaId, ScoreComposito } from '../../../../types/docfap'
import type { McaQuestion } from '../../../../data/poc_docfap/evaluation_matrix'
import { getRankFill, normalizeValues } from '../resultUtils'
import { buildRankIndexMap } from '../../../docfap/rankColors'

type AnalysisKey = 'cba' | 'impatto' | 'mca' | 'sensitivita'

interface Props {
  ranking: ScoreComposito[]
  getLabel: (id: AlternativaId) => string
  recommendedId: AlternativaId | null
  mcaQuestions: McaQuestion[]
}

const ANALYSIS_TABS: { key: AnalysisKey; label: string }[] = [
  { key: 'cba', label: 'Analisi CBA' },
  { key: 'impatto', label: "Analisi d'Impatto" },
  { key: 'mca', label: 'Analisi Multicriteria' },
  { key: 'sensitivita', label: 'Analisi del Rischio' },
]

const CBA_METRICS = [
  { key: 'van', label: 'VAN (€M)', raw: (s: ScoreComposito) => s.van / 1_000_000 },
  { key: 'bcr', label: 'BCR', raw: (s: ScoreComposito) => s.bcr },
  { key: 'tir', label: 'TIR (%)', raw: (s: ScoreComposito) => s.tir * 100 },
]

const IMPATTO_METRICS = [
  { key: 'pil', label: 'PIL (€M)', raw: (s: ScoreComposito) => s.pil },
  { key: 'occupati', label: 'Occupazione', raw: (s: ScoreComposito) => s.occupati },
  { key: 'produzione', label: 'Produzione (€M)', raw: (s: ScoreComposito) => s.produzione },
  { key: 'redditi', label: 'Redditi (€M)', raw: (s: ScoreComposito) => s.redditi },
]

function buildNormalizedData(
  metrics: { key: string; label: string; raw: (s: ScoreComposito) => number }[],
  ranking: ScoreComposito[],
): Record<string, unknown>[] {
  return metrics.map(metric => {
    const rawVals = ranking.map(s => metric.raw(s))
    const normalized = normalizeValues(rawVals)
    const point: Record<string, unknown> = { metric: metric.label }
    ranking.forEach((s, i) => {
      point[s.alternativaId] = normalized[i]
      point[`${s.alternativaId}_raw`] = rawVals[i]
    })
    return point
  })
}

function buildScenariData(ranking: ScoreComposito[]): Record<string, unknown>[] | null {
  const labels = ranking
    .find(s => (s.sensitivitaDetail?.scenari?.length ?? 0) > 0)
    ?.sensitivitaDetail?.scenari.map(sc => sc.label) ?? []
  if (labels.length === 0) return null
  return labels.map(label => {
    const point: Record<string, unknown> = { metric: label }
    for (const s of ranking) {
      const scenario = s.sensitivitaDetail?.scenari?.find(sc => sc.label === label)
      point[s.alternativaId] = scenario?.score ?? 0
    }
    return point
  })
}

export function DetailAnalysisChart({ ranking, getLabel, recommendedId: _recommendedId, mcaQuestions }: Props) {
  const [activeKey, setActiveKey] = useState<AnalysisKey>('cba')

  // Colore per piazzamento: 1ª verde, 2ª arancione (con 3+ opzioni), resto grigio.
  const rankMap = buildRankIndexMap(ranking)
  const fill = (item: ScoreComposito) => getRankFill(rankMap[item.alternativaId] ?? 0, ranking.length)

  let chartData: Record<string, unknown>[] = []
  let subLabel = ''

  if (activeKey === 'cba') {
    chartData = buildNormalizedData(CBA_METRICS, ranking)
    subLabel = 'VAN (€M) · BCR · TIR (%) — valori normalizzati per confronto visivo'
  } else if (activeKey === 'impatto') {
    chartData = buildNormalizedData(IMPATTO_METRICS, ranking)
    subLabel = 'PIL · Occupazione · Produzione · Redditi — valori normalizzati'
  } else if (activeKey === 'mca') {
    if (mcaQuestions.length > 0) {
      chartData = mcaQuestions.slice(0, 8).map(q => {
        const point: Record<string, unknown> = { metric: q.label.slice(0, 24) }
        for (const s of ranking) {
          point[s.alternativaId] = s.mcaScore
        }
        return point
      })
      subLabel = 'Score MCA aggregato per alternativa'
    }
  } else {
    const scenariData = buildScenariData(ranking)
    chartData = scenariData ?? []
    subLabel = 'Score per scenario stress test'
  }

  return (
    <div>
      <div style={switcherStyle}>
        {ANALYSIS_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveKey(tab.key)}
            style={activeKey === tab.key ? switcherActiveStyle : switcherInactiveStyle}
            aria-pressed={activeKey === tab.key}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {subLabel && <p style={subLabelStyle}>{subLabel}</p>}

      {chartData.length === 0 ? (
        <p style={emptyStyle}>Dati non disponibili per questa analisi.</p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 8 }} barGap={2} barCategoryGap="22%">
            <CartesianGrid vertical={false} stroke="#e7e7e7" strokeDasharray="3 3" />
            <XAxis dataKey="metric" tick={{ fontSize: 10, fill: '#6e6e6e' }} axisLine={false} tickLine={false} />
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
        </ResponsiveContainer>
      )}
    </div>
  )
}

// ── Styles ──────────────────────────────────────────────────────────────────

const switcherStyle: CSSProperties = {
  display: 'flex',
  borderBottom: '2px solid var(--color-border-secondary-light, #e7e7e7)',
  marginBottom: '16px',
}

const baseSwitcherItemStyle: CSSProperties = {
  height: '36px',
  display: 'flex',
  alignItems: 'center',
  padding: '0 14px',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: 700,
  border: 'none',
  background: 'transparent',
  borderBottom: '3px solid transparent',
  marginBottom: '-2px',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
}

const switcherInactiveStyle: CSSProperties = {
  ...baseSwitcherItemStyle,
  color: 'var(--color-text-primary-lighter, #6e6e6e)',
}

const switcherActiveStyle: CSSProperties = {
  ...baseSwitcherItemStyle,
  color: 'var(--color-text-secondary-light, #7c4dff)',
  borderBottomColor: 'var(--color-border-primary-light, #7c4dff)',
}

const subLabelStyle: CSSProperties = {
  fontSize: '11px',
  color: 'var(--color-text-primary-lighter, #6e6e6e)',
  marginBottom: '12px',
}

const emptyStyle: CSSProperties = {
  padding: '20px',
  textAlign: 'center',
  color: 'var(--color-text-primary-lighter, #6e6e6e)',
  fontSize: '12px',
}
