import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import colleferroStemma from '../assets/Logo_Comune_Colleferro.png.png'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme, toggleTheme } from '../../hooks/useTheme'
import '../styles/home-launcher.css'

const SCENARI_URL   = 'https://www.openeconomics.eu/insights-wall'
const DATA_ROOM_URL = 'https://dataroom-ten-jet.vercel.app/'
const RISORSE_URL   = 'https://demo.openrep.eu/projects'
const DOCFAP_PATH = '/impatti/docfap'
const VALUTAZIONE_PATH = '/valutazioni'

const HOME_LOCK_CLASS = 'hl-home-locked'

/* ── Icone SVG moduli (16×16, stroke 1.4, currentColor) ── */

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

function IconLineChart() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 17l5-5 3 3 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 7h3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

function IconArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconArrowExternal() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M2.5 10.5L10.5 2.5M10.5 2.5H5.5M10.5 2.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── Componente modulo attivo (link interno) ─────────────── */
function ModuleLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link to={to} className="hl-module hl-module--active">
      <span className="hl-module-name">{icon}{label}</span>
      <IconArrowRight />
    </Link>
  )
}

/* ── Componente modulo esterno ───────────────────────────── */
function ModuleExternalLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hl-module hl-module--active"
      aria-label={`${label} — si apre in una nuova finestra`}
    >
      <span className="hl-module-name">{icon}{label}</span>
      <IconArrowRight />
    </a>
  )
}

/* ── Componente modulo coming soon ───────────────────────── */
function ModuleSoon({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="hl-module hl-module--soon" aria-disabled="true">
      <span className="hl-module-name">{icon}{label}</span>
      <span className="hl-module-soon-label">Presto disponibile</span>
    </div>
  )
}

/* ── Home launcher ───────────────────────────────────────── */

