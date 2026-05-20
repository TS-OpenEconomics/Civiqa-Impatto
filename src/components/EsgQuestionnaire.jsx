import { useMemo, useState } from "react";
import { IconArrowRight, IconClose } from "./ui/Icons";
import { computeEsg, detectSectorType, scoreLabel } from "../lib/esgEngine";

// ── Question banks ──────────────────────────────────────────────────────────

const ENV_BASE = [
  {
    id: "soil_pct", type: "number", suffix: "%",
    label: "Percentuale di superficie impermeabilizzata rispetto all'area totale di progetto",
  },
  {
    id: "impact", type: "multi",
    label: "Impatti ambientali che il progetto intende ridurre (seleziona tutti quelli applicabili)",
    options: ["Rumore o impatto acustico", "Inquinamento atmosferico o emissioni luminose", "Vibrazioni", "Odori sgradevoli", "Effetti sul microclima urbano", "Nessuno degli impatti indicati"],
  },
  { id: "energy_efficiency", type: "yesno", label: "Il progetto include misure specifiche di efficienza energetica?" },
  { id: "carbon_reduction", type: "yesno", label: "Il progetto contribuisce alla riduzione delle emissioni di CO₂ o gas serra?" },
  { id: "lifecycle_assessment", type: "yesno", label: "È prevista una valutazione del ciclo di vita (LCA) dei materiali utilizzati?" },
];
const ENV_SECTOR = {
  idrico:    [{ id: "water_loss", type: "number", suffix: "%", label: "Percentuale attesa di perdite nella rete idrica al termine dell'intervento" }],
  energia:   [{ id: "renewable_share", type: "number", suffix: "%", label: "Quota di energia proveniente da fonti rinnovabili nell'impianto/sistema (% su totale)" }],
  trasporti: [{ id: "emission_reduction", type: "yesno", label: "Il progetto prevede misure per la riduzione delle emissioni dei veicoli nell'area servita?" }],
};

const SOC_BASE = [
  { id: "users", type: "number", suffix: "persone", label: "Numero di utenti o cittadini beneficiari attesi del progetto" },
  { id: "services", type: "yesno", label: "Il progetto migliora l'accessibilità o la qualità dei servizi per la comunità?" },
  { id: "employment", type: "yesno", label: "Sono previsti effetti positivi su occupazione o sviluppo delle competenze locali?" },
  { id: "fte_generated", type: "number", suffix: "FTE", label: "FTE equivalenti a tempo pieno stimati (diretto + indiretto + indotto)", hint: "eia" },
  { id: "gender_equity", type: "yesno", label: "Il progetto include misure specifiche per l'equità di genere o l'inclusione sociale?" },
];
const SOC_SECTOR = {
  idrico:    [{ id: "water_access", type: "number", suffix: "%", label: "Quota di popolazione con accesso al servizio idrico migliorato (% su area servita)" }],
  trasporti: [{ id: "accidents_reduction", type: "yesno", label: "Il progetto prevede interventi mirati alla riduzione degli incidenti stradali?" }],
  sociale:   [{ id: "vulnerable_groups", type: "yesno", label: "Il progetto raggiunge specificamente gruppi vulnerabili o in condizione di svantaggio?" }],
};

const GOV_BASE = [
  { id: "sensitive_area", type: "yesno", label: "L'intervento riguarda o è adiacente ad aree naturali o ecologicamente sensibili?" },
  { id: "monitoring", type: "yesno", label: "È previsto un sistema strutturato di monitoraggio e rendicontazione degli esiti?" },
  { id: "documents", type: "yesno", label: "È disponibile documentazione a supporto di tutte le dichiarazioni ESG del progetto?" },
  { id: "stakeholder_consult", type: "yesno", label: "È stata condotta o è prevista una consultazione formale con gli stakeholder del territorio?" },
  { id: "transparency", type: "yesno", label: "Sono previsti report periodici pubblici sui risultati e l'andamento del progetto?" },
];

function buildSections(sectorType) {
  return [
    { id: "environmental", label: "Environmental", short: "E", color: "#22c55e",
      questions: [...ENV_BASE, ...(ENV_SECTOR[sectorType] ?? [])] },
    { id: "social", label: "Social", short: "S", color: "#3b82f6",
      questions: [...SOC_BASE, ...(SOC_SECTOR[sectorType] ?? [])] },
    { id: "governance", label: "Governance", short: "G", color: "#f59e0b",
      questions: [...GOV_BASE] },
  ];
}

