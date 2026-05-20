import { useMemo, useState } from "react";
import { PlotlyChart } from "./charts/PlotlyChart";
import { Badge } from "./ui/Badge";
import { EmptyState } from "./ui/EmptyState";
import { IconDecorDiamond, IconDownload } from "./ui/Icons";
import { useToast } from "../hooks/useToast";
import { computeEsg, scoreLabel } from "../lib/esgEngine";

// ── SDG catalog ─────────────────────────────────────────────────────────────

const SDG_LIST = [
  { id: 1,  name: "Sconfiggere la povertà",       color: "#E5243B" },
  { id: 2,  name: "Sconfiggere la fame",           color: "#DDA63A" },
  { id: 3,  name: "Salute e benessere",            color: "#4C9F38" },
  { id: 4,  name: "Istruzione di qualità",         color: "#C5192D" },
  { id: 5,  name: "Parità di genere",              color: "#FF3A21" },
  { id: 6,  name: "Acqua pulita e igiene",         color: "#26BDE2" },
  { id: 7,  name: "Energia pulita",                color: "#FCC30B" },
  { id: 8,  name: "Lavoro dignitoso",              color: "#A21942" },
  { id: 9,  name: "Imprese e infrastrutture",      color: "#FD6925" },
  { id: 10, name: "Ridurre le disuguaglianze",     color: "#DD1367" },
  { id: 11, name: "Città sostenibili",             color: "#FD9D24" },
  { id: 12, name: "Consumo responsabile",          color: "#BF8B2E" },
  { id: 13, name: "Lotta al cambiamento climatico",color: "#3F7E44" },
  { id: 14, name: "Vita sott'acqua",               color: "#0A97D9" },
  { id: 15, name: "Vita sulla terra",              color: "#56C02B" },
  { id: 16, name: "Pace, giustizia e istituzioni", color: "#00689D" },
  { id: 17, name: "Partnership globali",           color: "#19486A" },
];

// ── SVG gauge ───────────────────────────────────────────────────────────────

function CircleGauge({ score, size = 180, color = "#7C3AED" }) {
  const R = (size - 28) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const TOTAL = 252; // degrees of arc
  const START = 144; // starting angle (degrees clockwise from top)

  function pt(deg) {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: cx + R * Math.cos(rad), y: cy + R * Math.sin(rad) };
  }
  function arc(a1, span) {
    if (span < 0.5) return "";
    const s = pt(a1);
    const e = pt(a1 + span);
    const large = span > 180 ? 1 : 0;
    return `M${s.x.toFixed(1)} ${s.y.toFixed(1)} A${R} ${R} 0 ${large} 1 ${e.x.toFixed(1)} ${e.y.toFixed(1)}`;
  }

  const fillDeg = (score / 100) * TOTAL;
  const scoreColor = score >= 70 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <svg width={size} height={size}>
      <path d={arc(START, TOTAL - 0.5)} fill="none" stroke="#e5e7eb" strokeWidth="14" strokeLinecap="round" />
      {fillDeg > 1 && (
        <path d={arc(START, fillDeg)} fill="none" stroke={color ?? scoreColor} strokeWidth="14" strokeLinecap="round" />
      )}
      <text x={cx} y={cy - 6} textAnchor="middle"
        style={{ fontSize: size * 0.26, fontWeight: 700, fill: "#0E0E10", fontFamily: "Inter, sans-serif" }}>
        {score}
      </text>
      <text x={cx} y={cy + size * 0.14} textAnchor="middle"
        style={{ fontSize: size * 0.10, fill: "#6b7280", fontFamily: "Inter, sans-serif" }}>
        /100
      </text>
    </svg>
  );
}

// ── Fallback results ────────────────────────────────────────────────────────

function buildFallback(answers, project) {
  const settore = project?.configurazione?.settore ?? "";
  if (answers && Object.keys(answers).length > 3) {
    return computeEsg(answers, settore, null);
  }
  return {
    globale: 74, E: { score: 79, label: "Buono" }, S: { score: 68, label: "Sufficiente" },
    G: { score: 75, label: "Buono" }, weights: { E: 0.35, S: 0.35, G: 0.30 },
    sdgAligned: [3, 6, 8, 11, 13, 16], benchmark: { score: 68, label: "media Italia" },
    itemsE: [], itemsS: [], itemsG: [], meta: { settore, sectorType: "generic" },
  };
}

