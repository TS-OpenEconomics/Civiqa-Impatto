/* ══════════════════════════════════════════════════════════════
   StepDurata.tsx — Step 9: Project duration (start + end dates)
   ══════════════════════════════════════════════════════════════ */

import { useState } from 'react'
import { useValutazioneWizard } from '../../../contexts/ValutazioneWizardContext'
import { WizardSectionCard, WizardStepHeader } from './primitives'

const MONTHS_IT = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre',
]
const DAYS_IT = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']

/* ─── Format a Date object as dd/mm/yyyy ─── */
function formatDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}/${mm}/${d.getFullYear()}`
}

/* ─── Parse dd/mm/yyyy string to {day, month (0-based), year} ─── */
function parseDate(s: string): { day: number; month: number; year: number } | null {
  const parts = s.split('/')
  if (parts.length !== 3) return null
  const day = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10) - 1
  const year = parseInt(parts[2], 10)
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null
  return { day, month, year }
}

/* ─── Get first day of week (Mon=0 ... Sun=6) for a given month/year ─── */
function getFirstDayOfWeek(year: number, month: number): number {
  return (new Date(year, month, 1).getDay() + 6) % 7
}

/* ─── Get number of days in a month ─── */
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

/* ─── Calendar sub-component ─── */
interface CalendarProps {
  calYear: number
  calMonth: number
  selectedDateStr: string
  onSelectDay: (day: number) => void
  onChangeMonth: (year: number, month: number) => void
}

function Calendar({ calYear, calMonth, selectedDateStr, onSelectDay, onChangeMonth }: CalendarProps) {
  const firstDow = getFirstDayOfWeek(calYear, calMonth)
  const daysInMonth = getDaysInMonth(calYear, calMonth)
  const today = new Date()
  const todayDay = today.getDate()
  const todayMonth = today.getMonth()
  const todayYear = today.getFullYear()

  const selectedParsed = parseDate(selectedDateStr)

  // Build year options 2020-2040
  const yearOptions = Array.from({ length: 21 }, (_, i) => 2020 + i)

  const prevMonth = () => {
    if (calMonth === 0) onChangeMonth(calYear - 1, 11)
    else onChangeMonth(calYear, calMonth - 1)
  }
  const nextMonth = () => {
    if (calMonth === 11) onChangeMonth(calYear + 1, 0)
    else onChangeMonth(calYear, calMonth + 1)
  }

  // Grid: 6 rows × 7 cols
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className="border border-gray-200 bg-white mt-3 select-none" style={{ minWidth: 260 }}>
      {/* Calendar header */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
        <button
          onClick={prevMonth}
          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-800"
          aria-label="Mese precedente"
          type="button"
        >
          ‹
        </button>
        <div className="flex items-center gap-2">
          <select
            value={calMonth}
            onChange={e => onChangeMonth(calYear, parseInt(e.target.value, 10))}
            className="text-xs font-medium text-gray-800 border-0 bg-transparent focus:outline-none cursor-pointer"
          >
            {MONTHS_IT.map((m, i) => (
              <option key={m} value={i}>{m}</option>
            ))}
          </select>
          <select
            value={calYear}
            onChange={e => onChangeMonth(parseInt(e.target.value, 10), calMonth)}
            className="text-xs font-medium text-gray-800 border-0 bg-transparent focus:outline-none cursor-pointer"
          >
            {yearOptions.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <button
          onClick={nextMonth}
          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-800"
          aria-label="Mese successivo"
          type="button"
        >
          ›
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 border-b border-gray-100">
        {DAYS_IT.map(d => (
          <div key={d} className="py-1.5 text-center text-xs font-semibold text-gray-500">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {cells.map((day, idx) => {
          if (!day) {
            return <div key={idx} className="h-8" />
          }
          const isToday = day === todayDay && calMonth === todayMonth && calYear === todayYear
          const isSelected = selectedParsed
            ? day === selectedParsed.day && calMonth === selectedParsed.month && calYear === selectedParsed.year
            : false

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectDay(day)}
              className={`h-8 text-xs flex items-center justify-center transition-colors
                ${isSelected
                  ? 'bg-bluette-700 text-white font-semibold'
                  : isToday
                  ? 'text-bluette-700 font-semibold hover:bg-bluette-50'
                  : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Date panel (input + calendar) ─── */
interface DatePanelProps {
  title: string
  value: string
  onChange: (val: string) => void
}

function DatePanel({ title, value, onChange }: DatePanelProps) {
  const now = new Date()
  const parsed = parseDate(value)
  const [calYear, setCalYear] = useState(parsed ? parsed.year : now.getFullYear())
  const [calMonth, setCalMonth] = useState(parsed ? parsed.month : now.getMonth())

  const handleDayClick = (day: number) => {
    const d = new Date(calYear, calMonth, day)
    onChange(formatDate(d))
  }

  const handleInput = (raw: string) => {
    onChange(raw)
    // Try to sync calendar if valid
    const p = parseDate(raw)
    if (p) {
      setCalYear(p.year)
      setCalMonth(p.month)
    }
  }

  return (
    <div className="flex-1">
      <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-xs text-gray-500 mb-2">Formato data gg/mm/aaaa</p>
      <input
        type="text"
        value={value}
        onChange={e => handleInput(e.target.value)}
        placeholder="gg / mm / aaaa"
        className="w-full border border-gray-300 px-3 py-2 text-sm text-gray-800
          focus:outline-none focus:border-bluette-700 transition-colors"
        style={{ borderRadius: 0 }}
        aria-label={title}
      />
      <Calendar
        calYear={calYear}
        calMonth={calMonth}
        selectedDateStr={value}
        onSelectDay={handleDayClick}
        onChangeMonth={(y, m) => { setCalYear(y); setCalMonth(m) }}
      />
    </div>
  )
}

/* ─── Main step component ─── */
export function StepDurata() {
  const { state, setState } = useValutazioneWizard()

  const handleStartDateChange = (value: string) => {
    const previousStartYear = parseDate(state.start_date)?.year
    const nextStartYear = parseDate(value)?.year
    const defaultUpdateYear = new Date().getFullYear() + 1
    const shouldSyncUpdateYear =
      state.update_year === defaultUpdateYear || (previousStartYear !== undefined && state.update_year === previousStartYear)

    if (shouldSyncUpdateYear && nextStartYear !== undefined) {
      setState({ start_date: value, update_year: nextStartYear })
      return
    }

    setState({ start_date: value })
  }

  return (
    <div>
      <WizardStepHeader
        title="Qual è la durata del progetto?"
        description="Indica le date di inizio e fine del progetto. Queste informazioni determinano il periodo di analisi utilizzato nei calcoli economici e nella distribuzione degli investimenti sugli anni."
      />

      <WizardSectionCard title="Cronoprogramma">
        <div className="flex gap-8">
          <DatePanel
            title="Data di inizio progetto"
            value={state.start_date}
            onChange={handleStartDateChange}
          />
          <DatePanel
            title="Data di fine progetto"
            value={state.end_date}
            onChange={val => setState({ end_date: val })}
          />
        </div>
      </WizardSectionCard>
    </div>
  )
}
