import { IconArrowRight, IconCheck } from "./ui/Icons";

const COLUMNS = [
  {
    title: "In cosa consiste?",
    items: [
      "Identificare il progetto",
      "Scegliere settore tipo di intervento",
      "Inserire la localizzazione",
      "Inserire i parametri economici",
      "Avviare una valutazione*",
    ],
    note: "*PUOI CREARE UN PROGETTO ANCHE SENZA ESEGUIRE IMMEDIATAMENTE LE ANALISI",
  },
  {
    title: "Perché è importante?",
    items: [
      "Dimostrare con dati concreti il valore delle scelte politiche e amministrative",
      "Aumentare le possibilità di accesso a bandi e finanziamenti nazionali ed europei",
      "Assicurare coerenza con DUP, PIAO, SDGs e gli altri strumenti di programmazione",
      "Garantire trasparenza e responsabilità verso cittadini e organi di controllo",
    ],
  },
  {
    title: "Tips per la compilazione",
    items: [
      "Più dettagli riuscirai a inserire e più saranno aderenti alla realtà, più la valutazione sarà affidabile",
      "Potrai tornare indietro, modificare e completare i dati in qualsiasi momento. Il salvataggio è automatico",
      "Per l'analisi di impatto la configurazione sarà sufficiente: per eseguirle non sarà necessario integrare altre informazioni",
    ],
  },
];

export function ValutazioneIntro({ onContinua, onClose }) {
  return (
    <div className="fixed inset-0 bg-bg-page z-50 overflow-y-auto">
      <div className="min-h-full flex flex-col">
        <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-ink-100">
          <p className="text-sm text-ink-500 font-semibold">Nuova valutazione</p>
          <button onClick={onClose} className="text-sm font-semibold text-ink-700 hover:text-ink-900">
            Annulla
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-14">
          <div className="w-full max-w-5xl">
            <h1 className="text-4xl font-bold text-center">Valutazione</h1>
            <p className="mt-4 text-center text-sm text-ink-700 max-w-2xl mx-auto leading-relaxed">
              La valutazione rappresenta il punto di partenza di un intervento, e funge da contenitore dinamico delle analisi che sceglierai di eseguire tra Analisi di Impatto, Analisi Costi-Benefici e Analisi ESG
            </p>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {COLUMNS.map((col) => (
                <div key={col.title} className="bg-white overflow-hidden shadow-[0_14px_34px_rgba(15,23,42,0.06)] border border-ink-100">
                  <div className="h-1 bg-brand-violet" />
                  <div className="px-6 py-6">
                    <h2 className="text-base font-bold">{col.title}</h2>
                    <ul className="mt-5 space-y-4">
                      {col.items.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="mt-0.5 flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-brand-violet text-white">
                            <IconCheck className="w-3 h-3" />
                          </span>
                          <span className="text-sm text-ink-700 leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                    {col.note && (
                      <p className="mt-5 text-[10px] font-bold uppercase tracking-wide text-ink-400">{col.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <button
                onClick={onContinua}
                className="flex items-center gap-2 bg-brand-violet px-8 py-3 text-sm font-semibold text-white hover:bg-brand-violet-dark"
              >
                Inizia configurazione
                <IconArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
