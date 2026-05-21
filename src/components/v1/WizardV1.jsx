import { useMemo, useRef, useState } from "react";
import { LeafletMap } from "../map/LeafletMap";
import { findNearest, geocodeAddress } from "../../lib/geocoding";

const SETTORI_DATA = {
  "Infrastrutture sociali": {
    nace: "F41.20",
    sottosettori: {
      "Istruzione e formazione": ["Scuole e asili", "Universita e ricerca", "Formazione professionale", "Servizi integrativi"],
      "Sanita e assistenza": ["Ospedali e cliniche", "Strutture per anziani", "Centri di salute", "Assistenza domiciliare"],
      "Cultura e sport": ["Biblioteche e musei", "Impianti sportivi", "Spazi culturali", "Teatri e auditorium"],
      "Edilizia residenziale pubblica": ["Riqualificazione alloggi", "Nuova costruzione ERP", "Manutenzione straordinaria"],
    },
  },
  "Infrastrutture di trasporto": {
    nace: "F42.11",
    sottosettori: {
      "Strade e autostrade": ["Nuova viabilita", "Adeguamento e manutenzione", "Sicurezza stradale", "Gallerie e ponti"],
      "Ferrovie e metropolitane": ["Linee ferroviarie", "Metropolitane e tram", "Stazioni e interscambi", "Alta velocita"],
      "Porti e aeroporti": ["Infrastrutture portuali", "Piste e terminal aeroportuali", "Logistica e magazzini"],
      "Mobilita urbana": ["Piste ciclabili", "ZTL e aree pedonali", "Parcheggi e nodi di scambio", "Bus rapid transit"],
    },
  },
  "Infrastrutture ambientali e risorse idriche": {
    nace: "E36.00",
    sottosettori: {
      "Risorse idriche e acque reflue": ["Reti fognarie", "Reti idriche urbane", "Corpi idrici: Miglioramento della qualita", "Impianti depurazione acque", "Reti idriche rurali"],
      "Difesa del suolo e prevenzione": ["Protezione idrogeologica", "Bonifica siti inquinati", "Gestione alluvioni", "Stabilizzazione versanti"],
      "Valorizzazione dell'ambiente": ["Parchi e aree naturali", "Biodiversita e ecosistemi", "Paesaggio rurale"],
      "Smaltimento rifiuti": ["Raccolta differenziata", "Compostaggio e digestione anaerobica", "Termovalorizzatori"],
    },
  },
  "Attivita produttive, ricerca e impresa sociale": {
    nace: "M72.19",
    sottosettori: {
      "Ricerca e sviluppo": ["Laboratori e centri di ricerca", "Incubatori di imprese", "Trasferimento tecnologico"],
      "Impresa sociale e terzo settore": ["Cooperative sociali", "Fondazioni e ONG", "Inserimento lavorativo"],
      "Zone economiche speciali": ["Aree industriali", "Poli produttivi integrati", "Distretti tecnologici"],
    },
  },
  "Telecomunicazioni e tecnologie informatiche": {
    nace: "J61.10",
    sottosettori: {
      "Reti a banda larga": ["Fibra ottica FTTH", "Fibra ottica FTTC", "Connettivita rurale e montana"],
      "Infrastrutture digitali pubbliche": ["Cloud PA", "Cybersecurity pubblica", "Servizi digitali ai cittadini"],
      "Smart city": ["Sensori e IoT urbano", "Mobilita connessa", "Illuminazione intelligente"],
    },
  },
};

const STATI = ["In preparazione", "In approvazione", "Approvato"];
const STATO_DESCRIPTIONS = {
  "In preparazione":
    "Il progetto e allo stadio iniziale: si raccolgono dati, si definiscono obiettivi e si impostano i primi elementi tecnici ed economici.",
  "In approvazione":
    "Il progetto e stato predisposto e presentato agli organi competenti ed e in attesa di autorizzazione o parere.",
  Approvato: "Il progetto ha ottenuto l'approvazione formale necessaria e puo procedere verso le fasi attuative ed esecutive.",
};
const SETTORI = Object.keys(SETTORI_DATA);
const TIPI = ["Nuova realizzazione", "Ristrutturazione", "Recupero", "Manutenzione", "Efficientamento"];
const ANNI = ["2025", "2026", "2027", "2028", "2029", "2030", "2031"];
const TASSO_DEFAULT = "3,5";

const STEPS = [
  { id: "nome", group: 0, sublabel: "Anagrafica" },
  { id: "descrizione", group: 0, sublabel: "Anagrafica" },
  { id: "stato", group: 0, sublabel: "Stato" },
  { id: "classificazione", group: 0, sublabel: "Classificazione intervento" },
  { id: "durata", group: 1, sublabel: "Durata del progetto" },
  { id: "localizzazione", group: 1, sublabel: "Localizzazione" },
  { id: "anno", group: 2, sublabel: "Anno di attualizzazione" },
  { id: "capex", group: 2, sublabel: "Capex" },
  { id: "opex", group: 2, sublabel: "Opex" },
];

const GROUPS = [
  { label: "Profilazione", sublabels: ["Anagrafica", "Stato", "Classificazione intervento"] },
  { label: "Contesto operativo", sublabels: ["Durata del progetto", "Localizzazione"] },
  { label: "Parametri economici", sublabels: ["Anno di attualizzazione", "Capex", "Opex"] },
];

function getSottosettori(settore) {
  return Object.keys(SETTORI_DATA[settore]?.sottosettori ?? {});
}

function getCategorie(settore, sotto) {
  return SETTORI_DATA[settore]?.sottosettori[sotto] ?? [];
}

function getAllCategorie() {
  return Object.entries(SETTORI_DATA).flatMap(([settore, settoreData]) =>
    Object.entries(settoreData.sottosettori).flatMap(([sotto_settore, categorie]) =>
      categorie.map((categoria) => ({
        settore,
        sotto_settore,
        categoria,
        nace_code: settoreData.nace,
      })),
    ),
  );
}

