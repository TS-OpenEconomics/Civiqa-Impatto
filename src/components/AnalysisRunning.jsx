import { useEffect, useState } from "react";
import { IconArrowRight, IconClose } from "./ui/Icons";

export function AnalysisRunning({ title, onComplete, onBack }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((value) => {
        if (value >= 100) {
          clearInterval(interval);
          return 100;
        }
        return value + 5;
      });
    }, 120);
    return () => clearInterval(interval);
  }, []);

  const done = progress >= 100;
  const steps = [
    { label: "Validazione input", threshold: 20 },
    { label: "Elaborazione modello", threshold: 55 },
    { label: "Aggregazione risultati", threshold: 82 },
    { label: "Preparazione output", threshold: 100 },
  ];
  const currentStep = steps.find((step) => progress <= step.threshold) ?? steps[steps.length - 1];
  const statusText = done
    ? "Risultati pronti per la consultazione."
    : `${currentStep.label} in corso. Il sistema sta completando l'analisi e preparando gli output.`;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.16),_transparent_34%),linear-gradient(180deg,_#f7f5ff_0%,_#f4f4f1_100%)]">
      <div className="flex h-14 shrink-0 items-center justify-end border-b border-ink-100 bg-white/85 px-6 backdrop-blur-sm">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-brand-violet">
          Chiudi e torna al dettaglio progetto
          <IconClose />
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-10 md:px-10">
        <div className="w-full max-w-3xl overflow-hidden bg-white shadow-[0_28px_80px_rgba(25,23,35,0.12)]">
          <div className="h-1.5 bg-accent-lime" />
          <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-8 md:p-10">
              <p className="text-xs font-mono uppercase tracking-[0.22em] text-brand-violet">Analisi in esecuzione</p>
              <h1 className="mt-4 text-3xl font-bold tracking-tight">{title}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-700">{statusText}</p>

              <div className="mt-8">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-mono uppercase tracking-[0.16em] text-ink-500">Avanzamento</p>
                    <p className="mt-2 text-4xl font-bold tracking-tight text-ink-900">{progress}%</p>
                  </div>
                  {!done ? (
                    <div className="h-12 w-12 rounded-full border-4 border-ink-200 border-t-brand-violet animate-spin" />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-violet text-xl text-white">✓</div>
                  )}
                </div>

                <div className="mt-5 h-3 overflow-hidden rounded-full bg-ink-100">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,_#7C3AED_0%,_#B6F75C_100%)] transition-[width] duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-8 grid gap-3 md:grid-cols-2">
                {steps.map((step, index) => {
                  const isComplete = progress >= step.threshold;
                  const isCurrent = !isComplete && currentStep.label === step.label;
                  return (
                    <div
                      key={step.label}
                      className={`border px-4 py-3 transition-colors ${
                        isComplete
                          ? "border-brand-violet bg-brand-violet-soft"
                          : isCurrent
                            ? "border-accent-lime bg-lime-50"
                            : "border-ink-100 bg-white"
                      }`}
                    >
                      <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-ink-500">Fase {index + 1}</p>
                      <p className="mt-1 text-sm font-semibold text-ink-900">{step.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col justify-between bg-ink-900 p-8 text-white md:p-10">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.16em] text-ink-300">Stato operativo</p>
                <p className="mt-4 text-2xl font-bold tracking-tight">{done ? "Completata" : "Elaborazione in corso"}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-300">
                  {done
                    ? "L'analisi ha terminato tutti i passaggi previsti. Puoi aprire subito i risultati."
                    : "Puoi tornare al progetto in qualsiasi momento. I risultati verranno mantenuti nello stato corrente della demo."}
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <button onClick={onBack} className="flex h-11 items-center justify-between border border-white/15 px-4 text-sm font-semibold text-white">
                  <span>Vai all'ambiente di progetto</span>
                  <IconArrowRight />
                </button>
                {done ? (
                  <button
                    onClick={onComplete}
                    className="flex h-11 items-center justify-between bg-brand-violet px-4 text-sm font-semibold text-white hover:bg-brand-violet-dark"
                  >
                    <span>Vedi i risultati</span>
                    <IconArrowRight />
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
