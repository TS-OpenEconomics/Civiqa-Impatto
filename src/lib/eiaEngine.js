// ── Moltiplicatori settoriali (semplificati da dataset SAM Italia) ────────────

const SECTOR_MULTIPLIERS = {
  "Infrastrutture ambientali e risorse idriche": {
    produzione: 1.72, gva: 0.58, fte_per_mln: 9.1,
  },
  "Infrastrutture di trasporto": {
    produzione: 1.79, gva: 0.61, fte_per_mln: 10.7,
  },
  "Infrastrutture sociali": {
    produzione: 1.85, gva: 0.62, fte_per_mln: 12.4,
  },
  "Telecomunicazioni e tecnologie informatiche": {
    produzione: 2.10, gva: 0.71, fte_per_mln: 11.2,
  },
  "Attività produttive, ricerca e impresa sociale": {
    produzione: 1.95, gva: 0.67, fte_per_mln: 10.3,
  },
};

// ── Quote regionali base (struttura economica nazionale) ─────────────────────

const REGIONAL_BASE = [
  { regione: "Lombardia",            share: 0.140 },
  { regione: "Lazio",                share: 0.110 },
  { regione: "Veneto",               share: 0.085 },
  { regione: "Emilia-Romagna",       share: 0.085 },
  { regione: "Campania",             share: 0.075 },
  { regione: "Piemonte",             share: 0.072 },
  { regione: "Toscana",              share: 0.067 },
  { regione: "Sicilia",              share: 0.055 },
  { regione: "Puglia",               share: 0.048 },
  { regione: "Liguria",              share: 0.030 },
  { regione: "Calabria",             share: 0.025 },
  { regione: "Sardegna",             share: 0.022 },
  { regione: "Marche",               share: 0.020 },
  { regione: "Trentino-Alto Adige",  share: 0.020 },
  { regione: "Abruzzo",              share: 0.019 },
  { regione: "Friuli-Venezia Giulia",share: 0.018 },
  { regione: "Umbria",               share: 0.014 },
  { regione: "Basilicata",           share: 0.009 },
  { regione: "Molise",               share: 0.006 },
  { regione: "Valle d'Aosta",        share: 0.005 },
];

// ── Distribuzione settoriale dell'impatto ─────────────────────────────────────

const SECTOR_IMPACT = [
  { settore: "Costruzioni",                share: 0.35 },
  { settore: "Servizi professionali",      share: 0.15 },
  { settore: "Materiali da costruzione",   share: 0.12 },
  { settore: "Trasporti e logistica",      share: 0.10 },
  { settore: "Energia e utilities",        share: 0.08 },
  { settore: "Commercio",                  share: 0.07 },
  { settore: "ICT e digitale",             share: 0.06 },
  { settore: "Finanza e assicurazioni",    share: 0.04 },
  { settore: "Sanità e assistenza",        share: 0.02 },
  { settore: "Altri servizi",              share: 0.01 },
];

// ── NUTS prefix → regione ─────────────────────────────────────────────────────

const NUTS_TO_REGION = {
  ITC1: "Piemonte", ITC2: "Valle d'Aosta", ITC3: "Liguria", ITC4: "Lombardia",
  ITH1: "Trentino-Alto Adige", ITH2: "Trentino-Alto Adige", ITH3: "Veneto",
  ITH4: "Friuli-Venezia Giulia", ITH5: "Emilia-Romagna",
  ITI1: "Toscana", ITI2: "Umbria", ITI3: "Marche", ITI4: "Lazio",
  ITF1: "Abruzzo", ITF2: "Molise", ITF3: "Campania", ITF4: "Puglia",
  ITF5: "Basilicata", ITF6: "Calabria",
  ITG1: "Sicilia", ITG2: "Sardegna",
};

function nutsToRegion(nuts_code) {
  if (!nuts_code) return null;
  // Try 4-char prefix first, then 3-char
  return NUTS_TO_REGION[nuts_code.slice(0, 4)] || NUTS_TO_REGION[nuts_code.slice(0, 4)] || null;
}

function getMultiplier(settore) {
  return SECTOR_MULTIPLIERS[settore] || SECTOR_MULTIPLIERS["Infrastrutture ambientali e risorse idriche"];
}

function buildBreakdown(total) {
  return {
    diretto:   Math.round(total * 0.45),
    indiretto: Math.round(total * 0.35),
    indotto:   Math.round(total * 0.20),
    totale:    Math.round(total),
  };
}

