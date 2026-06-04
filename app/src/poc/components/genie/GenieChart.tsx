import React, { Component } from 'react'
import type { ReactNode } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer,
} from 'recharts'
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent'
import type { QueryResult } from '../../services/genieService'

interface ChartEntry {
  [key: string]: string | number
}

interface ParsedChartData {
  labelKey: string
  numericKeys: string[]
  data: ChartEntry[]
}

function isNumericValue(value: string): boolean {
  if (value === null || value === undefined || value.trim() === '') return false
  return !isNaN(Number(value))
}

function parseChartData(result: QueryResult): ParsedChartData | null {
  const columns = result?.manifest?.schema?.columns ?? []
  const dataArray = result?.result?.data_array ?? []

  if (columns.length === 0 || dataArray.length === 0) return null

  const firstRow = dataArray[0]

  let labelColIndex = -1
  for (let i = 0; i < firstRow.length; i++) {
    if (!isNumericValue(firstRow[i])) {
      labelColIndex = i
      break
    }
  }

  if (labelColIndex === -1) return null

  const labelKey = columns[labelColIndex].name

  const numericIndices: number[] = []
  for (let i = 0; i < columns.length; i++) {
    if (i === labelColIndex) continue
    if (isNumericValue(firstRow[i])) numericIndices.push(i)
  }

  if (numericIndices.length === 0) return null

  const numericKeys = numericIndices.map(i => columns[i].name)

  const data: ChartEntry[] = dataArray.map(row => {
    const entry: ChartEntry = { [labelKey]: row[labelColIndex] }
    numericIndices.forEach((colIdx, idx) => {
      entry[numericKeys[idx]] = Number(row[colIdx])
    })
    return entry
  })

  return { labelKey, numericKeys, data }
}

// Infer unit of measure from column name
function detectUnit(columnName: string): string {
  const s = columnName.toLowerCase()
  if (s.includes('%') || s.includes('perc') || s.includes('tasso') || s.includes('quota') || s.includes('rate')) return '%'
  if (s.includes('reddito') || s.includes('euro') || s.includes('imponibil') || s.includes('€') || s.includes('valore') || s.includes('spesa')) return '€'
  return ''
}

function sep(value: number): string {
  return value.toLocaleString('it-IT')
}

// Format a tick value for the Y-axis
function formatTick(value: number, unit: string): string {
  if (unit === '%') return `${value.toFixed(1)}%`
  if (unit === '€') {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M€`
    return `${sep(value)}€`
  }
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  return sep(value)
}

// Format a bar value label
function formatLabel(value: number, unit: string): string {
  if (unit === '%') return `${value.toFixed(1)}%`
  if (unit === '€') {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M€`
    return `${sep(value)}€`
  }
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  return sep(value)
}

function getNumericValue(value: ValueType | undefined): number {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

function formatTooltipValue(
  value: ValueType | undefined,
  name: NameType | undefined,
  unit: string,
): [string, string] {
  return [formatTick(getNumericValue(value), unit), String(name ?? '')]
}

function formatTooltipLabel(label: ReactNode): string {
  return typeof label === 'number' ? formatTick(label, '') : String(label ?? '')
}

function formatChartLabel(value: unknown, unit: string): string {
  return formatLabel(getNumericValue(value as ValueType | undefined), unit)
}

const SERIES_COLORS = [
  'var(--color-background-primary)',  // Bluette — series 1
  'var(--color-data-set-01-80)',      // Magenta — series 2
  'var(--color-data-set-03-80)',      // Cyan — series 3
  'var(--color-background-accent)',   // Lime — series 4+
]

const LABEL_STYLE = {
  fontSize: 12,
  fontFamily: 'var(--font-family-mono)',
  fill: 'var(--color-text-primary-lighter)',
}

const AXIS_TICK_STYLE = {
  fontFamily: 'var(--font-family-mono)',
  fontSize: 12,
  fill: 'var(--color-text-primary-lighter)',
}

const AXIS_LABEL_STYLE = {
  fontFamily: 'var(--font-family-body)',
  fontSize: 12,
  fill: 'var(--color-text-primary-lighter)',
}

const TOOLTIP_STYLE = {
  fontFamily: 'var(--font-family-body)',
  fontSize: '13px',
  border: '1px solid var(--color-border-secondary-light)',
  borderRadius: 'var(--radius-smooth)',
  boxShadow: 'none',
  color: 'var(--color-text-primary)',
}

interface GenieChartInnerProps {
  result: QueryResult
  title?: string
}

function GenieChartInner({ result, title }: GenieChartInnerProps): React.ReactElement | null {
  try {
    const parsed = parseChartData(result)
    if (!parsed) return null

    const { labelKey, numericKeys, data } = parsed
    const unit = detectUnit(numericKeys[0])

    // Only show bar value labels when few enough bars to avoid crowding
    const showValueLabels = data.length <= 14
    const multiSeries = numericKeys.length > 1

    // Dynamic bottom margin to fit x-axis label
    const chartMargin = { top: 16, right: 16, left: 8, bottom: 36 }

    return (
      <div className="genie-chart-container">
        {title && (
          <p
            style={{
              fontFamily: 'var(--font-family-body)',
              fontSize: 'var(--type-body-xs-size)',
              fontWeight: 'var(--type-weight-bold)',
              color: 'var(--color-text-primary)',
              margin: '0 0 var(--spacing-xs)',
            }}
          >
            {title}
          </p>
        )}

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} margin={chartMargin} barCategoryGap="28%">
            <XAxis
              dataKey={labelKey}
              tick={AXIS_TICK_STYLE}
              tickLine={false}
              axisLine={{ stroke: 'var(--color-border-secondary-light)' }}
              label={{
                value: labelKey,
                position: 'insideBottom',
                offset: -20,
                style: AXIS_LABEL_STYLE,
              }}
            />
            <YAxis
              tickFormatter={(v: number) => formatTick(v, unit)}
              tick={AXIS_TICK_STYLE}
              tickLine={false}
              axisLine={false}
              width={72}
              label={{
                value: unit ? `${numericKeys[0]} (${unit})` : numericKeys[0],
                angle: -90,
                position: 'insideLeft',
                offset: 12,
                style: { ...AXIS_LABEL_STYLE, textAnchor: 'middle' },
              }}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              cursor={{ fill: 'var(--color-background-secondary-lighter)' }}
              formatter={(value, name) => formatTooltipValue(value, name, unit)}
              labelFormatter={formatTooltipLabel}
            />
            {multiSeries && (
              <Legend
                wrapperStyle={{
                  fontFamily: 'var(--font-family-body)',
                  fontSize: '11px',
                  paddingTop: '4px',
                }}
              />
            )}
            {numericKeys.map((key, idx) => (
              <Bar
                key={key}
                dataKey={key}
                fill={SERIES_COLORS[idx % SERIES_COLORS.length]}
                radius={[1, 1, 0, 0]}
                name={key}
              >
                {showValueLabels && (
                  <LabelList
                    dataKey={key}
                    position="top"
                    style={LABEL_STYLE}
                    formatter={(value) => formatChartLabel(value, unit)}
                  />
                )}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  } catch {
    return null
  }
}

interface ErrorBoundaryState { hasError: boolean }

class GenieChartErrorBoundary extends Component<GenieChartInnerProps, ErrorBoundaryState> {
  constructor(props: GenieChartInnerProps) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }
  render(): React.ReactNode {
    if (this.state.hasError) return null
    return <GenieChartInner {...this.props} />
  }
}

export function GenieChart(props: GenieChartInnerProps): React.ReactElement {
  return <GenieChartErrorBoundary {...props} />
}
