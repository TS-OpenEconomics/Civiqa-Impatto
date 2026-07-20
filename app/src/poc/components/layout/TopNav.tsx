import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import colleferroStemma from '../../assets/Logo_Comune_Colleferro.png.png'
import civiqaLogo from '../../assets/civiqa-logo.png'
import civiqaLogoWhite from '../../assets/civiqa-logo-white.png'
import { useAuth } from '../../../contexts/AuthContext'
import { useTheme, toggleTheme } from '../../../hooks/useTheme'
import { IconValutazione } from './SideNav'

/* ── Theme toggle (sun / moon) ─────────────────────────── */
function ThemeToggle() {
  const theme = useTheme()
  const dark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? 'Passa al tema chiaro' : 'Passa al tema scuro'}
      title={dark ? 'Tema chiaro' : 'Tema scuro'}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 34,
        height: 34,
        border: 'none',
        background: 'none',
        color: 'var(--color-icon-primary-lighter)',
        cursor: 'pointer',
        flexShrink: 0,
      }}
      className={`hover:text-[var(--color-icon-primary)] ${FOCUS_RING}`}
    >
      {dark ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M20 14.5A8 8 0 0 1 9.5 4 7 7 0 1 0 20 14.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}

/* ── Constants ──────────────────────────────────────────── */

const DATA_ROOM_URL = 'https://app.civiqa.it/programmazione/data-room'
const RISORSE_URL   = 'https://demo.openrep.eu/projects'
const PROJECT_MANAGER_URL = '#' // TODO: sostituire con il link definitivo

/* ── SVG icons per i moduli nel dropdown (16×16) ────────── */

function IconBarChart() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1" y="9" width="3" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.4" />
      <rect x="6" y="6" width="3" height="9" rx="0.5" stroke="currentColor" strokeWidth="1.4" />
      <rect x="11" y="2" width="3" height="13" rx="0.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

function IconCalendar() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.5" y="2.5" width="13" height="12" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5 1v3M11 1v3M1.5 6.5h13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M4.5 9.5h2M9.5 9.5h2M4.5 12h2M9.5 12h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function IconDocument() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 1.5h7l3 3V14a.5.5 0 0 1-.5.5h-9A.5.5 0 0 1 3 14V1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M10 1.5V4.5H13" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M5.5 8h5M5.5 10.5h5M5.5 5.5h2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function IconEdit() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M11.5 2.5l2 2-7 7H4.5v-2l7-7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M2 14h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function IconChecked() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.5" y="1.5" width="13" height="13" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <path d="M4 8.5l3 3 5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconGantt() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.5" y="2.25" width="7" height="2.6" rx="0.6" stroke="currentColor" strokeWidth="1.4" />
      <rect x="5" y="6.7" width="8" height="2.6" rx="0.6" stroke="currentColor" strokeWidth="1.4" />
      <rect x="3" y="11.15" width="6" height="2.6" rx="0.6" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

function IconArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── Tipi ───────────────────────────────────────────────── */

interface ModuleItem {
  label:    string
  icon:     React.ReactNode
  active:   boolean
  href?:    string
  to?:      string
}

interface PhaseEntry {
  id:       string
  label:    string
  to?:      string
  disabled?: boolean
  modules:  ModuleItem[]
}

/* ── Dati fasi ──────────────────────────────────────────── */

const PHASES: PhaseEntry[] = [
  {
    id:    'programmazione',
    label: 'Programmazione',
    to:    '/',
    modules: [
      { label: 'Dataroom',       icon: <IconBarChart />, active: true,  href: DATA_ROOM_URL },
      { label: 'Pianificazione', icon: <IconCalendar />, active: false },
    ],
  },
  {
    id:    'progettazione',
    label: 'Progettazione',
    to:    '/impatti',
    modules: [
      { label: 'Analisi Alternativa', icon: <IconDocument />,  active: true, to: '/impatti/docfap' },
      { label: 'Analisi Ricadute',    icon: <IconValutazione size={16} />, active: true, to: '/valutazioni' },
      { label: 'Project Manager',     icon: <IconGantt />, active: true, href: PROJECT_MANAGER_URL },
    ],
  },
  {
    id:       'esecuzione',
    label:    'Esecuzione',
    disabled: true,
    modules: [
      { label: 'Scouting Bandi',  icon: <IconSearch />,  active: false },
      { label: 'Candidatura',     icon: <IconEdit />,    active: false },
      { label: 'Rendicontazione', icon: <IconChecked />, active: true, href: RISORSE_URL },
    ],
  },
]

/* ── Focus ring (WCAG 2.4.7) ────────────────────────────── */