function computeGeoDistribution(totalProduzione, nuts_code) {
  const localRegion = nutsToRegion(nuts_code);
  const LOCAL_BOOST = 0.25;

  const baseSum = REGIONAL_BASE.reduce((s, r) => s + r.share, 0);
  const localEntry = REGIONAL_BASE.find((r) => r.regione === localRegion);
  const otherSum = baseSum - (localEntry?.share ?? 0);

  return REGIONAL_BASE.map((r) => {
    let share;
    if (localRegion && r.regione === localRegion) {
      share = LOCAL_BOOST;
    } else {
      share = (r.share / otherSum) * (1 - LOCAL_BOOST);
    }
    const valore = Math.round(totalProduzione * share);
    return { regione: r.regione, valore, intensita: Math.min(1, share / 0.15) };
  }).sort((a, b) => b.valore - a.valore);
}

function computeTimeDistribution(scenario) {
  const { capex, opex_annuo, vita_utile, anno_inizio, anno_fine, capex_distribuzione } = scenario;
  const years = [];

  // Construction years: capex distributed
  const constructionEnd = Math.min(anno_fine, anno_inizio + 10);
  const constYears = [];
  for (let y = anno_inizio; y <= constructionEnd; y++) constYears.push(y);

  // Operation years: capex=0, opex every year
  const opYears = [];
  for (let y = constructionEnd + 1; y <= anno_inizio + vita_utile; y++) opYears.push(y);

  constYears.forEach((y) => {
    const pct = capex_distribuzione?.[y] ?? (100 / constYears.length);
    const capexYear = Math.round(capex * pct / 100);
    years.push({ anno: y, capex: capexYear, opex: 0, totale: capexYear });
  });

  opYears.forEach((y) => {
    years.push({ anno: y, capex: 0, opex: opex_annuo, totale: opex_annuo });
  });

  return years;
}

// ── Main export ───────────────────────────────────────────────────────────────

export function computeEia(project, scenario) {
  const mult = getMultiplier(scenario.settore ?? project.configurazione?.settore);

  const totalShock = (scenario.capex ?? 0) + (scenario.opex_annuo ?? 0) * (scenario.vita_utile ?? 20);

  const produzione_totale = totalShock * mult.produzione;
  const gva_totale        = totalShock * mult.gva;
  const fte_totale        = (totalShock / 1_000_000) * mult.fte_per_mln;
  const redditi_totale    = gva_totale * 0.55;
  const gettito_totale    = gva_totale * 0.22;

  const per_territorio = computeGeoDistribution(produzione_totale, scenario.nuts_code);
  const per_anno       = computeTimeDistribution(scenario);
  const per_settore    = SECTOR_IMPACT.map((s) => ({
    ...s,
    valore: Math.round(produzione_totale * s.share),
  }));

  return {
    shock_totale:  Math.round(totalShock),
    moltiplicatore: mult.produzione,
    produzione:    buildBreakdown(produzione_totale),
    gva:           buildBreakdown(gva_totale),
    fte:           buildBreakdown(fte_totale),
    redditi:       buildBreakdown(redditi_totale),
    gettito:       buildBreakdown(gettito_totale),
    per_territorio,
    per_settore,
    per_anno,
    scenario,
  };
}

export function buildInsights(results, scenario) {
  const { produzione, fte, gva, moltiplicatore } = results;
  const settore = scenario?.settore ?? "il settore";
  return [
    {
      title: "Produzione attivata",
      value: `${(produzione.totale / 1_000_000).toFixed(1)} M€`,
      text: `Il progetto attiva ${(produzione.totale / 1_000_000).toFixed(1)} M€ di produzione complessiva sul territorio. Ogni euro investito genera ${moltiplicatore.toFixed(2)} € di output nella filiera di "${settore}".`,
    },
    {
      title: "Occupazione",
      value: `${Math.round(fte.totale)} occupati`,
      text: `Sono attivati circa ${Math.round(fte.totale)} occupati considerando effetti diretti, indiretti e indotti lungo l'intera durata del progetto.`,
    },
    {
      title: "PIL",
      value: `${(gva.totale / 1_000_000).toFixed(1)} M€`,
      text: `Il PIL generato è pari a ${(gva.totale / 1_000_000).toFixed(1)} M€, di cui ${(gva.diretto / 1_000_000).toFixed(1)} M€ diretti e ${((gva.indiretto + gva.indotto) / 1_000_000).toFixed(1)} M€ indiretti e indotti.`,
    },
  ];
}

// ── Province weights (GDP share within region, per NUTS2) ─────────────────────

