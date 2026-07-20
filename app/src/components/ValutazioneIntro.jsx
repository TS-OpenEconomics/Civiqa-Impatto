const COLUMNS = [
  {
    title: "In cosa consiste?",
    items: [
      "Identificare il progetto",
      "Scegliere settore e tipo di intervento",
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
      "Per l'analisi di impatto la configurazione è sufficiente: non servirà integrare altre informazioni per eseguirla",
    ],
  },
];

function CheckCircle() {
  return (
    <div className="w-5 h-5 rounded-full bg-brand-violet flex-shrink-0 flex items-center justify-center">
      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}

export function ValutazioneIntro({ onContinua, onClose }) {
  return (
    <div className="fixed inset-0 bg-bg-page z-50 flex flex-col">
      {/* Green accent line */}
      <div className="h-[3px] bg-accent-lime flex-shrink-0" />

      {/* Top bar — close button only, floating */}
      <div className="flex justify-end px-8 py-4 flex-shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="text-sm font-semibold text-brand-violet flex items-center gap-2 hover:opacity-80"
        >
          Chiudi e torna alle valutazioni <span className="text-base">×</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-6 py-6">
        <div className="w-full max-w-5xl">
          <h1 className="text-3xl font-bold text-center text-ink-900 mb-4">Analisi Ricadute</h1>
          <p className="text-center text-sm text-ink-700 max-w-3xl mx-auto leading-relaxed">
            La valutazione rappresenta il punto di partenza di un intervento e funge da contenitore dinamico delle analisi che sceglierai di eseguire tra Analisi di Impatto, Analisi Costi-Benefici e Analisi ESG.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-0 border border-ink-200">
            {COLUMNS.map((col, i) => (
              <div key={col.title} className={`bg-white px-6 py-7 ${i < 2 ? "border-r border-ink-200" : ""}`}>
                <div className="w-full h-[3px] bg-brand-violet mb-5" />
                <h2 className="text-base font-bold text-ink-900 mb-5">{col.title}</h2>
                <ul className="space-y-4">
                  {col.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle />
                      <span className="text-sm text-ink-700 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
                {col.note && (
                  <p className="mt-5 text-[10px] font-bold uppercase tracking-wide text-ink-400">{col.note}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full-width purple footer CTA */}
      <div className="flex-shrink-0 bg-brand-violet h-14">
        <button
          type="button"
          onClick={onContinua}
          className="w-full h-full flex items-center justify-between px-10 text-white text-sm font-semibold hover:bg-brand-violet-dark transition-colors"
        >
          <span>Inizia la configurazione</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
