import { buildBeneficiCategorie, COLORE_VALORE_RESIDUO } from "./ecbaBenefits";
import { buildBeneficiKpi } from "./cba/kpiBenefits";

function npv(rate, flows) {
  return flows.reduce((sum, cf, t) => sum + cf / Math.pow(1 + rate / 100, t), 0);
}

function irr(flows) {
  const undiscountedSum = flows.reduce((s, c) => s + c, 0);
  if (undiscountedSum <= 0) return 0;
  if (npv(500, flows) > 0) return 500;

  let lo = 0, hi = 500;
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    if (npv(mid, flows) > 0) lo = mid;
    else hi = mid;
    if (hi - lo < 0.01) break;
  }
  return Math.round(((lo + hi) / 2) * 10) / 10;
}

export function computeEcba(project, eiaResults, setup) {
  const {
    horizon = 25,
    discountRate = 3.5,
    residualValue = 0,
    annualOpex,
  } = setup || {};

  const conf = project?.configurazione ?? {};
  const capex = conf.capex ?? 0;
  const opex = annualOpex ?? conf.opex ?? 0;
  const sector = conf.settore;

  // ── Benefici: categorie economiche monetizzate (esternalità / outcome) ──────
  // Sorgente primaria: i KPI specifici della categoria d'intervento (Layer 3 →
  // Layer 2). Ogni KPI è una voce di beneficio, valutato dalla sua formula.
  // Se la categoria non è risolvibile (nessun cat_code / label mappabile),
  // si ricade sul catalogo placeholder parametrizzato sul CAPEX. Stessa forma
  // di output in entrambi i casi: i consumer a valle restano invariati.
  const kpiOverrides = setup?.kpiOverrides;
  const categorieBase =
    buildBeneficiKpi({
      catCode: conf.cat_code,
      categoriaInterventoLabel: conf.categoria_intervento,
      overrides: kpiOverrides,
    }) ?? buildBeneficiCategorie({ capex, sector });
  const annualBenefits = categorieBase.reduce((s, c) => s + c.valore_annuo, 0);

  // Fattore di annualità (attualizza un flusso costante su tutto l'orizzonte).
  let annuityFactor = 0;
  for (let t = 1; t <= horizon; t++) {
    annuityFactor += 1 / Math.pow(1 + discountRate / 100, t);
  }
  const residualPV =
    residualValue > 0 ? residualValue / Math.pow(1 + discountRate / 100, horizon) : 0;

  // PV per categoria (ricorrente) + eventuale valore residuo (one-off).
  const categoriePV = categorieBase.map((c) => ({
    ...c,
    valore_pv: Math.round(c.valore_annuo * annuityFactor),
  }));
  if (residualPV > 0) {
    categoriePV.push({
      id: "residuo",
      nome: "Valore residuo",
      descrizione:
        "Valore economico dell'opera al termine dell'orizzonte di analisi, calcolato per ammortamento e attualizzato all'anno base.",
      comeMisura: "Stimato come quota non ammortizzata del CAPEX, attualizzata a fine orizzonte.",
      colore: COLORE_VALORE_RESIDUO,
      valore_annuo: null,
      one_off: true,
      sottocomponenti: [],
      valore_pv: Math.round(residualPV),
    });
  }

  const beneficiTotali = categoriePV.reduce((s, c) => s + c.valore_pv, 0);

  // quota di ciascuna categoria sul totale dei benefici (per la ciambella).
  const benefici_categorie = categoriePV.map((c) => ({
    ...c,
    quota: beneficiTotali > 0 ? c.valore_pv / beneficiTotali : 0,
  }));

  // ── Costi: CAPEX (anno 0) + OPEX attualizzato ───────────────────────────────
  const pvCapex = capex;
  let pvOpex = 0;
  for (let t = 1; t <= horizon; t++) {
    pvOpex += opex / Math.pow(1 + discountRate / 100, t);
  }
  pvOpex = Math.round(pvOpex);
  const costiTotali = pvCapex + pvOpex;

  const costi_categorie = [
    { id: "capex", label: "Investimento (CAPEX)", valore_pv: Math.round(pvCapex) },
    { id: "opex", label: "Gestione e manutenzione (OPEX)", valore_pv: pvOpex },
  ];

  // ── Flussi annuali (incluso anno 0 dell'investimento) ───────────────────────
  const flussi = [];
  const rawFlows = [-capex];
  // Anno 0: solo investimento iniziale.
  flussi.push({
    anno: 0,
    benefici: 0,
    costi: Math.round(capex),
    flusso_netto: -Math.round(capex),
    van_cumulato: -Math.round(capex),
  });

  let vanCum = -capex;
  for (let t = 1; t <= horizon; t++) {
    const benefici = Math.round(annualBenefits + (t === horizon ? residualValue : 0));
    const costi = Math.round(opex);
    const flussoNetto = benefici - costi;
    rawFlows.push(flussoNetto);
    vanCum += flussoNetto / Math.pow(1 + discountRate / 100, t);
    flussi.push({
      anno: t,
      benefici,
      costi,
      flusso_netto: flussoNetto,
      van_cumulato: Math.round(vanCum),
    });
  }

  const van = Math.round(beneficiTotali - costiTotali);
  const bc = costiTotali > 0 ? Math.round((beneficiTotali / costiTotali) * 100) / 100 : 0;
  const tir = irr(rawFlows);
  const paybackRow = flussi.find((r) => r.anno >= 1 && r.van_cumulato >= 0);

  return {
    van,
    bc,
    tir,
    payback: paybackRow?.anno ?? null,
    // Alias allineati ai nomi attesi dalla UI (EcbaResults, ProjectDetail)
    bcr: bc,
    irr: tir,
    payback_period: paybackRow?.anno ?? null,
    benefici_totali: Math.round(beneficiTotali),
    costi_totali: Math.round(costiTotali),
    annual_benefits: Math.round(annualBenefits),
    // Nuovi campi per i grafici del report CBA
    benefici_categorie,
    costi_categorie,
    pv_capex: Math.round(pvCapex),
    pv_opex: pvOpex,
    flussi,
    meta: {
      orizzonte: horizon,
      tasso: discountRate,
      residual: residualValue,
      capex,
      annual_opex: opex,
    },
  };
}
