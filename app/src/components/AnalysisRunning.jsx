import { useEffect, useState } from "react";

function RunningIcon({ done }) {
  return (
    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-brand-violet text-white">
      {done ? <span className="text-[22px] font-semibold">OK</span> : <div className="h-9 w-9 animate-pulse bg-white" />}
    </div>
  );
}

export function AnalysisRunning({ title, onComplete, onBack }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setProgress((value) => {
        if (value >= 100) {
          window.clearInterval(interval);
          return 100;
        }
        return value + 4;
      });
    }, 120);

    return () => window.clearInterval(interval);
  }, []);

  const done = progress >= 100;
  const runningLabel =
    title === "Analisi ESG" ? "L'esecuzione dell'Analisi ESG è in corso…" : "L'esecuzione delle Analisi di Impatto e Costi-Benefici è in corso…";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-[820px] border border-[#efefef] bg-white px-8 py-20 text-center shadow-[0_0_0_1px_rgba(0,0,0,0.02)]">
        <div className="flex justify-center">
          <RunningIcon done={done} />
        </div>

        <h1 className="mt-8 text-[18px] font-bold text-ink-900">{done ? `${title} completata.` : runningLabel}</h1>

        <p className="mx-auto mt-6 max-w-[500px] text-[12px] leading-[1.45] text-ink-700">
          Puoi andare al dettaglio del progetto o eseguire un'altra analisi.
          <br />
          Ti arriverà una comunicazione via mail quando l'analisi sarà stata eseguita.
        </p>

        <div className="mx-auto mt-8 h-[4px] w-full max-w-[240px] overflow-hidden bg-[#ececec]">
          <div className="h-full bg-brand-violet transition-[width] duration-300" style={{ width: `${progress}%` }} />
        </div>

        <div className="mt-10 flex items-center justify-center gap-5">
          <button type="button" onClick={onBack} className="text-[12px] font-semibold text-brand-violet hover:underline">
            Vai all'ambiente di progetto &rarr;
          </button>
          {done ? (
            <button type="button" onClick={onComplete} className="border border-brand-violet px-4 py-2 text-[12px] font-semibold text-brand-violet hover:bg-brand-violet hover:text-white">
              Apri i risultati
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
