import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { TopNav } from './TopNav'
import { SideNav } from './SideNav'

/* AppShell — root layout shell for all Civiqa product areas.
   Sidebar is shown for /impatti/* routes (DOCFAP, Valutazione, Composing…).
   Accent line (4px lime) is a brand-identity element — always visible, never remove.
   Skip link must be the first element in the DOM (WCAG 2.4.1). */

export function AppShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { pathname } = useLocation()

  // Sidebar temporaneamente disabilitata: rimettere la condizione qui sotto per riattivarla.
  // const showSidebar = pathname.startsWith('/impatti') || pathname.startsWith('/valutazioni')
  const showSidebar = false
  const sidebarWidth = sidebarCollapsed ? 100 : 250

  return (
    <>
      {/* ── Skip link — MUST be the very first element in the DOM (WCAG 2.4.1) ── */}
      <a href="#main-content" className="skip-link">
        Vai al contenuto principale
      </a>

      {/* ── Top navigation bar (fixed, 80px) ── */}
      <TopNav />

      {/* ── Accent line — 4px lime, brand identity, do not remove ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 80,
          left: 0,
          right: 0,
          height: 4,
          backgroundColor: 'var(--color-background-accent)',
          zIndex: 99,
        }}
      />

      {/* ── Sidebar (hidden on mobile via .sidenav-wrapper media query in global.css) ── */}
      {showSidebar && (
        <div className="sidenav-wrapper">
          <SideNav
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed((c) => !c)}
          />
        </div>
      )}

      {/* ── Main content area ── */}
      <main
        id="main-content"
        tabIndex={-1}
        /* tabIndex={-1} lets the skip link focus this element programmatically */
        style={{
          paddingTop: 84,    // 80px top nav + 4px accent line
          marginLeft: showSidebar ? sidebarWidth : 0,
          minHeight: '100vh',
          backgroundColor: 'var(--color-background-secondary-light)',
          transition: 'margin-left 0.2s ease',
          outline: 'none',   // focus is managed programmatically, no visual ring needed here
        }}
      >
        <Outlet />
      </main>
    </>
  )
}
