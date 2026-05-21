import { useMemo, useState } from "react";

// ── Question definitions ─────────────────────────────────────────────────────

const QUESTIONS = [
  // Environmental — Uso delle risorse e del territorio
  {
    id: "soil_dual",
    section: "environmental",
    subsection: "Uso delle risorse e del territorio",
    type: "numeric-dual",
    title: "Stiamo cercando di capire se, e quanto, il progetto consuma nuovo suolo o lo rende impermeabile.",
    description: "Rientrano in questa analisi:\n• Le aree che cambiano funzione (es. un prato trasformato in un parcheggio)\n• Le superfici coperte con materiali che impediscono all'acqua di filtrare (es. asfalto, cemento)\n\nDovrai indicare solo ciò che dipende direttamente dal tuo progetto.\nModifiche pregresse o realizzate da altri soggetti non vanno considerate.",
    inputs: [
      { id: "soil_area_changed", label: "Superficie oggetto di cambiamento d'uso del suolo e/o impermeabilizzata", suffix: "kmq2", hint: "Valore numerico" },
      { id: "soil_area_total", label: "Superficie totale", suffix: "kmq2", hint: "Valore numerico" },
    ],
  },
  {
    id: "water_consumption",
    section: "environmental",
    subsection: "Uso delle risorse e del territorio",
    type: "numeric",
    title: "Qual è il consumo idrico stimato del progetto nella fase operativa?",
    description: "Indica il volume d'acqua necessario al funzionamento del progetto su base annua. Includi tutti gli usi: irrigazione, processi produttivi, usi sanitari.",
    suffix: "m³/anno",
    hint: "Valore numerico",
  },
  {
    id: "materials_local",
    section: "environmental",
    subsection: "Uso delle risorse e del territorio",
    type: "radio",
    title: "I materiali da costruzione saranno prevalentemente di provenienza locale o regionale?",
    description: "Considera la distanza di approvvigionamento dei principali materiali. Per \"locale\" si intende un raggio di trasporto inferiore a 250 km.",
    options: [
      { value: "Si", label: "Sì", description: "la maggior parte dei materiali sarà approvvigionata localmente" },
      { value: "Parziale", label: "In parte", description: "solo una quota dei materiali proviene da fornitori locali" },
      { value: "No", label: "No", description: "i materiali hanno prevalentemente provenienza extra-regionale" },
    ],
  },
  // Environmental — Emissioni e innovazione
  {
    id: "impact",
    section: "environmental",
    subsection: "Emissioni e innovazione",
    type: "multi-carousel",
    title: "Quali effetti sull'ambiente e le persone si vuole ridurre con soluzioni progettuali?",
    description: "Sono state previste misure per ridurre uno o più dei seguenti impatti causati dall'opera?",
    hint: "Risposta multipla",
    options: [
      "Rumore (impatto acustico)",
      "Luci eccessive o abbaglianti (emissioni luminose)",
      "Vibrazioni",
      "Odori sgradevoli (impatto odorigeno)",
      "Emissioni di polveri o particolato",
      "Inquinamento luminoso notturno",
      "Effetti sul microclima urbano",
      "Nessuno di questi impatti è stato considerato",
    ],
  },
  {
    id: "energy_efficiency",
    section: "environmental",
    subsection: "Emissioni e innovazione",
    type: "radio",
    title: "Il progetto include misure specifiche di efficienza energetica?",
    description: "Rientrano in questa categoria: isolamento termico, illuminazione LED, sistemi di recupero del calore, ottimizzazione dei consumi nelle fasi di esercizio.",
    options: [
      { value: "Si", label: "Sì", description: "sono previste misure di efficienza energetica nel progetto" },
      { value: "No", label: "No", description: "non sono state pianificate misure specifiche di efficienza" },
    ],
  },
  {
    id: "carbon_reduction",
    section: "environmental",
    subsection: "Emissioni e innovazione",
    type: "radio",
    title: "Il progetto contribuisce alla riduzione delle emissioni di CO₂ o gas serra?",
    description: "Considera sia le emissioni evitate durante la fase operativa (es. minor consumo energetico), sia eventuali misure di compensazione previste.",
    options: [
      { value: "Si", label: "Sì", description: "il progetto riduce attivamente le emissioni di gas serra" },
      { value: "No", label: "No", description: "non sono previsti interventi specifici di riduzione emissioni" },
    ],
  },
  // Environmental — Economia circolare e rifiuti
  {
    id: "waste_reduction",
    section: "environmental",
    subsection: "Economia circolare e rifiuti",
    type: "radio",
    title: "Sono previste misure per la riduzione e il recupero dei rifiuti prodotti in fase di cantiere?",
    description: "Includi piani di gestione dei materiali di scavo, demolizione selettiva, riuso di inerti o altri materiali da costruzione.",
    options: [
      { value: "Si", label: "Sì", description: "è previsto un piano specifico di gestione e riduzione dei rifiuti" },
      { value: "No", label: "No", description: "non sono previste misure particolari per la gestione dei rifiuti" },
    ],
  },
  {
    id: "lifecycle_assessment",
    section: "environmental",
    subsection: "Economia circolare e rifiuti",
    type: "radio",
    title: "È prevista una valutazione del ciclo di vita (LCA) dei materiali utilizzati?",
    description: "La LCA misura l'impatto ambientale complessivo di un materiale dalla produzione allo smaltimento. È uno strumento chiave per le scelte di progettazione sostenibile.",
    options: [
      { value: "Si", label: "Sì", description: "sarà condotta un'analisi LCA per i principali materiali" },
      { value: "No", label: "No", description: "non è prevista una valutazione LCA" },
    ],
  },
  // Environmental — Mitigazione dei rischi ambientali
  {
    id: "climate_risk",
    section: "environmental",
    subsection: "Mitigazione dei rischi ambientali",
    type: "radio",
    title: "Il progetto tiene conto dei rischi legati al cambiamento climatico nella sua progettazione?",
    description: "Considera rischi come alluvioni, siccità, ondate di calore, erosione. Il progetto include misure di adattamento o di resilienza climatica?",
    options: [
      { value: "Si", label: "Sì", description: "il progetto integra misure di adattamento al cambiamento climatico" },
      { value: "No", label: "No", description: "i rischi climatici non sono stati considerati nella progettazione" },
    ],
  },
  {
    id: "biodiversity",
    section: "environmental",
    subsection: "Mitigazione dei rischi ambientali",
    type: "radio",
    title: "Sono previste misure specifiche per la tutela della biodiversità nell'area di intervento?",
    description: "Misure come corridoi ecologici, rinaturalizzazione di superfici, piantumazione di specie autoctone, protezione di habitat esistenti.",
    options: [
      { value: "Si", label: "Sì", description: "il progetto include misure di protezione e promozione della biodiversità" },
      { value: "No", label: "No", description: "non sono previste misure specifiche per la biodiversità" },
    ],
  },
  // Social — Impatto sociale e occupazione
  {
    id: "users",
    section: "social",
    subsection: "Impatto sociale e occupazione",
    type: "numeric",
    title: "Quanti utenti o cittadini beneficiari sono attesi dal progetto?",
    description: "Indica il numero di persone che beneficeranno direttamente dei servizi o delle infrastrutture realizzate, su base annua.",
    suffix: "persone",
    hint: "Valore numerico",
  },
  {
    id: "employment",
    section: "social",
    subsection: "Impatto sociale e occupazione",
    type: "radio",
    title: "Il progetto genera occupazione stabile e duratura nel territorio?",
    description: "Considera sia i posti di lavoro diretti nella fase di esercizio, sia l'effetto di indotto su attività economiche locali.",
    options: [
      { value: "Si", label: "Sì", description: "il progetto crea occupazione stabile durante la fase operativa" },
      { value: "No", label: "No", description: "non sono previsti effetti occupazionali significativi" },
    ],
  },
  {
    id: "fte_generated",
    section: "social",
    subsection: "Impatto sociale e occupazione",
    type: "numeric",
    title: "Quanti FTE equivalenti sono stimati, includendo effetti diretti, indiretti e indotti?",
    description: "Indica il totale di Full Time Equivalent (FTE) generati dal progetto considerando l'intera filiera economica attivata.",
    suffix: "FTE",
    hint: "Valore numerico",
    hintFromEia: true,
  },
  // Social — Accessibilità e inclusione
  {
    id: "accessibility",
    section: "social",
    subsection: "Accessibilità e inclusione",
    type: "radio",
    title: "Il progetto migliora l'accessibilità per persone con disabilità o mobilità ridotta?",
    description: "Considera l'adeguamento a standard di accessibilità universale: abbattimento di barriere architettoniche, percorsi tattili, ascensori, rampe.",
    options: [
      { value: "Si", label: "Sì", description: "il progetto include interventi specifici per l'accessibilità universale" },
      { value: "No", label: "No", description: "non sono previsti interventi specifici per l'accessibilità" },
    ],
  },
  {
    id: "gender_equity",
    section: "social",
    subsection: "Accessibilità e inclusione",
    type: "radio",
    title: "Il progetto include misure specifiche per l'equità di genere o l'inclusione sociale?",
    description: "Rientrano in questa categoria: politiche di pari opportunità nell'appalto, progettazione gender-sensitive, servizi dedicati a gruppi sottorappresentati.",
    options: [
      { value: "Si", label: "Sì", description: "sono previste misure esplicite per l'equità di genere e l'inclusione" },
      { value: "No", label: "No", description: "non sono previste misure specifiche in questo ambito" },
    ],
  },
  {
    id: "vulnerable_groups",
    section: "social",
    subsection: "Accessibilità e inclusione",
    type: "radio",
    title: "Il progetto raggiunge specificamente gruppi vulnerabili o in condizione di svantaggio?",
    description: "Considera anziani, minori, persone con disabilità, migranti, persone in povertà o esclusione sociale.",
    options: [
      { value: "Si", label: "Sì", description: "il progetto è progettato anche per raggiungere gruppi vulnerabili" },
      { value: "No", label: "No", description: "i gruppi vulnerabili non sono specificamente considerati" },
    ],
  },
  // Governance — Trasparenza e rendicontazione
  {
    id: "monitoring",
    section: "governance",
    subsection: "Trasparenza e rendicontazione",
    type: "radio",
    title: "È previsto un sistema strutturato di monitoraggio e rendicontazione degli esiti del progetto?",
    description: "Il sistema dovrebbe includere indicatori misurabili, frequenza di rilevazione e un responsabile della raccolta dati.",
    options: [
      { value: "Si", label: "Sì", description: "è previsto un sistema formale di monitoraggio degli indicatori" },
      { value: "No", label: "No", description: "non è stato definito un sistema di monitoraggio strutturato" },
    ],
  },
  {
    id: "transparency",
    section: "governance",
    subsection: "Trasparenza e rendicontazione",
    type: "radio",
    title: "Sono previsti report periodici pubblici sui risultati e l'andamento del progetto?",
    description: "Include pubblicazioni su portali istituzionali, rendiconti periodici agli stakeholder, o report di sostenibilità accessibili ai cittadini.",
    options: [
      { value: "Si", label: "Sì", description: "saranno prodotti e pubblicati report periodici accessibili al pubblico" },
      { value: "No", label: "No", description: "non sono previsti report pubblici specifici" },
    ],
  },
  {
    id: "documents",
    section: "governance",
    subsection: "Trasparenza e rendicontazione",
    type: "radio",
    title: "È disponibile documentazione tecnica a supporto di tutte le dichiarazioni ESG del progetto?",
    description: "Include studi ambientali, valutazioni di impatto, relazioni tecniche o qualsiasi documento che verifichi le affermazioni fatte.",
    options: [
      { value: "Si", label: "Sì", description: "tutta la documentazione di supporto è disponibile e verificabile" },
      { value: "No", label: "No", description: "la documentazione non è ancora disponibile o completa" },
    ],
  },
  // Governance — Stakeholder e partecipazione
  {
    id: "stakeholder_consult",
    section: "governance",
    subsection: "Stakeholder e partecipazione",
    type: "radio",
    title: "È stata condotta o è prevista una consultazione formale con gli stakeholder del territorio?",
    description: "Rientrano in questa categoria: audizioni pubbliche, tavoli di lavoro con enti locali, consultazioni online, workshop partecipativi con cittadini o associazioni.",
    options: [
      { value: "Si", label: "Sì", description: "è previsto o è già stato avviato un percorso di consultazione formale" },
      { value: "No", label: "No", description: "non è prevista una consultazione formale degli stakeholder" },
    ],
  },
  {
    id: "sensitive_area",
    section: "governance",
    subsection: "Stakeholder e partecipazione",
    type: "radio",
    title: "L'intervento riguarda aree naturali particolarmente sensibili?",
    description: "Il progetto si svolge dentro o vicino a parchi naturali, riserve, zone protette o aree dove è presente una biodiversità importante?",
    options: [
      { value: "Si", label: "Sì", description: "prenderà luogo vicino ad aree naturali sensibili" },
      { value: "No", label: "No", description: "non saranno coinvolte aree sensibili" },
    ],
  },
];

