import { useEffect, useState } from "react";
import { IconCheck, IconArrowRight, IconClose } from "./ui/Icons";

export function EiaRunning({ onComplete, onBackToProject }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simula avanzamento: 0 → 100 in ~3 secondi
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 4;
      });
    }, 120);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="h-14 bg-white flex items-center justify-end px-6 shrink-0 border-b border-ink-100">
        <button
          onClick={onBackToProject}
          className="flex items-center gap-2 text-brand-violet text-sm font-semibold"
        >
          Chiudi e torna al dettaglio progetto
          <IconClose />
        </button>
      </div>
      <div className="h-[3px] bg-accent-lime" />

      {/* Sezione superiore: progresso */}
      <div className="bg-white py-16 flex flex-col items-center text-center">
        <ProgressBubble progress={progress} />
        <h2 className="mt-8 text-3xl font-bold tracking-tight">
          Abbiamo finito!
        </h2>
        <p className="mt-3 text-sm text-ink-700">
          Hai risposto a tutte le domande del questionario.
        </p>
      </div>

      {/* Sezione inferiore: elaborazione */}
      <div className="flex-1 dots-violet-bg flex flex-col items-center justify-center text-center px-10">
        <div className="w-16 h-16 mb-6 flex items-center justify-center">
          <svg viewBox="0 0 64 64" className="w-14 h-14">
            <rect
              x="6"
              y="6"
              width="52"
              height="52"
              fill="none"
              stroke="#0E0E10"
              strokeWidth="4"
            />
            <rect
              x="6"
              y="6"
              width="52"
              height="52"
              fill="#0E0E10"
              opacity={progress > 50 ? 0.2 : 0.1}
            />
            <rect
              x="22"
              y="22"
              width="20"
              height="20"
              fill="#5B21F7"
              opacity={progress > 80 ? 1 : 0.7}
            >
              <animate
                attributeName="opacity"
                values="0.4;1;0.4"
                dur="1.4s"
                repeatCount="indefinite"
              />
            </rect>
          </svg>
        </div>
        <h3 className="text-2xl font-bold tracking-tight">
          L'esecuzione dell'Analisi di Impatto è in corso...
        </h3>
        <p className="mt-4 text-sm text-ink-700 max-w-2xl">
          Puoi andare al dettaglio del progetto mentre elaboriamo i dati.<br />
          Ti arriverà una comunicazione via mail quando l'analisi sarà stata eseguita.
        </p>

        <div className="mt-8 flex gap-5 items-center">
          <button
            onClick={onBackToProject}
            className="text-brand-violet font-semibold text-sm flex items-center gap-2"
          >
            Vai all'ambiente di progetto
            <IconArrowRight />
          </button>
          {progress >= 100 && (
            <button
              onClick={onComplete}
              className="h-11 px-5 bg-brand-violet text-white text-sm font-semibold flex items-center gap-2 hover:bg-brand-violet-dark"
            >
              Vedi i risultati
              <IconArrowRight />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ProgressBubble({ progress }) {
  const done = progress >= 100;
  return (
    <div className="flex items-center gap-3">
      {/* Bolla 1 grigia */}
      <span className="w-14 h-14 rounded-full bg-ink-100 border-2 border-ink-300" />
      {/* Linea */}
      <span className="w-32 h-0.5 bg-ink-300 relative">
        <span
          className="absolute left-0 top-0 h-full bg-brand-violet transition-all"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </span>
      {/* Bolla 2 viola con check */}
      <span
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
          done ? "bg-brand-violet text-white" : "bg-brand-violet/40 text-white"
        }`}
      >
        {done ? (
          <IconCheck className="w-7 h-7" />
        ) : (
          <span className="font-mono text-xs">{progress}%</span>
        )}
      </span>
    </div>
  );
}
