import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { runFullAnalysis } from '../../../engine/scoreComposito'
import { useWizard } from '../../../hooks/useWizard'

/* ── Confetti data — purely decorative (aria-hidden) ────────────────────── */
interface ConfettoConfig {
  top?: string
  bottom?: string
  left?: string
  right?: string
  width: string
  height: string
  bg: string
  rotate: number
  delay: string
}

const CONFETTI: ConfettoConfig[] = [
  { top: '-28px', left: '12px',  width: '8px',  height: '12px', bg: '#f4b8c8', rotate: 20,   delay: '0s'    },
  { top: '-32px', left: '46px',  width: '6px',  height: '8px',  bg: '#a8ddb8', rotate: -15,  delay: '0.3s'  },
  { top: '-18px', right: '-8px', width: '10px', height: '6px',  bg: '#c8a8f0', rotate: 45,   delay: '0.1s'  },
  { top: '8px',   right: '-28px',width: '8px',  height: '8px',  bg: '#f4d090', rotate: -30,  delay: '0.4s'  },
  { bottom: '-10px', right: '-20px', width: '6px', height: '10px', bg: '#a8ddb8', rotate: 60, delay: '0.2s' },
  { bottom: '-20px', left: '30px',   width: '8px', height: '6px',  bg: '#f4b8c8', rotate: -45,delay: '0.5s' },
  { bottom: '-8px',  left: '-12px',  width: '10px',height: '8px',  bg: '#f4d090', rotate: 15, delay: '0.15s'},
  { top: '14px',  left: '-24px',  width: '6px',  height: '12px', bg: '#c8a8f0', rotate: -60, delay: '0.35s' },
]

/* ── Icons ─────────────────────────────────────────────────────────────── */
function CheckIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 14l6 6 10-12"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ── Component ──────────────────────────────────────────────────────────── */
export function Step7_Completamento() {
  const { state, setScore } = useWizard()
  const [isLoading, setIsLoading] = useState(true)
  const titleRef = useRef<HTMLHeadingElement>(null)

  // Run analysis if not already done, then flip loading flag
  useEffect(() => {
    if (state.scoreFinale && state.scoreFinale.length > 0) {
      setIsLoading(false)
      return
    }

    let isActive = true
    const timeoutId = window.setTimeout(() => {
      const result = runFullAnalysis()
      if (!isActive) return
      setScore(result)
      setIsLoading(false)
    }, 0)

    return () => {
      isActive = false
      window.clearTimeout(timeoutId)
    }
  }, [state.scoreFinale, setScore])

  // Auto-focus title once loading is done (WCAG 2.4.3)
  useEffect(() => {
    if (!isLoading) {
      titleRef.current?.focus()
    }
  }, [isLoading])

  /* ── Spinner ── */
  if (isLoading) {
    return (
      <div style={spinnerPageStyle}>
        <style>{SPINNER_CSS}</style>
        <div
          role="status"
          aria-busy="true"
          style={spinnerWrapStyle}
        >
          <span className="compl-spinner" aria-hidden="true" />
          <span style={spinnerTextStyle}>Elaborazione in corso...</span>
        </div>
      </div>
    )
  }

  /* ── Completion screen ── */
  return (
    <div style={pageStyle}>
      <style>{CONFETTI_CSS}</style>

      <div style={contentStyle} aria-live="polite">

        {/* Graphic: two circles + connecting line + confetti */}
        <div style={graphicWrapStyle} aria-hidden="true">
          {/* Left grey circle */}
          <div style={circleLeftStyle} />

          {/* Horizontal line */}
          <div style={lineStyle} />

          {/* Right purple circle with check + confetti around it */}
          <div style={circleRightWrapStyle}>
            {/* Confetti */}
            {CONFETTI.map((c, i) => (
              <span
                key={i}
                className="confetto"
                style={{
                  position: 'absolute',
                  top: c.top,
                  bottom: c.bottom,
                  left: c.left,
                  right: c.right,
                  width: c.width,
                  height: c.height,
                  background: c.bg,
                  borderRadius: '2px',
                  transform: `rotate(${c.rotate}deg)`,
                  animationDelay: c.delay,
                }}
              />
            ))}
            {/* The circle itself */}
            <div style={circleRightStyle}>
              <CheckIcon />
            </div>
          </div>
        </div>

        {/* Title — receives focus for screen readers */}
        <h2
          ref={titleRef}
          style={titleStyle}
          tabIndex={-1}
        >
          Abbiamo finito! Il DOCFAP è stato completato
        </h2>

        {/* Primary link */}
        <Link
          to="/impatti/docfap/detail"
          style={linkPrimaryStyle}
        >
          Vai ai risultati del DOCFAP →
        </Link>

        {/* Separator */}
        <p style={separatorStyle}>Oppure</p>

        {/* Secondary link */}
        <Link
          to="/impatti/docfap"
          style={linkSecondaryStyle}
        >
          Torna alla lista DOCFAP →
        </Link>
      </div>
    </div>
  )
}