function getSidebarProgressMap(stepIdx) {
  const currentSublabel = STEPS[stepIdx].sublabel;
  const currentGroup = STEPS[stepIdx].group;

  return Object.fromEntries(
    GROUPS.flatMap((group, groupIndex) =>
      group.sublabels.map((label) => {
        const labelFirstStep = STEPS.findIndex((step) => step.sublabel === label);
        const labelGroup = STEPS[labelFirstStep]?.group;

        if (labelGroup !== currentGroup) {
          return [label, labelGroup < currentGroup ? 1 : 0];
        }

        if (label === currentSublabel) {
          return [label, 0.5];
        }

        return [label, labelFirstStep < stepIdx ? 1 : 0];
      }),
    ),
  );
}

function digitsOnly(value) {
  return value.replace(/[^\d]/g, "");
}

function fmt(value) {
  const n = Number(value);
  return !value || Number.isNaN(n) ? value ?? "" : new Intl.NumberFormat("it-IT").format(n);
}

function normalizeRateInput(value) {
  const cleaned = value.replace(/[^\d.,]/g, "").replace(".", ",");
  const parts = cleaned.split(",");
  if (parts.length <= 1) return cleaned;
  return `${parts[0]},${parts.slice(1).join("")}`;
}

function normalizePercentInput(value) {
  const cleaned = value.replace(/[^\d.,]/g, "").replace(".", ",");
  const parts = cleaned.split(",");
  const normalized = parts.length <= 1 ? cleaned : `${parts[0]},${parts.slice(1).join("")}`;
  const numeric = Number(normalized.replace(",", "."));
  if (Number.isNaN(numeric)) return normalized;
  return numeric > 100 ? "100" : normalized;
}

function yearRangeFromDates(startDate, endDate) {
  const startYear = new Date(startDate).getFullYear();
  const endYear = new Date(endDate).getFullYear();
  if (Number.isNaN(startYear) || Number.isNaN(endYear)) return [];
  const from = Math.min(startYear, endYear);
  const to = Math.max(startYear, endYear);
  return Array.from({ length: to - from + 1 }, (_, index) => String(from + index));
}

function buildCapexDistribution(years, existing = {}) {
  if (!years.length) return {};
  const evenShare = (100 / years.length).toFixed(1).replace(".0", "");
  return years.reduce((acc, year) => {
    acc[year] = existing[year] ?? evenShare;
    return acc;
  }, {});
}

function buildOpexDistribution(years, existing = {}) {
  return years.reduce((acc, year) => {
    acc[year] = existing[year] ?? "";
    return acc;
  }, {});
}

function sumPercentageValues(distribution, years) {
  return years.reduce((total, year) => total + (Number(String(distribution?.[year] ?? "").replace(",", ".")) || 0), 0);
}

function percentageToAmount(baseAmount, percentValue) {
  const base = Number(String(baseAmount ?? "").replace(/\./g, "").replace(",", ".")) || 0;
  const percent = Number(String(percentValue ?? "").replace(",", ".")) || 0;
  return (base * percent) / 100;
}

function sumOpexDistribution(distribution, years) {
  return years.reduce((total, year) => total + (Number(String(distribution?.[year] ?? "").replace(",", ".")) || 0), 0);
}

function isDirty(a, b) {
  return JSON.stringify(a) !== JSON.stringify(b);
}

function buildDraft(project) {
  const conf = project.configurazione ?? {};
  const settore = conf.settore || "";
  const sottosettori = getSottosettori(settore);
  const sotto = settore && sottosettori.includes(conf.sotto_settore) ? conf.sotto_settore : "";
  const categorie = getCategorie(settore, sotto);
  const categoria = sotto && categorie.includes(conf.categoria_intervento) ? conf.categoria_intervento : "";

  return {
    nome: project.nome ?? "",
    cup: project.cup ?? "",
    descrizione: project.descrizione ?? "",
    stato: project.stato || STATI[0],
    settore,
    nace_code: conf.nace_code || SETTORI_DATA[settore]?.nace || "",
    sotto_settore: sotto,
    categoria_intervento: categoria,
    tipo_intervento: TIPI.includes(conf.tipo_intervento) ? conf.tipo_intervento : TIPI[0],
    data_inizio: conf.data_inizio || "2025-09-15",
    data_fine: conf.data_fine || "2032-09-15",
    localizzazione: conf.localizzazione ?? "",
    location_lat: conf.lat ?? null,
    location_lon: conf.lon ?? null,
    nuts_code: conf.nuts_code ?? "",
    nuts_label: conf.nuts_label ?? "",
    anno_attualizzazione: String(conf.anno_attualizzazione ?? 2025),
    tasso_attualizzazione: String(conf.tasso_attualizzazione ?? TASSO_DEFAULT),
    capex_distribuzione_attiva: Boolean(conf.capex_distribuzione_attiva),
    capex_distribuzione: conf.capex_distribuzione ?? {},
    opex_distribuzione: conf.opex_distribuzione ?? {},
    capex: String(conf.capex ?? ""),
    opex: String(conf.opex ?? ""),
    vita_utile: conf.vita_utile ?? 20,
  };
}

function toProject(draft, base) {
  const start = new Date(draft.data_inizio);
  const end = new Date(draft.data_fine);
  const years = Math.max(1, end.getFullYear() - start.getFullYear());

  return {
    ...base,
    nome: draft.nome,
    cup: draft.cup,
    descrizione: draft.descrizione,
    stato: draft.stato,
    configurazione: {
      ...base.configurazione,
      settore: draft.settore,
      nace_code: draft.nace_code,
      sotto_settore: draft.sotto_settore,
      categoria_intervento: draft.categoria_intervento,
      tipo_intervento: draft.tipo_intervento,
      durata_progetto: `${years} anni`,
      localizzazione: draft.localizzazione,
      lat: draft.location_lat,
      lon: draft.location_lon,
      nuts_code: draft.nuts_code,
      nuts_label: draft.nuts_label,
      anno_attualizzazione: Number(draft.anno_attualizzazione),
      tasso_attualizzazione: Number(String(draft.tasso_attualizzazione).replace(",", ".")),
      capex_distribuzione_attiva: draft.capex_distribuzione_attiva,
      capex_distribuzione: draft.capex_distribuzione,
      opex_distribuzione: draft.opex_distribuzione,
      capex: Number(draft.capex),
      opex: Number(draft.opex),
      vita_utile: Number(draft.vita_utile),
    },
  };
}

