import { useEffect } from 'react'
import type { ReactNode } from 'react'

interface ConfrontoOverlayProps {
  title: string
  subtitle?: string
  /** Etichetta delle due opzioni a confronto, mostrata come sottotitolo contestuale. */
  optionsLabel?: string
  onClose: () => void
  children: ReactNode
}

/**
 * Overlay a tutto schermo per il CONFRONTO A1 vs A2 di una dimensione.
 * Chrome in Tailwind (skin del modulo /valutazioni); il contenuto sono i Tab
 * di confronto esistenti (TabImpatto/TabCBA/TabMCA/TabSensitivita), che si
 * stilizzano da soli tramite i token `--color-*` definiti su :root.
 *
 * z-[200] per coprire la chrome (TopNav z-100), come il wizard.
 */
export function ConfrontoOverlay({ title, subtitle, optionsLabel, onClose, children }: ConfrontoOverlayProps) {
  // ESC chiude; blocca lo scroll del body mentre l'overlay è aperto.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-label={`Confronto opzioni — ${title}`}
      onClick={onClose}
    >
      <div
        className="mx-auto flex h-full w-full max-w-6xl flex-col bg-bg-page shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-ink-100 bg-white px-6 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-violet">
              Confronto delle opzioni
            </p>
            <h2 className="mt-0.5 text-[20px] font-bold leading-tight text-ink-900">{title}</h2>
            {subtitle && <p className="mt-1 text-[13px] text-ink-500">{subtitle}</p>}
            {optionsLabel && (
              <p className="mt-1 text-[12px] text-ink-400">{optionsLabel}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex shrink-0 items-center gap-2 rounded border border-ink-100 px-4 py-2 text-[13px] font-semibold text-ink-700 transition-colors hover:border-brand-violet hover:text-brand-violet"
          >
            Chiudi
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body: i Tab di confronto, in scope token (:root) */}
        <div className="poc-scope flex-1 overflow-y-auto bg-bg-page px-6 py-6">
          {children}
        </div>
      </div>
    </div>
  )
}