/* ── CSS animations ─────────────────────────────────────────────────────── */
const SPINNER_CSS = `
  .compl-spinner {
    display: block;
    width: 40px;
    height: 40px;
    border: 3px solid var(--color-border-secondary-light);
    border-top-color: var(--color-background-primary);
    border-radius: 50%;
    animation: compl-spin 0.8s linear infinite;
  }
  @keyframes compl-spin {
    to { transform: rotate(360deg); }
  }
`

const CONFETTI_CSS = `
  .confetto {
    animation: confetto-drift 2.4s ease-in-out infinite alternate;
  }
  @keyframes confetto-drift {
    0%   { transform: translateY(0) rotate(var(--r, 0deg));   opacity: 0.9; }
    100% { transform: translateY(6px) rotate(calc(var(--r, 0deg) + 20deg)); opacity: 0.5; }
  }
`

/* ── Stili ── */

const pageStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100%',
  background: 'var(--color-background-secondary-light)',
  padding: 'var(--spacing-inset-l)',
}

const spinnerPageStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100%',
  background: 'var(--color-background-secondary-light)',
}

const spinnerWrapStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 'var(--spacing-stack-m)',
}

const spinnerTextStyle: CSSProperties = {
  color: 'var(--color-text-primary-light)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-s-size, 16px)',
}

const contentStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0',
}

const graphicWrapStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '32px',
}

const circleLeftStyle: CSSProperties = {
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  background: 'var(--color-background-secondary-lighter)',
  flexShrink: 0,
}

const lineStyle: CSSProperties = {
  width: '80px',
  height: '4px',
  background: 'var(--color-background-primary)',
  flexShrink: 0,
}

/* Wrapper to position confetti relative to the right circle */
const circleRightWrapStyle: CSSProperties = {
  position: 'relative',
  flexShrink: 0,
}

const circleRightStyle: CSSProperties = {
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  background: 'var(--color-background-primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const titleStyle: CSSProperties = {
  margin: '0 0 24px',
  fontWeight: 700,
  textAlign: 'center',
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-heading-m-size, 28px)',
  lineHeight: 'var(--type-heading-m-lh, 1.2)',
  outline: 'none',
}

const linkBaseStyle: CSSProperties = {
  color: 'var(--color-text-link)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  textDecoration: 'underline',
  cursor: 'pointer',
}

const linkPrimaryStyle: CSSProperties = {
  ...linkBaseStyle,
  fontWeight: 700,
  fontSize: 'var(--type-body-s-size, 16px)',
}

const separatorStyle: CSSProperties = {
  margin: '24px 0',
  color: 'var(--color-text-primary-light)',
  fontFamily: 'var(--font-family-1, "Atkinson Hyperlegible Next", sans-serif)',
  fontSize: 'var(--type-body-s-size, 16px)',
  textAlign: 'center',
}

const linkSecondaryStyle: CSSProperties = {
  ...linkBaseStyle,
  fontWeight: 400,
  fontSize: 'var(--type-body-s-size, 16px)',
}
