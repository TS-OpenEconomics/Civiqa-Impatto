import { useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Pagina ECBA — porting fedele del mockup `cba knowledge/civiqa_ecba_layout.html`.
// Il markup e lo script (grafici SVG, tab, tooltip, modale) sono riprodotti
// "tale e quale"; il CSS è incapsulato sotto `.ecba-root` perché i reset globali
// dell'originale (`*`, `body`) non sfuggano al resto dell'app.
// ─────────────────────────────────────────────────────────────────────────────

// ===== DATA (mock, single object) — tutti i valori in M€ =====
const DATA = {
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
    probPositive: 0.92,   // quota simulazioni con VANE > 0
    median: 12.4,         // VANE mediano (M€)
    mean: 12.1,           // VANE medio (M€)
    std: 8.5,             // deviazione standard (M€)
    p5: -3.2,             // 5° percentile (M€)
    p95: 27.0,            // 95° percentile (M€)
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
  // Heatmap VANE (M€) al variare dei moltiplicatori di costo (righe) e beneficio (colonne)
  // VANE(cm,bm) = benefici·bm − costiTotali·cm, con benefici 53,1 e costi totali 40,7
  heatmap: { benefici: 53.1, costiTotali: 40.7, costMults: [0.8, 0.9, 1.0, 1.1, 1.2, 1.3], benefitMults: [0.8, 0.9, 1.0, 1.1, 1.2, 1.3] },
};

const CSS = `
.ecba-root{
  /* Palette allineata ai token DS della sezione Impatto (tailwind.config.js) */
  --blu-900:#2E0B86; --blu-800:#3A148F; --blu-700:#2E0B86;
  --blu-600:#5B21F7; --blu-500:#5B21F7; --blu-400:#9E7BFA;
  --blu-100:#E8DEFC; --blu-050:#F3EEFE;
  --lime:#C7F03A; --lime-700:#3A4D00;
  --green-700:#1F8C4A; --green-100:#defff0;
  --red-600:#cc0000; --red-100:#ffe5e5;
  --grey-000:#F1F1F1; --grey-light:#EEEEF0; --grey-mid:#D1D1D6; --grey-line:#E5E5E8;
  --text-main:#0E0E10; --text-muted:#5A5A60; --text-soft:#7B7B82;
  --white:#fff; --pink:#A8D8F8; --pink-text:#0E0E10;
  font-family:"Inter",system-ui,-apple-system,BlinkMacSystemFont,sans-serif;
  /* Stesso sfondo della sezione Impatto (token bg-page): le card bianche con bordo
     creano i "bordini grigi" tra una card e l'altra, come in Impatto. */
  position:relative;background:var(--grey-light);color:var(--text-main);line-height:1.55;-webkit-font-smoothing:antialiased;min-height:100%;padding:32px;
}
.ecba-root *{box-sizing:border-box;margin:0;padding:0}
.ecba-root .wrap{width:100%;min-height:calc(100vh - 64px);margin:0;padding:0 0 90px}

.ecba-root .crumb{font-size:13px;color:var(--text-muted);margin-bottom:4px}
.ecba-root .crumb b{color:var(--text-main)} .ecba-root .crumb-sep{margin:0 7px;color:var(--text-soft)}
.ecba-root .crumb-back:hover{color:var(--blu-600)}
.ecba-root .meta-line{font-size:12.5px;color:var(--text-soft);margin-bottom:16px}

/* HEADER CARD */
.ecba-root .head-card{background:var(--white);border:1px solid var(--grey-line)}
.ecba-root .head-top{display:flex;align-items:center;justify-content:space-between;padding:22px 26px;gap:20px;flex-wrap:wrap}
.ecba-root .head-left{display:flex;align-items:center;gap:16px}
.ecba-root .head-icon{width:56px;height:56px;flex:0 0 56px;display:flex;align-items:center;justify-content:center;background:transparent}
.ecba-root .head-icon img{width:100%;height:100%;object-fit:contain}
.ecba-root .head-title{display:flex;align-items:center;gap:10px;font-size:21px;font-weight:800;letter-spacing:-.01em}
.ecba-root .badge{font-size:11px;font-weight:800;letter-spacing:.06em;padding:3px 8px;background:var(--pink);color:var(--pink-text)}
.ecba-root .head-sub{font-size:13.5px;color:var(--text-muted);margin-top:2px} .ecba-root .head-sub b{color:var(--text-main);font-weight:700}
.ecba-root .head-actions{display:flex;align-items:center;gap:22px}
.ecba-root .h-action{display:flex;align-items:center;gap:7px;font-size:13.5px;font-weight:600;color:var(--text-muted);cursor:pointer;border:none;background:none;font-family:inherit}
.ecba-root .h-action svg{width:17px;height:17px;stroke:var(--text-muted)}
.ecba-root .h-action:hover{color:var(--blu-600)} .ecba-root .h-action:hover svg{stroke:var(--blu-600)}
.ecba-root .btn-excel{background:var(--lime);color:var(--blu-900);font-weight:800;padding:10px 16px;display:flex;align-items:center;gap:8px;cursor:pointer;border:none;font-size:13.5px;font-family:inherit}
.ecba-root .btn-excel svg{width:16px;height:16px;stroke:var(--blu-900)} .ecba-root .btn-excel:hover{filter:brightness(.96)}
.ecba-root .head-cols{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--grey-line)}
.ecba-root .hcol{padding:18px 26px} .ecba-root .hcol+.hcol{border-left:1px solid var(--grey-line)}
.ecba-root .hcol .lab{font-size:11px;font-weight:700;letter-spacing:.12em;color:var(--text-soft);text-transform:uppercase;margin-bottom:6px}
.ecba-root .hcol .val{font-size:16px;font-weight:600}

/* BANNER */
.ecba-root .simple-banner{margin-top:32px;background:linear-gradient(95deg,var(--blu-050),#fbf8ff 70%,#fff);border:1px solid var(--grey-line);display:flex;align-items:center;justify-content:space-between;padding:16px 24px;gap:16px;flex-wrap:wrap}
.ecba-root .sb-left{display:flex;align-items:center;gap:16px}
.ecba-root .sb-icon{width:42px;height:42px;background:var(--blu-500);display:flex;align-items:center;justify-content:center;flex:0 0 42px}
.ecba-root .sb-icon svg{width:22px;height:22px;stroke:#fff}
.ecba-root .sb-title{font-size:15.5px;font-weight:800} .ecba-root .sb-desc{font-size:13px;color:var(--text-muted)}
.ecba-root .sb-cta{font-size:14px;font-weight:800;color:var(--blu-600);cursor:pointer;white-space:nowrap} .ecba-root .sb-cta:hover{color:var(--blu-800)}

/* TABS (3 pages) */
.ecba-root .tabs{margin-top:20px;display:grid;grid-template-columns:repeat(3,1fr);background:var(--white);border:1px solid var(--grey-line)}
.ecba-root .tab{padding:16px 22px;cursor:pointer;border:none;border-right:1px solid var(--grey-line);background:none;text-align:left;font-family:inherit}
.ecba-root .tab:last-child{border-right:none}
.ecba-root .tab .t-name{font-size:15px;font-weight:800;color:var(--text-main)}
.ecba-root .tab .t-kpi{font-size:12.5px;color:var(--text-muted);margin-top:2px}
.ecba-root .tab.active{background:var(--blu-500)} .ecba-root .tab.active .t-name{color:#fff} .ecba-root .tab.active .t-kpi{color:rgba(255,255,255,.82)}
.ecba-root .tab:not(.active):hover{background:var(--blu-050)}

/* PANELS */
.ecba-root .panel{display:none;animation:ecba-fade .25s ease}.ecba-root .panel.show{display:block;background:var(--white);border:1px solid var(--grey-line);border-top:none;padding:24px}
@keyframes ecba-fade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
.ecba-root .view-lab{font-size:11px;font-weight:700;letter-spacing:.16em;color:var(--text-soft);text-transform:uppercase;margin:26px 0 6px}
.ecba-root .view-h{font-size:27px;font-weight:800;letter-spacing:-.02em;margin-bottom:6px}
.ecba-root .view-intro{font-size:14.5px;color:var(--text-muted);max-width:780px} .ecba-root .view-intro b{color:var(--text-main)}

/* info icon (SVG, come la sezione Impatto) + popover al click */
.ecba-root .info-i{display:inline-flex;width:16px;height:16px;align-items:center;justify-content:center;color:#A3A3AA;cursor:pointer;vertical-align:middle}
.ecba-root .info-i svg{width:16px;height:16px;stroke:currentColor;fill:none}
.ecba-root .info-i:hover,.ecba-root .info-i.open{color:var(--blu-500)}
.ecba-pop{position:absolute;z-index:1500;width:340px;max-width:calc(100vw - 16px);background:#fff;border-left:2px solid #5B21F7;padding:14px 16px;box-shadow:0 12px 32px rgba(14,14,16,.18);display:none}
.ecba-pop.show{display:block}
.ecba-pop p{font-size:13px;line-height:1.55;color:#2B2B2E;margin:0}
.ecba-pop b{color:#0E0E10;font-weight:700}

/* SECTION HEADER */
.ecba-root .sec-head{display:flex;align-items:center;gap:8px;font-size:18px;font-weight:800;margin:30px 0 3px;letter-spacing:-.01em}
.ecba-root .sec-sub{font-size:13.5px;color:var(--text-muted);margin-bottom:16px}

/* KPI CARDS */
.ecba-root .kpi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.ecba-root .kpi{background:var(--white);border:1px solid var(--grey-line);padding:22px 24px}
.ecba-root .kpi-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}
.ecba-root .kpi-id{display:flex;align-items:center;gap:10px}
.ecba-root .kpi-ic{width:22px;height:22px;flex:0 0 22px}
.ecba-root .kpi-ic svg{width:22px;height:22px;stroke:var(--blu-500);fill:none}
.ecba-root .kpi-label{font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--text-main)}
.ecba-root .kpi-num{font-size:34px;font-weight:800;letter-spacing:-.02em;line-height:1}
.ecba-root .kpi-unit{font-size:17px;font-weight:700;color:var(--text-muted)}
.ecba-root .kpi-desc{font-size:12.5px;color:var(--text-muted);margin-top:11px}
.ecba-root .kpi-desc .ok{color:var(--green-700);font-weight:700}

/* VERDICT */
.ecba-root .verdict{margin-top:16px;background:var(--green-100);border:1px solid #cde7d6;padding:18px 22px;display:flex;gap:14px;align-items:flex-start}
.ecba-root .verdict-ic{width:30px;height:30px;flex:0 0 30px;background:var(--green-700);display:flex;align-items:center;justify-content:center}
.ecba-root .verdict-ic svg{width:18px;height:18px;stroke:#fff;fill:none}
.ecba-root .verdict-txt{font-size:14px} .ecba-root .verdict-txt b{font-weight:800}
.ecba-root .verdict-txt .disc{display:block;margin-top:6px;font-size:12.5px;color:var(--text-muted)}

/* CARD + CHART */
.ecba-root .card{background:var(--white);border:1px solid var(--grey-line);margin-top:16px;padding:24px 26px}
.ecba-root .card-h{display:flex;align-items:center;gap:8px;font-size:16px;font-weight:800;letter-spacing:-.01em}
.ecba-root .card-sub{font-size:13px;color:var(--text-muted);margin-top:3px;max-width:740px}
.ecba-root .chart-box{margin-top:20px;overflow-x:auto}
.ecba-root svg.chart{width:100%;height:auto;display:block;overflow:visible;margin:0 auto}
.ecba-root #svg-wf{max-width:720px}
.ecba-root #svg-cf{max-width:760px}
.ecba-root #svg-mc{max-width:760px}
.ecba-root #svg-heat{max-width:720px}
.ecba-root #svg-dn{width:420px !important;max-width:420px !important;flex:0 0 420px !important}
/* due grafici spider affiancati */
.ecba-root .card-row{display:flex;gap:16px;align-items:stretch}
.ecba-root .card-row > .card{flex:1 1 0;min-width:0;margin-top:16px}
.ecba-root .legend{display:flex;flex-wrap:wrap;gap:10px 12px;margin-top:18px}
.ecba-root .lg{display:flex;align-items:center;gap:8px;font-size:13px}
.ecba-root .lg .sw{width:13px;height:13px;flex:0 0 13px}
.ecba-root .lg-chip{display:flex;align-items:center;gap:8px;font-size:12.5px;border:1px solid var(--grey-line);padding:6px 11px;cursor:pointer;user-select:none;background:#fff}
.ecba-root .lg-chip .sw{width:11px;height:11px;flex:0 0 11px}
.ecba-root .lg-chip.off{opacity:.4} .ecba-root .lg-chip:hover{border-color:var(--blu-400)}

.ecba-root .read{margin-top:18px;background:var(--grey-light);border:1px solid var(--grey-line);padding:16px 20px}
.ecba-root .read h5{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--blu-600);margin-bottom:8px}
.ecba-root .read p{font-size:13.5px;color:#33343f;margin-bottom:8px} .ecba-root .read p:last-child{margin-bottom:0} .ecba-root .read b{color:var(--text-main);font-weight:700}
.ecba-root .read .key{font-weight:800;color:var(--blu-700)}
.ecba-root .takeaway{margin-top:18px;border-left:3px solid var(--blu-500);padding:4px 0 4px 16px;font-size:13.5px}
.ecba-root .takeaway b{font-weight:800}

.ecba-root .ax-line{stroke:var(--grey-line);stroke-width:1}
.ecba-root .ax-zero{stroke:#bdbdb7;stroke-width:1.4}
.ecba-root .ax-txt{fill:var(--text-soft);font-size:11px;font-family:inherit}
.ecba-root .bar-lbl{fill:var(--text-main);font-size:11.5px;font-weight:700;font-family:inherit}
.ecba-root .connector{stroke:#c4c4be;stroke-width:1;stroke-dasharray:3 3}
.ecba-root .chart-hit{cursor:pointer;pointer-events:all}
.ecba-root .chart-hit:hover{filter:brightness(.96)}
.ecba-root .chart-point{cursor:pointer;pointer-events:all;transition:r .12s ease,opacity .12s ease}
.ecba-root .chart-tip{position:absolute;z-index:1600;display:none;min-width:190px;max-width:280px;background:#fff;border-left:2px solid var(--blu-500);box-shadow:0 12px 32px rgba(14,14,16,.18);padding:12px 14px;pointer-events:none}
.ecba-root .chart-tip.show{display:block}
.ecba-root .chart-tip .ct-lab{font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--text-soft);margin-bottom:5px}
.ecba-root .chart-tip .ct-val{font-size:17px;font-weight:800;color:var(--text-main);line-height:1.2}
.ecba-root .chart-tip .ct-sub{font-size:12.5px;color:var(--text-muted);line-height:1.45;margin-top:5px}

/* MODAL */
.ecba-root .modal-bg{position:fixed;inset:0;background:rgba(20,8,48,.55);display:none;z-index:1000;align-items:flex-start;justify-content:center;padding:40px 20px;overflow:auto}
.ecba-root .modal-bg.open{display:flex}
.ecba-root .modal{background:#fff;max-width:1020px;width:100%;border-top:4px solid var(--blu-500)}
.ecba-root .modal-head{display:flex;align-items:flex-start;justify-content:space-between;padding:22px 30px 18px;border-bottom:1px solid var(--grey-line)}
.ecba-root .modal-head .ml{font-size:12px;font-weight:700;letter-spacing:.08em;color:var(--blu-600);text-transform:uppercase}
.ecba-root .modal-head h2{font-size:22px;font-weight:800;letter-spacing:-.02em;margin-top:4px}
.ecba-root .modal-x{border:none;background:none;font-size:24px;cursor:pointer;color:var(--text-muted);line-height:1;padding:2px 6px}.ecba-root .modal-x:hover{color:var(--text-main)}
.ecba-root .modal-body{display:grid;grid-template-columns:230px 1fr}
.ecba-root .m-nav{border-right:1px solid var(--grey-line);padding:18px 0}
.ecba-root .m-nav a{display:block;padding:9px 22px 9px 30px;font-size:13px;color:var(--text-muted);cursor:pointer;border-left:3px solid transparent;line-height:1.35}
.ecba-root .m-nav a .nn{font-size:10px;font-weight:700;color:var(--text-soft);margin-right:7px}
.ecba-root .m-nav a:hover{background:var(--grey-light)}
.ecba-root .m-nav a.on{color:var(--blu-700);font-weight:700;border-left-color:var(--blu-500);background:var(--blu-050)}
.ecba-root .m-content{padding:24px 36px 40px;max-height:74vh;overflow:auto}
.ecba-root .m-callout{background:var(--blu-050);border-left:3px solid var(--blu-500);padding:16px 18px;font-size:13.5px;margin-bottom:26px}
.ecba-root .m-content section{margin-bottom:30px;scroll-margin-top:10px}
.ecba-root .m-content section .sn{font-size:11px;font-weight:700;color:var(--text-soft);margin-right:8px}
.ecba-root .m-content h3{font-size:18px;font-weight:800;margin-bottom:8px;letter-spacing:-.01em}
.ecba-root .m-content p{font-size:13.5px;color:#33343f;margin-bottom:10px} .ecba-root .m-content b{color:var(--text-main)}
.ecba-root .m-content ul{margin:0 0 10px 20px;font-size:13.5px;color:#33343f} .ecba-root .m-content li{margin-bottom:5px}
.ecba-root .formula{background:var(--grey-light);border:1px solid var(--grey-line);padding:12px 16px;font-family:"SFMono-Regular",Consolas,monospace;font-size:13px;margin:8px 0 12px}

@media(max-width:820px){
  .ecba-root{padding:16px}
  .ecba-root .wrap{min-height:calc(100vh - 32px);padding:0 0 70px}
  .ecba-root .simple-banner{margin-top:24px}
  .ecba-root .panel.show{padding:18px 16px}
  .ecba-root #svg-dn{width:280px !important;max-width:100% !important;flex:0 1 280px !important}
  .ecba-root .head-cols,.ecba-root .kpi-grid,.ecba-root .tabs{grid-template-columns:1fr}
  .ecba-root .hcol+.hcol{border-left:none;border-top:1px solid var(--grey-line)}
  .ecba-root .tab{border-right:none;border-bottom:1px solid var(--grey-line)}
  .ecba-root .modal-body{grid-template-columns:1fr}.ecba-root .m-nav{display:none}
  .ecba-root .card-row{flex-direction:column;gap:0}
}
`;

// Stessa icona usata nella dashboard del progetto (ProjectDetail → analysis-ecba.png)
const ECBA_ICON = `${import.meta.env.BASE_URL || "/"}icons/analysis-ecba.png`;

const MARKUP = `
<div class="wrap">

  <div class="crumb"><span class="crumb-back" style="cursor:pointer">Dettaglio del progetto</span> <span class="crumb-sep">›</span> <b>Analisi Economica Costi-Benefici</b></div>
  <div class="meta-line">Creato il 12/05/2025 da Comune di Palermo, Mario Rossi — Ultima modifica 03/06/2026</div>

  <!-- HEADER -->
  <div class="head-card">
    <div class="head-top">
      <div class="head-left">
        <div class="head-icon">
          <img src="${ECBA_ICON}" alt="Analisi Costi-Benefici" />
        </div>
        <div>
          <div class="head-title">Analisi Economica Costi-Benefici</div>
          <div class="head-sub">Del progetto <b>Nuovo asilo nido comunale</b></div>
        </div>
      </div>
      <div class="head-actions">
        <button class="h-action js-metodologia"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/></svg>Metodologia</button>
        <button class="h-action"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 11l5 5 5-5M5 21h14"/></svg>Scarica report</button>
        <button class="btn-excel"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 11l5 5 5-5M5 21h14"/></svg>Scarica Excel</button>
      </div>
    </div>
    <div class="head-cols">
      <div class="hcol"><div class="lab">Categoria di intervento</div><div class="val">Scuole e asili</div></div>
      <div class="hcol"><div class="lab">Orizzonte temporale</div><div class="val">30 anni</div></div>
      <div class="hcol"><div class="lab">Tasso di sconto sociale</div><div class="val">3,0%</div></div>
    </div>
  </div>

  <!-- BANNER -->
  <div class="simple-banner">
    <div class="sb-left">
      <div class="sb-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/><circle cx="12" cy="12" r="3.2"/></svg></div>
      <div><div class="sb-title">La convenienza in parole semplici</div><div class="sb-desc">60 secondi per capire se l'opera conviene alla collettività, senza termini tecnici.</div></div>
    </div>
    <div class="sb-cta">Inizia →</div>
  </div>

  <!-- TABS -->
  <div class="tabs" id="tabs">
    <button class="tab active" data-p="sintesi"><div class="t-name">Sintesi</div><div class="t-kpi">Valore Attuale Netto Economico +12,4 M€</div></button>
    <button class="tab" data-p="ecba"><div class="t-name">Analisi Economica Costi-Benefici</div><div class="t-kpi">Rapporto Benefici/Costi 1,30</div></button>
    <button class="tab" data-p="sens"><div class="t-name">Analisi del Rischio</div><div class="t-kpi">Valore Attuale Netto Economico &gt; 0 · 92%</div></button>
  </div>

  <!-- ================= PANEL · SINTESI ================= -->
  <div class="panel show" id="p-sintesi">
    <div class="view-lab">Vista</div>
    <div class="view-h">Sintesi della convenienza</div>
    <div class="view-intro">Investimento di partenza <b>41,1 M€</b> nella provincia di Palermo, valutato su <b>30 anni</b> e attualizzato al <b>3%</b>. Gli indicatori misurano la convenienza <b>economico-sociale</b> dell'opera, non la sua redditività finanziaria.</div>

    <div class="sec-head">I risultati dell'analisi <span class="info-i" data-tip="I tre indicatori standard dell'analisi economica costi-benefici, calcolati su flussi attualizzati al tasso sociale del 3%.">i</span></div>
    <div class="sec-sub">Gli indicatori sintetici di efficienza economico-sociale</div>

    <div class="kpi-grid">
      <div class="kpi">
        <div class="kpi-top"><div class="kpi-id"><span class="kpi-ic"><svg viewBox="0 0 24 24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M15 9.3a3.5 3.5 0 1 0 0 5.4M8 11h5M8 13h4"/></svg></span><span class="kpi-label" style="text-transform:none;letter-spacing:0">Valore Attuale Netto Economico</span></div>
          <span class="info-i" data-tip="Valore Attuale Netto Economico — somma, anno per anno, della differenza tra benefici e costi economici, riportata a valore di oggi. È l'indicatore primario: l'opera conviene se è maggiore di zero.">i</span></div>
        <div class="kpi-num">+12,4<span class="kpi-unit"> M€</span></div>
        <div class="kpi-desc">Beneficio netto per la collettività · <span class="ok">&gt; 0, conveniente</span></div>
      </div>
      <div class="kpi">
        <div class="kpi-top"><div class="kpi-id"><span class="kpi-ic"><svg viewBox="0 0 24 24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="7.5" cy="7.5" r="2"/><circle cx="16.5" cy="16.5" r="2"/></svg></span><span class="kpi-label">TIR economico</span></div>
          <span class="info-i" data-tip="Tasso Interno di Rendimento Economico — il rendimento sociale dell'opera, cioè il tasso a cui benefici e costi attualizzati si pareggiano. Conviene se supera il tasso di sconto sociale (3%).">i</span></div>
        <div class="kpi-num">5,8<span class="kpi-unit"> %</span></div>
        <div class="kpi-desc">Rendimento sociale dell'opera · <span class="ok">&gt; 3%, conveniente</span></div>
      </div>
      <div class="kpi">
        <div class="kpi-top"><div class="kpi-id"><span class="kpi-ic"><svg viewBox="0 0 24 24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M5 21h14M6 7h12"/><path d="M6 7 3.5 12h5L6 7zM18 7l-2.5 5h5L18 7z"/></svg></span><span class="kpi-label">Rapporto B/C</span></div>
          <span class="info-i" data-tip="Rapporto Benefici/Costi — quanti euro di beneficio economico genera ogni euro di costo. Utile per confrontare alternative progettuali. Conviene se B/C > 1.">i</span></div>
        <div class="kpi-num">1,30</div>
        <div class="kpi-desc">1,30 € di beneficio per ogni euro speso · <span class="ok">&gt; 1, conveniente</span></div>
      </div>
    </div>

    <div class="verdict">
      <div class="verdict-ic"><svg viewBox="0 0 24 24" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>
      <div class="verdict-txt"><b>L'opera risulta conveniente per la collettività.</b> Sull'orizzonte di analisi i benefici economici stimati superano i costi sociali: i tre indicatori sono concordi.
        <span class="disc">Valori a prezzi economici (prezzi ombra), in valore attuale al 3%. È una stima dell'effetto sul benessere sociale a parità di altre condizioni, non un rendimento finanziario garantito.</span></div>
    </div>

    <div class="sec-head">Come si forma il valore netto <span class="info-i" data-tip="Grafico a cascata: dai benefici economici totali si sottraggono i costi e le esternalità negative, ottenendo il Valore Attuale Netto Economico.">i</span></div>
    <div class="sec-sub">Dai benefici totali ai costi e alle esternalità negative, fino al beneficio netto</div>
    <div class="card">
      <div class="card-h">Ponte costi-benefici</div>
      <div class="card-sub">Valori attuali in M€ · orizzonte 30 anni · tasso 3%.</div>
      <div class="chart-box"><svg id="svg-wf" class="chart" viewBox="0 0 760 340"></svg></div>
      <div class="read"><h5>Come si legge</h5>
        <p>La prima barra <span style="color:var(--lime-700);font-weight:800">lime</span> è il totale dei <b>benefici economici</b> attualizzati. La barra <span style="font-weight:800;color:#7a7a72">grigia</span> sono i <b>costi economici</b> (CAPEX e OPEX): è "sospesa", parte dall'alto dei benefici e scende. La barra <span style="color:var(--red-600);font-weight:800">rossa</span> sono le <b>esternalità negative</b> monetizzate, che scendono ancora.</p>
        <p>Ciò che resta sotto è la barra <span style="color:var(--blu-700);font-weight:800">viola</span>, il <b>Valore Attuale Netto Economico</b>. Sopra lo zero significa guadagno netto di benessere per la collettività.</p></div>
      <div class="takeaway"><b>53,1 M€</b> di benefici contro <b>36,2 M€</b> di costi e <b>4,5 M€</b> di esternalità negative: saldo a favore della collettività <b>+12,4 M€</b>.</div>
    </div>
  </div>

  <!-- ================= PANEL · ECBA ================= -->
  <div class="panel" id="p-ecba">
    <div class="view-lab">Vista</div>
    <div class="view-h">Flussi economici nel tempo</div>
    <div class="view-intro">L'andamento di <b>tutti i benefici e i costi</b> lungo i 30 anni: il <b>CAPEX</b> concentrato nei primi anni di costruzione, l'<b>OPEX</b> di gestione distribuito nel tempo, i benefici che maturano dall'entrata in esercizio. Tutti i valori sono cumulati e attualizzati al 3%.</div>

    <div class="card">
      <div class="card-h">Flusso di cassa economico cumulato <span class="info-i" data-tip="Ogni linea è la somma progressiva nel tempo. Il flusso netto è la differenza fra benefici e costi cumulati.">i</span></div>
      <div class="card-sub">Seleziona le voci da visualizzare. Valori in M€, cumulati e attualizzati.</div>
      <div class="chart-box"><svg id="svg-cf" class="chart" viewBox="0 0 760 400"></svg></div>
      <div class="legend" id="cf-legend"></div>
      <div class="read"><h5>Come si legge</h5>
        <p>L'asse orizzontale è il <b>tempo</b> (anni dall'avvio). La linea <span style="color:var(--red-600);font-weight:800">dei costi</span> è mostrata <b>in negativo</b>: scende subito per il <b>CAPEX</b> di costruzione, poi prosegue piano in basso con l'<b>OPEX</b> annuale. La linea <span style="color:var(--green-700);font-weight:800">dei benefici</span> parte da zero e cresce man mano che il servizio produce effetti.</p>
        <p>La linea <span class="key">viola</span> è il <b>flusso netto cumulato</b> (benefici − costi): è negativa nei primi anni, poi risale. Il punto in cui supera lo zero è il <b>payback sociale</b> — quando l'opera ha restituito alla collettività quanto è costata.</p></div>
      <div class="takeaway">Il flusso netto torna positivo intorno all'<b>anno 14</b> e chiude a <b>+12,4 M€</b> a fine orizzonte.</div>
    </div>

    <div class="card">
      <div class="card-h">Composizione dei benefici <span class="info-i" data-tip="Quota di ciascuna esternalità sul totale dei benefici economici attualizzati.">i</span></div>
      <div class="card-sub">Da cosa sono fatti i 53,1 M€ di benefici (valori attuali).</div>
      <div class="chart-box" style="display:flex;gap:30px;align-items:center;flex-wrap:wrap">
        <svg id="svg-dn" class="chart" viewBox="0 0 300 300" style="max-width:300px;flex:0 0 280px"></svg>
        <div class="legend" id="dn-legend" style="flex:1;flex-direction:column;align-items:stretch;gap:12px;margin-top:0"></div>
      </div>
      <div class="read"><h5>Come si legge</h5>
        <p>Ogni spicchio è una <b>fonte di beneficio</b> e la sua ampiezza è la quota sul totale. La voce maggiore è la <b>partecipazione al lavoro</b> resa possibile dal servizio; seguono capitale umano e costi di cura evitati.</p>
        <p>Sono effetti <b>lordi</b>, stimati a parità di altre condizioni: non si sommano automaticamente ad altri indicatori del progetto.</p></div>
    </div>
  </div>

  <!-- ================= PANEL · ANALISI DEL RISCHIO ================= -->
  <div class="panel" id="p-sens">
    <div class="view-lab">Vista</div>
    <div class="view-h">Analisi del rischio</div>
    <div class="view-intro">Quanto è <b>solido</b> il risultato se cambiano le ipotesi di base. Si individuano le variabili più critiche, se ne misura l'<b>elasticità</b> e il <b>contributo all'incertezza</b>, e si stima — con una simulazione probabilistica — la <b>probabilità che l'opera resti conveniente</b>.</div>

    <div class="sec-head">Robustezza del risultato <span class="info-i" data-tip="Sintesi della simulazione Montecarlo sulle variabili critiche.">i</span></div>
    <div class="sec-sub">L'esito della valutazione di fronte all'incertezza</div>
    <div class="kpi-grid">
      <div class="kpi">
        <div class="kpi-top"><div class="kpi-id"><span class="kpi-ic"><svg viewBox="0 0 24 24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18c3 0 4.5-11 9-11s6 11 9 11"/><line x1="3" y1="18" x2="21" y2="18"/></svg></span><span class="kpi-label">Probabilità Valore Attuale Netto Economico &gt; 0</span></div>
          <span class="info-i" data-tip="Quota di simulazioni Montecarlo (su 10.000) in cui il Valore Attuale Netto Economico resta positivo. Sintetizza la rischiosità complessiva del progetto.">i</span></div>
        <div class="kpi-num">92<span class="kpi-unit"> %</span></div>
        <div class="kpi-desc">Su 10.000 scenari simulati · <span class="ok">rischio contenuto</span></div>
      </div>
      <div class="kpi">
        <div class="kpi-top"><div class="kpi-id"><span class="kpi-ic"><svg viewBox="0 0 24 24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12"/><line x1="12" y1="4" x2="12" y2="20"/></svg></span><span class="kpi-label">Valore Attuale Netto Economico mediano</span></div>
          <span class="info-i" data-tip="Valore centrale della distribuzione del Valore Attuale Netto Economico risultante dalla simulazione. L'intervallo P5–P95 indica dove cade il 90% degli esiti.">i</span></div>
        <div class="kpi-num">+12,4<span class="kpi-unit"> M€</span></div>
        <div class="kpi-desc">Intervallo P5–P95: <b>−3,2 / +27,0 M€</b> · media ± dev.std <b>12,1 ± 8,5 M€</b></div>
      </div>
      <div class="kpi">
        <div class="kpi-top"><div class="kpi-id"><span class="kpi-ic"><svg viewBox="0 0 24 24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18V8M10 18V5M16 18v-7M22 18H2"/></svg></span><span class="kpi-label">Variabile critica</span></div>
          <span class="info-i" data-tip="La variabile che, al variare del ±1%, produce la maggiore variazione del Valore Attuale Netto Economico. Va monitorata con priorità.">i</span></div>
        <div class="kpi-num" style="font-size:22px;line-height:1.2">Costi di<br>investimento</div>
        <div class="kpi-desc">Maggiore impatto sul risultato</div>
      </div>
    </div>

    <div class="card-row">
      <div class="card">
        <div class="card-h">Elasticità del Valore Attuale Netto Economico ai parametri <span class="info-i" data-tip="Per ogni parametro, di quanto cambia (in percentuale) il Valore Attuale Netto Economico al variare dell'1% del parametro. Più il profilo è esteso, più il risultato è sensibile.">i</span></div>
        <div class="card-sub">Variazione % del Valore Attuale Netto Economico per +1% del parametro.</div>
        <div class="chart-box" style="display:flex;justify-content:center"><svg id="svg-elastic" class="chart" viewBox="0 0 460 380" style="max-width:420px"></svg></div>
        <div class="read"><h5>Come si legge</h5>
          <p>Ogni raggio è un parametro e la distanza dal centro è l'<b>elasticità</b> |ε| del Valore Attuale Netto Economico. Un profilo "appuntito" verso un asse segnala che quel parametro <b>domina</b> il risultato.</p>
          <p>Qui i <b>costi di investimento</b> e i <b>parametri delle esternalità</b> sono i raggi più estesi.</p></div>
      </div>

      <div class="card">
        <div class="card-h">Incertezza dei parametri — contributo alla varianza <span class="info-i" data-tip="Quota normalizzata (0–100%) con cui ciascun parametro contribuisce alla varianza del Valore Attuale Netto Economico nelle simulazioni Montecarlo.">i</span></div>
        <div class="card-sub">Contributo normalizzato [0–100%] di ciascun parametro alla varianza complessiva.</div>
        <div class="chart-box" style="display:flex;justify-content:center"><svg id="svg-variance" class="chart" viewBox="0 0 460 380" style="max-width:420px"></svg></div>
        <div class="read"><h5>Come si legge</h5>
          <p>Mentre l'elasticità misura la sensitività <b>marginale</b>, questo radar mostra <b>quanto</b> ciascun parametro pesa sull'incertezza complessiva, tenendo conto di quanto può realmente variare.</p>
          <p>I parametri ad alta elasticità e ampia variabilità — qui i <b>costi di investimento</b> — sono da presidiare con stime più accurate.</p></div>
      </div>
    </div>

    <div class="card">
      <div class="card-h">Distribuzione probabilistica del Valore Attuale Netto Economico <span class="info-i" data-tip="Simulazione Montecarlo: distribuzione di frequenza del Valore Attuale Netto Economico assegnando distribuzioni di probabilità alle variabili critiche.">i</span></div>
      <div class="card-sub">10.000 simulazioni · frequenza degli esiti del Valore Attuale Netto Economico (M€).</div>
      <div class="chart-box"><svg id="svg-mc" class="chart" viewBox="0 0 760 340"></svg></div>
      <div class="legend">
        <div class="lg"><span class="sw" style="background:var(--red-600)"></span><span>Scenari con Valore Attuale Netto Economico &lt; 0 (8%)</span></div>
        <div class="lg"><span class="sw" style="background:var(--green-700)"></span><span>Scenari con Valore Attuale Netto Economico &gt; 0 (92%)</span></div>
      </div>
      <div class="read"><h5>Come si legge</h5>
        <p>Ogni barra conta <b>quante simulazioni</b> hanno prodotto un Valore Attuale Netto Economico in quell'intervallo. Le barre <span style="color:var(--red-600);font-weight:800">rosse</span> a sinistra dello zero sono gli scenari sfavorevoli (opera non conveniente), quelle <span style="color:var(--green-700);font-weight:800">verdi</span> a destra gli scenari favorevoli.</p>
        <p>Il <b>92%</b> della distribuzione cade a destra dello zero: anche tenendo conto dell'incertezza, l'opera resta conveniente nella larga maggioranza degli scenari.</p></div>
    </div>

    <div class="card">
      <div class="card-h">Sensitività combinata Costi × Benefici <span class="info-i" data-tip="Mappa di calore del Valore Attuale Netto Economico al variare simultaneo dei moltiplicatori di costo (righe) e di beneficio (colonne).">i</span></div>
      <div class="card-sub">Valore Attuale Netto Economico (M€) per ogni combinazione di moltiplicatori. Verde = positivo, Rosso = negativo.</div>
      <div class="chart-box"><svg id="svg-heat" class="chart" viewBox="0 0 760 360"></svg></div>
      <div class="legend">
        <div class="lg"><span class="sw" style="background:#b71c1c"></span><span>Valore Attuale Netto Economico negativo</span></div>
        <div class="lg"><span class="sw" style="background:#1b5e20"></span><span>Valore Attuale Netto Economico positivo</span></div>
      </div>
      <div class="read"><h5>Come si legge</h5>
        <p>Ogni cella incrocia un <b>moltiplicatore di costo</b> (riga) con un <b>moltiplicatore di beneficio</b> (colonna): mostra quanto vale il Valore Attuale Netto Economico in quello scenario. Le celle <span style="color:#1b5e20;font-weight:800">verdi</span> restano convenienti, quelle <span style="color:var(--red-600);font-weight:800">rosse</span> no.</p>
        <p>La diagonale di celle chiare individua la <b>soglia di pareggio</b>: finché costi e benefici non si discostano troppo dalla stima base, l'opera resta conveniente.</p></div>
    </div>
  </div>

  <!-- ===== MODAL ===== -->
  <div class="modal-bg" id="modal">
    <div class="modal">
      <div class="modal-head"><div><div class="ml">Nota metodologica</div><h2>Come è stata costruita l'analisi economica costi-benefici</h2></div>
        <button class="modal-x js-modal-x">×</button></div>
      <div class="modal-body">
        <nav class="m-nav" id="mnav">
          <a class="on" data-s="s1"><span class="nn">01</span>Scopo e approccio</a>
          <a data-s="s2"><span class="nn">02</span>Riferimenti normativi</a>
          <a data-s="s3"><span class="nn">03</span>Obiettivi e perimetro</a>
          <a data-s="s4"><span class="nn">04</span>Orizzonte e tasso di sconto</a>
          <a data-s="s5"><span class="nn">05</span>Struttura dei costi economici</a>
          <a data-s="s6"><span class="nn">06</span>Prezzi ombra: il razionale</a>
          <a data-s="s7"><span class="nn">07</span>Matrice di Contabilità Sociale</a>
          <a data-s="s8"><span class="nn">08</span>Coefficienti di conversione</a>
          <a data-s="s9"><span class="nn">09</span>Le esternalità</a>
          <a data-s="s10"><span class="nn">10</span>Indicatori di performance</a>
          <a data-s="s11"><span class="nn">11</span>Analisi del rischio</a>
        </nav>
        <div class="m-content" id="mcontent">
          <div class="m-callout">L'Analisi Costi-Benefici (ACB) misura la variazione di <b>benessere sociale</b> generata da una decisione di investimento, valutando a <b>prezzi economici</b> guadagni e perdite per la collettività. A differenza dell'analisi finanziaria — che guarda solo ai flussi di cassa dell'operatore — adotta come destinatario <b>l'insieme dei soggetti</b> che beneficiano degli effetti dell'opera o ne sostengono gli impatti.</div>

          <section id="s1"><h3><span class="sn">01</span>Scopo e approccio</h3>
            <p>L'ACB è uno strumento analitico che valuta la <b>convenienza economico-sociale</b> di investimenti in opere pubbliche e infrastrutture. L'impostazione è coerente con le principali linee guida nazionali e internazionali ed è applicabile sia <b>ex-ante</b> (a stima) sia <b>ex-post</b> (a consuntivo).</p>
            <p>Il documento metodologico copre: il quadro di riferimento normativo; l'impostazione dell'analisi economica; la determinazione dei prezzi ombra tramite le matrici di contabilità sociale; la classificazione e monetizzazione delle esternalità; il calcolo degli indicatori di performance; l'analisi del rischio. Le scelte tecniche sono orientate alla <b>replicabilità</b> e alla <b>trasparenza</b> del processo valutativo.</p></section>

          <section id="s2"><h3><span class="sn">02</span>Riferimenti normativi e metodologici</h3>
            <p>L'impostazione trae fondamento da un insieme consolidato di linee guida che rappresentano lo stato dell'arte nella valutazione degli investimenti pubblici:</p>
            <ul>
              <li><b>Guide to Cost-Benefit Analysis of Investment Projects</b> — Commissione Europea, DG Regio (2014): struttura, indicatori e parametri di riferimento per la politica di coesione.</li>
              <li><b>Economic Appraisal Vademecum</b> — Commissione Europea (2021): aggiornamento delle prassi dell'analisi economica per progetti co-finanziati dai Fondi strutturali.</li>
              <li><b>Linee Guida Operative (LGO)</b> — MIT, Struttura Tecnica di Missione (2021): indirizzo nazionale con parametri unitari calibrati sul contesto italiano (valori del tempo, fattori di emissione, prezzi ombra del lavoro).</li>
              <li><b>Cost-Benefit Analysis in World Bank Projects</b> — IBRD (2010): riferimento per contesti di mercato imperfetto o in via di sviluppo.</li>
              <li><b>Public Investment Management Assessment</b> — IMF (2018): framework per la qualità dei processi decisionali nell'investimento pubblico.</li>
            </ul></section>

          <section id="s3"><h3><span class="sn">03</span>Impostazione: obiettivi e perimetro</h3>
            <p>L'analisi economica persegue due operazioni fondamentali:</p>
            <ul>
              <li><b>Monetizzazione</b> — misurare guadagni e perdite di un insieme di individui più ampio degli stakeholder diretti, usando il denaro come unità di misura.</li>
              <li><b>Aggregazione</b> — sommare le valutazioni monetarie dei singoli, esprimendole come guadagni e perdite sociali.</li>
            </ul>
            <p>Lo strumento di calcolo principale è il <b>Discounted Cash Flow (DCF) in ottica economica</b>: i flussi di cassa finanziari sono trasformati in flussi economici tramite <b>coefficienti di conversione</b> (prezzi ombra) e integrati con le esternalità sociali. Si ottiene così l'impatto netto dell'investimento sulla collettività.</p></section>

          <section id="s4"><h3><span class="sn">04</span>Orizzonte temporale e tasso di sconto</h3>
            <p>L'orizzonte dipende dalla tipologia di opera: tipicamente <b>20–30 anni</b> dalla vita utile degli asset principali; per opere stradali e di mobilità le LGO indicano <b>30 anni</b> dall'entrata in esercizio.</p>
            <p>Il <b>tasso di sconto sociale</b> adottato è il <b>3%</b> (LGO, in recepimento del Reg. di esecuzione UE n. 207/2015): riflette il costo-opportunità sociale del capitale. Tutti i flussi futuri di costi e benefici sono <b>attualizzati</b> a questo tasso per ottenere valori attuali (VA).</p></section>

          <section id="s5"><h3><span class="sn">05</span>Struttura dei costi economici</h3>
            <p>Tutte le voci sono convertite a prezzi ombra tramite i fattori di conversione settoriali:</p>
            <ul>
              <li><b>Costi di investimento (CAPEX)</b> — costruzione, oneri tecnici, progettazione.</li>
              <li><b>Costi di gestione e manutenzione ordinaria (OPEX)</b> — esercizio, personale, servizi, manutenzione programmata.</li>
              <li><b>Rinnovi e manutenzione straordinaria</b> — componenti con vita utile inferiore all'orizzonte di analisi.</li>
              <li><b>Valore residuo</b> — valore economico dell'opera a fine periodo, stimato per ammortamento lineare secondo le LGO.</li>
            </ul></section>

          <section id="s6"><h3><span class="sn">06</span>Prezzi ombra: il razionale</h3>
            <p>Per passare dall'ottica finanziaria a quella economica le grandezze a <b>prezzi di mercato</b> vengono trasformate in valori a <b>prezzi ombra</b>, che rappresentano il <b>costo-opportunità sociale</b> delle risorse: il valore di un'unità di risorsa impiegata nel progetto è il beneficio cui la società rinuncia non potendola impiegare altrove.</p>
            <p>I prezzi ombra consentono inoltre di rappresentare correttamente il valore delle risorse dove i mercati sono <b>assenti o imperfetti</b>. I coefficienti di conversione sono stimati sulle <b>matrici di contabilità sociale (SAM)</b> del territorio di riferimento, garantendo coerenza con le strutture produttive locali e regionali.</p></section>

          <section id="s7"><h3><span class="sn">07</span>La Matrice di Contabilità Sociale (SAM)</h3>
            <p>La SAM è uno strumento di equilibrio economico generale derivato dalla matrice <b>input-output di Leontief</b>. Rispetto a quest'ultima integra il processo <b>distributivo e redistributivo del reddito</b> includendo i conti dei settori istituzionali (famiglie, imprese, governo, formazione del capitale, resto del mondo) e rappresenta così il flusso circolare del reddito nell'economia.</p>
            <p>La SAM impiegata descrive l'economia italiana disaggregata in <b>63 settori ATECO</b> secondo la classificazione ISTAT (tavole input-output 2022), con <b>dettaglio provinciale</b> per l'intero territorio italiano: cattura sia gli scambi B2B fra settori sia la redistribuzione del reddito fra famiglie, imprese e Stato.</p></section>

          <section id="s8"><h3><span class="sn">08</span>Coefficienti di conversione</h3>
            <p>La stima dei prezzi ombra dei settori segue l'approccio semi-input-output di <b>Weiss (1988)</b> e <b>Potts (2012)</b>, in tre fasi.</p>
            <p><b>1.</b> Determinare la composizione degli input produttivi in fattori primari tramite le tavole input-output:</p>
            <div class="formula">M = F · (I − A)⁻¹</div>
            <p>dove <b>A</b> è la matrice dei coefficienti tecnici e <b>F</b> la matrice dei coefficienti dei fattori primari.</p>
            <p><b>2.</b> Assegnare i valori iniziali ai prezzi ombra dei fattori primari: input intermedi importati = 1 (prezzi internazionali concorrenziali); lavoro = salario ombra</p>
            <div class="formula">SW = NW · (1 − u) · (1 − t)</div>
            <p>con <b>NW</b> salario nominale, <b>u</b> tasso di disoccupazione, <b>t</b> aliquota fiscale; capitale = <b>Average Conversion Factor (ACF)</b>; imposte indirette nette = 0.</p>
            <p><b>3.</b> Calcolare i prezzi ombra dei settori come medie ponderate e iterare la stima dell'ACF fino a convergenza:</p>
            <div class="formula">P* = Pf* · M</div>
            <p>I prezzi ombra risultanti sono i coefficienti applicati alle voci di costo finanziario per ottenere i valori economici.</p></section>

          <section id="s9"><h3><span class="sn">09</span>Le esternalità</h3>
            <p>Le esternalità sono effetti, positivi o negativi, non contabilizzati nei flussi finanziari del progetto, che ricadono su soggetti terzi. Vengono <b>monetizzate</b> con i parametri unitari delle LGO, dell'<i>Handbook on the External Costs of Transport</i> della CE e tecniche di shadow pricing, per renderle confrontabili con i costi e ricondurle a un unico indicatore.</p>
            <ul>
              <li><b>Risparmio di tempo</b> — distinto per motivo dello spostamento (lavoro: business 20% / pendolarismo 80%, ≈ 11,28 €/pax·h locale; turismo 18,39 €/pax·h; altri motivi 12,26 €/pax·h) e per le merci (locali 8,52 €/ton·h, lunga distanza 6,35 €/ton·h).</li>
              <li><b>Emissioni nocive in atmosfera</b> (NOx, PM2.5, PM10, SO₂) — fattori unitari LGO applicati alle variazioni di traffico per modalità (es. 0,0023 €/v·km veicoli leggeri in autostrada, 0,015 €/v·km pesanti, 0,477 €/treno·km passeggeri, 1,569 €/treno·km merci).</li>
              <li><b>Emissioni climalteranti</b> — gas serra dai fattori di emissione per modalità; prezzo crescente fino al <b>Net Zero (2050)</b> (FuelEU Aviation/Maritime, PNIEC); dal 2051 il contributo è posto convenzionalmente a zero.</li>
              <li><b>Valore immobiliare e riqualificazione</b> — incremento di valore stimato con metodi <b>edonici</b> o per confronto; il recupero di aree dismesse è valorizzato col <b>costo evitato</b> degli interventi alternativi o col valore d'uso delle aree restituite alla collettività.</li>
            </ul></section>

          <section id="s10"><h3><span class="sn">10</span>Indicatori di performance</h3>
            <p>Il giudizio di convenienza è sintetizzato in tre indicatori, tutti su flussi attualizzati al tasso sociale (3%).</p>
            <p><b>VANE — Valore Attuale Netto Economico.</b> Somma dei saldi annuali tra benefici e costi economici, scontati sull'orizzonte:</p>
            <div class="formula">VANE = Σ (B<sub>t</sub> − C<sub>t</sub>) / (1 + r)<sup>t</sup></div>
            <p>Un <b>VANE &gt; 0</b> indica che i benefici per la collettività eccedono i costi sociali. È l'indicatore primario.</p>
            <p><b>TIRE — Tasso Interno di Rendimento Economico.</b> È il tasso che annulla il VANE: esprime il rendimento sociale del progetto. Un <b>TIRE &gt; 3%</b> è condizione necessaria per la convenienza. Non è calcolabile in assenza di flussi negativi iniziali o con flussi di segno non uniforme, casi in cui il VANE resta l'indicatore di riferimento.</p>
            <p><b>Rapporto Benefici/Costi.</b></p>
            <div class="formula">B/C = ( Σ B<sub>t</sub>/(1+r)<sup>t</sup> ) / ( Σ C<sub>t</sub>/(1+r)<sup>t</sup> )</div>
            <p>Un <b>B/C &gt; 1</b> indica convenienza ed è utile per ordinare scenari alternativi per efficienza relativa, a prescindere dalla scala dell'investimento. I tre indicatori sono <b>complementari</b> e vanno letti insieme.</p></section>

          <section id="s11"><h3><span class="sn">11</span>Analisi del rischio</h3>
            <p>Verifica la robustezza degli indicatori al variare delle ipotesi e quantifica la probabilità che il VANE resti positivo in presenza di incertezza, in due fasi.</p>
            <p><b>Analisi di sensitività.</b> Individua le <b>variabili critiche</b>: quelle la cui variazione del ±1% produce la maggiore variazione percentuale su B/C (o VANE). Soglia tipica di criticità: <b>±5% sul B/C</b> per una variazione del ±1% del parametro. Variabili tipiche: volume di traffico/utenza, costi di investimento e gestione, parametri di monetizzazione (valore del tempo, prezzo della CO₂), tasso di crescita della domanda.</p>
            <p><b>Simulazione Montecarlo.</b> Assegna distribuzioni di probabilità alle variabili critiche e calcola la distribuzione risultante di VANE e B/C. Convenzioni adottate:</p>
            <ul>
              <li><b>Costi di investimento e gestione</b> — distribuzione normale, media pari al valore base e deviazione standard del 10%, troncata a sinistra della media.</li>
              <li><b>Traffico e domanda</b> — distribuzione normale, media pari al tasso di crescita base (tipicamente 0%, per prudenza) e deviazione standard dell'1%.</li>
              <li><b>Parametri di monetizzazione</b> — distribuzioni asimmetriche dove la letteratura le fornisce, uniformi sull'intervallo di stima nei casi di maggiore incertezza.</li>
            </ul>
            <p>I risultati sono presentati come distribuzione di frequenza del VANE e del B/C, con <b>valore mediano</b>, <b>intervallo di confidenza al 95%</b> e <b>percentuale di simulazioni con VANE &gt; 0</b> — quest'ultima sintetizza la rischiosità complessiva del progetto.</p></section>
        </div>
      </div>
    </div>
  </div>

</div>
`;

export function EcbaResults({ project, onBack }) {
  const rootRef = useRef(null);
  const onBackRef = useRef(onBack);
  const projectRef = useRef(project);

  // Tiene i ref allineati alle prop senza scriverli durante il render.
  useEffect(() => {
    onBackRef.current = onBack;
    projectRef.current = project;
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const ac = new AbortController();
    const { signal } = ac;
    const q = (s) => root.querySelector(s);
    const qa = (s) => root.querySelectorAll(s);
    const chartTip = document.createElement("div");
    chartTip.className = "chart-tip";
    root.appendChild(chartTip);

    function htmlEscape(value) {
      return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
    }

    function fmt1(value) {
      return Number(value).toFixed(1).replace(".", ",");
    }

    function showChartTip(event, el) {
      chartTip.innerHTML = `
        <div class="ct-lab">${htmlEscape(el.dataset.tipLabel)}</div>
        <div class="ct-val">${htmlEscape(el.dataset.tipValue)}</div>
        ${el.dataset.tipSub ? `<div class="ct-sub">${htmlEscape(el.dataset.tipSub)}</div>` : ""}
      `;
      chartTip.classList.add("show");
      const rootRect = root.getBoundingClientRect();
      const tipW = 280;
      let left = event.clientX - rootRect.left + root.scrollLeft + 14;
      const maxLeft = root.clientWidth - tipW - 8;
      if (left > maxLeft) left = event.clientX - rootRect.left + root.scrollLeft - tipW - 14;
      chartTip.style.left = `${Math.max(8, left)}px`;
      chartTip.style.top = `${event.clientY - rootRect.top + root.scrollTop + 14}px`;
    }

    function closeChartTip() {
      chartTip.classList.remove("show");
    }

    function bindChartTips(svg) {
      if (!svg) return;
      svg.querySelectorAll(".chart-hit,.chart-point").forEach((el) => {
        el.setAttribute("tabindex", "0");
        el.setAttribute("role", "button");
        el.addEventListener("click", (event) => {
          event.stopPropagation();
          showChartTip(event, el);
        }, { signal });
        el.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            event.stopPropagation();
            showChartTip(event, el);
          }
        }, { signal });
      });
    }
    document.addEventListener("click", closeChartTip, { signal });

    // ===== TABS (page switching + lazy render) =====
    const rendered = {};
    function render(p) {
      if (rendered[p]) return;
      if (p === "sintesi") drawWaterfall();
      if (p === "ecba") {
        buildCashflow();
        drawDonut();
      }
      if (p === "sens") {
        drawElasticitySpider();
        drawVarianceSpider();
        drawMonte();
        drawHeatmap();
      }
      rendered[p] = true;
    }
    qa(".tab").forEach((t) => {
      t.addEventListener(
        "click",
        () => {
          qa(".tab").forEach((x) => x.classList.remove("active"));
          qa(".panel").forEach((x) => x.classList.remove("show"));
          t.classList.add("active");
          const p = t.dataset.p;
          q("#p-" + p).classList.add("show");
          render(p);
        },
        { signal },
      );
    });

    // ===== WATERFALL =====
    function fmt(v) {
      return (v > 0 ? "+" : "") + v.toFixed(1).replace(".", ",");
    }
    function drawWaterfall() {
      const svg = q("#svg-wf");
      const W = 760,
        H = 340,
        padL = 46,
        padR = 20,
        padT = 30,
        padB = 52,
        plotH = H - padT - padB,
        plotW = W - padL - padR;
      const { benefici, costi, esternalitaNeg, vane } = DATA.waterfall,
        maxV = benefici * 1.12;
      const lvlAfterCosti = benefici - costi;                 // 16,9
      const y = (v) => padT + plotH - (v / maxV) * plotH;
      const bars = [
        { label: "Benefici", axis: ["Benefici"], base: 0, top: benefici, fill: "var(--lime)", lab: benefici.toFixed(1).replace(".", ","), pos: "top", tip: benefici },
        { label: "Costi economici", axis: ["Costi", "economici"], base: lvlAfterCosti, top: benefici, fill: "var(--grey-mid)", lab: "−" + costi.toFixed(1).replace(".", ","), pos: "mid", tip: -costi },
        { label: "Esternalità negative", axis: ["Esternalità", "negative"], base: vane, top: lvlAfterCosti, fill: "var(--red-600)", lab: "−" + esternalitaNeg.toFixed(1).replace(".", ","), pos: "mid", tip: -esternalitaNeg },
        { label: "Valore Attuale Netto Economico", axis: ["Valore Attuale", "Netto Economico"], base: 0, top: vane, fill: "var(--blu-700)", lab: fmt(vane), pos: "top", tip: vane },
      ];
      const n = bars.length,
        gap = 52,
        bw = (plotW - gap * (n - 1)) / n,
        xOf = (i) => padL + i * (bw + gap);
      let o = "";
      for (let g = 10; g <= maxV; g += 10) {
        o += `<line class="ax-line" x1="${padL}" y1="${y(g)}" x2="${W - padR}" y2="${y(g)}"/><text class="ax-txt" x="${padL - 6}" y="${y(g) + 3}" text-anchor="end">${g}</text>`;
      }
      o += `<line class="ax-zero" x1="${padL}" y1="${y(0)}" x2="${W - padR}" y2="${y(0)}"/>`;
      o += `<line class="connector" x1="${xOf(0) + bw}" y1="${y(benefici)}" x2="${xOf(1)}" y2="${y(benefici)}"/>`;
      o += `<line class="connector" x1="${xOf(1) + bw}" y1="${y(lvlAfterCosti)}" x2="${xOf(2)}" y2="${y(lvlAfterCosti)}"/>`;
      o += `<line class="connector" x1="${xOf(2) + bw}" y1="${y(vane)}" x2="${xOf(3)}" y2="${y(vane)}"/>`;
      bars.forEach((b, i) => {
        const x = xOf(i),
          yT = y(b.top),
          yB = y(b.base),
          h = Math.max(2, yB - yT);
        o += `<rect x="${x}" y="${yB}" width="${bw}" height="0" fill="${b.fill}"><animate attributeName="height" from="0" to="${h}" dur=".65s" begin="${i * 0.18}s" fill="freeze" calcMode="spline" keySplines="0.2 0.8 0.2 1"/><animate attributeName="y" from="${yB}" to="${yT}" dur=".65s" begin="${i * 0.18}s" fill="freeze" calcMode="spline" keySplines="0.2 0.8 0.2 1"/></rect>`;
        o += `<rect class="chart-hit" x="${x}" y="${yT}" width="${bw}" height="${h}" fill="transparent" data-tip-label="${b.label}" data-tip-value="${fmt1(b.tip)} M€" data-tip-sub="Valore attuale sull'orizzonte di analisi"></rect>`;
        const ly = b.pos === "top" ? yT - 9 : (yT + yB) / 2 + 5;
        o += `<text class="bar-lbl" x="${x + bw / 2}" y="${ly}" text-anchor="middle" style="font-size:14px" opacity="0">${b.lab} M€<animate attributeName="opacity" from="0" to="1" dur=".3s" begin="${i * 0.18 + 0.55}s" fill="freeze"/></text>`;
        const ax = b.axis;
        const baseY = H - padB + 22;
        if (ax.length === 1) {
          o += `<text class="ax-txt" x="${x + bw / 2}" y="${baseY}" text-anchor="middle" style="font-weight:700;fill:var(--text-main);font-size:13px">${ax[0]}</text>`;
        } else {
          o += `<text class="ax-txt" x="${x + bw / 2}" y="${baseY}" text-anchor="middle" style="font-weight:700;fill:var(--text-main);font-size:12px"><tspan x="${x + bw / 2}" dy="0">${ax[0]}</tspan><tspan x="${x + bw / 2}" dy="14">${ax[1]}</tspan></text>`;
        }
      });
      svg.innerHTML = o;
      bindChartTips(svg);
    }

    // ===== CASHFLOW (multi-line, toggleable) =====
    let CF = null;
    function cumul(a) {
      const r = [];
      a.reduce((s, v, i) => {
        r[i] = +(s + v).toFixed(3);
        return r[i];
      }, 0);
      return r;
    }
    function buildCashflow() {
      const benCum = cumul(DATA.cashflow.ben),
        costCum = cumul(DATA.cashflow.cost);
      const netCum = benCum.map((b, i) => +(b - costCum[i]).toFixed(3));
      const series = [
        { key: "net", label: "Flusso netto cumulato", color: "#4400B3", w: 3, data: netCum, on: true },
        { key: "ben", label: "Benefici totali", color: "#1e7a45", w: 2.2, data: benCum, on: true },
        // Costi mostrati in negativo (deflusso di cassa per la collettività)
        { key: "cost", label: "Costi totali", color: "#c0392b", w: 2.2, data: costCum.map((v) => -v), on: true },
      ];
      DATA.donut.forEach((d, i) =>
        series.push({ key: "c" + i, label: d.label, color: d.color, w: 1.3, data: benCum.map((b) => +((b * d.pct) / 100).toFixed(3)), on: false }),
      );
      CF = { series };
      // legend chips
      const lg = q("#cf-legend");
      lg.innerHTML = CF.series
        .map((s, i) => `<div class="lg-chip ${s.on ? "" : "off"}" data-i="${i}"><span class="sw" style="background:${s.color}"></span>${s.label}</div>`)
        .join("");
      lg.querySelectorAll(".lg-chip").forEach((ch) =>
        ch.addEventListener(
          "click",
          () => {
            const s = CF.series[ch.dataset.i];
            s.on = !s.on;
            ch.classList.toggle("off", !s.on);
            drawCashflow(false);
          },
          { signal },
        ),
      );
      drawCashflow(true);
    }
    function drawCashflow(animate) {
      const svg = q("#svg-cf");
      const W = 760,
        H = 400,
        padL = 52,
        padR = 22,
        padT = 20,
        padB = 46,
        plotH = H - padT - padB,
        plotW = W - padL - padR;
      const vis = CF.series.filter((s) => s.on);
      let mn = 0,
        mx = 0;
      vis.forEach((s) =>
        s.data.forEach((v) => {
          if (v < mn) mn = v;
          if (v > mx) mx = v;
        }),
      );
      mn = Math.floor(mn / 10) * 10 - 2;
      mx = Math.ceil(mx / 10) * 10 + 2;
      if (mx === mn) mx = mn + 10;
      const N = 31,
        x = (t) => padL + (t / (N - 1)) * plotW,
        y = (v) => padT + plotH - ((v - mn) / (mx - mn)) * plotH;
      let o = "";
      for (let g = Math.ceil(mn / 10) * 10; g <= mx; g += 10) {
        o += `<line class="ax-line" x1="${padL}" y1="${y(g)}" x2="${W - padR}" y2="${y(g)}"/><text class="ax-txt" x="${padL - 6}" y="${y(g) + 3}" text-anchor="end">${g}</text>`;
      }
      o += `<line class="ax-zero" x1="${padL}" y1="${y(0)}" x2="${W - padR}" y2="${y(0)}"/>`;
      for (let t = 0; t <= 30; t += 5) {
        o += `<text class="ax-txt" x="${x(t)}" y="${H - padB + 18}" text-anchor="middle">${t}</text>`;
      }
      o += `<text class="ax-txt" x="${W - padR}" y="${H - padB + 18}" text-anchor="end" style="font-weight:700;fill:var(--text-muted)">anno</text>`;
      vis.forEach((s, si) => {
        const pts = s.data.map((v, t) => `${x(t)},${y(v)}`).join(" ");
        const dash = animate ? ` pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"` : "";
        o += `<polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="${s.w}" stroke-linejoin="round"${dash}>`;
        if (animate) o += `<animate attributeName="stroke-dashoffset" from="1" to="0" dur="1.2s" begin="${0.2 + si * 0.08}s" fill="freeze"/>`;
        o += `</polyline>`;
        // Niente pallini visibili: punti-bersaglio trasparenti per il tooltip al click
        s.data.forEach((v, t) => {
          o += `<circle class="chart-point" cx="${x(t)}" cy="${y(v)}" r="8" fill="transparent" data-tip-label="${s.label}" data-tip-value="${fmt1(v)} M€" data-tip-sub="Anno ${t}"></circle>`;
        });
      });
      // payback on net
      const net = CF.series.find((s) => s.key === "net");
      if (net.on) {
        let pb = -1;
        for (let t = 2; t <= 30; t++) {
          if (net.data[t - 1] < 0 && net.data[t] >= 0) {
            pb = t;
            break;
          }
        }
        if (pb > 0) {
          const px = x(pb);
          o += `<line x1="${px}" y1="${padT}" x2="${px}" y2="${H - padB}" stroke="#4400B3" stroke-width="1" stroke-dasharray="4 3" opacity=".45"/><text class="ax-txt" x="${px + 4}" y="${padT + 12}" style="fill:#4400B3;font-weight:700">payback · anno ${pb}</text>`;
        }
      }
      svg.innerHTML = o;
      bindChartTips(svg);
    }

    // ===== DONUT =====
    function drawDonut() {
      const svg = q("#svg-dn"),
        cx = 150,
        cy = 150,
        rO = 120,
        rI = 72;
      const d = DATA.donut;
      let ang = -Math.PI / 2,
        o = "";
      const pt = (r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
      d.forEach((s, i) => {
        const a0 = ang,
          a1 = ang + (s.pct / 100) * Math.PI * 2;
        ang = a1;
        const lg = a1 - a0 > Math.PI ? 1 : 0;
        const [x0, y0] = pt(rO, a0),
          [x1, y1] = pt(rO, a1),
          [x2, y2] = pt(rI, a1),
          [x3, y3] = pt(rI, a0);
        const value = (53.1 * s.pct) / 100;
        o += `<path class="chart-hit" d="M${x0} ${y0} A${rO} ${rO} 0 ${lg} 1 ${x1} ${y1} L${x2} ${y2} A${rI} ${rI} 0 ${lg} 0 ${x3} ${y3} Z" fill="${s.color}" opacity="0" data-tip-label="${s.label}" data-tip-value="${fmt1(value)} M€" data-tip-sub="${s.pct}% dei benefici totali"><animate attributeName="opacity" from="0" to="1" dur=".4s" begin="${i * 0.12}s" fill="freeze"/></path>`;
      });
      o += `<text x="${cx}" y="${cy - 6}" text-anchor="middle" style="font-size:13px;fill:var(--text-muted);font-weight:600">Benefici</text>`;
      o += `<text x="${cx}" y="${cy + 18}" text-anchor="middle" style="font-size:24px;font-weight:800;fill:var(--text-main)">53,1 M€</text>`;
      svg.innerHTML = o;
      bindChartTips(svg);
      q("#dn-legend").innerHTML = d
        .map(
          (s) =>
            `<div class="lg" style="justify-content:space-between"><span style="display:flex;align-items:center;gap:9px"><span class="sw" style="background:${s.color}"></span>${s.label}</span><b>${s.pct}%</b></div>`,
        )
        .join("");
    }

    // ===== TORNADO =====
    function drawTornado() {
      const svg = q("#svg-tor");
      const d = [...DATA.sensitivity].sort((a, b) => b.high - b.low - (a.high - a.low));
      const base = DATA.montecarlo.base;
      const W = 760,
        padL = 230,
        padR = 30,
        padT = 16,
        rowH = 46,
        H = padT + d.length * rowH + 30;
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      let mn = Math.min(...d.map((v) => v.low)),
        mx = Math.max(...d.map((v) => v.high));
      mn = Math.floor(mn - 1);
      mx = Math.ceil(mx + 1);
      const plotW = W - padL - padR,
        x = (v) => padL + ((v - mn) / (mx - mn)) * plotW;
      let o = "";
      for (let g = Math.ceil(mn / 2) * 2; g <= mx; g += 2) {
        o += `<line class="ax-line" x1="${x(g)}" y1="${padT}" x2="${x(g)}" y2="${padT + d.length * rowH}"/><text class="ax-txt" x="${x(g)}" y="${H - 12}" text-anchor="middle">${g}</text>`;
      }
      d.forEach((v, i) => {
        const cy = padT + i * rowH + rowH / 2,
          bh = 22;
        o += `<rect x="${x(v.low)}" y="${cy - bh / 2}" width="0" height="${bh}" fill="#c0392b" opacity=".88"><animate attributeName="width" from="0" to="${x(base) - x(v.low)}" dur=".5s" begin="${i * 0.1}s" fill="freeze"/></rect>`;
        o += `<rect x="${x(base)}" y="${cy - bh / 2}" width="0" height="${bh}" fill="#1e7a45" opacity=".88"><animate attributeName="width" from="0" to="${x(v.high) - x(base)}" dur=".5s" begin="${i * 0.1}s" fill="freeze"/></rect>`;
        o += `<rect class="chart-hit" x="${x(v.low)}" y="${cy - rowH / 2 + 3}" width="${x(v.high) - x(v.low)}" height="${rowH - 6}" fill="transparent" data-tip-label="${v.name}" data-tip-value="${fmt1(v.low)} / ${fmt1(v.high)} M€" data-tip-sub="Scenario sfavorevole / favorevole rispetto al valore base"></rect>`;
        o += `<text x="${padL - 12}" y="${cy + 4}" text-anchor="end" style="font-size:12.5px;font-weight:700;fill:var(--text-main)">${v.name}</text>`;
        o += `<text x="${padL - 12}" y="${cy + 18}" text-anchor="end" style="font-size:10.5px;fill:var(--text-soft)">${v.sub}</text>`;
        o += `<text x="${x(v.low) - 5}" y="${cy + 4}" text-anchor="end" style="font-size:11px;fill:#c0392b;font-weight:700" opacity="0">${v.low.toFixed(1).replace(".", ",")}<animate attributeName="opacity" from="0" to="1" dur=".3s" begin="${i * 0.1 + 0.5}s" fill="freeze"/></text>`;
        o += `<text x="${x(v.high) + 5}" y="${cy + 4}" style="font-size:11px;fill:#1e7a45;font-weight:700" opacity="0">${v.high.toFixed(1).replace(".", ",")}<animate attributeName="opacity" from="0" to="1" dur=".3s" begin="${i * 0.1 + 0.5}s" fill="freeze"/></text>`;
      });
      o += `<line x1="${x(base)}" y1="${padT - 2}" x2="${x(base)}" y2="${padT + d.length * rowH + 4}" stroke="var(--blu-700)" stroke-width="1.6"/>`;
      o += `<text class="ax-txt" x="${x(base)}" y="${padT - 4}" text-anchor="middle" style="fill:var(--blu-700);font-weight:700">Valore base ${base.toFixed(1).replace(".", ",")}</text>`;
      svg.innerHTML = o;
      bindChartTips(svg);
    }

    // ===== MONTECARLO =====
    function drawMonte() {
      const svg = q("#svg-mc");
      const m = DATA.montecarlo,
        f = m.freq,
        n = f.length;
      const W = 760,
        H = 340,
        padL = 20,
        padR = 20,
        padT = 24,
        padB = 46,
        plotH = H - padT - padB,
        plotW = W - padL - padR;
      const maxF = Math.max(...f),
        gap = 6,
        bw = (plotW - gap * (n - 1)) / n;
      const y = (v) => padT + plotH - (v / maxF) * plotH;
      const xEdges = (i) => m.start + i * m.w;
      // zero position in px
      const valToX = (val) => padL + ((val - m.start) / (m.w * n)) * plotW;
      let o = "";
      // y gridlines (frequency %)
      for (let g = 5; g <= maxF; g += 5) {
        o += `<line class="ax-line" x1="${padL}" y1="${y(g)}" x2="${W - padR}" y2="${y(g)}"/><text class="ax-txt" x="${padL}" y="${y(g) - 3}">${g}%</text>`;
      }
      f.forEach((v, i) => {
        const x = padL + i * (bw + gap),
          h = (v / maxF) * plotH,
          yT = y(v);
        const mid = xEdges(i) + m.w / 2,
          fill = mid < 0 ? "#c0392b" : "var(--green-700)";
        o += `<rect x="${x}" y="${y(0)}" width="${bw}" height="0" fill="${fill}" opacity=".9"><animate attributeName="y" from="${y(0)}" to="${yT}" dur=".5s" begin="${i * 0.05}s" fill="freeze"/><animate attributeName="height" from="0" to="${h}" dur=".5s" begin="${i * 0.05}s" fill="freeze"/></rect>`;
        o += `<rect class="chart-hit" x="${x}" y="${yT}" width="${bw}" height="${Math.max(6, h)}" fill="transparent" data-tip-label="Intervallo Valore Attuale Netto Economico" data-tip-value="${xEdges(i)} / ${xEdges(i) + m.w} M€" data-tip-sub="Frequenza simulazioni: ${v}%"></rect>`;
        o += `<text class="ax-txt" x="${x + bw / 2}" y="${H - padB + 16}" text-anchor="middle">${xEdges(i)}</text>`;
      });
      // zero line
      const zx = valToX(0);
      o += `<line x1="${zx}" y1="${padT - 4}" x2="${zx}" y2="${H - padB}" stroke="var(--text-main)" stroke-width="1.6"/>`;
      o += `<text class="ax-txt" x="${zx}" y="${padT - 6}" text-anchor="middle" style="fill:var(--text-main);font-weight:700">Valore Attuale Netto Economico = 0</text>`;
      // base/median line
      const bx = valToX(m.base);
      o += `<line x1="${bx}" y1="${padT}" x2="${bx}" y2="${H - padB}" stroke="var(--blu-700)" stroke-width="1" stroke-dasharray="4 3" opacity=".6"/>`;
      o += `<text class="ax-txt" x="${bx}" y="${H - padB - 6}" text-anchor="middle" style="fill:var(--blu-700);font-weight:700">mediana ${m.base.toFixed(1).replace(".", ",")}</text>`;
      // 92% annotation
      o += `<text x="${W - padR}" y="${padT + 30}" text-anchor="end" style="font-size:30px;font-weight:800;fill:var(--blu-700)" opacity="0">92%<animate attributeName="opacity" from="0" to="1" dur=".5s" begin="1s" fill="freeze"/></text>`;
      o += `<text x="${W - padR}" y="${padT + 48}" text-anchor="end" style="font-size:12px;fill:var(--text-muted)" opacity="0">simulazioni con Valore Attuale Netto Economico &gt; 0<animate attributeName="opacity" from="0" to="1" dur=".5s" begin="1.1s" fill="freeze"/></text>`;
      o += `<text class="ax-txt" x="${W - padR}" y="${H - padB + 16}" text-anchor="end" style="font-weight:700;fill:var(--text-muted)">Valore Attuale Netto Economico (M€)</text>`;
      svg.innerHTML = o;
      bindChartTips(svg);
    }

    // ===== SPIDER (radar) — elasticità & varianza =====
    function spiderLabel(text, x, y, anchor) {
      const words = text.split(" ");
      if (words.length === 1) {
        return `<text x="${x}" y="${y}" text-anchor="${anchor}" style="font-size:11.5px;font-weight:700;fill:var(--text-main)">${htmlEscape(text)}</text>`;
      }
      const mid = Math.ceil(words.length / 2);
      const l1 = words.slice(0, mid).join(" "),
        l2 = words.slice(mid).join(" ");
      return `<text x="${x}" y="${y - 6}" text-anchor="${anchor}" style="font-size:11.5px;font-weight:700;fill:var(--text-main)"><tspan x="${x}" dy="0">${htmlEscape(l1)}</tspan><tspan x="${x}" dy="13">${htmlEscape(l2)}</tspan></text>`;
    }
    function drawSpider(svg, data, opt) {
      if (!svg) return;
      const cx = 230,
        cy = 198,
        R = 122,
        n = data.length,
        rings = 4;
      const ang = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
      const pt = (r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
      const clamp01 = (v) => Math.max(0, Math.min(1, v));
      let o = "";
      for (let k = 1; k <= rings; k++) {
        const rr = (R * k) / rings;
        const poly = data.map((_, i) => pt(rr, ang(i)).map((c) => c.toFixed(1)).join(",")).join(" ");
        o += `<polygon points="${poly}" fill="none" stroke="var(--grey-line)" stroke-width="1"/>`;
        o += `<text class="ax-txt" x="${cx + 4}" y="${(cy - rr + 3).toFixed(1)}">${opt.ringLabel((opt.max * k) / rings)}</text>`;
      }
      data.forEach((d, i) => {
        const a = ang(i),
          [axx, ayy] = pt(R, a);
        o += `<line x1="${cx}" y1="${cy}" x2="${axx.toFixed(1)}" y2="${ayy.toFixed(1)}" stroke="var(--grey-line)" stroke-width="1"/>`;
        const [lx, ly] = pt(R + 20, a);
        const c = Math.cos(a);
        const anchor = c > 0.3 ? "start" : c < -0.3 ? "end" : "middle";
        o += spiderLabel(d.param, lx.toFixed(1), (ly + 4).toFixed(1), anchor);
      });
      const vpoly = data.map((d, i) => pt(R * clamp01(d.value / opt.max), ang(i)).map((c) => c.toFixed(1)).join(",")).join(" ");
      o += `<polygon points="${vpoly}" fill="${opt.color}" fill-opacity="0.18" stroke="${opt.color}" stroke-width="2.5"><animate attributeName="fill-opacity" from="0" to="0.18" dur=".5s" fill="freeze"/></polygon>`;
      data.forEach((d, i) => {
        const [px, py] = pt(R * clamp01(d.value / opt.max), ang(i));
        o += `<circle class="chart-point" cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="5" fill="${opt.color}" data-tip-label="${htmlEscape(d.param)}" data-tip-value="${opt.tipValue(d.value)}" data-tip-sub="${opt.tipSub}"></circle>`;
      });
      svg.innerHTML = o;
      bindChartTips(svg);
    }
    function drawElasticitySpider() {
      const data = DATA.elasticities;
      const max = Math.max(1, Math.ceil(Math.max(...data.map((d) => d.value))));
      drawSpider(q("#svg-elastic"), data, {
        max,
        color: "#5B21F7",
        ringLabel: (v) => v.toFixed(1).replace(".", ","),
        tipValue: (v) => "|ε| = " + v.toFixed(2).replace(".", ","),
        tipSub: "Variazione % del Valore Attuale Netto Economico per +1% del parametro",
      });
    }
    function drawVarianceSpider() {
      drawSpider(q("#svg-variance"), DATA.variances, {
        max: 1,
        color: "#9E7BFA",
        ringLabel: (v) => Math.round(v * 100) + "%",
        tipValue: (v) => Math.round(v * 100) + "%",
        tipSub: "Contributo del parametro alla varianza complessiva del risultato",
      });
    }

    // ===== HEATMAP — sensitività combinata Costi × Benefici =====
    function drawHeatmap() {
      const svg = q("#svg-heat");
      if (!svg) return;
      const { benefici, costiTotali, costMults, benefitMults } = DATA.heatmap;
      const rows = [...costMults].reverse(); // costo alto in alto
      const cols = benefitMults;
      const npvOf = (cm, bm) => benefici * bm - costiTotali * cm;
      let maxAbs = 0;
      rows.forEach((cm) => cols.forEach((bm) => { maxAbs = Math.max(maxAbs, Math.abs(npvOf(cm, bm))); }));
      const lerp = (a, b, t) => Math.round(a + (b - a) * t);
      const colorOf = (npv) => {
        const norm = Math.max(-1, Math.min(1, npv / Math.max(maxAbs, 1)));
        if (norm >= 0) return `rgb(${lerp(249, 27, norm)},${lerp(251, 94, norm)},${lerp(231, 32, norm)})`;
        const t = -norm;
        return `rgb(${lerp(249, 183, t)},${lerp(251, 28, t)},${lerp(231, 28, t)})`;
      };
      const W = 760,
        padL = 96,
        padT = 56,
        padR = 18,
        padB = 36;
      const gw = W - padL - padR,
        gh = 360 - padT - padB;
      const cw = gw / cols.length,
        ch = gh / rows.length;
      const fmtMul = (m) => m.toFixed(1).replace(".", ",");
      let o = "";
      cols.forEach((bm, j) => {
        o += `<text class="ax-txt" x="${(padL + j * cw + cw / 2).toFixed(1)}" y="${padT - 12}" text-anchor="middle" style="font-weight:700;fill:var(--text-main)">${fmtMul(bm)}×</text>`;
      });
      o += `<text class="ax-txt" x="${(padL + gw / 2).toFixed(1)}" y="${padT - 30}" text-anchor="middle" style="font-style:italic">Moltiplicatore benefici →</text>`;
      rows.forEach((cm, i) => {
        const yRow = padT + i * ch;
        o += `<text class="ax-txt" x="${padL - 10}" y="${(yRow + ch / 2 + 4).toFixed(1)}" text-anchor="end" style="font-weight:700;fill:var(--text-main)">${fmtMul(cm)}×</text>`;
        cols.forEach((bm, j) => {
          const npv = npvOf(cm, bm);
          const norm = Math.max(-1, Math.min(1, npv / Math.max(maxAbs, 1)));
          const x = padL + j * cw;
          const fg = Math.abs(norm) > 0.45 ? "#fff" : "#333";
          o += `<rect class="chart-hit" x="${x.toFixed(1)}" y="${yRow.toFixed(1)}" width="${(cw - 2).toFixed(1)}" height="${(ch - 2).toFixed(1)}" fill="${colorOf(npv)}" stroke="#fff" stroke-width="1" data-tip-label="Costi ×${fmtMul(cm)} · Benefici ×${fmtMul(bm)}" data-tip-value="${fmt1(npv)} M€" data-tip-sub="Valore Attuale Netto Economico nello scenario"></rect>`;
          o += `<text x="${(x + (cw - 2) / 2).toFixed(1)}" y="${(yRow + (ch - 2) / 2 + 4).toFixed(1)}" text-anchor="middle" style="font-size:11.5px;font-weight:700;fill:${fg};pointer-events:none">${fmt1(npv)}</text>`;
        });
      });
      const vy = padT + gh / 2;
      o += `<text class="ax-txt" x="22" y="${vy.toFixed(1)}" text-anchor="middle" transform="rotate(-90 22 ${vy.toFixed(1)})" style="font-style:italic">↑ Moltiplicatore costi</text>`;
      svg.innerHTML = o;
      bindChartTips(svg);
    }

    // ===== INFO POPOVER (click, stesso pattern della sezione Impatto) =====
    const INFO_SVG =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    const pop = document.createElement("div");
    pop.className = "ecba-pop";
    document.body.appendChild(pop);
    let popAnchor = null;
    function closePop() {
      pop.classList.remove("show");
      if (popAnchor) {
        popAnchor.classList.remove("open");
        popAnchor = null;
      }
    }
    function openPop(el) {
      pop.innerHTML = `<p>${el.dataset.tip}</p>`;
      pop.classList.add("show");
      const r = el.getBoundingClientRect();
      const w = 340;
      // Coordinate di pagina (con scroll) → popover ancorato al documento, così
      // resta fermo sull'icona quando si scrolla (come nella sezione Impatto).
      let left = r.left + window.scrollX + r.width / 2 - w / 2;
      left = Math.max(window.scrollX + 8, Math.min(left, window.scrollX + window.innerWidth - w - 8));
      pop.style.left = left + "px";
      pop.style.top = r.bottom + window.scrollY + 8 + "px";
      el.classList.add("open");
      popAnchor = el;
    }
    qa(".info-i").forEach((el) => {
      el.innerHTML = INFO_SVG;
      el.setAttribute("role", "button");
      el.setAttribute("tabindex", "0");
      el.addEventListener(
        "click",
        (e) => {
          e.stopPropagation();
          if (popAnchor === el) closePop();
          else openPop(el);
        },
        { signal },
      );
    });
    document.addEventListener("click", () => closePop(), { signal });

    // ===== MODAL =====
    function openModal() {
      q("#modal").classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function closeModal() {
      q("#modal").classList.remove("open");
      document.body.style.overflow = "";
    }
    const metoBtn = q(".js-metodologia");
    if (metoBtn) metoBtn.addEventListener("click", openModal, { signal });
    const modalX = q(".js-modal-x");
    if (modalX) modalX.addEventListener("click", closeModal, { signal });
    const modalBg = q("#modal");
    if (modalBg)
      modalBg.addEventListener(
        "click",
        (e) => {
          if (e.target === modalBg) closeModal();
        },
        { signal },
      );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeModal();
        closePop();
        closeChartTip();
      }
    }, { signal });
    qa("#mnav a").forEach((a) =>
      a.addEventListener(
        "click",
        () => {
          qa("#mnav a").forEach((x) => x.classList.remove("on"));
          a.classList.add("on");
          q("#" + a.dataset.s).scrollIntoView({ behavior: "smooth", block: "start" });
        },
        { signal },
      ),
    );
    const mcontent = q("#mcontent");
    if (mcontent)
      mcontent.addEventListener(
        "scroll",
        function () {
          const secs = [...qa("#mcontent section")];
          const top = this.scrollTop + 90;
          let cur = secs[0].id;
          secs.forEach((s) => {
            if (s.offsetTop <= top) cur = s.id;
          });
          qa("#mnav a").forEach((a) => a.classList.toggle("on", a.dataset.s === cur));
        },
        { signal },
      );

    // ===== integrazione con l'app: nome progetto + ritorno =====
    const sub = q(".head-sub b");
    if (sub && projectRef.current?.nome) sub.textContent = projectRef.current.nome;
    const back = q(".crumb-back");
    if (back) back.addEventListener("click", () => onBackRef.current?.(), { signal });

    // ===== init =====
    drawWaterfall();
    rendered.sintesi = true;

    return () => {
      ac.abort();
      pop.remove();
      chartTip.remove();
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="ecba-root" ref={rootRef}>
      <style>{CSS}</style>
      <div dangerouslySetInnerHTML={{ __html: MARKUP }} />
    </div>
  );
}
