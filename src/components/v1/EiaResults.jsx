import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import staticResults from "../../mocks/eiaResults.json";
import { Badge } from "../ui/Badge";
import { ImpactIcon } from "../ui/ImpactIcon";
import { ItalyMap } from "../ui/ItalyMap";
import { ProvinceMap } from "../ui/ProvinceMap";
import { PlotlyChart } from "../charts/PlotlyChart";
import {
  IconArrowLeft,
  IconDownload,
  IconHelp,
} from "../ui/Icons";
import { useToast } from "../../hooks/useToast";

function assetUrl(path) {
  const base = import.meta.env.BASE_URL ?? "/";
  return `${base}${String(path ?? "").replace(/^\/+/, "")}`;
}

function fmtIT(n, dec = 0) {
  return new Intl.NumberFormat("it-IT", { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(n);
}

function fmtM(n) {
  return `${fmtIT(n / 1_000_000, 1)} M€`;
}

function fmtETP(n) {
  return `${fmtIT(n, n < 10 ? 1 : 0)} ETP`;
}

function fmtMoneyPc(n) {
  return `${fmtIT(n, 2)} €/ab`;
}

function fmtEtpPc(n) {
  return `${fmtIT(n, 2)} ETP/10k ab.`;
}

function formatDimensionValue(dim, value, mode) {
  if (mode === "pc") {
    if (dim === "employment") return fmtEtpPc(value);
    return fmtMoneyPc(value);
  }
  return dim === "employment" ? fmtETP(value) : fmtM(value);
}

function getPerimeterKey(perim) {
  if (perim === "provincia") return "origin_province";
  if (perim === "nazionale") return "national";
  return "region";
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function cleanText(value) {
  if (typeof value !== "string") return value;
  return value
    .replaceAll("Mâ‚¬", "M€")
    .replaceAll("â‚¬", "€")
    .replaceAll("Â·", "·")
    .replaceAll("Ã—", "×")
    .replaceAll("Ã¨", "è")
    .replaceAll("Ã ", "à")
    .replaceAll("Ã²", "ò")
    .replaceAll("Ã¹", "ù")
    .replaceAll("Ã©", "é")
    .replaceAll("Ã¬", "ì")
    .replaceAll("â€”", "—")
    .replaceAll("â†’", "→")
    .replaceAll("â†", "←")
    .replaceAll("â†‘", "↑")
    .replaceAll("â†“", "↓");
}

const d = staticResults;
const rawSyn = d.synthesis ?? {};
const inp = d.input ?? {};
const comps = d.components ?? {};
const rawGeo = d.geography ?? {};
const sectItems = d.sectors?.items ?? [];
const previews = d.previews ?? {};

const byPerimeter = rawSyn.by_perimeter ?? {};
const perCapita = rawSyn.per_capita ?? {};
const threeSeg = rawSyn.three_segments ?? {};
const synthKpis = rawSyn.synthetic_kpis ?? rawSyn.kpis ?? {};

const regionName = inp.origin_region?.name ?? "Italia";
const originProvince = inp.origin_provinces?.[0]?.name ?? regionName;
const originNuts2 = inp.origin_region?.nuts2_code ?? null;
const nVoci = inp.spend_breakdown?.length ?? 0;

const geo = {
  ...rawGeo,
  regions: (rawGeo.regions ?? []).map((r) => ({
    ...r,
    nome: r.nome ?? r.name,
    production: r.production ?? r.values?.production?.absolute ?? 0,
    gdp: r.gdp ?? r.values?.gdp?.absolute ?? 0,
    employment: r.employment ?? r.values?.employment?.absolute ?? 0,
    income: r.income ?? r.values?.income?.absolute ?? 0,
    production_pc: r.production_pc ?? r.values?.production?.per_capita ?? 0,
    gdp_pc: r.gdp_pc ?? r.values?.gdp?.per_capita ?? 0,
    employment_pc: r.employment_pc ?? r.values?.employment?.per_capita_per_10k ?? 0,
    income_pc: r.income_pc ?? r.values?.income?.per_capita ?? 0,
  })),
  provinces: (rawGeo.provinces ?? []).map((p) => ({
    ...p,
    nome: p.nome ?? p.name,
    regione: p.regione ?? p.region_name,
    production: p.production ?? p.values?.production?.absolute ?? 0,
    gdp: p.gdp ?? p.values?.gdp?.absolute ?? 0,
    employment: p.employment ?? p.values?.employment?.absolute ?? 0,
    income: p.income ?? p.values?.income?.absolute ?? 0,
    production_pc: p.production_pc ?? p.values?.production?.per_capita ?? 0,
    gdp_pc: p.gdp_pc ?? p.values?.gdp?.per_capita ?? 0,
    employment_pc: p.employment_pc ?? p.values?.employment?.per_capita_per_10k ?? 0,
    income_pc: p.income_pc ?? p.values?.income?.per_capita ?? 0,
  })),
};

const TABS = [
  { id: "sintesi", label: "Sintesi" },
  { id: "componenti", label: "Propagazione" },
  { id: "geografia", label: "Geografia" },
  { id: "settori", label: "Settori" },
  { id: "esplora", label: "Esplora" },
];

const TAB_PREVIEWS = {
  sintesi: cleanText(previews.sintesi ?? "3,56 M€ PIL"),
  componenti: cleanText(previews.componenti ?? "44% diretto"),
  geografia: cleanText(previews.geografia ?? "84% in regione"),
  settori: cleanText(previews.settori ?? "Costruzioni leader"),
  esplora: cleanText(previews.esplora ?? "Pivot dati"),
};

const EFFECTS = [
  {
    id: "production",
    icon: "produzione",
    label: "VALORE DELLA PRODUZIONE",
    isMoney: true,
    getData: (perim) => byPerimeter[getPerimeterKey(perim)]?.production ?? 0,
    getPc: (perim) => perCapita[getPerimeterKey(perim)]?.production_pc ?? 0,
    description: (perim, mode) => {
      const scope = perimeterText(perim);
      return mode === "pc"
        ? `Volume d'affari attivato ${scope} per abitante.`
        : `Volume d'affari attivato lungo la filiera ${scope}.`;
    },
  },
  {
    id: "gdp",
    icon: "pil",
    label: "PIL (VALORE AGGIUNTO)",
    isMoney: true,
    getData: (perim) => byPerimeter[getPerimeterKey(perim)]?.gdp ?? 0,
    getPc: (perim) => perCapita[getPerimeterKey(perim)]?.gdp_pc ?? 0,
    description: (perim, mode) => {
      const mult = fmtIT(synthKpis.gdp_multiplier ?? 0, 2);
      const scope = perimeterText(perim);
      return mode === "pc"
        ? `Valore aggiunto ${scope} per abitante. Il moltiplicatore regionale di riferimento resta ${mult}x.`
        : `Valore aggiunto trattenuto ${scope}. Per ogni euro speso, l'economia regionale restituisce ${mult}.`;
    },
  },
  {
    id: "employment",
    icon: "occupazione",
    label: "OCCUPAZIONE",
    isMoney: false,
    getData: (perim) => byPerimeter[getPerimeterKey(perim)]?.employment ?? 0,
    getPc: (perim) => perCapita[getPerimeterKey(perim)]?.employment_pc_per_10k ?? 0,
    description: (perim, mode) => {
      const scope = perimeterText(perim);
      const anni = inp.years_of_realization ?? 1;
      return mode === "pc"
        ? `Posti di lavoro equivalenti generati ${scope} per abitante, su ${anni} ann${anni === 1 ? "o" : "i"} di realizzazione.`
        : `Posti di lavoro equivalenti a tempo pieno generati ${scope} su tutta la filiera.`;
    },
  },
  {
    id: "income",
    icon: "redditi",
    label: "REDDITI DISTRIBUITI",
    isMoney: true,
    getData: (perim) => byPerimeter[getPerimeterKey(perim)]?.income ?? 0,
    getPc: (perim) => perCapita[getPerimeterKey(perim)]?.income_pc ?? 0,
    description: (perim, mode) => {
      const scope = perimeterText(perim);
      return mode === "pc"
        ? `Quota di valore aggiunto distribuita come reddito ${scope} per abitante.`
        : `Quota di valore aggiunto che torna a famiglie e imprese ${scope}.`;
    },
  },
  {
    id: "fiscal",
    icon: "gettito",
    label: "GETTITO FISCALE",
    isMoney: true,
    nationalOnly: true,
    getData: () => byPerimeter.national?.fiscal ?? rawSyn.fiscal_national ?? 0,
    description: () => "Rientro fiscale complessivo attivato dall'intervento. Il gettito è solo nazionale.",
  },
];

const DIMENSION_DEFS = {
  production: "Volume d'affari totale attivato lungo la filiera, inclusi fornitori di secondo e terzo livello. È sempre superiore alla spesa perché la catena si moltiplica.",
  gdp: "Nuova ricchezza genuinamente creata: differenza tra valore prodotto e costo degli input intermedi. È la misura più accurata dell'impatto economico netto.",
  employment: "Posti di lavoro equivalenti a tempo pieno attivati nell'economia — diretti, indiretti e indotti — misurati su tutta la durata dell'investimento.",
  income: "Quota di valore aggiunto distribuita a famiglie e imprese come salari, profitti e rendite.",
  fiscal: "Imposte e contributi attivati dall'attività economica generata. Indica quanta parte della spesa pubblica rientra alle casse pubbliche.",
};

const KPI_PILLS = [
  {
    value: `${fmtIT(synthKpis.gdp_multiplier ?? 0, 2)}x moltiplicatore PIL`,
    tip: "Per ogni euro speso, l'economia regionale ne restituisce un valore aggiunto pari a questo moltiplicatore.",
  },
  {
    value: `${fmtIT(synthKpis.production_multiplier ?? 0, 2)}x moltiplicatore Produzione`,
    tip: "Per ogni euro speso, si attivano euro di volume d'affari lungo la filiera regionale.",
  },
  {
    value: `${fmtIT(synthKpis.employment_intensity_per_meur ?? 0, 1)} ETP per milione € speso`,
    tip: "Posti di lavoro equivalenti a tempo pieno generati ogni milione di euro investito.",
  },
  {
    value: `${fmtIT((synthKpis.fiscal_autofinanc_pct ?? 0) * 100, 1)}% spesa rientra come gettito`,
    tip: "Quota della spesa pubblica che rientra alle casse pubbliche come imposte attivate dal progetto.",
  },
];

const COMPONENTS = [
  { id: "production", label: "VALORE DELLA PRODUZIONE", icon: "produzione", isMoney: true, data: comps.production },
  { id: "gdp", label: "PIL (VALORE AGGIUNTO)", icon: "pil", isMoney: true, data: comps.gdp },
  { id: "employment", label: "OCCUPAZIONE", icon: "occupazione", isMoney: false, data: comps.employment },
];

const GEO_DIMS = [
  { id: "production", label: "Produzione" },
  { id: "gdp", label: "PIL" },
  { id: "employment", label: "Occupazione" },
  { id: "income", label: "Redditi" },
];

const GEO_MODES = [
  { id: "assoluti", label: "Valori assoluti" },
  { id: "pc", label: "Pro capite" },
];

const SECTOR_DIMS = [
  { id: "production", label: "Produzione", isMoney: true },
  { id: "gdp", label: "PIL", isMoney: true },
  { id: "employment", label: "Occupazione", isMoney: false },
];

const EXPLORE_DIMS = [
  { id: "production", label: "Produzione", isMoney: true },
  { id: "gdp", label: "PIL", isMoney: true },
  { id: "employment", label: "Occupazione", isMoney: false },
  { id: "income", label: "Redditi", isMoney: true },
  { id: "spend", label: "Spesa", isMoney: true },
  { id: "fiscal", label: "Gettito", isMoney: true },
];

function perimeterText(perim) {
  if (perim === "provincia") return `nella provincia di ${originProvince}`;
  if (perim === "nazionale") return "sull'intera economia italiana";
  return `nell'economia di ${regionName}`;
}

function getGeoValue(item, dim, mode) {
  if (mode === "pc") {
    if (dim === "employment") return item.employment_pc ?? 0;
    return item[`${dim}_pc`] ?? 0;
  }
  return item[dim] ?? 0;
}

function resolveTerritoryFocus(code) {
  if (!code) return null;
  const province = geo.provinces.find((p) => p.code === code);
  if (province) {
    return {
      kind: "provincia",
      code: province.code,
      label: province.nome,
      regionCode: province.region_code ?? province.regione ?? province.region_name ?? null,
      regionLabel: province.region_name ?? province.regione ?? null,
    };
  }
  const region = geo.regions.find((r) => r.code === code);
  if (region) {
    return {
      kind: "regione",
      code: region.code,
      label: region.nome,
      regionCode: region.code,
      regionLabel: region.nome,
    };
  }
  return null;
}

function getGeoFmt(dim, mode) {
  if (mode === "pc") {
    return dim === "employment" ? fmtEtpPc : fmtMoneyPc;
  }
  return dim === "employment" ? fmtETP : fmtM;
}

function toPercent(n) {
  return `${Math.round(n)}%`;
}

function roundedPctParts(values) {
  const total = values.reduce((sum, value) => sum + Math.max(0, value), 0);
  if (total <= 0) return values.map(() => 0);

  const raw = values.map((value) => (Math.max(0, value) / total) * 100);
  const floored = raw.map(Math.floor);
  let remainder = 100 - floored.reduce((sum, value) => sum + value, 0);
  const order = raw
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction);

  for (let i = 0; i < remainder; i += 1) {
    floored[order[i % order.length].index] += 1;
  }

  return floored;
}

function buildTerritorialSegments(dimId) {
  const split = threeSeg[dimId] ?? {};
  const nationalVal = byPerimeter.national?.[dimId] ?? 0;
  const regionVal = byPerimeter.region?.[dimId] ?? 0;
  const provinceVal = byPerimeter.origin_province?.[dimId] ?? 0;

  const values = [
    Math.max(0, split.origin ?? provinceVal),
    Math.max(0, split.rest_region ?? (regionVal - provinceVal)),
    Math.max(0, split.extra ?? (nationalVal - regionVal)),
  ];
  const pct = roundedPctParts(values);

  return [
    { id: "province", label: "Provincia di origine", name: originProvince, value: values[0], pct: pct[0], cls: "bg-impact-direct" },
    { id: "rest_region", label: "Resto della regione", name: regionName, value: values[1], pct: pct[1], cls: "bg-impact-indirect" },
    { id: "rest_italy", label: "Resto d'Italia", name: "Italia", value: values[2], pct: pct[2], cls: "bg-impact-induced" },
  ];
}

function territorialSegmentName(segment) {
  if (!segment) return "Italia";
  if (segment.id === "rest_region") return `resto della regione ${regionName}`;
  if (segment.id === "rest_italy") return "resto d'Italia";
  return originProvince;
}

function buildSegmentComponentValues(data, segment) {
  const direct = data?.direct ?? 0;
  const indirect = data?.indirect ?? 0;
  const induced = data?.induced ?? 0;
  const segmentTotal = segment?.value ?? direct + indirect + induced;
  const segmentDirect = segment?.id === "province" ? Math.min(direct, segmentTotal) : 0;
  const residual = Math.max(0, segmentTotal - segmentDirect);
  const spilloverTotal = indirect + induced;

  return {
    direct: segmentDirect,
    indirect: spilloverTotal > 0 ? residual * (indirect / spilloverTotal) : 0,
    induced: spilloverTotal > 0 ? residual * (induced / spilloverTotal) : 0,
  };
}

function buildPerimeterPreview() {
  return {
    sintesi: TAB_PREVIEWS.sintesi,
    componenti: TAB_PREVIEWS.componenti,
    geografia: TAB_PREVIEWS.geografia,
    settori: TAB_PREVIEWS.settori,
    esplora: TAB_PREVIEWS.esplora,
  };
}

export function EiaResults({ project, analysis, onBack }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const initialTab = TABS.some((t) => t.id === requestedTab) ? requestedTab : "sintesi";
  const [tab, setTab] = useState(initialTab);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const { showToast } = useToast();

  const meta = staticResults.metadata ?? {};

  useEffect(() => {
    const nextTab = TABS.some((t) => t.id === requestedTab) ? requestedTab : "sintesi";
    if (nextTab !== tab) setTab(nextTab);
  }, [requestedTab, tab]);

  const updateSearch = useCallback((updates) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") next.delete(key);
        else next.set(key, String(value));
      });
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const handleTabChange = useCallback((nextTab, extra = {}) => {
    setTab(nextTab);
    setGlossaryOpen(false);
    updateSearch({ tab: nextTab, ...extra });
  }, [updateSearch]);

  async function handleDownloadExcel() {
    try {
      const { utils, writeFile } = await import("xlsx");
      const wb = utils.book_new();
      const rows = [
        ["Dimensione", "Totale regionale", "Totale nazionale", "Unità"],
        ["Valore della produzione", byPerimeter.region?.production ?? 0, byPerimeter.national?.production ?? 0, "€"],
        ["PIL", byPerimeter.region?.gdp ?? 0, byPerimeter.national?.gdp ?? 0, "€"],
        ["Occupazione", byPerimeter.region?.employment ?? 0, byPerimeter.national?.employment ?? 0, "ETP"],
        ["Redditi", byPerimeter.region?.income ?? 0, byPerimeter.national?.income ?? 0, "€"],
        ["Gettito", "-", byPerimeter.national?.fiscal ?? 0, "€"],
      ];
      utils.book_append_sheet(wb, utils.aoa_to_sheet(rows), "Sintesi");
      writeFile(wb, `EIA_${project?.nome?.replace(/\s+/g, "_") ?? "progetto"}.xlsx`);
    } catch {
      showToast("Errore nel download Excel. Riprova.", "error");
    }
  }

  const loading = analysis?.status === "running";
  const errored = analysis?.status === "error";

  return (
    <div className="min-h-full bg-bg-page">
      <div className="px-4 py-8 md:px-8">
        <nav className="mb-3 flex items-center gap-1.5 text-xs text-ink-500">
          <button onClick={onBack} className="transition-colors hover:text-brand-violet">
            Dettaglio del progetto
          </button>
          <span>›</span>
          <span className="font-semibold text-ink-700">Analisi di Impatto</span>
        </nav>
        <p className="mb-5 text-[11px] text-ink-400">
          Creato il <span className="font-medium">{meta.creato_il}</span> da{" "}
          <span className="font-medium">{meta.creato_da}</span> — Ultima modifica{" "}
          <span className="font-medium">{analysis?.updatedAt ?? meta.ultima_modifica}</span>
        </p>

        <div className="border border-ink-100 bg-white">
          <div className="flex flex-wrap items-start justify-between gap-4 px-6 py-5 md:px-8">
            <div className="flex items-start gap-4">
              <img src={assetUrl("icons/analysis-eia.png")} alt="Logo analisi di impatto" className="h-16 w-16 shrink-0 object-contain" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-[18px] font-bold text-ink-900">Analisi di Impatto</h1>
                  <Badge type="EIA" />
                  <span className="inline-flex border border-ink-200 px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.18em] text-ink-500">
                    Diretti / Indiretti / Indotti
                  </span>
                </div>
                <p className="mt-1 text-sm text-ink-500">
                  Del progetto <span className="font-medium text-ink-900">{project?.nome}</span>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <button
                onClick={() => showToast("Export PDF disponibile nella versione completa.", "info")}
                className="flex h-9 items-center gap-2 border border-ink-200 bg-white px-4 font-semibold text-ink-700 transition-colors hover:bg-bg-page"
              >
                Scarica report <IconDownload />
              </button>
              <button
                onClick={handleDownloadExcel}
                className="flex h-9 items-center gap-2 bg-accent-lime px-4 font-semibold text-ink-900 hover:opacity-90"
              >
                Scarica Excel <IconDownload />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 divide-y divide-ink-100 border-t border-ink-100 bg-white text-sm md:grid-cols-3 md:divide-x md:divide-y-0">
            <MetaField label="Settore" value={project?.configurazione?.settore ?? meta.settore} />
            <MetaField label="Dataset" value={meta.dataset} />
            <MetaField label="Metodologia" value={meta.metodologia} />
          </div>
        </div>
      </div>

      <div className="px-4 pb-8 md:px-8">
        {errored && <ErrorBanner />}
        {loading && <LoadingBanner />}
        <div className="overflow-hidden border border-ink-100 bg-white">
          <TabBar
            activeTab={tab}
            previews={buildPerimeterPreview()}
            onChange={handleTabChange}
          />
          <div className="border-t border-ink-100 bg-white px-4 py-6 md:px-6">
            {tab === "sintesi" && (
              <TabShell title="Sintesi dell'impatto" tab="sintesi" onHelp={() => setGlossaryOpen(true)}>
                <TabSintesi updateSearch={updateSearch} searchParams={searchParams} />
              </TabShell>
            )}
            {tab === "componenti" && (
              <TabShell title="Come si propaga l'impatto" tab="componenti" onHelp={() => setGlossaryOpen(true)}>
                <TabComponenti />
              </TabShell>
            )}
            {tab === "geografia" && (
              <TabShell title="Geografia dell'impatto" tab="geografia" onHelp={() => setGlossaryOpen(true)}>
                <TabGeografia updateSearch={updateSearch} searchParams={searchParams} onOpenExplore={(config) => handleTabChange("esplora", config)} />
              </TabShell>
            )}
            {tab === "settori" && (
              <TabShell title="Impatti settoriali" tab="settori" onHelp={() => setGlossaryOpen(true)}>
                <TabSettori updateSearch={updateSearch} searchParams={searchParams} onOpenExplore={(config) => handleTabChange("esplora", config)} />
              </TabShell>
            )}
            {tab === "esplora" && (
              <TabShell title="Esplora i dati" tab="esplora" onHelp={() => setGlossaryOpen(true)}>
                <TabEsplora
                  showToast={showToast}
                  project={project}
                  searchParams={searchParams}
                  updateSearch={updateSearch}
                  onOpenExplore={(config) => handleTabChange("esplora", config)}
                />
              </TabShell>
            )}
          </div>
        </div>
      </div>

      {glossaryOpen && <GlossaryPopover tab={tab} onClose={() => setGlossaryOpen(false)} />}
    </div>
  );
}

function TabBar({ activeTab, previews, onChange }) {
  return (
    <div className="flex overflow-x-auto">
      {TABS.map((t, idx) => {
        const active = activeTab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={[
              "relative flex min-w-[140px] flex-1 items-center justify-center border-r border-ink-100 px-4 py-3 text-left transition-colors",
              active ? "bg-brand-violet text-white" : "bg-white text-ink-900 hover:bg-bg-page",
              idx === TABS.length - 1 ? "border-r-0" : "",
            ].join(" ")}
            style={{ minHeight: 64 }}
          >
            <span className="flex w-full flex-col gap-1">
              <span className="text-[16px] font-bold leading-tight">{t.label}</span>
              <span className={`text-xs ${active ? "text-white/85" : "text-ink-500"} hidden sm:block`}>
                {previews[t.id]}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function TabShell({ title, tab, onHelp, children }) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-500">Vista</p>
          <h2 className="mt-1 text-2xl font-bold text-ink-900">{title}</h2>
        </div>
        <button
          onClick={onHelp}
          className="flex h-9 w-9 shrink-0 items-center justify-center border border-ink-300 text-ink-700 transition-colors hover:border-brand-violet hover:text-brand-violet"
          title={`Apri glossario ${tab}`}
        >
          <IconHelp className="h-4 w-4" />
        </button>
      </div>
      {children}
    </div>
  );
}

function TabSintesi() {
  const spend = inp.total_spend ?? 0;
  const spendM = spend / 1_000_000;
  const isMultiProvince = (inp.origin_provinces?.length ?? 0) > 1;

  const natProd = byPerimeter.national?.production ?? 0;
  const natGdp = byPerimeter.national?.gdp ?? 0;
  const natEmp = byPerimeter.national?.employment ?? 0;
  const natFiscal = byPerimeter.national?.fiscal ?? 0;
  const regGdp = byPerimeter.region?.gdp ?? 0;
  const regProd = byPerimeter.region?.production ?? 0;
  const regEmp = byPerimeter.region?.employment ?? 0;

  const gdpSeg = threeSeg.gdp ?? {};
  const empSeg = threeSeg.employment ?? {};
  const provGdp = gdpSeg.origin ?? byPerimeter.origin_province?.gdp ?? 0;
  const restRegGdp = gdpSeg.rest_region ?? 0;
  const extraGdp = gdpSeg.extra ?? 0;
  const provEmp = empSeg.origin ?? byPerimeter.origin_province?.employment ?? 0;
  const restRegEmp = empSeg.rest_region ?? 0;
  const extraEmp = empSeg.extra ?? 0;

  const gdpPcts = roundedPctParts([provGdp, restRegGdp, extraGdp]);

  const regGdpMult = spend > 0 ? regGdp / spend : 0;
  const natGdpMult = spend > 0 ? natGdp / spend : 0;
  const regProdMult = spend > 0 ? regProd / spend : 0;
  const natProdMult = spend > 0 ? natProd / spend : 0;
  const regEmpInt = spendM > 0 ? regEmp / spendM : 0;
  const natEmpInt = spendM > 0 ? natEmp / spendM : 0;
  const fiscalPct = (synthKpis.fiscal_autofinanc_pct ?? 0) * 100;

  const provPc = perCapita.origin_province ?? {};
  const regPc = perCapita.region ?? {};
  const natPc = perCapita.national ?? {};

  const summaryText = `L'investimento di ${fmtM(spend)} ha attivato ${fmtM(natGdp)} di PIL, sostenuto ${fmtIT(natEmp, 0)} posti di lavoro equivalenti e restituito ${fmtM(natFiscal)} in gettito fiscale.`;

  return (
    <div className="space-y-14">
      {/* Hero: investimento */}
      <div className="border-l-4 border-brand-violet bg-brand-violet/5 px-6 py-5">
        <p className="text-[10px] font-mono font-medium uppercase tracking-[0.18em] text-brand-violet">Il punto di partenza</p>
        <div className="mt-2 flex flex-wrap items-baseline gap-4">
          <p className="text-[38px] font-bold leading-none text-brand-violet">{fmtM(spend)}</p>
          <p className="text-[15px] text-ink-700">
            investiti {isMultiProvince ? "nelle province di" : "nella provincia di"}{" "}
            <strong>{originProvince}</strong>, distribuiti su {nVoci} voci di spesa
          </p>
        </div>
      </div>

      {/* Cosa ha generato */}
      <section className="space-y-4">
        <SintesiSectionHead title="Cosa ha generato" subtitle="I principali impatti attivati sull'economia italiana" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <SintesiKPI icon="pil"        label="PIL"                    value={fmtM(natGdp)}         caption="valore aggiunto generato in Italia" />
          <SintesiKPI icon="produzione" label="Valore della Produzione" value={fmtM(natProd)}        caption="di volume d'affari in Italia" />
          <SintesiKPI icon="occupazione" label="Occupazione"            value={fmtIT(natEmp, 0)} valueUnit="ETP" caption="posti equivalenti a tempo pieno" />
          <SintesiKPI icon="gettito"    label="Gettito fiscale"         value={fmtM(natFiscal)}      caption="di gettito per lo Stato" />
        </div>
      </section>

      {/* Dove resta il valore */}
      <section className="space-y-4">
        <SintesiSectionHead
          title="Quanto resta sul territorio"
          subtitle={`Il ${gdpPcts[0]}% del PIL attivato resta nella provincia di ${originProvince}`}
        />
        <SintesiTerritoryCard
          provPct={gdpPcts[0]} provGdp={provGdp} provEmp={provEmp}
          restRegPct={gdpPcts[1]} restRegGdp={restRegGdp} restRegEmp={restRegEmp}
          extraPct={gdpPcts[2]} extraGdp={extraGdp} extraEmp={extraEmp}
        />
      </section>

      {/* Effetto moltiplicatore */}
      <section className="space-y-4">
        <SintesiSectionHead
          title="L'effetto moltiplicatore"
          subtitle="Per ogni euro speso — confronto tra perimetro regionale e nazionale"
        />
        <SintesiMultiplierGrid
          regGdpMult={regGdpMult} natGdpMult={natGdpMult}
          regProdMult={regProdMult} natProdMult={natProdMult}
          regEmpInt={regEmpInt} natEmpInt={natEmpInt}
          fiscalPct={fiscalPct}
        />
      </section>

      {/* Callout sintetico */}
      <div className="border border-ink-100 bg-bg-page px-6 py-5">
        <p className="text-sm leading-relaxed text-ink-700">
          <strong className="text-ink-900">In parole semplici:</strong> ogni milione di euro investito a{" "}
          {originProvince} genera circa{" "}
          <strong>{fmtIT(regProdMult, 2)} milioni</strong> di attività economica nella regione (
          <strong>{fmtIT(natProdMult, 2)} milioni</strong> a livello nazionale), sostiene{" "}
          <strong>{fmtIT(regEmpInt, 0)} posti di lavoro</strong> regionali ({fmtIT(natEmpInt, 0)} nazionali) e
          restituisce allo Stato{" "}
          <strong>{fmtIT(Math.round(fiscalPct / 100 * 1_000_000), 0)} €</strong> in tasse ogni milione speso.
        </p>
      </div>

      {/* Pro capite */}
      <section className="space-y-4">
        <SintesiSectionHead title="Valori pro capite" subtitle="L'impatto rapportato alla popolazione residente in ciascun perimetro" />
        <SintesiPerCapita
          provName={originProvince} provGdpPc={provPc.gdp_pc ?? 0} provEmpPc={provPc.employment_pc_per_10k ?? 0} provPop={provPc.population ?? 0}
          regName={regionName} regGdpPc={regPc.gdp_pc ?? 0} regEmpPc={regPc.employment_pc_per_10k ?? 0} regPop={regPc.population ?? 0}
          natGdpPc={natPc.gdp_pc ?? 0} natEmpPc={natPc.employment_pc_per_10k ?? 0} natPop={natPc.population ?? 0}
        />
      </section>

      <TakeawayBanner text={summaryText} />
      <DimensionGlossary />
    </div>
  );
}

function SintesiSectionHead({ title, subtitle }) {
  return (
    <div>
      <h3 className="text-[17px] font-bold text-ink-900">{title}</h3>
      {subtitle && <p className="mt-1 text-sm text-ink-500">{subtitle}</p>}
    </div>
  );
}

function SintesiKPI({ icon, label, value, valueUnit, caption }) {
  return (
    <div className="border border-ink-100 bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <ImpactIcon
          type={icon}
          label={label}
          className="h-4 w-4"
          wrapperClassName="flex h-7 w-7 shrink-0 items-center justify-center bg-brand-violet/10 text-brand-violet"
        />
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-500">{label}</p>
      </div>
      <p className="text-[26px] font-bold leading-none text-ink-900">
        {value}
        {valueUnit && <span className="ml-1 text-[16px] font-semibold text-ink-400">{valueUnit}</span>}
      </p>
      <p className="mt-2 text-[12px] leading-snug text-ink-500">{caption}</p>
    </div>
  );
}

function SintesiTerritoryCard({ provPct, provGdp, provEmp, restRegPct, restRegGdp, restRegEmp, extraPct, extraGdp, extraEmp }) {
  return (
    <div className="overflow-hidden border border-ink-100 bg-white">
      <div className="flex h-3.5" role="img" aria-label={`PIL: ${provPct}% provincia, ${restRegPct}% regione, ${extraPct}% resto Italia`}>
        <div className="bg-impact-direct transition-all" style={{ width: `${provPct}%` }} />
        <div className="bg-impact-indirect transition-all" style={{ width: `${restRegPct}%` }} />
        <div className="bg-impact-induced transition-all" style={{ width: `${extraPct}%` }} />
      </div>
      <div className="grid grid-cols-1 divide-y divide-ink-100 p-5 md:grid-cols-3 md:divide-x md:divide-y-0 md:gap-0 md:p-0">
        <SintesiTerritoryCol color="bg-impact-direct" name={originProvince} pct={provPct} gdp={provGdp} emp={provEmp} />
        <SintesiTerritoryCol color="bg-impact-indirect" name={`Resto della ${regionName}`} pct={restRegPct} gdp={restRegGdp} emp={restRegEmp} />
        <SintesiTerritoryCol color="bg-impact-induced" name="Resto d'Italia" pct={extraPct} gdp={extraGdp} emp={extraEmp} />
      </div>
    </div>
  );
}

function SintesiTerritoryCol({ color, name, pct, gdp, emp }) {
  return (
    <div className="p-5">
      <div className="mb-2 flex items-center gap-2">
        <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-sm ${color}`} />
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-500">{name}</p>
      </div>
      <p className="text-[28px] font-bold leading-none text-ink-900">{pct}%</p>
      <p className="mt-2 text-[13px] text-ink-600">
        {fmtM(gdp)} PIL · {fmtIT(emp, emp < 10 ? 1 : 0)} ETP
      </p>
    </div>
  );
}

function SintesiMultiplierGrid({ regGdpMult, natGdpMult, regProdMult, natProdMult, regEmpInt, natEmpInt, fiscalPct }) {
  const rows = [
    { icon: "pil",         label: "PIL",                    regVal: `${fmtIT(regGdpMult, 2)}×`,   natVal: `${fmtIT(natGdpMult, 2)}×` },
    { icon: "produzione",  label: "Valore della Produzione", regVal: `${fmtIT(regProdMult, 2)}×`,  natVal: `${fmtIT(natProdMult, 2)}×` },
    { icon: "occupazione", label: "Occupazione",             regVal: `${fmtIT(regEmpInt, 1)} ETP`, natVal: `${fmtIT(natEmpInt, 1)} ETP` },
    { icon: "gettito",     label: "Gettito fiscale",         regVal: "–",                          natVal: `${fmtIT(fiscalPct, 1)}%` },
  ];

  return (
    <div className="overflow-hidden border border-ink-100 bg-white">
      <div className="grid grid-cols-[1fr_120px_120px] border-b border-ink-100 bg-bg-page px-5 py-2.5">
        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-400">Indicatore</p>
        <p className="text-center text-[10px] font-mono uppercase tracking-[0.18em] text-ink-400">Regionale</p>
        <p className="text-center text-[10px] font-mono uppercase tracking-[0.18em] text-ink-400">Nazionale</p>
      </div>
      {rows.map((row, i) => (
        <div
          key={row.label}
          className={`grid grid-cols-[1fr_120px_120px] items-center px-5 py-4 ${i < rows.length - 1 ? "border-b border-ink-100" : ""}`}
        >
          <div className="flex items-center gap-2">
            <ImpactIcon type={row.icon} label={row.label} className="h-3.5 w-3.5" wrapperClassName="flex h-3.5 w-3.5 items-center justify-center text-brand-violet" />
            <p className="text-[13px] font-semibold text-ink-700">{row.label}</p>
          </div>
          <p className="text-center text-[20px] font-bold text-brand-violet">{row.regVal}</p>
          <p className="text-center text-[20px] font-bold text-ink-700">{row.natVal}</p>
        </div>
      ))}
      <div className="border-t border-ink-100 bg-bg-page px-5 py-2.5">
        <p className="text-[11px] italic text-ink-400">
          I moltiplicatori regionali sono più affidabili di quelli nazionali, che tendono a sovrastimare perché includono valore attivato fuori dalla regione committente.
        </p>
      </div>
    </div>
  );
}

function SintesiPerCapita({ provName, provGdpPc, provEmpPc, provPop, regName, regGdpPc, regEmpPc, regPop, natGdpPc, natEmpPc, natPop }) {
  return (
    <div className="overflow-hidden border border-ink-100 bg-white">
      <div className="border-b border-ink-100 bg-bg-page px-5 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">PIL e occupazione per abitante</p>
        <p className="mt-0.5 text-xs text-ink-400">I valori pro capite non si sommano tra livelli territoriali</p>
      </div>
      <div className="grid grid-cols-1 divide-y divide-ink-100 md:grid-cols-3 md:divide-x md:divide-y-0">
        <SintesiPerCapitaCol name={provName} pop={provPop} gdpPc={provGdpPc} empPc={provEmpPc} highlight />
        <SintesiPerCapitaCol name={regName} pop={regPop} gdpPc={regGdpPc} empPc={regEmpPc} />
        <SintesiPerCapitaCol name="Italia" pop={natPop} gdpPc={natGdpPc} empPc={natEmpPc} />
      </div>
    </div>
  );
}

function SintesiPerCapitaCol({ name, pop, gdpPc, empPc, highlight }) {
  return (
    <div className={`p-5 ${highlight ? "bg-brand-violet/5" : ""}`}>
      <p className={`text-[11px] font-bold uppercase tracking-[0.1em] ${highlight ? "text-brand-violet" : "text-ink-500"}`}>{name}</p>
      {pop > 0 && (
        <p className="mt-0.5 text-[11px] text-ink-400">
          {pop >= 1_000_000 ? `${fmtIT(pop / 1_000_000, 1)} milioni di ab.` : `${fmtIT(Math.round(pop / 1000), 0)} mila ab.`}
        </p>
      )}
      <div className="mt-4 space-y-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.12em] text-ink-400">PIL pro capite</p>
          <p className={`mt-1 text-[22px] font-bold leading-none ${highlight ? "text-brand-violet" : "text-ink-900"}`}>
            {fmtMoneyPc(gdpPc)}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.12em] text-ink-400">ETP ogni 10.000 ab.</p>
          <p className={`mt-1 text-[22px] font-bold leading-none ${highlight ? "text-brand-violet" : "text-ink-900"}`}>
            {fmtIT(empPc, 2)}
          </p>
        </div>
      </div>
    </div>
  );
}

function ProvinceBreakdown({ mode }) {
  const isPC = mode === "pc";

  const paloGdp = byPerimeter.origin_province?.gdp ?? 0;
  const paloEmp = byPerimeter.origin_province?.employment ?? 0;
  const paloInc = byPerimeter.origin_province?.income ?? 0;
  const paloProd = byPerimeter.origin_province?.production ?? 0;
  const regGdp = byPerimeter.region?.gdp ?? 0;
  const regEmp = byPerimeter.region?.employment ?? 0;
  const regInc = byPerimeter.region?.income ?? 0;
  const regProd = byPerimeter.region?.production ?? 0;
  const natGdp = byPerimeter.national?.gdp ?? 0;
  const natEmp = byPerimeter.national?.employment ?? 0;
  const natInc = byPerimeter.national?.income ?? 0;
  const natProd = byPerimeter.national?.production ?? 0;
  const restoGdp = natGdp - regGdp;

  const paloGdpPc = perCapita.origin_province?.gdp_pc ?? 0;
  const regGdpPc = perCapita.region?.gdp_pc ?? 0;
  const natGdpPc = perCapita.national?.gdp_pc ?? 0;
  const paloPop = paloGdpPc > 0 ? paloGdp / paloGdpPc : 0;
  const regPop = regGdpPc > 0 ? regGdp / regGdpPc : 0;
  const natPop = natGdpPc > 0 ? natGdp / natGdpPc : 0;

  function pcMoney(abs, pop) { return pop > 0 ? abs / pop : 0; }
  function pcEmp(abs, pop) { return pop > 0 ? (abs / pop) * 10000 : 0; }

  const regPct = natGdp > 0 ? Math.round((regGdp / natGdp) * 100) : 0;
  const paloPctOfNat = natGdp > 0 ? Math.round((paloGdp / natGdp) * 100) : 0;
  const paloPctOfReg = regGdp > 0 ? Math.round((paloGdp / regGdp) * 100) : 0;
  const restoPct = 100 - regPct;

  const fmtMoney = isPC ? fmtMoneyPc : fmtM;
  const fmtEmpFn = isPC ? fmtEtpPc : fmtETP;

  if (!isPC) {
    const gdpSegments = buildTerritorialSegments("gdp");
    const productionSegments = buildTerritorialSegments("production");
    const employmentSegments = buildTerritorialSegments("employment");
    const incomeSegments = buildTerritorialSegments("income");
    const segmentRows = gdpSegments.map((segment, index) => ({
      ...segment,
      production: productionSegments[index]?.value ?? 0,
      employment: employmentSegments[index]?.value ?? 0,
      income: incomeSegments[index]?.value ?? 0,
    }));

    return (
      <div className="border border-ink-100 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-ink-100 bg-bg-page px-5 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
            PIL attivato — distribuzione territoriale
          </p>
          <p className="mt-0.5 text-xs text-ink-400">
            Le quote sono esclusive: provincia di origine + resto della regione + resto d'Italia = 100%
          </p>
        </div>

        <div className="p-5">
          <div className="divide-y divide-ink-100">
            {segmentRows.map((segment) => (
              <div key={segment.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.14em] text-ink-500">
                      <span className={`h-2.5 w-2.5 shrink-0 ${segment.cls}`} />
                      {segment.label}
                    </p>
                    <p className="mt-1 truncate text-[17px] font-bold text-ink-900">
                      {segment.id === "rest_region" ? `Altre province in ${segment.name}` : segment.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[18px] font-bold tabular-nums text-ink-900">{segment.pct}%</p>
                    <p className="text-xs font-semibold text-ink-700">{fmtM(segment.value)} PIL</p>
                  </div>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden bg-ink-100">
                  <div
                    className={`${segment.cls} h-full transition-all`}
                    style={{ width: `${segment.pct}%` }}
                    title={`${segment.pct}% del PIL nazionale attivato`}
                  />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3 border-t border-ink-100 pt-3">
                  <MetricMini label="Produzione" value={fmtM(segment.production)} />
                  <MetricMini label="Occupazione" value={fmtETP(segment.employment)} />
                  <MetricMini label="Redditi" value={fmtM(segment.income)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const tiers = [
    {
      id: "national",
      levelLabel: "Totale nazionale",
      name: "Italia",
      gdp: isPC ? natGdpPc : natGdp,
      production: isPC ? pcMoney(natProd, natPop) : natProd,
      employment: isPC ? pcEmp(natEmp, natPop) : natEmp,
      income: isPC ? pcMoney(natInc, natPop) : natInc,
      pct: 100,
      pctLabel: null,
    },
    {
      id: "region",
      levelLabel: "Regione di origine",
      name: regionName,
      gdp: isPC ? regGdpPc : regGdp,
      production: isPC ? pcMoney(regProd, regPop) : regProd,
      employment: isPC ? pcEmp(regEmp, regPop) : regEmp,
      income: isPC ? pcMoney(regInc, regPop) : regInc,
      pct: regPct,
      pctLabel: isPC ? null : `${regPct}% del nazionale`,
    },
    {
      id: "province",
      levelLabel: "Provincia di origine",
      name: originProvince,
      gdp: isPC ? paloGdpPc : paloGdp,
      production: isPC ? pcMoney(paloProd, paloPop) : paloProd,
      employment: isPC ? pcEmp(paloEmp, paloPop) : paloEmp,
      income: isPC ? pcMoney(paloInc, paloPop) : paloInc,
      pct: paloPctOfNat,
      pctLabel: isPC ? null : `${paloPctOfNat}% del nazionale · ${paloPctOfReg}% della regione`,
    },
  ];

  return (
    <div className="border border-ink-100 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-ink-100 bg-bg-page px-5 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
          {isPC ? "PIL pro capite per perimetro territoriale" : "PIL attivato — dal nazionale alla provincia"}
        </p>
        <p className="mt-0.5 text-xs text-ink-400">
          {isPC ? "I valori pro capite non si sommano tra livelli" : "Ogni livello è contenuto in quello superiore · leggi dall'alto in basso"}
        </p>
      </div>

      <div className="divide-y divide-ink-100">
        {tiers.map((tier, i) => (
          <div key={tier.id} className="flex gap-4 py-5 pr-5" style={{ paddingLeft: 20 + i * 24 }}>
            {i > 0 && (
              <div className="flex shrink-0 flex-col items-center pt-1">
                <div className="h-2 w-px bg-ink-200" />
                <span className="text-[10px] text-ink-300">└</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-ink-500">{tier.levelLabel}</p>
              <div className="mt-1 flex flex-wrap items-baseline justify-between gap-2">
                <p className={["font-bold text-ink-900", i === 0 ? "text-[22px]" : i === 1 ? "text-[19px]" : "text-[17px]"].join(" ")}>
                  {tier.name}
                </p>
                <p className={["font-bold tabular-nums text-ink-900", i === 0 ? "text-[22px]" : i === 1 ? "text-[19px]" : "text-[17px]"].join(" ")}>
                  {fmtMoney(tier.gdp)}
                  {isPC && <span className="ml-1 text-[11px] font-normal text-ink-400">PIL pro capite</span>}
                </p>
              </div>
              {tier.pctLabel && (
                <p className="mt-0.5 text-[11px] font-mono font-semibold text-brand-violet">{tier.pctLabel}</p>
              )}
              {!isPC && (
                <div className="mt-2 h-1.5 w-full overflow-hidden bg-ink-100">
                  <div className="h-full bg-brand-violet transition-all" style={{ width: `${tier.pct}%` }} />
                </div>
              )}
              <div className="mt-3 grid grid-cols-3 gap-3 border-t border-ink-100 pt-3">
                <MetricMini label="Produzione" value={fmtMoney(tier.production)} />
                <MetricMini label="Occupazione" value={fmtEmpFn(tier.employment)} />
                <MetricMini label="Redditi" value={fmtMoney(tier.income)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {!isPC && (
        <div className="flex items-center justify-between border-t border-ink-100 bg-bg-page px-5 py-3">
          <span className="text-xs text-ink-500">Valore attivato fuori dalla regione {regionName}</span>
          <span className="font-mono text-xs font-semibold text-ink-700">{fmtM(restoGdp)} ({restoPct}%)</span>
        </div>
      )}
    </div>
  );
}

function PerimeterBreakdown({ dim }) {
  const fmt = dim.isMoney ? fmtM : fmtETP;
  const nationalVal = dim.id === "fiscal"
    ? (byPerimeter.national?.fiscal ?? 0)
    : (byPerimeter.national?.[dim.id] ?? 0);
  const regionVal = byPerimeter.region?.[dim.id] ?? 0;
  const provinceVal = byPerimeter.origin_province?.[dim.id] ?? 0;

  const regPct = nationalVal > 0 ? Math.round((regionVal / nationalVal) * 100) : 0;
  const provPctOfNat = nationalVal > 0 ? Math.round((provinceVal / nationalVal) * 100) : 0;
  const provPctOfReg = regionVal > 0 ? Math.round((provinceVal / regionVal) * 100) : 0;

  const tiers = dim.id === "fiscal"
    ? [{ id: "national", levelLabel: "Totale nazionale", name: "Italia", value: nationalVal, pct: 100, pctLabel: null }]
    : [
        { id: "national", levelLabel: "Totale nazionale", name: "Italia", value: nationalVal, pct: 100, pctLabel: null },
        { id: "region", levelLabel: "Regione di origine", name: regionName, value: regionVal, pct: regPct, pctLabel: `${regPct}% del nazionale` },
        { id: "province", levelLabel: "Provincia di origine", name: originProvince, value: provinceVal, pct: provPctOfNat, pctLabel: `${provPctOfNat}% del nazionale · ${provPctOfReg}% della regione` },
      ];

  return (
    <div className="border border-ink-100 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-ink-100 bg-bg-page px-5 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">Distribuzione territoriale</p>
        <p className="mt-0.5 text-xs text-ink-400">
          {dim.id === "fiscal" ? "Il gettito fiscale è calcolato solo su scala nazionale" : "Ogni livello è contenuto in quello superiore · leggi dall'alto in basso"}
        </p>
      </div>
      <div className="divide-y divide-ink-100">
        {tiers.map((tier, i) => (
          <div key={tier.id} className="flex gap-4 py-5 pr-5" style={{ paddingLeft: 20 + i * 24 }}>
            {i > 0 && (
              <div className="flex shrink-0 flex-col items-center pt-1">
                <div className="h-2 w-px bg-ink-200" />
                <span className="text-[10px] text-ink-300">└</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-ink-500">{tier.levelLabel}</p>
              <div className="mt-1 flex flex-wrap items-baseline justify-between gap-2">
                <p className={["font-bold text-ink-900", i === 0 ? "text-[22px]" : i === 1 ? "text-[19px]" : "text-[17px]"].join(" ")}>
                  {tier.name}
                </p>
                <p className={["font-bold tabular-nums text-ink-900", i === 0 ? "text-[22px]" : i === 1 ? "text-[19px]" : "text-[17px]"].join(" ")}>
                  {fmt(tier.value)}
                </p>
              </div>
              {tier.pctLabel && (
                <p className="mt-0.5 text-[11px] font-mono font-semibold text-brand-violet">{tier.pctLabel}</p>
              )}
              <div className="mt-2 h-1.5 w-full overflow-hidden bg-ink-100">
                <div className="h-full bg-brand-violet transition-all" style={{ width: `${tier.pct}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MultiplierWaterfall() {
  const [perim, setPerim] = useState("regione");
  const spend = inp.total_spend ?? 0;
  const spendM = spend / 1_000_000;
  const isNational = perim === "nazionale";

  const perData = isNational ? byPerimeter.national : byPerimeter.region;
  const perLabel = isNational ? "totale nazionale" : "totale regionale";

  // Multipliers computed from perimeter totals divided by spend
  const gdpMult = spend > 0 ? (perData?.gdp ?? 0) / spend : 0;
  const prodMult = spend > 0 ? (perData?.production ?? 0) / spend : 0;
  const empIntensity = spendM > 0 ? (perData?.employment ?? 0) / spendM : 0;
  const fiscalPct = (synthKpis.fiscal_autofinanc_pct ?? 0) * 100;

  const outputs = [
    {
      id: "production",
      icon: "produzione",
      label: "Produzione",
      multValue: prodMult,
      multFmt: (v) => fmtIT(v, 2),
      multSuffix: "×",
      multNote: "per ogni € speso",
      total: fmtM(perData?.production ?? 0),
    },
    {
      id: "gdp",
      icon: "pil",
      label: "PIL",
      multValue: gdpMult,
      multFmt: (v) => fmtIT(v, 2),
      multSuffix: "×",
      multNote: "per ogni € speso",
      total: fmtM(perData?.gdp ?? 0),
    },
    {
      id: "employment",
      icon: "occupazione",
      label: "Occupazione",
      multValue: empIntensity,
      multFmt: (v) => fmtIT(v, 1),
      multSuffix: " ETP",
      multNote: "per M€ speso",
      total: fmtETP(perData?.employment ?? 0),
    },
    {
      id: "fiscal",
      icon: "gettito",
      label: "Gettito fiscale",
      multValue: fiscalPct,
      multFmt: (v) => fmtIT(v, 1),
      multSuffix: "%",
      multNote: "della spesa rientra",
      total: fmtM(byPerimeter.national?.fiscal ?? 0),
    },
  ];

  const n = outputs.length;
  const step = 100 / n;
  const centers = outputs.map((_, i) => step * i + step / 2);

  return (
    <div className="border border-ink-100 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 bg-bg-page px-5 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
          Come si moltiplica la spesa
        </p>
        <SegmentedGroup
          label=""
          options={[
            { id: "regione", label: "Regione" },
            { id: "nazionale", label: "Nazionale" },
          ]}
          value={perim}
          onChange={setPerim}
        />
      </div>
      <div className="p-5">
        {/* Source node */}
        <div className="flex justify-center">
          <div className="flex items-center gap-3 border border-brand-violet bg-brand-violet/5 px-5 py-3">
            <ImpactIcon
              type="spese"
              label="Spesa"
              className="h-5 w-5"
              wrapperClassName="flex h-5 w-5 shrink-0 items-center justify-center text-brand-violet"
            />
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-violet/70">Spesa investita</p>
              <p className="text-[20px] font-bold leading-tight text-brand-violet">{fmtM(spend)}</p>
            </div>
          </div>
        </div>

        {/* SVG waterfall connector */}
        <svg className="w-full" height="32" viewBox="0 0 100 32" preserveAspectRatio="none">
          <line x1="50" y1="0" x2="50" y2="16" stroke="#5B21F7" strokeWidth="1" opacity="0.25" vectorEffect="non-scaling-stroke" />
          <line x1={centers[0]} y1="16" x2={centers[n - 1]} y2="16" stroke="#5B21F7" strokeWidth="1" opacity="0.25" vectorEffect="non-scaling-stroke" />
          {centers.map((cx, i) => (
            <line key={i} x1={cx} y1="16" x2={cx} y2="32" stroke="#5B21F7" strokeWidth="1" opacity="0.25" vectorEffect="non-scaling-stroke" />
          ))}
        </svg>

        {/* Output cards */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {outputs.map((o) => (
            <div key={o.id} className="border border-ink-100 bg-white p-4" style={{ borderTop: "3px solid #5B21F7" }}>
              <div className="flex items-center gap-1.5">
                <ImpactIcon
                  type={o.icon}
                  label={o.label}
                  className="h-3.5 w-3.5"
                  wrapperClassName="flex h-3.5 w-3.5 shrink-0 items-center justify-center text-brand-violet"
                />
                <p className="text-[10px] font-mono uppercase tracking-[0.12em] text-ink-500">{o.label}</p>
              </div>
              <p className="mt-3 text-[30px] font-bold leading-none text-brand-violet">
                {o.multFmt(o.multValue)}
                <span className="text-[13px] font-semibold text-brand-violet/60">{o.multSuffix}</span>
              </p>
              <p className="mt-0.5 text-[10px] text-ink-400">{o.multNote}</p>
              <div className="mt-3 border-t border-ink-100 pt-2">
                <p className="text-[12px] font-semibold text-ink-900">{o.total}</p>
                <p className="text-[10px] text-ink-400">{o.id === "fiscal" ? "totale nazionale" : perLabel}</p>
              </div>
            </div>
          ))}
        </div>

        {isNational && (
          <p className="mt-4 text-xs italic text-ink-400">
            I moltiplicatori sono ancorati al perimetro regionale. A livello nazionale tendono a sovrastimare, perché includono valore che si attiva in regioni non committenti.
          </p>
        )}
      </div>
    </div>
  );
}

function DimensionGlossary() {
  const [open, setOpen] = useState(false);
  const dims = [
    {
      icon: "spese",
      label: "Spesa investita",
      text: "Lo «shock» iniziale immesso nell'economia: il costo totale del progetto che attiva le filiere. È il punto di partenza di tutta l'analisi.",
    },
    {
      icon: "produzione",
      label: "Valore della produzione",
      text: "Il volume d'affari complessivo attivato lungo la filiera, inclusi i fornitori di secondo e terzo livello. È sempre superiore alla spesa perché la catena si moltiplica.",
    },
    {
      icon: "pil",
      label: "PIL (valore aggiunto)",
      text: "La nuova ricchezza genuinamente creata: differenza tra il valore prodotto e il costo degli input intermedi. È la misura più accurata dell'impatto economico netto.",
    },
    {
      icon: "occupazione",
      label: "Occupazione (ETP)",
      text: "Posti di lavoro equivalenti a tempo pieno generati nell'economia: lavoro diretto nei settori che ricevono la spesa, indiretto presso i fornitori, indotto dai consumi.",
    },
    {
      icon: "redditi",
      label: "Redditi distribuiti",
      text: "La quota di valore aggiunto che torna a famiglie e imprese come salari, profitti e rendite. Misura quanta ricchezza creata si converte in potere d'acquisto dei residenti.",
    },
    {
      icon: "gettito",
      label: "Gettito fiscale",
      text: "Imposte e contributi attivati dall'attività economica indotta. Indica quanta parte della spesa pubblica «rientra» alle casse pubbliche attraverso il giro dell'economia.",
    },
  ];

  return (
    <div className="border border-ink-100 bg-white shadow-sm">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-5 py-3 text-left transition-colors hover:bg-bg-page"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">Cosa misura ogni dimensione</p>
        <span className="text-xs text-ink-400">{open ? "Chiudi ↑" : "Apri ↓"}</span>
      </button>
      {open && (
        <div className="border-t border-ink-100">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 md:grid-cols-2 lg:grid-cols-3">
            {dims.map((d) => (
              <div key={d.label} className="flex gap-3">
                <ImpactIcon
                  type={d.icon}
                  label={d.label}
                  className="h-4 w-4"
                  wrapperClassName="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-brand-violet"
                />
                <div>
                  <p className="text-[12px] font-bold text-ink-900">{d.label}</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-ink-600">{d.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ViewControls({
  leftLabel,
  leftOptions,
  leftValue,
  onLeftChange,
  rightLabel,
  rightOptions,
  rightValue,
  onRightChange,
}) {
  return (
    <div className="grid grid-cols-1 gap-3 rounded-md bg-bg-page p-4 md:grid-cols-2">
      <SegmentedGroup label={leftLabel} options={leftOptions} value={leftValue} onChange={onLeftChange} />
      <SegmentedGroup label={rightLabel} options={rightOptions} value={rightValue} onChange={onRightChange} />
    </div>
  );
}

function SegmentedGroup({ label, options, value, onChange }) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-500">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className={[
                "border px-3 py-2 text-sm font-semibold transition-colors",
                active ? "border-ink-900 bg-ink-900 text-white" : "border-ink-300 bg-white text-ink-700 hover:border-brand-violet hover:text-brand-violet",
              ].join(" ")}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SpendInputCard({ isMultiProvince }) {
  const total = inp.total_spend ?? 0;
  return (
    <div className="border border-ink-100 bg-white p-4 shadow-sm">
      <div className="border-l-4 border-brand-violet pl-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">Spesa totale investita</p>
        <p className="mt-2 text-[22px] font-bold leading-tight text-ink-900">{fmtM(total)}</p>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-700">
          L'investimento di partenza, distribuito su <strong>{nVoci} voci di spesa</strong>{" "}
          {isMultiProvince ? "nelle province di" : "nella provincia di"} <strong>{originProvince}</strong>.
        </p>
        {isMultiProvince && (
          <div className="mt-4 flex flex-wrap gap-2">
            {(inp.origin_provinces ?? []).map((p) => (
              <span key={p.code} className="inline-flex items-center gap-1.5 border border-ink-100 bg-bg-page px-3 py-1 text-xs font-semibold text-ink-700">
                {p.name}
                <span className="font-mono text-ink-500">{Math.round((p.spend_share ?? 0) * 100)}%</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EffectCard({ effect, perim, mode }) {
  const total = effect.getData(perim);
  const perimValue = mode === "pc" && effect.getPc ? effect.getPc(perim) : total;
  const displayMode = effect.nationalOnly ? "assoluti" : mode;
  const displayDim = effect.isMoney ? inferDim(effect.id) : "employment";
  const caption = effect.nationalOnly
    ? "Italia"
    : perimeterCaption(perim);

  const def = DIMENSION_DEFS[effect.id] ?? null;

  return (
    <div className="border border-ink-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-1">
        <div className="flex min-w-0 items-start gap-2">
          <ImpactIcon
            type={effect.icon}
            label={effect.label}
            className="h-5 w-5"
            wrapperClassName="flex h-5 w-5 shrink-0 items-center justify-center text-brand-violet"
          />
          <p className="min-w-0 text-[11px] font-bold uppercase leading-tight tracking-wide text-ink-700">{effect.label}</p>
        </div>
        {def && (
          <div className="group relative shrink-0">
            <button className="flex h-4 w-4 shrink-0 items-center justify-center border border-ink-200 text-[9px] font-bold text-ink-400 transition-colors hover:border-brand-violet hover:text-brand-violet">
              i
            </button>
            <div className="pointer-events-none absolute right-0 top-5 z-20 hidden w-60 border border-ink-100 bg-white p-3 text-[11px] leading-relaxed text-ink-600 shadow-lg group-hover:block">
              {def}
            </div>
          </div>
        )}
      </div>
      <p className="text-[22px] font-bold leading-tight text-ink-900">
        {formatDimensionValue(displayDim, perimValue, displayMode)}
      </p>
      <p className="mt-1 text-[11px] text-ink-400">{caption}</p>
    </div>
  );
}

function inferDim(effectId) {
  if (effectId === "production") return "production";
  if (effectId === "gdp") return "gdp";
  if (effectId === "employment") return "employment";
  if (effectId === "income") return "income";
  return "gdp";
}

function fmtMoneyOrEtp(value, isMoney) {
  return isMoney ? fmtM(value) : fmtETP(value);
}

function perimeterCaption(perim) {
  if (perim === "provincia") return `provincia di ${originProvince}`;
  if (perim === "nazionale") return "Italia";
  return `regione ${regionName}`;
}

function ThreeSegmentBar({ origin, rest, extra, highlight }) {
  const total = origin + rest + extra || 1;
  const o = clamp((origin / total) * 100, 0, 100);
  const r = clamp((rest / total) * 100, 0, 100);
  const e = clamp((extra / total) * 100, 0, 100);
  const emphasis = {
    provincia: [1, 0.35, 0.35],
    regione: [1, 1, 0.35],
    nazionale: [1, 1, 1],
  }[highlight] ?? [1, 1, 1];

  return (
    <div className="mt-4 overflow-hidden rounded-none border border-ink-100 bg-white">
      <div className="flex h-4 w-full">
        <div className="bg-impact-direct transition-opacity" style={{ width: `${o}%`, opacity: emphasis[0] }} />
        <div className="bg-impact-indirect transition-opacity" style={{ width: `${r}%`, opacity: emphasis[1] }} />
        <div className="bg-impact-induced transition-opacity" style={{ width: `${e}%`, opacity: emphasis[2] }} />
      </div>
    </div>
  );
}

function KPIBar({ perim }) {
  if (perim === "provincia") {
    return (
      <div className="bg-bg-page p-4 md:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500 mb-3">Indicatori sintetici</p>
        <p className="text-sm font-medium text-ink-700">I moltiplicatori non sono visualizzati a livello provinciale.</p>
        <p className="mt-2 max-w-3xl text-sm italic leading-relaxed text-ink-700">
          A livello provinciale i moltiplicatori tendono a sottostimare il rendimento del progetto, perché parte degli effetti
          si attiva nel resto della regione tramite spillover. Seleziona{" "}
          <strong>Regione</strong> o <strong>Nazionale</strong> per vedere i moltiplicatori sintetici.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-bg-page p-4 md:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500 mb-3">Indicatori sintetici</p>
      <p className="text-[13px] font-medium text-ink-700">Riferiti al perimetro regionale.</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {KPI_PILLS.map((pill) => (
          <KPIChip key={pill.value} label={pill.value} tooltip={pill.tip} />
        ))}
      </div>
      {perim === "nazionale" && (
        <p className="mt-4 max-w-4xl text-sm italic leading-relaxed text-ink-700">
          I moltiplicatori sono ancorati al perimetro regionale, dove risultano più affidabili.
          A livello nazionale tendono a sovrastimare il rendimento, perché includono valore che si sposta in regioni non committenti del progetto.
        </p>
      )}
    </div>
  );
}

function ComponentBreakdownPanel({ dim }) {
  const data = comps[dim] ?? null;
  if (!data) return null;

  const direct = data.direct ?? 0;
  const indirect = data.indirect ?? 0;
  const induced = data.induced ?? 0;
  const total = direct + indirect + induced || 1;
  const totalLabel = dim === "employment" ? fmtETP(total) : fmtM(total);

  const items = [
    {
      key: "direct",
      label: "Diretto",
      value: direct,
      pct: Math.round((direct / total) * 100),
      color: "bg-impact-direct",
      note: "Effetto immediato della spesa.",
    },
    {
      key: "indirect",
      label: "Indiretto",
      value: indirect,
      pct: Math.round((indirect / total) * 100),
      color: "bg-impact-indirect",
      note: "Effetto sui fornitori della filiera.",
    },
    {
      key: "induced",
      label: "Indotto",
      value: induced,
      pct: Math.round((induced / total) * 100),
      color: "bg-impact-induced",
      note: "Effetto dei redditi e dei consumi.",
    },
  ];

  return (
    <div className="border border-ink-100 bg-white p-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-500">Lettura per componente</p>
          <p className="mt-1 text-sm text-ink-700">Il progetto si legge sempre come somma di diretto, indiretto e indotto.</p>
        </div>
        <p className="text-xs font-semibold text-ink-500">{totalLabel} totale</p>
      </div>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.key} className="border border-ink-100 bg-bg-page p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 ${item.color}`} />
                <span className="text-sm font-semibold text-ink-900">{item.label}</span>
              </div>
              <span className="text-xs font-mono font-semibold text-ink-900">{item.pct}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden bg-white">
              <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
            </div>
            <p className="mt-2 text-xs text-ink-500">
              {dim === "employment" ? fmtETP(item.value) : fmtM(item.value)} / {cleanText(item.note)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function KPIChip({ label, tooltip }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <span className="inline-flex cursor-default select-none items-center rounded-full border border-ink-300 bg-white px-4 py-2 text-sm font-semibold text-ink-700">
        {label}
      </span>
      {open && (
        <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-64 -translate-x-1/2 border border-ink-100 bg-ink-900 px-3 py-2 text-center text-xs leading-snug text-white">
          {tooltip}
        </div>
      )}
    </div>
  );
}

function TakeawayBanner({ text }) {
  return (
    <div className="border-l-4 border-accent-lime bg-white px-6 py-5">
      <p className="text-sm font-medium text-ink-900">{text}</p>
    </div>
  );
}

function SectionLabel({ title, subtitle }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1.5 h-3.5 w-0.5 shrink-0 bg-brand-violet" />
      <div>
        <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-700">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs leading-snug text-ink-400">{subtitle}</p>}
      </div>
    </div>
  );
}

function MetricMini({ label, value }) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-[0.12em] text-ink-400">{label}</p>
      <p className="mt-0.5 text-[11px] font-semibold text-ink-700">{value}</p>
    </div>
  );
}

function TabComponenti() {
  const TERR_OPTS = [
    { id: "province",    label: originProvince },
    { id: "rest_region", label: `Resto della ${regionName}` },
    { id: "rest_italy",  label: "Resto d'Italia" },
    { id: "national",    label: "Totale Italia" },
  ];

  const METRIC_OPTS = [
    { id: "production", label: "Produzione", isMoney: true },
    { id: "gdp",        label: "PIL",        isMoney: true },
    { id: "employment", label: "Occupazione", isMoney: false },
  ];

  const EFFECT_DEFS = [
    { id: "direct",   label: "Diretto",   cls: "bg-impact-direct",   chipDesc: "la spesa iniziale",        sectorDesc: "I settori che ricevono direttamente la spesa." },
    { id: "indirect", label: "Indiretto", cls: "bg-impact-indirect", chipDesc: "i fornitori attivati",     sectorDesc: "I fornitori attivati a cascata dai settori diretti." },
    { id: "induced",  label: "Indotto",   cls: "bg-impact-induced",  chipDesc: "i consumi delle famiglie", sectorDesc: "I settori sostenuti dai consumi delle famiglie dei lavoratori." },
  ];

  const EFFECTS_BY_TERR = {
    province:    ["direct", "indirect", "induced"],
    rest_region: ["indirect", "induced"],
    rest_italy:  ["indirect", "induced"],
    national:    ["direct", "indirect", "induced"],
  };

  const [terrId, setTerrId] = useState("province");
  const [metricId, setMetricId] = useState("production");

  const metricDef = METRIC_OPTS.find(m => m.id === metricId) ?? METRIC_OPTS[0];
  const data = comps[metricId] ?? {};
  const effects = EFFECTS_BY_TERR[terrId] ?? EFFECTS_BY_TERR.national;
  const hasDirect = effects.includes("direct");
  const fmt = metricDef.isMoney ? fmtM : fmtETP;
  const terrLabel = TERR_OPTS.find(t => t.id === terrId)?.label ?? "";

  let compValues;
  if (terrId === "national") {
    compValues = { direct: data.direct ?? 0, indirect: data.indirect ?? 0, induced: data.induced ?? 0 };
  } else {
    const segIdx = { province: 0, rest_region: 1, rest_italy: 2 };
    const segs = buildTerritorialSegments(metricId);
    const seg = segs[segIdx[terrId] ?? 0];
    compValues = buildSegmentComponentValues(data, seg);
  }

  const total = effects.reduce((sum, e) => sum + (compValues[e] ?? 0), 0);
  const pctArr = roundedPctParts(effects.map(e => compValues[e] ?? 0));

  const effectItems = effects.map((e, i) => {
    const def = EFFECT_DEFS.find(d => d.id === e);
    const value = compValues[e] ?? 0;
    const natValue = data[e] ?? 0;
    const ratio = natValue > 0 ? value / natValue : 0;
    const topSectors = (data.top_sectors?.[e] ?? []).slice(0, 3).map(s => ({ name: s.name, value: s.value * ratio }));
    return { ...def, value, pct: pctArr[i], topSectors };
  });

  const directPct  = hasDirect && total > 0 ? Math.round(((compValues.direct  ?? 0) / total) * 100) : 0;
  const indirectPct = total > 0 ? Math.round(((compValues.indirect ?? 0) / total) * 100) : 0;
  const inducedPct  = total > 0 ? Math.round(((compValues.induced  ?? 0) / total) * 100) : 0;

  let insight = "";
  if (terrId === "province") {
    insight = directPct > 85
      ? `A ${originProvince} la quasi totalità dell'impatto è diretta (${directPct}%): la spesa iniziale è concentrata sul territorio.`
      : `A ${originProvince} il diretto domina (${directPct}%), affiancato da indiretto (${indirectPct}%) e indotto (${inducedPct}%).`;
  } else if (terrId === "rest_region") {
    insight = inducedPct >= indirectPct
      ? `Nel resto della ${regionName} l'indotto (${inducedPct}%) supera l'indiretto: i consumi delle famiglie generano valore in tutta la regione.`
      : `Nel resto della ${regionName} indiretto (${indirectPct}%) e indotto (${inducedPct}%) si spartiscono l'impatto a cascata.`;
  } else if (terrId === "rest_italy") {
    insight = `Nel resto d'Italia ${inducedPct >= indirectPct ? `l'indotto (${inducedPct}%)` : `l'indiretto (${indirectPct}%)`} è la componente principale: la spesa di ${originProvince} si propaga ben oltre i confini regionali.`;
  } else {
    const dom = directPct >= indirectPct && directPct >= inducedPct
      ? `il diretto (${directPct}%)` : inducedPct >= directPct && inducedPct >= indirectPct
      ? `l'indotto (${inducedPct}%)` : `l'indiretto (${indirectPct}%)`;
    insight = `A livello nazionale ${dom} è la componente principale, ma tutti e tre gli effetti concorrono alla creazione di valore.`;
  }

  return (
    <div className="space-y-6">
      {/* Legenda effetti */}
      <div className="flex flex-wrap gap-2">
        {EFFECT_DEFS.map(e => (
          <div key={e.id} className="flex items-center gap-2 rounded-full bg-brand-violet/5 px-3 py-1.5">
            <span className={`h-2 w-2 flex-shrink-0 rounded-full ${e.cls}`} />
            <span className="text-[12px] font-semibold text-brand-violet-dark">{e.label}</span>
            <span className="text-[12px] text-ink-500">{e.chipDesc}</span>
          </div>
        ))}
      </div>

      {/* Selettori */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-8">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-400">Territorio</p>
          <div className="flex flex-wrap gap-0.5 rounded bg-bg-page p-1">
            {TERR_OPTS.map(t => (
              <button key={t.id} onClick={() => setTerrId(t.id)}
                className={["rounded px-3 py-1.5 text-[13px] font-medium transition-colors",
                  terrId === t.id ? "bg-white text-ink-900 shadow-sm ring-1 ring-ink-100" : "text-ink-500 hover:text-ink-900",
                ].join(" ")}>{t.label}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-400">Metrica</p>
          <div className="flex flex-wrap gap-0.5 rounded bg-bg-page p-1">
            {METRIC_OPTS.map(m => (
              <button key={m.id} onClick={() => setMetricId(m.id)}
                className={["rounded px-3 py-1.5 text-[13px] font-medium transition-colors",
                  metricId === m.id ? "bg-white text-ink-900 shadow-sm ring-1 ring-ink-100" : "text-ink-500 hover:text-ink-900",
                ].join(" ")}>{m.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Insight */}
      <div className="border-l-4 border-brand-violet bg-brand-violet/5 px-5 py-4">
        <p className="text-[14px] leading-relaxed text-brand-violet">{insight}</p>
      </div>

      {/* Composizione */}
      <div className="overflow-hidden border border-ink-100 bg-white">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-ink-100 px-5 py-4">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-400">Composizione in</p>
            <p className="mt-0.5 text-[17px] font-bold text-ink-900">{terrLabel}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-400">Totale</p>
            <p className="mt-0.5 text-[22px] font-bold text-ink-900">{fmt(total)}</p>
          </div>
        </div>
        <div className="px-5 pt-5">
          <div className="flex h-5 w-full overflow-hidden bg-ink-100">
            {effectItems.map(item => (
              <div key={item.id} className={item.cls} style={{ width: `${item.pct}%` }}
                title={`${item.label}: ${fmt(item.value)} (${item.pct}%)`} />
            ))}
          </div>
          <div className={`mt-5 grid gap-5 pb-5 ${effects.length === 3 ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2"}`}>
            {effectItems.map(item => (
              <div key={item.id}>
                <div className="mb-1.5 flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-sm ${item.cls}`} />
                  <span className="text-[12px] font-semibold text-ink-600">{item.label}</span>
                </div>
                <p className="text-[20px] font-bold leading-none text-ink-900">{fmt(item.value)}</p>
                <p className="mt-1 text-[12px] text-ink-400">{item.pct}% del totale</p>
              </div>
            ))}
          </div>
        </div>
        {!hasDirect && (
          <div className="mx-5 mb-5 flex items-start gap-2 bg-bg-page px-4 py-3">
            <svg className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-ink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>
            </svg>
            <p className="text-[12px] text-ink-600">
              L'effetto diretto è presente solo nella provincia di origine ({originProvince}), dove la spesa è realmente sostenuta. In {terrLabel} arrivano solo gli effetti a cascata.
            </p>
          </div>
        )}
      </div>

      {/* Settori */}
      <div>
        <SintesiSectionHead
          title="Dove finisce il valore, effetto per effetto"
          subtitle={`I primi tre settori per ciascun effetto in ${terrLabel}`}
        />
        <div className={`mt-4 grid border border-ink-100 bg-white divide-y divide-ink-100 md:divide-y-0 md:divide-x ${effects.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
          {effectItems.map(item => (
            <div key={item.id} className="px-5 py-5">
              <div className="mb-4 flex items-center gap-2">
                <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-sm ${item.cls}`} />
                <span className="text-[13px] font-bold text-ink-900">{item.label}</span>
              </div>
              {item.topSectors.map((s, i) => (
                <div key={i} className="flex items-baseline justify-between gap-3 border-b border-ink-100 py-2 last:border-0">
                  <span className="truncate text-[13px] text-ink-600">{i + 1}. {s.name}</span>
                  <span className="whitespace-nowrap text-[13px] font-semibold text-ink-900">{fmt(s.value)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SegmentSelector({ dim, selectedSegmentId, onSelectSegment }) {
  const fmt = dim.isMoney ? fmtM : fmtETP;
  const segments = buildTerritorialSegments(dim.id);

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {segments.map((segment) => (
        <button
          key={segment.id}
          type="button"
          onClick={() => onSelectSegment(segment.id)}
          className={[
            "border bg-white p-4 text-left transition-colors",
            selectedSegmentId === segment.id ? "border-brand-violet ring-1 ring-brand-violet" : "border-ink-100 hover:border-brand-violet",
          ].join(" ")}
        >
          <p className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.14em] text-ink-500">
            <span className={`h-2.5 w-2.5 shrink-0 ${segment.cls}`} />
            {segment.label}
          </p>
          <p className="mt-2 text-[16px] font-bold text-ink-900">
            {segment.id === "rest_region" ? `Altre province in ${segment.name}` : segment.name}
          </p>
          <div className="mt-3 flex items-end justify-between gap-2">
            <p className="font-mono text-[24px] font-bold tabular-nums text-ink-900">{segment.pct}%</p>
            <p className="text-right text-xs font-semibold text-ink-700">{fmt(segment.value)}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

function SelectedSegmentBar({ dim, data, segment }) {
  const fmt = dim.isMoney ? fmtM : fmtETP;
  const components = buildSegmentComponentValues(data, segment);
  const total = components.direct + components.indirect + components.induced;
  const pcts = roundedPctParts([components.direct, components.indirect, components.induced]);
  const items = [
    { key: "direct", label: "Diretto", value: components.direct, pct: pcts[0], cls: "bg-impact-direct" },
    { key: "indirect", label: "Indiretto", value: components.indirect, pct: pcts[1], cls: "bg-impact-indirect" },
    { key: "induced", label: "Indotto", value: components.induced, pct: pcts[2], cls: "bg-impact-induced" },
  ];

  return (
    <div className="border border-ink-100 bg-white p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-sm font-semibold text-ink-700">Composizione in {territorialSegmentName(segment)}</p>
        <p className="font-mono text-[20px] font-bold tabular-nums text-ink-900">{fmt(total)}</p>
      </div>
      <div className="mt-4 flex h-7 w-full overflow-hidden bg-ink-100">
        {items.map((item) => (
          <div
            key={item.key}
            className={`${item.cls} h-full`}
            style={{ width: `${item.pct}%` }}
            title={`${item.label}: ${fmt(item.value)} (${item.pct}%)`}
          />
        ))}
      </div>
    </div>
  );
}

function PerimeterDiiBreakdown({ dim }) {
  const natTotal = byPerimeter.national?.[dim.id] ?? 0;
  const fmt = dim.isMoney ? fmtM : fmtETP;
  const data = dim.data ?? {};
  const components = {
    direct: data.direct ?? 0,
    indirect: data.indirect ?? 0,
    induced: data.induced ?? 0,
  };
  const pcts = roundedPctParts([components.direct, components.indirect, components.induced]);
  const items = [
    { key: "direct", label: "Diretto", value: components.direct, pct: pcts[0], cls: "bg-impact-direct" },
    { key: "indirect", label: "Indiretto", value: components.indirect, pct: pcts[1], cls: "bg-impact-indirect" },
    { key: "induced", label: "Indotto", value: components.induced, pct: pcts[2], cls: "bg-impact-induced" },
  ];

  return (
    <div className="border border-ink-100 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-ink-100 bg-bg-page px-5 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
          {dim.label} — composizione nazionale
        </p>
        <p className="mt-0.5 text-xs text-ink-400">
          Diretto + indiretto + indotto = 100% del totale nazionale
        </p>
      </div>

      <div className="p-5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm font-semibold text-ink-700">Totale nazionale</p>
          <p className="font-mono text-[20px] font-bold tabular-nums text-ink-900">{fmt(natTotal)}</p>
        </div>

        <div className="mt-4 flex h-7 w-full overflow-hidden bg-ink-100">
          {items.map((item) => (
            <div
              key={item.key}
              className={`${item.cls} h-full`}
              style={{ width: `${item.pct}%` }}
              title={`${item.label}: ${fmt(item.value)} (${item.pct}%)`}
            />
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
          {items.map((item) => (
            <span key={item.key} className="flex items-center gap-2 text-[11px] text-ink-600">
              <span className={`h-2.5 w-2.5 shrink-0 ${item.cls}`} />
              <span>{item.label}</span>
              <span className="font-mono font-semibold text-ink-900">{item.pct}%</span>
              <span className="font-mono text-ink-400">{fmt(item.value)}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function DidacticNote() {
  return (
    <div className="border border-ink-100 bg-bg-page p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">Come si legge</p>
      <p className="mt-3 text-sm leading-relaxed text-ink-700">
          Ogni euro speso genera tre effetti che convivono: diretto, indiretto e indotto. La scomposizione è analitica, non temporale.
      </p>
      <p className="mt-3 text-sm italic leading-relaxed text-ink-700">
        I tre effetti si autoalimentano: l'indotto nasce dai redditi del diretto e dell'indiretto, che a loro volta tornano in produzione.
      </p>
    </div>
  );
}

function DimensionSelector({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {COMPONENTS.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            disabled={!opt.data}
            onClick={() => opt.data && onChange(opt.id)}
            className={[
              "border px-4 py-2 text-sm font-semibold transition-colors",
              active ? "border-brand-violet bg-brand-violet text-white" : "border-ink-300 bg-white text-ink-700 hover:border-brand-violet hover:text-brand-violet",
              !opt.data ? "cursor-not-allowed border-ink-100 bg-ink-100 text-ink-300 hover:text-ink-300" : "",
            ].join(" ")}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function ComponentColumn({ variant, dim, data, segment = null }) {
  const key = variant === "direct" ? "direct" : variant === "indirect" ? "indirect" : "induced";
  const accent = variant === "direct" ? "bg-impact-direct" : variant === "indirect" ? "bg-impact-indirect" : "bg-impact-induced";
  const components = buildSegmentComponentValues(data, segment);
  const value = components[key] ?? 0;
  const total = components.direct + components.indirect + components.induced;
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  const nationalValue = data?.[key] ?? 0;
  const componentRatio = nationalValue > 0 ? value / nationalValue : 0;
  const items = (data?.top_sectors?.[key] ?? [])
    .slice(0, 3)
    .map((item) => ({ ...item, value: item.value * componentRatio }));
  const variantLabel = variant === "direct" ? "Diretto" : variant === "indirect" ? "Indiretto" : "Indotto";
  const segmentLabel = territorialSegmentName(segment);

  return (
    <div className="border border-ink-100 bg-white p-5">
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${accent}`} />
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">{variantLabel}</h3>
      </div>
      <p className="mt-3 text-[28px] font-bold text-ink-900">{dim.isMoney ? fmtM(value) : fmtETP(value)}</p>
      <p className="mt-1 text-xs text-ink-500">
        {pct}% del totale in {segmentLabel}
      </p>
      <div className="mt-4 h-px bg-ink-100" />
      <ul className="mt-4 space-y-2">
        {value > 0 ? (
          items.map((s, idx) => (
            <li key={`${variant}-${idx}`} className="flex items-center justify-between gap-3 text-xs">
              <span className="truncate text-ink-700">{idx + 1}. {s.name}</span>
              <span className="font-mono font-semibold text-ink-900">{dim.isMoney ? fmtM(s.value) : fmtETP(s.value)}</span>
            </li>
          ))
        ) : (
          <li className="text-xs italic text-ink-500">Nessun valore {variantLabel.toLowerCase()} in questo perimetro.</li>
        )}
      </ul>
      <p className="mt-4 text-sm leading-relaxed text-ink-700">
        {variant === "direct" && "L'effetto immediato sui settori che ricevono la spesa."}
        {variant === "indirect" && "L'effetto a cascata sui fornitori dei settori direttamente coinvolti."}
        {variant === "induced" && "L'effetto dei consumi delle famiglie dei lavoratori coinvolti."}
      </p>
    </div>
  );
}

function ComponentsTakeaway({ data }) {
  if (!data) return null;
  const sum = (data.direct ?? 0) + (data.indirect ?? 0) + (data.induced ?? 0) || 1;
  const directPct = Math.round(((data.direct ?? 0) / sum) * 100);
  const indirectPct = Math.round(((data.indirect ?? 0) / sum) * 100);
  const inducedPct = Math.round(((data.induced ?? 0) / sum) * 100);
  const text = inducedPct > 35
    ? `Il forte peso dell'indotto (${inducedPct}%) indica che gli stipendi distribuiti generano consumi locali importanti.`
    : directPct > 55
      ? `Il forte peso del diretto (${directPct}%) riflette il fatto che la spesa si concentra in settori ad alta intensità di valore aggiunto immediato.`
      : `La decomposizione è bilanciata: ${directPct}% diretto, ${indirectPct}% indiretto, ${inducedPct}% indotto.`;
  return <TakeawayBanner text={text} />;
}

function TerritoryImpactSummary({ territory }) {
  if (!territory) return null;
  const cards = [
    { key: "production", label: "Produzione", value: territory.production ?? 0, format: fmtM, pc: territory.production_pc ?? 0, pcLabel: "€/ab" },
    { key: "gdp", label: "PIL", value: territory.gdp ?? 0, format: fmtM, pc: territory.gdp_pc ?? 0, pcLabel: "€/ab" },
    { key: "employment", label: "Occupazione", value: territory.employment ?? 0, format: fmtETP, pc: territory.employment_pc ?? 0, pcLabel: "ETP/10k ab." },
    { key: "income", label: "Redditi", value: territory.income ?? 0, format: fmtM, pc: territory.income_pc ?? 0, pcLabel: "€/ab" },
  ];

  return (
    <div className="border border-ink-100 bg-white p-5">
      <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-500">Territorio selezionato</p>
      <p className="mt-1 text-sm text-ink-700">{cleanText(territory.nome ?? territory.name)}</p>
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.key} className="border border-ink-100 bg-bg-page p-4">
            <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-ink-500">{card.label}</p>
            <p className="mt-3 text-2xl font-bold text-ink-900">{card.format(card.value)}</p>
            <p className="mt-1 text-xs text-ink-500">{card.pcLabel} {fmtIT(card.pc, 2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabGeografia({ updateSearch, searchParams, onOpenExplore }) {
  const [dim, setDim] = useState(searchParams?.get("dim") ?? "gdp");
  const [mode, setMode] = useState(searchParams?.get("modal") ?? "assoluti");
  const [selectedRegion, setSelectedRegion] = useState(searchParams?.get("drill") ?? null);
  const [mapLevel, setMapLevel] = useState("regionale");

  const regions = geo.regions ?? [];
  const allProvinces = geo.provinces ?? [];
  const selectedRegionInfo = regions.find((r) => r.nome === selectedRegion);
  const selectedNuts2 = selectedRegionInfo?.nuts2_code ?? (selectedRegion === regionName ? originNuts2 : null);
  const regionProvinces = selectedRegion
    ? allProvinces.filter((p) => p.regione === selectedRegion || p.region_name === selectedRegion)
    : [];

  const isProvinceView = mapLevel === "provinciale" || !!selectedRegion;
  const provinceNuts2 = selectedRegion ? selectedNuts2 : null;

  const currentList = selectedRegion ? regionProvinces : (mapLevel === "provinciale" ? allProvinces : regions);
  const fmt = getGeoFmt(dim, mode);
  const grandTotal = currentList.reduce((sum, item) => sum + getGeoValue(item, dim, mode), 0);

  const mapMax = Math.max(...currentList.map((item) => getGeoValue(item, dim, mode)), 1);

  const mapPayload = isProvinceView
    ? currentList.map((p) => ({
        provincia: p.nome,
        intensita: Math.sqrt(getGeoValue(p, dim, mode) / mapMax),
        hoverText: `${p.nome}: ${fmt(getGeoValue(p, dim, mode))}`,
      }))
    : regions.map((r) => ({
        regione: r.nome,
        intensita: Math.sqrt(getGeoValue(r, dim, mode) / mapMax),
        hoverText: `${r.nome}: ${fmt(getGeoValue(r, dim, mode))}`,
      }));

  const spendMapPayload = isProvinceView
    ? currentList.map((p) => {
        const isOrigin = inp.origin_provinces?.some(
          (op) => op.code === p.code || op.nome === p.nome || op.name === p.nome
        );
        return {
          provincia: p.nome,
          intensita: isOrigin ? 1 : 0,
          hoverText: isOrigin ? `${p.nome}: ${fmtM(inp.total_spend ?? 0)} (spesa)` : `${p.nome}: —`,
        };
      })
    : regions.map((r) => {
        const isOrigin = r.nuts2_code === originNuts2 || r.nome === regionName;
        return {
          regione: r.nome,
          intensita: isOrigin ? 1 : 0,
          hoverText: isOrigin ? `${r.nome}: ${fmtM(inp.total_spend ?? 0)} (spesa)` : `${r.nome}: —`,
        };
      });

  const spendTotal = inp.total_spend || 1;
  const multInfo = (() => {
    if (dim === "production") return { value: `${fmtIT(synthKpis.production_multiplier ?? 0, 2)}×`, sub: "valore produzione / spesa" };
    if (dim === "gdp") return { value: `${fmtIT(synthKpis.gdp_multiplier ?? 0, 2)}×`, sub: "PIL / spesa" };
    if (dim === "employment") return { value: `${fmtIT(synthKpis.employment_intensity_per_meur ?? 0, 1)} ETP`, sub: "per M€ speso" };
    const m = (byPerimeter.region?.income ?? 0) / spendTotal;
    return { value: `${fmtIT(m, 2)}×`, sub: "redditi / spesa" };
  })();

  // Ranking — always absolute, always all regions
  const rankFmt = getGeoFmt(dim, "assoluti");
  const rankSorted = [...regions].sort((a, b) => getGeoValue(b, dim, "assoluti") - getGeoValue(a, dim, "assoluti"));
  const rankTotal = rankSorted.reduce((sum, r) => sum + getGeoValue(r, dim, "assoluti"), 0);
  const rankLeader = rankSorted[0];
  const rankTop5 = rankSorted.slice(1, 6);
  const rankOthers = rankSorted.slice(6);
  const rankOthersSum = rankOthers.reduce((sum, r) => sum + getGeoValue(r, dim, "assoluti"), 0);

  // Bottom section
  const macroSplit = rawGeo.macro_split ?? {};
  const originPct = Math.round((macroSplit.origin?.pct ?? 0.46) * 100);
  const restRegPct = Math.round((macroSplit.rest_of_region?.pct ?? 0.38) * 100);
  const extraPct = 100 - originPct - restRegPct;
  const stayPct = originPct + restRegPct;
  const dimTotal = byPerimeter.national?.[dim] ?? 0;
  const dimFmt = dim === "employment" ? fmtETP : fmtM;
  const dimLabel = GEO_DIMS.find((g) => g.id === dim)?.label ?? dim;

  useEffect(() => {
    updateSearch?.({ dim, modal: mode, drill: selectedRegion ?? null });
  }, [dim, mode, selectedRegion, updateSearch]);

  useEffect(() => {
    setDim(searchParams?.get("dim") ?? "gdp");
    setMode(searchParams?.get("modal") ?? "assoluti");
    setSelectedRegion(searchParams?.get("drill") ?? null);
  }, [searchParams]);

  return (
    <div>
      <p className="mb-7 max-w-[720px] text-[15px] leading-relaxed text-ink-500">
        L'investimento parte da <strong className="text-ink-900">{originProvince}</strong>. La mappa di destra mostra dove si attiva il valore lungo le filiere produttive.
      </p>

      {/* Controls */}
      <div className="mb-5 flex flex-wrap items-end gap-5">
        <div>
          <div className="mb-2 text-[11px] uppercase tracking-[0.08em] text-ink-400">Dimensione</div>
          <GeoTabPills
            options={GEO_DIMS}
            value={dim}
            onChange={(next) => { setDim(next); setSelectedRegion(null); }}
          />
        </div>
        <div className="ml-auto flex flex-wrap items-end gap-4">
          <div>
            <div className="mb-2 text-[11px] uppercase tracking-[0.08em] text-ink-400">Mappa</div>
            <GeoTabPills
              options={[{ id: "regionale", label: "Regioni" }, { id: "provinciale", label: "Province" }]}
              value={mapLevel}
              onChange={(next) => { setMapLevel(next); setSelectedRegion(null); }}
            />
          </div>
          <div>
            <div className="mb-2 text-[11px] uppercase tracking-[0.08em] text-ink-400">Modalità</div>
            <GeoTabPills
              options={[{ id: "assoluti", label: "Assoluti" }, { id: "pc", label: "Pro capite" }]}
              value={mode}
              onChange={setMode}
            />
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      {selectedRegion && (
        <div className="mb-4 flex items-center justify-between gap-3 text-sm">
          <p className="font-medium text-ink-700">Italia › {selectedRegion}</p>
          <button onClick={() => setSelectedRegion(null)} className="inline-flex items-center gap-2 text-brand-violet hover:underline">
            <IconArrowLeft className="h-4 w-4" />
            Torna alla mappa nazionale
          </button>
        </div>
      )}

      {/* Dual row: spesa | moltiplicatore | impatto | ranking */}
      <div className="mb-6 grid grid-cols-1 items-stretch gap-3.5 xl:grid-cols-[1fr_auto_1fr_300px]">

        {/* Spesa map card */}
        <div className="flex flex-col rounded-xl border border-ink-100 bg-white p-5">
          <div className="mb-3">
            <div className="mb-1 text-[11px] uppercase tracking-[0.08em] text-ink-400">Spesa investita</div>
            <div className="text-[22px] font-medium text-ink-900">{fmtM(inp.total_spend ?? 0)}</div>
            <div className="mt-1 text-[12px] text-ink-500">Concentrata nella provincia di {originProvince}</div>
          </div>
          <div className="relative min-h-[360px] flex-1">
            {isProvinceView ? (
              <ProvinceMap nuts2Code={provinceNuts2} data={spendMapPayload} minHeight={360} />
            ) : (
              <ItalyMap data={spendMapPayload} tone="violet" minHeight={360} />
            )}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-ink-100 pt-3 text-[11px] text-ink-400">
            <span>100% in 1 sola {isProvinceView ? "provincia" : "regione"}</span>
          </div>
        </div>

        {/* Moltiplicatore (desktop) */}
        <div className="hidden min-w-[110px] flex-col items-center justify-center px-1 xl:flex">
          <div className="w-px flex-1" style={{ minHeight: 40, background: "linear-gradient(180deg, transparent, #AFA9EC 50%, #AFA9EC)" }} />
          <div className="my-3 min-w-[110px] rounded-xl px-[18px] py-[14px] text-center" style={{ background: "#EEEDFE", border: "1px solid #AFA9EC" }}>
            <div className="mb-1 text-[10px] uppercase tracking-[0.08em]" style={{ color: "#534AB7" }}>Moltiplica</div>
            <div className="text-[28px] font-medium leading-none" style={{ color: "#534AB7" }}>{multInfo.value}</div>
            <div className="mt-1.5 text-[11px] leading-tight" style={{ color: "#3C3489" }}>{multInfo.sub}</div>
          </div>
          <div className="w-px flex-1" style={{ minHeight: 40, background: "linear-gradient(180deg, #AFA9EC, #AFA9EC 50%, transparent)" }} />
        </div>

        {/* Moltiplicatore (mobile) */}
        <div className="flex justify-center xl:hidden">
          <div className="min-w-[110px] rounded-xl px-[18px] py-[14px] text-center" style={{ background: "#EEEDFE", border: "1px solid #AFA9EC" }}>
            <div className="mb-1 text-[10px] uppercase tracking-[0.08em]" style={{ color: "#534AB7" }}>Moltiplica</div>
            <div className="text-[28px] font-medium leading-none" style={{ color: "#534AB7" }}>{multInfo.value}</div>
            <div className="mt-1.5 text-[11px] leading-tight" style={{ color: "#3C3489" }}>{multInfo.sub}</div>
          </div>
        </div>

        {/* Impatto map card */}
        <div className="flex flex-col rounded-xl border border-ink-100 bg-white p-5">
          <div className="mb-3">
            <div className="mb-1 text-[11px] uppercase tracking-[0.08em] text-ink-400">{dimLabel} attivato</div>
            <div className="text-[22px] font-medium" style={{ color: "#534AB7" }}>{fmt(grandTotal)}</div>
            <div className="mt-1 text-[12px] text-ink-500">Distribuito su {regions.length} regioni italiane</div>
          </div>
          <div className="relative min-h-[360px] flex-1">
            {isProvinceView ? (
              <ProvinceMap nuts2Code={provinceNuts2} data={mapPayload} minHeight={360} />
            ) : (
              <ItalyMap
                data={mapPayload}
                tone="violet"
                onRegionClick={(name) => setSelectedRegion((prev) => (prev === name ? null : name))}
                selectedRegion={selectedRegion}
                minHeight={360}
              />
            )}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-ink-100 pt-3 text-[11px] text-ink-400">
            <span>Meno valore</span>
            <div className="flex overflow-hidden rounded-sm">
              {["#EEEDFE", "#CECBF6", "#AFA9EC", "#7F77DD", "#534AB7"].map((c) => (
                <div key={c} style={{ background: c, width: 16, height: 8 }} />
              ))}
            </div>
            <span>Più valore</span>
          </div>
        </div>

        {/* Ranking card */}
        <div className="flex flex-col rounded-xl border border-ink-100 bg-white p-5">
          <div className="mb-3.5 text-[11px] uppercase tracking-[0.08em] text-ink-400">Top regioni per valore</div>

          {rankLeader && (
            <div className="mb-4 border-b border-ink-100 pb-3.5">
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-[15px] font-medium text-ink-900">{rankLeader.nome}</span>
                <span className="text-[15px] font-medium text-ink-900">{rankFmt(getGeoValue(rankLeader, dim, "assoluti"))}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="h-2 flex-1 overflow-hidden rounded" style={{ background: "#F5F5F4" }}>
                  <div
                    className="h-full rounded transition-all"
                    style={{ width: `${rankTotal > 0 ? (getGeoValue(rankLeader, dim, "assoluti") / rankTotal) * 100 : 0}%`, background: "#534AB7" }}
                  />
                </div>
                <span className="min-w-[36px] text-right text-[12px] text-ink-500">
                  {rankTotal > 0 ? Math.round((getGeoValue(rankLeader, dim, "assoluti") / rankTotal) * 100) : 0}%
                </span>
              </div>
            </div>
          )}

          <div className="flex-1">
            {rankTop5.map((r, idx) => {
              const val = getGeoValue(r, dim, "assoluti");
              const pct = rankTotal > 0 ? (val / rankTotal) * 100 : 0;
              return (
                <div
                  key={r.code ?? r.nome}
                  className={`-mx-2 cursor-pointer rounded px-2 py-2 transition-colors hover:bg-bg-page ${selectedRegion === r.nome ? "bg-[#EEEDFE]" : ""}`}
                  onClick={() => setSelectedRegion((prev) => (prev === r.nome ? null : r.nome))}
                >
                  <div className="mb-1 flex items-baseline justify-between">
                    <span className="text-[13px] text-ink-900">{idx + 2} · {r.nome}</span>
                    <span className="text-[12px] text-ink-500">{rankFmt(val)} · {Math.round(pct)}%</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-sm" style={{ background: "#F5F5F4" }}>
                    <div className="h-full rounded-sm transition-all" style={{ width: `${Math.max(pct, 0.5)}%`, background: "#AFA9EC" }} />
                  </div>
                </div>
              );
            })}
          </div>

          {rankOthers.length > 0 && (
            <button
              className="mt-3.5 flex w-full cursor-pointer items-center justify-between rounded-lg border-0 px-3 py-2.5 text-[12px] text-ink-500 transition-colors hover:bg-ink-100 font-inherit"
              style={{ background: "#F5F5F4" }}
              onClick={() => onOpenExplore?.({ asse: "geografica", livello: "regionale", dim })}
            >
              <span>Altre {rankOthers.length} regioni</span>
              <span className="font-medium text-ink-900">
                {rankFmt(rankOthersSum)} · {rankTotal > 0 ? Math.round((rankOthersSum / rankTotal) * 100) : 0}% ›
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Divisore */}
      <hr className="my-10 border-ink-100" />

      {/* Bottom header */}
      <div className="mb-6">
        <div className="mb-1.5 text-[11px] uppercase tracking-[0.08em] text-ink-400">Quanto valore resta vicino</div>
        <h2 className="mb-2 text-[22px] font-medium text-ink-900">Il valore si concentra dove parte la spesa</h2>
        <p className="max-w-[720px] text-[14px] leading-relaxed text-ink-500">
          Su 100€ di valore attivato, una larga maggioranza non lascia {regionName}. Più ci si allontana da {originProvince}, meno valore si attiva.
        </p>
      </div>

      {/* Hero stat */}
      <div className="mb-6 rounded-xl p-8" style={{ background: "#EEEDFE", borderLeft: "4px solid #534AB7" }}>
        <div className="text-[56px] font-medium leading-none" style={{ color: "#26215C", letterSpacing: "-0.02em" }}>
          {stayPct}%
        </div>
        <div className="mt-3 max-w-[720px] text-[17px] leading-relaxed" style={{ color: "#3C3489" }}>
          del {dimLabel.toLowerCase()} attivato <strong className="font-medium">resta in {regionName}</strong>:{" "}
          <strong className="font-medium">{originPct}%</strong> nella provincia di {originProvince},{" "}
          <strong className="font-medium">{restRegPct}%</strong> nelle altre province della regione. Solo il{" "}
          <strong className="font-medium">{extraPct}%</strong> si propaga nel resto d'Italia lungo le filiere nazionali.
        </div>
      </div>

      {/* Viz row: cerchi concentrici + breakdown */}
      <div className="grid grid-cols-1 items-center gap-10 rounded-xl border border-ink-100 bg-white p-8 xl:grid-cols-[minmax(280px,380px)_1fr]">
        <div className="mx-auto flex aspect-square w-full max-w-[380px] items-center justify-center">
          <svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg" className="block h-full w-full">
            <circle cx="160" cy="160" r="155" fill="#EEEDFE" stroke="#AFA9EC" strokeWidth="1" />
            <circle cx="160" cy="180" r="118" fill="#CECBF6" stroke="white" strokeWidth="2" />
            <circle cx="160" cy="195" r="82" fill="#534AB7" stroke="white" strokeWidth="2" />
            <text x="160" y="200" textAnchor="middle" fontSize="32" fontWeight="500" fill="white">{originPct}%</text>
            <text x="160" y="220" textAnchor="middle" fontSize="11" fill="white" opacity="0.85">{originProvince}</text>
            <text x="160" y="108" textAnchor="middle" fontSize="18" fontWeight="500" fill="#26215C">{restRegPct}%</text>
            <text x="160" y="125" textAnchor="middle" fontSize="10" fill="#3C3489">Resto {regionName}</text>
            <text x="160" y="32" textAnchor="middle" fontSize="14" fontWeight="500" fill="#3C3489">{extraPct}%</text>
            <text x="160" y="48" textAnchor="middle" fontSize="10" fill="#534AB7">Resto d'Italia</text>
          </svg>
        </div>

        <div className="flex flex-col gap-4">
          {[
            {
              color: "#534AB7",
              label: "Provincia di origine",
              name: originProvince,
              meaning: "Imprese, lavoratori e fornitori della provincia da cui parte la spesa.",
              pct: originPct,
              value: dimFmt(dimTotal * (macroSplit.origin?.pct ?? 0.46)),
            },
            {
              color: "#AFA9EC",
              label: "Resto della regione",
              name: "Altre province della regione",
              meaning: "Filiere e consumi che si attivano nelle province vicine grazie all'investimento.",
              pct: restRegPct,
              value: dimFmt(dimTotal * (macroSplit.rest_of_region?.pct ?? 0.38)),
            },
            {
              color: "#CECBF6",
              label: "Fuori regione",
              name: "Resto d'Italia",
              meaning: "Effetti sulle filiere nazionali: fornitori, materiali e servizi acquistati fuori dalla regione.",
              pct: extraPct,
              value: dimFmt(dimTotal * (macroSplit.extra_region?.pct ?? 0.16)),
            },
          ].map((item, idx, arr) => (
            <div
              key={item.label}
              className={`grid items-center gap-4 pb-4 ${idx < arr.length - 1 ? "border-b border-ink-100" : ""}`}
              style={{ gridTemplateColumns: "auto 1fr auto" }}
            >
              <span className="h-3.5 w-3.5 flex-shrink-0 rounded-sm" style={{ background: item.color }} />
              <div className="min-w-0">
                <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.08em] text-ink-400">{item.label}</div>
                <div className="mb-0.5 text-[16px] font-medium text-ink-900">{item.name}</div>
                <div className="text-[13px] leading-relaxed text-ink-500">{item.meaning}</div>
              </div>
              <div className="min-w-[100px] flex-shrink-0 text-right">
                <div className="text-[26px] font-medium leading-none text-ink-900">{item.pct}%</div>
                <div className="mt-1 text-[13px] text-ink-500">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GeoTabPills({ options, value, onChange }) {
  return (
    <div className="inline-flex gap-0.5 rounded-[8px] p-[3px]" style={{ background: "#F5F5F4" }}>
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={`cursor-pointer rounded-[6px] border-0 px-3.5 py-2 font-inherit text-[13px] transition-colors ${
            value === opt.id
              ? "bg-white font-medium text-ink-900 shadow-sm"
              : "bg-transparent text-ink-500 hover:text-ink-900"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function TabSettori({ updateSearch, searchParams, onOpenExplore }) {
  const [dim, setDim] = useState(searchParams?.get("dim") ?? "gdp");
  const [vista, setVista] = useState(searchParams?.get("view") ?? "intraextra");
  const isMoney = dim !== "employment";
  const sorted = [...sectItems].sort((a, b) => sectorTotal(b, dim) - sectorTotal(a, dim));
  const top10 = sorted.slice(0, 10);

  useEffect(() => {
    updateSearch?.({ dim, view: vista });
  }, [dim, vista, updateSearch]);

  useEffect(() => {
    setDim(searchParams?.get("dim") ?? "gdp");
    setVista(searchParams?.get("view") ?? "intraextra");
  }, [searchParams]);

  const dimLabel = SECTOR_DIMS.find((d) => d.id === dim)?.label ?? dim;

  return (
    <div className="space-y-8">
      <ViewControls
        leftLabel="Grafico principale"
        leftOptions={[
          { id: "intraextra", label: "Intra / Extra regione" },
          { id: "componenti", label: "Diretto / Indiretto / Indotto" },
        ]}
        leftValue={vista}
        onLeftChange={setVista}
        rightLabel="Dimensione"
        rightOptions={SECTOR_DIMS}
        rightValue={dim}
        onRightChange={setDim}
      />

      {/* Grafico principale: toggle tra intra/extra e componenti */}
      {vista === "intraextra" && (
        <div className="space-y-6">
          <div className="border border-ink-100 bg-bg-page p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">Come si legge</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">
              Ogni riga è un settore. La barra a destra mostra il valore di {dimLabel} che resta nella regione,
              suddivisa tra{" "}
              <span className="font-semibold" style={{ color: "#4318C2" }}>provincia di origine</span> (viola scuro) e{" "}
              <span className="font-semibold" style={{ color: "#9E7BFA" }}>resto della regione</span> (viola chiaro).
              La barra{" "}
              <span className="font-semibold" style={{ color: "#6B7280" }}>grigia</span> a sinistra
              mostra il valore che si attiva fuori regione.
              I valori a lato indicano la quota percentuale e l'ammontare di ciascun segmento.
            </p>
          </div>
          <DivergentBarChart sectors={top10} dim={dim} isMoney={isMoney} />
          <SectorInsightCards sectors={sorted} dim={dim} isMoney={isMoney} />
        </div>
      )}

      {vista === "componenti" && (
        <div className="space-y-6">
          <div className="border border-ink-100 bg-bg-page p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">Come si legge</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">
              Ogni barra mostra la quota di {dimLabel} di un settore suddivisa nelle tre componenti:{" "}
              <span className="font-semibold text-brand-violet">diretto</span> (effetto immediato della spesa),{" "}
              <span className="font-semibold" style={{ color: "#9E7BFA" }}>indiretto</span> (effetto sui fornitori) e{" "}
              <span className="font-semibold" style={{ color: "#D4C5FB" }}>indotto</span> (effetto dei consumi delle famiglie).
              La lunghezza totale della barra è proporzionale al valore del settore.
            </p>
          </div>
          <SectorComponentStackedChart sectors={top10} dim={dim} isMoney={isMoney} />
        </div>
      )}

      {/* Mappa di calore — sempre visibile sotto */}
      <div className="space-y-4">
        <div className="border-t border-ink-100 pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500 mb-1">Mappa di calore settori × regioni</p>
          <p className="text-sm leading-relaxed text-ink-700">
            Righe = settori, colonne = regioni. La cella più scura indica il maggiore valore
            di {dimLabel} attivato in quella coppia settore × regione.
            Passa sopra una cella per il valore esatto. Clicca per aprire in <em>Esplora</em>.
          </p>
        </div>
        <SectorHeatmap dim={dim} isMoney={isMoney} onCellClick={(config) => onOpenExplore?.(config)} />
        <HeatmapLegend />
      </div>

      {/* Sankey — flusso di attivazione */}
      <div className="space-y-4">
        <div className="border-t border-ink-100 pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500 mb-1">Sankey — flusso di attivazione settoriale</p>
          <p className="text-sm leading-relaxed text-ink-700">
            Come la spesa diretta (sinistra) si propaga nei settori attivati per effetto indiretto e indotto (destra).
            Lo spessore dei flussi è proporzionale al valore attivato per la dimensione selezionata.
          </p>
        </div>
        <SectorSankeyChart key={dim} dim={dim} />
      </div>

      <SettoriTakeaway dim={dim} />
    </div>
  );
}

function sectorTotal(s, dim) {
  const v = s.values?.[dim] ?? {};
  return (v.intra ?? 0) + (v.extra ?? 0);
}

function SegmentRow({ s, dim, isMoney, maxTotal, originShare, ready }) {
  const [tip, setTip] = useState(null);
  const fmt = isMoney ? fmtM : fmtETP;
  const intra = s.values?.[dim]?.intra ?? 0;
  const extra = s.values?.[dim]?.extra ?? 0;
  const province = intra * originShare;
  const restReg = intra * (1 - originShare);
  const total = intra + extra || 1;
  const provincePct = Math.round((province / total) * 100);
  const restRegPct = Math.round((restReg / total) * 100);
  const extraPct = 100 - provincePct - restRegPct;

  return (
    <li className="relative grid grid-cols-[160px_1fr] items-center gap-3 px-4 py-3">
      <span className="truncate text-sm font-medium text-ink-900" title={cleanText(s.ateco_name)}>
        {cleanText(s.ateco_name)}
      </span>
      <div className="flex items-center">
        <div className="flex-1 pr-0.5 text-right">
          <div
            className="ml-auto h-5 cursor-default"
            onMouseEnter={() => setTip({ label: "Resto d'Italia", pct: extraPct, value: fmt(extra), color: "#6B7280" })}
            onMouseLeave={() => setTip(null)}
            style={{
              backgroundColor: "#6B7280",
              width: ready ? `${(extra / maxTotal) * 100}%` : "0%",
              transition: "width .45s ease",
              minWidth: extra > 0 ? 2 : 0,
            }}
          />
        </div>
        <div className="h-7 w-px bg-ink-300" />
        <div className="flex-1 pl-0.5">
          <div
            className="flex h-5 overflow-hidden"
            style={{
              width: ready ? `${(intra / maxTotal) * 100}%` : "0%",
              transition: "width .45s ease",
            }}
          >
            <div
              className="h-full shrink-0 cursor-default"
              onMouseEnter={() => setTip({ label: originProvince, pct: provincePct, value: fmt(province), color: "#4318C2" })}
              onMouseLeave={() => setTip(null)}
              style={{ backgroundColor: "#4318C2", width: `${originShare * 100}%` }}
            />
            <div
              className="h-full shrink-0 cursor-default"
              onMouseEnter={() => setTip({ label: "Altre province", pct: restRegPct, value: fmt(restReg), color: "#9E7BFA" })}
              onMouseLeave={() => setTip(null)}
              style={{ backgroundColor: "#9E7BFA", width: `${(1 - originShare) * 100}%` }}
            />
          </div>
        </div>
      </div>
      {tip && (
        <div
          className="pointer-events-none absolute right-4 z-30 flex items-center gap-1.5 whitespace-nowrap border border-ink-100 bg-white px-2.5 py-1.5 text-[11px] shadow-md"
          style={{ top: "-30px" }}
        >
          <div className="h-2 w-2 shrink-0 rounded-sm" style={{ backgroundColor: tip.color }} />
          <span className="font-medium text-ink-900">{tip.label}</span>
          <span className="text-ink-300">·</span>
          <span className="font-mono font-semibold" style={{ color: tip.color }}>{tip.pct}%</span>
          <span className="text-ink-300">·</span>
          <span className="font-mono text-ink-700">{tip.value}</span>
        </div>
      )}
    </li>
  );
}

function DivergentBarChart({ sectors, dim, isMoney }) {
  const [ready, setReady] = useState(false);
  const maxTotal = Math.max(...sectors.map((s) => sectorTotal(s, dim)), 1);

  const seg = threeSeg[dim] ?? {};
  const intraAggregate = (seg.origin ?? 0) + (seg.rest_region ?? 0);
  const originShare = intraAggregate > 0 ? (seg.origin ?? 0) / intraAggregate : 0.5;

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, [dim]);

  return (
    <div className="border border-ink-100 bg-white">
      <div className="grid grid-cols-[160px_1fr] gap-3 border-b border-ink-100 bg-bg-page px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em]">
        <span className="text-ink-500">Settore</span>
        <div className="flex items-center">
          <span className="flex-1 text-right" style={{ color: "#6B7280" }}>← fuori regione</span>
          <span className="mx-2 h-4 w-px bg-ink-300" />
          <span className="flex-1 text-left" style={{ color: "#4318C2" }}>in regione →</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1.5 border-b border-ink-100 px-4 py-2.5">
        {[
          { color: "#4318C2", label: `Provincia di origine (${originProvince})` },
          { color: "#9E7BFA", label: "Altre province della regione" },
          { color: "#6B7280", label: "Resto d'Italia" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: item.color }} />
            <span className="text-[11px] text-ink-600">{item.label}</span>
          </div>
        ))}
      </div>
      <ul className="divide-y divide-ink-100">
        {sectors.map((s) => (
          <SegmentRow
            key={s.ateco_code}
            s={s}
            dim={dim}
            isMoney={isMoney}
            maxTotal={maxTotal}
            originShare={originShare}
            ready={ready}
          />
        ))}
      </ul>
    </div>
  );
}

function getSectorComponentMix(sectorName, dim) {
  const source = comps[dim] ?? {};
  const topSets = {
    direct: source.top_sectors?.direct ?? [],
    indirect: source.top_sectors?.indirect ?? [],
    induced: source.top_sectors?.induced ?? [],
  };
  const base = 0.8;
  const scoreFor = (key) => {
    const idx = topSets[key].findIndex((entry) => entry.name === sectorName);
    return base + (idx >= 0 ? 3 - idx : 0);
  };
  const direct = scoreFor("direct");
  const indirect = scoreFor("indirect");
  const induced = scoreFor("induced");
  const total = direct + indirect + induced || 1;
  return {
    direct: direct / total,
    indirect: indirect / total,
    induced: induced / total,
  };
}

function SectorComponentStackedChart({ sectors, dim, isMoney }) {
  const maxTotal = Math.max(...sectors.map((s) => sectorTotal(s, dim)), 1);
  const fmt = isMoney ? fmtM : fmtETP;

  return (
    <div className="border border-ink-100 bg-white">
      <div className="border-b border-ink-100 px-4 py-3">
        <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-ink-500">Per componente</p>
        <p className="mt-1 text-sm text-ink-700">
          Distribuzione indicativa di diretto, indiretto e indotto per settore, letta con i colori dei componenti.
        </p>
      </div>
      <ul className="divide-y divide-ink-100">
        {sectors.map((s) => {
          const total = sectorTotal(s, dim);
          const mix = getSectorComponentMix(s.ateco_name, dim);
          return (
            <li key={s.ateco_code} className="grid grid-cols-[160px_1fr_120px] items-center gap-3 px-4 py-3">
              <span className="truncate text-sm font-medium text-ink-900">{s.ateco_name}</span>
              <div className="h-5 overflow-hidden border border-ink-100 bg-white">
                <div className="flex h-full" style={{ width: `${Math.max(12, (total / maxTotal) * 100)}%` }}>
                  <div className="bg-impact-direct" style={{ width: `${mix.direct * 100}%` }} />
                  <div className="bg-impact-indirect" style={{ width: `${mix.indirect * 100}%` }} />
                  <div className="bg-impact-induced" style={{ width: `${mix.induced * 100}%` }} />
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-semibold text-ink-900">{fmt(total)}</div>
                <div className="text-[11px] text-ink-500">
                  {Math.round(mix.direct * 100)} / {Math.round(mix.indirect * 100)} / {Math.round(mix.induced * 100)}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SectorInsightCards({ sectors, dim, isMoney }) {
  const fmt = isMoney ? fmtM : fmtETP;
  const totalAll = sectors.reduce((s, sector) => s + sectorTotal(sector, dim), 0) || 1;
  const qualified = sectors.filter((s) => sectorTotal(s, dim) / totalAll >= 0.04);

  const topIntra = [...qualified]
    .sort((a, b) => {
      const ta = sectorTotal(a, dim) || 1;
      const tb = sectorTotal(b, dim) || 1;
      return (b.values?.[dim]?.intra ?? 0) / tb - (a.values?.[dim]?.intra ?? 0) / ta;
    })
    .slice(0, 3);

  const topExtra = [...qualified]
    .sort((a, b) => {
      const ta = sectorTotal(a, dim) || 1;
      const tb = sectorTotal(b, dim) || 1;
      return (b.values?.[dim]?.extra ?? 0) / tb - (a.values?.[dim]?.extra ?? 0) / ta;
    })
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="border border-ink-100 bg-white p-5" style={{ borderLeft: "4px solid #4318C2" }}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">Trattiene di più sul territorio</p>
        <p className="mt-1 text-xs text-ink-500">Settori con la quota intra-regionale più alta</p>
        <ul className="mt-4 space-y-3">
          {topIntra.map((s) => {
            const intra = s.values?.[dim]?.intra ?? 0;
            const total = sectorTotal(s, dim) || 1;
            const intraPct = Math.round((intra / total) * 100);
            return (
              <li key={s.ateco_code} className="flex items-center justify-between gap-3">
                <span className="truncate text-sm text-ink-900">{cleanText(s.ateco_name)}</span>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-xs font-semibold font-mono" style={{ color: "#4318C2" }}>{intraPct}% intra</span>
                  <span className="text-[11px] text-ink-500">{fmt(intra)}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="border border-ink-100 bg-white p-5" style={{ borderLeft: "4px solid #6B7280" }}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">Disperde di più fuori regione</p>
        <p className="mt-1 text-xs text-ink-500">Settori con la quota extra-regionale più alta</p>
        <ul className="mt-4 space-y-3">
          {topExtra.map((s) => {
            const extra = s.values?.[dim]?.extra ?? 0;
            const total = sectorTotal(s, dim) || 1;
            const extraPct = Math.round((extra / total) * 100);
            return (
              <li key={s.ateco_code} className="flex items-center justify-between gap-3">
                <span className="truncate text-sm text-ink-900">{cleanText(s.ateco_name)}</span>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-xs font-semibold font-mono" style={{ color: "#6B7280" }}>{extraPct}% extra</span>
                  <span className="text-[11px] text-ink-500">{fmt(extra)}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function SectorHeatmap({ dim, isMoney, onCellClick }) {
  const rowItems = [...sectItems]
    .sort((a, b) => sectorTotal(b, dim) - sectorTotal(a, dim))
    .slice(0, 10);
  const territories = [...geo.regions]
    .sort((a, b) => getGeoValue(b, dim, "assoluti") - getGeoValue(a, dim, "assoluti"))
    .slice(0, 8);
  const cells = rowItems.flatMap((sector) =>
    territories.map((territory) => {
      const sectorVal = sector.by_territory?.regions?.find((r) => r.code === territory.code)?.values?.[dim] ?? 0;
      return { sector, territory, value: sectorVal };
    })
  );
  const max = Math.max(...cells.map((c) => c.value), 1);
  const fmt = isMoney ? fmtM : fmtETP;

  function cellStyle(value) {
    const ratio = value / max;
    if (ratio === 0) return { backgroundColor: "#F6F6F8" };
    if (ratio <= 0.05) return { backgroundColor: "rgba(91,33,247,0.08)" };
    if (ratio <= 0.20) return { backgroundColor: "rgba(91,33,247,0.24)" };
    if (ratio <= 0.40) return { backgroundColor: "rgba(91,33,247,0.45)" };
    if (ratio <= 0.70) return { backgroundColor: "rgba(91,33,247,0.68)" };
    return { backgroundColor: "#5B21F7" };
  }

  function cellTextColor(value) {
    return value / max > 0.40 ? "text-white" : "text-ink-700";
  }

  const cols = territories.length;

  return (
    <div className="overflow-auto border border-ink-100 bg-white">
      <div style={{ minWidth: 200 + cols * 80 }}>
        <div
          className="grid border-b border-ink-100 bg-bg-page text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-500"
          style={{ gridTemplateColumns: `200px repeat(${cols}, 1fr)` }}
        >
          <div className="border-r border-ink-100 px-4 py-3">Settore</div>
          {territories.map((t) => (
            <div key={t.code} className="border-r border-ink-100 px-2 py-3 text-center last:border-r-0 truncate" title={t.nome}>
              {(t.nome ?? "").slice(0, 8)}
            </div>
          ))}
        </div>
        {rowItems.map((sector) => (
          <div
            key={sector.ateco_code}
            className="grid border-b border-ink-100 last:border-b-0"
            style={{ gridTemplateColumns: `200px repeat(${cols}, 1fr)` }}
          >
            <div className="border-r border-ink-100 px-4 py-4 text-sm font-medium text-ink-900 truncate" title={sector.ateco_name}>
              {cleanText(sector.ateco_name)}
            </div>
            {territories.map((territory) => {
              const value = sector.by_territory?.regions?.find((r) => r.code === territory.code)?.values?.[dim] ?? 0;
              return (
                <button
                  key={`${sector.ateco_code}-${territory.code}`}
                  onClick={() =>
                    onCellClick?.({
                      tab: "esplora",
                      dim,
                      asse: "geografica",
                      livello: "regionale",
                      filter: "tutti",
                      focus: territory.code,
                    })
                  }
                  className={`group relative border-r border-ink-100 px-1 py-4 last:border-r-0 transition-opacity hover:opacity-80 ${cellTextColor(value)}`}
                  style={cellStyle(value)}
                  title={`${cleanText(sector.ateco_name)} × ${cleanText(territory.nome)}: ${fmt(value)}`}
                >
                  {value > 0 && (
                    <span className="block text-center text-[10px] font-mono font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      {isMoney ? fmtIT(value / 1_000_000, 1) + "M" : fmtIT(value, 0)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function HeatmapLegend() {
  const steps = [
    { bg: "#F6F6F8", label: "0" },
    { bg: "rgba(91,33,247,0.08)" },
    { bg: "rgba(91,33,247,0.24)" },
    { bg: "rgba(91,33,247,0.45)" },
    { bg: "rgba(91,33,247,0.68)" },
    { bg: "#5B21F7", label: "max", textWhite: true },
  ];
  return (
    <div className="flex flex-wrap items-center gap-4 border border-ink-100 bg-white p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-500">Scala intensità</p>
      <div className="flex items-center gap-0.5">
        {steps.map((s, i) => (
          <div
            key={i}
            className="h-5 w-8 border border-ink-100/50"
            style={{ backgroundColor: s.bg }}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 text-[11px] text-ink-500">
        <span>basso</span>
        <span>→</span>
        <span>alto</span>
      </div>
      <span className="text-xs italic text-ink-500">Passa sopra una cella per il valore · clicca per aprire in Esplora</span>
    </div>
  );
}

const SANKEY_LEFT_COLORS = ["#4318C2", "#5B21F7", "#7C3AED", "#8B5CF6", "#9E7BFA", "#A78BFA", "#C4B5FD"];
const SANKEY_RIGHT_COLORS = ["#0F766E", "#0D9488", "#14B8A6", "#0891B2", "#0E7490", "#0284C7", "#0369A1", "#1D4ED8"];

function SectorSankeyChart({ dim }) {
  const spendSectors = inp.spend_breakdown ?? [];
  const totalSpend = inp.total_spend || 1;

  const sankeyData = useMemo(() => {
    const impactSectors = [...sectItems]
      .sort((a, b) => sectorTotal(b, dim) - sectorTotal(a, dim))
      .slice(0, 8);

    const nLeft = spendSectors.length;
    const trunc = (s, n = 22) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

    const nodeLabels = [
      ...spendSectors.map((s) => trunc(cleanText(s.ateco_name))),
      ...impactSectors.map((s) => trunc(cleanText(s.ateco_name))),
    ];
    const nodeColors = [
      ...spendSectors.map((_, i) => SANKEY_LEFT_COLORS[i % SANKEY_LEFT_COLORS.length]),
      ...impactSectors.map((_, i) => SANKEY_RIGHT_COLORS[i % SANKEY_RIGHT_COLORS.length]),
    ];

    const sources = [], targets = [], values = [], linkColors = [];

    spendSectors.forEach((spend, i) => {
      const hex = SANKEY_LEFT_COLORS[i % SANKEY_LEFT_COLORS.length];
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      const spendShare = spend.amount / totalSpend;
      impactSectors.forEach((impact, j) => {
        const v = sectorTotal(impact, dim) * spendShare;
        if (v > 0) {
          sources.push(i);
          targets.push(nLeft + j);
          values.push(v);
          linkColors.push(`rgba(${r},${g},${b},0.22)`);
        }
      });
    });

    return [
      {
        type: "sankey",
        orientation: "h",
        arrangement: "snap",
        node: {
          pad: 12,
          thickness: 20,
          line: { color: "#E4E4E7", width: 0.5 },
          label: nodeLabels,
          color: nodeColors,
          hovertemplate: "%{label}<extra></extra>",
        },
        link: {
          source: sources,
          target: targets,
          value: values,
          color: linkColors,
          hovertemplate: "%{source.label} → %{target.label}<extra></extra>",
        },
      },
    ];
  }, [dim, spendSectors, totalSpend]);

  const layout = useMemo(
    () => ({
      paper_bgcolor: "white",
      plot_bgcolor: "white",
      font: { family: "Inter, ui-sans-serif, sans-serif", size: 11, color: "#27272A" },
      margin: { t: 32, r: 170, b: 16, l: 170 },
      annotations: [
        {
          x: 0.01, y: 1.06, xref: "paper", yref: "paper",
          text: "Impiego diretto",
          showarrow: false, xanchor: "left",
          font: { size: 10, color: "#6B7280", family: "Inter, ui-sans-serif, sans-serif" },
        },
        {
          x: 0.99, y: 1.06, xref: "paper", yref: "paper",
          text: "Settori attivati (indiretto + indotto)",
          showarrow: false, xanchor: "right",
          font: { size: 10, color: "#6B7280", family: "Inter, ui-sans-serif, sans-serif" },
        },
      ],
    }),
    [],
  );

  return (
    <div className="border border-ink-100 bg-white shadow-sm">
      <PlotlyChart data={sankeyData} layout={layout} style={{ minHeight: 480 }} />
    </div>
  );
}

function SettoriTakeaway({ dim }) {
  const source = comps[dim] ?? {};
  const direct = source.top_sectors?.direct?.[0]?.name ?? "il settore principale";
  const indirect = source.top_sectors?.indirect?.[0]?.name ?? "la filiera dei fornitori";
  const induced = source.top_sectors?.induced?.[0]?.name ?? "i consumi delle famiglie";
  const text = cleanText(`La componente diretta è trainata da ${direct}; l'indiretta si appoggia a ${indirect}; l'indotta emerge soprattutto in ${induced}.`);
  return <TakeawayBanner text={text} />;
}

function TabEsplora({ showToast, project, searchParams, updateSearch, onOpenExplore }) {
  const initialDim = searchParams.get("dim") ?? "gdp";
  const initialAxis = searchParams.get("asse") ?? "geografica";
  const initialLevel = searchParams.get("livello") ?? "regionale";
  const initialFilter = searchParams.get("filter") ?? "top10";
  const initialFocus = searchParams.get("focus") ?? "";
  const initialRegionFilt = searchParams.get("regfilt") ?? "";

  const [dim, setDim] = useState(initialDim);
  const [axis, setAxis] = useState(initialAxis);
  const [level, setLevel] = useState(initialLevel);
  const [filter, setFilter] = useState(initialFilter);
  const [focus, setFocus] = useState(initialFocus);
  const [regionFilt, setRegionFilt] = useState(initialRegionFilt);
  const [sortKey, setSortKey] = useState("value");
  const [sortDir, setSortDir] = useState("desc");

  useEffect(() => {
    updateSearch({ tab: "esplora", dim, asse: axis, livello: level, filter, focus, regfilt: regionFilt });
  }, [dim, axis, level, filter, focus, regionFilt, updateSearch]);

  useEffect(() => {
    setDim(searchParams.get("dim") ?? "gdp");
    setAxis(searchParams.get("asse") ?? "geografica");
    setLevel(searchParams.get("livello") ?? "regionale");
    setFilter(searchParams.get("filter") ?? "top10");
    setFocus(searchParams.get("focus") ?? "");
    setRegionFilt(searchParams.get("regfilt") ?? "");
  }, [searchParams]);

  useEffect(() => {
    if (dim === "fiscal" && axis !== "totale") {
      setAxis("totale");
      setLevel("totale");
      setFilter("tutti");
      setFocus("");
    }
    if ((dim === "income" || dim === "fiscal") && axis === "componente") {
      setAxis("totale");
      setLevel("totale");
      setFilter("tutti");
      setFocus("");
    }
  }, [dim, axis]);

  const rows = useMemo(
    () => buildExploreRows({ dim, axis, level, filter, focus, regionFilt }),
    [dim, axis, level, filter, focus, regionFilt]
  );
  const sortedRows = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      if (sortKey === "label") {
        return sortDir === "desc"
          ? String(b.label ?? "").localeCompare(String(a.label ?? ""))
          : String(a.label ?? "").localeCompare(String(b.label ?? ""));
      }
      const av = a[sortKey] ?? 0;
      const bv = b[sortKey] ?? 0;
      return sortDir === "desc" ? bv - av : av - bv;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  const meta = EXPLORE_DIMS.find((d) => d.id === dim) ?? EXPLORE_DIMS[1];
  const summary = buildExploreSummary(dim, axis, level, sortedRows.length, focus);

  function handleExport(kind) {
    showToast?.(`${kind.toUpperCase()} export disponibile per ${project?.nome ?? "questo progetto"} nella versione completa.`, "info");
  }

  function handleHeaderSort(key) {
    if (sortKey === key) setSortDir((prev) => (prev === "desc" ? "asc" : "desc"));
    else { setSortKey(key); setSortDir("desc"); }
  }

  const canUseGeo = dim !== "fiscal";
  const canUseSector = dim !== "fiscal";
  const canUseComponent = dim !== "fiscal" && dim !== "income";

  // Province filtered by region when regionFilt is set
  const filteredProvinces = regionFilt
    ? geo.provinces.filter((p) => p.regione === regionFilt || p.region_name === regionFilt || p.region_code === regionFilt)
    : geo.provinces;

  // Territory focused for "Esplora il territorio" panel
  const focusedTerritory = focus
    ? (level === "provinciale" ? geo.provinces : geo.regions).find((item) => item.code === focus)
    : null;

  return (
    <div className="space-y-6">
      <div className="border border-ink-100 bg-bg-page p-4">
        <p className="text-sm leading-relaxed text-ink-700">
          Seleziona cosa misurare e come visualizzarlo. Il grafico a sinistra mostra sempre
          le barre con la scomposizione <strong>diretto / indiretto / indotto</strong>.
          La tabella a destra mostra i valori ordinabili per colonna. Usa i pulsanti in alto per esportare.
        </p>
      </div>

      {/* Selector cascade */}
      <div className="grid grid-cols-1 gap-4 bg-bg-page p-4 md:grid-cols-2 xl:grid-cols-4">
        <ExploreSelect
          label="1. Cosa misurare"
          value={dim}
          onChange={(next) => {
            setDim(next);
            if (next === "fiscal") { setAxis("totale"); setLevel("totale"); setFilter("tutti"); setFocus(""); }
          }}
          options={EXPLORE_DIMS}
        />
        <ExploreSelect
          label="2. Visualizza per"
          value={axis}
          onChange={(next) => {
            setAxis(next);
            if (next === "totale" || next === "componente") setLevel("totale");
            if (next === "settoriale") { setLevel("regionale"); setFilter("top10"); }
            if (next === "geografica") setLevel("regionale");
            setFocus(""); setRegionFilt("");
          }}
          options={[
            { id: "geografica", label: "Territorio", disabled: !canUseGeo },
            { id: "settoriale", label: "Settori", disabled: !canUseSector },
            { id: "componente", label: "Componente (Dir/Ind/Indot)", disabled: !canUseComponent },
            { id: "totale", label: "Complessivo", disabled: false },
          ]}
        />
        {axis === "geografica" && (
          <ExploreSelect
            label="3. Scala territoriale"
            value={level}
            onChange={(next) => { setLevel(next); setFocus(""); setRegionFilt(""); }}
            options={[
              { id: "regionale", label: "Regioni" },
              { id: "provinciale", label: "Province" },
            ]}
          />
        )}
        {axis === "settoriale" && (
          <ExploreSelect
            label="3. Quanti settori"
            value={filter}
            onChange={setFilter}
            options={[
              { id: "top10", label: "Top 10" },
              { id: "tutti", label: "Tutti" },
            ]}
          />
        )}
        {axis === "geografica" && level === "provinciale" && (
          <ExploreSelect
            label="4. Filtra per regione"
            value={regionFilt}
            onChange={(next) => { setRegionFilt(next); setFocus(""); }}
            options={[
              { id: "", label: "Tutte le regioni" },
              ...geo.regions.map((r) => ({ id: r.nome, label: r.nome })),
            ]}
          />
        )}
        {axis === "geografica" && (
          <ExploreSelect
            label={level === "provinciale" ? "5. Provincia specifica" : "4. Regione specifica"}
            value={focus}
            onChange={setFocus}
            options={[
              { id: "", label: "Tutti i territori" },
              ...(level === "provinciale" ? filteredProvinces : geo.regions).map((item) => ({
                id: item.code,
                label: item.nome,
              })),
            ]}
          />
        )}
        {axis === "settoriale" && (
          <ExploreSelect
            label="4. Filtra per territorio"
            value={focus}
            onChange={setFocus}
            options={[
              { id: "", label: "Tutti i territori" },
              ...geo.regions.map((r) => ({ id: r.code, label: r.nome })),
              ...geo.provinces.map((p) => ({ id: p.code, label: `${p.nome} (prov.)` })),
            ]}
          />
        )}
      </div>

      {/* State + export */}
      <div className="flex flex-wrap items-center justify-between gap-4 border border-ink-100 bg-white p-4">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-500">Stato attuale</p>
          <p className="mt-1 text-sm text-ink-700">{summary}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleExport("csv")} className="border border-ink-300 px-4 py-2 text-sm font-semibold text-ink-900 hover:border-brand-violet hover:text-brand-violet">
            Esporta CSV
          </button>
          <button onClick={() => handleExport("xlsx")} className="border border-ink-300 px-4 py-2 text-sm font-semibold text-ink-900 hover:border-brand-violet hover:text-brand-violet">
            Esporta Excel
          </button>
        </div>
      </div>

      {/* Esplora il territorio */}
      {focusedTerritory && axis === "geografica" && (
        <TerritoryExplorePanel territory={focusedTerritory} dim={dim} level={level} />
      )}

      {/* Chart + table */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_1fr]">
        <ExploreChart config={{ dim, axis, level, filter }} rows={sortedRows} meta={meta} onOpenExplore={onOpenExplore} />
        <ExploreTable axis={axis} rows={sortedRows} meta={meta} sortKey={sortKey} sortDir={sortDir} onSort={handleHeaderSort} />
      </div>
    </div>
  );
}

function TerritoryExplorePanel({ territory, dim, level }) {
  const name = cleanText(territory.nome ?? territory.name ?? "");
  const isRegion = level === "regionale";
  const fmt = dim === "employment" ? fmtETP : fmtM;
  const dimLabel = EXPLORE_DIMS.find((d) => d.id === dim)?.label ?? dim;

  const cards = [
    { key: "production", label: "Produzione", value: territory.production ?? 0, format: fmtM, pc: territory.production_pc ?? 0, pcUnit: "€/ab" },
    { key: "gdp", label: "PIL", value: territory.gdp ?? 0, format: fmtM, pc: territory.gdp_pc ?? 0, pcUnit: "€/ab" },
    { key: "employment", label: "Occupazione", value: territory.employment ?? 0, format: fmtETP, pc: territory.employment_pc ?? 0, pcUnit: "ETP/10k" },
    { key: "income", label: "Redditi", value: territory.income ?? 0, format: fmtM, pc: territory.income_pc ?? 0, pcUnit: "€/ab" },
  ];

  const regionProvinces = isRegion
    ? (geo.provinces ?? [])
        .filter((p) => p.regione === name || p.region_name === name || p.region_code === territory.code)
        .sort((a, b) => (b[dim] ?? 0) - (a[dim] ?? 0))
        .slice(0, 5)
    : [];

  const topSectors = [...sectItems]
    .map((s) => {
      const val = s.by_territory?.regions?.find((r) => r.code === territory.code)?.values?.[dim] ?? 0;
      return { name: cleanText(s.ateco_name), value: val };
    })
    .sort((a, b) => b.value - a.value)
    .filter((s) => s.value > 0)
    .slice(0, 5);

  return (
    <div className="space-y-4 border border-ink-100 bg-white p-5">
      <div className="flex items-start justify-between border-b border-ink-100 pb-4">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-500">Esplora il territorio</p>
          <p className="mt-1 text-xl font-bold text-ink-900">{name}</p>
          {!isRegion && (territory.regione || territory.region_name) && (
            <p className="text-xs text-ink-500">{territory.regione ?? territory.region_name}</p>
          )}
        </div>
        <span className="text-[10px] font-mono uppercase border border-ink-100 px-2 py-1 text-ink-500">
          {isRegion ? "Regione" : "Provincia"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {cards.map((card) => (
          <div key={card.key} className="border border-ink-100 bg-bg-page p-3">
            <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-ink-500">{card.label}</p>
            <p className="mt-2 text-xl font-bold text-ink-900">{card.format(card.value)}</p>
            <p className="mt-1 text-[11px] text-ink-500">{fmtIT(card.pc, 2)} {card.pcUnit}</p>
          </div>
        ))}
      </div>

      {(topSectors.length > 0 || regionProvinces.length > 0) && (
        <div className="grid grid-cols-1 gap-6 border-t border-ink-100 pt-4 md:grid-cols-2">
          {topSectors.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500 mb-3">
                Top settori — {dimLabel}
              </p>
              <ul className="space-y-2">
                {topSectors.map((s, idx) => (
                  <li key={idx} className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="text-[10px] font-mono text-ink-400 shrink-0">{idx + 1}.</span>
                      <span className="truncate text-sm text-ink-900">{s.name}</span>
                    </span>
                    <span className="shrink-0 font-mono text-xs font-semibold text-ink-900">{fmt(s.value)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {isRegion && regionProvinces.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500 mb-3">
                Top province — {dimLabel}
              </p>
              <ul className="space-y-2">
                {regionProvinces.map((p, idx) => (
                  <li key={idx} className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="text-[10px] font-mono text-ink-400 shrink-0">{idx + 1}.</span>
                      <span className="truncate text-sm text-ink-900">{cleanText(p.nome)}</span>
                    </span>
                    <span className="shrink-0 font-mono text-xs font-semibold text-ink-900">{fmt(p[dim] ?? 0)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function buildExploreRows({ dim, axis, level, filter, focus, regionFilt }) {
  if (axis === "totale") {
    const value =
      dim === "fiscal"
        ? byPerimeter.national?.fiscal ?? 0
        : byPerimeter.region?.[dim] ?? 0;
    return [{ code: "total", label: "Totale", value, note: "totale" }];
  }

  if (axis === "componente") {
    const source = comps[dim] ?? null;
    if (!source) return [];
    return [
      { code: "direct", label: "Diretto", value: source.direct ?? 0, note: "componente" },
      { code: "indirect", label: "Indiretto", value: source.indirect ?? 0, note: "componente" },
      { code: "induced", label: "Indotto", value: source.induced ?? 0, note: "componente" },
    ];
  }

  if (axis === "settoriale") {
    const territory = resolveTerritoryFocus(focus);
    const territoryCode = territory?.regionCode ?? null;
    const source = comps[dim];
    const directMap = new Map((source?.top_sectors?.direct ?? []).map((e) => [e.name, e.value]));
    const indirectMap = new Map((source?.top_sectors?.indirect ?? []).map((e) => [e.name, e.value]));
    const inducedMap = new Map((source?.top_sectors?.induced ?? []).map((e) => [e.name, e.value]));
    const rows = [...sectItems].map((s) => {
      const territorialValue = territoryCode
        ? (s.by_territory?.regions?.find((r) => r.code === territoryCode)?.values?.[dim] ?? 0)
        : null;
      const intra = s.values?.[dim]?.intra ?? 0;
      const extra = s.values?.[dim]?.extra ?? 0;
      const total = territorialValue ?? (intra + extra);
      return {
        code: s.ateco_code,
        label: s.ateco_name,
        value: total,
        intra,
        extra,
        pct: total > 0 ? (territoryCode ? 100 : (intra / total) * 100) : 0,
        directValue: directMap.get(s.ateco_name) ?? null,
        indirectValue: indirectMap.get(s.ateco_name) ?? null,
        inducedValue: inducedMap.get(s.ateco_name) ?? null,
      };
    });
    return filter === "top10" ? rows.sort((a, b) => b.value - a.value).slice(0, 10) : rows.sort((a, b) => b.value - a.value);
  }

  const source = level === "provinciale" ? geo.provinces : geo.regions;
  let rows = source.map((item) => ({
    code: item.code,
    label: item.nome,
    value: getGeoValue(item, dim, "assoluti"),
    region: item.regione ?? item.region_name ?? "",
    regionCode: item.region_code ?? "",
    perCapita: getGeoValue(item, dim, "pc"),
  }));
  // filter provinces by region when set
  if (level === "provinciale" && regionFilt) {
    rows = rows.filter((r) => r.region === regionFilt || r.regionCode === regionFilt);
  }
  if (focus) rows = rows.filter((r) => r.code === focus);
  if (!focus && filter === "top10") rows = rows.slice(0, 10);
  return rows.sort((a, b) => b.value - a.value);
}

function exploreLevelOptions(axis) {
  if (axis === "geografica" || axis === "settoriale") {
    return [
      { id: "regionale", label: "Regionale" },
      { id: "provinciale", label: "Provinciale" },
    ];
  }
  return [{ id: "totale", label: "Totale" }];
}

function exploreFilterOptions(axis) {
  if (axis === "settoriale") {
    return [
      { id: "top10", label: "Solo top 10" },
      { id: "tutti", label: "Tutti" },
    ];
  }
  return [{ id: "tutti", label: "Tutti" }];
}

function ExploreSelect({ label, value, onChange, options, disabled = false }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-ink-500">{label}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full border border-ink-300 bg-white px-3 py-2 text-sm font-medium text-ink-900 outline-none transition-colors focus:border-brand-violet"
      >
        {options.map((opt) => (
          <option key={opt.id} value={opt.id} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ExploreChart({ config, rows, meta }) {
  const fmt = meta.isMoney ? fmtM : fmtETP;
  const maxValue = Math.max(...rows.map((r) => r.value), 1);

  function getComponentRatios() {
    const data = comps[config.dim];
    if (!data) return { direct: 0.45, indirect: 0.30, induced: 0.25 };
    const total = (data.direct ?? 0) + (data.indirect ?? 0) + (data.induced ?? 0) || 1;
    return {
      direct: (data.direct ?? 0) / total,
      indirect: (data.indirect ?? 0) / total,
      induced: (data.induced ?? 0) / total,
    };
  }

  if (config.axis === "totale") {
    const first = rows[0];
    return (
      <div className="border border-ink-100 bg-white p-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-500">Totale complessivo</p>
        <p className="mt-4 text-[38px] font-bold text-ink-900">{fmt(first?.value ?? 0)}</p>
        <p className="mt-2 text-sm text-ink-700">Valore aggregato per il perimetro regionale.</p>
      </div>
    );
  }

  const COMPONENT_COLORS = {
    direct: "bg-impact-direct",
    indirect: "bg-impact-indirect",
    induced: "bg-impact-induced",
    Diretto: "bg-impact-direct",
    Indiretto: "bg-impact-indirect",
    Indotto: "bg-impact-induced",
  };

  if (config.axis === "componente") {
    return (
      <div className="border border-ink-100 bg-white p-5">
        <p className="mb-4 text-[10px] font-mono uppercase tracking-[0.18em] text-ink-500">Scomposizione per componente</p>
        <div className="space-y-5">
          {rows.map((row) => (
            <div key={row.code}>
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-sm font-semibold text-ink-900">{cleanText(row.label)}</span>
                <span className="font-mono text-xs font-semibold text-ink-900">{fmt(row.value)}</span>
              </div>
              <div className="h-5 overflow-hidden bg-ink-100">
                <div
                  className={`h-full ${COMPONENT_COLORS[row.code] ?? COMPONENT_COLORS[row.label] ?? "bg-brand-violet"}`}
                  style={{ width: `${Math.max(4, Math.round((row.value / maxValue) * 100))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const ratios = getComponentRatios();
  const displayRows = rows.slice(0, 15);

  return (
    <div className="border border-ink-100 bg-white p-5">
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-500">
          {config.axis === "settoriale" ? "Settori" : "Territori"}
        </p>
        <div className="flex items-center gap-3 text-[11px] text-ink-500">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-4 bg-impact-direct" />
            Diretto
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-4 bg-impact-indirect" />
            Indiretto
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-4 bg-impact-induced" />
            Indotto
          </span>
        </div>
      </div>
      <div className="space-y-3">
        {displayRows.map((row) => {
          const sectorRatios = config.axis === "settoriale"
            ? getSectorComponentMix(row.label, config.dim)
            : ratios;
          return (
            <div key={row.code}>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span
                  className="truncate text-xs font-medium text-ink-900"
                  style={{ maxWidth: "60%" }}
                  title={cleanText(row.label)}
                >
                  {cleanText(row.label)}
                </span>
                <span className="shrink-0 font-mono text-xs font-semibold text-ink-900">{fmt(row.value)}</span>
              </div>
              <div className="h-5 overflow-hidden bg-ink-100">
                <div
                  className="flex h-full"
                  style={{ width: `${Math.max(4, Math.round((row.value / maxValue) * 100))}%` }}
                >
                  <div className="bg-impact-direct" style={{ width: `${sectorRatios.direct * 100}%` }} />
                  <div className="bg-impact-indirect" style={{ width: `${sectorRatios.indirect * 100}%` }} />
                  <div className="bg-impact-induced" style={{ width: `${sectorRatios.induced * 100}%` }} />
                </div>
              </div>
            </div>
          );
        })}
        {rows.length > 15 && (
          <p className="pt-2 text-xs italic text-ink-500">
            ...e altri {rows.length - 15} elementi. Esporta CSV/Excel per vedere tutti.
          </p>
        )}
      </div>
    </div>
  );
}

function perimeterToGlossary(tab) {
  return GLOSSARY[tab] ?? [];
}

function buildExploreSummary(dim, axis, level, rowsCount, focus = "") {
  const dimLabel = EXPLORE_DIMS.find((d) => d.id === dim)?.label ?? dim;
  if (axis === "totale") return `${dimLabel} totale · ${rowsCount} valore`;
  if (axis === "componente") return `${dimLabel} · scomposto per componente · ${rowsCount} righe`;
  if (axis === "settoriale") {
    const territory = resolveTerritoryFocus(focus);
    if (territory) {
      const suffix = territory.kind === "provincia" ? ` (aggregato su ${territory.regionLabel ?? "la regione"})` : "";
      return `${dimLabel} · settori filtrati su ${territory.label}${suffix} · ${rowsCount} righe`;
    }
    return `${dimLabel} · per settore · ${rowsCount} righe`;
  }
  if (focus) {
    const territory = resolveTerritoryFocus(focus);
    if (territory) return `${dimLabel} · territorio singolo selezionato: ${territory.label} · ${rowsCount} riga`;
  }
  return `${dimLabel} · ${level} · ${rowsCount} righe`;
}

function ExploreTable({ axis, rows, meta, sortKey, sortDir, onSort }) {
  if (!rows.length) {
    return <div className="border border-ink-100 bg-white p-6 text-sm text-ink-700">Nessun risultato per questa combinazione.</div>;
  }

  const fmt = meta.isMoney ? fmtM : fmtETP;
  const spendMode = axis === "settoriale" && meta.id === "spend";
  const headers = spendMode
    ? [
        { key: "label", label: "Voce" },
        { key: "share", label: "Quota" },
        { key: "value", label: "Valore" },
      ]
    : axis === "settoriale"
      ? [
          { key: "label", label: "Voce" },
          { key: "directValue", label: "Diretto" },
          { key: "indirectValue", label: "Indiretto" },
          { key: "inducedValue", label: "Indotto" },
          { key: "value", label: "Totale" },
        ]
      : [
          { key: "label", label: "Voce" },
          { key: "value", label: "Valore" },
          { key: "pct", label: "%" },
        ];

  const gridClass = spendMode
    ? "grid-cols-[1fr_80px_120px]"
    : axis === "settoriale"
      ? "grid-cols-[1fr_100px_100px_100px_100px]"
      : "grid-cols-[1fr_120px_80px]";

  return (
    <div className="overflow-hidden border border-ink-100 bg-white">
      <div className={`sticky top-0 grid ${gridClass} gap-3 bg-bg-page px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-700`}>
        {headers.map((h) => (
          <button key={h.key} onClick={() => onSort(h.key)} className="text-left">
            {h.label} {sortKey === h.key ? (sortDir === "desc" ? "↓" : "↑") : ""}
          </button>
        ))}
      </div>
      <div className="max-h-[520px] divide-y divide-ink-100 overflow-y-auto">
        {rows.map((row) => (
          <div key={row.code} className={`grid ${gridClass} gap-3 px-4 py-3 text-sm`}>
            <span className="truncate font-medium text-ink-900">{row.label}</span>
            {spendMode ? (
              <span className="text-right font-mono text-xs font-semibold text-ink-900">{Math.round((row.share ?? 0) * 100)}%</span>
            ) : axis === "settoriale" ? (
              <>
                <span className="text-right font-mono text-xs text-brand-violet">
                  {row.directValue != null ? fmt(row.directValue) : <span className="text-ink-400">—</span>}
                </span>
                <span className="text-right font-mono text-xs" style={{ color: "#9E7BFA" }}>
                  {row.indirectValue != null ? fmt(row.indirectValue) : <span className="text-ink-400">—</span>}
                </span>
                <span className="text-right font-mono text-xs" style={{ color: "#C4B5FD" }}>
                  {row.inducedValue != null ? fmt(row.inducedValue) : <span className="text-ink-400">—</span>}
                </span>
              </>
            ) : null}
            <span className="text-right font-mono text-xs font-semibold text-ink-900">{fmt(row.value)}</span>
            {axis !== "settoriale" && !spendMode && (
              <span className="text-right text-xs text-ink-500">{row.pct != null ? `${Math.round(row.pct)}%` : "—"}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const GLOSSARY = {
  sintesi: [
    { term: "PIL (valore aggiunto)", def: "Ricchezza nuova generata dall'attività economica." },
    { term: "Produzione", def: "Volume d'affari totale della filiera attivata." },
    { term: "ETP", def: "Equivalente a tempo pieno: misura standard del lavoro." },
    { term: "Redditi", def: "Quota di valore che torna a famiglie e imprese." },
    { term: "Gettito", def: "Imposte e contributi attivati dal progetto. Solo nazionale." },
    { term: "Moltiplicatore", def: "Euro di effetto generati per ogni euro speso." },
  ],
  componenti: [
    { term: "Impatto diretto", def: "Effetto immediato della spesa sui settori che la ricevono." },
    { term: "Impatto indiretto", def: "Effetto a cascata sui fornitori." },
    { term: "Impatto indotto", def: "Effetto dei consumi delle famiglie." },
    { term: "Filiera", def: "Catena di fornitori e sub-fornitori." },
    { term: "Spesa autonoma", def: "La spesa iniziale del progetto." },
  ],
  geografia: [
    { term: "Provincia di origine", def: "Provincia in cui avviene fisicamente la spesa." },
    { term: "Spillover regionale", def: "Effetto che si diffonde sulle altre province della regione." },
    { term: "Dispersione extra-regionale", def: "Quota di valore attivata fuori regione." },
    { term: "Pro capite", def: "Valore diviso per la popolazione." },
  ],
  settori: [
    { term: "Settore ATECO", def: "Classificazione standard delle attività economiche." },
    { term: "Settore non delocalizzabile", def: "Settore che tende a trattenere valore nel territorio." },
    { term: "Heatmap", def: "Griglia a colori per leggere due dimensioni insieme." },
  ],
  esplora: [
    { term: "Dimensione", def: "Cosa stai misurando." },
    { term: "Asse di scomposizione", def: "Come stai dividendo il dato." },
    { term: "Livello di profondità", def: "Quanto in dettaglio stai scendendo." },
    { term: "Esporta CSV", def: "Scarica i dati come file di testo." },
    { term: "Esporta Excel", def: "Scarica i dati in formato .xlsx." },
  ],
};

function GlossaryPopover({ tab, onClose }) {
  const ref = useRef(null);
  const entries = perimeterToGlossary(tab);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [onClose]);

  return (
    <div ref={ref} className="fixed right-0 top-0 bottom-0 z-50 flex w-[320px] flex-col border-l border-ink-100 bg-white">
      <div className="flex items-center justify-between border-b border-ink-100 bg-ink-900 px-5 py-4 text-white">
        <p className="text-sm font-bold">Come si legge</p>
        <button onClick={onClose} className="text-white/70 hover:text-white">
          ×
        </button>
      </div>
      <div className="border-b border-ink-100 bg-bg-page px-5 py-3">
        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-500">{cleanText(tab)}</p>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry.term} className="border-b border-ink-100 pb-4 last:border-b-0 last:pb-0">
              <p className="text-sm font-bold text-ink-900">{cleanText(entry.term)}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-700">{cleanText(entry.def)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetaField({ label, value }) {
  return (
    <div className="px-6 py-4 md:px-8">
      <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-ink-500">{label}</p>
      <p className="mt-2 text-sm font-medium text-ink-900">{cleanText(value)}</p>
    </div>
  );
}

function ErrorBanner() {
  return (
    <div className="mb-4 border border-[#C45A2E] bg-[#FDECEC] px-4 py-3 text-sm text-ink-900">
      Si è verificato un errore nell'elaborazione. Riprova o contatta il supporto.
    </div>
  );
}

function LoadingBanner() {
  return (
    <div className="mb-4 border border-ink-100 bg-white px-4 py-3 text-sm text-ink-700">
      L'analisi è in corso.
    </div>
  );
}