const SECTIONS = [
  {
    id: "environmental",
    label: "Environmental",
    subsections: ["Uso delle risorse e del territorio", "Emissioni e innovazione", "Economia circolare e rifiuti", "Mitigazione dei rischi ambientali"],
  },
  {
    id: "social",
    label: "Social",
    subsections: ["Impatto sociale e occupazione", "Accessibilità e inclusione"],
  },
  {
    id: "governance",
    label: "Governance",
    subsections: ["Trasparenza e rendicontazione", "Stakeholder e partecipazione"],
  },
];

function isAnswered(q, answers) {
  if (q.type === "numeric-dual") return q.inputs.every((inp) => answers[inp.id] != null && answers[inp.id] !== "");
  if (q.type === "multi-carousel") return (answers[q.id] || []).length > 0;
  return answers[q.id] != null && answers[q.id] !== "";
}

function buildDefaultAnswers(eiaResults) {
  const fte = Math.round(eiaResults?.fte?.totale ?? 50);
  return {
    soil_area_changed: "", soil_area_total: "",
    water_consumption: "", materials_local: "",
    impact: [],
    energy_efficiency: "", carbon_reduction: "",
    waste_reduction: "", lifecycle_assessment: "",
    climate_risk: "", biodiversity: "",
    users: "", employment: "",
    fte_generated: String(fte),
    accessibility: "", gender_equity: "", vulnerable_groups: "",
    monitoring: "", transparency: "", documents: "",
    stakeholder_consult: "", sensitive_area: "",
  };
}

