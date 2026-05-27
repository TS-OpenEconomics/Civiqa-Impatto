import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import staticResults from "../../mocks/eiaResults.json";
import { Badge } from "../ui/Badge";
import { ImpactIcon } from "../ui/ImpactIcon";
import { ItalyMap } from "../ui/ItalyMap";
import { ProvinceMap } from "../ui/ProvinceMap";
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
  { id: "componenti", label: "Componenti" },
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
      <div className="px-4 pt-8 pb-6 md:px-10">
        <nav className="flex items-center gap-1.5 text-xs text-ink-500">
          <button onClick={onBack} className="hover:text-brand-violet transition-colors">
            Dettaglio del progetto
          </button>
          <span>›</span>
          <span className="font-semibold text-ink-700">Analisi di Impatto</span>
        </nav>
        <p className="mt-3 text-xs text-ink-500">
          Creato il <span className="font-mono font-semibold">{meta.creato_il}</span> da{" "}
          <strong>{meta.creato_da}</strong> - Ultima modifica{" "}
          <span className="font-mono font-semibold">{analysis?.updatedAt ?? meta.ultima_modifica}</span>
        </p>

        <div className="mt-5 overflow-hidden border border-ink-100 bg-white">
          <div className="flex flex-wrap items-start justify-between gap-6 bg-ink-900 px-6 py-6 text-white md:px-8">
            <div className="flex items-start gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center bg-white p-2">
                <img src={assetUrl("icons/analysis-eia.png")} alt="Logo analisi di impatto" className="h-full w-full object-contain" />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-[22px] font-bold">Analisi di Impatto</h1>
                  <Badge type="EIA" />
                  <span className="inline-flex bg-white/10 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] text-white/70">
                    Diretti / Indiretti / Indotti
                  </span>
                </div>
                <p className="mt-2 text-sm text-white/80">
                  Del progetto <span className="font-medium text-white">{project?.nome}</span>
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
                  Vista sintetica dei risultati economici, territoriali e occupazionali generati dall'investimento.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <button
                onClick={() => showToast("Export PDF disponibile nella versione completa.", "info")}
                className="flex h-10 items-center gap-2 border border-white/20 bg-white/10 px-4 font-semibold text-white hover:bg-white/20"
              >
                Scarica report <IconDownload />
              </button>
              <button
                onClick={handleDownloadExcel}
                className="flex h-10 items-center gap-2 bg-accent-lime px-4 font-semibold text-ink-900 hover:opacity-90"
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

      <div className="px-4 pb-10 md:px-10">
        {errored && <ErrorBanner />}
        {loading && <LoadingBanner />}
        <div className="overflow-hidden border border-ink-100 bg-white">
          <TabBar
            activeTab={tab}
            previews={buildPerimeterPreview()}
            onChange={handleTabChange}
          />
          <div className="border-t border-ink-100 px-4 py-8 md:px-6">
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
                <TabGeografia updateSearch={updateSearch} searchParams={searchParams} />
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