function buildDefaultAnswers(eiaResults) {
  const fte = Math.round(eiaResults?.fte?.totale ?? 50);
  return {
    soil_pct: "15",
    impact: ["Rumore o impatto acustico", "Inquinamento atmosferico o emissioni luminose"],
    energy_efficiency: "Si", carbon_reduction: "No", lifecycle_assessment: "No",
    water_loss: "18", renewable_share: "0", emission_reduction: "Si",
    users: "25000", services: "Si", employment: "Si",
    fte_generated: String(fte),
    gender_equity: "No", water_access: "65",
    accidents_reduction: "Si", vulnerable_groups: "Si",
    sensitive_area: "No", monitoring: "Si", documents: "Si",
    stakeholder_consult: "No", transparency: "Si",
  };
}

// ── Gauge mini SVG ──────────────────────────────────────────────────────────

function MiniGauge({ score, label, color }) {
  const size = 68;
  const R = 24;
  const cx = size / 2;
  const cy = size / 2 + 4;
  const strokeW = 6;
  const TOTAL = 240; // degrees
  const START = 150; // degrees (clockwise from right)

  function pt(angle) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + R * Math.cos(rad), y: cy + R * Math.sin(rad) };
  }
  function arc(a1, a2) {
    const s = pt(a1);
    const e = pt(a2);
    const large = a2 - a1 > 180 ? 1 : 0;
    return `M${s.x.toFixed(2)} ${s.y.toFixed(2)} A${R} ${R} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
  }
  const fillDeg = (score / 100) * TOTAL;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size}>
        <path d={arc(START, START + TOTAL - 0.5)} fill="none" stroke="#e5e7eb" strokeWidth={strokeW} strokeLinecap="round" />
        {fillDeg > 1 && (
          <path d={arc(START, START + fillDeg)} fill="none" stroke={color} strokeWidth={strokeW} strokeLinecap="round" />
        )}
        <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: 12, fontWeight: 700, fill: "#0E0E10", fontFamily: "Inter, sans-serif" }}>
          {score}
        </text>
      </svg>
      <span className="text-xs font-semibold -mt-1" style={{ color }}>{label}</span>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

export function EsgQuestionnaire({ project, eiaResults, initialAnswers, onClose, onComplete }) {
  const settore = project?.configurazione?.settore ?? "";
  const sectorType = detectSectorType(settore);
  const sections = useMemo(() => buildSections(sectorType), [sectorType]);

  const [active, setActive] = useState("environmental");
  const [answers, setAnswers] = useState(() => initialAnswers || buildDefaultAnswers(eiaResults));

  const allQuestions = useMemo(() => sections.flatMap((s) => s.questions), [sections]);

  const sectionProgress = useMemo(() =>
    sections.map((sec) => {
      const total = sec.questions.length;
      const filled = sec.questions.filter((q) => {
        const v = answers[q.id];
        return Array.isArray(v) ? v.length > 0 : v != null && v !== "";
      }).length;
      return { id: sec.id, filled, total };
    }), [sections, answers]);

  const totalProgress = useMemo(() => {
    const total = allQuestions.length;
    const filled = allQuestions.filter((q) => {
      const v = answers[q.id];
      return Array.isArray(v) ? v.length > 0 : v != null && v !== "";
    }).length;
    return { filled, total };
  }, [allQuestions, answers]);

  const liveScore = useMemo(
    () => computeEsg(answers, settore, eiaResults),
    [answers, settore, eiaResults],
  );

  const activeSection = sections.find((s) => s.id === active);
  const activeSectionProgress = sectionProgress.find((p) => p.id === active);
  const canRun = totalProgress.filled === totalProgress.total;

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

  const fteFromEia = eiaResults ? Math.round(eiaResults.fte?.totale ?? 0) : null;

  return (
    <div className="fixed inset-0 bg-bg-page z-50 flex flex-col">
      <div className="h-14 bg-white flex items-center justify-end px-6 shrink-0 border-b border-ink-100">
        <button onClick={onClose} className="flex items-center gap-2 text-brand-violet text-sm font-semibold">
          Chiudi e torna al dettaglio progetto
          <IconClose />
        </button>
      </div>
      <div className="h-[3px] bg-accent-lime" />

      <div className="flex-1 flex overflow-hidden">

        {/* Sidebar */}
        <aside className="w-72 shrink-0 bg-white border-r border-ink-100 flex flex-col overflow-y-auto">
          <div className="p-6 border-b border-ink-100">
            <p className="text-xs font-mono uppercase tracking-[0.18em] text-ink-500">Questionario ESG</p>
            <p className="mt-1 text-sm font-semibold text-ink-700">{settore || "Progetto"}</p>
          </div>

          <nav className="p-4 space-y-2">
            {sections.map((sec) => {
              const prog = sectionProgress.find((p) => p.id === sec.id);
              const complete = prog.filled === prog.total;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActive(sec.id)}
                  className={`w-full text-left px-4 py-3 border transition-all ${
                    active === sec.id
                      ? "border-brand-violet bg-brand-violet-soft"
                      : "border-ink-100 bg-white hover:bg-ink-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className={`text-xs font-mono uppercase tracking-[0.14em] ${active === sec.id ? "text-brand-violet" : "text-ink-500"}`}>
                      {sec.label}
                    </p>
                    <span className={`text-xs font-mono ${complete ? "text-emerald-600 font-semibold" : "text-ink-400"}`}>
                      {prog.filled}/{prog.total}
                    </span>
                  </div>
                  <div className="mt-2 h-1 bg-ink-100">
                    <div
                      className="h-full transition-all"
                      style={{ width: `${(prog.filled / prog.total) * 100}%`, backgroundColor: sec.color }}
                    />
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Live score preview */}
          <div className="mx-4 p-4 bg-ink-900 text-white mt-2">
            <p className="text-xs font-mono uppercase tracking-[0.14em] text-ink-300 mb-3">Score ESG in tempo reale</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-3xl font-bold">{liveScore.globale}</span>
              <span className="text-ink-400 mb-1 text-sm">/100</span>
            </div>
            <p className="text-xs text-ink-300">{scoreLabel(liveScore.globale)}</p>
            <div className="mt-3 flex justify-around">
              <MiniGauge score={liveScore.E.score} label="E" color="#22c55e" />
              <MiniGauge score={liveScore.S.score} label="S" color="#3b82f6" />
              <MiniGauge score={liveScore.G.score} label="G" color="#f59e0b" />
            </div>
          </div>

          <div className="p-4 mt-auto border-t border-ink-100">
            <p className="text-xs text-ink-400">
              <span className="font-semibold text-ink-700">{totalProgress.filled}</span>/{totalProgress.total} domande compilate
            </p>
            <div className="mt-2 h-1.5 bg-ink-100">
              <div
                className="h-full bg-brand-violet transition-all"
                style={{ width: `${(totalProgress.filled / totalProgress.total) * 100}%` }}
              />
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto px-10 py-8">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-ink-500">{activeSection.label}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            Sezione {activeSection.label}
          </h1>
          <p className="mt-1 text-sm text-ink-400">
            {activeSectionProgress.filled}/{activeSectionProgress.total} risposte — {activeSection.questions.length} domande
          </p>

          <div className="mt-6 space-y-4 max-w-3xl">
            {activeSection.questions.map((q) => (
              <div key={q.id} className="bg-white p-6">
                <p className="text-sm font-semibold leading-snug">{q.label}</p>

                {q.hint === "eia" && fteFromEia !== null && (
                  <p className="mt-1 text-xs text-brand-violet">
                    Suggerito dall'analisi EIA: <strong>{fteFromEia} FTE</strong>
                  </p>
                )}

                {q.type === "number" && (
                  <div className="mt-4 flex items-center gap-3">
                    <input
                      value={answers[q.id] ?? ""}
                      onChange={(e) => setAnswer(q.id, e.target.value.replace(/[^\d.]/g, ""))}
                      className={inputClass}
                      placeholder="0"
                    />
                    <span className="text-sm text-ink-500 whitespace-nowrap">{q.suffix}</span>
                  </div>
                )}

                {q.type === "yesno" && (
                  <div className="mt-4 flex gap-3">
                    {["Si", "No"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setAnswer(q.id, opt)}
                        className={`px-6 py-2 border text-sm font-semibold transition-colors ${
                          answers[q.id] === opt
                            ? "border-brand-violet bg-brand-violet text-white"
                            : "border-ink-200 bg-white hover:border-brand-violet"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {q.type === "multi" && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt) => {
                      const checked = (answers[q.id] || []).includes(opt);
                      return (
                        <button
                          key={opt}
                          onClick={() => toggleMulti(q.id, opt)}
                          className={`text-left px-4 py-3 border text-sm transition-colors ${
                            checked
                              ? "border-brand-violet bg-brand-violet-soft"
                              : "border-ink-200 bg-white hover:border-brand-violet/50"
                          }`}
                        >
                          <span className={`mr-2 ${checked ? "text-brand-violet" : "text-ink-300"}`}>■</span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="h-20" />
        </div>
      </div>

      <button
        onClick={() => canRun && onComplete(answers)}
        disabled={!canRun}
        className={`h-14 shrink-0 flex items-center justify-end px-10 gap-3 text-base font-semibold ${
          canRun
            ? "bg-brand-violet text-white hover:bg-brand-violet-dark"
            : "bg-ink-100 text-ink-300 cursor-not-allowed"
        }`}
      >
        {canRun ? "Esegui l'analisi ESG" : `Ancora ${totalProgress.total - totalProgress.filled} risposte`}
        <IconArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}

const inputClass =
  "w-full max-w-[200px] h-10 px-3 border border-ink-300 bg-white text-sm focus:outline-none focus:border-brand-violet";
