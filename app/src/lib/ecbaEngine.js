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
    benefitItems = {},
  } = setup || {};

  const conf = project.configurazione ?? {};
  const capex = conf.capex ?? 0;
  const vita_utile = conf.vita_utile ?? 20;
  const opex = annualOpex ?? conf.opex ?? 0;

  let annualBenefits = 0;
  if (eiaResults) {
    const perAnno = vita_utile > 0 ? vita_utile : 1;
    if (benefitItems.gva !== false) annualBenefits += (eiaResults.gva?.totale ?? 0) / perAnno;
    if (benefitItems.gettito) annualBenefits += (eiaResults.gettito?.totale ?? 0) / perAnno;
    if (benefitItems.redditi) annualBenefits += (eiaResults.redditi?.totale ?? 0) / perAnno;
    if (benefitItems.intangibili && benefitItems.intangibiliValue) {
      annualBenefits += Number(benefitItems.intangibiliValue) || 0;
    }
  } else {
    annualBenefits = capex * 0.18;
  }

  const rawFlows = [-capex];
  const flussi = [];

  for (let t = 1; t <= horizon; t++) {
    const benefici = Math.round(annualBenefits + (t === horizon ? residualValue : 0));
    const costi = opex;
    const flusso_netto = benefici - costi;
    rawFlows.push(flusso_netto);
    flussi.push({ anno: t, benefici, costi, flusso_netto });
  }

  let van_cum = -capex;
  let pvBenefici = 0;
  let pvCosti = capex;

  flussi.forEach((row) => {
    const df = Math.pow(1 + discountRate / 100, row.anno);
    van_cum += row.flusso_netto / df;
    pvBenefici += row.benefici / df;
    pvCosti += row.costi / df;
    row.van_cumulato = Math.round(van_cum);
  });

  const van = Math.round(pvBenefici - pvCosti);
  const bc = pvCosti > 0 ? Math.round((pvBenefici / pvCosti) * 100) / 100 : 0;
  const tir = irr(rawFlows);
  const paybackRow = flussi.find((r) => r.van_cumulato >= 0);

  return {
    van,
    bc,
    tir,
    payback: paybackRow?.anno ?? null,
    // Alias allineati ai nomi attesi dalla UI (EcbaResults, ProjectDetail)
    bcr: bc,
    irr: tir,
    payback_period: paybackRow?.anno ?? null,
    benefici_totali: Math.round(pvBenefici),
    costi_totali: Math.round(pvCosti),
    annual_benefits: Math.round(annualBenefits),
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
