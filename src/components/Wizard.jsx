import { useState } from "react";
import {
  IconArrowLeft,
  IconArrowRight,
  IconClose,
  IconTrash,
  IconHelp,
  IconCollapse,
  IconCheck,
  IconPin,
} from "./ui/Icons";

const STEPS = [
  {
    id: "profilazione",
    label: "Profilazione",
    sub: ["Tipo intervento", "Categoria"],
  },
  {
    id: "contesto",
    label: "Contesto operativo",
    sub: ["Durata del progetto", "Localizzazione"],
  },
  {
    id: "economici",
    label: "Parametri economici",
    sub: ["CAPEX", "OPEX", "Tasso di sconto"],
  },
];

export function Wizard({ onClose, onComplete }) {
  const [stepIdx, setStepIdx] = useState(1); // Contesto operativo
  const [subStepIdx, setSubStepIdx] = useState(1); // Localizzazione
  const [address, setAddress] = useState("");
  const [showMap, setShowMap] = useState(false);

  function handleNext() {
    if (stepIdx === 1 && subStepIdx === 1) {
      // ultimo sub-step di contesto -> passa a economici (poi completa)
      onComplete();
    } else {
      setSubStepIdx(subStepIdx + 1);
    }
  }

  function handleAddressBlur() {
    if (address.trim().length > 5) setShowMap(true);
  }

  return (
    <div className="fixed inset-0 bg-bg-page z-50 flex flex-col">
      {/* Top bar */}
      <div className="h-14 bg-white flex items-center justify-end px-6 shrink-0 border-b border-ink-100">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-brand-violet text-sm font-semibold"
        >
          Chiudi e torna alle valutazioni
          <IconClose />
        </button>
      </div>
      <div className="h-[3px] bg-accent-lime" />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar steps */}
        <aside className="w-80 shrink-0 bg-bg-page px-8 py-10 border-r border-ink-100">
          <ul className="relative flex flex-col gap-8">
            {/* Linea connettore */}
            <span className="absolute left-[15px] top-3 bottom-3 w-px bg-ink-300" aria-hidden="true" />

            {STEPS.map((s, i) => {
              const isCompleted = i < stepIdx;
              const isActive = i === stepIdx;
              const isDisabled = i > stepIdx;
              return (
                <li key={s.id} className="relative">
                  <div className="flex items-center gap-4">
                    <span
                      className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        isCompleted
                          ? "bg-brand-violet text-white"
                          : isActive
                          ? "bg-brand-violet text-white"
                          : "bg-white border border-ink-300 text-ink-300"
                      }`}
                    >
                      {isCompleted ? <IconCheck /> : ""}
                    </span>
                    <span
                      className={`text-base font-bold ${
                        isDisabled ? "text-ink-300" : "text-ink-900"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {isActive && (
                    <ul className="mt-5 ml-12 flex flex-col gap-3 text-sm">
                      {s.sub.map((label, j) => (
                        <li key={j}>
                          <span
                            className={`pb-1 ${
                              j <= subStepIdx
                                ? "border-b-2 border-brand-violet font-semibold"
                                : "text-ink-500"
                            }`}
                          >
                            {label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Contenuto */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex justify-end px-10 pt-6 gap-2">
            <button className="w-9 h-9 bg-brand-violet text-white flex items-center justify-center">
              <IconCollapse />
            </button>
            <button className="w-9 h-9 bg-white border border-ink-100 flex items-center justify-center text-ink-700">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="15" y2="12" />
                <line x1="3" y1="18" x2="18" y2="18" />
              </svg>
            </button>
            <button className="w-9 h-9 bg-white border border-ink-100 flex items-center justify-center text-ink-700">
              <IconHelp />
            </button>
          </div>

          <div className="px-10 py-6 max-w-5xl">
            <h2 className="text-xl font-bold">Dove avrà luogo il tuo progetto?</h2>
            <p className="mt-4 text-sm text-ink-700 leading-relaxed">
              Inserisci l'area geografica in cui sarà realizzato il progetto. Questa
              informazione consente di collegare il progetto al territorio, attivare
              dati socio-territoriali rilevanti e fornire analisi contestualizzate su
              impatti ambientali, sociali ed economici.
            </p>
            <p className="mt-4 text-sm font-bold">
              Inserisci un indirizzo o una località, coerentemente col territorio di
              riferimento. Puoi inserire fino a un massimo di 5 località.
            </p>

            {/* Box indirizzo + mappa */}
            <div className="mt-6 grid grid-cols-[1fr_280px] gap-0 bg-white">
              <div className="p-6">
                <label className="block text-sm font-bold mb-2">Indirizzo o località</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onBlur={handleAddressBlur}
                  placeholder="Inserisci un indirizzo o località"
                  className="w-full h-11 px-3 border border-ink-300 text-sm placeholder:text-ink-300 focus:outline-none focus:border-brand-violet"
                />
                <button className="mt-5 text-red-600 text-sm font-semibold flex items-center gap-2">
                  Elimina localizzazione <IconTrash />
                </button>
              </div>
              <div className="bg-ink-100 relative overflow-hidden flex items-center justify-center text-center text-ink-500 text-sm">
                {showMap ? <MapPlaceholder /> : (
                  <p className="px-6">
                    Inserisci l'indirizzo per visualizzare<br />la posizione anche in mappa.
                  </p>
                )}
              </div>
            </div>

            {/* Aggiungi luogo */}
            <button className="mt-5 w-full h-14 border-2 border-dashed border-brand-violet text-brand-violet font-semibold text-sm flex items-center justify-center gap-2">
              Inserisci un altro luogo +
            </button>
          </div>
        </div>
      </div>

      {/* Footer fisso */}
      <div className="h-16 shrink-0 grid grid-cols-2">
        <button
          onClick={() => onClose()}
          className="bg-ink-900 text-white text-sm font-semibold flex items-center justify-between px-8"
        >
          <span>Torna allo step precedente</span>
          <IconArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          disabled={address.trim().length === 0}
          className={`text-sm font-semibold flex items-center justify-between px-8 ${
            address.trim().length === 0
              ? "bg-ink-100 text-ink-300 cursor-not-allowed"
              : "bg-brand-violet text-white hover:bg-brand-violet-dark"
          }`}
        >
          <span>Vai allo step successivo</span>
          <IconArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function MapPlaceholder() {
  // Mappa stilizzata SVG: nessuna API esterna nel POC
  return (
    <div className="absolute inset-0">
      <svg className="w-full h-full" viewBox="0 0 280 200" preserveAspectRatio="xMidYMid slice">
        <rect width="280" height="200" fill="#E5E5E8" />
        {/* Strade */}
        <line x1="0" y1="80" x2="280" y2="80" stroke="#FFF" strokeWidth="14" />
        <line x1="140" y1="0" x2="140" y2="200" stroke="#FFF" strokeWidth="14" />
        <line x1="0" y1="80" x2="280" y2="80" stroke="#A3A3AA" strokeWidth="1" />
        <line x1="140" y1="0" x2="140" y2="200" stroke="#A3A3AA" strokeWidth="1" />
        {/* Etichette POI */}
        <text x="20" y="60" fontSize="7" fill="#5A5A60" fontFamily="Inter">Grela Parfum</text>
        <text x="20" y="100" fontSize="7" fill="#5A5A60" fontFamily="Inter">Original Marines</text>
        <text x="170" y="120" fontSize="7" fill="#5A5A60" fontFamily="Inter">Calzedonia</text>
        <text x="170" y="150" fontSize="7" fill="#5A5A60" fontFamily="Inter">Mondadori</text>
      </svg>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full text-brand-violet">
        <IconPin className="w-10 h-10" />
      </div>
    </div>
  );
}
