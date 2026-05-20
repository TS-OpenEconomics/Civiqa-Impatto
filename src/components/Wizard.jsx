import { useMemo, useRef, useState } from "react";
import {
  IconArrowLeft,
  IconArrowRight,
  IconClose,
  IconHelp,
} from "./ui/Icons";
import { LeafletMap } from "./map/LeafletMap";
import { findNearest, geocodeAddress } from "../lib/geocoding";
import { Modal } from "./ui/Modal";

// ── Step definitions ─────────────────────────────────────────────────────────

const STEPS = [
  { id: "basics",         label: "Profilazione",          sublabel: "Nome progetto e CUP" },
  { id: "description",    label: "Profilazione",          sublabel: "Descrizione" },
  { id: "classification", label: "Profilazione",          sublabel: "Stato e classificazione" },
  { id: "duration",       label: "Contesto operativo",    sublabel: "Durata del progetto" },
  { id: "location",       label: "Contesto operativo",    sublabel: "Localizzazione" },
  { id: "year",           label: "Parametri economici",   sublabel: "Anno di attualizzazione" },
  { id: "capex",          label: "Parametri economici",   sublabel: "CAPEX" },
  { id: "opex",           label: "Parametri economici",   sublabel: "OPEX" },
];

// ── P3.1 — Classification data con cascading ─────────────────────────────────

const SETTORI_DATA = {
  "Infrastrutture sociali": {
    nace: "F41.20",
    sottosettori: {
      "Istruzione e formazione": [
        "Scuole e asili", "Università e ricerca", "Formazione professionale", "Servizi integrativi",
      ],
      "Sanità e assistenza": [
        "Ospedali e cliniche", "Strutture per anziani", "Centri di salute", "Assistenza domiciliare",
      ],
      "Cultura e sport": [
        "Biblioteche e musei", "Impianti sportivi", "Spazi culturali", "Teatri e auditorium",
      ],
      "Edilizia residenziale pubblica": [
        "Riqualificazione alloggi", "Nuova costruzione ERP", "Manutenzione straordinaria",
      ],
    },
  },
  "Infrastrutture di trasporto": {
    nace: "F42.11",
    sottosettori: {
      "Strade e autostrade": [
        "Nuova viabilità", "Adeguamento e manutenzione", "Sicurezza stradale", "Gallerie e ponti",
      ],
      "Ferrovie e metropolitane": [
        "Linee ferroviarie", "Metropolitane e tram", "Stazioni e interscambi", "Alta velocità",
      ],
      "Porti e aeroporti": [
        "Infrastrutture portuali", "Piste e terminal aeroportuali", "Logistica e magazzini",
      ],
      "Mobilità urbana": [
        "Piste ciclabili", "ZTL e aree pedonali", "Parcheggi e nodi di scambio", "Bus rapid transit",
      ],
    },
  },
  "Infrastrutture ambientali e risorse idriche": {
    nace: "E36.00",
    sottosettori: {
      "Risorse idriche e acque reflue": [
        "Reti fognarie",
        "Reti idriche urbane",
        "Corpi idrici: Miglioramento della qualità",
        "Impianti depurazione acque",
        "Reti idriche rurali",
      ],
      "Difesa del suolo e prevenzione": [
        "Protezione idrogeologica", "Bonifica siti inquinati", "Gestione alluvioni", "Stabilizzazione versanti",
      ],
      "Valorizzazione dell'ambiente": [
        "Parchi e aree naturali", "Biodiversità e ecosistemi", "Paesaggio rurale",
      ],
      "Smaltimento rifiuti": [
        "Raccolta differenziata", "Compostaggio e digestione anaerobica", "Termovalorizzatori",
      ],
    },
  },
  "Attività produttive, ricerca e impresa sociale": {
    nace: "M72.19",
    sottosettori: {
      "Ricerca e sviluppo": [
        "Laboratori e centri di ricerca", "Incubatori di imprese", "Trasferimento tecnologico",
      ],
      "Impresa sociale e terzo settore": [
        "Cooperative sociali", "Fondazioni e ONG", "Inserimento lavorativo",
      ],
      "Zone economiche speciali": [
        "Aree industriali", "Poli produttivi integrati", "Distretti tecnologici",
      ],
    },
  },
  "Telecomunicazioni e tecnologie informatiche": {
    nace: "J61.10",
    sottosettori: {
      "Reti a banda larga": [
        "Fibra ottica FTTH", "Fibra ottica FTTC", "Connettività rurale e montana",
      ],
      "Infrastrutture digitali pubbliche": [
        "Cloud PA", "Cybersecurity pubblica", "Servizi digitali ai cittadini",
      ],
      "Smart city": [
        "Sensori e IoT urbano", "Mobilità connessa", "Illuminazione intelligente",
      ],
    },
  },
};

