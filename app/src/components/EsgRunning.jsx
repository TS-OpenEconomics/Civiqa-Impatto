import { useEffect, useRef, useState } from "react";

const CONFETTI = [
  { top: "-18px", left: "56px",  w: "8px",  h: "6px",  color: "#f472b6" },
  { top: "-12px", left: "80px",  w: "6px",  h: "6px",  color: "#22d3ee" },
  { top: "2px",   left: "100px", w: "5px",  h: "8px",  color: "#facc15" },
  { top: "-20px", left: "100px", w: "7px",  h: "5px",  color: "#a78bfa" },
  { top: "18px",  left: "108px", w: "6px",  h: "6px",  color: "#34d399" },
  { top: "32px",  left: "96px",  w: "8px",  h: "5px",  color: "#fb923c" },
  { top: "44px",  left: "72px",  w: "5px",  h: "7px",  color: "#f472b6" },
  { top: "50px",  left: "50px",  w: "7px",  h: "5px",  color: "#22d3ee" },
];

export function EsgRunning({ onBackToProject, onComplete }) {
  const [progress, setProgress] = useState(0);
  const completedRef = useRef(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setProgress((v) => {
        if (v >= 100) { window.clearInterval(interval); return 100; }
        return v + 3;
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
      {/* Top white section */}
      <div className="flex flex-col items-center px-6 pb-12 pt-14">
        {/* Step circles + confetti */}
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

          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#e0e0e6] bg-white">
            <div className="h-4 w-4 rounded-full bg-[#d8d8de]" />
          </div>
          <div className="h-[2px] w-20 bg-[#e0e0e6]" />
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-violet shadow-lg">
            <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        <h1 className="mt-10 text-[24px] font-bold text-ink-900">Abbiamo finito!</h1>
        <p className="mt-3 text-[14px] text-ink-600">Hai risposto a tutte le domande del questionario.</p>
      </div>

      {/* Bottom grey section */}
      <div className="dots-grey-bg flex-1 px-6 py-14">
        <div className="flex flex-col items-center text-center">
          {/* Icon: dark circle with lime square */}
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-brand-violet">
            {done ? (
              <svg className="h-9 w-9 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <div className="h-9 w-9 animate-pulse bg-[#d4fb43]" />
            )}
          </div>

          <h2 className="mt-6 text-[18px] font-bold text-ink-900">
            {done ? "Analisi ESG completata." : "L'esecuzione dell'Analisi ESG è in corso…"}
          </h2>

          <p className="mx-auto mt-3 max-w-md text-[13px] leading-[1.55] text-ink-700">
            Puoi andare al dettaglio del progetto mentre elaboriamo i dati.
            <br />
            Ti arriverà una comunicazione via mail quando l'analisi sarà stata eseguita.
          </p>

          <div className="mx-auto mt-6 h-[4px] w-48 overflow-hidden bg-[#dcdce1]">
            <div className="h-full bg-brand-violet transition-[width] duration-300" style={{ width: `${progress}%` }} />
          </div>

          <button
            type="button"
            onClick={onBackToProject}
            className="mt-8 text-[14px] font-semibold text-brand-violet hover:underline"
          >
            Vai all'ambiente di progetto &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