// ── Sidebar ──────────────────────────────────────────────────────────────────

function EsgSidebar({ currentSection, currentSubsection, questionIdx }) {
  return (
    <aside className="w-[260px] shrink-0 overflow-y-auto border-r border-[#ececec] bg-white px-5 py-7">
      {SECTIONS.map((sec) => {
        const secIdx = SECTIONS.findIndex((s) => s.id === sec.id);
        const currentSecIdx = SECTIONS.findIndex((s) => s.id === currentSection);
        const isActive = sec.id === currentSection;
        const isPast = secIdx < currentSecIdx;
        const isDone = isPast;

        return (
          <div key={sec.id} className="mb-7">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  isActive ? "bg-brand-violet" : isDone ? "bg-brand-violet" : "bg-[#dcdce1]"
                }`}
              >
                {isDone ? (
                  <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : isActive ? (
                  <span className="h-3 w-3 rounded-full bg-white" />
                ) : null}
              </div>
              <div className="flex min-w-0 flex-1 items-center justify-between">
                <span className={`text-[15px] font-bold ${isActive ? "text-ink-900" : "text-ink-300"}`}>{sec.label}</span>
                {isDone && !isActive ? (
                  <svg className="h-4 w-4 shrink-0 text-ink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                ) : null}
              </div>
            </div>

            {isActive ? (
              <div className="ml-[18px] mt-4 space-y-5 border-l border-[#ececec] pl-5">
                {sec.subsections.map((subsec) => {
                  const subsecQuestions = QUESTIONS.filter((q) => q.subsection === subsec);
                  const isCurrentSub = subsec === currentSubsection;
                  return (
                    <div key={subsec}>
                      <p className={`mb-2 text-[12px] leading-tight ${isCurrentSub ? "font-semibold text-ink-900" : "text-ink-600"}`}>
                        {subsec}
                      </p>
                      <div className="flex gap-1">
                        {subsecQuestions.map((q) => {
                          const globalIdx = QUESTIONS.findIndex((gq) => gq.id === q.id);
                          const fill = globalIdx < questionIdx ? 1 : globalIdx === questionIdx ? 0.5 : 0;
                          return (
                            <div key={q.id} className="h-[5px] flex-1 overflow-hidden bg-[#e7e7ea]">
                              <div className="h-full bg-brand-violet transition-[width] duration-300" style={{ width: `${fill * 100}%` }} />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        );
      })}
    </aside>
  );
}

// ── Multi-carousel ───────────────────────────────────────────────────────────

const COLS = 5;

function MultiCarousel({ options, selected, onToggle, offset, setOffset }) {
  const visible = options.slice(offset, offset + COLS);
  const canPrev = offset > 0;
  const canNext = offset + COLS < options.length;
  const pages = Math.max(1, Math.ceil(options.length / COLS));
  const currentPage = Math.floor(offset / COLS);

  return (
    <div className="max-w-[960px]">
      <div className="mb-3 flex items-center justify-end gap-2 pr-3">
        {Array.from({ length: pages }).map((_, i) => (
          <span key={i} className={`h-[3px] transition-all ${i === currentPage ? "w-6 bg-brand-violet" : "w-4 bg-[#d8d8de]"}`} />
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => canPrev && setOffset((o) => o - COLS)}
          className={`flex h-10 w-10 shrink-0 items-center justify-center text-[30px] leading-none ${canPrev ? "text-ink-400 hover:text-ink-700" : "cursor-default text-[#e0e0e0]"}`}
        >
          &lsaquo;
        </button>
        <div className="grid flex-1 gap-3" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
          {visible.map((opt) => {
            const checked = selected.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onToggle(opt)}
                className={`flex min-h-[140px] flex-col items-start justify-between bg-white px-4 py-4 text-left transition-colors ${
                  checked ? "border-[3px] border-brand-violet" : "border border-[#ececec] hover:border-ink-300"
                }`}
              >
                <span className="flex-1 text-[13px] font-semibold leading-[1.35] text-ink-900">{opt}</span>
                <div
                  className={`mt-3 flex h-6 w-6 shrink-0 items-center justify-center border-2 ${
                    checked ? "border-brand-violet bg-brand-violet" : "border-ink-300 bg-white"
                  }`}
                >
                  {checked ? (
                    <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => canNext && setOffset((o) => o + COLS)}
          className={`flex h-10 w-10 shrink-0 items-center justify-center text-[30px] leading-none ${canNext ? "text-brand-violet hover:text-brand-violet-dark" : "cursor-default text-[#e0e0e0]"}`}
        >
          &rsaquo;
        </button>
      </div>
    </div>
  );
}

// ── Question view ────────────────────────────────────────────────────────────

function QuestionView({ question, answers, carouselOffset, setCarouselOffset, onSetAnswer, onToggleMulti, eiaResults }) {
  return (
    <div>
      <h2 className="max-w-3xl text-[22px] font-bold leading-[1.2] text-ink-900">{question.title}</h2>
      {question.description ? (
        <p className="mt-3 max-w-2xl whitespace-pre-line text-[14px] leading-[1.55] text-ink-900">{question.description}</p>
      ) : null}
      {question.hint ? (
        <p className="mt-4 text-[14px] font-semibold text-ink-900">{question.hint}</p>
      ) : null}

      <div className="mt-6">
        {question.type === "numeric-dual" ? (
          <div className="space-y-4">
            {question.inputs.map((inp) => (
              <div key={inp.id} className="border border-ink-100 bg-white p-5">
                <label className="text-[15px] font-semibold text-ink-900">{inp.label}</label>
                {inp.hint ? <p className="mt-1 text-[13px] text-ink-400">{inp.hint}</p> : null}
                <div className="mt-3 flex items-center gap-3">
                  <input
                    value={answers[inp.id] ?? ""}
                    onChange={(e) => onSetAnswer(inp.id, e.target.value.replace(/[^\d.]/g, ""))}
                    placeholder="0"
                    className="h-10 w-[180px] border border-ink-200 bg-white px-3 text-[14px] text-ink-900 focus:border-brand-violet focus:outline-none"
                  />
                  <span className="text-[14px] font-semibold text-ink-600">{inp.suffix}</span>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {question.type === "numeric" ? (
          <div className="border border-ink-100 bg-white p-5">
            {question.hintFromEia && eiaResults ? (
              <p className="mb-3 text-[13px] font-medium text-brand-violet">
                Suggerito dall'analisi EIA: <strong>{Math.round(eiaResults.fte?.totale ?? 0)} FTE</strong>
              </p>
            ) : null}
            {question.hint ? <p className="mb-2 text-[13px] text-ink-400">{question.hint}</p> : null}
            <div className="flex items-center gap-3">
              <input
                value={answers[question.id] ?? ""}
                onChange={(e) => onSetAnswer(question.id, e.target.value.replace(/[^\d.]/g, ""))}
                placeholder="0"
                className="h-10 w-[180px] border border-ink-200 bg-white px-3 text-[14px] text-ink-900 focus:border-brand-violet focus:outline-none"
              />
              <span className="text-[14px] font-semibold text-ink-600">{question.suffix}</span>
            </div>
          </div>
        ) : null}

        {question.type === "radio" ? (
          <div className="max-w-3xl space-y-2">
            {question.options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onSetAnswer(question.id, opt.value)}
                className={`flex w-full items-center gap-4 bg-white px-5 py-4 text-left transition-colors ${
                  answers[question.id] === opt.value ? "border-2 border-brand-violet" : "border border-ink-200 hover:border-ink-300"
                }`}
              >
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                    answers[question.id] === opt.value ? "border-brand-violet" : "border-ink-400"
                  }`}
                >
                  {answers[question.id] === opt.value ? <div className="h-3 w-3 rounded-full bg-brand-violet" /> : null}
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-ink-900">{opt.label}</p>
                  {opt.description ? <p className="mt-0.5 text-[13px] text-ink-600">{opt.description}</p> : null}
                </div>
              </button>
            ))}
          </div>
        ) : null}

        {question.type === "multi-carousel" ? (
          <MultiCarousel
            options={question.options}
            selected={answers[question.id] || []}
            onToggle={(opt) => onToggleMulti(question.id, opt)}
            offset={carouselOffset}
            setOffset={setCarouselOffset}
          />
        ) : null}
      </div>

      {/* File upload */}
      <div className="mt-8 max-w-3xl">
        <p className="mb-3 text-[14px] font-semibold text-ink-900">Allega eventuale documentazione a supporto (opzionale)</p>
        <div className="flex flex-col items-center border-2 border-dashed border-brand-violet/30 bg-white px-6 py-8 text-center">
          <svg className="h-10 w-10 text-brand-violet" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
          <button type="button" className="mt-3 text-[14px] font-semibold text-brand-violet underline">
            Carica documento di supporto
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export function EsgQuestionnaire({ project, eiaResults, initialAnswers, onClose, onComplete }) {
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState(() => initialAnswers ?? buildDefaultAnswers(eiaResults));
  const [carouselOffset, setCarouselOffset] = useState(0);

  const question = QUESTIONS[questionIdx];
  const isLast = questionIdx === QUESTIONS.length - 1;

  const canProceed = isAnswered(question, answers);

  function setAnswer(id, value) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }
  function toggleMulti(id, option) {
    setAnswers((prev) => {
      const cur = prev[id] || [];
      const next = cur.includes(option) ? cur.filter((x) => x !== option) : [...cur, option];
      return { ...prev, [id]: next };
    });
  }

  function handleNext() {
    if (!canProceed) return;
    if (isLast) {
      const changed = Number(answers.soil_area_changed) || 0;
      const total = Number(answers.soil_area_total) || 1;
      const soil_pct = String(Math.min(100, Math.round((changed / total) * 100)));
      onComplete({ ...answers, soil_pct });
      return;
    }
    setQuestionIdx((i) => i + 1);
    setCarouselOffset(0);
  }

  function handleBack() {
    if (questionIdx === 0) { onClose(); return; }
    setQuestionIdx((i) => i - 1);
    setCarouselOffset(0);
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg-page">
      <div className="h-[3px] flex-shrink-0 bg-accent-lime" />
      <div className="flex h-16 flex-shrink-0 items-center justify-end border-b border-ink-100 bg-white px-8">
        <button type="button" onClick={onClose} className="flex items-center gap-2 text-[14px] font-semibold text-brand-violet">
          Chiudi e torna al dettaglio progetto
          <span className="text-[20px] leading-none">&times;</span>
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <EsgSidebar
          currentSection={question.section}
          currentSubsection={question.subsection}
          questionIdx={questionIdx}
        />

        <div className="flex-1 overflow-y-auto">
          <div className="px-8 py-8">
            <QuestionView
              question={question}
              answers={answers}
              carouselOffset={carouselOffset}
              setCarouselOffset={setCarouselOffset}
              onSetAnswer={setAnswer}
              onToggleMulti={toggleMulti}
              eiaResults={eiaResults}
            />
          </div>
        </div>
      </div>

      <div className="grid h-16 flex-shrink-0 grid-cols-2">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center justify-between bg-[#5a5a5a] px-6 text-[14px] font-medium text-white"
        >
          <span>{questionIdx === 0 ? "Torna al dettaglio progetto" : "Torna allo step precedente"}</span>
          <span className="text-[22px] leading-none">&larr;</span>
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed}
          className={`flex items-center justify-between px-6 text-[14px] font-medium ${
            canProceed ? "bg-brand-violet text-white" : "cursor-not-allowed bg-ink-100 text-ink-300"
          }`}
        >
          <span>{isLast ? "Procedi all'esecuzione dell'analisi" : "Vai allo step successivo"}</span>
          <span className="text-[22px] leading-none">&rarr;</span>
        </button>
      </div>
    </div>
  );
}
