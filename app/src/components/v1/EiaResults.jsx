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

function fmtOccupati(n) {
  return `${fmtIT(n, n < 10 ? 1 : 0)} occupati`;
}

function fmtMoneyPc(n) {
  return `${fmtIT(n, 2)} €/ab`;
}

function fmtOccupatiPc(n) {
  return `${fmtIT(n, 2)} occupati/10k ab.`;
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
    .replaceAll("â†’", "?")
    .replaceAll("â†", "?")
    .replaceAll("â†‘", "?")
    .replaceAll("â†“", "?");
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
  { id: "esplora", label: "Approfondimento" },
];

const TAB_PREVIEWS = {
  sintesi: cleanText(previews.sintesi ?? "3,56 M€ PIL"),
  componenti: cleanText(previews.componenti ?? "44% diretto"),
  geografia: cleanText(previews.geografia ?? "84% in regione"),
  settori: cleanText(previews.settori ?? "Costruzioni leader"),
  esplora: cleanText(previews.esplora ?? "Approfondimento dati"),
};

;
;
;
;

const GEO_DIMS = [
  { id: "production", label: "Produzione" },
  { id: "gdp", label: "PIL" },
  { id: "employment", label: "Occupazione" },
  { id: "income", label: "Redditi" },
];

;

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
    return dim === "employment" ? fmtOccupatiPc : fmtMoneyPc;
  }
  return dim === "employment" ? fmtOccupati : fmtM;
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
        ["Occupazione", byPerimeter.region?.employment ?? 0, byPerimeter.national?.employment ?? 0, "occupati"],
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
              <TabShell title="Approfondimento dati" tab="esplora" onHelp={() => setGlossaryOpen(true)}>
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

  const summaryText = `L'investimento di ${fmtM(spend)} ha attivato ${fmtM(natGdp)} di PIL, sostenuto ${fmtIT(natEmp, 0)} occupati e generato ${fmtM(natFiscal)} di gettito fiscale, cioè risorse che rientrano nelle casse dello Stato.`;

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
          <SintesiKPI icon="occupazione" label="Occupazione"            value={fmtIT(natEmp, 0)} valueUnit="occupati" caption="posti di lavoro attivati" />
          <SintesiKPI icon="gettito"    label="Gettito fiscale"         value={fmtM(natFiscal)}      caption="che rientra nelle casse dello Stato" />
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
          subtitle="PIL e produzione per euro speso; occupazione per milione di euro; gettito come quota della spesa iniziale"
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
          <strong>{fmtIT(regEmpInt, 0)} posti di lavoro per milione investito</strong> regionali ({fmtIT(natEmpInt, 0)} nazionali) e
          restituisce allo Stato{" "}
          <strong>{fmtIT(Math.round(fiscalPct / 100 * 1_000_000), 0)} €</strong> di gettito fiscale ogni milione speso.
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
        {fmtM(gdp)} PIL · {fmtIT(emp, emp < 10 ? 1 : 0)} occupati
      </p>
    </div>
  );
}

