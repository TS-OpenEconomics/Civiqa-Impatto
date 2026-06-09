// src/components/wizard/fase5/ResultSwitcherNav.tsx
import type { CSSProperties } from 'react'

export type ResultTabKey = 'riepilogo' | 'cba' | 'rischio' | 'impatto' | 'sensitivita'

const TABS: { key: ResultTabKey; label: string }[] = [
  { key: 'riepilogo', label: 'Riepilogo' },
  { key: 'cba', label: 'Analisi Costi Benefici' },
  { key: 'rischio', label: 'Analisi del Rischio' },
  { key: 'impatto', label: "Analisi d'Impatto" },
  { key: 'sensitivita', label: 'Analisi di Sensitività' },
]

interface Props {
  active: ResultTabKey
  onChange: (tab: ResultTabKey) => void
}

export function ResultSwitcherNav({ active, onChange }: Props) {
  return (
    <div style={wrapStyle}>
      <div role="tablist" aria-label="Sezioni analisi DOCFAP" style={navStyle}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            role="tab"
            id={`result-sw-${tab.key}`}
            aria-selected={active === tab.key}
            aria-controls={`result-panel-${tab.key}`}
            onClick={() => onChange(tab.key)}
            style={active === tab.key ? activeStyle : inactiveStyle}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Styles (DS Switcher §5b — underline, centrato) ──────────────────────────

const wrapStyle: CSSProperties = {
  borderBottom: '2px solid var(--color-border-secondary-light, #e7e7e7)',
  marginTop: '24px',
  background: 'transparent',
}

const navStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 0,
}

const baseTabStyle: CSSProperties = {
  height: '44px',
  display: 'flex',
  alignItems: 'center',
  padding: '0 20px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 700,
  whiteSpace: 'nowrap',
  border: 'none',
  background: 'transparent',
  borderBottom: '3px solid transparent',
  marginBottom: '-2px',
  transition: 'color .15s, border-color .15s',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
}

const activeStyle: CSSProperties = {
  ...baseTabStyle,
  color: 'var(--color-text-secondary-light, #7c4dff)',
  borderBottomColor: 'var(--color-border-primary-light, #7c4dff)',
}

const inactiveStyle: CSSProperties = {
  ...baseTabStyle,
  color: 'var(--color-text-primary-lighter, #6e6e6e)',
}