export function HomeLauncher() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const theme = useTheme()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const ente = (user as { ente?: string })?.ente ?? 'Comune di Colleferro'
  const nome = user?.name ?? 'Marco Bianchi'
  const iniziali = user?.initials ?? 'MB'
  const ruolo = (user as { role?: string })?.role ?? 'RUP'

  useEffect(() => {
    document.documentElement.classList.add(HOME_LOCK_CLASS)
    document.body.classList.add(HOME_LOCK_CLASS)
    return () => {
      document.documentElement.classList.remove(HOME_LOCK_CLASS)
      document.body.classList.remove(HOME_LOCK_CLASS)
    }
  }, [])

  return (
    <>
      <a href="#hl-main" className="skip-link">
        Vai al contenuto principale
      </a>

      <div className="hl-root">

        {/* ── Header ── */}
        <header className="hl-header">
          <Link to="/" className="hl-logo" aria-label="Civiqa — torna alla homepage">
            <span aria-hidden="true" style={{ lineHeight: 1 }}>■</span>
            <span>Civiqa</span>
          </Link>
          <div className="hl-header-right">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Passa al tema chiaro' : 'Passa al tema scuro'}
              title={theme === 'dark' ? 'Tema chiaro' : 'Tema scuro'}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 34, height: 34, border: 'none', background: 'none',
                color: 'var(--color-text-primary-lighter)', cursor: 'pointer',
              }}
            >
              {theme === 'dark' ? (
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
            <img
              src={colleferroStemma}
              alt="Stemma del Comune di Colleferro"
              className="hl-stemma"
            />
            <span className="hl-ente">{ente}</span>
            <span className="hl-separator" aria-hidden="true">|</span>
            <span className="hl-username">{nome}</span>
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="hl-avatar"
                onClick={() => setUserMenuOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
                aria-label="Menu profilo"
              >
                {iniziali}
              </button>
              {userMenuOpen && (
                <>
                  <div
                    aria-hidden="true"
                    onClick={() => setUserMenuOpen(false)}
                    style={{ position: 'fixed', inset: 0, zIndex: 90 }}
                  />
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
                      zIndex: 100,
                    }}
                  >
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border-secondary-light)' }}>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>{nome}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--color-text-primary-lighter)' }}>
                        {ruolo} · {ente}
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
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
        <div className="hl-accent" aria-hidden="true" />

        {/* ── Main ── */}
        <main id="hl-main" tabIndex={-1} className="hl-main">

          {/* ── Grid 3 fasi ── */}
          <div className="hl-grid">

            {/* FASE 01 — Programmazione (tile non cliccabile) */}
            <div
              className="hl-tile hl-tile--prog"
              style={{ '--i': 1 } as React.CSSProperties}
            >
              <span className="hl-tile-num" aria-hidden="true">01</span>
              <div className="hl-tile-top">
                <div className="hl-tile-phase">Fase 01</div>
                <h2 className="hl-tile-title">Programmazione</h2>
                <p className="hl-tile-desc">
                  Individua i fabbisogni, valuta i gap territoriali e costruisce
                  la lista delle opere prioritarie.
                </p>
              </div>
              <div className="hl-tile-modules">
                <ModuleExternalLink
                  href={DATA_ROOM_URL}
                  icon={<IconBarChart />}
                  label="Dataroom"
                />
                <ModuleSoon icon={<IconCalendar />} label="Pianificazione" />
              </div>
            </div>

            {/* FASE 02 — Progettazione (tile cliccabile → /impatti) */}
            <div
              className="hl-tile hl-tile--prog2"
              style={{ '--i': 2 } as React.CSSProperties}
            >
              <span className="hl-tile-num" aria-hidden="true">02</span>
              <Link
                to="/impatti"
                className="hl-tile-link"
                aria-label="Vai alla sezione Progettazione"
              />
              <div className="hl-tile-top">
                <div className="hl-tile-phase">Fase 02</div>
                <h2 className="hl-tile-title">Progettazione</h2>
                <p className="hl-tile-desc">
                  Guida il RUP nel DOCFAP (D.Lgs. 36/2023) e nell&apos;PFTE
                  attraverso l&apos;elaborazione di analisi Costi Benefici e
                  d&apos;impatto.
                </p>
              </div>
              <div className="hl-tile-modules">
                <ModuleLink to={DOCFAP_PATH} icon={<IconDocument />} label="Docfap" />
                <ModuleLink to={VALUTAZIONE_PATH} icon={<IconLineChart />} label="Valutazione" />
                <ModuleSoon icon={<IconEdit />} label="Composing" />
              </div>
            </div>

            {/* FASE 03 — Esecuzione (tile non cliccabile) */}
            <div
              className="hl-tile hl-tile--exec"
              style={{ '--i': 3 } as React.CSSProperties}
            >
              <span className="hl-tile-num" aria-hidden="true">03</span>
              <div className="hl-tile-top">
                <div className="hl-tile-phase">Fase 03</div>
                <h2 className="hl-tile-title">Esecuzione</h2>
                <p className="hl-tile-desc">
                  Supporta il reperimento dei fondi, la gestione dell'appalto e
                  la rendicontazione fisica e finanziaria dei bandi pubblici.
                </p>
              </div>
              <div className="hl-tile-modules">
                <ModuleSoon icon={<IconSearch />}  label="Scouting Bandi" />
                <ModuleSoon icon={<IconEdit />}    label="Candidatura" />
                <ModuleExternalLink
                  href={RISORSE_URL}
                  icon={<IconChecked />}
                  label="Rendicontazione"
                />
              </div>
            </div>

          </div>

          {/* ── Scenari strip ── */}
          <a
            href={SCENARI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hl-scenari"
            style={{ '--i': 4 } as React.CSSProperties}
            aria-label="Scenari — Editoriale Civiqa, si apre in una nuova finestra"
          >
            <div className="hl-scenari-left">
              <span className="hl-scenari-eyebrow">Editoriale</span>
              <span className="hl-scenari-name">Scenari</span>
              <span className="hl-scenari-desc">
                Analisi, ricerche e approfondimenti sul governo del territorio e delle politiche pubbliche
              </span>
            </div>
            <span className="hl-scenari-arrow">
              <IconArrowExternal />
            </span>
          </a>

        </main>
      </div>
    </>
  )
}