const FOCUS_RING = [
  'focus-visible:outline-none',
  'focus-visible:shadow-[0_0_0_3px_var(--color-border-focus)]',
].join(' ')

/* ── TopNav ─────────────────────────────────────────────── */

export function TopNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const inProduct = pathname.startsWith('/impatti') || pathname.startsWith('/valutazioni')
  const showPhaseNav = inProduct
  const [hoveredPhase, setHoveredPhase] = useState<string | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const ente = (user as { ente?: string })?.ente ?? 'Comune di Colleferro'
  const nome = user?.name ?? 'Marco Bianchi'
  const iniziali = user?.initials ?? 'MB'

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 80,
        zIndex: 100,
        backgroundColor: 'var(--color-background-inverse)',
        borderBottom: '1px solid var(--color-border-secondary-light)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-inline-s)',
        padding: '0 var(--spacing-l)',
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        aria-label="Civiqa — torna alla homepage"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          flexShrink: 0,
          color: 'var(--color-text-primary)',
          textDecoration: 'none',
          fontFamily: 'var(--font-family-1)',
          fontSize: 36,
          fontWeight: 'var(--type-weight-bold, 700)',
          letterSpacing: '-0.025em',
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}
        className={FOCUS_RING}
      >
        <img
          src={civiqaLogo}
          alt="Civiqa"
          className="civiqa-wordmark civiqa-wordmark--light"
          style={{ height: 30, width: 'auto' }}
        />
        <img
          src={civiqaLogoWhite}
          alt="Civiqa"
          aria-hidden="true"
          className="civiqa-wordmark civiqa-wordmark--dark"
          style={{ height: 30, width: 'auto' }}
        />
      </Link>

      {/* Nav fasi — centrato, solo su /impatti/* */}
      {showPhaseNav ? (
        <nav
          aria-label="Fasi del progetto"
          style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
          onKeyDown={(e) => { if (e.key === 'Escape') setHoveredPhase(null) }}
        >
          <ul
            style={{
              display: 'flex',
              listStyle: 'none',
              margin: 0,
              padding: 0,
              gap: 32,
            }}
          >
            {PHASES.map(phase => {
              const isActive = phase.id === 'progettazione' && inProduct

              return (
                <li
                  key={phase.id}
                  style={{ position: 'relative', display: 'flex', alignItems: 'center', height: 80 }}
                  onMouseEnter={() => setHoveredPhase(phase.id)}
                  onMouseLeave={() => setHoveredPhase(null)}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      setHoveredPhase(null)
                    }
                  }}
                >
                  {/* Etichetta fase — li mantiene h=80, link ha h=auto + pb per avvicinare la sottolineatura */}
                  {phase.disabled ? (
                    <span
                      aria-disabled="true"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        fontFamily: 'var(--font-family-1)',
                        fontSize: 'var(--type-body-s-size, 14px)',
                        fontWeight: 500,
                        color: 'var(--color-text-primary-lighter)',
                        cursor: 'default',
                        paddingBottom: 6,
                        borderBottom: '2px solid transparent',
                        userSelect: 'none',
                      }}
                    >
                      {phase.label}
                    </span>
                  ) : phase.to ? (
                    <Link
                      to={phase.to}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        fontFamily: 'var(--font-family-1)',
                        fontSize: 'var(--type-body-s-size, 14px)',
                        fontWeight: isActive ? 700 : 500,
                        color: isActive
                          ? 'var(--color-text-primary)'
                          : 'var(--color-text-primary-lighter)',
                        textDecoration: 'none',
                        paddingBottom: 6,
                        borderBottom: isActive
                          ? '1px solid var(--color-border-primary-light)'
                          : '1px solid transparent',
                        transition: 'color 120ms ease, border-color 120ms ease',
                      }}
                      className={FOCUS_RING}
                      aria-haspopup="menu"
                      aria-expanded={hoveredPhase === phase.id}
                      onFocus={() => setHoveredPhase(phase.id)}
                    >
                      {phase.label}
                    </Link>
                  ) : null}

                  {/* Dropdown moduli */}
                  {hoveredPhase === phase.id && (
                    <ul
                      role="menu"
                      aria-label={`Moduli ${phase.label}`}
                      style={{
                        position: 'absolute',
                        top: 'calc(100% - 4px)',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        listStyle: 'none',
                        margin: 0,
                        padding: '2px 6px 6px 6px',
                        minWidth: 210,
                        backgroundColor: 'var(--color-background-inverse)',
                        border: '1px solid var(--color-border-secondary-light)',
                        borderRadius: 'var(--radius-smooth)',
                        boxShadow: '0 4px 16px oklch(0% 0 0 / 0.12)',
                        zIndex: 200,
                      }}
                    >
                      {phase.modules.map(mod => (
                        <li key={mod.label} role="none">
                          {!mod.active ? (
                            <div
                              aria-disabled="true"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 8,
                                padding: '8px 10px',
                                borderRadius: 'var(--radius-smooth)',
                                fontSize: 'var(--type-body-xs-size, 13px)',
                                fontWeight: 500,
                                color: 'var(--color-text-primary)',
                                opacity: 0.4,
                                cursor: 'default',
                              }}
                            >
                              <span style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
                                {mod.icon}
                                {mod.label}
                              </span>
                              <span style={{ fontSize: 'var(--type-caption-size, 10px)', fontStyle: 'italic', whiteSpace: 'nowrap' }}>
                                Presto disponibile
                              </span>
                            </div>
                          ) : mod.href ? (
                            <a
                              href={mod.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              role="menuitem"
                              aria-label={`${mod.label} — si apre in una nuova finestra`}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 8,
                                padding: '8px 10px',
                                borderRadius: 'var(--radius-smooth)',
                                fontSize: 'var(--type-body-xs-size, 13px)',
                                fontWeight: 600,
                                color: 'var(--color-text-primary)',
                                textDecoration: 'none',
                              }}
                              className={`hover:bg-[var(--color-background-secondary-lighter)] ${FOCUS_RING}`}
                            >
                              <span style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
                                {mod.icon}
                                {mod.label}
                              </span>
                              <IconArrowRight />
                            </a>
                          ) : (
                            <Link
                              to={mod.to ?? '/'}
                              role="menuitem"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 8,
                                padding: '8px 10px',
                                borderRadius: 'var(--radius-smooth)',
                                fontSize: 'var(--type-body-xs-size, 13px)',
                                fontWeight: 600,
                                color: 'var(--color-text-primary)',
                                textDecoration: 'none',
                              }}
                              className={`hover:bg-[var(--color-background-secondary-lighter)] ${FOCUS_RING}`}
                            >
                              <span style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
                                {mod.icon}
                                {mod.label}
                              </span>
                              <IconArrowRight />
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>
      ) : (
        <div style={{ flex: 1 }} aria-hidden="true" />
      )}

      {/* Right side — stemma + ente + separatore + nome + avatar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexShrink: 0,
        }}
      >
        <ThemeToggle />
        <img
          src={colleferroStemma}
          alt="Stemma del Comune di Colleferro"
          style={{ height: 26, width: 'auto', opacity: 0.85 }}
        />
        <span
          style={{
            fontFamily: 'var(--font-family-1)',
            fontSize: 'var(--type-body-xs-size, 12px)',
            fontWeight: 500,
            color: 'var(--color-text-primary-lighter)',
            whiteSpace: 'nowrap',
          }}
        >
          {ente}
        </span>

        <span
          aria-hidden="true"
          style={{
            color: 'var(--color-border-secondary)',
            fontWeight: 300,
            fontSize: 'var(--type-body-l-size, 18px)',
            lineHeight: 1,
          }}
        >
          |
        </span>

        <span
          style={{
            fontFamily: 'var(--font-family-1)',
            fontSize: 'var(--type-body-s-size, 14px)',
            fontWeight: 500,
            color: 'var(--color-text-primary)',
            whiteSpace: 'nowrap',
          }}
        >
          {nome}
        </span>

        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setUserMenuOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={userMenuOpen}
            aria-label="Menu profilo"
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: 'var(--color-background-primary)',
              color: 'var(--color-text-inverse)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-family-1)',
              fontSize: 'var(--type-body-xs-size, 12px)',
              fontWeight: 'var(--type-weight-bold, 700)',
              flexShrink: 0,
              userSelect: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
            className={`civiqa-avatar ${FOCUS_RING}`}
          >
            {iniziali}
          </button>
          {userMenuOpen && (
            <div
              role="menu"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                minWidth: 220,
                backgroundColor: 'var(--color-background-inverse)',
                border: '1px solid var(--color-border-secondary-light)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                zIndex: 200,
              }}
            >
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border-secondary-light)' }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>{nome}</p>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--color-text-primary-lighter)' }}>
                  {user?.role ?? 'RUP'} · {ente}
                </p>
              </div>
              <button
                type="button"
                role="menuitem"
                onClick={() => { setUserMenuOpen(false); logout(); navigate('/login') }}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 16px',
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--color-text-secondary)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
                className="hover:bg-[var(--color-background-secondary-lighter)]"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