// ── Tabs ────────────────────────────────────────────────────────────────────

const TABS = [
  { id: "riepilogo", label: "Riepilogo" },
  { id: "environmental", label: "Environmental" },
  { id: "social", label: "Social" },
  { id: "governance", label: "Governance" },
];

// ── Main component ──────────────────────────────────────────────────────────

export function EsgResults({ project, esgResults, answers, analysis, onBack }) {
  const { showToast } = useToast();
  const [tab, setTab] = useState("riepilogo");

  const results = esgResults ?? buildFallback(answers, project);

  const radarData = useMemo(() => [{
    type: "scatterpolar",
    r: [results.E.score, results.S.score, results.G.score, results.E.score],
    theta: ["Environmental", "Social", "Governance", "Environmental"],
    fill: "toself",
    fillcolor: "rgba(124,58,237,0.12)",
    line: { color: "#7C3AED", width: 2 },
    name: project.nome,
  }], [results.E.score, results.S.score, results.G.score, project.nome]);

  const radarLayout = {
    polar: {
      radialaxis: { visible: true, range: [0, 100], tickfont: { size: 9 } },
      angularaxis: { tickfont: { size: 11 } },
    },
    showlegend: false,
    margin: { t: 16, b: 16, l: 40, r: 40 },
  };

  const criteriaItems = {
    environmental: results.itemsE,
    social: results.itemsS,
    governance: results.itemsG,
  };

  async function handleDownloadExcel() {
    try {
      const { utils, writeFile } = await import("xlsx");
      const wb = utils.book_new();
      const kpi = [
        ["Indicatore", "Score", "Label"],
        ["Globale", results.globale, scoreLabel(results.globale)],
        ["Environmental (E)", results.E.score, results.E.label],
        ["Social (S)", results.S.score, results.S.label],
        ["Governance (G)", results.G.score, results.G.label],
        [],
        ["Benchmark settore", results.benchmark.score, results.benchmark.label],
        [],
        ["SDG allineati", results.sdgAligned.join(", "), ""],
      ];
      utils.book_append_sheet(wb, utils.aoa_to_sheet(kpi), "Score ESG");

      const allItems = [...results.itemsE, ...results.itemsS, ...results.itemsG];
      if (allItems.length > 0) {
        const rows = [
          ["Sezione", "Criterio", "Risposta", "Score", "Livello"],
          ...allItems.map((it) => [it.section, it.criterio, it.risposta, it.score, it.livello]),
        ];
        utils.book_append_sheet(wb, utils.aoa_to_sheet(rows), "Criteri dettaglio");
      }

      writeFile(wb, `ESG_${project.nome}_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch {
      showToast("Errore durante l'export Excel.", "error");
    }
  }

  return (
    <div className="min-h-full">

      {/* Header */}
      <div className="dots-violet-bg px-4 pt-8 pb-10 md:px-10">
        <nav className="flex items-center gap-2 text-sm">
          <button onClick={onBack} className="underline text-ink-900">Dettaglio del progetto</button>
          <span className="text-ink-300">/</span>
          <span className="font-bold">Analisi ESG</span>
        </nav>

        <div className="mt-5 bg-white">
          <div className="px-6 py-5 flex items-start justify-between gap-6 flex-wrap">
            <div className="flex items-start gap-4">
              <IconDecorDiamond />
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold tracking-tight">Analisi ESG</h1>
                  <Badge type="ESG" />
                </div>
                <p className="mt-1 text-sm">Del progetto <span className="font-medium">{project.nome}</span></p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-5 text-sm shrink-0">
              <button
                onClick={() => showToast("Certificato ESG PDF: disponibile nella versione completa.", "info")}
                className="flex items-center gap-2 text-brand-violet font-semibold"
              >
                Scarica certificato <IconDownload />
              </button>
              <button
                onClick={handleDownloadExcel}
                className="flex items-center gap-2 text-brand-violet font-semibold"
              >
                Scarica Excel <IconDownload />
              </button>
            </div>
          </div>

          <div className="border-t border-ink-100 px-6 py-5 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <MetaField label="Settore" value={project.configurazione?.settore ?? "—"} />
            <MetaField label="Metodologia" value="Scoring qualitativo ponderato per settore" />
            <MetaField label="Benchmark" value={`Media ${results.benchmark.label}: ${results.benchmark.score}/100`} />
          </div>

          {analysis?.updatedAt && (
            <div className="border-t border-ink-100 px-6 py-3 text-xs text-ink-500">
              Output generato il <span className="font-mono">{analysis.updatedAt}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 overflow-x-auto border-b border-ink-100 bg-white px-4 md:px-10">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`py-4 text-sm font-semibold relative whitespace-nowrap ${tab === t.id ? "text-brand-violet" : "text-ink-500 hover:text-ink-900"}`}
          >
            {t.label}
            {tab === t.id && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-brand-violet" />}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="px-4 py-8 md:px-10">

        {tab === "riepilogo" && (
          <div className="space-y-6">

            {/* Gauges + radar */}
            <div className="grid grid-cols-1 xl:grid-cols-[auto_1fr] gap-6">

              {/* Score panel */}
              <div className="bg-ink-900 text-white p-8 flex flex-col items-center min-w-[280px]">
                <p className="text-xs font-mono uppercase tracking-[0.16em] text-ink-300 mb-4">Score ESG complessivo</p>
                <CircleGauge score={results.globale} size={180} color="#84cc16" />
                <p className="mt-3 text-xl font-bold">{scoreLabel(results.globale)}</p>
                <p className="mt-1 text-xs text-ink-300">vs benchmark {results.benchmark.score}/100</p>

                <div className="mt-6 w-full space-y-3">
                  {[
                    { label: "Environmental", score: results.E.score, weight: results.weights.E, color: "#22c55e" },
                    { label: "Social", score: results.S.score, weight: results.weights.S, color: "#3b82f6" },
                    { label: "Governance", score: results.G.score, weight: results.weights.G, color: "#f59e0b" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-ink-300">{item.label} <span className="text-ink-500">({Math.round(item.weight * 100)}%)</span></span>
                        <span className="font-mono font-semibold">{item.score}/100</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${item.score}%`, backgroundColor: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Radar + benchmark */}
              <div className="space-y-4">
                <div className="bg-white p-6">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-ink-500 mb-4">Profilo E / S / G</h2>
                  {radarData.length > 0 ? (
                    <PlotlyChart data={radarData} layout={radarLayout} style={{ minHeight: 280 }} />
                  ) : (
                    <EmptyState
                      compact
                      eyebrow="Profilo ESG"
                      title="Radar chart non disponibile"
                      description="Completa il questionario per generare il profilo comparativo E / S / G."
                    />
                  )}
                </div>

                <div className="bg-white p-6">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-ink-500 mb-4">Confronto benchmark</h2>
                  <div className="space-y-3">
                    {[
                      { label: project.nome, score: results.globale, main: true },
                      { label: `Media — ${results.benchmark.label}`, score: results.benchmark.score, main: false },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between text-sm mb-1.5">
                          <span className={item.main ? "font-semibold" : "text-ink-500"}>{item.label}</span>
                          <span className="font-mono font-semibold">{item.score}/100</span>
                        </div>
                        <div className="h-2 bg-ink-100">
                          <div
                            className="h-full transition-all"
                            style={{
                              width: `${item.score}%`,
                              backgroundColor: item.main ? "#7C3AED" : "#a1a1aa",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-ink-400">
                    {results.globale > results.benchmark.score
                      ? `Il progetto supera il benchmark di ${results.globale - results.benchmark.score} punti.`
                      : `Il progetto è ${results.benchmark.score - results.globale} punti sotto il benchmark.`}
                  </p>
                </div>
              </div>
            </div>

            {/* SDG alignment */}
            <div className="bg-white p-6">
              <h2 className="text-lg font-bold tracking-tight mb-2">Allineamento agli Obiettivi di Sviluppo Sostenibile (SDGs)</h2>
              <p className="text-xs text-ink-400 mb-5">
                {results.sdgAligned.length} SDG allineati su 17 — basati sulle risposte del questionario e sul settore di intervento.
              </p>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-2">
                {SDG_LIST.map((sdg) => {
                  const aligned = results.sdgAligned.includes(sdg.id);
                  return (
                    <div
                      key={sdg.id}
                      title={sdg.name}
                      className="flex flex-col items-center p-2 transition-opacity"
                      style={{ opacity: aligned ? 1 : 0.22 }}
                    >
                      <div
                        className="w-10 h-10 flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: aligned ? sdg.color : "#9ca3af" }}
                      >
                        {sdg.id}
                      </div>
                      <p className="mt-1 text-[9px] text-center text-ink-500 leading-tight line-clamp-2">{sdg.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {["environmental", "social", "governance"].includes(tab) && (
          <CriteriaTab
            label={TABS.find((t) => t.id === tab).label}
            items={criteriaItems[tab] ?? []}
            sectionScore={results[tab.charAt(0).toUpperCase()]?.score ?? 0}
            sectionLabel={results[tab.charAt(0).toUpperCase()]?.label ?? "—"}
          />
        )}

      </div>
    </div>
  );
}

// ── Criteria tab ─────────────────────────────────────────────────────────────

function CriteriaTab({ label, items, sectionScore, sectionLabel }) {
  if (items.length === 0) {
    return (
      <EmptyState
        compact
        eyebrow={label}
        title={`Nessun dettaglio ${label}`}
        description="Esegui il questionario per vedere criteri, pesi e contributi di questa sezione."
      />
    );
  }
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 border-l-4 border-brand-violet">
          <p className="text-xs font-mono uppercase tracking-[0.14em] text-ink-500">Score {label}</p>
          <p className="mt-3 text-4xl font-bold font-mono">{sectionScore}<span className="text-lg text-ink-300">/100</span></p>
          <p className="mt-2 text-sm font-semibold">{sectionLabel}</p>
        </div>
        <div className="md:col-span-2 bg-white p-6">
          <p className="text-xs font-mono uppercase tracking-[0.14em] text-ink-500 mb-4">Criteri valutati</p>
          <div className="space-y-3">
            {items.map((it) => (
              <div key={it.criterio} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{it.criterio}</p>
                </div>
                <div className="w-24 h-1.5 bg-ink-100 shrink-0">
                  <div className="h-full bg-brand-violet" style={{ width: `${it.score}%` }} />
                </div>
                <span className="text-xs font-mono w-8 text-right text-ink-500">{it.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden">
        <div className="bg-ink-900 text-white px-5 py-3 text-xs font-semibold uppercase tracking-wider">
          Dettaglio criteri — {label}
        </div>
        <div className="divide-y divide-ink-100">
          {items.map((it) => (
            <div key={it.criterio} className="px-5 py-4 grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center text-sm">
              <div>
                <p className="font-medium">{it.criterio}</p>
                <p className="text-xs text-ink-500 mt-0.5">Risposta: <span className="font-mono">{it.risposta}</span></p>
              </div>
              <div className="text-center">
                <p className="text-xs text-ink-400">Peso</p>
                <p className="font-mono font-semibold">{it.peso}%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-ink-400">Score</p>
                <p className="font-mono font-semibold">{it.score}/100</p>
              </div>
              <LevelBadge livello={it.livello} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function LevelBadge({ livello }) {
  const cfg = {
    allineato: { label: "Allineato",     cls: "bg-emerald-100 text-emerald-700" },
    parziale:  { label: "Parziale",      cls: "bg-amber-100 text-amber-700" },
    non:       { label: "Da presidiare", cls: "bg-red-100 text-red-600" },
  }[livello] ?? { label: livello, cls: "bg-ink-100 text-ink-600" };
  return <span className={`px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${cfg.cls}`}>{cfg.label}</span>;
}

function MetaField({ label, value }) {
  return (
    <div>
      <p className="font-bold text-sm">{label}</p>
      <p className="mt-1 text-sm text-ink-700">{value}</p>
    </div>
  );
}
