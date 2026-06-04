/* Dashboard di prodotto — Impatti
 * Aggrega widget dai moduli: Valutazione, Composing, Pianificazione, DOCFAP.
 * Per ora mostra i widget placeholder; ogni modulo alimenterà i propri dati. */

import { useNavigate } from 'react-router-dom'

/* ─── Stat card ─── */
interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  accent?: string // tailwind bg class for the top accent line
}

function StatCard({ label, value, sub, accent = 'bg-bluette-700' }: StatCardProps) {
  return (
    <div className="bg-white border border-gray-200 flex flex-col" style={{ boxShadow: '0px 4px 4px rgba(0,0,0,0.15)' }}>
      <div className={`h-1 w-full ${accent}`} />
      <div className="p-5">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">{label}</p>
        <p className="font-mono text-2xl font-semibold text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  )
}

/* ─── Module widget ─── */
interface ModuleWidgetProps {
  title: string
  description: string
  cta: string
  to: string
  accent?: string
  children?: React.ReactNode
}

function ModuleWidget({ title, description, cta, to, accent = 'bg-bluette-700', children }: ModuleWidgetProps) {
  const navigate = useNavigate()
  return (
    <div
      className="bg-white border border-gray-200 flex flex-col cursor-pointer hover:border-bluette-300 transition-colors"
      style={{ boxShadow: '0px 4px 4px rgba(0,0,0,0.15)' }}
      onClick={() => navigate(to)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate(to)}
    >
      <div className={`h-1 w-full ${accent}`} />
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif text-base font-normal text-gray-900 mb-1">{title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed flex-1">{children || description}</p>
        <div className="mt-4 pt-3 border-t border-gray-100">
          <span className="text-xs font-semibold text-bluette-700">{cta} →</span>
        </div>
      </div>
    </div>
  )
}

/* ─── Dashboard ─── */
export function ImpattDashboard() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Page header */}
      <div>
        <h1 className="font-serif text-2xl font-normal text-gray-900">Dashboard Impatti</h1>
        <p className="text-sm text-gray-500 mt-1">Panoramica aggregata di tutti i moduli del prodotto Impatti.</p>
      </div>

      {/* KPI strip */}
      <section>
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-3">Riepilogo</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Interventi attivi" value="48" sub="Comune di Colleferro" accent="bg-bluette-700" />
          <StatCard label="Alternative DOCFAP" value="4" sub="Ultima analisi: mar 2026" accent="bg-bluette-500" />
          <StatCard label="Budget pianificato" value="€ 12,4M" sub="Triennio 2026–2028" accent="bg-lime-600" />
          <StatCard label="Semaforo OPEX" value="Verde" sub="Sostenibilità confermata" accent="bg-green-500" />
        </div>
      </section>

      {/* Module widgets */}
      <section>
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-3">Moduli</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ModuleWidget
            title="Valutazione"
            description="EIA, ECBA, ESG e Risk. Nessuna analisi avviata."
            cta="Vai a Valutazione"
            to="/impatti/valutazione"
            accent="bg-bluette-700"
          />
          <ModuleWidget
            title="Composing"
            description="Confronto multi-alternativa e generazione documenti."
            cta="Vai a Composing"
            to="/impatti/composing"
            accent="bg-bluette-500"
          />
          <ModuleWidget
            title="Fabbisogni"
            description="Programmazione triennale, budget e priorità interventi."
            cta="Vai a Fabbisogni"
            to="/impatti/pianificazione"
            accent="bg-lime-600"
          />
          <ModuleWidget
            title="DOCFAP"
            description="Documento di Fattibilità ex D.Lgs. 36/2023 — 4 alternative in analisi."
            cta="Vai a DOCFAP"
            to="/impatti/docfap"
            accent="bg-indigo-600"
          />
        </div>
      </section>

      {/* Placeholder for future aggregated content */}
      <section>
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-3">Attività recenti</p>
        <div className="bg-white border border-gray-200 p-6 text-center text-sm text-gray-400" style={{ boxShadow: '0px 4px 4px rgba(0,0,0,0.15)' }}>
          Le attività recenti dai moduli appariranno qui.
        </div>
      </section>
    </div>
  )
}
