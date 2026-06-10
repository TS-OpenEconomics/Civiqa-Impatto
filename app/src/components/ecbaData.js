// Dati dell'Analisi Economica Costi-Benefici (mock POC) — fonte unica.
// Usata sia dalla vista tecnica (EcbaResults) sia dal percorso guidato
// "In parole semplici" (HoldingHandsCba): un solo posto, niente divergenze.
// Tutti i valori monetari sono in M€.
export const ECBA_DATA = {
  // Indicatori sintetici e parametri di scenario (per i titoli/KPI)
  kpi: {
    investimento: 41.1, // investimento di partenza (M€)
    orizzonte: 30,      // anni
    tasso: 3.0,         // tasso di sconto sociale (%)
    vane: 12.4,         // Valore Attuale Netto Economico (M€)
    tire: 5.8,          // Tasso Interno di Rendimento Economico (%)
    bcr: 1.3,           // Rapporto Benefici/Costi
    paybackAnno: 14,    // anno di payback sociale
    progetto: "Nuovo asilo nido comunale",
    luogo: "provincia di Palermo",
    categoria: "Scuole e asili",
  },
  // Ponte costi-benefici: i 40,7 M€ di spesa sono ripartiti tra costi economici
  // (CAPEX+OPEX) ed esternalità negative monetizzate, così VANE = 53,1 − 36,2 − 4,5 = 12,4.
  waterfall: { benefici: 53.1, costi: 36.2, esternalitaNeg: 4.5, vane: 12.4 },
  // annual economic flows (pre-cumulation), scaled to VA totals
  cashflow: (function () {
    const cap = [14, 12, 5.2];
    const cost = [];
    const ben = [];
    for (let t = 0; t <= 30; t++) {
      let c = t < 3 ? cap[t] : 0.34;
      if (t % 10 === 0 && t > 0) c += 1.0;
      let b = t < 3 ? 0 : 2.3 - t * 0.02;
      if (t === 30) b += 8.1;
      if (b < 0) b = 0;
      cost.push(c);
      ben.push(b);
    }
    const sc = (a, tg) => {
      const s = a.reduce((x, v) => x + v, 0);
      return a.map((v) => (v * tg) / s);
    };
    return { cost: sc(cost, 40.7), ben: sc(ben, 53.1) };
  })(),
  donut: [
    { label: "Partecipazione al lavoro e redditi", pct: 38, color: "#4400B3" },
    { label: "Capitale umano / valore educativo", pct: 24, color: "#6E1AFF" },
    { label: "Costi privati di cura evitati", pct: 18, color: "#ae81fd" },
    { label: "Valorizzazione immobiliare", pct: 12, color: "#B9FF69" },
    { label: "Efficienza energetica / emissioni", pct: 8, color: "#270065" },
  ],
  sensitivity: [
    // VANE (M€) negli scenari sfavorevole/favorevole; base 12.4
    { name: "Costi di investimento", sub: "±10%", low: 8.9, high: 15.9 },
    { name: "Parametri delle esternalità", sub: "±10%", low: 9.8, high: 15.0 },
    { name: "Tasso di crescita della domanda", sub: "±1 p.p.", low: 10.2, high: 14.6 },
    { name: "Costi di gestione (OPEX)", sub: "±10%", low: 10.9, high: 13.9 },
    { name: "Tasso di sconto sociale", sub: "±0,5 p.p.", low: 11.2, high: 13.6 },
  ],
  montecarlo: { start: -15, w: 5, freq: [1, 2, 5, 11, 18, 22, 18, 12, 7, 3, 1], base: 12.4 },
  // ── Sezione rischio (porting della sezione rischio DOCFAP) ──────────────────
  // Sintesi probabilistica del VANE (M€)
  riskSummary: {
    probPositive: 0.92, // quota simulazioni con VANE > 0
    median: 12.4,       // VANE mediano (M€)
    mean: 12.1,         // VANE medio (M€)
    std: 8.5,           // deviazione standard (M€)
    p5: -3.2,           // 5° percentile (M€)
    p95: 27.0,          // 95° percentile (M€)
    criticalVar: "Costi di investimento",
  },
  // Elasticità |ε| del VANE: variazione % del VANE per +1% del parametro
  elasticities: [
    { param: "Costi investimento", value: 2.8 },
    { param: "Esternalità", value: 2.1 },
    { param: "Crescita domanda", value: 1.8 },
    { param: "OPEX", value: 1.2 },
    { param: "Tasso sconto", value: 0.9 },
  ],
  // Contributo normalizzato [0–1] di ciascun parametro alla varianza del VANE
  variances: [
    { param: "Costi investimento", value: 0.85 },
    { param: "Esternalità", value: 0.70 },
    { param: "Crescita domanda", value: 0.55 },
    { param: "OPEX", value: 0.40 },
    { param: "Tasso sconto", value: 0.30 },
  ],
  // Numero di simulazioni Montecarlo usato nelle viste rischio/CBA.
  simulationCount: 1000,
  // Heatmap VANE (M€) al variare dei moltiplicatori di costo (righe) e beneficio (colonne)
  // VANE(cm,bm) = benefici·bm − costiTotali·cm, con benefici 53,1 e costi totali 40,7
  heatmap: { benefici: 53.1, costiTotali: 40.7, costMults: [0.8, 0.9, 1.0, 1.1, 1.2, 1.3], benefitMults: [0.8, 0.9, 1.0, 1.1, 1.2, 1.3] },
};