function Sidebar({ stepIdx }) {
  const currentGroup = STEPS[stepIdx].group;
  const sublabelProgress = getSidebarProgressMap(stepIdx);

  return (
    <aside className="w-[320px] shrink-0 border-r border-[#ececec] bg-white px-6 py-6">
      <div className="relative">
        <div className="absolute bottom-3 left-[18px] top-7 w-[3px] bg-[#ececec]" />
        {GROUPS.map((group, groupIndex) => {
          const isDone = groupIndex < currentGroup;
          const isActive = groupIndex === currentGroup;
          const stepGroupItems = STEPS.filter((step) => step.group === groupIndex);

          return (
            <div key={group.label} className="relative mb-9 grid grid-cols-[38px_minmax(0,1fr)] gap-x-4">
              <div className={`relative z-[1] flex h-[38px] w-[38px] items-center justify-center rounded-full ${isActive || isDone ? "bg-brand-violet" : "bg-[#dcdce1]"}`}>
                {isDone ? <span className="text-[10px] font-bold text-white">OK</span> : isActive ? <span className="h-3 w-3 rounded-full bg-white" /> : null}
              </div>
              <div className="flex min-h-[38px] items-center overflow-visible pt-1">
                <h3 className={`min-w-0 text-[17px] font-bold leading-tight ${isActive ? "text-ink-900" : "text-ink-300"}`}>{group.label}</h3>
              </div>

              {isActive ? (
                <div className="col-start-2 mt-5 space-y-4">
                  {group.sublabels.map((sublabel) => {
                    const rawProgress = sublabelProgress[sublabel] ?? 0;

                    return (
                      <div key={sublabel}>
                        <p className={`mb-2 text-[12px] leading-tight text-ink-900`}>{sublabel}</p>
                        <div className="h-[6px] w-full overflow-hidden bg-[#e7e7ea]">
                          <div className="h-full bg-brand-violet transition-[width] duration-300" style={{ width: `${Math.min(rawProgress, 1) * 100}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

function QuestionHeader({ title, description, type }) {
  return (
    <div className="mb-8">
      <h2 className="max-w-4xl text-[22px] font-bold leading-[1.2] text-ink-900">{title}</h2>
      {description ? <p className="mt-3 max-w-5xl text-[14px] leading-[1.5] text-ink-900">{description}</p> : null}
      {type ? <p className="mt-5 text-[14px] text-ink-900">{type}</p> : null}
    </div>
  );
}

function TextInput({ label, hint, value, onChange, placeholder, optional }) {
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-baseline gap-2">
        <label className="text-[14px] font-semibold text-ink-900">{label}</label>
        {optional ? <span className="text-xs text-ink-400">(opzionale)</span> : null}
      </div>
      {hint ? <p className="mb-2 text-xs text-ink-400">{hint}</p> : null}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full border border-ink-200 bg-white px-3 text-[14px] text-ink-900 placeholder:text-ink-300 focus:border-brand-violet focus:outline-none"
      />
    </div>
  );
}

function RadioCards({ options, value, onChange, descriptions }) {
  return (
    <div className="max-w-3xl space-y-3">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`flex w-full items-start gap-4 bg-white px-5 py-5 text-left transition-colors ${value === option ? "border-2 border-brand-violet" : "border border-ink-200 hover:border-ink-300"}`}
        >
          <div className={`mt-1 flex h-6 w-6 items-center justify-center rounded-full border-2 ${value === option ? "border-brand-violet" : "border-ink-400"}`}>
            {value === option ? <div className="h-3 w-3 rounded-full bg-brand-violet" /> : null}
          </div>
          <div>
            <p className="text-[15px] font-semibold text-ink-900">{option}</p>
            {descriptions?.[option] ? <p className="mt-1 text-[13px] leading-[1.45] text-ink-700">{descriptions[option]}</p> : null}
          </div>
        </button>
      ))}
    </div>
  );
}

function RadioList({ options, value, onChange }) {
  return (
    <div className="max-w-3xl overflow-hidden border border-ink-100 bg-white">
      {options.map((option, index) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`flex w-full items-center gap-3 px-5 py-4 text-left ${index < options.length - 1 ? "border-b border-ink-100" : ""} ${value === option ? "bg-brand-violet-soft" : "hover:bg-[#fafafa]"}`}
        >
          <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${value === option ? "border-brand-violet" : "border-ink-400"}`}>
            {value === option ? <div className="h-3 w-3 rounded-full bg-brand-violet" /> : null}
          </div>
          <span className="text-[14px] text-ink-900">{option}</span>
        </button>
      ))}
    </div>
  );
}

function CarouselCards({ options, value, onChange, cols = 5 }) {
  const [offset, setOffset] = useState(0);
  const pages = Math.max(1, Math.ceil(options.length / cols));
  const visible = options.slice(offset, offset + cols);
  const canPrev = offset > 0;
  const canNext = offset + cols < options.length;
  const currentPage = Math.floor(offset / cols);

  return (
    <div className="max-w-[980px]">
      <div className="mb-4 flex items-center justify-end gap-2 pr-3">
        {Array.from({ length: pages }).map((_, index) => (
          <span key={index} className={`h-1 ${index === currentPage ? "w-6 bg-brand-violet" : "w-4 bg-[#d8d8de]"}`} />
        ))}
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => canPrev && setOffset((item) => item - 1)}
          className={`flex h-10 w-10 items-center justify-center text-[28px] leading-none ${canPrev ? "text-ink-300 hover:text-ink-700" : "cursor-default text-[#dddddf]"}`}
          aria-label="Scorri indietro"
        >
          &lsaquo;
        </button>
        <div className="grid flex-1 gap-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {visible.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`flex min-h-[160px] flex-col items-center justify-between bg-white px-4 py-5 text-center ${value === option ? "border-[4px] border-brand-violet" : "border border-white hover:border-ink-200"}`}
            >
              <span className="flex flex-1 items-center justify-center text-[14px] font-semibold leading-[1.35] text-ink-900">{option}</span>
              <div className={`mt-4 flex h-8 w-8 items-center justify-center rounded-full border-2 ${value === option ? "border-brand-violet" : "border-ink-500"}`}>
                {value === option ? <div className="h-4 w-4 rounded-full bg-brand-violet" /> : null}
              </div>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => canNext && setOffset((item) => item + 1)}
          className={`flex h-10 w-10 items-center justify-center text-[28px] leading-none ${canNext ? "text-brand-violet hover:text-brand-violet-dark" : "cursor-default text-[#dddddf]"}`}
          aria-label="Scorri avanti"
        >
          &rsaquo;
        </button>
      </div>
    </div>
  );
}

function GuidedSection({ number, title, description, active = false, disabled = false, children }) {
  return (
    <section className={`border ${disabled ? "border-[#ededf1] bg-[#f7f7f9]" : active ? "border-brand-violet/35 bg-white" : "border-ink-100 bg-white"}`}>
      <div className="flex items-start gap-4 px-5 py-4">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${
            disabled ? "bg-[#d9d9df] text-white" : active ? "bg-brand-violet text-white" : "border border-brand-violet text-brand-violet"
          }`}
        >
          {number}
        </span>
        <div className="min-w-0 flex-1">
          <p className={`text-[15px] font-semibold ${disabled ? "text-ink-400" : "text-ink-900"}`}>{title}</p>
          <p className={`mt-1 text-[13px] leading-[1.5] ${disabled ? "text-ink-400" : "text-ink-600"}`}>{description}</p>
        </div>
      </div>
      {!disabled ? <div className="border-t border-[#ececf1] px-5 py-5">{children}</div> : null}
    </section>
  );
}

function SearchResultCard({ item, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`block w-full px-4 py-4 text-left ${selected ? "bg-brand-violet-soft" : "hover:bg-[#fafafa]"}`}
    >
      <p className="text-[14px] font-semibold text-ink-900">{item.categoria}</p>
      <p className="mt-1 text-[12px] leading-[1.45] text-ink-500">
        {item.settore} <span className="mx-1">/</span> {item.sotto_settore}
      </p>
    </button>
  );
}

export function WizardV1({ initialProject, onClose, onComplete }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [draft, setDraft] = useState(() => buildDraft(initialProject));
  const [categorySearch, setCategorySearch] = useState("");
  const [classificationRevealLevel, setClassificationRevealLevel] = useState(1);
  const geocodeTimerRef = useRef(null);
  const initialDraft = useMemo(() => buildDraft(initialProject), [initialProject]);
  const step = STEPS[stepIdx];
  const allCategorie = useMemo(() => getAllCategorie(), []);

  function update(field, value) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  function updateCapexDistribution(year, value) {
    setDraft((prev) => ({
      ...prev,
      capex_distribuzione: {
        ...prev.capex_distribuzione,
        [year]: normalizePercentInput(value),
      },
    }));
  }

  function updateOpexDistribution(year, value) {
    setDraft((prev) => {
      const nextDistribution = {
        ...prev.opex_distribuzione,
        [year]: normalizePercentInput(value),
      };
      const totalPercent = sumOpexDistribution(nextDistribution, projectYears);
      const total = percentageToAmount(prev.capex, totalPercent);

      return {
        ...prev,
        opex_distribuzione: nextDistribution,
        opex: String(total || ""),
      };
    });
  }

  function handleSettoreChange(settore) {
    const nace = SETTORI_DATA[settore]?.nace ?? "";
    setClassificationRevealLevel(2);
    setDraft((prev) => ({ ...prev, settore, nace_code: nace, sotto_settore: "", categoria_intervento: "", tipo_intervento: "" }));
  }

  function handleSottosettoreChange(sotto_settore) {
    setClassificationRevealLevel(3);
    setDraft((prev) => ({ ...prev, sotto_settore, categoria_intervento: "", tipo_intervento: "" }));
  }

  function handleCategoriaChange(categoria_intervento) {
    setClassificationRevealLevel(4);
    setDraft((prev) => ({ ...prev, categoria_intervento, tipo_intervento: "" }));
  }

  function handleCategoryDirectSelect(option) {
    setClassificationRevealLevel(4);
    setDraft((prev) => ({
      ...prev,
      settore: option.settore,
      nace_code: option.nace_code,
      sotto_settore: option.sotto_settore,
      categoria_intervento: option.categoria,
      tipo_intervento: "",
    }));
    setCategorySearch(option.categoria);
  }

  function handleAddressChange(value) {
    update("localizzazione", value);
    clearTimeout(geocodeTimerRef.current);
    geocodeTimerRef.current = setTimeout(() => {
      const result = geocodeAddress(value);
      if (result) {
        setDraft((prev) => ({
          ...prev,
          location_lat: result.lat,
          location_lon: result.lon,
          nuts_code: result.nuts_code,
          nuts_label: result.nuts_label,
        }));
      }
    }, 500);
  }

  function handleMapClick(lat, lon) {
    const geo = findNearest(lat, lon);
    setDraft((prev) => ({
      ...prev,
      location_lat: Math.round(lat * 10000) / 10000,
      location_lon: Math.round(lon * 10000) / 10000,
      nuts_code: geo.nuts_code,
      nuts_label: geo.nuts_label,
      localizzazione: geo.nuts_label,
    }));
  }

  const canProceed = useMemo(() => {
    switch (step.id) {
      case "nome":
        return draft.nome.trim().length > 0;
      case "descrizione":
        return draft.descrizione.trim().length > 10;
      case "stato":
        return !!draft.stato;
      case "classificazione":
        return classificationRevealLevel >= 4 && !!draft.settore && !!draft.sotto_settore && !!draft.categoria_intervento && !!draft.tipo_intervento;
      case "durata":
        return !!draft.data_inizio && !!draft.data_fine;
      case "localizzazione":
        return draft.localizzazione.trim().length > 2;
      case "anno":
        return !!draft.anno_attualizzazione && !!draft.tasso_attualizzazione.trim();
      case "capex":
        return draft.capex.trim().length > 0 && (!draft.capex_distribuzione_attiva || Math.abs(capexDistributionTotal - 100) < 0.001);
      case "opex":
        return draft.opex.trim().length > 0;
      default:
        return false;
    }
  }, [draft, step.id]);

  function handleNext() {
    if (!canProceed) return;
    if (stepIdx === STEPS.length - 1) {
      onComplete(toProject(draft, initialProject));
      return;
    }
    setStepIdx((value) => value + 1);
  }

  function handleBack() {
    if (stepIdx === 0) {
      onClose();
      return;
    }
    setStepIdx((value) => value - 1);
  }

  const mapPosition = draft.location_lat != null ? { lat: draft.location_lat, lon: draft.location_lon } : null;
  const sottosettori = getSottosettori(draft.settore);
  const categorie = getCategorie(draft.settore, draft.sotto_settore);
  const projectYears = useMemo(() => yearRangeFromDates(draft.data_inizio, draft.data_fine), [draft.data_fine, draft.data_inizio]);
  const capexDistribution = useMemo(() => buildCapexDistribution(projectYears, draft.capex_distribuzione), [draft.capex_distribuzione, projectYears]);
  const opexDistribution = useMemo(() => buildOpexDistribution(projectYears, draft.opex_distribuzione), [draft.opex_distribuzione, projectYears]);
  const capexDistributionTotal = useMemo(() => sumPercentageValues(capexDistribution, projectYears), [capexDistribution, projectYears]);
  const opexDistributionTotal = useMemo(() => sumOpexDistribution(opexDistribution, projectYears), [opexDistribution, projectYears]);
  const capexYearlyAmounts = useMemo(
    () =>
      projectYears.reduce((acc, year) => {
        acc[year] = percentageToAmount(draft.capex, capexDistribution[year]);
        return acc;
      }, {}),
    [capexDistribution, draft.capex, projectYears],
  );
  const opexYearlyAmounts = useMemo(
    () =>
      projectYears.reduce((acc, year) => {
        acc[year] = percentageToAmount(draft.capex, opexDistribution[year]);
        return acc;
      }, {}),
    [draft.capex, opexDistribution, projectYears],
  );
  const filteredCategorie = useMemo(() => {
    const term = categorySearch.trim().toLowerCase();
    if (term.length < 2) return [];
    return allCategorie
      .filter((item) => `${item.categoria} ${item.sotto_settore} ${item.settore}`.toLowerCase().includes(term))
      .slice(0, 8);
  }, [allCategorie, categorySearch]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg-page">
      <div className="h-[3px] flex-shrink-0 bg-accent-lime" />
      <div className="flex h-16 flex-shrink-0 items-center justify-end border-b border-ink-100 bg-white px-8">
        <button type="button" onClick={() => (isDirty(initialDraft, draft) ? onClose() : onClose())} className="flex items-center gap-2 text-[14px] font-semibold text-brand-violet">
          Chiudi e torna alle valutazioni
          <span className="text-[20px] leading-none">&times;</span>
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar stepIdx={stepIdx} />

        <div className="flex-1 overflow-y-auto bg-[#f3f3f3]">
          <div className="px-8 py-8">
            {step.id === "nome" ? (
              <>
                <QuestionHeader
                  title="Per prima cosa: che NOME vorresti dare al tuo progetto?"
                  description="Ti consigliamo di dare al tuo progetto un nome semplice, riconoscibile, che sia di facile identificazione anche per i tuoi collaboratori. Se ne sei gia in possesso, ma non e obbligatorio integrarlo, indica il CUP."
                />
                <div className="max-w-3xl border border-ink-100 bg-white p-6">
                  <TextInput label="Nome del progetto" hint="Lunghezza massima 70 caratteri" value={draft.nome} onChange={(value) => update("nome", value.slice(0, 70))} placeholder="Inserisci il nome del progetto" />
                  <TextInput label="Identificativo CUP" hint="Valore alfanumerico" value={draft.cup} onChange={(value) => update("cup", value)} placeholder="Inserisci il codice CUP" optional />
                </div>
              </>
            ) : null}

            {step.id === "descrizione" ? (
              <>
                <QuestionHeader
                  title="Fornisci ora una DESCRIZIONE del progetto"
                  description="Inserisci in poche righe le finalita, gli ambiti di intervento e gli obiettivi del progetto. Queste informazioni sono utili per contestualizzare la proposta e attivare i percorsi di valutazione piu appropriati."
                />
                <div className="max-w-3xl border border-ink-100 bg-white p-6">
                  <div className="mb-2 flex items-baseline justify-between">
                    <label className="text-[14px] font-semibold text-ink-900">Descrizione del progetto</label>
                    <span className="text-xs text-ink-400">{draft.descrizione.length}/699 caratteri</span>
                  </div>
                  <p className="mb-2 text-xs text-ink-400">Lunghezza massima 699 caratteri</p>
                  <textarea
                    value={draft.descrizione}
                    onChange={(event) => update("descrizione", event.target.value.slice(0, 699))}
                    rows={7}
                    placeholder="Inserisci la descrizione del progetto"
                    className="w-full border border-ink-200 bg-white px-3 py-3 text-[14px] text-ink-900 placeholder:text-ink-300 focus:border-brand-violet focus:outline-none"
                  />
                </div>
              </>
            ) : null}

            {step.id === "stato" ? (
              <>
                <QuestionHeader title="Qual e lo STATO del progetto?" description="Indica la fase in cui si trova il tuo progetto." type="Risposta singola" />
                <RadioCards options={STATI} value={draft.stato} onChange={(value) => update("stato", value)} descriptions={STATO_DESCRIPTIONS} />
              </>
            ) : null}

            {step.id === "classificazione" ? (
              <>
                <QuestionHeader
                  title="Classifica il progetto in un'unica scheda"
                  description="Puoi procedere in modo graduale, scegliendo prima settore, poi sotto-settore, poi categoria e infine tipo di intervento. In alternativa puoi cercare direttamente la categoria e saltare i passaggi intermedi."
                />
                <div className="max-w-6xl border border-ink-100 bg-white p-6">
                  <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                    <div>
                      <div className="mb-6 rounded-sm border border-[#ebeaf2] bg-[#faf9fd] px-5 py-4">
                        <p className="text-[14px] font-semibold text-ink-900">Percorso guidato</p>
                        <p className="mt-1 text-[13px] leading-[1.5] text-ink-700">
                          La classificazione e progressiva: ogni scelta restringe quelle successive. Sotto-settori e categorie restano nascosti finche non selezioni il livello precedente.
                        </p>
                      </div>

                      <div className="space-y-5">
                        <GuidedSection
                          number="1"
                          title="Settore"
                          description="Scegli prima il settore di riferimento. Questa scelta abilita soltanto i sotto-settori pertinenti."
                          active
                        >
                          <div className="grid gap-3 md:grid-cols-2">
                            {SETTORI.map((option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => handleSettoreChange(option)}
                                className={`min-h-[74px] border px-4 py-4 text-left text-[14px] transition-colors ${
                                  draft.settore === option ? "border-brand-violet bg-brand-violet-soft text-ink-900" : "border-ink-200 bg-white text-ink-900 hover:border-ink-300"
                                }`}
                              >
                                <span className="font-semibold">{option}</span>
                              </button>
                            ))}
                          </div>
                        </GuidedSection>

                        {classificationRevealLevel >= 2 ? (
                          <GuidedSection
                            number="2"
                            title="Sotto-settore"
                            description="Ora puoi scegliere il sotto-settore compatibile con il settore selezionato."
                            active
                          >
                            <div className="grid gap-3 md:grid-cols-2">
                              {sottosettori.map((option) => (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => handleSottosettoreChange(option)}
                                  className={`min-h-[74px] border px-4 py-4 text-left text-[14px] transition-colors ${
                                    draft.sotto_settore === option ? "border-brand-violet bg-brand-violet-soft text-ink-900" : "border-ink-200 bg-white text-ink-900 hover:border-ink-300"
                                  }`}
                                >
                                  <span className="font-semibold">{option}</span>
                                </button>
                              ))}
                            </div>
                          </GuidedSection>
                        ) : null}

                        {classificationRevealLevel >= 3 ? (
                          <GuidedSection
                            number="3"
                            title="Categoria di intervento"
                            description="Le categorie si aggiornano in base al sotto-settore scelto."
                            active
                          >
                            <RadioList options={categorie} value={draft.categoria_intervento} onChange={handleCategoriaChange} />
                          </GuidedSection>
                        ) : null}

                        {classificationRevealLevel >= 4 ? (
                          <GuidedSection
                            number="4"
                            title="Tipo di intervento"
                            description="Ultimo passaggio: definisci la natura dell'intervento."
                            active
                          >
                            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                              {TIPI.map((option) => (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => update("tipo_intervento", option)}
                                  className={`min-h-[64px] border px-4 py-4 text-left text-[14px] transition-colors ${
                                    draft.tipo_intervento === option ? "border-brand-violet bg-brand-violet-soft text-ink-900" : "border-ink-200 bg-white text-ink-900 hover:border-ink-300"
                                  }`}
                                >
                                  <span className="font-semibold">{option}</span>
                                </button>
                              ))}
                            </div>
                          </GuidedSection>
                        ) : null}
                      </div>
                    </div>

                    <div className="h-fit border border-[#ebeaf2] bg-[#fcfcfd] p-5">
                      <p className="text-[14px] font-semibold text-ink-900">Ricerca diretta categoria</p>
                      <p className="mt-1 text-[13px] leading-[1.5] text-ink-700">
                        Cerca direttamente tra tutte le categorie di intervento. Quando selezioni un risultato, il sistema imposta automaticamente settore e sotto-settore collegati.
                      </p>
                      <input
                        value={categorySearch}
                        onChange={(event) => setCategorySearch(event.target.value)}
                        placeholder="Scrivi almeno 2 lettere"
                        className="mt-4 h-11 w-full border border-ink-200 bg-white px-3 text-[14px] text-ink-900 placeholder:text-ink-300 focus:border-brand-violet focus:outline-none"
                      />
                      {categorySearch.trim().length >= 2 ? (
                        <div className="mt-4 max-h-[420px] overflow-y-auto border border-ink-100 bg-white">
                          {filteredCategorie.map((item, index) => {
                            const selected =
                              draft.settore === item.settore &&
                              draft.sotto_settore === item.sotto_settore &&
                              draft.categoria_intervento === item.categoria;

                            return (
                              <div key={`${item.settore}-${item.sotto_settore}-${item.categoria}`} className={index < filteredCategorie.length - 1 ? "border-b border-ink-100" : ""}>
                                <SearchResultCard item={item} selected={selected} onSelect={() => handleCategoryDirectSelect(item)} />
                              </div>
                            );
                          })}
                          {filteredCategorie.length === 0 ? (
                            <div className="px-4 py-6 text-[13px] text-ink-500">Nessuna categoria trovata.</div>
                          ) : null}
                        </div>
                      ) : (
                        <div className="mt-4 rounded-sm border border-dashed border-[#d8d8de] bg-white px-4 py-5 text-[13px] leading-[1.5] text-ink-500">
                          La ricerca e indipendente dai settori, ma i risultati compaiono solo quando inizi davvero a cercare.
                        </div>
                      )}

                      <div className="mt-5 border-t border-[#ececf1] pt-4">
                        <p className="text-[12px] font-semibold uppercase tracking-wide text-ink-500">Selezione corrente</p>
                        <div className="mt-3 space-y-2 text-[13px] text-ink-800">
                          <p><strong>Settore:</strong> {draft.settore || "-"}</p>
                          <p><strong>Sotto-settore:</strong> {draft.sotto_settore || "-"}</p>
                          <p><strong>Categoria:</strong> {draft.categoria_intervento || "-"}</p>
                          <p><strong>Tipo:</strong> {draft.tipo_intervento || "-"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : null}

            {step.id === "durata" ? (
              <>
                <QuestionHeader
                  title="Perfetto, quale sara la DURATA del progetto?"
                  description="Indica il periodo previsto dalla fase di avvio lavori alla piena operativita. Questa informazione e importante per programmare correttamente le attivita, stimare i costi e valutare la sostenibilita nel tempo e i benefici nel progetto."
                />
                <div className="grid max-w-3xl grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[14px] font-semibold text-ink-900">Data di inizio</label>
                    <p className="mb-2 text-xs text-ink-400">Formato data gg/mm/aaaa</p>
                    <input type="date" value={draft.data_inizio} onChange={(event) => update("data_inizio", event.target.value)} className="h-11 w-full border border-ink-200 bg-white px-3 text-[14px] text-ink-900 focus:border-brand-violet focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-2 block text-[14px] font-semibold text-ink-900">Data di fine</label>
                    <p className="mb-2 text-xs text-ink-400">Formato data gg/mm/aaaa</p>
                    <input type="date" value={draft.data_fine} onChange={(event) => update("data_fine", event.target.value)} className="h-11 w-full border border-ink-200 bg-white px-3 text-[14px] text-ink-900 focus:border-brand-violet focus:outline-none" />
                  </div>
                </div>
              </>
            ) : null}

            {step.id === "localizzazione" ? (
              <>
                <QuestionHeader
                  title="Dove avra LUOGO il tuo progetto?"
                  description="Inserisci l'area geografica in cui sara realizzato il progetto. Questa informazione consente di collegare il progetto al territorio, attivare dati socio-territoriali rilevanti e fornire analisi contestualizzate su impatti ambientali, sociali ed economici."
                />
                <p className="mb-4 text-[14px] font-semibold text-ink-900">Inserisci un indirizzo o una localita, coerentemente col territorio di riferimento.</p>
                <div className="grid max-w-5xl grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
                  <div className="border border-ink-100 bg-white p-5">
                    <label className="mb-2 block text-[14px] font-semibold text-ink-900">Indirizzo o localita</label>
                    <input
                      value={draft.localizzazione}
                      onChange={(event) => handleAddressChange(event.target.value)}
                      placeholder="Inserisci un indirizzo o localita"
                      className="h-11 w-full border border-ink-200 bg-white px-3 text-[14px] text-ink-900 placeholder:text-ink-300 focus:border-brand-violet focus:outline-none"
                    />
                    {draft.nuts_code ? (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-ink-500">NUTS rilevato</span>
                        <span className="border border-brand-violet/20 bg-brand-violet-soft px-2 py-1 text-xs font-mono text-brand-violet">
                          {draft.nuts_code} - {draft.nuts_label}
                        </span>
                      </div>
                    ) : null}
                  </div>
                  <div className="min-h-[280px] overflow-hidden border border-ink-100 bg-white">
                    <LeafletMap position={mapPosition} onMapClick={handleMapClick} />
                  </div>
                </div>
              </>
            ) : null}

            {step.id === "anno" ? (
              <>
                <QuestionHeader
                  title="Quale sara invece l'ANNO DI ATTUALIZZAZIONE?"
                  description="L'anno di attualizzazione e l'anno base di riferimento. In genere dovrebbe coincidere con l'anno di avvio del cantiere, perche da quel momento costi e benefici futuri vengono riportati a un riferimento economico coerente e confrontabile. In questa sezione puoi anche confermare o modificare il tasso di attualizzazione."
                  type="Risposta singola"
                />
                <div className="grid max-w-6xl gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                  <div className="border border-ink-100 bg-white p-6">
                    <div>
                      <p className="mb-3 text-[14px] font-semibold text-ink-900">Anno di attualizzazione</p>
                      <CarouselCards options={ANNI} value={draft.anno_attualizzazione} onChange={(value) => update("anno_attualizzazione", value)} cols={5} />
                    </div>

                    <div className="mt-8 max-w-[360px]">
                      <label className="mb-2 block text-[14px] font-semibold text-ink-900">Tasso di attualizzazione (%)</label>
                      <p className="mb-2 text-xs text-ink-400">Valore medio preimpostato, modificabile in base allo scenario di analisi</p>
                      <div className="relative">
                        <input
                          value={draft.tasso_attualizzazione}
                          onChange={(event) => update("tasso_attualizzazione", normalizeRateInput(event.target.value))}
                          placeholder={TASSO_DEFAULT}
                          className="h-11 w-full border border-ink-200 bg-white px-3 pr-10 text-[14px] text-ink-900 placeholder:text-ink-300 focus:border-brand-violet focus:outline-none"
                        />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-ink-500">%</span>
                      </div>
                    </div>
                  </div>

                  <aside className="h-fit border border-[#e8e8ed] bg-white p-5">
                    <p className="text-[14px] font-semibold text-ink-900">Guida al tasso</p>
                    <p className="mt-2 text-[13px] leading-[1.55] text-ink-700">
                      Il tasso di attualizzazione serve a trasformare costi e benefici futuri in valori comparabili oggi. Un tasso piu alto riduce il peso dei benefici lontani nel tempo; un tasso piu basso li valorizza maggiormente.
                    </p>
                    <div className="mt-4 space-y-2 border-t border-[#ececf1] pt-4 text-[13px] text-ink-800">
                      <p><strong>Minimo consigliato:</strong> 2,0%</p>
                      <p><strong>Valore medio:</strong> 3,5%</p>
                      <p><strong>Massimo consigliato:</strong> 5,0%</p>
                    </div>
                    <div className="mt-4 rounded-sm bg-[#f7f7fa] px-4 py-3 text-[12px] leading-[1.55] text-ink-700">
                      Usa valori piu bassi per scenari di lungo periodo con forte rilevanza pubblica o ambientale. Usa valori piu alti quando vuoi testare ipotesi piu prudenti o condizioni finanziarie piu restrittive.
                    </div>
                  </aside>
                </div>
              </>
            ) : null}

            {step.id === "capex" ? (
              <>
                <QuestionHeader title="Qual e il CAPEX?" description="Inserisci l'importo complessivo degli investimenti previsti, spese in conto capitale, per la realizzazione del progetto." />
                <div className="max-w-5xl overflow-hidden border border-ink-100 bg-white">
                  <div className="bg-[#2f2f2f] px-5 py-3 text-white">
                    <p className="text-[14px] font-semibold">{draft.localizzazione || "Localizzazione del progetto"}</p>
                  </div>
                  <div className="p-5">
                    <label className="mb-2 block text-[14px] font-semibold text-ink-900">CAPEX complessivo (EUR)</label>
                    <input
                      value={fmt(draft.capex)}
                      onChange={(event) => update("capex", digitsOnly(event.target.value))}
                      placeholder="es. 10.000.000"
                      className="h-11 w-full border border-ink-200 bg-white px-3 text-[14px] text-ink-900 placeholder:text-ink-300 focus:border-brand-violet focus:outline-none"
                    />

                    <div className="mt-6 border-t border-[#ececf1] pt-5">
                      <label className="flex items-center gap-3 text-[14px] font-semibold text-ink-900">
                        <input
                          type="checkbox"
                          checked={draft.capex_distribuzione_attiva}
                          onChange={(event) => update("capex_distribuzione_attiva", event.target.checked)}
                          className="h-4 w-4 accent-[#5b19d6]"
                        />
                        Distribuisci il CAPEX per anno
                      </label>
                      <p className="mt-2 text-[12px] leading-[1.5] text-ink-500">
                        Se attivi questa opzione, puoi specificare la quota percentuale del CAPEX da imputare a ciascun anno del progetto.
                      </p>

                      {draft.capex_distribuzione_attiva ? (
                        <div className="mt-4 overflow-hidden border border-[#e8e8ed]">
                          <div className="bg-[#f7f7fa] px-4 py-3 text-[12px] font-semibold text-ink-700">Distribuzione CAPEX per anno</div>
                          <div className="divide-y divide-[#ececf1] bg-white">
                            {projectYears.map((year) => (
                              <div key={year} className="grid items-center gap-4 px-4 py-4 md:grid-cols-[90px_140px_minmax(0,1fr)]">
                                <span className="text-[14px] font-semibold text-ink-900">{year}</span>
                                <div className="relative">
                                  <input
                                    value={capexDistribution[year] ?? ""}
                                    onChange={(event) => updateCapexDistribution(year, event.target.value)}
                                    className="h-10 w-full border border-ink-200 px-3 pr-8 text-right text-[14px] text-ink-900 focus:border-brand-violet focus:outline-none"
                                  />
                                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-ink-500">%</span>
                                </div>
                                <div className="text-[13px] text-ink-700">
                                  Valore imputato: <strong>{fmt(String(Math.round(capexYearlyAmounts[year] || 0)))} €</strong>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center justify-between border-t border-[#ececf1] bg-[#fcfcfd] px-4 py-3 text-[13px]">
                            <span className="text-ink-700">Totale distribuzione</span>
                            <span className={`font-semibold ${Math.abs(capexDistributionTotal - 100) < 0.001 ? "text-ink-900" : "text-[#c4002f]"}`}>
                              {capexDistributionTotal.toFixed(1).replace(".0", "")}%
                            </span>
                          </div>
                          {Math.abs(capexDistributionTotal - 100) >= 0.001 ? (
                            <div className="border-t border-[#ececf1] bg-[#fff5f7] px-4 py-3 text-[12px] text-[#b0002a]">
                              La distribuzione annuale del CAPEX deve sommare esattamente a 100% per poter proseguire.
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </>
            ) : null}

            {step.id === "opex" ? (
              <>
                <QuestionHeader title="Qual e l'OPEX?" description="Inserisci l'OPEX solo come percentuale del CAPEX, distribuendolo per anno di durata del progetto. Il sistema calcola automaticamente il controvalore in euro." />
                <div className="max-w-6xl overflow-hidden border border-ink-100 bg-white">
                  <div className="bg-[#2f2f2f] px-5 py-3 text-white">
                    <p className="text-[14px] font-semibold">{draft.localizzazione || "Localizzazione del progetto"}</p>
                  </div>

                  <div className="border-b border-[#ececf1] bg-[#fafafa] px-5 py-3">
                    <span className="inline-flex bg-[#ffe9b5] px-2 py-1 text-[11px] font-semibold uppercase text-ink-900">Da completare</span>
                  </div>

                  <div className="px-5 py-5">
                    <div className="overflow-hidden border border-[#d8d8de]">
                      <div className="grid bg-[#3a3a3a] text-white md:grid-cols-[120px_150px_minmax(0,1fr)]">
                        <div className="px-4 py-3 text-[12px] font-semibold uppercase tracking-wide">Anno</div>
                        <div className="px-4 py-3 text-[12px] font-semibold uppercase tracking-wide">% CAPEX</div>
                        <div className="px-4 py-3 text-[12px] font-semibold uppercase tracking-wide">Controvalore</div>
                      </div>

                      <div className="divide-y divide-[#ececf1] bg-white">
                        {projectYears.map((year) => (
                          <div key={year} className="grid items-center gap-3 px-4 py-4 md:grid-cols-[120px_150px_minmax(0,1fr)]">
                            <div className="text-[14px] font-semibold text-ink-900">{year}</div>
                            <div className="relative">
                              <input
                                value={opexDistribution[year] ?? ""}
                                onChange={(event) => updateOpexDistribution(year, event.target.value)}
                                className="h-10 w-full border border-ink-200 px-3 pr-7 text-[13px] text-ink-900 focus:border-brand-violet focus:outline-none"
                              />
                              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-ink-500">%</span>
                            </div>
                            <div className="text-[13px] text-ink-700">
                              {fmt(String(Math.round(opexYearlyAmounts[year] || 0)))} €
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#ececf1] bg-[#fcfcfd] px-5 py-4">
                    <div className="flex flex-wrap gap-6 text-[13px] text-ink-700">
                      <span>Campi compilati: {projectYears.filter((year) => (opexDistribution[year] ?? "").toString().trim().length > 0).length}</span>
                      <span>Campi da compilare: {projectYears.length}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] uppercase tracking-wide text-ink-500">OPEX complessivo</p>
                      <p className="mt-1 text-[14px] font-semibold text-ink-900">{opexDistributionTotal.toFixed(1).replace(".0", "")}% del CAPEX</p>
                      <p className="mt-1 text-[18px] font-semibold text-ink-900">{fmt(String(Math.round(percentageToAmount(draft.capex, opexDistributionTotal))))} €</p>
                    </div>
                  </div>

                  <div className="px-5 py-4">
                    <div className="rounded-sm bg-[#f7f7fa] px-4 py-3 text-[12px] leading-[1.55] text-ink-700">
                      L'OPEX viene calcolato automaticamente come percentuale del CAPEX complessivo inserito nello step precedente.
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid h-16 flex-shrink-0 grid-cols-2">
        <button type="button" onClick={handleBack} className="flex items-center justify-between bg-[#5a5a5a] px-6 text-[14px] font-medium text-white">
          <span>{stepIdx === 0 ? "Torna alle valutazioni" : "Torna allo step precedente"}</span>
          <span className="text-[22px] leading-none">&larr;</span>
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed}
          className={`flex items-center justify-between px-6 text-[14px] font-medium ${canProceed ? "bg-brand-violet text-white" : "cursor-not-allowed bg-ink-100 text-ink-300"}`}
        >
          <span>{stepIdx === STEPS.length - 1 ? "Concludi la configurazione" : "Vai allo step successivo"}</span>
          <span className="text-[22px] leading-none">&rarr;</span>
        </button>
      </div>
    </div>
  );
}