const PROVINCE_WEIGHTS = {
  ITC1: [["Torino",0.55],["Cuneo",0.12],["Alessandria",0.10],["Novara",0.09],["Asti",0.05],["Vercelli",0.04],["Biella",0.03],["Verbano-Cusio-Ossola",0.02]],
  ITC2: [["Valle d'Aosta/Vallée d'Aoste",1.0]],
  ITC3: [["Genova",0.65],["La Spezia",0.15],["Savona",0.12],["Imperia",0.08]],
  ITC4: [["Milano",0.45],["Brescia",0.12],["Bergamo",0.11],["Monza e della Brianza",0.07],["Varese",0.07],["Como",0.05],["Mantova",0.04],["Cremona",0.03],["Pavia",0.03],["Lecco",0.02],["Lodi",0.01],["Sondrio",0.01]],
  ITF1: [["Chieti",0.30],["Pescara",0.28],["L'Aquila",0.25],["Teramo",0.17]],
  ITF2: [["Campobasso",0.65],["Isernia",0.35]],
  ITF3: [["Napoli",0.55],["Salerno",0.20],["Caserta",0.13],["Avellino",0.07],["Benevento",0.05]],
  ITF4: [["Bari",0.35],["Taranto",0.18],["Lecce",0.17],["Foggia",0.14],["Brindisi",0.10],["Barletta-Andria-Trani",0.06]],
  ITF5: [["Potenza",0.60],["Matera",0.40]],
  ITF6: [["Cosenza",0.33],["Reggio Calabria",0.27],["Catanzaro",0.22],["Crotone",0.10],["Vibo Valentia",0.08]],
  ITG1: [["Palermo",0.30],["Catania",0.27],["Messina",0.15],["Siracusa",0.09],["Ragusa",0.07],["Agrigento",0.06],["Trapani",0.04],["Caltanissetta",0.02],["Enna",0.01]],
  ITG2: [["Cagliari",0.38],["Sassari",0.28],["Nuoro",0.14],["Sud Sardegna",0.13],["Oristano",0.07]],
  ITH1: [["Bolzano-Bozen",1.0]],
  ITH2: [["Trento",1.0]],
  ITH3: [["Verona",0.22],["Venezia",0.20],["Padova",0.18],["Treviso",0.15],["Vicenza",0.14],["Belluno",0.06],["Rovigo",0.05]],
  ITH4: [["Trieste",0.35],["Udine",0.35],["Pordenone",0.20],["Gorizia",0.10]],
  ITH5: [["Bologna",0.30],["Modena",0.14],["Parma",0.12],["Reggio nell'Emilia",0.11],["Ravenna",0.09],["Forli'-Cesena",0.08],["Rimini",0.07],["Ferrara",0.06],["Piacenza",0.05]],
  ITI1: [["Firenze",0.38],["Pisa",0.13],["Livorno",0.10],["Prato",0.09],["Pistoia",0.08],["Arezzo",0.08],["Siena",0.07],["Lucca",0.06],["Massa-Carrara",0.05],["Grosseto",0.04]],
  ITI2: [["Perugia",0.75],["Terni",0.25]],
  ITI3: [["Ancona",0.35],["Pesaro e Urbino",0.25],["Macerata",0.18],["Ascoli Piceno",0.13],["Fermo",0.09]],
  ITI4: [["Roma",0.80],["Latina",0.09],["Frosinone",0.06],["Viterbo",0.04],["Rieti",0.01]],
};

export const REGION_NAME_TO_NUTS2 = {
  "Piemonte":"ITC1","Valle d'Aosta":"ITC2","Liguria":"ITC3","Lombardia":"ITC4",
  "Trentino-Alto Adige":"ITH1","Veneto":"ITH3","Friuli-Venezia Giulia":"ITH4",
  "Emilia-Romagna":"ITH5","Toscana":"ITI1","Umbria":"ITI2","Marche":"ITI3",
  "Lazio":"ITI4","Abruzzo":"ITF1","Molise":"ITF2","Campania":"ITF3",
  "Puglia":"ITF4","Basilicata":"ITF5","Calabria":"ITF6","Sicilia":"ITG1","Sardegna":"ITG2",
};

export function computeProvinceDistribution(regionName, regionaleValore) {
  const nuts2 = REGION_NAME_TO_NUTS2[regionName];
  if (!nuts2) return [];
  let entries = PROVINCE_WEIGHTS[nuts2] ?? [];
  if (regionName === "Trentino-Alto Adige") {
    entries = [...(PROVINCE_WEIGHTS.ITH1 ?? []), ...(PROVINCE_WEIGHTS.ITH2 ?? [])];
  }
  return entries
    .map(([provincia, share]) => ({
      provincia,
      nuts2,
      valore: Math.round(regionaleValore * share),
      intensita: share,
    }))
    .sort((a, b) => b.valore - a.valore);
}
