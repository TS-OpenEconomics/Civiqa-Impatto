import { useState } from 'react'
import type { ReactNode } from 'react'

export interface ProgressiveBlockDef {
  /** Identificatore stabile del blocco. */
  id: string
  /** Titolo del blocco (il numero viene aggiunto automaticamente). */
  title: string
  /** True quando i dati del blocco sono validi/completi. */
  complete: boolean
  /** Contenuto editabile del blocco. */
  children: ReactNode
  /** Riepilogo mostrato quando il blocco è completato e collassato. */
  summary?: ReactNode
  /** Etichetta del bottone di conferma (default "Conferma"). */
  confirmLabel?: string
}

interface ProgressiveBlocksProps {
  blocks: ProgressiveBlockDef[]
}

/**
 * Blocchi impilati con avanzamento esplicito, allineati alle "forme" del wizard
 * di Valutazione (componente ClassAccordion in components/Wizard.jsx):
 * - badge tondo viola con numero (attivo) o ✓ (completato);
 * - "Modifica" come testo viola senza bordo;
 * - box bianco squadrato; bordo viola/40 quando attivo, ink-100 quando completato;
 * - il blocco attivo resta aperto finché non si preme "Conferma" (così campi
 *   condizionali e avvisi restano visibili e il blocco non si chiude da solo);
 * - i blocchi successivi alla frontiera sono visibili ma sbiaditi con lucchetto.
 */
export function ProgressiveBlocks({ blocks }: ProgressiveBlocksProps) {
  // `step` = indice del blocco frontiera (attivo). I blocchi < step sono
  // confermati (recap), quelli > step sono bloccati. Inizializzato al primo
  // blocco incompleto (o a "tutti confermati" se già tutti completi: autofill).
  const [step, setStep] = useState(() => {
    const firstIncomplete = blocks.findIndex((b) => !b.complete)
    return firstIncomplete === -1 ? blocks.length : firstIncomplete
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  // Se tutti i blocchi sono già completi (es. dopo Autoriempi che imposta i dati
  // dall'esterno), mostrali tutti come recap invece di lasciarli "bloccati".
  const allComplete = blocks.length > 0 && blocks.every((b) => b.complete)

  return (
    <div className="grid gap-3">
      {blocks.map((block, index) => {
        const number = index + 1
        const isEditing = editingId === block.id
        const expanded = isEditing || (!allComplete && index === step)
        const locked = !allComplete && !isEditing && index > step

        if (locked) {
          return <LockedBlock key={block.id} number={number} title={block.title} />
        }

        if (!expanded) {
          return (
            <CompletedBlock
              key={block.id}
              title={block.title}
              summary={block.summary}
              onEdit={() => setEditingId(block.id)}
            />
          )
        }

        return (
          <ActiveBlock
            key={block.id}
            number={number}
            title={block.title}
            complete={block.complete}
            confirmLabel={block.confirmLabel ?? 'Conferma'}
            onConfirm={() => {
              if (isEditing) {
                setEditingId(null)
              } else {
                setStep((s) => Math.min(s + 1, blocks.length))
              }
            }}
          >
            {block.children}
          </ActiveBlock>
        )
      })}
    </div>
  )
}

function ActiveBlock({
  number,
  title,
  complete,
  confirmLabel,
  onConfirm,
  children,
}: {
  number: number
  title: string
  complete: boolean
  confirmLabel: string
  onConfirm: () => void
  children: ReactNode
}) {
  return (
    <div className="overflow-hidden border border-brand-violet/40 bg-white">
      <div className="flex items-center gap-3 px-5 py-4">
        <span className="docfap-accordion-num flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-violet text-[12px] font-bold text-white">
          {number}
        </span>
        <p className="text-[13px] font-semibold text-ink-900">{title}</p>
      </div>
      <div className="border-t border-[#ececf1] px-5 pb-5 pt-4">
        <div className="grid gap-4">{children}</div>
        <button
          type="button"
          onClick={onConfirm}
          disabled={!complete}
          className="mt-5 flex items-center gap-2 bg-brand-violet px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-brand-violet-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          {confirmLabel}
          <span className="text-[16px] leading-none">&rarr;</span>
        </button>
      </div>
    </div>
  )
}

function CompletedBlock({
  title,
  summary,
  onEdit,
}: {
  title: string
  summary?: ReactNode
  onEdit: () => void
}) {
  return (
    <div className="overflow-hidden border border-ink-100 bg-white">
      <div className="flex items-center gap-3 px-5 py-4">
        <span className="docfap-accordion-num flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-violet text-[12px] font-bold text-white">
          &#10003;
        </span>
        <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[13px] text-ink-400">{title}</p>
            {summary ? (
              <p className="mt-0.5 truncate text-[15px] font-semibold text-ink-900">{summary}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onEdit}
            className="shrink-0 text-[13px] font-medium text-brand-violet hover:underline"
          >
            Modifica
          </button>
        </div>
      </div>
    </div>
  )
}

function LockedBlock({ number, title }: { number: number; title: string }) {
  return (
    <div className="overflow-hidden border border-ink-100 bg-white opacity-55" aria-disabled="true">
      <div className="flex items-center gap-3 px-5 py-4">
        <span className="docfap-accordion-num flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink-200 text-[12px] font-bold text-ink-500">
          {number}
        </span>
        <p className="flex-1 text-[13px] font-medium text-ink-500">{title}</p>
        <LockIcon />
      </div>
    </div>
  )
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-ink-400">
      <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 10V7a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
