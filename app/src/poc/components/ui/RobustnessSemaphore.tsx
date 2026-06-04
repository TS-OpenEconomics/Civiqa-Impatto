import { useId, useState, useRef, useEffect, type KeyboardEvent } from 'react'

/* ── Types ──────────────────────────────────────────────────────────────────
   Spec: CLAUDE.md §8 — semaforo robustezza CER.
   WCAG 1.4.1: color is NEVER the only visual cue — icon + text ALWAYS shown.
   WCAG 4.1.2: tooltip is keyboard-accessible (Enter/Space opens, Esc closes).
   ────────────────────────────────────────────────────────────────────────── */

export type RobustnessLevel = -1 | 0 | 1 | 2 | 3

export interface RobustnessSemaphoreProps {
  level:      RobustnessLevel
  nProgetti?: number
  className?: string
}

/* ── Level config ────────────────────────────────────────────────────────── */
interface LevelConfig {
  label:       string
  description: string
  bg:          string
  text:        string
  border:      string
  iconColor:   string
}

const LEVELS: Record<RobustnessLevel, LevelConfig> = {
  [-1]: {
    label:       'Nessuna stima disponibile',
    description: 'Nessun dato CER disponibile per questa combinazione categoria/tipologia.',
    bg:          'var(--color-background-secondary-lighter)',
    text:        'var(--color-text-primary)',
    border:      'var(--color-border-secondary-light)',
    iconColor:   'var(--color-text-disable)',
  },
  0: {
    label:       'Livello 0 — Stima Debole',
    description: 'Dati insufficienti per produrre una stima parametrica affidabile. Sono presenti meno di 20 progetti di riferimento. Usare con estrema cautela.',
    bg:          'var(--color-background-error-light)',
    text:        'var(--color-text-primary)',
    border:      'var(--color-border-error)',
    iconColor:   'var(--palette-red-600)',
  },
  1: {
    label:       'Livello 1 — Stima Indicativa',
    description: 'Stima basata su un campione limitato (20–100 progetti). Valore orientativo, da verificare con analisi di dettaglio.',
    bg:          'var(--color-background-warning-lighter)',
    text:        'var(--color-text-warning)',
    border:      'var(--color-border-warning)',
    iconColor:   'var(--color-icon-warning)',
  },
  2: {
    label:       'Livello 2 — Stima Affidabile',
    description: 'Stima basata su campione significativo (100–200 progetti). Affidabilità statistica buona. Adeguata per analisi preliminari.',
    bg:          'var(--palette-orange-100)',
    text:        'var(--color-text-primary)',
    border:      'var(--palette-orange-400)',
    iconColor:   'var(--palette-orange-600)',
  },
  3: {
    label:       'Livello 2+ — Stima Certificata',
    description: 'Stima altamente affidabile basata su oltre 200 progetti. Adeguata per DOCFAP e valutazioni ufficiali.',
    bg:          'var(--color-background-success-light)',
    text:        'var(--color-text-primary)',
    border:      'var(--color-border-success)',
    iconColor:   'var(--palette-green-700)',
  },
}

