import { IconArrowRight } from "./ui/Icons";

function IconScales({ className = "w-10 h-10" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v19" />
      <path d="M8 21h8" />
      <path d="M6 6h12" />
      <path d="M6 6l-3 6a3 3 0 0 0 6 0L6 6z" />
      <path d="M18 6l-3 6a3 3 0 0 0 6 0L18 6z" />
    </svg>
  );
}

function IconNetwork({ className = "w-10 h-10" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2.5" />
      <circle cx="4.5" cy="18" r="2.5" />
      <circle cx="19.5" cy="18" r="2.5" />
      <line x1="11.1" y1="7.2" x2="5.4" y2="15.8" />
      <line x1="12.9" y1="7.2" x2="18.6" y2="15.8" />
      <line x1="7" y1="18" x2="17" y2="18" />
    </svg>
  );
}

function IconTargetLarge({ className = "w-10 h-10" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

const CONFETTI = [
  { top: "-18px", left: "56px",  w: "8px",  h: "6px",  color: "#f472b6" },
  { top: "-12px", left: "80px",  w: "6px",  h: "6px",  color: "#22d3ee" },
  { top: "2px",   left: "100px", w: "5px",  h: "8px",  color: "#facc15" },
  { top: "-20px", left: "100px", w: "7px",  h: "5px",  color: "#a78bfa" },
  { top: "18px",  left: "108px", w: "6px",  h: "6px",  color: "#34d399" },
  { top: "32px",  left: "96px",  w: "8px",  h: "5px",  color: "#fb923c" },
  { top: "44px",  left: "72px",  w: "5px",  h: "7px",  color: "#f472b6" },
  { top: "50px",  left: "50px",  w: "7px",  h: "5px",  color: "#22d3ee" },
  { top: "-16px", left: "36px",  w: "6px",  h: "6px",  color: "#facc15" },
  { top: "6px",   left: "120px", w: "5px",  h: "5px",  color: "#a78bfa" },
  { top: "28px",  left: "118px", w: "6px",  h: "8px",  color: "#34d399" },
];

export function ConfigurationComplete({ onOpenProject, onOpenEia, onOpenEcba, onOpenEsg }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
      {/* Top white section */}
      <div className="flex flex-col items-center px-6 pb-14 pt-14">

        {/* Step progress + confetti */}
        <div className="relative flex items-center">
          {CONFETTI.map((c, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                top: c.top,
                left: `calc(50% + ${c.left})`,
                width: c.w,
                height: c.h,
                backgroundColor: c.color,
                transform: `rotate(${i * 23}deg)`,
              }}
            />
          ))}

          {/* Circle 1 — completed step */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#e0e0e6] bg-white">
            <div className="h-4 w-4 rounded-full bg-[#d8d8de]" />
          </div>

          {/* Connecting line */}
          <div className="h-[2px] w-20 bg-[#e0e0e6]" />

          {/* Circle 2 — checkmark */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-violet shadow-lg">
            <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="mt-10 max-w-2xl text-center text-[26px] font-bold leading-tight text-ink-900 md:text-[30px]">
          Abbiamo finito! La tua configurazione è completata
        </h1>

        {/* Description */}
        <p className="mt-4 max-w-2xl text-center text-[14px] leading-[1.6] text-ink-700">
          Nella pagina di dettaglio del progetto troverai tutte le informazioni inserite in fase di configurazione,
          con la possibilità di modificarle o aggiornarle. Potrai anche:
        </p>
        <ul className="mt-4 max-w-xl space-y-1 text-center text-[13px] leading-[1.6] text-ink-700">
          <li>Avviare Analisi di Impatto (EIA), Analisi Costi-Benefici (ECBA) e Analisi ESG;</li>
          <li>Caricare o allegare documenti tecnici, normativi o di supporto;</li>
          <li>Aggiornare in qualsiasi momento i parametri inseriti per mantenere il progetto allineato ai tuoi obiettivi.</li>
        </ul>

        {/* Link */}
        <button
          type="button"
          onClick={onOpenProject}
          className="mt-8 flex items-center gap-2 text-[15px] font-semibold text-brand-violet hover:underline"
        >
          Vai all'ambiente di progetto
          <IconArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Bottom dotted section */}
      <div className="dots-violet-bg px-6 py-14">
        <div className="flex flex-col items-center">
          <p className="text-[12px] font-semibold uppercase tracking-widest text-ink-500">Oppure</p>
          <h2 className="mt-2 text-[22px] font-bold text-ink-900">Esegui subito un'analisi</h2>

          <div className="mt-8 grid w-full max-w-3xl grid-cols-1 gap-5 md:grid-cols-3">
            <AnalysisCard
              accent="bg-[#f472b6]"
              icon={<IconTargetLarge className="h-10 w-10 text-brand-violet" />}
              title="Analisi di Impatto"
              description="Per stimare gli effetti del progetto su economia locale, occupazione e sviluppo del territorio."
              onRun={onOpenEia}
            />
            <AnalysisCard
              accent="bg-brand-violet"
              icon={<IconScales className="h-10 w-10 text-brand-violet" />}
              title="Analisi Costi-Benefici"
              description="Per valutare il rapporto tra costi e benefici del progetto, misurandone la convenienza complessiva per la collettività."
              onRun={onOpenEcba}
            />
            <AnalysisCard
              accent="bg-[#22d3ee]"
              icon={<IconNetwork className="h-10 w-10 text-brand-violet" />}
              title="Analisi ESG"
              description="Per valutare la sostenibilità del progetto secondo i criteri ambientali, sociali e di governance."
              onRun={onOpenEsg}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalysisCard({ accent, icon, title, description, onRun }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-lg">
      <div className={`h-[5px] ${accent}`} />
      <div className="flex flex-col items-center px-6 pb-6 pt-8 text-center">
        <div className="mb-4">{icon}</div>
        <h3 className="text-[16px] font-bold text-ink-900">{title}</h3>
        <p className="mt-2 text-[13px] leading-[1.6] text-ink-600">{description}</p>
        <button
          type="button"
          onClick={onRun}
          className="mt-6 flex w-full items-center justify-between bg-brand-violet px-5 py-3 text-[13px] font-semibold text-white hover:bg-brand-violet-dark transition-colors"
        >
          Esegui
          <IconArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
