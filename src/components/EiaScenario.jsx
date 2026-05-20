import { useState } from "react";
import { IconArrowRight, IconClose } from "./ui/Icons";
import { useToast } from "../hooks/useToast";

// Lista settori per il dropdown
const SETTORI = [
  "Infrastrutture ambientali e risorse idriche",
  "Infrastrutture di trasporto",
  "Infrastrutture sociali",
  "Telecomunicazioni e tecnologie informatiche",
  "Attività produttive, ricerca e impresa sociale",
];

// Territori per il dropdown (NUTS3 semplificato)
const TERRITORI = [
  { code: "ITC4C", label: "Milano (MI)" },
  { code: "ITI43", label: "Roma (RM)" },
  { code: "ITF33", label: "Napoli (NA)" },
  { code: "ITC11", label: "Torino (TO)" },
  { code: "ITG12", label: "Palermo (PA)" },
  { code: "ITH55", label: "Bologna (BO)" },
  { code: "ITI14", label: "Firenze (FI)" },
  { code: "ITC33", label: "Genova (GE)" },
  { code: "ITF47", label: "Bari (BA)" },
  { code: "ITG17", label: "Catania (CT)" },
  { code: "ITH35", label: "Venezia (VE)" },
  { code: "ITC46", label: "Bergamo (BG)" },
  { code: "ITH20", label: "Trento (TN)" },
  { code: "ITF44", label: "Lecce (LE)" },
  { code: "ITG25", label: "Cagliari (CA)" },
];

function formatIT(n) {
  if (!n && n !== 0) return "";
  return new Intl.NumberFormat("it-IT").format(Math.round(n));
}

function buildScenario(project) {
  const c = project.configurazione ?? {};
  const anno_inizio = c.durata_progetto
    ? new Date().getFullYear()
    : (c.anno_attualizzazione ?? 2025);
  const vita_utile = c.vita_utile ?? 20;

  // Cerca nuts_code nelle territory list
  const territory = TERRITORI.find((t) => t.code === c.nuts_code) || TERRITORI[0];

  return {
    settore:            c.settore || SETTORI[0],
    nuts_code:          territory.code,
    nuts_label:         c.nuts_label || territory.label,
    capex:              c.capex ?? 0,
    opex_annuo:         c.opex ?? 0,
    vita_utile,
    anno_inizio,
    anno_fine:          anno_inizio + vita_utile,
    capex_distribuzione: c.capex_distribuzione ?? null,
    spese_aggiuntive:   [],
    granularita:        "regionale",
    tipo:               "completa",
  };
}

