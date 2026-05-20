import { IconArrowRight } from "./ui/Icons";

export function ConfigurationComplete({ project, analyses, onOpenProject, onOpenEia, onOpenEcba, onOpenEsg }) {
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-bold max-w-2xl leading-tight">
          Abbiamo finito! La tua configurazione è completata
        </h1>
        <p className="mt-6 text-sm text-ink-700 max-w-2xl leading-relaxed">
          Nella pagina di dettaglio del progetto troverai tutte le informazioni inserite in fase di configurazione, con la possibilità di modificarle o aggiornarle. Potrai anche:
        </p>
        <div className="mt-3 space-y-1 text-sm text-ink-700">
          <p>Avviare Analisi di Impatto (EIA) , Analisi Costi-Benefici (ECBA) e Analisi ESG;</p>
          <p>Caricare o allegare documenti tecnici, normativi o di supporto;</p>
          <p>Aggiornare in qualsiasi momento i parametri inseriti per mantenere il progetto allineato ai tuoi obiettivi.</p>
        </div>
        <button
          onClick={onOpenProject}
          className="mt-8 flex items-center gap-2 text-brand-violet font-semibold text-sm hover:underline"
        >
          Vai all'ambiente di progetto
          <IconArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-bg-page px-8 pb-16">
        <p className="text-center text-sm text-ink-500 pt-1">Oppure</p>
        <h2 className="mt-2 text-center text-2xl font-bold">Esegui subito un'analisi</h2>
        <div className="mt-8 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          <AnalysisCard
            accentClass="bg-pink-400"
            icon={<IconAnalisiImpatto />}
            title="Analisi di impatto"
            description="per stimare gli effetti del progetto su economia locale, occupazione e sviluppo del territorio."
            onRun={onOpenEia}
          />
          <AnalysisCard
            accentClass="bg-violet-300"
            icon={<IconCostiBenefici />}
            title="Analisi Costi-Benefici"
            description="per valutare il rapporto tra costi e benefici del progetto, misurandone la convenienza complessiva per la collettività"
            onRun={onOpenEcba}
          />
          <AnalysisCard
            accentClass="bg-cyan-300"
            icon={<IconAnalisiEsg />}
            title="Analisi ESG"
            description="per valutare la sostenibilità del progetto secondo i criteri ambientali, sociali e di governance"
            onRun={onOpenEsg}
          />
        </div>
      </div>
    </div>
  );
}

function AnalysisCard({ accentClass, icon, title, description, onRun }) {
  return (
    <div className="bg-white overflow-hidden shadow-[0_14px_34px_rgba(15,23,42,0.06)] border border-ink-100">
      <div className={`h-1.5 ${accentClass}`} />
      <div className="px-6 py-8 flex flex-col items-center text-center">
        <div className="flex items-center justify-center text-brand-violet">
          {icon}
        </div>
        <h3 className="mt-4 text-base font-bold">{title}</h3>
        <p className="mt-2 text-sm text-ink-600 leading-relaxed flex-1">{description}</p>
        <button
          onClick={onRun}
          className="mt-6 w-full flex items-center justify-between bg-brand-violet px-5 py-3 text-sm font-bold text-white hover:bg-brand-violet-dark"
        >
          Esegui
          <IconArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function IconAnalisiImpatto() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16">
      <circle cx="32" cy="32" r="26" />
      <circle cx="32" cy="32" r="16" />
      <circle cx="32" cy="32" r="6" />
      <path d="M38 26l6-6" />
      <path d="M42 20l2 6M42 20l-6 2" />
    </svg>
  );
}

function IconCostiBenefici() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16">
      <line x1="32" y1="10" x2="32" y2="56" />
      <line x1="20" y1="56" x2="44" y2="56" />
      <line x1="16" y1="26" x2="48" y2="26" />
      <path d="M16 26l-8 12h16z" />
      <path d="M48 26l-8 12h16z" />
    </svg>
  );
}

function IconAnalisiEsg() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16">
      <circle cx="32" cy="14" r="8" />
      <circle cx="14" cy="46" r="8" />
      <circle cx="50" cy="46" r="8" />
      <line x1="26" y1="20" x2="19" y2="38" />
      <line x1="38" y1="20" x2="45" y2="38" />
      <line x1="22" y1="46" x2="42" y2="46" />
    </svg>
  );
}