function TabSintesi({ updateSearch, searchParams }) {
  const [perim, setPerim] = useState(searchParams?.get("perim") ?? "regione");
  const [mode, setMode] = useState(searchParams?.get("modal") ?? "assoluti");
  const regionPct = Math.round(((rawGeo.macro_split?.origin?.pct ?? 0) + (rawGeo.macro_split?.rest_of_region?.pct ?? 0)) * 100);
  const isMultiProvince = (inp.origin_provinces?.length ?? 0) > 1;

  useEffect(() => {
    updateSearch?.({ perim, modal: mode });
  }, [perim, mode, updateSearch]);

  useEffect(() => {
    setPerim(searchParams?.get("perim") ?? "regione");
    setMode(searchParams?.get("modal") ?? "assoluti");
  }, [searchParams]);

  const summaryText = mode === "pc"
    ? `In termini pro-capite, il progetto attiva valore sulla scala scelta.`
    : regionPct >= 70
      ? `L'${regionPct}% del valore aggiunto attivato resta in ${regionName}. La spesa è fortemente ancorata al territorio.`
      : `L'${regionPct}% del valore aggiunto resta in ${regionName}, il resto si attiva in altre regioni attraverso le filiere nazionali.`;

  return (
    <div className="space-y-6">
      <ViewControls
        leftLabel="Perimetro"
        leftOptions={[
          { id: "provincia", label: "Prov. origine" },
          { id: "regione", label: "Regione" },
          { id: "nazionale", label: "Nazionale" },
        ]}
        leftValue={perim}
        onLeftChange={setPerim}
        rightLabel="Modalità"
        rightOptions={[
          { id: "assoluti", label: "Valori assoluti" },
          { id: "pc", label: "Pro capite" },
        ]}
        rightValue={mode}
        onRightChange={setMode}
      />

      <SpendInputCard isMultiProvince={isMultiProvince} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {EFFECTS.map((effect) => (
          <EffectCard key={effect.id} effect={effect} perim={perim} mode={mode} />
        ))}
      </div>

      <KPIBar perim={perim} />
      <TakeawayBanner text={summaryText} />
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
    <div className="border border-ink-100 bg-white p-6 md:p-8">
      <div className="border-l-4 border-brand-violet pl-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">Spesa totale investita</p>
        <p className="mt-3 text-[28px] font-bold text-ink-900 md:text-[34px]">{fmtM(total)}</p>
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
  const extra = effect.nationalOnly ? null : (threeSeg[effect.id]?.extra ?? 0);
  const origin = effect.nationalOnly ? null : (threeSeg[effect.id]?.origin ?? 0);
  const rest = effect.nationalOnly ? null : (threeSeg[effect.id]?.rest_region ?? 0);
  const grand = effect.nationalOnly ? total : (origin ?? 0) + (rest ?? 0) + (extra ?? 0);
  const percent = grand > 0 ? {
    origin: Math.round(((origin ?? 0) / grand) * 100),
    rest: Math.round(((rest ?? 0) / grand) * 100),
    extra: Math.round(((extra ?? 0) / grand) * 100),
  } : { origin: 0, rest: 0, extra: 0 };
  const caption = effect.nationalOnly ? "Valore nazionale" : perimeterCaption(perim);

  return (
    <div className="animate-[fadeIn_.25s_ease] border border-ink-100 bg-white p-5">
      <div className="flex items-center gap-2">
        <ImpactIcon
          type={effect.icon}
          label={effect.label}
          className="h-5 w-5"
          wrapperClassName="flex h-6 w-6 shrink-0 items-center justify-center text-brand-violet"
        />
        <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-500">{effect.label}</span>
      </div>

      <div className="mt-4 space-y-1">
        <p className="text-[30px] font-bold tracking-tight text-ink-900 md:text-[36px]">
          {formatDimensionValue(displayDim, perimValue, displayMode)}
        </p>
        <p className="text-xs text-ink-500">{caption}</p>
      </div>

      {!effect.nationalOnly && (
        <div className="mt-4">
          <ThreeSegmentBar
            origin={origin ?? 0}
            rest={rest ?? 0}
            extra={extra ?? 0}
            highlight={perim}
          />
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-mono text-ink-700">
            <span>Prov:{fmtMoneyOrEtp(origin ?? 0, effect.isMoney)}</span>
            <span>R.reg:{fmtMoneyOrEtp(rest ?? 0, effect.isMoney)}</span>
            <span>Extra:{fmtMoneyOrEtp(extra ?? 0, effect.isMoney)}</span>
          </div>
          <button
            className="mt-2 text-left text-[11px] text-ink-500 hover:text-brand-violet"
            title="Dettaglio segmenti"
            type="button"
          >
            {percent.origin}% / {percent.rest}% / {percent.extra}%
          </button>
        </div>
      )}

      {effect.nationalOnly && (
        <p className="mt-4 text-xs text-ink-500">Il gettito non si scompone territorialmente.</p>
      )}

      <div className="my-4 h-px bg-ink-100" />

      <p className="text-sm leading-relaxed text-ink-700">{effect.description(perim, mode)}</p>
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
  return (
    <div className="bg-bg-page p-4 md:p-6">
      <p className="text-[13px] font-medium text-ink-700">Riferiti al perimetro regionale.</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {KPI_PILLS.map((pill) => (
          <KPIChip key={pill.value} label={pill.value} tooltip={pill.tip} />
        ))}
      </div>
      {perim !== "regione" && (
        <p className="mt-4 max-w-4xl text-sm italic leading-relaxed text-ink-700">
          I moltiplicatori sintetici sono riferiti al perimetro regionale, il livello a cui questi indicatori risultano più affidabili.
          A livello provinciale tendono a sottostimare il rendimento del progetto; a livello nazionale tendono a sovrastimarlo.
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

function TabComponenti() {
  const [dim, setDim] = useState("gdp");
  const current = COMPONENTS.find((c) => c.id === dim) ?? COMPONENTS[1];
  const data = current.data ?? {};

  return (
    <div className="space-y-6">
      <DidacticNote />
      <DimensionSelector value={dim} onChange={setDim} />
      <StackedDecomposition dim={current} data={data} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ComponentColumn variant="direct" dim={current} data={data} />
        <ComponentColumn variant="indirect" dim={current} data={data} />
        <ComponentColumn variant="induced" dim={current} data={data} />
      </div>
      <ComponentsTakeaway data={data} />
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

function StackedDecomposition({ dim, data }) {
  const total = dim.id === "employment"
    ? (byPerimeter.region?.employment ?? 0)
    : (byPerimeter.region?.[dim.id] ?? 0);
  const direct = data?.direct ?? 0;
  const indirect = data?.indirect ?? 0;
  const induced = data?.induced ?? 0;
  const sum = direct + indirect + induced || 1;
  const pctD = (direct / sum) * 100;
  const pctI = (indirect / sum) * 100;
  const pctN = (induced / sum) * 100;

  return (
    <div className="border border-ink-100 bg-white p-5">
      <div className="flex items-end justify-between gap-4">
        <p className="text-sm font-medium text-ink-700">{dim.label} totale (perimetro regionale)</p>
        <p className="text-[28px] font-bold text-ink-900">{dim.isMoney ? fmtM(total) : fmtETP(total)}</p>
      </div>
      <div className="mt-4 h-12 overflow-hidden">
        <div className="flex h-12 w-full">
          <div className="bg-impact-direct" style={{ width: `${pctD}%` }} />
          <div className="bg-impact-indirect" style={{ width: `${pctI}%` }} />
          <div className="bg-impact-induced" style={{ width: `${pctN}%` }} />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
        <StackedLabel label="Diretto" value={direct} pct={pctD} isMoney={dim.isMoney} />
        <StackedLabel label="Indiretto" value={indirect} pct={pctI} isMoney={dim.isMoney} />
        <StackedLabel label="Indotto" value={induced} pct={pctN} isMoney={dim.isMoney} />
      </div>
    </div>
  );
}

function StackedLabel({ label, value, pct, isMoney }) {
  return (
    <div className="border border-ink-100 bg-bg-page p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-ink-900">{isMoney ? fmtM(value) : fmtETP(value)}</p>
      <p className="text-xs text-ink-500">{Math.round(pct)}% del totale</p>
    </div>
  );
}

function ComponentColumn({ variant, dim, data }) {
  const key = variant === "direct" ? "direct" : variant === "indirect" ? "indirect" : "induced";
  const accent = variant === "direct" ? "bg-impact-direct" : variant === "indirect" ? "bg-impact-indirect" : "bg-impact-induced";
  const value = data?.[key] ?? 0;
  const total = (data?.direct ?? 0) + (data?.indirect ?? 0) + (data?.induced ?? 0) || 1;
  const pct = Math.round((value / total) * 100);
  const items = (data?.top_sectors?.[key] ?? []).slice(0, 3);

  return (
    <div className="border border-ink-100 bg-white p-5">
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${accent}`} />
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">{variant}</h3>
      </div>
      <p className="mt-3 text-[28px] font-bold text-ink-900">{dim.isMoney ? fmtM(value) : fmtETP(value)}</p>
      <p className="mt-1 text-xs text-ink-500">{pct}% del totale</p>
      <div className="mt-4 h-px bg-ink-100" />
      <ul className="mt-4 space-y-2">
        {items.map((s, idx) => (
          <li key={`${variant}-${idx}`} className="flex items-center justify-between gap-3 text-xs">
            <span className="truncate text-ink-700">{idx + 1}. {s.name}</span>
            <span className="font-mono font-semibold text-ink-900">{dim.isMoney ? fmtM(s.value) : fmtETP(s.value)}</span>
          </li>
        ))}
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

function TabGeografia({ updateSearch, searchParams }) {
  const [dim, setDim] = useState(searchParams?.get("dim") ?? "gdp");
  const [mode, setMode] = useState(searchParams?.get("modal") ?? "assoluti");
  const [selectedRegion, setSelectedRegion] = useState(searchParams?.get("drill") ?? null);
  const regions = geo.regions ?? [];
  const selectedRegionInfo = regions.find((r) => r.nome === selectedRegion);
  const selectedNuts2 = selectedRegionInfo?.nuts2_code ?? (selectedRegion === regionName ? originNuts2 : null);
  const regionProvinces = selectedRegion
    ? (geo.provinces ?? []).filter((p) => p.regione === selectedRegion || p.region_name === selectedRegion)
    : [];
  const currentList = selectedRegion ? regionProvinces : regions;
  const fmt = getGeoFmt(dim, mode);
  const grandTotal = currentList.reduce((sum, item) => sum + getGeoValue(item, dim, mode), 0);
  const sorted = [...currentList].sort((a, b) => getGeoValue(b, dim, mode) - getGeoValue(a, dim, mode));
  const top10 = sorted.slice(0, 10);
  const rest = sorted.slice(10);
  const restTotal = rest.reduce((sum, item) => sum + getGeoValue(item, dim, mode), 0);

  const mapData = selectedRegion
    ? regionProvinces.map((p) => ({ ...p, valore: getGeoValue(p, dim, mode) }))
    : regions.map((r) => ({ ...r, valore: getGeoValue(r, dim, mode) }));

  const mapMax = Math.max(...mapData.map((r) => r.valore), 1);
  const mapPayload = selectedRegion
    ? regionProvinces.map((p) => ({
        provincia: p.nome,
        intensita: Math.sqrt(getGeoValue(p, dim, mode) / mapMax),
        hoverText: `${p.nome}: ${fmt(getGeoValue(p, dim, mode))}`,
      }))
    : regions.map((r) => ({
        regione: r.nome,
        intensita: Math.sqrt(getGeoValue(r, dim, mode) / mapMax),
        hoverText: `${r.nome}: ${fmt(getGeoValue(r, dim, mode))}`,
      }));

  useEffect(() => {
    updateSearch?.({
      dim: dim,
      modal: mode,
      drill: selectedRegion ? selectedRegion : null,
    });
  }, [dim, mode, selectedRegion, updateSearch]);

  useEffect(() => {
    setDim(searchParams?.get("dim") ?? "gdp");
    setMode(searchParams?.get("modal") ?? "assoluti");
    setSelectedRegion(searchParams?.get("drill") ?? null);
  }, [searchParams]);

  return (
    <div className="space-y-6">
      <div className="text-sm text-ink-700">
        L'investimento è localizzato in <strong>{originProvince}</strong>. Vediamo dove si distribuisce il valore attivato.
      </div>

      <GeoControls dim={dim} mode={mode} onDimChange={(next) => { setDim(next); setSelectedRegion(null); }} onModeChange={setMode} />

      <GeoBreadcrumb selectedRegion={selectedRegion} onBack={() => setSelectedRegion(null)} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <div className="border border-ink-100 bg-white">
          {selectedRegion ? (
            <ProvinceMap nuts2Code={selectedNuts2} data={mapPayload} minHeight={360} />
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
        {selectedRegion ? (
          <TerritoryList
            items={sorted}
            grandTotal={grandTotal}
            dim={dim}
            mode={mode}
            isProvince
            onSelect={() => {}}
          />
        ) : (
          <TerritoryList
            items={top10}
            grandTotal={grandTotal}
            dim={dim}
            mode={mode}
            restCount={rest.length}
            restTotal={restTotal}
            onSelect={(r) => setSelectedRegion(r.nome)}
          />
        )}
      </div>

      <div className="border border-ink-100 bg-bg-page p-4">
        <p className="text-sm italic leading-relaxed text-ink-700">
          Più scura la regione, maggiore il valore di {GEO_DIMS.find((g) => g.id === dim)?.label ?? dim} attivato.{" "}
          {mode === "pc"
            ? "In modalità pro-capite il valore è diviso per la popolazione di ciascun territorio."
            : "La spesa è fisicamente localizzata in " + originProvince + "; il colore mostra dove gli effetti si diffondono lungo le filiere produttive."}
        </p>
      </div>

      <ThreeAreaBand dim={dim} />
      <GeoTakeaway dim={dim} mode={mode} selectedRegion={selectedRegion} />
    </div>
  );
}

function GeoControls({ dim, mode, onDimChange, onModeChange }) {
  return (
    <div className="grid grid-cols-1 gap-3 rounded-md bg-bg-page p-4 md:grid-cols-2">
      <SegmentedGroup
        label="Dimensione"
        options={GEO_DIMS}
        value={dim}
        onChange={onDimChange}
      />
      <SegmentedGroup
        label="Modalità"
        options={GEO_MODES}
        value={mode}
        onChange={onModeChange}
      />
    </div>
  );
}

function GeoBreadcrumb({ selectedRegion, onBack }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <p className="font-medium text-ink-700">{selectedRegion ? `Italia › ${selectedRegion}` : "Italia"}</p>
      {selectedRegion && (
        <button onClick={onBack} className="inline-flex items-center gap-2 text-brand-violet hover:underline">
          <IconArrowLeft className="h-4 w-4" />
          Torna alla mappa nazionale
        </button>
      )}
    </div>
  );
}

function TerritoryList({ items, grandTotal, dim, mode, restCount = 0, restTotal = 0, isProvince = false, onSelect }) {
  const fmt = getGeoFmt(dim, mode);
  const label = isProvince ? "Province della regione" : "Top regioni per valore";

  return (
    <div className="border border-ink-100 bg-white">
      <div className="border-b border-ink-100 px-4 py-3">
        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-500">{label}</p>
      </div>
      <ul className="divide-y divide-ink-100">
        {items.map((item, idx) => {
          const value = getGeoValue(item, dim, mode);
          const pct = grandTotal > 0 ? Math.round((value / grandTotal) * 100) : 0;
          const name = item.nome ?? item.name;
          return (
            <li
              key={`${name}-${idx}`}
              onClick={() => onSelect(item)}
              className="flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-bg-page"
            >
              <span className="w-5 shrink-0 select-none font-mono text-[11px] text-ink-300">{idx + 1}</span>
              <span className="flex-1 truncate text-sm font-medium text-ink-900">{name}</span>
              <span className="shrink-0 font-mono text-xs font-semibold text-ink-900">{fmt(value)}</span>
              <span className="w-10 shrink-0 text-right text-[11px] text-ink-500">{pct}%</span>
            </li>
          );
        })}
        {!isProvince && restCount > 0 && (
          <li className="flex items-center gap-3 px-4 py-3">
            <span className="w-5 shrink-0 select-none font-mono text-[11px] text-ink-300">-</span>
            <span className="flex-1 text-sm font-semibold text-ink-700">Altre {restCount} regioni</span>
            <span className="shrink-0 font-mono text-xs font-semibold text-ink-900">{fmt(restTotal)}</span>
          </li>
        )}
        <li className="flex items-center gap-3 border-t-2 border-ink-100 px-4 py-3">
          <span className="w-5 shrink-0" />
          <span className="flex-1 text-sm font-bold text-ink-900">{isProvince ? "Totale regione" : "Totale Italia"}</span>
          <span className="shrink-0 font-mono text-xs font-bold text-ink-900">{fmt(grandTotal)}</span>
        </li>
      </ul>
    </div>
  );
}

function ThreeAreaBand({ dim }) {
  const total = byPerimeter.region?.[dim] ?? 0;
  const fmt = dim === "employment" ? fmtETP : fmtM;
  const areas = [
    { label: "Provincia origine", pct: rawGeo.macro_split?.origin?.pct ?? 0.46, color: "bg-impact-direct" },
    { label: "Resto regione", pct: rawGeo.macro_split?.rest_of_region?.pct ?? 0.38, color: "bg-impact-indirect" },
    { label: "Fuori regione", pct: rawGeo.macro_split?.extra_region?.pct ?? 0.16, color: "bg-impact-induced" },
  ].map((a) => ({ ...a, value: total * a.pct }));

  return (
    <div className="border border-ink-100 bg-white">
      <div className="grid grid-cols-3 divide-x divide-ink-100">
        {areas.map((a) => (
          <div key={a.label} className="p-4 text-center">
            <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-ink-500">{a.label}</p>
            <p className="mt-3 text-xl font-bold text-ink-900">{fmt(a.value)}</p>
            <p className="mt-2 text-xs text-ink-500">{toPercent(a.pct * 100)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function GeoTakeaway({ dim, mode, selectedRegion }) {
  const pct = Math.round(((rawGeo.macro_split?.origin?.pct ?? 0) + (rawGeo.macro_split?.rest_of_region?.pct ?? 0)) * 100);
  const text = selectedRegion
    ? `Il bordo lime evidenzia la provincia di origine della spesa. Il colore delle altre province mostra il valore di ${GEO_DIMS.find((g) => g.id === dim)?.label ?? dim} attivato dallo spillover regionale.`
    : mode === "pc"
      ? `In modalità pro-capite il valore è diviso per la popolazione di ciascun territorio, neutralizzando l'effetto delle dimensioni demografiche.`
      : `L'${pct}% del valore resta in ${regionName}; la differenza si attiva fuori regione lungo le filiere nazionali.`;
  return <TakeawayBanner text={text} />;
}

function TabSettori({ updateSearch, searchParams, onOpenExplore }) {
  const [dim, setDim] = useState(searchParams?.get("dim") ?? "gdp");
  const isMoney = dim !== "employment";
  const sorted = [...sectItems].sort((a, b) => sectorTotal(b, dim) - sectorTotal(a, dim));
  const top10 = sorted.slice(0, 10);

  useEffect(() => {
    updateSearch?.({ dim: dim });
  }, [dim, updateSearch]);

  useEffect(() => {
    setDim(searchParams?.get("dim") ?? "gdp");
  }, [searchParams]);

  return (
    <div className="space-y-6">
      <SegmentedGroup
        label="Dimensione"
        options={SECTOR_DIMS}
        value={dim}
        onChange={setDim}
      />
      <div className="border border-ink-100 bg-bg-page p-4">
        <p className="text-sm italic leading-relaxed text-ink-700">
          La vista settori si legge in tre passaggi: equilibrio intra/extra regione, composizione per componente e distribuzione geografica dei settori.
        </p>
      </div>

      <DivergentBarChart sectors={top10} dim={dim} isMoney={isMoney} />
      <SectorComponentStackedChart sectors={top10} dim={dim} isMoney={isMoney} />
      <SectorHeatmap
        dim={dim}
        isMoney={isMoney}
        onCellClick={(config) => onOpenExplore?.(config)}
      />
      <HeatmapLegend />
      <SettoriTakeaway dim={dim} />
    </div>
  );
}

function sectorTotal(s, dim) {
  const v = s.values?.[dim] ?? {};
  return (v.intra ?? 0) + (v.extra ?? 0);
}

function DivergentBarChart({ sectors, dim, isMoney }) {
  const [ready, setReady] = useState(false);
  const fmt = isMoney ? fmtM : fmtETP;
  const maxTotal = Math.max(...sectors.map((s) => sectorTotal(s, dim)), 1);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, [dim]);

  return (
    <div className="border border-ink-100 bg-white">
      <div className="border-b border-ink-100 px-4 py-3">
        <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-ink-500">Intra / extra regione</p>
        <p className="mt-1 text-sm text-ink-700">
          Per ogni settore, la barra confronta la quota che resta nella regione con quella attivata fuori regione.
        </p>
      </div>
      <div className="grid grid-cols-[160px_1fr_120px] gap-3 border-b border-ink-100 px-4 py-2 text-[10px] font-mono uppercase tracking-[0.16em] text-ink-500">
        <span />
        <div className="flex items-center">
          <span className="flex-1 text-right text-impact-leak">extra regione</span>
          <span className="mx-2 h-4 w-px bg-ink-300" />
          <span className="flex-1 text-left text-impact-retain">intra regione</span>
        </div>
        <span />
      </div>
      <ul className="divide-y divide-ink-100">
        {sectors.map((s) => {
          const intra = s.values?.[dim]?.intra ?? 0;
          const extra = s.values?.[dim]?.extra ?? 0;
          const total = intra + extra || 1;
          const intraPct = Math.round((intra / total) * 100);
          return (
            <li key={s.ateco_code} className="grid grid-cols-[160px_1fr_120px] items-center gap-3 px-4 py-3">
              <span className="truncate text-sm font-medium text-ink-900">{cleanText(s.ateco_name)}</span>
              <div className="flex items-center">
                <div className="flex-1 pr-0.5 text-right">
                  <div
                    className="ml-auto h-5 bg-impact-leak"
                    style={{
                      width: ready ? `${(extra / maxTotal) * 100}%` : "0%",
                      transition: "width .45s ease",
                    }}
                  />
                </div>
                <div className="h-7 w-px bg-ink-300" />
                <div className="flex-1 pl-0.5 text-left">
                  <div
                    className="h-5 bg-impact-retain"
                    style={{
                      width: ready ? `${(intra / maxTotal) * 100}%` : "0%",
                      transition: "width .45s ease",
                    }}
                  />
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-semibold text-ink-900">{fmt(total)}</div>
                <div className="text-[11px] text-ink-500">{intraPct}% intra</div>
              </div>
            </li>
          );
        })}
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

function SectorHeatmap({ dim, isMoney, onCellClick }) {
  const rowItems = [...sectItems]
    .sort((a, b) => sectorTotal(b, dim) - sectorTotal(a, dim))
    .slice(0, 10);
  const territories = [...geo.regions]
    .sort((a, b) => getGeoValue(b, dim, "assoluti") - getGeoValue(a, dim, "assoluti"))
    .slice(0, 10);
  const cells = rowItems.flatMap((sector) =>
    territories.map((territory) => {
      const sectorVal = sector.by_territory?.regions?.find((r) => r.code === territory.code)?.values?.[dim] ?? 0;
      return {
        sector,
        territory,
        value: sectorVal,
      };
    })
  );
  const max = Math.max(...cells.map((c) => c.value), 1);
  const fmt = isMoney ? fmtM : fmtETP;

  return (
    <div className="overflow-auto border border-ink-100 bg-white">
      <div className="min-w-[900px]">
        <div className="grid grid-cols-[160px_repeat(10,minmax(56px,1fr))] border-b border-ink-100 bg-bg-page text-[10px] font-mono uppercase tracking-[0.14em] text-ink-500">
          <div className="border-r border-ink-100 px-3 py-2">Settore</div>
          {territories.map((t) => (
            <div key={t.code} className="border-r border-ink-100 px-2 py-2 text-center last:border-r-0">
              {t.nome}
            </div>
          ))}
        </div>
        {rowItems.map((sector) => (
          <div key={sector.ateco_code} className="grid grid-cols-[160px_repeat(10,minmax(56px,1fr))] border-b border-ink-100">
            <div className="border-r border-ink-100 px-3 py-3 text-sm font-medium text-ink-900">{sector.ateco_name}</div>
            {territories.map((territory) => {
              const value = sector.by_territory?.regions?.find((r) => r.code === territory.code)?.values?.[dim] ?? 0;
              const pct = Math.round((value / max) * 100);
              const opacity = pct <= 5 ? 0.12 : pct <= 20 ? 0.28 : pct <= 40 ? 0.48 : pct <= 70 ? 0.72 : 1;
              return (
                <button
                  key={`${sector.ateco_code}-${territory.code}`}
                  onClick={() =>
                    onCellClick?.({
                      tab: "esplora",
                      dim,
                      asse: "geografica",
                      livello: /^\d+$/.test(String(territory.code)) ? "regionale" : "provinciale",
                      filter: "tutti",
                      focus: territory.code,
                    })
                  }
                  className="group border-r border-ink-100 px-2 py-2 last:border-r-0"
                  title={`${cleanText(sector.ateco_name)} x ${cleanText(territory.nome)}: ${fmt(value)}`}
                >
                  <div
                    className="h-8 w-full border border-ink-100"
                    style={{ backgroundColor: `rgba(91,33,247,${opacity})` }}
                  />
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
  return (
    <div className="border border-ink-100 bg-white p-4">
      <p className="text-sm text-ink-700">Legenda: da bianco a viola pieno secondo il valore della cella.</p>
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
  const initialFilter = searchParams.get("filter") ?? "tutti";
  const initialFocus = searchParams.get("focus") ?? "";
  const [dim, setDim] = useState(initialDim);
  const [axis, setAxis] = useState(initialAxis);
  const [level, setLevel] = useState(initialLevel);
  const [filter, setFilter] = useState(initialFilter);
  const [focus, setFocus] = useState(initialFocus);
  const [sortKey, setSortKey] = useState("value");
  const [sortDir, setSortDir] = useState("desc");

  useEffect(() => {
    updateSearch({ tab: "esplora", dim, asse: axis, livello: level, filter, focus });
  }, [dim, axis, level, filter, focus, updateSearch]);

  useEffect(() => {
    setDim(searchParams.get("dim") ?? "gdp");
    setAxis(searchParams.get("asse") ?? "geografica");
    setLevel(searchParams.get("livello") ?? "regionale");
    setFilter(searchParams.get("filter") ?? "tutti");
    setFocus(searchParams.get("focus") ?? "");
  }, [searchParams]);

  useEffect(() => {
    if (dim === "fiscal" && axis !== "totale") {
      setAxis("totale");
      setLevel("totale");
      setFilter("tutti");
      setFocus("");
    }
    if (dim === "spend" && axis !== "settoriale" && axis !== "totale") {
      setAxis("settoriale");
      setLevel("top10");
      setFilter("top10");
      setFocus("");
    }
    if ((dim === "income" || dim === "fiscal") && axis === "componente") {
      setAxis("totale");
      setLevel("totale");
      setFilter("tutti");
      setFocus("");
    }
  }, [dim, axis]);

  const rows = useMemo(() => buildExploreRows({ dim, axis, level, filter, focus }), [dim, axis, level, filter, focus]);
  const sortedRows = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      if (sortKey === "label") {
        return sortDir === "desc"
          ? String(b.label ?? "").localeCompare(String(a.label ?? ""))
          : String(a.label ?? "").localeCompare(String(b.label ?? ""));
      }
      if (sortKey === "component") {
        return sortDir === "desc"
          ? String(b.component ?? "").localeCompare(String(a.component ?? ""))
          : String(a.component ?? "").localeCompare(String(b.component ?? ""));
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
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const canUseGeo = dim !== "fiscal" && dim !== "spend";
  const canUseSector = dim !== "fiscal";
  const canUseComponent = dim !== "fiscal" && dim !== "income" && dim !== "spend";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 rounded-md bg-bg-page p-4 md:grid-cols-2 xl:grid-cols-3">
        <ExploreSelect
          label="1. Cosa vuoi trovare?"
          value={dim}
          onChange={(next) => {
            setDim(next);
            if (next === "fiscal") {
              setAxis("totale");
              setLevel("totale");
              setFilter("tutti");
              setFocus("");
            }
            if (next === "spend") {
              setAxis("settoriale");
              setLevel("top10");
              setFilter("top10");
              setFocus("");
            }
          }}
          options={EXPLORE_DIMS}
        />
        <ExploreSelect
          label="2. Territorio, settore, componente o totale?"
          value={axis}
          onChange={(next) => {
            setAxis(next);
            if (next === "totale") setLevel("totale");
            if (next === "componente") setLevel("totale");
            if (next === "settoriale") setLevel("regionale");
            if (next === "geografica") setLevel("regionale");
            setFocus("");
          }}
          options={[
            { id: "geografica", label: "Territorio", disabled: !canUseGeo },
            { id: "settoriale", label: "Settore", disabled: !canUseSector },
            { id: "componente", label: "Componente", disabled: !canUseComponent },
            { id: "totale", label: "Totale", disabled: false },
          ]}
        />
        {(axis === "geografica" || axis === "settoriale") && (
          <ExploreSelect
            label="3. Regione o provincia?"
            value={level}
            onChange={(next) => {
              setLevel(next);
              setFocus("");
            }}
            options={exploreLevelOptions(axis)}
          />
        )}
        {axis === "settoriale" && (
          <ExploreSelect
            label="4. Top 10 o tutti?"
            value={filter}
            onChange={setFilter}
            options={exploreFilterOptions(axis)}
          />
        )}
        {axis === "geografica" && (
          <ExploreSelect
            label="4. Territorio singolo"
            value={focus}
            onChange={setFocus}
            options={[
              { id: "", label: "Tutti i territori" },
              ...((level === "provinciale" ? geo.provinces : geo.regions).map((item) => ({ id: item.code, label: item.nome }))),
            ]}
          />
        )}
        {axis === "settoriale" && (
          <ExploreSelect
            label="4. Territorio singolo"
            value={focus}
            onChange={setFocus}
            options={[
              { id: "", label: "Tutti i territori" },
              ...(level === "provinciale"
                ? geo.provinces.map((item) => ({ id: item.code, label: item.nome }))
                : geo.regions.map((item) => ({ id: item.code, label: item.nome }))),
            ]}
          />
        )}
    </div>

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

      {axis === "geografica" && focus && <TerritoryImpactSummary territory={(level === "provinciale" ? geo.provinces : geo.regions).find((item) => item.code === focus)} />}
      {dim !== "spend" && <ComponentBreakdownPanel dim={dim} />}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_1fr]">
        <ExploreChart config={{ dim, axis, level, filter }} rows={sortedRows} meta={meta} onOpenExplore={onOpenExplore} />
        <ExploreTable axis={axis} rows={sortedRows} meta={meta} sortKey={sortKey} sortDir={sortDir} onSort={handleHeaderSort} />
      </div>
    </div>
  );
}

function buildExploreRows({ dim, axis, level, filter, focus }) {
  if (axis === "totale") {
    const value =
      dim === "fiscal"
        ? byPerimeter.national?.fiscal ?? 0
        : dim === "spend"
          ? inp.total_spend ?? 0
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
    if (dim === "spend") {
      const rows = (inp.spend_breakdown ?? []).map((item) => ({
        code: item.ateco_code,
        label: item.ateco_name,
        value: item.amount ?? 0,
        share: item.share ?? 0,
      }));
      const ordered = rows.sort((a, b) => b.value - a.value);
      return filter === "top10" ? ordered.slice(0, 10) : ordered;
    }
    const componentBySector = new Map();
    const source = comps[dim];
    if (source?.top_sectors) {
      ["direct", "indirect", "induced"].forEach((key) => {
        (source.top_sectors[key] ?? []).forEach((entry) => {
          if (!componentBySector.has(entry.name)) componentBySector.set(entry.name, key);
        });
      });
    }
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
        component: componentBySector.get(s.ateco_name) ?? null,
      };
    });
    return filter === "top10" ? rows.sort((a, b) => b.value - a.value).slice(0, 10) : rows.sort((a, b) => b.value - a.value);
  }

  const source = level === "provinciale" ? geo.provinces : geo.regions;
  let rows = source.map((item) => {
    const value = getGeoValue(item, dim, "assoluti");
    return {
      code: item.code,
      label: item.nome,
      value,
      region: item.regione ?? item.region_name ?? "",
      perCapita: getGeoValue(item, dim, "pc"),
    };
  });
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

function ExploreChart({ config, rows, meta, onOpenExplore }) {
  if (config.axis === "totale") {
    const first = rows[0];
    return (
      <div className="border border-ink-100 bg-white p-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-500">Numero singolo</p>
        <p className="mt-3 text-[34px] font-bold text-ink-900">{meta.isMoney ? fmtM(first?.value ?? 0) : fmtETP(first?.value ?? 0)}</p>
        <p className="mt-2 text-sm text-ink-700">Vista numero singolo senza tabella.</p>
      </div>
    );
  }

  if (config.axis === "geografica" && rows.length === 1) {
    const first = rows[0];
    return (
      <div className="border border-ink-100 bg-white p-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-500">{cleanText(first.label)}</p>
        <p className="mt-3 text-[34px] font-bold text-ink-900">{meta.isMoney ? fmtM(first.value) : fmtETP(first.value)}</p>
        <p className="mt-2 text-sm text-ink-700">Risultato singolo nel territorio selezionato.</p>
      </div>
    );
  }

  if (config.axis === "componente") {
    return (
      <div className="border border-ink-100 bg-white p-5">
        <div className="space-y-4">
          {rows.map((row) => (
            <div key={row.code}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-ink-900">{cleanText(row.label)}</span>
                <span className="font-mono text-xs font-semibold text-ink-900">{meta.isMoney ? fmtM(row.value) : fmtETP(row.value)}</span>
              </div>
              <div className="mt-2 h-3 bg-ink-100">
                <div className="h-3 bg-brand-violet" style={{ width: `${Math.min(100, Math.round((row.value / Math.max(...rows.map((r) => r.value), 1)) * 100))}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (config.axis === "settoriale") {
    if (config.dim === "spend") {
      const max = Math.max(...rows.map((r) => r.value), 1);
      return (
        <div className="border border-ink-100 bg-white p-5">
          <div className="space-y-4">
            {rows.map((row) => (
              <div key={row.code}>
                <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-ink-900">{cleanText(row.label)}</span>
                  <span className="font-mono text-xs font-semibold text-ink-900">{fmtM(row.value)}</span>
                </div>
                <div className="mt-2 h-3 bg-ink-100">
                  <div className="h-3 bg-brand-violet" style={{ width: `${Math.max(8, Math.round((row.value / max) * 100))}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className="border border-ink-100 bg-white p-5">
        <div className="space-y-4">
          <div className="border-b border-ink-100 pb-3">
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-500">Settori</p>
            <p className="mt-1 text-sm text-ink-700">
              Ogni riga mostra il totale del settore selezionato.
            </p>
          </div>
          {rows.slice(0, 10).map((row) => (
            <div key={row.code}>
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-sm font-medium text-ink-900">{cleanText(row.label)}</span>
                <span className="font-mono text-xs font-semibold text-ink-900">{meta.isMoney ? fmtM(row.value) : fmtETP(row.value)}</span>
              </div>
              <div className="mt-2 h-3 bg-ink-100">
                <div className="h-3 bg-brand-violet" style={{ width: `${Math.max(8, Math.round((row.value / Math.max(...rows.map((r) => r.value), 1)) * 100))}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-ink-100 bg-white p-5">
      <div className="grid grid-cols-1 gap-3">
        {rows.slice(0, 12).map((row) => (
          <button
            key={row.code}
            onClick={() => onOpenExplore?.({ tab: "esplora", dim: config.dim, asse: config.axis, livello: config.level, filter: config.filter, focus: row.code })}
            className="grid grid-cols-[minmax(120px,220px)_1fr_96px] items-center gap-3 border border-ink-100 px-4 py-3 text-left hover:bg-bg-page"
          >
            <span className="truncate text-xs font-medium text-ink-900">{cleanText(row.label)}</span>
            <div className="h-4 bg-ink-100">
              <div className="h-full bg-brand-violet" style={{ width: `${Math.min(100, Math.round((row.value / Math.max(...rows.map((r) => r.value), 1)) * 100))}%` }} />
            </div>
            <span className="text-right text-xs font-mono font-semibold text-ink-900">{meta.isMoney ? fmtM(row.value) : fmtETP(row.value)}</span>
          </button>
        ))}
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
          { key: "component", label: "Componente" },
          { key: "value", label: "Valore" },
          { key: "pct", label: "%" },
        ]
      : [
          { key: "label", label: "Voce" },
          { key: "value", label: "Valore" },
          { key: "pct", label: "%" },
        ];

  return (
    <div className="overflow-hidden border border-ink-100 bg-white">
      <div
        className={
          spendMode
            ? "sticky top-0 grid grid-cols-[1fr_120px_120px] gap-3 bg-bg-page px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-700"
            : axis === "settoriale"
              ? "sticky top-0 grid grid-cols-[1fr_120px_120px_80px] gap-3 bg-bg-page px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-700"
              : "sticky top-0 grid grid-cols-[1fr_120px_80px] gap-3 bg-bg-page px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-700"
        }
      >
        {headers.map((h) => (
          <button key={h.key} onClick={() => onSort(h.key)} className="text-left">
            {h.label} {sortKey === h.key ? (sortDir === "desc" ? "↓" : "↑") : ""}
          </button>
        ))}
      </div>
      <div className="max-h-[520px] divide-y divide-ink-100 overflow-y-auto">
        {rows.map((row) => (
          <div
            key={row.code}
            className={
              spendMode
                ? "grid grid-cols-[1fr_120px_120px] gap-3 px-4 py-3 text-sm"
                : axis === "settoriale"
                  ? "grid grid-cols-[1fr_120px_120px_80px] gap-3 px-4 py-3 text-sm"
                  : "grid grid-cols-[1fr_120px_80px] gap-3 px-4 py-3 text-sm"
            }
          >
            <span className="truncate font-medium text-ink-900">{row.label}</span>
            {spendMode ? (
              <span className="text-right font-mono text-xs font-semibold text-ink-900">{Math.round((row.share ?? 0) * 100)}%</span>
            ) : axis === "settoriale" && (
              <span className="inline-flex items-center">
                {row.component ? (
                  <span
                    className={[
                      "inline-flex items-center border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]",
                      row.component === "direct"
                        ? "border-impact-direct text-impact-direct"
                        : row.component === "indirect"
                          ? "border-impact-indirect text-impact-indirect"
                          : "border-impact-induced text-impact-induced",
                    ].join(" ")}
                  >
                    {row.component === "direct" ? "Diretto" : row.component === "indirect" ? "Indiretto" : "Indotto"}
                  </span>
                ) : (
                  <span className="text-xs text-ink-500">-</span>
                )}
              </span>
            )}
            <span className="text-right font-mono text-xs font-semibold text-ink-900">{meta.isMoney ? fmtM(row.value) : fmtETP(row.value)}</span>
            {!spendMode && <span className="text-right text-xs text-ink-500">{row.pct != null ? `${Math.round(row.pct)}%` : "-"}</span>}
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

