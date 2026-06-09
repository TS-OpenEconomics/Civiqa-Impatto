import type { ReactElement } from 'react'
import { NavLink } from 'react-router-dom'

/* ─── Shared focus-ring (WCAG 2.4.7) ─────────────────────────────────────── */
const FOCUS_RING = [
  'focus-visible:outline-none',
  'focus-visible:shadow-[0_0_0_3px_var(--color-border-focus)]',
].join(' ')

/* ─── Icon components — compact sizing for Impatti sidebar ─────────────── */

function IconDashboard({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="8" height="8" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="3" width="8" height="8" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="13" width="8" height="8" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="13" width="8" height="8" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function IconValutazione({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 17l5-5 3 3 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 7h3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconComposing({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="7" height="16" stroke="currentColor" strokeWidth="1.5" />
      <rect x="14" y="4" width="7" height="16" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 9h4M10 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IconDocfap({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 4a1 1 0 011-1h7l6 6v11a1 1 0 01-1 1H6a1 1 0 01-1-1V4z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M13 3v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 12h8M8 15h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IconCollapse({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ transition: 'transform 0.2s ease', transform: collapsed ? 'rotate(180deg)' : 'none' }}
    >
      <rect x="3" y="3" width="18" height="18" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 3v18" stroke="currentColor" strokeWidth="1.5" />
      <path d="M15 10l-3 2 3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ─── Nav item definition ────────────────────────────────────────────────── */

interface NavItem {
  to: string
  label: string
  icon: (props: { size: number }) => ReactElement
  section?: string  // section label shown ABOVE this item in expanded mode
  disabled?: boolean
}

const NAV_ITEMS: NavItem[] = [
  /* Dashboard visibile ma non ancora cliccabile (come Composing) */
  { to: '/impatti/dashboard',      label: 'Dashboard',     icon: IconDashboard, disabled: true },
  { to: '/impatti/docfap',         label: 'Docfap',        icon: IconDocfap },
  { to: '/valutazioni',            label: 'Valutazione',   icon: IconValutazione },
  { to: '/impatti/composing',      label: 'Composing',     icon: IconComposing, disabled: true },
]

/* ─── Active state inline styles ─────────────────────────────────────────── */
const activeStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-background-primary-lighter)',
  borderLeftColor: 'var(--color-background-primary)',
  color: 'var(--color-text-secondary)',
}
const defaultStyle: React.CSSProperties = {
  backgroundColor: 'transparent',
  borderLeftColor: 'transparent',
  color: 'var(--color-text-primary)',
}

const disabledStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-background-secondary-lighter)',
  borderLeftColor: 'transparent',
  color: 'var(--color-text-disable)',
  opacity: 0.68,
  cursor: 'default',
}

/* ─── SideNav ────────────────────────────────────────────────────────────
   Desktop side navigation — expanded (250px) or collapsed (100px).
   Spec: ds-layout-app-shell.md + ds-components-navigation.md.
   ───────────────────────────────────────────────────────────────────────── */

interface SideNavProps {
  collapsed: boolean
  onToggle: () => void
}

export function SideNav({ collapsed, onToggle }: SideNavProps) {
  const iconSize = collapsed ? 28 : 24

  return (
    <nav
      aria-label="Navigazione principale"
      style={{
        position: 'fixed',
        top: 84,          // 80px top nav + 4px accent line
        left: 0,
        width: collapsed ? 100 : 250,
        height: 'calc(100vh - 84px)',
        backgroundColor: 'var(--color-background-inverse)',
        borderRight: '2px solid var(--color-border-secondary-light)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 40,
        overflowX: 'hidden',
        overflowY: 'auto',
        transition: 'width 0.2s ease',
      }}
    >
      {/* ── Menu voices ───────────────────────────────────────────────── */}
      <ul role="list" style={{ flex: 1, listStyle: 'none', padding: 0 }}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <li key={item.to}>
              {/* Section divider + label (expanded only) */}
              {item.section && (
                <>
                  <div
                    aria-hidden="true"
                    style={{ borderTop: '2px solid var(--color-border-secondary-light)' }}
                  />
                  {!collapsed && (
                    <p
                      aria-hidden="true"
                      style={{
                        padding: '16px 16px 0',
                        fontFamily: 'var(--font-family-1)',
                        fontSize: 'var(--type-body-xs-size, 14px)',
                        fontWeight: 'var(--type-weight-regular, 400)',
                        color: 'var(--color-text-primary-lighter)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {item.section}
                    </p>
                  )}
                </>
              )}

              {/* Nav link — NavLink provides aria-current="page" on active */}
              {item.disabled ? (
                <div
                  aria-disabled="true"
                  title={collapsed ? item.label : undefined}
                  style={{
                    display: 'flex',
                    flexDirection: collapsed ? 'column' : 'row',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    height: collapsed ? 64 : 56,
                    padding: collapsed ? '0 4px' : '0 var(--spacing-inset-s)',
                    gap: collapsed ? 0 : 4,
                    width: '100%',
                    borderLeft: '4px solid transparent',
                    fontFamily: 'var(--font-family-1)',
                    fontSize: 'var(--type-body-s-size, 16px)',
                    fontWeight: 'var(--type-weight-regular, 400)',
                    ...disabledStyle,
                  }}
                >
                  <Icon size={iconSize} />
                  {!collapsed && (
                    <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>
                  )}
                </div>
              ) : (
                <NavLink
                  to={item.to}
                  title={collapsed ? item.label : undefined}
                  style={({ isActive }) => ({
                    display: 'flex',
                    flexDirection: collapsed ? 'column' : 'row',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    height: collapsed ? 64 : 56,
                    padding: collapsed ? '0 4px' : '0 var(--spacing-inset-s)',
                    gap: collapsed ? 0 : 4,
                    width: '100%',
                    textDecoration: 'none',
                    borderLeft: '4px solid transparent',
                    transition: 'background-color 0.15s ease',
                    fontFamily: 'var(--font-family-1)',
                    fontSize: 'var(--type-body-s-size, 16px)',
                    fontWeight: isActive
                      ? 'var(--type-weight-medium, 500)'
                      : 'var(--type-weight-regular, 400)',
                    ...(isActive ? activeStyle : defaultStyle),
                  })}
                  className={`hover:bg-[var(--color-background-secondary-lighter)] ${FOCUS_RING}`}
                >
                  <Icon size={iconSize} />
                  {!collapsed && (
                    <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>
                  )}
                </NavLink>
              )}
            </li>
          )
        })}
      </ul>

      {/* ── Resize / collapse button ───────────────────────────────────── */}
      <button
        type="button"
        onClick={onToggle}
        aria-label={collapsed ? 'Espandi menu laterale' : 'Comprimi menu laterale'}
        aria-expanded={!collapsed}
        style={{
          height: 80,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-end',
          padding: collapsed ? 0 : '0 var(--spacing-inset-s)',
          border: 'none',
          borderTop: '2px solid var(--color-border-secondary-light)',
          backgroundColor: 'var(--color-background-inverse)',
          color: 'var(--color-icon-primary-lighter)',
          cursor: 'pointer',
          flexShrink: 0,
        }}
        className={`hover:bg-[var(--color-background-secondary-lighter)] hover:text-[var(--color-icon-primary)] ${FOCUS_RING}`}
      >
        <IconCollapse collapsed={collapsed} />
      </button>
    </nav>
  )
}
