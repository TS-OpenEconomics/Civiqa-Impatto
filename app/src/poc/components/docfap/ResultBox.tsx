import { useState, type ReactNode } from 'react'
import type { AlternativaId } from '../../types/docfap'
import { RANK_COLORS } from './rankColors'

export interface ResultBoxOption {
  id: AlternativaId
  label: string
  isRecommended: boolean
  isSecondBest?: boolean
  /** Colore del badge "A1/A2…" per piazzamento (1ª verde, 2ª arancione, resto grigio). */
  badgeBg?: string
  badgeText?: string
  details?: Array<{ label: string; value: string }>
}

const GREEN = RANK_COLORS.green

export interface ResultBoxMetric {
  label: string
  /** Un valore formattato per ogni opzione (stesso ordine di `options`). */
  values: string[]
  /** Evidenzia la riga (es. il punteggio della dimensione). */
  emphasize?: boolean
  /** Valori 0–100 per opzione: se presenti, la cella mostra una barra sopra al valore. */
  barValues?: number[]
  /** Spiegazione dell'indicatore, mostrata come tooltip (icona ⓘ accanto all'etichetta). */
  hint?: string
}

interface ResultBoxProps {
  /** Logo immagine (es. icons/analysis-eia.png). Ha precedenza su `icon`. */
  iconSrc?: string
  /** Icona inline (fallback se non c'è un logo immagine), resa in un quadrato viola. */
  icon?: ReactNode
  title?: string
  tag?: string
  tagClassName?: string
  description?: string
  options: ResultBoxOption[]
  metrics: ResultBoxMetric[]
  /** Nasconde la testata (icona/titolo/tag/descrizione): mostra solo la tabella.
   *  Utile quando il titolo è fornito dal contenitore (es. accordion del wizard). */
  hideHeader?: boolean
  /** Etichetta del gruppo di azioni "analisi completa". Le azioni sono mostrate
   *  solo se è presente `onOpenSingle` o `onCompare`. */
  singleActionLabel?: string
  onOpenSingle?: (optionId: AlternativaId) => void
  onCompare?: () => void
  /** Nota opzionale sotto le azioni. */
  footnote?: string
}

const OPTION_COL = 'min-w-[240px]'

/**
 * Box di sintesi di una dimensione di analisi del DOCFAP, a tutta larghezza,
 * con N colonne-opzione (2–5). Layout Tailwind, skin del modulo /valutazioni.
 */
