import { useEffect, useRef, useState } from "react";
import { IconArrowRight } from "./ui/Icons";

function RunningIcon({ done }) {
  return (
    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#2f2f2f] text-white">
      {done ? (
        <svg className="h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <div className="h-9 w-9 animate-pulse bg-white" />
      )}
    </div>
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

export function AnalysisRunningBoth({ onBackToProject, onOpenEsg, onComplete }) {
  const [progress, setProgress] = useState(0);
  const completedRef = useRef(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setProgress((value) => {
        if (value >= 100) {
          window.clearInterval(interval);
          return 100;
        }
        return value + 3;
      });
    }, 120);
    return () => window.clearInterval(interval);
  }, []);

  const done = progress >= 100;

  useEffect(() => {
    if (done && !completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  }, [done, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white">
      {/* Top section */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <RunningIcon done={done} />

        <h1 className="mt-8 max-w-lg text-[20px] font-bold leading-tight text-ink-900">
          {done
            ? "Analisi completate con successo"
            : "Analisi di Impatto e Costi-Benefici in corso..."}
        </h1>

        <p className="mx-auto mt-4 max-w-[480px] text-[13px] leading-[1.55] text-ink-600">
          {done
            ? "L'Analisi di Impatto Economico e l'Analisi Costi-Benefici del tuo progetto sono disponibili nell'ambiente di progetto."
            : "Stiamo elaborando l'Analisi di Impatto Economico e l'Analisi Costi-Benefici. Puoi attendere qui o tornare al progetto."}
        </p>

        <div className="mx-auto mt-8 h-[4px] w-full max-w-[240px] overflow-hidden bg-[#ececec]">
          <div className="h-full bg-brand-violet transition-[width] duration-300" style={{ width: `${progress}%` }} />
        </div>

        <div className="mt-8 flex items-center gap-5">
          <button
            type="button"
            onClick={onBackToProject}
            className="text-[13px] font-semibold text-brand-violet hover:underline"
          >
            Vai all'ambiente di progetto &rarr;
          </button>
        </div>
      </div>

      {/* Bottom dotted section */}
      <div className="dots-violet-bg px-6 py-12">
        <div className="flex flex-col items-center">
          <p className="text-[12px] font-semibold uppercase tracking-widest text-ink-500">Per una visione completa</p>
          <h2 className="mt-2 text-[20px] font-bold text-ink-900">Esegui subito l'analisi ESG</h2>
          <p className="mt-2 max-w-md text-center text-[13px] leading-[1.55] text-ink-600">
            Valuta la sostenibilità del progetto secondo i criteri ambientali, sociali e di governance.
          </p>

          <div className="mt-8 w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-lg">
            <div className="h-[5px] bg-[#22d3ee]" />
            <div className="flex flex-col items-center px-6 pb-6 pt-8 text-center">
              <IconNetwork className="h-10 w-10 text-brand-violet" />
              <h3 className="mt-4 text-[16px] font-bold text-ink-900">Analisi ESG</h3>
              <p className="mt-2 text-[13px] leading-[1.6] text-ink-600">
                Valuta la sostenibilità del progetto secondo i criteri ambientali, sociali e di governance.
              </p>
              <button
                type="button"
                onClick={onOpenEsg}
                className="mt-6 flex w-full items-center justify-between bg-brand-violet px-5 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-brand-violet-dark"
              >
                Esegui
                <IconArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
