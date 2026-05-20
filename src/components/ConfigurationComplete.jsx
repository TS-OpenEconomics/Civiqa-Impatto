import { IconArrowRight, IconCheck } from "./ui/Icons";

export function ConfigurationComplete({ project, analyses, onOpenProject, onOpenEia, onOpenEcba, onOpenEsg }) {
  return (
    <div className="fixed inset-0 bg-bg-page z-50 flex items-center justify-center px-8">
      <div className="w-full max-w-5xl bg-white">
        <div className="h-1 bg-accent-lime" />
        <div className="p-10">
          <div className="w-16 h-16 rounded-full bg-brand-violet text-white flex items-center justify-center">
            <IconCheck className="w-8 h-8" />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight">Configurazione completata</h1>
          <p className="mt-4 text-sm text-ink-700 max-w-3xl leading-relaxed">
            Il progetto <strong>{project.nome}</strong> e pronto per passare dalla raccolta dati alla valutazione analitica. Da qui puoi entrare nell'ambiente di progetto oppure avviare direttamente una delle analisi previste dal flusso.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
            <ActionCard title="Vai all'ambiente di progetto" text="Consulta il dettaglio del progetto, i metadati e le analisi disponibili." status="Pronto" onClick={onOpenProject} />
            <ActionCard title="Avvia Analisi di Impatto" text="Stima effetti su economia locale, occupazione e sviluppo del territorio." status={statusLabel(analyses.eia.status)} onClick={onOpenEia} />
            <ActionCard title="Avvia Analisi Costi-Benefici" text="Leggi benefici, costi, VAN, payback e principali indicatori economici." status={statusLabel(analyses.ecba.status)} onClick={onOpenEcba} />
            <ActionCard title="Avvia Analisi ESG" text="Compila il questionario ambientale, sociale e di governance e ottieni un rating sintetico." status={statusLabel(analyses.esg.status)} onClick={onOpenEsg} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionCard({ title, text, status, onClick }) {
  return (
    <button onClick={onClick} className="text-left border border-ink-100 p-5 hover:border-brand-violet hover:bg-brand-violet-soft transition-colors">
      <span className="inline-flex px-2 py-1 bg-ink-100 text-ink-700 text-xs font-semibold">{status}</span>
      <p className="text-lg font-bold">{title}</p>
      <p className="mt-3 text-sm text-ink-700 leading-relaxed">{text}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-violet">
        Apri
        <IconArrowRight className="w-4 h-4" />
      </span>
    </button>
  );
}

function statusLabel(status) {
  const labels = {
    needs_input: "Input richiesti",
    running: "In elaborazione",
    completed: "Completata",
  };
  return labels[status] || "Da avviare";
}