/* ── Icons ──────────────────────────────────────────────────────────────── */
function IconBanCircle({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8.5" stroke={color} strokeWidth="1.5" />
      <path d="M4.5 4.5l11 11" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IconWarning({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 2.5L1.5 17h17L10 2.5z"
        stroke={color} strokeWidth="1.5" strokeLinejoin="round"
      />
      <path d="M10 8v4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="14.5" r="0.75" fill={color} />
    </svg>
  )
}

function IconCheckCircle({ color, filled }: { color: string; filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle
        cx="10" cy="10" r="8.5"
        stroke={color} strokeWidth="1.5"
        fill={filled ? color : 'none'}
      />
      <path
        d="M6.5 10.5l2.5 2.5 4-5"
        stroke={filled ? 'white' : color}
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

function IconHelp() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5.5 5.5a1.5 1.5 0 112.5 1.5C7.5 7.5 7 8 7 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="7" cy="10.5" r="0.6" fill="currentColor" />
    </svg>
  )
}

/* ── Scoped styles ──────────────────────────────────────────────────────── */
const SEM_STYLES = `
  .sem-oe {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-inline-xs, 8px);
    font-family: var(--font-family-1, 'Atkinson Hyperlegible Next', sans-serif);
  }
  /* Badge pill */
  .sem-oe__badge {
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    gap: 3px;
    padding: 4px 10px 4px 6px;
    border: 1px solid transparent;
    border-radius: var(--radius-rounded, 40px);
    font-size: var(--type-body-xs-size, 14px);
    font-weight: var(--type-weight-medium, 500);
    white-space: nowrap;
    user-select: none;
  }
  .sem-oe__label {
    padding-left: 0;
    line-height: 1.2;
  }
  /* Tooltip trigger button */
  .sem-oe__trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 0;
    color: var(--color-text-primary-lighter);
    border-radius: 50%;
    flex-shrink: 0;
  }
  .sem-oe__trigger:hover {
    color: var(--color-text-primary);
  }
  .sem-oe__trigger:focus-visible {
    outline: none;
    box-shadow: 0 0 0 1px rgba(110, 26, 255, 0.55);
  }
  /* Tooltip */
  .sem-oe__tooltip {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 0;
    z-index: 200;
    width: 280px;
    padding: var(--spacing-inset-s, 16px);
    background-color: var(--color-background-inverse);
    border: 1px solid var(--color-border-secondary-light);
    border-radius: var(--radius-smooth, 2px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    font-size: var(--type-body-xs-size, 14px);
    color: var(--color-text-primary);
    line-height: 1.5;
  }
  .sem-oe__tooltip[hidden] {
    display: none;
  }
  .sem-oe__tooltip-title {
    font-weight: var(--type-weight-bold, 700);
    margin-bottom: 6px;
  }
  .sem-oe__tooltip-progetti {
    margin-top: 8px;
    font-family: var(--font-family-0, 'Atkinson Hyperlegible Mono', monospace);
    color: var(--color-text-primary-light);
  }
`

/* ── Component ──────────────────────────────────────────────────────────── */
export function RobustnessSemaphore({
  level,
  nProgetti,
  className = '',
}: RobustnessSemaphoreProps) {
  const baseId    = useId()
  const tooltipId = `${baseId}-tooltip`
  const cfg       = LEVELS[level]

  const [open, setOpen] = useState(false)
  const triggerRef      = useRef<HTMLButtonElement>(null)

  // Close tooltip when clicking outside
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!triggerRef.current?.closest('.sem-oe')?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setOpen((o) => !o)
    }
    if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const iconNode =
    level === -1 ? <IconBanCircle color={cfg.iconColor} /> :
    level === 0  ? <IconWarning color={cfg.iconColor} /> :
    level === 1  ? null :
    level === 2  ? <IconCheckCircle color={cfg.iconColor} filled={false} /> :
                   <IconCheckCircle color={cfg.iconColor} filled={true} />

  return (
    <>
      <style>{SEM_STYLES}</style>

      <span className={`sem-oe ${className}`}>
        {/* Badge: icon + text — BOTH always visible per WCAG 1.4.1 */}
        <span
          className="sem-oe__badge"
          style={{
            backgroundColor: cfg.bg,
            color:           cfg.text,
            border:          `1px solid ${cfg.border}`,
          }}
        >
          {iconNode}
          <span
            className="sem-oe__label"
            style={iconNode ? undefined : { paddingLeft: 0 }}
          >
            {cfg.label}
          </span>
        </span>

        {/* Tooltip trigger — keyboard accessible */}
        <button
          ref={triggerRef}
          type="button"
          className="sem-oe__trigger"
          aria-label="Dettagli robustezza stima"
          aria-expanded={open}
          aria-controls={tooltipId}
          aria-describedby={tooltipId}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={handleKeyDown}
        >
          <IconHelp />
        </button>

        {/* Tooltip content */}
        <span
          id={tooltipId}
          role="tooltip"
          className="sem-oe__tooltip"
          hidden={!open}
        >
          <p className="sem-oe__tooltip-title">{cfg.label}</p>
          <p>{cfg.description}</p>
          {nProgetti !== undefined && (
            <p className="sem-oe__tooltip-progetti">
              Progetti di riferimento: <strong>{nProgetti.toLocaleString('it-IT')}</strong>
            </p>
          )}
        </span>
      </span>
    </>
  )
}