export function ResultBox({
  iconSrc,
  icon,
  title,
  tag,
  tagClassName = 'bg-ink-100 text-ink-700',
  description,
  options,
  metrics,
  hideHeader = false,
  singleActionLabel,
  onOpenSingle,
  onCompare,
  footnote,
}: ResultBoxProps) {
  const [openOptionId, setOpenOptionId] = useState<AlternativaId | null>(null)
  const showActions = Boolean(onOpenSingle || onCompare)

  return (
    <div className={hideHeader ? 'overflow-hidden bg-transparent' : 'overflow-hidden rounded-lg border border-ink-100 bg-white shadow-sm'}>
      {/* Header */}
      {!hideHeader && (
        <div className="flex items-center gap-4 border-b border-ink-100 px-6 py-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-violet/10 text-brand-violet">
            {iconSrc ? (
              <img src={iconSrc} alt="" aria-hidden="true" className="h-8 w-8 object-contain" />
            ) : (
              icon
            )}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[17px] font-bold leading-tight text-ink-900">{title}</span>
              <span className={`inline-flex items-center px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wide ${tagClassName}`}>
                {tag}
              </span>
            </div>
            <p className="mt-0.5 text-[12px] leading-relaxed text-ink-500">{description}</p>
          </div>
        </div>
      )}

      {/* Confronto su N opzioni */}
      <div className="overflow-x-auto px-6 py-4">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-[200px] min-w-[160px] pb-3 pr-5 text-left align-bottom text-[10px] font-semibold uppercase tracking-wide text-ink-400">
                Indicatore
              </th>
              {options.map((opt) => (
                <th key={opt.id} className={`${OPTION_COL} border-l border-ink-100 px-5 pb-3 align-bottom`}>
                  <div className="flex items-center gap-2.5 text-left">
                    <span
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center font-mono text-[13px] font-extrabold leading-none"
                      style={{
                        background: opt.badgeBg ?? (opt.isRecommended ? GREEN.solid : '#e5e5e8'),
                        color: opt.badgeText ?? (opt.isRecommended ? GREEN.text : '#5b5b62'),
                      }}
                    >
                      {opt.id}
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
                      {opt.isRecommended && (
                        <span
                          className="inline-flex items-center px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white"
                          style={{ background: GREEN.solid }}
                        >
                          Raccomandata
                        </span>
                      )}
                      {!opt.isRecommended && opt.isSecondBest && (
                        <span
                          className="inline-flex items-center px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white"
                          style={{ background: RANK_COLORS.orange.solid }}
                        >
                          2a migliore
                        </span>
                      )}
                      <div className="relative w-full">
                        <button
                          type="button"
                          onClick={() => setOpenOptionId(openOptionId === opt.id ? null : opt.id)}
                          className="block w-full whitespace-normal break-words text-left text-[12px] font-bold leading-snug text-ink-900 transition-colors hover:text-brand-violet focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet/30"
                          title={opt.label}
                        >
                          {opt.label}
                        </button>
                        {openOptionId === opt.id && (
                          <div className="absolute left-0 top-full z-20 mt-2 w-64 rounded border border-ink-100 bg-white p-3 text-left shadow-lg">
                            <p className="font-mono text-[10px] font-bold text-brand-violet">{opt.id}</p>
                            <p className="mt-1 text-[12px] font-bold leading-snug text-ink-900">{opt.label}</p>
                            {opt.details && opt.details.length > 0 && (
                              <dl className="mt-2 space-y-1 border-t border-ink-100 pt-2 text-[11px]">
                                {opt.details.map((detail) => (
                                  <div key={detail.label} className="flex justify-between gap-3">
                                    <dt className="text-ink-400">{detail.label}</dt>
                                    <dd className="font-mono font-semibold text-ink-700">{detail.value}</dd>
                                  </div>
                                ))}
                              </dl>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                        </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => (
              <tr key={metric.label} className="border-t border-ink-100">
                <td className={`py-3 pr-5 text-[12px] ${metric.emphasize ? 'font-bold text-ink-900' : 'text-ink-600'}`}>
                  {metric.label}
                  {metric.hint && (
                    <span
                      className="ml-1 cursor-help align-baseline text-[10px] text-ink-400"
                      title={metric.hint}
                      role="img"
                      aria-label={metric.hint}
                    >
                      i
                    </span>
                  )}
                </td>
                {options.map((opt, i) => {
                  const bar = metric.barValues?.[i]
                  return (
                    <td
                      key={opt.id}
                      className={`${OPTION_COL} border-l border-ink-100 px-5 py-3 align-middle`}
                      style={opt.isRecommended ? { background: GREEN.tint } : undefined}
                    >
                      {bar != null ? (
                        <div className="flex flex-col items-end gap-1">
                          <span
                            className="font-mono text-[14px] font-bold"
                            style={{ color: opt.isRecommended ? GREEN.solid : 'var(--color-text-primary, #2b2b2e)' }}
                          >
                            {metric.values[i]}
                          </span>
                          <span className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                            <span
                              className="block h-full rounded-full"
                              style={{ width: `${Math.max(0, Math.min(100, bar))}%`, background: opt.isRecommended ? GREEN.solid : '#c9c9d0' }}
                            />
                          </span>
                        </div>
                      ) : (
                        <span
                          className="block text-right font-mono text-[13px]"
                          style={{ color: opt.isRecommended ? GREEN.solid : 'var(--color-text-primary, #2b2b2e)' }}
                        >
                          {metric.values[i]}
                        </span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Azioni */}
      {(showActions || footnote) && (
        <div className="flex flex-col gap-2 border-t border-ink-100 bg-ink-100/20 px-6 py-3">
          {showActions && (
            <div className="flex flex-wrap items-start gap-2">
              {onOpenSingle && (
                <>
                  {singleActionLabel && (
                    <span className="shrink-0 pt-2 text-[12px] font-medium text-ink-500">{singleActionLabel}:</span>
                  )}
                  {options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onOpenSingle(opt.id)}
                      title={opt.label}
                      className="group inline-flex min-h-9 items-center gap-2 rounded border border-ink-200 bg-white px-2.5 py-1.5 text-left text-[12px] font-semibold leading-snug text-ink-700 transition-colors hover:border-brand-violet hover:text-brand-violet"
                    >
                      <span
                        className="inline-flex h-6 w-6 shrink-0 items-center justify-center font-mono text-[10px] font-bold leading-none"
                        style={{
                          background: opt.badgeBg ?? (opt.isRecommended ? GREEN.solid : '#e5e5e8'),
                          color: opt.badgeText ?? (opt.isRecommended ? GREEN.text : '#5b5b62'),
                        }}
                      >
                        {opt.id}
                      </span>
                      <span className="whitespace-nowrap">{opt.label}</span>
                      <span className="ml-auto shrink-0 text-[16px] font-extrabold leading-none text-ink-700 transition-colors group-hover:text-brand-violet" aria-hidden="true">-&gt;</span>
                    </button>
                  ))}
                </>
              )}
              {onCompare && (
                <button
                  type="button"
                  onClick={onCompare}
                  className="ml-auto inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded bg-brand-violet px-4 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-brand-violet-dark"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  Confronta le opzioni
                </button>
              )}
            </div>
          )}
          {footnote && <p className="text-[11px] text-ink-400">{footnote}</p>}
        </div>
      )}
    </div>
  )
}
