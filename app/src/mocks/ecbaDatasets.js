// Registro dei dataset ECBA (forma ecbaData.js) per la vista di dettaglio.
// I progetti reali (MUBA/Ospedale) hanno un dataset statico importato dagli Excel.
// I progetti asilo nido (alternative DOCFAP) NON hanno un file statico: sono
// ricalcolabili dal motore, quindi il loro dataset è costruito a runtime dai
// risultati calcolati (unica fonte di verità → coerenza col DOCFAP garantita).
import { ECBA_DATA } from "../components/ecbaData";
import { MUBA_ECBA_DATASET } from "./mubaProject";
import { OSPEDALE_ECBA_DATASET } from "./ospedaleProject";
import { getNidoComputedWorkspace } from "../lib/projectState";

export const ECBA_DATASETS = {
  "PROJ-MUBA-976": MUBA_ECBA_DATASET,
  "PROJ-OSP-841": OSPEDALE_ECBA_DATASET,
};

const NIDO_IDS = new Set(["PROJ-NIDO-A1", "PROJ-NIDO-A2", "PROJ-NIDO-A3"]);
const M = (v) => Math.round((v / 1e6) * 100) / 100; // € → M€ (2 decimali)
const r1 = (v) => Math.round(v * 10) / 10;
const DONUT_COLORS = ["#4400B3", "#6E1AFF", "#ae81fd", "#B9FF69", "#270065", "#9E7BFA"];

function luogoFromConfig(conf) {
  const loc = conf?.localizzazione ?? "";
  const comune = loc.replace(/\s+[A-Z]{2}$/, "").trim();
  return comune ? `comune di ${comune}` : (conf?.nuts_label ?? "territorio di riferimento");
}

// Mappa i risultati di computeEcba (workspace.ecbaResults) sulla forma ecbaData.js.
// I campi KPI/waterfall/donut/cashflow vengono dai numeri reali; i campi di
// rischio/sensitività sono sintetizzati dal VANE (illustrativi), come per MUBA.
export function buildNidoEcbaDataset(ws) {
  const e = ws?.ecbaResults;
  if (!e) return ECBA_DATA;
  const conf = ws.project?.configurazione ?? {};
  const van = e.van;
  const vaneM = M(van);
  const positive = (e.benefici_categorie ?? []).filter((c) => c.id !== "residuo" && (c.valore_pv ?? 0) > 0);
  const beneficiLordiPos = positive.reduce((s, c) => s + c.valore_pv, 0) || 1;
  const donut = positive.map((c, i) => ({
    label: c.nome,
    pct: Math.round((c.valore_pv / beneficiLordiPos) * 100),
    color: DONUT_COLORS[i % DONUT_COLORS.length],
    code: c.id,
  }));

  // cashflow: anno 0 = investimento (costo=capex, benefici=0); anni 1..H dai flussi.
  const flussi = e.flussi ?? [];
  const cost = flussi.map((f) => M(f.costi ?? 0));
  const ben = flussi.map((f) => M(f.benefici ?? 0));

  // Segno-consapevole per VANE negativo (A3 voucher).
  const positiveVane = van >= 0;
  const absVaneM = Math.abs(vaneM);

  return {
    kpi: {
      investimento: M(e.meta?.capex ?? conf.capex ?? 0),
      orizzonte: e.meta?.orizzonte ?? 20,
      tasso: e.meta?.tasso ?? 3,
      vane: vaneM,
      tire: e.tir ?? 0,
      bcr: e.bc ?? 0,
      paybackAnno: e.payback ?? null,
      progetto: ws.project?.nome ?? "Asilo nido comunale",
      luogo: luogoFromConfig(conf),
      categoria: conf.categoria_intervento ?? "Asili Nido",
    },
    waterfall: {
      benefici: M(e.benefici_totali ?? 0),
      costi: M(e.costi_totali ?? 0),
      esternalitaNeg: 0,
      vane: vaneM,
    },
    pv_capex: e.pv_capex ?? 0,
    pv_opex: e.pv_opex ?? 0,
    cashflow: { cost, ben },
    donut,
    _riskIllustrative: true,
    sensitivity: [
      { name: "Costi di investimento", sub: "±10%", low: r1(vaneM * (positiveVane ? 0.72 : 1.28)), high: r1(vaneM * (positiveVane ? 1.28 : 0.72)) },
      { name: "Beneficio annuo per posto", sub: "±10%", low: r1(vaneM * (positiveVane ? 0.68 : 1.32)), high: r1(vaneM * (positiveVane ? 1.32 : 0.68)) },
      { name: "Numero di posti serviti", sub: "±10%", low: r1(vaneM * (positiveVane ? 0.70 : 1.30)), high: r1(vaneM * (positiveVane ? 1.30 : 0.70)) },
      { name: "Costi di gestione (OPEX)", sub: "±10%", low: r1(vaneM * (positiveVane ? 0.88 : 1.12)), high: r1(vaneM * (positiveVane ? 1.12 : 0.88)) },
      { name: "Tasso di sconto sociale", sub: "±0,5 p.p.", low: r1(vaneM * (positiveVane ? 0.90 : 1.10)), high: r1(vaneM * (positiveVane ? 1.10 : 0.90)) },
    ],
    montecarlo: { start: r1(vaneM - absVaneM * 1.5), w: r1(absVaneM * 0.3) || 1, freq: [1, 2, 5, 11, 18, 22, 18, 12, 7, 3, 1], base: vaneM },
    riskSummary: {
      probPositive: positiveVane ? 0.9 : 0.12,
      median: vaneM,
      mean: r1(vaneM * 0.98),
      std: r1(absVaneM * 0.35),
      p5: r1(vaneM - absVaneM * 0.55),
      p95: r1(vaneM + absVaneM * 0.55),
      criticalVar: "Beneficio annuo per posto",
    },
    elasticities: [
      { param: "Beneficio per posto", value: 2.6 },
      { param: "Numero posti", value: 2.4 },
      { param: "Costi investimento", value: 1.5 },
      { param: "OPEX", value: 1.1 },
      { param: "Tasso sconto", value: 0.9 },
    ],
    variances: [
      { param: "Beneficio per posto", value: 0.8 },
      { param: "Numero posti", value: 0.72 },
      { param: "Costi investimento", value: 0.5 },
      { param: "OPEX", value: 0.38 },
      { param: "Tasso sconto", value: 0.3 },
    ],
    simulationCount: 1000,
    heatmap: { benefici: M(e.benefici_totali ?? 0), costiTotali: M(e.costi_totali ?? 0), costMults: [0.8, 0.9, 1.0, 1.1, 1.2, 1.3], benefitMults: [0.8, 0.9, 1.0, 1.1, 1.2, 1.3] },
  };
}

export function getEcbaDataset(project) {
  const id = typeof project === "string" ? project : project?.id;
  if (id && ECBA_DATASETS[id]) return ECBA_DATASETS[id];
  if (id && NIDO_IDS.has(id)) {
    const ws = getNidoComputedWorkspace(id);
    if (ws) return buildNidoEcbaDataset(ws);
  }
  return ECBA_DATA;
}