const STATI   = ["In preparazione", "In approvazione", "Approvato"];
const SETTORI = Object.keys(SETTORI_DATA);
const TIPI    = ["Nuova realizzazione", "Ristrutturazione", "Recupero", "Manutenzione", "Efficientamento"];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getSottosettori(settore) {
  return Object.keys(SETTORI_DATA[settore]?.sottosettori ?? {});
}

function getCategorie(settore, sottosettore) {
  return SETTORI_DATA[settore]?.sottosettori[sottosettore] ?? [];
}

function digitsOnly(value) {
  return value.replace(/[^\d]/g, "");
}

function formatNumberIT(value) {
  const n = Number(value);
  if (!value || isNaN(n)) return value ?? "";
  return new Intl.NumberFormat("it-IT").format(n);
}

function getConstructionYears(data_inizio, data_fine) {
  if (!data_inizio || !data_fine) return [];
  const start = new Date(data_inizio).getFullYear();
  const end   = new Date(data_fine).getFullYear();
  if (start > end || end - start > 20) return [];
  const years = [];
  for (let y = start; y <= end; y++) years.push(y);
  return years;
}

function initCapexDistribution(years) {
  if (!years.length) return {};
  const base = Math.floor(100 / years.length);
  const remainder = 100 - base * years.length;
  return Object.fromEntries(years.map((y, i) => [y, base + (i === 0 ? remainder : 0)]));
}

function buildDraft(initialProject) {
  const c = initialProject.configurazione ?? {};
  const settore = c.settore || SETTORI[0];
  const sottosettori = getSottosettori(settore);
  const sotto_settore = sottosettori.includes(c.sotto_settore) ? c.sotto_settore : (sottosettori[0] ?? "");
  const categorie = getCategorie(settore, sotto_settore);
  const categoria = categorie.includes(c.categoria_intervento) ? c.categoria_intervento : (categorie[0] ?? "");

  return {
    nome:                        initialProject.nome ?? "",
    cup:                         initialProject.cup ?? "",
    descrizione:                 initialProject.descrizione ?? "",
    stato:                       initialProject.stato || STATI[0],
    settore,
    nace_code:                   c.nace_code || SETTORI_DATA[settore]?.nace || "",
    sotto_settore,
    categoria_intervento:        categoria,
    tipo_intervento:             TIPI.includes(c.tipo_intervento) ? c.tipo_intervento : TIPI[0],
    data_inizio:                 "2025-09-15",
    data_fine:                   "2032-09-15",
    localizzazione:              c.localizzazione ?? "",
    location_lat:                c.lat ?? null,
    location_lon:                c.lon ?? null,
    nuts_code:                   c.nuts_code ?? "",
    nuts_label:                  c.nuts_label ?? "",
    anno_attualizzazione:        String(c.anno_attualizzazione ?? 2025),
    capex:                       String(c.capex ?? ""),
    opex:                        String(c.opex ?? ""),
    vita_utile:                  c.vita_utile ?? 20,
    capex_distribuzione_attiva:  !!c.capex_distribuzione,
    capex_distribuzione:         c.capex_distribuzione ?? {},
  };
}

