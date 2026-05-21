import { useMemo, useState } from "react";
import staticResults from "../../mocks/eiaResults.json";
import { Badge } from "../ui/Badge";
import { ItalyMap } from "../ui/ItalyMap";
import { ProvinceMap } from "../ui/ProvinceMap";
import { IconDownload, IconArrowRight } from "../ui/Icons";
import { ImpactIcon } from "../ui/ImpactIcon";
import { PlotlyChart } from "../charts/PlotlyChart";
import { buildInsights, computeProvinceDistribution, REGION_NAME_TO_NUTS2 } from "../../lib/eiaEngine";
import { useToast } from "../../hooks/useToast";

// ── Tabs ──────────────────────────────────────────────────────────────────────

const TABS = [
  { id: "riepilogo",   label: "Riepilogo" },
  { id: "spese",       label: "Spese" },
  { id: "pil",         label: "PIL" },
  { id: "occupazione", label: "Occupazione" },
  { id: "produzione",  label: "Valore della Produzione" },
  { id: "redditi",     label: "Redditi" },
];

// ── Formatters ────────────────────────────────────────────────────────────────

function fmtIT(n, dec = 0) {
  return new Intl.NumberFormat("it-IT", { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(n);
}
function fmtM(n)  { return `${fmtIT(n / 1_000_000, 1)} M€`; }
function fmtK(n)  { return `${fmtIT(Math.round(n / 1000))} K€`; }
function fmtMln(n) { return fmtIT(n / 1_000_000, 1); }

// ── Chart colors ──────────────────────────────────────────────────────────────

const C_DIR  = "#3D0070";
const C_IND  = "#7C3AED";
const C_INDT = "#C4B5FD";

// ── Sector shares (mirrors eiaEngine SECTOR_IMPACT) ───────────────────────────

const SECTOR_SHARES = [
  ["Costruzioni", 0.35], ["Servizi professionali", 0.15],
  ["Materiali da costruzione", 0.12], ["Trasporti e logistica", 0.10],
  ["Energia e utilities", 0.08], ["Commercio", 0.07],
  ["ICT e digitale", 0.06], ["Finanza e assicurazioni", 0.04],
  ["Sanità e assistenza", 0.02], ["Altri servizi", 0.01],
];

// ── Adapt results ─────────────────────────────────────────────────────────────

function adaptResults(eiaResults) {
  if (eiaResults) return eiaResults;
  const d = staticResults.dimensioni;
  const prodTot = d.produzione.valore * 1000;
  function toBd(v) { return { diretto: Math.round(v * 0.45), indiretto: Math.round(v * 0.35), indotto: Math.round(v * 0.20), totale: Math.round(v) }; }
  return {
    shock_totale:   Math.round(d.spese.valore * 1000),
    moltiplicatore: 1.72,
    produzione: toBd(d.produzione.valore * 1000),
    gva:        toBd(d.pil.valore * 1000),
    fte:        toBd(d.occupazione.valore),
    redditi:    toBd(d.redditi.valore * 1000),
    gettito:    toBd(d.redditi.valore * 1000 * 0.22 / 0.55),
    per_territorio: staticResults.distribuzione_regionale.spese,
    per_settore: SECTOR_SHARES.map(([settore, share]) => ({ settore, share, valore: Math.round(prodTot * share) })),
    per_anno: [],
    scenario: null,
  };
}

// ── Chart helpers ─────────────────────────────────────────────────────────────

function buildStackedBar(items, labelKey, valueKey, bd, isMoney, filterEffect = "Totale") {
  const sorted = [...items].sort((a, b) => b[valueKey] - a[valueKey]);
  const names  = sorted.map(s => s[labelKey]);
  const totals = sorted.map(s => s[valueKey]);
  const ratioD   = bd.totale ? bd.diretto   / bd.totale : 0.45;
  const ratioI   = bd.totale ? bd.indiretto / bd.totale : 0.35;
  const ratioInd = 1 - ratioD - ratioI;
  const sc  = v => isMoney ? v / 1_000_000 : v;
  const fmt = v => isMoney ? fmtIT(v / 1_000_000, 1) : fmtIT(v, 0);

  if (filterEffect !== "Totale") {
    const ratio = filterEffect === "Diretto" ? ratioD : filterEffect === "Indiretto" ? ratioI : ratioInd;
    const color = filterEffect === "Diretto" ? C_DIR : filterEffect === "Indiretto" ? C_IND : C_INDT;
    return [{ type: "bar", orientation: "h", name: `Impatto ${filterEffect}`,
      y: names, x: totals.map(v => sc(Math.round(v * ratio))), marker: { color },
      text: totals.map(v => fmt(Math.round(v * ratio))), textposition: "outside", textfont: { size: 11 } }];
  }
  return [
    { type: "bar", orientation: "h", name: "Impatto Diretto",
      y: names, x: totals.map(v => sc(Math.round(v * ratioD))), marker: { color: C_DIR } },
    { type: "bar", orientation: "h", name: "Impatto Indiretto",
      y: names, x: totals.map(v => sc(Math.round(v * ratioI))), marker: { color: C_IND } },
    { type: "bar", orientation: "h", name: "Impatto Indotto",
      y: names, x: totals.map(v => sc(Math.round(v * ratioInd))), marker: { color: C_INDT },
      text: totals.map(v => fmt(v)), textposition: "outside", textfont: { size: 11 } },
  ];
}

function buildBubble(terrScaled, perSettore, meta) {
  const topR = terrScaled.slice(0, 6);
  const topS = [...perSettore].sort((a, b) => b.valore - a.valore).slice(0, 12);
  const x = [], y = [], sz = [], col = [], txt = [];
  topR.forEach(reg => {
    topS.forEach(sec => {
      const raw = Math.round(reg.valore * sec.share);
      const disp = meta.isMoney ? raw / 1_000_000 : raw;
      x.push(reg.regione); y.push(sec.settore);
      sz.push(disp); col.push(disp);
      txt.push(`<b>${reg.regione} — ${sec.settore}</b><br>${meta.fmtVal(raw)}`);
    });
  });
  const maxSz = Math.max(...sz, 1);
  return [{ type: "scatter", mode: "markers", x, y,
    marker: { size: sz, sizemode: "area", sizeref: 2 * maxSz / (38 ** 2), sizemin: 4,
      color: col, colorscale: [[0, "#EDE9FE"], [0.35, "#7C3AED"], [1, "#3D0070"]],
      showscale: true,
      colorbar: { thickness: 10, len: 0.6, tickfont: { size: 10 },
        title: { text: meta.unit, side: "right", font: { size: 10 } } } },
    text: txt, hovertemplate: "%{text}<extra></extra>" }];
}

function stackedBarLayout(nItems, leftMargin = 200, xTitle = "mln €") {
  return {
    barmode: "stack", orientation: "h",
    yaxis: { autorange: "reversed" },
    xaxis: { title: xTitle },
    margin: { t: 10, b: 44, l: leftMargin, r: 80 },
    legend: { orientation: "h", x: 0, y: -0.12 },
    height: Math.max(280, nItems * 34 + 80),
  };
}

// ── DIM_META ──────────────────────────────────────────────────────────────────

const DIM_META = {
  pil:         { label: "PIL",                     key: "gva",        icon: "pil",         unit: "M€",  fmtVal: fmtM, isMoney: true },
  occupazione: { label: "Occupazione",             key: "fte",        icon: "occupazione", unit: "ETP", fmtVal: n => fmtIT(n), isMoney: false },
  produzione:  { label: "Valore della Produzione", key: "produzione", icon: "produzione",  unit: "M€",  fmtVal: fmtM, isMoney: true },
  redditi:     { label: "Redditi delle famiglie",  key: "redditi",    icon: "redditi",     unit: "M€",  fmtVal: fmtM, isMoney: true },
};

const IMPACT_TYPES = [
  {
    key: "diretto",
    label: "Diretto",
    color: C_DIR,
    description: "Effetto iniziale generato dalle spese e dalle attivita direttamente collegate al progetto.",
  },
  {
    key: "indiretto",
    label: "Indiretto",
    color: C_IND,
    description: "Effetto che si propaga nella filiera di fornitori, subforniture e servizi collegati.",
  },
  {
    key: "indotto",
    label: "Indotto",
    color: C_INDT,
    description: "Effetto aggiuntivo prodotto dai consumi delle famiglie e dal reddito rimesso in circolo.",
  },
];

function shareOf(total, value) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

// ── Main component ────────────────────────────────────────────────────────────

export function EiaResults({ project, eiaResults: rawResults, scenario, analysis, onBack }) {
  const [tab, setTab] = useState("riepilogo");
  const { showToast } = useToast();
  const results  = useMemo(() => adaptResults(rawResults), [rawResults]);
  const insights = useMemo(() => buildInsights(results, scenario ?? results.scenario), [results, scenario]);
  const meta     = staticResults.metadata;

  async function handleDownloadExcel() {
    try {
      const { utils, writeFile } = await import("xlsx");
      const wb = utils.book_new();
      const sheet = [
        ["Dimensione", "Diretto", "Indiretto", "Indotto", "Totale", "Unità"],
        ["Valore della Produzione", results.produzione.diretto, results.produzione.indiretto, results.produzione.indotto, results.produzione.totale, "€"],
        ["PIL", results.gva.diretto, results.gva.indiretto, results.gva.indotto, results.gva.totale, "€"],
        ["Occupazione", results.fte.diretto, results.fte.indiretto, results.fte.indotto, results.fte.totale, "ETP"],
        ["Redditi", results.redditi.diretto, results.redditi.indiretto, results.redditi.indotto, results.redditi.totale, "€"],
      ];
      utils.book_append_sheet(wb, utils.aoa_to_sheet(sheet), "Riepilogo");
      if (results.per_territorio?.length) {
        const t = [["Regione", "Valore (€)", "Intensità"], ...results.per_territorio.map(r => [r.regione, r.valore, r.intensita])];
        utils.book_append_sheet(wb, utils.aoa_to_sheet(t), "Distribuzione regionale");
      }
      writeFile(wb, `EIA_${project.nome?.replace(/\s+/g, "_") ?? "progetto"}.xlsx`);
    } catch { showToast("Errore nel download Excel. Riprova.", "error"); }
  }

  return (
    <div className="min-h-full bg-[#f5f5f5]">
      <div className="px-4 pt-8 pb-6 md:px-10">
        <nav className="flex items-center gap-1.5 text-xs text-ink-400">
          <button onClick={onBack} className="hover:text-brand-violet transition-colors">Dettaglio del progetto</button>
          <span>›</span>
          <span className="font-semibold text-ink-700">Analisi di Impatto</span>
        </nav>
        <p className="mt-3 text-xs text-ink-700">
          Creato il <span className="font-mono font-semibold">{meta.creato_il}</span> da{" "}
          <strong>{meta.creato_da}</strong> — Ultima modifica{" "}
          <span className="font-mono font-semibold">{analysis?.updatedAt ?? meta.ultima_modifica}</span>
        </p>
        <div className="mt-5 overflow-hidden bg-white border border-ink-100">
          <div className="bg-ink-900 px-6 py-6 text-white md:px-8 flex items-start justify-between gap-6 flex-wrap">
            <div className="flex items-start gap-4">
              <span className="flex h-16 w-16 items-center justify-center bg-white p-2 shrink-0">
                <img src="/icons/analysis-eia.png" alt="Logo analisi di impatto" className="h-full w-full object-contain" />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-[22px] font-bold">Analisi di Impatto</h1>
                  <Badge type="EIA" />
                  <span className="inline-flex bg-white/10 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] text-white/70">
                    Diretti, indiretti, indotti
                  </span>
                </div>
                <p className="mt-2 text-sm text-white/80">Del progetto <span className="font-medium text-white">{project.nome}</span></p>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
                  Vista sintetica dei risultati economici, territoriali e occupazionali generati dall'investimento, con lettura per impatto diretto, indiretto e indotto.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm shrink-0">
              <button onClick={() => showToast("Export PDF disponibile nella versione completa.", "info")} className="flex h-10 items-center gap-2 border border-white/20 bg-white/10 px-4 font-semibold text-white hover:bg-white/20">
                Scarica report <IconDownload />
              </button>
              <button onClick={handleDownloadExcel} className="flex h-10 items-center gap-2 bg-accent-lime px-4 font-semibold text-ink-900 hover:opacity-90">
                Scarica Excel <IconDownload />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-0 border-t border-ink-100 bg-white px-6 py-5 text-sm md:grid-cols-3 md:px-8 divide-x divide-ink-100">
            <MetaField label="Settore"      value={project.configurazione?.settore ?? meta.settore} />
            <MetaField label="Dataset"      value={meta.dataset} />
            <MetaField label="Metodologia"  value={meta.metodologia} />
          </div>
        </div>
      </div>

      <div className="px-4 pb-10 md:px-10">
        <div className="overflow-hidden bg-white border border-ink-100">
          <div className="flex overflow-x-auto border-b border-ink-100 px-4 md:px-6">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-4 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors relative ${tab === t.id ? "text-brand-violet" : "text-ink-500 hover:text-ink-900"}`}>
                {t.label}
                {tab === t.id && <span className="absolute left-0 right-0 -bottom-px h-[3px] bg-brand-violet" />}
              </button>
            ))}
          </div>
          <div className="px-4 py-8 md:px-6">
            {(tab === "riepilogo" || tab === "spese") && (
              <div className="mb-8 border border-ink-100 bg-ink-50/70 px-5 py-5">
                <p className="text-xs font-mono uppercase tracking-[0.18em] text-ink-500">Chiave di lettura</p>
                <p className="mt-2 max-w-4xl text-sm leading-relaxed text-ink-700">
                  {staticResults.riepilogo.descrizione_2}
                </p>
              </div>
            )}
            {tab === "riepilogo"   && <TabRiepilogo results={results} />}
            {tab === "spese"       && <TabSpese results={results} />}
            {(tab === "pil" || tab === "occupazione" || tab === "produzione" || tab === "redditi") && (
              <TabDimension tab={tab} results={results} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tab Riepilogo ─────────────────────────────────────────────────────────────

function TabRiepilogo({ results }) {
  const terr = results.per_territorio ?? [];
  const topRegion = terr[0]?.regione ?? "Territorio principale";
  const topRegionValue = terr[0]?.valore ?? 0;
  const directShare = Math.round(((results.gva?.diretto ?? 0) / Math.max(results.gva?.totale ?? 1, 1)) * 100);

  const spesaData = useMemo(() => {
    if (!terr.length || !results.shock_totale || !results.produzione.totale) return terr;
    const r = results.shock_totale / results.produzione.totale;
    return terr.map(t => ({ ...t, valore: Math.round(t.valore * r), hoverText: `${t.regione}<br><b>${fmtM(Math.round(t.valore * r))}</b>` }));
  }, [terr, results]);

  const terrHover = useMemo(() =>
    terr.map(t => ({ ...t, hoverText: `${t.regione}<br><b>${fmtM(t.valore)}</b> PIL` })),
    [terr]);

  return (
    <div className="space-y-8">
      <section>
        <div className="eia-fade-up overflow-hidden bg-ink-900 px-5 py-4 text-white md:px-6">
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/50">Executive Summary</p>
          <h2 className="mt-2 text-lg font-bold tracking-tight">
            L'investimento attiva una filiera ampia e concentra il primo impatto su {topRegion}.
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <SignalCard label="Shock iniziale" value={fmtM(results.shock_totale)} note="base di attivazione" />
            <SignalCard label="Regione trainante" value={topRegion} note={fmtM(topRegionValue)} />
            <SignalCard label="Quota diretta sul PIL" value={`${directShare}%`} note="impatto immediato" />
          </div>
        </div>
      </section>

      {/* 5 KPI cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard label="Valore della Produzione" icon="produzione"  value={fmtM(results.produzione.totale)} unit="valore attuale" bd={results.produzione} />
        <KpiCard label="PIL"                     icon="pil"         value={fmtM(results.gva.totale)}        unit="valore attuale" bd={results.gva} />
        <KpiCard label="Occupazione"             icon="occupazione" value={fmtIT(results.fte.totale)}       unit="valore attuale" bd={results.fte} />
        <KpiCard label="Redditi"                 icon="redditi"     value={fmtM(results.redditi.totale)}    unit="valore attuale" bd={results.redditi} />
        <KpiCard label="Gettito Fiscale"         icon="gettito"     value={fmtM(results.gettito.totale)}    unit="valore attuale" bd={results.gettito} />
      </section>

      {/* Spesa → Moltiplicatore → PIL */}
      <section className="overflow-hidden bg-white border border-ink-100 p-6">
        <p className="text-xs font-mono font-semibold tracking-[0.18em] uppercase text-ink-500 mb-1">Meccanismo di trasmissione</p>
        <h3 className="text-xl font-bold tracking-tight mb-6">Dall'investimento all'impatto sul PIL</h3>
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_100px_1fr] gap-4 items-center">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.14em] text-ink-500 mb-2 text-center">Distribuzione della Spesa</p>
            <ItalyMap data={spesaData} tone="teal" minHeight={360} />
            <p className="mt-2 text-center text-sm font-mono font-bold">{fmtM(results.shock_totale)}</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 py-6">
            <div className="w-px flex-1 bg-ink-100" />
            <div className="flex flex-col items-center gap-1.5 border border-brand-violet/20 bg-white px-4 py-3">
              <span className="text-[9px] font-mono uppercase tracking-widest text-ink-400">Moltip.</span>
              <span className="text-lg font-bold font-mono text-brand-violet">×{results.moltiplicatore.toFixed(2)}</span>
              <IconArrowRight className="text-brand-violet/50 w-4 h-4" />
            </div>
            <div className="w-px flex-1 bg-ink-100" />
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.14em] text-ink-500 mb-2 text-center">Impatto PIL</p>
            <ItalyMap data={terrHover} tone="violet" minHeight={360} />
            <p className="mt-2 text-center text-sm font-mono font-bold">{fmtM(results.gva.totale)}</p>
          </div>
        </div>
      </section>

      {/* Breakdown diretto/indiretto/indotto */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="overflow-hidden bg-white border border-ink-100 p-6">
          <p className="text-xs font-mono font-semibold tracking-[0.18em] uppercase text-ink-500 mb-1">Breakdown</p>
          <h3 className="text-xl font-bold tracking-tight mb-5">Impatto diretto, indiretto e indotto</h3>
          <div className="space-y-4">
            <BreakdownRow label="Valore della Produzione" icon="produzione"  bd={results.produzione} fmtVal={fmtM} />
            <BreakdownRow label="PIL"                     icon="pil"         bd={results.gva}        fmtVal={fmtM} />
            <BreakdownRow label="Occupazione"             icon="occupazione" bd={results.fte}        fmtVal={n => `${fmtIT(n)} ETP`} />
            <BreakdownRow label="Redditi delle famiglie"  icon="redditi"     bd={results.redditi}    fmtVal={fmtM} />
          </div>
        </div>
        <div className="overflow-hidden bg-white border border-ink-100 p-6">
          <p className="text-xs font-mono font-semibold tracking-[0.18em] uppercase text-ink-500 mb-1">Come leggere gli effetti</p>
          <h3 className="text-xl font-bold tracking-tight mb-5">Tre canali di impatto</h3>
          <div className="space-y-3">
            {IMPACT_TYPES.map((impact) => (
              <ImpactExplanationCard key={impact.key} impact={impact} value={results.gva?.[impact.key] ?? 0} total={results.gva?.totale ?? 0} fmtVal={fmtM} />
            ))}
          </div>
        </div>
      </section>

      {/* Definition cards */}
      <section>
        <p className="text-xs font-mono font-semibold tracking-[0.18em] uppercase text-ink-500 mb-4">Glossario degli indicatori</p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <DefCard icon="pil"         title="PIL / Valore Aggiunto"
            text="Misura il valore aggiunto generato dall'investimento, ovvero la differenza tra il valore dei beni prodotti e i costi degli input intermedi. Include effetti diretti, indiretti e indotti." />
          <DefCard icon="produzione"  title="Valore della Produzione"
            text="Valore complessivo della produzione attivata lungo tutta la filiera: beni e servizi prodotti dalle imprese coinvolte, dai fornitori e dalla catena di subappalto." />
          <DefCard icon="occupazione" title="Occupazione (ETP)"
            text="Equivalenti a Tempo Pieno attivati: unità di lavoro standardizzate a tempo pieno. Include lavoratori diretti, indiretti (filiera) e indotti (effetto reddito-consumo)." />
          <DefCard icon="redditi"     title="Redditi delle Famiglie"
            text="Stima dei redditi da lavoro e da capitale trasferiti alle famiglie: salari, stipendi e redditi misti generati dall'intero ciclo economico attivato dall'investimento." />
        </div>
      </section>

    </div>
  );
}

// ── Tab Spese ─────────────────────────────────────────────────────────────────

function TabSpese({ results }) {
  const perAnno = results.per_anno ?? [];
  const terr    = results.per_territorio ?? [];

  const spesaPerSettore = useMemo(() => SECTOR_SHARES
    .map(([settore, share]) => ({ settore, valore: Math.round((results.shock_totale ?? 0) * share) }))
    .sort((a, b) => b.valore - a.valore),
    [results.shock_totale]);

  const settoreBar = useMemo(() => [{
    type: "bar", orientation: "h",
    y: spesaPerSettore.map(s => s.settore),
    x: spesaPerSettore.map(s => s.valore / 1_000_000),
    marker: { color: C_IND },
    text: spesaPerSettore.map(s => fmtMln(s.valore)), textposition: "outside", textfont: { size: 11 },
  }], [spesaPerSettore]);

  const terrSpesa = useMemo(() => {
    if (!terr.length || !results.shock_totale || !results.produzione.totale) return terr;
    const r = results.shock_totale / results.produzione.totale;
    return [...terr]
      .map(t => ({ ...t, valore: Math.round(t.valore * r), hoverText: `${t.regione}<br><b>${fmtM(Math.round(t.valore * r))}</b>` }))
      .sort((a, b) => b.valore - a.valore);
  }, [terr, results]);

  const annoBar = useMemo(() => [
    { name: "CAPEX", type: "bar", x: perAnno.map(r => String(r.anno)), y: perAnno.map(r => r.capex), marker: { color: C_DIR } },
    { name: "OPEX",  type: "bar", x: perAnno.map(r => String(r.anno)), y: perAnno.map(r => r.opex),  marker: { color: C_IND } },
  ], [perAnno]);

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricPanel label="Spesa complessiva" value={fmtM(results.shock_totale ?? 0)} note="shock economico iniziale" />
        <MetricPanel label="Primo settore attivato" value={spesaPerSettore[0]?.settore ?? "—"} note={fmtM(spesaPerSettore[0]?.valore ?? 0)} />
        <MetricPanel label="Prima regione attivata" value={terrSpesa[0]?.regione ?? "—"} note={fmtM(terrSpesa[0]?.valore ?? 0)} />
      </section>

      {/* Timeline */}
      {perAnno.length > 0 && (
        <section className="overflow-hidden bg-white border border-ink-100 p-6">
          <p className="text-xs font-mono font-semibold tracking-[0.18em] uppercase text-ink-500 mb-1">Distribuzione temporale</p>
          <h3 className="text-xl font-bold tracking-tight mb-4">Spesa CAPEX / OPEX per anno</h3>
          <PlotlyChart data={annoBar} layout={{ barmode: "stack", xaxis: { type: "category" }, yaxis: { title: "€" } }} style={{ minHeight: 280 }} />
          <div className="mt-4">
            <div className="bg-ink-900 text-white grid grid-cols-4 px-5 py-3 text-sm font-bold">
              <span>Anno</span><span className="text-right">CAPEX</span><span className="text-right">OPEX</span><span className="text-right">Totale</span>
            </div>
            <div className="h-1 bg-accent-lime" />
            <div className="divide-y divide-ink-100 max-h-56 overflow-y-auto">
              {perAnno.map(r => (
                <div key={r.anno} className="grid grid-cols-4 px-5 py-2.5 text-sm">
                  <span className="font-mono">{r.anno}</span>
                  <span className="text-right font-mono">{r.capex > 0 ? fmtK(r.capex) : "—"}</span>
                  <span className="text-right font-mono">{r.opex  > 0 ? fmtK(r.opex)  : "—"}</span>
                  <span className="text-right font-mono font-semibold">{fmtK(r.totale)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Spese per settore */}
      <section className="overflow-hidden bg-white border border-ink-100 p-6">
        <p className="text-xs font-mono font-semibold tracking-[0.18em] uppercase text-ink-500 mb-1">Distribuzione settoriale</p>
        <h3 className="text-xl font-bold tracking-tight mb-4">Spesa attivata per settore produttivo</h3>
        <PlotlyChart
          data={settoreBar}
          layout={{ yaxis: { autorange: "reversed" }, xaxis: { title: "mln €" }, margin: { t: 10, b: 40, l: 210, r: 80 }, height: 360 }}
          style={{ minHeight: 360 }}
        />
      </section>

      {/* Spese per territorio */}
      <section>
        <p className="text-xs font-mono font-semibold tracking-[0.18em] uppercase text-ink-500 mb-4">Distribuzione territoriale</p>
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
          <div className="overflow-hidden bg-white border border-ink-100 p-6">
            <h3 className="text-xl font-bold tracking-tight mb-4">Spesa per regione</h3>
            <ItalyMap data={terrSpesa} tone="teal" minHeight={420} />
          </div>
          <div className="overflow-hidden bg-white border border-ink-100">
            <div className="bg-ink-900 text-white grid grid-cols-[auto_1fr_100px] px-5 py-3 text-xs font-bold gap-3">
              <span>#</span><span>Regione</span><span className="text-right">Spesa</span>
            </div>
            <div className="h-1 bg-accent-lime" />
            <div className="divide-y divide-ink-100">
              {terrSpesa.slice(0, 15).map((r, i) => (
                <div key={r.regione} className="grid grid-cols-[auto_1fr_100px] px-5 py-3 text-sm gap-3 items-center">
                  <span className="font-mono text-ink-400 w-5">{i + 1}</span>
                  <span>{r.regione}</span>
                  <span className="text-right font-mono text-xs">{fmtM(r.valore)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Tab Dimensione ────────────────────────────────────────────────────────────

const FILTER_OPTS = ["Totale", "Diretto", "Indiretto", "Indotto"];

function TabDimension({ tab, results }) {
  const [selectedRegion,   setSelectedRegion]   = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [filterEffect,     setFilterEffect]     = useState("Totale");

  const level = selectedRegion ? (selectedProvince ? "provincia" : "regione") : "nazionale";

  const meta = DIM_META[tab];
  const copy = staticResults.dimensioni?.[tab];
  const bd   = results[meta.key];
  const terr = results.per_territorio ?? [];
  const perSettore = results.per_settore ?? [];

  const bdFraction = bd?.totale && results.produzione.totale
    ? bd.totale / results.produzione.totale : 1;

  const terrScaled = useMemo(() => terr.map(r => {
    const v = Math.round(r.valore * bdFraction);
    return { ...r, valore: v, hoverText: `${r.regione}<br><b>${meta.fmtVal(v)}</b>` };
  }), [terr, bdFraction, meta]);

  const settoreScaled = useMemo(() => perSettore.map(s => ({
    ...s, valore: Math.round(s.valore * bdFraction),
  })), [perSettore, bdFraction]);

  const nuts2 = selectedRegion ? REGION_NAME_TO_NUTS2[selectedRegion] : null;

  const provinceDist = useMemo(() => {
    if (!selectedRegion) return [];
    const row = terrScaled.find(r => r.regione === selectedRegion);
    return row ? computeProvinceDistribution(selectedRegion, row.valore) : [];
  }, [selectedRegion, terrScaled]);

  function goNazionale() { setSelectedRegion(null); setSelectedProvince(null); }
  function goRegione()   { setSelectedProvince(null); }

  const rankingRows     = level === "nazionale" ? terrScaled.slice(0, 15) : provinceDist;
  const rankingLabelKey = level === "nazionale" ? "regione" : "provincia";

  const regBar = useMemo(() =>
    buildStackedBar(terrScaled.slice(0, 10), "regione", "valore", bd, meta.isMoney, filterEffect),
    [terrScaled, bd, meta, filterEffect]);

  const secBar = useMemo(() =>
    buildStackedBar(settoreScaled, "settore", "valore", bd, meta.isMoney, filterEffect),
    [settoreScaled, bd, meta, filterEffect]);

  const bubble = useMemo(() =>
    buildBubble(terrScaled, settoreScaled, meta),
    [terrScaled, settoreScaled, meta]);

  const regBarLayout = useMemo(() => stackedBarLayout(Math.min(terrScaled.length, 10), 170, meta.isMoney ? "mln €" : "ETP"), [terrScaled, meta]);
  const secBarLayout = useMemo(() => stackedBarLayout(settoreScaled.length, 210, meta.isMoney ? "mln €" : "ETP"), [settoreScaled, meta]);

  return (
    <div className="space-y-8">
      {/* Top: Contesto + dark KPI card */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
        <div className="overflow-hidden bg-white border border-ink-100 p-6">
          <p className="text-xs font-mono font-semibold tracking-[0.18em] uppercase text-ink-500 mb-1">Contesto della dimensione</p>
          <h3 className="text-xl font-bold tracking-tight mb-3">{copy?.titolo_dettaglio ?? meta.label}</h3>
          <p className="max-w-3xl text-sm leading-relaxed text-ink-700">
            {copy?.descrizione_dettaglio ?? copy?.narrativa_corta}
          </p>
        </div>
        <DimStatsCard meta={meta} bd={bd} moltiplicatore={results.moltiplicatore} />
      </section>

      {/* Unified map + ranking with breadcrumb */}
      <section className="overflow-hidden bg-white border border-ink-100">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 px-6 py-4 border-b border-ink-100">
          <button
            onClick={goNazionale}
            className={`text-sm font-semibold transition-colors ${level === "nazionale" ? "text-ink-900 cursor-default" : "text-brand-violet hover:underline"}`}
          >
            Nazionale
          </button>
          {selectedRegion && (
            <>
              <span className="text-ink-300 text-sm">›</span>
              <button
                onClick={goRegione}
                className={`text-sm font-semibold transition-colors ${level === "regione" ? "text-ink-900 cursor-default" : "text-brand-violet hover:underline"}`}
              >
                {selectedRegion}
              </button>
            </>
          )}
          {selectedProvince && (
            <>
              <span className="text-ink-300 text-sm">›</span>
              <span className="text-sm font-semibold text-ink-900">{selectedProvince}</span>
            </>
          )}
        </div>

        {/* Map + ranking grid */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px]">
          <div className="p-6 xl:border-r border-ink-100">
            {level === "nazionale" ? (
              <ItalyMap
                data={terrScaled} tone="violet"
                onRegionClick={r => { setSelectedRegion(r); setSelectedProvince(null); }}
                selectedRegion={selectedRegion} minHeight={470}
              />
            ) : (
              nuts2 && <ProvinceMap regionName={selectedRegion} nuts2Code={nuts2} data={provinceDist} minHeight={420} />
            )}
          </div>

          {/* Ranking panel */}
          <div className="p-4">
            <div className="overflow-hidden border border-ink-100">
              <div className="bg-ink-900 text-white grid grid-cols-[24px_1fr_80px] px-4 py-3 text-xs font-bold gap-2">
                <span>#</span>
                <span>{level === "nazionale" ? "Regione" : "Provincia"}</span>
                <span className="text-right">Valore</span>
              </div>
              <div className="h-1 bg-accent-lime" />
              <div className="divide-y divide-ink-100 max-h-[430px] overflow-y-auto">
                {rankingRows.map((r, i) => {
                  const label    = r[rankingLabelKey];
                  const isActive = level === "regione" && label === selectedProvince;
                  return (
                    <button
                      key={label}
                      onClick={() => {
                        if (level === "nazionale") { setSelectedRegion(label); setSelectedProvince(null); }
                        else { setSelectedProvince(label); }
                      }}
                      className={`w-full grid grid-cols-[24px_1fr_80px] px-4 py-3 text-sm gap-2 items-center text-left transition-colors ${isActive ? "bg-ink-100" : "hover:bg-ink-50"}`}
                    >
                      <span className="font-mono text-ink-400 text-xs">{i + 1}</span>
                      <span className={`font-medium truncate ${isActive ? "text-brand-violet font-bold" : ""}`}>{label}</span>
                      <span className={`text-right font-mono text-xs ${isActive ? "text-brand-violet" : ""}`}>{meta.fmtVal(r.valore)}</span>
                    </button>
                  );
                })}
              </div>
              {level === "nazionale" && terrScaled.length > 15 && (
                <p className="px-4 py-3 text-xs text-ink-400">+{terrScaled.length - 15} altre regioni</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filter + charts */}
      <section className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-mono font-semibold tracking-[0.18em] uppercase text-ink-500 mb-1">Analisi di dettaglio</p>
            <h3 className="text-xl font-bold tracking-tight">Breakdown per regione e settore</h3>
          </div>
          <div className="flex gap-1 border border-ink-200 bg-white p-1">
            {FILTER_OPTS.map(f => (
              <button key={f} onClick={() => setFilterEffect(f)}
                className={`px-3 py-1.5 text-xs font-semibold transition-colors ${filterEffect === f ? "bg-brand-violet text-white" : "text-ink-500 hover:text-ink-900"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div className="overflow-hidden bg-white border border-ink-100 p-6">
            <p className="text-xs font-mono font-semibold tracking-[0.18em] uppercase text-ink-500 mb-1">Top 10 regioni</p>
            <h4 className="font-bold mb-4">{meta.label} per regione</h4>
            <PlotlyChart data={regBar} layout={regBarLayout} style={{ minHeight: regBarLayout.height }} />
          </div>
          <div className="overflow-hidden bg-white border border-ink-100 p-6">
            <p className="text-xs font-mono font-semibold tracking-[0.18em] uppercase text-ink-500 mb-1">Settori produttivi</p>
            <h4 className="font-bold mb-4">{meta.label} per settore</h4>
            <PlotlyChart data={secBar} layout={secBarLayout} style={{ minHeight: secBarLayout.height }} />
          </div>
        </div>

        <div className="overflow-hidden bg-white border border-ink-100 p-6">
          <p className="text-xs font-mono font-semibold tracking-[0.18em] uppercase text-ink-500 mb-1">Incrocio settore × regione</p>
          <h4 className="font-bold mb-4">{meta.label}: distribuzione settoriale per regione</h4>
          <PlotlyChart
            data={bubble}
            layout={{
              xaxis: { side: "bottom", tickangle: -25 },
              yaxis: { autorange: "reversed" },
              margin: { t: 10, b: 80, l: 210, r: 60 },
              plot_bgcolor: "#FAFAF9",
              height: 440,
            }}
            style={{ minHeight: 440 }}
          />
          <p className="mt-3 text-[11px] text-ink-400 italic">Fonte: elaborazione OpenEconomics su dati SAM EU-ITA 2019</p>
        </div>
      </section>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function KpiCard({ label, icon, value, unit }) {
  return (
    <div className="overflow-hidden border border-ink-100 bg-white p-5">
      <div className="mb-4 flex items-center gap-3">
        <ImpactIcon type={icon} label={label} wrapperClassName="flex h-12 w-12 shrink-0 items-center justify-center text-brand-violet" />
        <span className="text-xs font-mono uppercase tracking-wide text-ink-500 leading-tight">{label}</span>
      </div>
      <p className="text-3xl font-bold font-mono tracking-tight text-ink-900">{value}</p>
      <p className="mt-1 text-xs text-ink-500">{unit}</p>
    </div>
  );
}

function BreakdownRow({ label, icon, bd, fmtVal }) {
  const total = bd?.totale || 0;
  return (
    <div className="flex gap-4 items-start border border-ink-100 bg-white p-5">
      <ImpactIcon type={icon} label={label} wrapperClassName="flex h-12 w-12 shrink-0 items-center justify-center text-brand-violet" />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-xs font-mono uppercase tracking-[0.14em] text-ink-500">{label}</span>
          <span className="text-lg font-bold font-mono shrink-0">{fmtVal(total)}</span>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {IMPACT_TYPES.map((impact) => (
            <div key={impact.key} className="bg-bg-page px-3 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: impact.color }} />
                <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-ink-500">{impact.label}</span>
              </div>
              <p className="mt-2 text-sm font-bold font-mono text-ink-900">{fmtVal(bd?.[impact.key] ?? 0)}</p>
              <p className="mt-1 text-[11px] text-ink-500">{shareOf(total, bd?.[impact.key] ?? 0)}% del totale</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DimStatsCard({ meta, bd, moltiplicatore }) {
  return (
    <div className="overflow-hidden bg-ink-900 p-6 text-white">
      <div className="flex items-start gap-3">
        <ImpactIcon
          type={meta.icon}
          label={meta.label}
          className="h-11 w-11"
          wrapperClassName="flex h-12 w-12 shrink-0 items-center justify-center text-accent-lime"
        />
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.14em] text-ink-300">{meta.label} — Totale attivato</p>
          <p className="mt-3 font-mono text-4xl font-bold tracking-tight">{meta.fmtVal(bd?.totale ?? 0)}</p>
          <p className="mt-1 text-sm text-ink-300">{meta.unit}</p>
        </div>
      </div>
      <div className="mt-5 h-px bg-white/10" />
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {[["Diretto", "diretto"], ["Indiretto", "indiretto"], ["Indotto", "indotto"]].map(([l, k]) => (
          <div key={k}>
            <p className="text-[10px] text-ink-400 uppercase tracking-wide">{l}</p>
            <p className="mt-1 text-sm font-mono font-bold">{meta.fmtVal(bd?.[k] ?? 0)}</p>
          </div>
        ))}
      </div>
      {moltiplicatore != null && (
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-ink-400">Moltiplicatore</p>
          <p className="text-lg font-bold font-mono text-accent-lime">×{moltiplicatore.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}

function ImpactExplanationCard({ impact, value, total, fmtVal }) {
  return (
    <div className="border border-ink-100 bg-white px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: impact.color }} />
          <p className="text-sm font-semibold text-ink-900">{impact.label}</p>
        </div>
        <span className="text-sm font-mono font-bold text-ink-900">{fmtVal(value)}</span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-ink-600">{impact.description}</p>
      <p className="mt-3 text-[11px] font-mono uppercase tracking-[0.12em] text-ink-500">{shareOf(total, value)}% del PIL attivato</p>
    </div>
  );
}

function DefCard({ icon, title, text }) {
  return (
    <div className="border border-ink-100 bg-white p-5">
      <div className="flex items-center gap-3 mb-3">
        <ImpactIcon type={icon} label={title} wrapperClassName="flex h-12 w-12 shrink-0 items-center justify-center text-brand-violet" />
        <p className="font-bold text-sm leading-tight">{title}</p>
      </div>
      <p className="text-xs text-ink-600 leading-relaxed">{text}</p>
    </div>
  );
}

function MetaField({ label, value }) {
  return (
    <div className="border border-ink-100 bg-ink-50/70 px-4 py-4">
      <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-ink-500">{label}</p>
      <p className="mt-2 text-sm font-medium text-ink-900">{value}</p>
    </div>
  );
}

function SignalCard({ label, value, note }) {
  return (
    <div className="border border-white/12 bg-white/8 px-4 py-4 backdrop-blur">
      <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-white/55">{label}</p>
      <p className="mt-2 text-lg font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-white/60">{note}</p>
    </div>
  );
}

function MetricPanel({ label, value, note }) {
  return (
    <div className="eia-fade-up overflow-hidden border border-ink-100 bg-white px-5 py-5">
      <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-ink-500">{label}</p>
      <p className="mt-2 text-xl font-bold tracking-tight text-ink-900">{value}</p>
      <p className="mt-1 text-sm text-ink-600">{note}</p>
    </div>
  );
}
