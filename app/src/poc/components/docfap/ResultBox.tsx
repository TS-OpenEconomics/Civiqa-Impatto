import type { ReactNode } from 'react'
import type { AlternativaId } from '../../types/docfap'

export interface ResultBoxOption {
  id: AlternativaId
  label: string
  isRecommended: boolean
}

export interface ResultBoxMetric {
  label: string
  /** Un valore formattato per ogni opzione (stesso ordine di `options`). */
  values: string[]
  /** Evidenzia la riga (es. il punteggio della dimensione). */
  emphasize?: boolean
  /** Valori 0–100 per opzione: se presenti, la cella mostra una barra sopra al valore. */
  barValues?: number[]
}

interface ResultBoxProps {
  /** Logo immagine (es. icons/analysis-eia.png). Ha precedenza su `icon`. */
  iconSrc?: string
  /** Icona inline (fallback se non c'è un logo immagine), resa in un quadrato viola. */
  icon?: ReactNode
  title: string
  tag: string
  tagClassName?: string
  description: string
  options: ResultBoxOption[]
  metrics: ResultBoxMetric[]
  /** Etichetta del gruppo di azioni "analisi completa". */
  singleActionLabel: string
  onOpenSingle: (optionId: AlternativaId) => void
  onCompare: () => void
  /** Nota opzionale sotto le azioni. */
  footnote?: string
}

const OPTION_COL = 'min-w-[150px]'

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
  singleActionLabel,
  onOpenSingle,
  onCompare,
  footnote,
}: ResultBoxProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-ink-100 bg-white shadow-sm">
      {/* Header */}
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

      {/* Confronto su N opzioni */}
      <div className="overflow-x-auto px-6 py-4">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-[200px] min-w-[160px] pb-3 pr-4 text-left align-bottom text-[10px] font-semibold uppercase tracking-wide text-ink-400">
                Indicatore
              </th>
              {options.map((opt) => (
                <th key={opt.id} className={`${OPTION_COL} px-3 pb-3 align-bottom`}>
                  <div className="flex flex-col items-end gap-1 text-right">
                    <span className="flex items-center gap-1.5">
                      <span className={`inline-flex h-5 items-center px-1.5 font-mono text-[10px] font-bold ${opt.isRecommended ? 'bg-brand-violet text-white' : 'bg-ink-100 text-ink-600'}`}>
                        {opt.id}
                      </span>
                      {opt.isRecommended && (
                        <span className="inline-flex items-center bg-green-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                          Racc.
                        </span>
                      )}
                    </span>
                    <span className="block max-w-[160px] truncate text-[12px] font-bold text-ink-900" title={opt.label}>
                      {opt.label}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => (
              <tr key={metric.label} className="border-t border-ink-100">
                <td className={`py-2.5 pr-4 text-[12px] ${metric.emphasize ? 'font-bold text-ink-900' : 'text-ink-600'}`}>
                  {metric.label}
                </td>
                {options.map((opt, i) => {
                  const bar = metric.barValues?.[i]
                  return (
                    <td
                      key={opt.id}
                      className={`${OPTION_COL} px-3 py-2.5 align-middle ${opt.isRecommended ? 'bg-brand-violet/5' : ''}`}
                    >
                      {bar != null ? (
                        <div className="flex flex-col items-end gap-1">
                          <span className={`font-mono text-[14px] font-bold ${opt.isRecommended ? 'text-brand-violet' : 'text-ink-800'}`}>
                            {metric.values[i]}
                          </span>
                          <span className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                            <span
                              className={`block h-full rounded-full ${opt.isRecommended ? 'bg-brand-violet' : 'bg-ink-300'}`}
                              style={{ width: `${Math.max(0, Math.min(100, bar))}%` }}
                            />
                          </span>
                        </div>
                      ) : (
                        <span className={`block text-right font-mono text-[13px] ${opt.isRecommended ? 'text-brand-violet' : 'text-ink-800'}`}>
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
      <div className="flex flex-col gap-2 border-t border-ink-100 bg-ink-100/20 px-6 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[12px] font-medium text-ink-500">{singleActionLabel}:</span>
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onOpenSingle(opt.id)}
              title={opt.label}
              className="inline-flex items-center gap-1.5 rounded border border-ink-200 bg-white px-2.5 py-1.5 text-[12px] font-semibold text-ink-700 transition-colors hover:border-brand-violet hover:text-brand-violet"
            >
              <span className={`inline-flex h-4 items-center px-1 font-mono text-[10px] font-bold ${opt.isRecommended ? 'bg-brand-violet text-white' : 'bg-ink-100 text-ink-500'}`}>
                {opt.id}
              </span>
              <span className="max-w-[150px] truncate">{opt.label}</span>
              <span aria-hidden="true">→</span>
            </button>
          ))}
          <button
            type="button"
            onClick={onCompare}
            className="ml-auto inline-flex items-center gap-1.5 rounded bg-brand-violet px-4 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-brand-violet-dark"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4M16 17H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Confronta le opzioni
          </button>
        </div>
        {footnote && <p className="text-[11px] text-ink-400">{footnote}</p>}
      </div>
    </div>
  )
}