function toProject(draft, initialProject) {
  const start = new Date(draft.data_inizio);
  const end   = new Date(draft.data_fine);
  const years = Math.max(1, end.getFullYear() - start.getFullYear());
  return {
    ...initialProject,
    nome:        draft.nome,
    cup:         draft.cup,
    descrizione: draft.descrizione,
    stato:       draft.stato,
    configurazione: {
      ...initialProject.configurazione,
      settore:               draft.settore,
      nace_code:             draft.nace_code,
      sotto_settore:         draft.sotto_settore,
      categoria_intervento:  draft.categoria_intervento,
      tipo_intervento:       draft.tipo_intervento,
      durata_progetto:       `${years} anni`,
      localizzazione:        draft.localizzazione,
      lat:                   draft.location_lat,
      lon:                   draft.location_lon,
      nuts_code:             draft.nuts_code,
      nuts_label:            draft.nuts_label,
      anno_attualizzazione:  Number(draft.anno_attualizzazione),
      capex:                 Number(draft.capex),
      opex:                  Number(draft.opex),
      vita_utile:            Number(draft.vita_utile),
      capex_distribuzione:   draft.capex_distribuzione_attiva ? draft.capex_distribuzione : null,
    },
  };
}

// ── Wizard component ──────────────────────────────────────────────────────────