function SintesiMultiplierGrid({ regGdpMult, natGdpMult, regProdMult, natProdMult, regEmpInt, natEmpInt, fiscalPct }) {
  const rows = [
    { icon: "pil",         label: "PIL",                    regVal: `${fmtIT(regGdpMult, 2)}×`,   natVal: `${fmtIT(natGdpMult, 2)}×` },
    { icon: "produzione",  label: "Valore della Produzione", regVal: `${fmtIT(regProdMult, 2)}×`,  natVal: `${fmtIT(natProdMult, 2)}×` },
    { icon: "occupazione", label: "Occupazione per M€ speso", regVal: `${fmtIT(regEmpInt, 1)} occupati`, natVal: `${fmtIT(natEmpInt, 1)} occupati` },
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
          PIL e produzione indicano euro attivati per ogni euro speso; l'occupazione indica occupati per milione di euro investito; il gettito indica la quota della spesa iniziale che rientra nelle casse dello Stato come entrate fiscali.
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
          <p className="text-[10px] uppercase tracking-[0.12em] text-ink-400">Occupati ogni 10.000 ab.</p>
          <p className={`mt-1 text-[22px] font-bold leading-none ${highlight ? "text-brand-violet" : "text-ink-900"}`}>
            {fmtIT(empPc, 2)}
          </p>
        </div>
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
      label: "Occupazione",
      text: "Occupati generati nell'economia: lavoro diretto nei settori che ricevono la spesa, indiretto presso i fornitori, indotto dai consumi.",
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
        <span className="text-xs text-ink-400">{open ? "Chiudi ?" : "Apri ?"}</span>
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

function TakeawayBanner({ text }) {
  return (
    <div className="border-l-4 border-accent-lime bg-white px-6 py-5">
      <p className="text-sm font-medium text-ink-900">{text}</p>
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
  const fmt = metricDef.isMoney ? fmtM : fmtOccupati;
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

  let insight;
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
    if (dim === "employment") return { value: `${fmtIT(synthKpis.employment_intensity_per_meur ?? 0, 1)} occupati`, sub: "per M€ speso" };
    const m = (byPerimeter.region?.income ?? 0) / spendTotal;
    return { value: `${fmtIT(m, 2)}×`, sub: "redditi / spesa" };
  })();

  // Ranking — adapts to current view (province or regioni) and selected mode.
  const rankFmt = getGeoFmt(dim, mode);
  const rankSorted = [...currentList].sort((a, b) => getGeoValue(b, dim, mode) - getGeoValue(a, dim, mode));
  const rankTotal = rankSorted.reduce((sum, r) => sum + getGeoValue(r, dim, mode), 0);
  const rankLeader = rankSorted[0];
  const rankTop5 = rankSorted.slice(1, 6);
  const rankOthers = rankSorted.slice(6);
  const rankOthersSum = rankOthers.reduce((sum, r) => sum + getGeoValue(r, dim, mode), 0);
  const rankTitleSuffix = mode === "pc" ? "pro capite" : "per valore";
  const rankTitle = selectedRegion ? `Top province — ${selectedRegion}` : isProvinceView ? `Top province ${rankTitleSuffix}` : `Top regioni ${rankTitleSuffix}`;
  const rankOthersLabel = isProvinceView ? "province" : "regioni";

  // Bottom section
  const macroSplit = rawGeo.macro_split ?? {};
  const originPct = Math.round((macroSplit.origin?.pct ?? 0.46) * 100);
  const restRegPct = Math.round((macroSplit.rest_of_region?.pct ?? 0.38) * 100);
  const extraPct = 100 - originPct - restRegPct;
  const stayPct = originPct + restRegPct;
  const dimTotal = byPerimeter.national?.[dim] ?? 0;
  const dimFmt = dim === "employment" ? fmtOccupati : fmtM;
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
            <div className="mt-1 text-[12px] text-ink-500">Distribuito su {isProvinceView ? `${currentList.length} province` : `${regions.length} regioni`} italiane</div>
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
          <div className="mb-3.5 text-[11px] uppercase tracking-[0.08em] text-ink-400">{rankTitle}</div>

          {rankLeader && (
            <div
              className={`-mx-2 mb-4 rounded border-b border-ink-100 px-2 pb-3.5 pt-2 transition-colors ${!isProvinceView ? `cursor-pointer hover:bg-bg-page${selectedRegion === rankLeader.nome ? " bg-[#EEEDFE]" : ""}` : ""}`}
              onClick={!isProvinceView ? () => setSelectedRegion((prev) => (prev === rankLeader.nome ? null : rankLeader.nome)) : undefined}
            >
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-[15px] font-medium text-ink-900">{rankLeader.nome}</span>
                <span className="text-[15px] font-medium text-ink-900">{rankFmt(getGeoValue(rankLeader, dim, mode))}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="h-2 flex-1 overflow-hidden rounded" style={{ background: "#F5F5F4" }}>
                  <div
                    className="h-full rounded transition-all"
                    style={{ width: `${rankTotal > 0 ? (getGeoValue(rankLeader, dim, mode) / rankTotal) * 100 : 0}%`, background: "#534AB7" }}
                  />
                </div>
                <span className="min-w-[36px] text-right text-[12px] text-ink-500">
                  {rankTotal > 0 ? Math.round((getGeoValue(rankLeader, dim, mode) / rankTotal) * 100) : 0}%
                </span>
              </div>
            </div>
          )}

          <div className="flex-1">
            {rankTop5.map((r, idx) => {
              const val = getGeoValue(r, dim, mode);
              const pct = rankTotal > 0 ? (val / rankTotal) * 100 : 0;
              return (
                <div
                  key={r.code ?? r.nome}
                  className={`-mx-2 rounded px-2 py-2 transition-colors ${!isProvinceView ? `cursor-pointer hover:bg-bg-page${selectedRegion === r.nome ? " bg-[#EEEDFE]" : ""}` : ""}`}
                  onClick={!isProvinceView ? () => setSelectedRegion((prev) => (prev === r.nome ? null : r.nome)) : undefined}
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
              <span>Altre {rankOthers.length} {rankOthersLabel}</span>
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
            <circle cx="160" cy="180" r="118" fill="#AFA9EC" stroke="white" strokeWidth="2" />
            <circle cx="160" cy="195" r="82" fill="#534AB7" stroke="white" strokeWidth="2" />
            <text x="160" y="195" textAnchor="middle" fontSize="32" fontWeight="500" fill="white" dominantBaseline="middle">{originPct}%</text>
            <text x="160" y="215" textAnchor="middle" fontSize="11" fill="white" opacity="0.85" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>{originProvince}</text>
            <text x="160" y="84" textAnchor="middle" fontSize="18" fontWeight="500" fill="#26215C">{restRegPct}%</text>
            <text x="160" y="101" textAnchor="middle" fontSize="9" fill="#3C3489" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Resto {regionName}</text>
            <text x="160" y="32" textAnchor="middle" fontSize="14" fontWeight="500" fill="#3C3489">{extraPct}%</text>
            <text x="160" y="48" textAnchor="middle" fontSize="10" fill="#534AB7" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Resto d'Italia</text>
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
  const [heatmapMode, setHeatmapMode] = useState("tutti");
  const [rankView, setRankView] = useState("territorio");
  const isMoney = dim !== "employment";
  const sorted = [...sectItems].sort((a, b) => sectorTotal(b, dim) - sectorTotal(a, dim));

  useEffect(() => { updateSearch?.({ dim }); }, [dim, updateSearch]);
  useEffect(() => { setDim(searchParams?.get("dim") ?? "gdp"); }, [searchParams]);

  const dimLabel = SECTOR_DIMS.find((d) => d.id === dim)?.label ?? dim;
  const fmt = isMoney ? fmtM : fmtOccupati;
  const grandTotal = sorted.reduce((s, sec) => s + sectorTotal(sec, dim), 0) || 1;
  const top3 = sorted.slice(0, 3);
  const top3Sum = top3.reduce((s, sec) => s + sectorTotal(sec, dim), 0);
  const top3Pct = Math.round((top3Sum / grandTotal) * 100);

  const sankeyInsight = (() => {
    const src = comps[dim] ?? {};
    const direct = cleanText(src.top_sectors?.direct?.[0]?.name ?? "il settore principale");
    const indirect = cleanText(src.top_sectors?.indirect?.[0]?.name ?? "la filiera dei fornitori");
    const induced = cleanText(src.top_sectors?.induced?.[0]?.name ?? "i consumi delle famiglie");
    return `La componente diretta è trainata da ${direct}; l'indiretta si appoggia a ${indirect}; l'indotta emerge soprattutto in ${induced}.`;
  })();

  return (
    <div>
      <p className="mb-7 max-w-[720px] text-[15px] leading-relaxed text-ink-500">
        L'investimento da <strong className="text-ink-900">{fmtM(inp.total_spend ?? 0)}</strong> a {originProvince} non si ferma a un solo settore: si propaga lungo le filiere. Ecco quali settori ricevono più valore e come la spesa ne attiva altri.
      </p>

      <div className="mb-6">
        <div className="mb-2 text-[11px] uppercase tracking-[0.08em] text-ink-400">Dimensione</div>
        <GeoTabPills options={SECTOR_DIMS} value={dim} onChange={setDim} />
      </div>

      {/* Section 1: Classifica settoriale */}
      <div className="mb-12">
        <div className="mb-5">
          <div className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.08em]" style={{ color: "#534AB7" }}>Classifica settoriale</div>
          <h2 className="mb-2 text-[20px] font-medium text-ink-900">I settori che ricevono più valore</h2>
          <p className="max-w-[720px] text-[14px] leading-relaxed text-ink-500">
            {rankView === "territorio"
              ? `Ogni barra mostra quanto valore arriva al settore, suddiviso per territorio. Più la barra è scura, più il valore resta vicino a ${originProvince}.`
              : "Ogni barra mostra come il valore di ogni settore si divide tra effetto diretto (spesa immediata), indiretto (fornitori) e indotto (consumi delle famiglie)."}
          </p>
        </div>
        <div className="mb-4">
          <GeoTabPills
            options={[
              { id: "territorio", label: "Per territorio" },
              { id: "componenti", label: "Per componente" },
            ]}
            value={rankView}
            onChange={setRankView}
          />
        </div>
        <SectorRankingCard sectors={sorted} dim={dim} isMoney={isMoney} rankView={rankView} />
        {top3.length >= 3 && (
          <SectorInsightBox>
            <strong className="font-medium">{cleanText(top3[0].ateco_name)}</strong> è il settore più attivato ({fmt(sectorTotal(top3[0], dim))} di {dimLabel.toLowerCase()}), seguito da{" "}
            <strong className="font-medium">{cleanText(top3[1].ateco_name)}</strong> e{" "}
            <strong className="font-medium">{cleanText(top3[2].ateco_name)}</strong>. Insieme questi tre settori valgono il {top3Pct}% dell'impatto totale.
          </SectorInsightBox>
        )}
      </div>

      <hr className="my-8 border-ink-100" />

      {/* Section 2: Mappa di calore */}
      <div className="mb-12">
        <div className="mb-5">
          <div className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.08em]" style={{ color: "#534AB7" }}>Mappa di calore</div>
          <h2 className="mb-2 text-[20px] font-medium text-ink-900">Dove si concentra il valore, settore per settore</h2>
          <p className="max-w-[720px] text-[14px] leading-relaxed text-ink-500">
            Per ogni coppia settore × regione, il colore mostra l'intensità del {dimLabel} attivato. La {regionName} domina sempre: attiva il toggle per scoprire come si distribuisce il valore nel resto d'Italia.
          </p>
        </div>
        <div className="rounded-xl border border-ink-100 bg-white p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <GeoTabPills
              options={[{ id: "tutti", label: "Tutte le regioni" }, { id: "extra", label: `Senza ${regionName}` }]}
              value={heatmapMode}
              onChange={setHeatmapMode}
            />
            <span className="text-[12px] text-ink-400">Passa sopra una cella per il valore esatto</span>
          </div>
          <SectorHeatmap dim={dim} isMoney={isMoney} excludeOrigin={heatmapMode === "extra"} onCellClick={(config) => onOpenExplore?.(config)} />
          <div className="mt-4 flex items-center gap-2.5 text-[11px] text-ink-400">
            <span>Basso</span>
            <div className="flex overflow-hidden rounded-sm">
              {["#EEEDFE", "#CECBF6", "#AFA9EC", "#7F77DD", "#534AB7"].map((c) => (
                <div key={c} style={{ background: c, width: 22, height: 10 }} />
              ))}
            </div>
            <span>Alto</span>
          </div>
        </div>
        <SectorInsightBox>
          {heatmapMode === "tutti" ? (
            <>La <strong className="font-medium">{regionName}</strong> domina ogni riga: per ogni settore concentra circa l'85% del valore. Le altre regioni ricevono frazioni minori dei flussi nazionali.</>
          ) : (
            <>Escludendo la <strong className="font-medium">{regionName}</strong>, i settori più attivati fuori regione sono quelli con filiere nazionali più ampie (materiali, trasporti, energia). Le regioni del Nord ricevono i flussi maggiori.</>
          )}
        </SectorInsightBox>
      </div>

      <hr className="my-8 border-ink-100" />

      {/* Section 3: Flussi di attivazione */}
      <div>
        <div className="mb-5">
          <div className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.08em]" style={{ color: "#534AB7" }}>Flussi di attivazione</div>
          <h2 className="mb-2 text-[20px] font-medium text-ink-900">Da dove parte il valore, dove arriva</h2>
          <p className="max-w-[720px] text-[14px] leading-relaxed text-ink-500">
            Come la spesa diretta (sinistra) si propaga nei settori attivati per effetto indiretto e indotto (destra). Lo spessore dei flussi è proporzionale al valore attivato.
          </p>
        </div>
        <SectorSankeyChart key={dim} dim={dim} />
        <SectorInsightBox>{cleanText(sankeyInsight)}</SectorInsightBox>
      </div>
    </div>
  );
}

function sectorTotal(s, dim) {
  const v = s.values?.[dim] ?? {};
  return (v.intra ?? 0) + (v.extra ?? 0);
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
    return base + (idx >= 0 ? 3 - Math.min(idx, 2) : 0);
  };
  const direct = scoreFor("direct");
  const indirect = scoreFor("indirect");
  const induced = scoreFor("induced");
  const total = direct + indirect + induced || 1;
  return { direct: direct / total, indirect: indirect / total, induced: induced / total };
}

function SectorRankingCard({ sectors, dim, isMoney, rankView = "territorio" }) {
  const fmt = isMoney ? fmtM : fmtOccupati;
  const grandTotal = sectors.reduce((s, sec) => s + sectorTotal(sec, dim), 0) || 1;
  const maxTotal = Math.max(...sectors.map((s) => sectorTotal(s, dim)), 1);
  const seg = threeSeg[dim] ?? {};
  const intraAggregate = (seg.origin ?? 0) + (seg.rest_region ?? 0);
  const originShare = intraAggregate > 0 ? (seg.origin ?? 0) / intraAggregate : 0.5;

  const legendItems = rankView === "territorio"
    ? [
        { color: "#534AB7", label: `${originProvince} (provincia origine)` },
        { color: "#AFA9EC", label: `Resto ${regionName}` },
        { color: "#A8A29E", label: "Resto d'Italia" },
      ]
    : [
        { color: "#534AB7", label: "Diretto" },
        { color: "#AFA9EC", label: "Indiretto" },
        { color: "#CECBF6", label: "Indotto" },
      ];

  return (
    <div className="rounded-xl border border-ink-100 bg-white p-6">
      <div className="mb-5 flex flex-wrap gap-4">
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 text-[12px] text-ink-500">
            <span className="h-3 w-3 flex-shrink-0 rounded-sm" style={{ background: item.color }} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
      <div>
        {sectors.map((s, idx) => {
          const intra = s.values?.[dim]?.intra ?? 0;
          const extra = s.values?.[dim]?.extra ?? 0;
          const origin = intra * originShare;
          const region = intra * (1 - originShare);
          const total = intra + extra;
          const widthPct = (total / maxTotal) * 100;
          const sharePct = Math.round((total / grandTotal) * 100);
          const compact = idx === sectors.length - 1 && sectors.length > 7;

          let seg1Pct, seg2Pct, seg3Pct, seg1Color, seg2Color, seg3Color;
          if (rankView === "territorio") {
            seg1Pct = total > 0 ? (origin / total) * 100 : 0;
            seg2Pct = total > 0 ? (region / total) * 100 : 0;
            seg3Pct = total > 0 ? (extra / total) * 100 : 0;
            seg1Color = "#534AB7"; seg2Color = "#AFA9EC"; seg3Color = "#A8A29E";
          } else {
            const mix = getSectorComponentMix(cleanText(s.ateco_name), dim);
            seg1Pct = mix.direct * 100;
            seg2Pct = mix.indirect * 100;
            seg3Pct = mix.induced * 100;
            seg1Color = "#534AB7"; seg2Color = "#AFA9EC"; seg3Color = "#CECBF6";
          }

          return (
            <div
              key={s.ateco_code}
              className={`grid items-center gap-4 border-b border-ink-100 last:border-b-0 ${compact ? "py-1.5 opacity-70" : "py-2.5"}`}
              style={{ gridTemplateColumns: "180px 1fr 100px" }}
            >
              <span className="truncate text-[13px] text-ink-900" title={cleanText(s.ateco_name)}>
                {cleanText(s.ateco_name)}
              </span>
              <div className="relative overflow-hidden rounded-sm" style={{ height: compact ? 8 : 18, background: "#F5F5F4" }}>
                <div className="absolute left-0 top-0 flex h-full" style={{ width: `${widthPct}%` }}>
                  <div style={{ width: `${seg1Pct}%`, background: seg1Color }} />
                  <div style={{ width: `${seg2Pct}%`, background: seg2Color }} />
                  <div style={{ width: `${seg3Pct}%`, background: seg3Color }} />
                </div>
              </div>
              <div className="text-right text-[13px] font-medium text-ink-900">
                {fmt(total)}
                <span className="ml-1.5 text-[11px] font-normal text-ink-400">{sharePct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SectorInsightBox({ children }) {
  return (
    <div
      className="mt-4 px-[18px] py-3.5 text-[14px] leading-relaxed"
      style={{ background: "#EEEDFE", borderLeft: "3px solid #534AB7", borderRadius: "0 8px 8px 0", color: "#3C3489" }}
    >
      {children}
    </div>
  );
}

function SectorHeatmap({ dim, isMoney, excludeOrigin = false, onCellClick }) {
  const rowItems = [...sectItems]
    .sort((a, b) => sectorTotal(b, dim) - sectorTotal(a, dim))
    .slice(0, 10);
  const allRegions = [...geo.regions].sort((a, b) => getGeoValue(b, dim, "assoluti") - getGeoValue(a, dim, "assoluti"));
  const territories = excludeOrigin
    ? allRegions.filter((r) => r.nuts2_code !== originNuts2 && r.nome !== regionName).slice(0, 8)
    : allRegions.slice(0, 8);
  const cells = rowItems.flatMap((sector) =>
    territories.map((territory) => {
      const sectorVal = sector.by_territory?.regions?.find((r) => r.code === territory.code)?.values?.[dim] ?? 0;
      return { sector, territory, value: sectorVal };
    })
  );
  const max = Math.max(...cells.map((c) => c.value), 1);
  const fmt = isMoney ? fmtM : fmtOccupati;

  function cellStyle(value) {
    const ratio = value / max;
    if (ratio === 0) return { backgroundColor: "#F6F6F8" };
    if (ratio <= 0.05) return { backgroundColor: "rgba(83,74,183,0.10)" };
    if (ratio <= 0.20) return { backgroundColor: "rgba(83,74,183,0.25)" };
    if (ratio <= 0.40) return { backgroundColor: "rgba(83,74,183,0.45)" };
    if (ratio <= 0.70) return { backgroundColor: "rgba(83,74,183,0.68)" };
    return { backgroundColor: "#534AB7" };
  }

  function cellTextColor(value) {
    return value / max > 0.40 ? "text-white" : "text-ink-700";
  }

  const cols = territories.length;

  return (
    <div className="overflow-auto">
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
                  onClick={() => onCellClick?.({ tab: "esplora", dim, asse: "geografica", livello: "regionale", filter: "tutti", focus: territory.code })}
                  className={`group relative border-r border-ink-100 px-1 py-4 last:border-r-0 transition-opacity hover:opacity-80 ${cellTextColor(value)}`}
                  style={cellStyle(value)}
                  title={`${cleanText(sector.ateco_name)} × ${cleanText(territory.nome)}: ${fmt(value)}`}
                >
                  {value > 0 && (
                    <span className="block text-center text-[10px] font-mono font-semibold opacity-0 transition-opacity group-hover:opacity-100">
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

const SANKEY_LEFT_COLORS = ["#4318C2", "#5B21F7", "#7C3AED", "#8B5CF6", "#9E7BFA", "#A78BFA", "#C4B5FD"];
const SANKEY_RIGHT_COLORS = ["#0F766E", "#0D9488", "#14B8A6", "#0891B2", "#0E7490", "#0284C7", "#0369A1", "#1D4ED8"];

function SectorSankeyChart({ dim }) {
  const totalSpend = inp.total_spend || 1;

  const sankeyData = useMemo(() => {
    const spendSectors = inp.spend_breakdown ?? [];
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
          hovertemplate: "%{source.label} ? %{target.label}<extra></extra>",
        },
      },
    ];
  }, [dim, totalSpend]);

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


function TabEsplora({ showToast, searchParams, updateSearch }) {
  const [metric, setMetric] = useState(searchParams.get("dim") ?? "gdp");
  const [dimKey, setDimKey] = useState(searchParams.get("asse_key") ?? "regione");
  const [effect, setEffect] = useState("tutti");
  const [areaFilter, setAreaFilter] = useState(searchParams.get("filter") ?? "tutti");
  const [focus, setFocus] = useState(searchParams.get("focus") ?? "");
  const [sortKey, setSortKey] = useState("value");
  const [sortDir, setSortDir] = useState("desc");
  const [openPill, setOpenPill] = useState(null);

  const axis = { regione: "geografica", provincia: "geografica", settore: "settoriale", componente: "componente", totale: "totale" }[dimKey] ?? "geografica";
  const level = dimKey === "provincia" ? "provinciale" : "regionale";
  const regionFilt = dimKey === "provincia" && areaFilter !== "tutti" ? areaFilter : "";

  useEffect(() => {
    updateSearch({ tab: "esplora", dim: metric, asse_key: dimKey, filter: areaFilter, focus });
  }, [metric, dimKey, areaFilter, focus, updateSearch]);

  useEffect(() => {
    setMetric(searchParams.get("dim") ?? "gdp");
    setDimKey(searchParams.get("asse_key") ?? "regione");
    setAreaFilter(searchParams.get("filter") ?? "tutti");
    setFocus(searchParams.get("focus") ?? "");
  }, [searchParams]);

  useEffect(() => {
    if (metric === "fiscal") { setDimKey("totale"); setAreaFilter("tutti"); setFocus(""); }
    if (metric === "income" && dimKey === "componente") { setDimKey("regione"); }
  }, [metric, dimKey]);

  const baseRows = useMemo(
    () => buildExploreRows({ dim: metric, axis, level, filter: dimKey === "settore" ? areaFilter : "tutti", focus, regionFilt }),
    [metric, axis, level, areaFilter, focus, regionFilt, dimKey]
  );

  const effectRows = useMemo(() => {
    if (effect === "tutti" || dimKey !== "settore") return baseRows;
    return baseRows
      .map((r) => ({ ...r, value: effect === "diretto" ? (r.directValue ?? 0) : effect === "indiretto" ? (r.indirectValue ?? 0) : (r.inducedValue ?? 0) }))
      .filter((r) => r.value > 0);
  }, [baseRows, effect, dimKey]);

  const sortedRows = useMemo(() => {
    const copy = [...effectRows];
    copy.sort((a, b) => {
      if (sortKey === "label") return sortDir === "desc" ? String(b.label ?? "").localeCompare(String(a.label ?? "")) : String(a.label ?? "").localeCompare(String(b.label ?? ""));
      return sortDir === "desc" ? (b[sortKey] ?? 0) - (a[sortKey] ?? 0) : (a[sortKey] ?? 0) - (b[sortKey] ?? 0);
    });
    return copy;
  }, [effectRows, sortKey, sortDir]);

  const metaMeta = EXPLORE_DIMS.find((d) => d.id === metric) ?? EXPLORE_DIMS[1];
  const total = sortedRows.reduce((s, r) => s + (r.value ?? 0), 0);
  const maxValue = Math.max(...sortedRows.map((r) => r.value ?? 0), 1);

  useEffect(() => {
    const handler = () => setOpenPill(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  function togglePill(name, e) { e.stopPropagation(); setOpenPill((p) => (p === name ? null : name)); }

  const metricOptions = EXPLORE_DIMS.filter((d) => d.id !== "spend").map((d) => ({ id: d.id, label: d.label }));
  const dimOptions = [
    { id: "regione", label: "regione" },
    { id: "provincia", label: "provincia" },
    { id: "settore", label: "settore" },
    { id: "componente", label: "componente", disabled: metric === "fiscal" || metric === "income" },
    { id: "totale", label: "valore complessivo" },
  ];
  const effectOptions = [
    { id: "tutti", label: "diretto, indiretto e indotto" },
    { id: "diretto", label: "solo diretto" },
    { id: "indiretto", label: "solo indiretto" },
    { id: "indotto", label: "solo indotto" },
  ];

  const areaFilterOptions = useMemo(() => {
    if (dimKey === "provincia") return [{ id: "tutti", label: "tutte le regioni" }, ...geo.regions.map((r) => ({ id: r.nome, label: r.nome }))];
    if (dimKey === "settore") return [{ id: "tutti", label: "tutti i settori" }, { id: "top10", label: "top 10 settori" }];
    return [];
  }, [dimKey]);

  const focusOptions = useMemo(() => {
    if (dimKey === "settore") return [
      { id: "", label: "tutti i territori" },
      ...geo.regions.map((r) => ({ id: r.code, label: r.nome })),
      ...geo.provinces.map((p) => ({ id: p.code, label: `${p.nome} (prov.)` })),
    ];
    if (dimKey === "regione") return [{ id: "", label: "tutte le regioni" }, ...geo.regions.map((r) => ({ id: r.code, label: r.nome }))];
    if (dimKey === "provincia") {
      const filtered = areaFilter && areaFilter !== "tutti"
        ? geo.provinces.filter((p) => p.regione === areaFilter || p.region_name === areaFilter)
        : geo.provinces;
      return [{ id: "", label: "tutte le province" }, ...filtered.map((p) => ({ id: p.code, label: p.nome }))];
    }
    return [];
  }, [dimKey, areaFilter]);

  const metricLabel = metricOptions.find((o) => o.id === metric)?.label ?? metric;
  const dimLabel2 = dimOptions.find((o) => o.id === dimKey)?.label ?? dimKey;
  const effectLabel = effectOptions.find((o) => o.id === effect)?.label ?? effect;
  const areaFilterLabel = areaFilterOptions.find((o) => o.id === areaFilter)?.label ?? areaFilter;
  const focusLabel = focusOptions.find((o) => o.id === focus)?.label ?? "tutti";

  const summaryText = (() => {
    const eff = effect === "tutti" ? "scomposto per effetto" : `solo effetto ${effect}`;
    return `Stai vedendo <strong>${metricLabel}</strong> per <strong>${dimLabel2}</strong>, ${eff}. <strong>${sortedRows.length}</strong> riga${sortedRows.length === 1 ? "" : "he"}.`;
  })();

  const PRESETS = [
    { label: "Top 5 regioni per PIL", fn: () => { setMetric("gdp"); setDimKey("regione"); setEffect("tutti"); setAreaFilter("tutti"); setFocus(""); setSortKey("value"); setSortDir("desc"); } },
    { label: "Settori principali (PIL)", fn: () => { setMetric("gdp"); setDimKey("settore"); setEffect("tutti"); setAreaFilter("top10"); setFocus(""); } },
    { label: "Occupazione per regione", fn: () => { setMetric("employment"); setDimKey("regione"); setEffect("tutti"); setAreaFilter("tutti"); setFocus(""); } },
    { label: "PIL diretto — settori", fn: () => { setMetric("gdp"); setDimKey("settore"); setEffect("diretto"); setAreaFilter("tutti"); setFocus(""); } },
    { label: `Province di ${regionName}`, fn: () => { setMetric("gdp"); setDimKey("provincia"); setEffect("tutti"); setAreaFilter(regionName); setFocus(""); } },
    { label: "Scomposizione componenti", fn: () => { setMetric("gdp"); setDimKey("componente"); setEffect("tutti"); setAreaFilter("tutti"); setFocus(""); } },
  ];

  const showAreaFilter = areaFilterOptions.length > 0;
  const showFocusPill = focusOptions.length > 1 && dimKey !== "componente" && dimKey !== "totale";
  const showEffectPill = dimKey === "settore";

  return (
    <div>
      <p className="mb-7 max-w-[720px] text-[15px] leading-relaxed text-ink-500">
        Componi la domanda che ti interessa scegliendo cosa misurare, come scomporlo e per quale territorio. Il risultato si aggiorna istantaneamente e può essere esportato.
      </p>

      {/* Query card */}
      <div className="mb-5 border border-ink-100 bg-white p-6">
        <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-ink-400">La tua domanda</div>
        <div className="flex flex-wrap items-center gap-2 leading-relaxed text-ink-900" style={{ fontSize: 18 }}>
          <span>Mostrami il</span>
          <ExplorePill label={metricLabel} open={openPill === "metric"} onToggle={(e) => togglePill("metric", e)}>
            <ExplorePillDropdown options={metricOptions} selected={metric} onSelect={(v) => { setMetric(v); setOpenPill(null); }} />
          </ExplorePill>
          <span>per</span>
          <ExplorePill label={dimLabel2} open={openPill === "dim"} onToggle={(e) => togglePill("dim", e)}>
            <ExplorePillDropdown options={dimOptions} selected={dimKey} onSelect={(v) => { setDimKey(v); setAreaFilter("tutti"); setFocus(""); setEffect("tutti"); setOpenPill(null); }} />
          </ExplorePill>
          {showEffectPill && (
            <>
              <span>scomposto in</span>
              <ExplorePill label={effectLabel} open={openPill === "effect"} onToggle={(e) => togglePill("effect", e)}>
                <ExplorePillDropdown options={effectOptions} selected={effect} onSelect={(v) => { setEffect(v); setOpenPill(null); }} />
              </ExplorePill>
            </>
          )}
          {showAreaFilter && (
            <>
              <span>, limitato a</span>
              <ExplorePill label={areaFilterLabel} open={openPill === "area"} onToggle={(e) => togglePill("area", e)}>
                <ExplorePillDropdown options={areaFilterOptions} selected={areaFilter} onSelect={(v) => { setAreaFilter(v); setFocus(""); setOpenPill(null); }} />
              </ExplorePill>
            </>
          )}
          {showFocusPill && (
            <>
              <span>·</span>
              <ExplorePill label={focusLabel} open={openPill === "focus"} onToggle={(e) => togglePill("focus", e)}>
                <ExplorePillDropdown options={focusOptions} selected={focus} onSelect={(v) => { setFocus(v); setOpenPill(null); }} searchable={focusOptions.length > 10} />
              </ExplorePill>
            </>
          )}
        </div>
      </div>

      {/* Presets */}
      <div className="mb-6">
        <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.08em] text-ink-400">Domande frequenti</div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button key={p.label} onClick={p.fn} className="flex items-center gap-1.5 border border-ink-200 bg-white px-3.5 py-1.5 text-[13px] text-ink-500 transition-colors hover:border-[#AFA9EC] hover:bg-[#EEEDFE] hover:text-[#3C3489]">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Result header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border border-ink-100 bg-white px-5 py-4">
        <div>
          <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.08em] text-ink-400">Risultato</div>
          <div className="text-[14px] text-ink-500" dangerouslySetInnerHTML={{ __html: summaryText }} />
        </div>
        <div className="flex items-baseline gap-2.5">
          <span className="text-[13px] text-ink-500">Totale:</span>
          <span className="text-[22px] font-medium" style={{ color: "#534AB7" }}>
            {metaMeta.isMoney ? fmtM(total) : fmtOccupati(total)}
          </span>
        </div>
        <div className="flex gap-2">
          {["CSV", "Excel", "Copia"].map((label) => (
            <button key={label} onClick={() => showToast?.(`${label} export disponibile nella versione completa.`, "info")} className="flex items-center gap-1.5 border border-ink-200 bg-white px-3 py-1.5 text-[13px] text-ink-500 transition-colors hover:border-ink-400 hover:bg-bg-page hover:text-ink-900">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              {label}
            </button>
          ))}
        </div>
      </div>

      <ExploreResultTable
        rows={sortedRows}
        meta={metaMeta}
        dimKey={dimKey}
        effect={effect}
        maxValue={maxValue}
        total={total}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={(key) => { if (sortKey === key) setSortDir((d) => (d === "desc" ? "asc" : "desc")); else { setSortKey(key); setSortDir("desc"); } }}
      />
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

function ExplorePill({ label, open, onToggle, compact = false, children }) {
  return (
    <span className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={onToggle}
        className="inline-flex items-center gap-1.5 border font-medium transition-all"
        style={{
          borderRadius: 4,
          padding: compact ? "4px 10px" : "5px 14px",
          fontSize: compact ? 13 : 15,
          background: open ? "#CECBF6" : "#EEEDFE",
          borderColor: open ? "#7F77DD" : "#AFA9EC",
          color: "#3C3489",
        }}
      >
        {label}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.55"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      {open && children}
    </span>
  );
}

function ExplorePillDropdown({ options, selected, onSelect, searchable = false }) {
  const [search, setSearch] = useState("");
  const filtered = searchable && search
    ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  return (
    <div
      className="absolute left-0 z-50 min-w-[220px] border border-ink-100 bg-white shadow-lg"
      style={{ top: "calc(100% + 6px)", borderRadius: 0, maxHeight: 320, overflowY: "auto" }}
      onClick={(e) => e.stopPropagation()}
    >
      {searchable && (
        <div className="sticky top-0 border-b border-ink-100 bg-white p-2">
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cerca..."
            className="w-full border border-ink-200 px-2.5 py-1.5 text-[13px] outline-none focus:border-[#7F77DD]"
            style={{ borderRadius: 6 }}
          />
        </div>
      )}
      {filtered.map((opt) => (
        <button
          key={opt.id}
          onClick={() => !opt.disabled && onSelect(opt.id)}
          className={`flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-[14px] transition-colors ${opt.disabled ? "cursor-not-allowed opacity-40" : "hover:bg-[#EEEDFE]"} ${selected === opt.id ? "font-medium" : "text-ink-900"}`}
          style={selected === opt.id ? { background: "#EEEDFE", color: "#3C3489" } : {}}
        >
          <span>{opt.label}</span>
          {selected === opt.id && <span style={{ color: "#534AB7", fontWeight: 600, fontSize: 13 }}>?</span>}
        </button>
      ))}
    </div>
  );
}

function ExploreResultTable({ rows, meta, dimKey, effect, maxValue, total, sortKey, sortDir, onSort }) {
  const fmt = meta.isMoney ? fmtM : fmtOccupati;
  const showEffectCols = effect === "tutti" && dimKey === "settore" && rows.length > 0 && rows[0]?.directValue != null;

  if (rows.length === 1) {
    const r = rows[0];
    const showBreakdown = showEffectCols;
    return (
      <div className="p-10 text-white" style={{ background: "linear-gradient(135deg, #534AB7, #3C3489)" }}>
        <div className="mb-3 text-[12px] uppercase tracking-[0.08em] opacity-70">{meta.label} · {effect === "tutti" ? "totale" : `solo ${effect}`}</div>
        <div className="mb-4 font-medium leading-none" style={{ fontSize: 64, letterSpacing: "-0.02em" }}>{fmt(r.value)}</div>
        <div className="text-[15px] opacity-90">Valore attivato in <strong>{cleanText(r.label ?? "")}</strong>.</div>
        {showBreakdown && (r.directValue != null || r.indirectValue != null || r.inducedValue != null) && (
          <div className="mt-6 flex flex-wrap gap-8 border-t pt-6" style={{ borderColor: "rgba(255,255,255,0.2)" }}>
            {r.directValue != null && <div><div className="mb-1 text-[11px] uppercase tracking-[0.08em] opacity-60">Diretto</div><div className="text-[18px] font-medium">{fmt(r.directValue)}</div></div>}
            {r.indirectValue != null && <div><div className="mb-1 text-[11px] uppercase tracking-[0.08em] opacity-60">Indiretto</div><div className="text-[18px] font-medium">{fmt(r.indirectValue)}</div></div>}
            {r.inducedValue != null && <div><div className="mb-1 text-[11px] uppercase tracking-[0.08em] opacity-60">Indotto</div><div className="text-[18px] font-medium">{fmt(r.inducedValue)}</div></div>}
          </div>
        )}
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="flex items-center gap-2.5 px-4 py-3 text-[13px]" style={{ background: "#EEEDFE", borderLeft: "3px solid #534AB7", borderRadius: "0 8px 8px 0", color: "#3C3489" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        Nessun dato per questa combinazione. Modifica i filtri per ottenere risultati.
      </div>
    );
  }

  const SortIcon = ({ col }) => (
    <span className="ml-1 opacity-40 text-[10px]">{sortKey === col ? (sortDir === "asc" ? "?" : "?") : "?"}</span>
  );

  return (
    <div className="overflow-hidden border border-ink-100 bg-white">
      {showEffectCols && (
        <div className="flex flex-wrap gap-4 border-b border-ink-100 bg-bg-page px-4 py-2.5">
          {[{ color: "#534AB7", label: "Diretto" }, { color: "#AFA9EC", label: "Indiretto" }, { color: "#CECBF6", label: "Indotto" }].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 text-[12px] text-ink-500">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: item.color }} />
              {item.label}
            </div>
          ))}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="cursor-pointer border-b border-ink-100 bg-bg-page px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.05em] text-ink-400 hover:text-ink-900" onClick={() => onSort("label")}>
                Voce <SortIcon col="label" />
              </th>
              <th className="border-b border-ink-100 bg-bg-page px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.05em] text-ink-400" style={{ minWidth: 160 }}>Composizione</th>
              {showEffectCols && (
                <>
                  <th className="cursor-pointer border-b border-ink-100 bg-bg-page px-4 py-3 text-right text-[11px] font-medium uppercase tracking-[0.05em] text-ink-400 hover:text-ink-900 whitespace-nowrap" onClick={() => onSort("directValue")}>Diretto <SortIcon col="directValue" /></th>
                  <th className="cursor-pointer border-b border-ink-100 bg-bg-page px-4 py-3 text-right text-[11px] font-medium uppercase tracking-[0.05em] text-ink-400 hover:text-ink-900 whitespace-nowrap" onClick={() => onSort("indirectValue")}>Indiretto <SortIcon col="indirectValue" /></th>
                  <th className="cursor-pointer border-b border-ink-100 bg-bg-page px-4 py-3 text-right text-[11px] font-medium uppercase tracking-[0.05em] text-ink-400 hover:text-ink-900 whitespace-nowrap" onClick={() => onSort("inducedValue")}>Indotto <SortIcon col="inducedValue" /></th>
                </>
              )}
              <th className="cursor-pointer border-b border-ink-100 bg-bg-page px-4 py-3 text-right text-[11px] font-medium uppercase tracking-[0.05em] text-ink-400 hover:text-ink-900 whitespace-nowrap" onClick={() => onSort("value")}>Totale <SortIcon col="value" /></th>
              <th className="border-b border-ink-100 bg-bg-page px-4 py-3 text-right text-[11px] font-medium uppercase tracking-[0.05em] text-ink-400">% su totale</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const sharePct = total > 0 ? (row.value / total) * 100 : 0;
              const barWidth = maxValue > 0 ? (row.value / maxValue) * 100 : 0;
              return (
                <tr key={row.code ?? idx} className="border-b border-ink-100 last:border-b-0 hover:bg-bg-page">
                  <td className="px-4 py-3 text-[13px] font-medium text-ink-900">{cleanText(row.label ?? "")}</td>
                  <td className="px-4 py-3" style={{ minWidth: 160 }}>
                    <div className="overflow-hidden rounded-sm" style={{ height: 14, background: "#F5F5F4" }}>
                      <div className="flex h-full" style={{ width: `${barWidth}%` }}>
                        {showEffectCols && row.value > 0 ? (
                          <>
                            <div style={{ width: `${(row.directValue ?? 0) / row.value * 100}%`, background: "#534AB7" }} />
                            <div style={{ width: `${(row.indirectValue ?? 0) / row.value * 100}%`, background: "#AFA9EC" }} />
                            <div style={{ width: `${(row.inducedValue ?? 0) / row.value * 100}%`, background: "#CECBF6" }} />
                          </>
                        ) : (
                          <div className="h-full w-full" style={{ background: "#534AB7" }} />
                        )}
                      </div>
                    </div>
                  </td>
                  {showEffectCols && (
                    <>
                      <td className="px-4 py-3 text-right font-mono text-[13px] text-ink-700">{row.directValue != null ? fmt(row.directValue) : "—"}</td>
                      <td className="px-4 py-3 text-right font-mono text-[13px] text-ink-500">{row.indirectValue != null ? fmt(row.indirectValue) : "—"}</td>
                      <td className="px-4 py-3 text-right font-mono text-[13px] text-ink-400">{row.inducedValue != null ? fmt(row.inducedValue) : "—"}</td>
                    </>
                  )}
                  <td className="px-4 py-3 text-right font-mono text-[13px] font-semibold text-ink-900">{fmt(row.value)}</td>
                  <td className="px-4 py-3 text-right text-[13px] text-ink-400">{sharePct.toFixed(1)}%</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td className="border-t-2 border-ink-200 bg-bg-page px-4 py-3.5 text-[13px] font-semibold text-ink-900">Totale</td>
              <td className="border-t-2 border-ink-200 bg-bg-page" />
              {showEffectCols && <><td className="border-t-2 border-ink-200 bg-bg-page" /><td className="border-t-2 border-ink-200 bg-bg-page" /><td className="border-t-2 border-ink-200 bg-bg-page" /></>}
              <td className="border-t-2 border-ink-200 bg-bg-page px-4 py-3.5 text-right font-mono text-[14px] font-semibold text-ink-900">{fmt(total)}</td>
              <td className="border-t-2 border-ink-200 bg-bg-page px-4 py-3.5 text-right text-[13px] text-ink-700">100%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function perimeterToGlossary(tab) {
  return GLOSSARY[tab] ?? [];
}

const GLOSSARY = {
  sintesi: [
    { term: "PIL (valore aggiunto)", def: "Ricchezza nuova generata dall'attività economica." },
    { term: "Produzione", def: "Volume d'affari totale della filiera attivata." },
    { term: "Occupati", def: "Posti di lavoro attivati dal progetto lungo la filiera." },
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