export function EiaScenario({ project, initialScenario, onClose, onRun }) {
  const [scenario, setScenario] = useState(() => initialScenario ?? buildScenario(project));
  const [spesaForm, setSpesaForm] = useState(null);
  const { showToast } = useToast();

  function update(field, value) {
    setScenario((prev) => ({ ...prev, [field]: value }));
  }

  function addSpesa() {
    setSpesaForm({ settore: SETTORI[0], nuts_code: TERRITORI[0].code, anno: scenario.anno_inizio, importo: "" });
  }

  function saveSpesa() {
    if (!spesaForm.importo) return;
    setScenario((prev) => ({
      ...prev,
      spese_aggiuntive: [
        ...prev.spese_aggiuntive,
        { ...spesaForm, importo: Number(String(spesaForm.importo).replace(/\./g, "")) },
      ],
    }));
    setSpesaForm(null);
  }

  function removeSpesa(idx) {
    setScenario((prev) => ({
      ...prev,
      spese_aggiuntive: prev.spese_aggiuntive.filter((_, i) => i !== idx),
    }));
  }

  const totalShock = scenario.capex + scenario.opex_annuo * scenario.vita_utile
    + scenario.spese_aggiuntive.reduce((s, x) => s + x.importo, 0);

  return (
    <div className="fixed inset-0 bg-bg-page z-50 flex flex-col">
      {/* Header */}
      <div className="h-14 bg-white flex items-center justify-end px-6 shrink-0 border-b border-ink-100">
        <button onClick={onClose} className="flex items-center gap-2 text-brand-violet text-sm font-semibold">
          Chiudi e torna al dettaglio progetto
          <IconClose />
        </button>
      </div>
      <div className="h-[3px] bg-accent-lime" />

      <div className="flex-1 overflow-y-auto px-6 py-8 max-w-6xl mx-auto w-full md:px-10">
        <div className="overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_top_right,_rgba(199,240,58,0.14),_transparent_24%),linear-gradient(135deg,_#100C1E_0%,_#24153F_56%,_#51358C_100%)] px-6 py-7 text-white shadow-[0_24px_70px_rgba(17,24,39,0.14)] md:px-8">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-white/70">Analisi di Impatto Economico</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">Configura lo scenario di spesa</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/75">
            I dati sono precompilati dalla configurazione del progetto. Puoi modificarli per testare scenari alternativi prima di eseguire l'analisi.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
            <QuickMetric label="Settore" value={scenario.settore} />
            <QuickMetric label="Territorio" value={scenario.nuts_label} />
            <QuickMetric label="Orizzonte" value={`${scenario.vita_utile} anni`} />
          </div>
        </div>

        {/* ── Spesa principale ── */}
        <section className="mt-8 overflow-hidden rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-500 mb-5">Spesa principale</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Settore di intervento">
              <select
                value={scenario.settore}
                onChange={(e) => update("settore", e.target.value)}
                className={selectClass}
              >
                {SETTORI.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>

            <Field label="Territorio (NUTS3)">
              <select
                value={scenario.nuts_code}
                onChange={(e) => {
                  const t = TERRITORI.find((x) => x.code === e.target.value);
                  update("nuts_code", t.code);
                  update("nuts_label", t.label);
                }}
                className={selectClass}
              >
                {TERRITORI.map((t) => (
                  <option key={t.code} value={t.code}>{t.label}</option>
                ))}
              </select>
            </Field>

            <Field label="CAPEX (€)" hint="Da configurazione progetto">
              <input
                value={formatIT(scenario.capex)}
                onChange={(e) => update("capex", Number(e.target.value.replace(/\./g, "").replace(/[^\d]/g, "")) || 0)}
                className={inputClass}
              />
            </Field>

            <Field label="OPEX annuo (€)" hint="Da configurazione progetto">
              <input
                value={formatIT(scenario.opex_annuo)}
                onChange={(e) => update("opex_annuo", Number(e.target.value.replace(/\./g, "").replace(/[^\d]/g, "")) || 0)}
                className={inputClass}
              />
            </Field>

            <Field label="Anno inizio">
              <input
                type="number"
                value={scenario.anno_inizio}
                onChange={(e) => update("anno_inizio", Number(e.target.value))}
                className={inputClass}
              />
            </Field>

            <Field label="Vita utile (anni)">
              <input
                type="number"
                min="5" max="50"
                value={scenario.vita_utile}
                onChange={(e) => update("vita_utile", Number(e.target.value))}
                className={inputClass}
              />
            </Field>
          </div>
        </section>

        {/* ── Distribuzione CAPEX per anno (se presente) ── */}
        {scenario.capex_distribuzione && (
          <section className="mt-4 overflow-hidden rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-500 mb-4">Distribuzione CAPEX per anno</h2>
            <div className="space-y-2">
              {Object.entries(scenario.capex_distribuzione).map(([year, pct]) => {
                const euros = Math.round(scenario.capex * pct / 100);
                return (
                  <div key={year} className="flex items-center gap-3">
                    <span className="w-12 text-sm font-mono text-ink-700">{year}</span>
                    <div className="flex-1 h-2 bg-ink-100">
                      <div className="h-full bg-brand-violet" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-10 text-sm font-mono text-right text-ink-700">{pct}%</span>
                    <span className="w-32 text-xs text-right font-mono text-ink-500">{formatIT(euros)} €</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Spese aggiuntive ── */}
        <section className="mt-4 overflow-hidden rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-500">Spese aggiuntive in altri settori</h2>
            <button
              onClick={addSpesa}
              className="text-sm font-semibold text-brand-violet flex items-center gap-1"
            >
              + Aggiungi spesa in settore aggiuntivo
            </button>
          </div>

          {scenario.spese_aggiuntive.length === 0 && !spesaForm && (
            <p className="text-sm text-ink-400 italic">Nessuna spesa aggiuntiva configurata.</p>
          )}

          {scenario.spese_aggiuntive.map((s, idx) => (
            <div key={idx} className="flex items-center gap-3 text-sm py-2 border-b border-ink-100">
              <span className="flex-1 text-ink-700">{s.settore}</span>
              <span className="text-ink-500">{s.nuts_code}</span>
              <span className="font-mono">{formatIT(s.importo)} €</span>
              <span className="font-mono text-ink-400">Anno {s.anno}</span>
              <button onClick={() => removeSpesa(idx)} className="text-red-400 text-xs hover:text-red-600">Rimuovi</button>
            </div>
          ))}

          {spesaForm && (
            <div className="mt-3 grid grid-cols-2 gap-3 rounded-[24px] border border-ink-200 bg-ink-50 p-4 md:grid-cols-4">
              <Field label="Settore">
                <select
                  value={spesaForm.settore}
                  onChange={(e) => setSpesaForm((p) => ({ ...p, settore: e.target.value }))}
                  className={selectClass}
                >
                  {SETTORI.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="NUTS">
                <select
                  value={spesaForm.nuts_code}
                  onChange={(e) => setSpesaForm((p) => ({ ...p, nuts_code: e.target.value }))}
                  className={selectClass}
                >
                  {TERRITORI.map((t) => <option key={t.code} value={t.code}>{t.label}</option>)}
                </select>
              </Field>
              <Field label="Anno">
                <input
                  type="number"
                  value={spesaForm.anno}
                  onChange={(e) => setSpesaForm((p) => ({ ...p, anno: Number(e.target.value) }))}
                  className={inputClass}
                />
              </Field>
              <Field label="Importo (€)">
                <input
                  value={spesaForm.importo}
                  onChange={(e) => setSpesaForm((p) => ({ ...p, importo: e.target.value }))}
                  className={inputClass}
                  placeholder="es. 1.000.000"
                />
              </Field>
              <div className="col-span-2 md:col-span-4 flex gap-3">
                <button onClick={saveSpesa} className="h-9 px-4 bg-brand-violet text-white text-sm font-semibold">Aggiungi</button>
                <button onClick={() => setSpesaForm(null)} className="h-9 px-4 border border-ink-200 text-sm">Annulla</button>
              </div>
            </div>
          )}
        </section>

        {/* ── Opzioni analisi ── */}
        <section className="mt-4 overflow-hidden rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-500 mb-5">Opzioni analisi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold mb-3">Granularità territoriale</p>
              {["provinciale", "regionale", "nazionale"].map((g) => (
                <label key={g} className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input
                    type="radio"
                    name="granularita"
                    value={g}
                    checked={scenario.granularita === g}
                    onChange={() => update("granularita", g)}
                    className="accent-brand-violet"
                  />
                  <span className="text-sm capitalize">{g}</span>
                </label>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold mb-3">Tipo di analisi</p>
              {[["completa", "Completa (produzione, GVA, FTE, redditi, gettito)"], ["occupazione", "Solo occupazione (FTE)"]].map(([v, l]) => (
                <label key={v} className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tipo"
                    value={v}
                    checked={scenario.tipo === v}
                    onChange={() => update("tipo", v)}
                    className="accent-brand-violet"
                  />
                  <span className="text-sm">{l}</span>
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* ── Shock totale ── */}
        <section className="mt-4 flex items-center justify-between overflow-hidden rounded-[28px] bg-[linear-gradient(145deg,_#100C1E_0%,_#1C1636_55%,_#241B47_100%)] px-6 py-5 text-white shadow-[0_22px_60px_rgba(15,23,42,0.18)]">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.14em] text-ink-300">Shock economico totale stimato</p>
            <p className="mt-2 text-3xl font-bold font-mono">{formatIT(totalShock)} €</p>
            <p className="mt-1 text-xs text-ink-400">
              CAPEX {formatIT(scenario.capex)} € + OPEX {formatIT(scenario.opex_annuo * scenario.vita_utile)} € ({scenario.vita_utile} anni)
              {scenario.spese_aggiuntive.length > 0 && ` + ${scenario.spese_aggiuntive.length} spese aggiuntive`}
            </p>
          </div>
          <button
            onClick={() => showToast("Carica da Excel: funzionalità disponibile nella versione completa.", "info")}
            className="text-sm font-semibold text-ink-300 underline self-start mt-1"
          >
            Carica da Excel
          </button>
        </section>

        <div className="h-24" />
      </div>

      {/* Footer */}
      <button
        onClick={() => onRun(scenario)}
        className="h-14 shrink-0 bg-brand-violet text-white text-base font-semibold flex items-center justify-end px-10 gap-3 hover:bg-brand-violet-dark"
      >
        Esegui l'analisi
        <IconArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold mb-1">{label}</span>
      {hint && <span className="block text-xs text-ink-400 mb-1">{hint}</span>}
      {children}
    </label>
  );
}

const inputClass  = "w-full h-11 rounded-2xl border border-ink-200 bg-ink-50 px-3 text-sm focus:outline-none focus:border-brand-violet focus:bg-white";
const selectClass = "w-full h-11 rounded-2xl border border-ink-200 bg-ink-50 px-3 text-sm focus:outline-none focus:border-brand-violet focus:bg-white";

function QuickMetric({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4 backdrop-blur">
      <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-white/55">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