export function Wizard({ initialProject, onClose, onComplete }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [draft, setDraft] = useState(() => buildDraft(initialProject));
  const [dialog, setDialog] = useState(null);
  const geocodeTimerRef = useRef(null);
  const step = STEPS[stepIdx];
  const initialDraft = useMemo(() => buildDraft(initialProject), [initialProject]);

  function update(field, value) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  function updateMany(fields) {
    setDraft((prev) => ({ ...prev, ...fields }));
  }

  // P3.1 — Cascading: quando cambia settore, resetta sotto-settore e categoria
  function handleSettoreChange(settore) {
    const nace_code       = SETTORI_DATA[settore]?.nace ?? "";
    const sottosettori    = getSottosettori(settore);
    const sotto_settore   = sottosettori[0] ?? "";
    const categorie       = getCategorie(settore, sotto_settore);
    const categoria       = categorie[0] ?? "";
    updateMany({ settore, nace_code, sotto_settore, categoria_intervento: categoria });
  }

  function handleSottosettoreChange(sotto_settore) {
    const categorie = getCategorie(draft.settore, sotto_settore);
    updateMany({ sotto_settore, categoria_intervento: categorie[0] ?? "" });
  }

  // P3.2 — Geocoding da campo indirizzo (debounced 500ms)
  function handleAddressChange(value) {
    update("localizzazione", value);
    clearTimeout(geocodeTimerRef.current);
    geocodeTimerRef.current = setTimeout(() => {
      const result = geocodeAddress(value);
      if (result) {
        updateMany({
          location_lat: result.lat,
          location_lon: result.lon,
          nuts_code:    result.nuts_code,
          nuts_label:   result.nuts_label,
        });
      }
    }, 500);
  }

  // P3.2 — Click su mappa → reverse geocoding mock
  function handleMapClick(lat, lon) {
    const geo = findNearest(lat, lon);
    updateMany({
      location_lat:  Math.round(lat * 10000) / 10000,
      location_lon:  Math.round(lon * 10000) / 10000,
      nuts_code:     geo.nuts_code,
      nuts_label:    geo.nuts_label,
      localizzazione: geo.nuts_label,
    });
  }

  // P3.3 — CAPEX distribuzione toggle
  function toggleCapexDistribuzione() {
    setDraft((prev) => {
      if (prev.capex_distribuzione_attiva) {
        return { ...prev, capex_distribuzione_attiva: false };
      }
      const years = getConstructionYears(prev.data_inizio, prev.data_fine);
      return {
        ...prev,
        capex_distribuzione_attiva: true,
        capex_distribuzione: initCapexDistribution(years),
      };
    });
  }

  function updateDistribution(year, pct) {
    setDraft((prev) => ({
      ...prev,
      capex_distribuzione: { ...prev.capex_distribuzione, [year]: Math.max(0, Math.min(100, pct)) },
    }));
  }

  const canProceed = useMemo(() => {
    switch (step.id) {
      case "basics":         return draft.nome.trim() && draft.cup.trim();
      case "description":    return draft.descrizione.trim().length > 20;
      case "classification": return draft.stato && draft.settore && draft.sotto_settore && draft.categoria_intervento && draft.tipo_intervento;
      case "duration":       return draft.data_inizio && draft.data_fine;
      case "location":       return draft.localizzazione.trim().length > 2;
      case "year":           return draft.anno_attualizzazione.trim();
      case "capex": {
        if (!draft.capex.trim()) return false;
        if (draft.capex_distribuzione_attiva) {
          const years = getConstructionYears(draft.data_inizio, draft.data_fine);
          const total = years.reduce((s, y) => s + (draft.capex_distribuzione[y] ?? 0), 0);
          return Math.abs(total - 100) < 0.5;
        }
        return true;
      }
      case "opex":           return draft.opex.trim();
      default:               return false;
    }
  }, [draft, step.id]);

  function handleNext() {
    if (!canProceed) return;
    if (stepIdx === STEPS.length - 1) {
      onComplete(toProject(draft, initialProject));
      return;
    }
    setStepIdx((idx) => idx + 1);
  }

  function handleBack() {
    if (stepIdx === 0) {
      if (isDirty(initialDraft, draft)) {
        setDialog("close");
        return;
      }
      onClose();
      return;
    }
    setStepIdx((idx) => idx - 1);
  }

  const constructionYears  = getConstructionYears(draft.data_inizio, draft.data_fine);
  const distributionTotal  = constructionYears.reduce((s, y) => s + (draft.capex_distribuzione[y] ?? 0), 0);
  const mapPosition        = draft.location_lat != null ? { lat: draft.location_lat, lon: draft.location_lon } : null;

  return (
    <div className="fixed inset-0 bg-bg-page z-50 flex flex-col">
      {/* Header */}
      <div className="h-14 bg-white flex items-center justify-end px-6 shrink-0 border-b border-ink-100">
        <button
          onClick={() => {
            if (isDirty(initialDraft, draft)) {
              setDialog("close");
              return;
            }
            onClose();
          }}
          className="flex items-center gap-2 text-brand-violet text-sm font-semibold"
        >
          Chiudi e torna alle valutazioni
          <IconClose />
        </button>
      </div>
      <div className="h-[3px] bg-accent-lime" />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar step list */}
        <aside className="w-80 shrink-0 bg-white border-r border-ink-100 px-8 py-8 overflow-y-auto">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-ink-500">Configurazione</p>
          <ul className="mt-6 flex flex-col gap-4">
            {STEPS.map((item, index) => {
              const active = index === stepIdx;
              const done   = index < stepIdx;
              return (
                <li key={item.id} className={`border px-4 py-4 ${active ? "border-brand-violet bg-brand-violet-soft" : "border-ink-100 bg-white"}`}>
                  <div className="flex items-start gap-3">
                    <span className={`mt-0.5 w-7 h-7 flex items-center justify-center text-xs font-mono ${done || active ? "bg-brand-violet text-white" : "bg-ink-100 text-ink-500"}`}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className={`text-xs font-mono uppercase tracking-[0.16em] ${active ? "text-brand-violet" : "text-ink-500"}`}>
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm font-semibold">{item.sublabel}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto px-10 py-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.16em] text-ink-500">{step.label}</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">{getTitle(step.id)}</h2>
              <p className="mt-3 text-sm text-ink-700 max-w-3xl leading-relaxed">{getDescription(step.id)}</p>
            </div>
            <button className="w-10 h-10 border border-ink-100 bg-white flex items-center justify-center text-ink-700">
              <IconHelp />
            </button>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setDialog("reset")}
              className="text-sm font-semibold text-rose-600"
            >
              Reset wizard
            </button>
          </div>

          <div className="mt-8">
            {/* Step 1 — Basics */}
            {step.id === "basics" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
                <Field label="Nome progetto">
                  <input value={draft.nome} onChange={(e) => update("nome", e.target.value)} className={inputClass} />
                </Field>
                <Field label="CUP">
                  <input value={draft.cup} onChange={(e) => update("cup", e.target.value)} className={inputClass} />
                </Field>
              </div>
            )}

            {/* Step 2 — Description */}
            {step.id === "description" && (
              <Field label="Descrizione del progetto">
                <textarea
                  value={draft.descrizione}
                  onChange={(e) => update("descrizione", e.target.value)}
                  rows={8}
                  className={`${inputClass} h-auto py-3`}
                />
              </Field>
            )}

            {/* Step 3 — P3.1 Classification (cascading) */}
            {step.id === "classification" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl">
                <Field label="Stato del progetto">
                  <select value={draft.stato} onChange={(e) => update("stato", e.target.value)} className={inputClass}>
                    {STATI.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </Field>

                <Field label="Settore di intervento">
                  <select value={draft.settore} onChange={(e) => handleSettoreChange(e.target.value)} className={inputClass}>
                    {SETTORI.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </Field>

                <Field label="Sotto-settore">
                  <select value={draft.sotto_settore} onChange={(e) => handleSottosettoreChange(e.target.value)} className={inputClass}>
                    {getSottosettori(draft.settore).map((item) => <option key={item}>{item}</option>)}
                  </select>
                </Field>

                <Field label="Categoria di intervento">
                  <select value={draft.categoria_intervento} onChange={(e) => update("categoria_intervento", e.target.value)} className={inputClass}>
                    {getCategorie(draft.settore, draft.sotto_settore).map((item) => <option key={item}>{item}</option>)}
                  </select>
                </Field>

                <Field label="Tipo di intervento">
                  <select value={draft.tipo_intervento} onChange={(e) => update("tipo_intervento", e.target.value)} className={inputClass}>
                    {TIPI.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </Field>

                {/* Codice NACE (visibile ma non editabile) */}
                <div className="flex items-end gap-3">
                  <Field label="Codice NACE (rilevato)">
                    <div className="h-11 px-3 border border-ink-100 bg-ink-50 text-sm flex items-center font-mono text-ink-600">
                      {draft.nace_code || "—"}
                    </div>
                  </Field>
                </div>
              </div>
            )}

            {/* Step 4 — Duration */}
            {step.id === "duration" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
                <Field label="Data di inizio">
                  <input type="date" value={draft.data_inizio} onChange={(e) => update("data_inizio", e.target.value)} className={inputClass} />
                </Field>
                <Field label="Data di fine">
                  <input type="date" value={draft.data_fine} onChange={(e) => update("data_fine", e.target.value)} className={inputClass} />
                </Field>
              </div>
            )}

            {/* Step 5 — P3.2 Location (LeafletMap) */}
            {step.id === "location" && (
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-5 max-w-5xl">
                <div className="bg-white p-6">
                  <Field label="Indirizzo o località">
                    <input
                      value={draft.localizzazione}
                      onChange={(e) => handleAddressChange(e.target.value)}
                      placeholder="es. Via Roma 1, Palermo PA"
                      className={inputClass}
                    />
                  </Field>
                  <p className="mt-3 text-sm text-ink-700">
                    Digita l'indirizzo per posizionare il marker, oppure clicca direttamente sulla mappa.
                  </p>
                  {draft.nuts_code && (
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-xs font-semibold text-ink-500 uppercase tracking-wide">NUTS rilevato</span>
                      <span className="text-xs font-mono bg-brand-violet-soft text-brand-violet border border-brand-violet/20 px-2 py-0.5">
                        {draft.nuts_code} — {draft.nuts_label}
                      </span>
                    </div>
                  )}
                </div>
                <div className="min-h-[320px] relative">
                  <LeafletMap position={mapPosition} onMapClick={handleMapClick} />
                </div>
              </div>
            )}

            {/* Step 6 — Year */}
            {step.id === "year" && (
              <div className="max-w-sm">
                <Field label="Anno di attualizzazione">
                  <input
                    value={draft.anno_attualizzazione}
                    onChange={(e) => update("anno_attualizzazione", digitsOnly(e.target.value))}
                    className={inputClass}
                    placeholder="es. 2025"
                  />
                </Field>
              </div>
            )}

            {/* Step 7 — P3.3 CAPEX */}
            {step.id === "capex" && (
              <div className="max-w-4xl bg-white p-6 space-y-5">
                <Field label="CAPEX complessivo (€)">
                  <input
                    value={formatNumberIT(draft.capex)}
                    onChange={(e) => update("capex", digitsOnly(e.target.value))}
                    className={inputClass}
                    placeholder="es. 10.000.000"
                  />
                </Field>
                <p className="text-sm text-ink-700">
                  Inserisci il valore complessivo di investimento da usare come base economica delle analisi.
                </p>

                {/* Toggle distribuzione pluriennale */}
                <div className="border-t border-ink-100 pt-5">
                  <button
                    type="button"
                    onClick={toggleCapexDistribuzione}
                    className="flex items-center gap-3 text-sm font-semibold text-ink-900"
                  >
                    <span className={`w-10 h-5 rounded-full flex items-center transition-colors ${draft.capex_distribuzione_attiva ? "bg-brand-violet" : "bg-ink-200"}`}>
                      <span className={`w-4 h-4 rounded-full bg-white shadow transition-transform mx-0.5 ${draft.capex_distribuzione_attiva ? "translate-x-5" : "translate-x-0"}`} />
                    </span>
                    Distribuzione pluriennale CAPEX
                  </button>
                  <p className="mt-1 text-xs text-ink-500">
                    Definisci come si distribuisce l'investimento negli anni di costruzione.
                  </p>

                  {draft.capex_distribuzione_attiva && constructionYears.length > 0 && (
                    <div className="mt-4 border border-ink-200 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-ink-700 uppercase tracking-wide">Distribuzione per anno</span>
                        <span className={`text-xs font-mono px-2 py-0.5 ${Math.abs(distributionTotal - 100) < 0.5 ? "bg-accent-lime text-ink-900" : "bg-red-100 text-red-700"}`}>
                          {distributionTotal}% / 100%
                        </span>
                      </div>
                      {constructionYears.map((year) => {
                        const pct   = draft.capex_distribuzione[year] ?? 0;
                        const euros = draft.capex ? (Number(draft.capex) * pct) / 100 : 0;
                        return (
                          <div key={year} className="flex items-center gap-3">
                            <span className="w-12 text-sm font-mono text-ink-700">{year}</span>
                            <div className="flex-1 h-2 bg-ink-100 overflow-hidden">
                              <div className="h-full bg-brand-violet transition-all" style={{ width: `${pct}%` }} />
                            </div>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={pct}
                              onChange={(e) => updateDistribution(year, Number(e.target.value))}
                              className="w-16 h-8 px-2 border border-ink-300 text-sm text-right focus:outline-none focus:border-brand-violet"
                            />
                            <span className="text-xs text-ink-500 w-4">%</span>
                            <span className="w-28 text-xs text-right text-ink-600 font-mono">
                              {euros > 0 ? formatNumberIT(String(Math.round(euros))) + " €" : "—"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {draft.capex_distribuzione_attiva && constructionYears.length === 0 && (
                    <p className="mt-3 text-sm text-amber-600">
                      Definisci prima le date di inizio e fine progetto (step 4) per abilitare la distribuzione.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 8 — P3.3 OPEX */}
            {step.id === "opex" && (
              <div className="max-w-4xl bg-white p-6 space-y-5">
                <Field label="OPEX annuo (€)">
                  <input
                    value={formatNumberIT(draft.opex)}
                    onChange={(e) => update("opex", digitsOnly(e.target.value))}
                    className={inputClass}
                    placeholder="es. 500.000"
                  />
                </Field>
                <p className="text-sm text-ink-700">
                  Se il valore reale non è ancora definitivo, in questa fase può essere trattato come stima iniziale.
                </p>

                <div className="border-t border-ink-100 pt-5">
                  <Field label="Vita utile del progetto (anni)">
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        min="5"
                        max="50"
                        value={draft.vita_utile}
                        onChange={(e) => update("vita_utile", Math.max(5, Math.min(50, Number(e.target.value))))}
                        className={`${inputClass} max-w-[120px]`}
                      />
                      <input
                        type="range"
                        min="5"
                        max="50"
                        step="1"
                        value={draft.vita_utile}
                        onChange={(e) => update("vita_utile", Number(e.target.value))}
                        className="flex-1 accent-brand-violet"
                      />
                      <span className="text-sm text-ink-600 font-mono w-16">{draft.vita_utile} anni</span>
                    </div>
                  </Field>
                  <p className="mt-2 text-xs text-ink-500">
                    Usata per calcolare l'OPEX totale nelle analisi (default: 20 anni, min 5, max 50).
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer nav */}
      <div className="h-16 shrink-0 grid grid-cols-2">
        <button
          onClick={handleBack}
          className="bg-ink-900 text-white text-sm font-semibold flex items-center justify-between px-8"
        >
          <span>{stepIdx === 0 ? "Torna alle valutazioni" : "Torna allo step precedente"}</span>
          <IconArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`text-sm font-semibold flex items-center justify-between px-8 ${canProceed ? "bg-brand-violet text-white hover:bg-brand-violet-dark" : "bg-ink-100 text-ink-300 cursor-not-allowed"}`}
        >
          <span>{stepIdx === STEPS.length - 1 ? "Vai al riepilogo" : "Vai allo step successivo"}</span>
          <IconArrowRight className="w-5 h-5" />
        </button>
      </div>
      {dialog === "close" ? (
        <Modal
          title="Chiudere il wizard?"
          onClose={() => setDialog(null)}
          onConfirm={onClose}
          confirmLabel="Chiudi senza salvare"
        >
          <p className="text-sm leading-relaxed text-ink-700">
            Hai modifiche non ancora confermate. Se chiudi ora, il contenuto del wizard verrà scartato.
          </p>
        </Modal>
      ) : null}
      {dialog === "reset" ? (
        <Modal
          title="Reset configurazione"
          onClose={() => setDialog(null)}
          onConfirm={() => {
            setDraft(initialDraft);
            setStepIdx(0);
            setDialog(null);
          }}
          confirmLabel="Resetta wizard"
        >
          <p className="text-sm leading-relaxed text-ink-700">
            Tutti i campi del wizard torneranno ai valori iniziali del progetto corrente.
          </p>
        </Modal>
      ) : null}
    </div>
  );
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold mb-2">{label}</span>
      {children}
    </label>
  );
}

function getTitle(id) {
  return {
    basics:         "Come si chiama il progetto?",
    description:    "Descrivi il progetto",
    classification: "Classifica il progetto",
    duration:       "Definisci la durata",
    location:       "Dove avrà luogo il tuo progetto?",
    year:           "Scegli l'anno di attualizzazione",
    capex:          "Inserisci il CAPEX",
    opex:           "Inserisci l'OPEX",
  }[id];
}

function getDescription(id) {
  return {
    basics:         "Questi campi identificano il progetto all'interno della piattaforma e lo collegano alle analisi successive.",
    description:    "La descrizione aiuta a contestualizzare obiettivi, benefici attesi e natura dell'intervento.",
    classification: "Settore, sotto-settore e categoria orientano dataset, indicatori e lettura dei risultati. Il codice NACE è derivato automaticamente.",
    duration:       "Le date servono a impostare l'orizzonte temporale delle analisi economiche e di impatto.",
    location:       "La localizzazione collega il progetto al territorio e abilita viste territoriali coerenti nelle analisi.",
    year:           "Tutti i valori economici saranno letti rispetto a una base temporale comune.",
    capex:          "Il CAPEX rappresenta l'investimento iniziale. Puoi distribuirlo per anno di costruzione.",
    opex:           "L'OPEX raccoglie i costi operativi ricorrenti. La vita utile determina l'orizzonte dell'analisi.",
  }[id];
}

const inputClass =
  "w-full h-11 px-3 border border-ink-300 bg-white text-sm placeholder:text-ink-300 focus:outline-none focus:border-brand-violet";

function isDirty(initialDraft, currentDraft) {
  return JSON.stringify(initialDraft) !== JSON.stringify(currentDraft);
}
