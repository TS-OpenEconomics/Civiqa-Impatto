import { useState, useRef, useEffect } from "react";
import staticResults from "../../mocks/eiaResults.json";
import { Badge } from "../ui/Badge";
import { ImpactIcon } from "../ui/ImpactIcon";
import { ItalyMap } from "../ui/ItalyMap";
import { IconDownload } from "../ui/Icons";
import { useToast } from "../../hooks/useToast";

// ── Formatters ────────────────────────────────────────────────────────────────

function fmtIT(n, dec = 0) {
  return new Intl.NumberFormat("it-IT", { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(n);
}
function fmtM(n)   { return `${fmtIT(n / 1_000_000, 1)} M€`; }
function fmtETP(n) { return `${fmtIT(n, n < 10 ? 1 : 0)} ETP`; }

// ── Static data derived once from mock ───────────────────────────────────────

const syn        = staticResults.synthesis  ?? {};
const inp        = staticResults.input      ?? {};
const macroSplit = staticResults.macro_split ?? {};
const comps      = staticResults.components  ?? {};
const geo        = staticResults.geography   ?? {};
const sectItems  = staticResults.sectors?.items ?? [];

const regionName     = inp.origin_region?.name ?? "Italia";
const pctIntraRegion = Math.round(((macroSplit.origin?.pct ?? 0.46) + (macroSplit.rest_of_region?.pct ?? 0.38)) * 100);
const nVoci          = inp.spend_breakdown?.length ?? 7;
const origineLabel   = inp.origin_provinces?.length > 1
  ? `${inp.origin_provinces.length} province di ${regionName}`
  : (inp.origin_provinces?.[0]?.name ?? regionName);
const directPctLabel = (() => {
  const g = comps.gdp;
  if (!g) return "45% diretto";
  const sum = g.direct + g.indirect + g.induced;
  return `${Math.round((g.direct / sum) * 100)}% diretto`;
})();
const topSectorLabel = (() => {
  if (!sectItems.length) return "Costruzioni leader";
  const top = [...sectItems].sort((a, b) => {
    const tA = (a.values?.gdp?.intra ?? 0) + (a.values?.gdp?.extra ?? 0);
    const tB = (b.values?.gdp?.intra ?? 0) + (b.values?.gdp?.extra ?? 0);
    return tB - tA;
  })[0];
  return `${top?.ateco_name?.split(" ")[0] ?? "Costruzioni"} leader`;
})();

// ── Tab definitions ────────────────────────────────────────────────────────────

const TABS = [
  { id: "sintesi",    label: "Sintesi",    preview: fmtM(syn.gdp?.total ?? 0) },
  { id: "componenti", label: "Componenti", preview: directPctLabel },
  { id: "geografia",  label: "Geografia",  preview: `${pctIntraRegion}% in regione` },
  { id: "settori",    label: "Settori",    preview: topSectorLabel },
];

// ── Effect card configs ───────────────────────────────────────────────────────

const EFFECTS = [
  {
    id: "produzione",
    icon: "produzione",
    label: "VALORE DELLA PRODUZIONE",
    getData: s => s.production,
    isMoney: true,
    getDescription: (region, s) => {
      const mult = s.production?.total && inp.total_spend
        ? fmtIT(s.production.total / inp.total_spend, 2) : "—";
      return `È il volume d'affari attivato lungo l'intera filiera dei fornitori che operano in ${region}: dai cantieri ai servizi, fino ai consumi a valle. ${mult}× il valore della spesa iniziale.`;
    },
  },
  {
    id: "pil",
    icon: "pil",
    label: "PIL (VALORE AGGIUNTO)",
    getData: s => s.gdp,
    isMoney: true,
    getDescription: (region, s) => {
      const mult = fmtIT(s.kpis?.gdp_multiplier ?? 1, 2);
      return `È il valore aggiunto trattenuto dall'economia di ${region}: la differenza tra fatturato e costi degli input, ovvero ciò che rimane per remunerare lavoratori, imprese e fisco. Per ogni euro speso, l'economia ne restituisce ${mult}.`;
    },
  },
  {
    id: "occupazione",
    icon: "occupazione",
    label: "OCCUPAZIONE",
    getData: s => s.employment,
    isMoney: false,
    getDescription: (region, s) => {
      const anni = inp.years_of_realization ?? 1;
      return `Sono i posti di lavoro equivalenti a tempo pieno generati in ${region} su tutta la filiera. Calcolati assumendo ${anni} ann${anni === 1 ? "o" : "i"} di realizzazione.`;
    },
  },
  {
    id: "redditi",
    icon: "redditi",
    label: "REDDITI DISTRIBUITI",
    getData: s => s.income,
    isMoney: true,
    getDescription: () => `È la quota di valore aggiunto che torna alle famiglie sotto forma di salari, profitti e rendite. Alimenta i consumi locali e contribuisce alla domanda interna.`,
  },
  {
    id: "gettito",
    icon: "gettito",
    label: "GETTITO FISCALE",
    getData: s => s.fiscal,
    isMoney: true,
    isNational: true,
    getDescription: () => `È il rientro fiscale complessivo (IVA, IRPEF, IRES, contributi) attivato dall'intervento. Valore nazionale: il gettito erariale confluisce al bilancio dello Stato e non è attribuibile a un singolo territorio.`,
  },
];

// ── KPI pill configs ──────────────────────────────────────────────────────────

const KPI_PILLS = [
  {
    getValue: s => `${fmtIT(s.kpis?.gdp_multiplier ?? 0, 2)}× per ogni € speso`,
    tooltip:  "Quanti euro di valore aggiunto si generano per ogni euro investito",
  },
  {
    getValue: s => `${fmtIT(s.kpis?.employment_intensity_per_meur ?? 0, 1)} posti / mln € speso`,
    tooltip:  "Posti di lavoro equivalenti a tempo pieno per milione di euro di spesa",
  },
  {
    getValue: s => `${Math.round((s.kpis?.fiscal_autofinanc_pct ?? 0) * 100)}% torna come gettito`,
    tooltip:  "Quota della spesa che rientra alle casse pubbliche come imposte e contributi",
  },
];

// ── Component dimensions config ───────────────────────────────────────────────

const COMP_DIMENSIONS = [
  {
    id: "production", label: "VALORE DELLA PRODUZIONE", icon: "produzione", isMoney: true,
    getData: () => comps.production, getTotal: () => syn.production?.total ?? 0,
  },
  {
    id: "gdp", label: "PIL (VALORE AGGIUNTO)", icon: "pil", isMoney: true,
    getData: () => comps.gdp, getTotal: () => syn.gdp?.total ?? 0,
  },
  {
    id: "employment", label: "OCCUPAZIONE", icon: "occupazione", isMoney: false,
    getData: () => comps.employment, getTotal: () => syn.employment?.total ?? 0,
  },
  {
    id: "income", label: "REDDITI DISTRIBUITI", icon: "redditi", isMoney: true,
    getData: () => comps.income, getTotal: () => syn.income?.total ?? 0,
  },
];

// ── Glossary content ──────────────────────────────────────────────────────────

const GLOSSARY = {
  sintesi: [
    { term: "PIL (valore aggiunto)",        def: "Il valore aggiunto è la ricchezza nuova che un'attività economica genera: la differenza tra quanto ha venduto e quanto ha dovuto acquistare per produrre. Il PIL è la somma di tutti i valori aggiunti." },
    { term: "Valore della produzione",      def: "Il volume d'affari totale attivato lungo la filiera. È più grande del PIL perché include anche il costo dei beni intermedi acquistati (materie prime, servizi intermedi)." },
    { term: "ETP (Equivalente a Tempo Pieno)", def: "Misura standard di occupazione: 1 ETP = 1 persona che lavora a tempo pieno per 1 anno. Se 2 persone lavorano metà tempo, generano 1 ETP." },
    { term: "Redditi distribuiti",          def: "La quota di valore aggiunto che torna alle famiglie sotto forma di salari e alle imprese sotto forma di profitti. Alimenta i consumi futuri e la domanda locale." },
    { term: "Gettito fiscale",              def: "Le imposte e i contributi (IVA, IRPEF, IRES, contributi previdenziali) che lo Stato incassa dall'attività economica attivata dal progetto." },
    { term: "Moltiplicatore",               def: "Quanti euro di effetto si generano per ogni euro speso. Un moltiplicatore PIL di 1,41 significa che 1 € di spesa pubblica genera 1,41 € di valore aggiunto nell'economia." },
  ],
  componenti: [
    { term: "Impatto diretto",   def: "L'effetto immediato della spesa sui settori che la ricevono. Es. l'impresa edile pagata per i lavori, l'albergo che ospita i visitatori." },
    { term: "Impatto indiretto", def: "L'effetto a cascata sui fornitori di chi riceve la spesa. Es. il produttore di cemento che rifornisce l'impresa edile, il fornitore di lenzuola dell'albergo." },
    { term: "Impatto indotto",   def: "L'effetto dei consumi dei lavoratori coinvolti. Gli stipendi pagati vengono spesi in negozi, affitti, servizi locali — generando una seconda ondata di attivazione economica." },
    { term: "Filiera produttiva",def: "L'insieme delle attività collegate per produrre un bene o servizio. Dall'estrazione delle materie prime fino alla consegna finale." },
    { term: "Spesa autonoma",    def: "La spesa iniziale del progetto — il punto di partenza. Prima che attivi qualsiasi effetto indiretto o indotto." },
  ],
  geografia: [
    { term: "Regione di origine",             def: "La regione in cui avviene fisicamente la spesa (i lavori, gli acquisti diretti)." },
    { term: "Spillover regionale",            def: "L'effetto che si diffonde dalle province di origine alle altre province della stessa regione, attraverso le filiere di subfornitura locali." },
    { term: "Dispersione extra-regionale",    def: "La parte del valore che si attiva in regioni diverse da quella di origine. Avviene perché alcuni fornitori — materiali, servizi specializzati — si trovano altrove in Italia." },
    { term: "Scala cromatica della mappa",    def: "Più scura la regione, maggiore il valore attivato. La scala usa la radice quadrata per rendere visibili anche le differenze tra regioni con valori minori." },
  ],
  settori: [
    { term: "Settore ATECO",              def: "La classificazione standard delle attività economiche in Italia. Costruzioni (F), commercio (G), trasporti (H), servizi professionali (M) sono alcune categorie ATECO." },
    { term: "Settore non delocalizzabile",def: "Un settore che deve produrre dove si trova il cliente: cantieri, sanità, ristoranti. Tendono a trattenere il valore nel territorio perché la produzione è fisica e locale." },
    { term: "Concentrazione geografica", def: "La tendenza di un settore a essere localizzato in poche aree del Paese. I servizi finanziari sono concentrati a Milano; l'immobiliare segue i grandi centri. Questo causa dispersione del valore." },
    { term: "Valore intra-regionale",    def: "La quota del valore attivato che rimane nella regione di origine della spesa." },
    { term: "Valore extra-regionale",    def: "La quota del valore che si attiva in altre regioni attraverso le filiere di subfornitura nazionali." },
  ],
};

// ── Main component ────────────────────────────────────────────────────────────

export function EiaResults({ project, eiaResults: rawResults, analysis, onBack }) {
  const [tab, setTab] = useState("sintesi");
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const { showToast } = useToast();
  const meta = staticResults.metadata;

  async function handleDownloadExcel() {
    try {
      const { utils, writeFile } = await import("xlsx");
      const wb = utils.book_new();
      const sheet = [
        ["Dimensione", "Totale", "Fuori regione", "Unità"],
        ["Valore della Produzione", syn.production?.total ?? "—", syn.production?.extra_regional ?? "—", "€"],
        ["PIL", syn.gdp?.total ?? "—", syn.gdp?.extra_regional ?? "—", "€"],
        ["Occupazione", syn.employment?.total ?? "—", syn.employment?.extra_regional ?? "—", "ETP"],
        ["Redditi", syn.income?.total ?? "—", "—", "€"],
        ["Gettito Fiscale", syn.fiscal?.total ?? "—", "Nazionale", "€"],
      ];
      utils.book_append_sheet(wb, utils.aoa_to_sheet(sheet), "Riepilogo");
      writeFile(wb, `EIA_${project.nome?.replace(/\s+/g, "_") ?? "progetto"}.xlsx`);
    } catch { showToast("Errore nel download Excel. Riprova.", "error"); }
  }

  return (
    <div className="min-h-full bg-bg-page">

      {/* Breadcrumb + meta */}
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
          <strong>{meta.creato_da}</strong> — Ultima modifica{" "}
          <span className="font-mono font-semibold">{analysis?.updatedAt ?? meta.ultima_modifica}</span>
        </p>

        {/* Dark banner */}
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
                    Diretti · Indiretti · Indotti
                  </span>
                </div>
                <p className="mt-2 text-sm text-white/80">
                  Del progetto <span className="font-medium text-white">{project.nome}</span>
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
                  Vista sintetica dei risultati economici, territoriali e occupazionali generati dall'investimento, con lettura per impatto diretto, indiretto e indotto.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm shrink-0">
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

          {/* Meta table */}
          <div className="grid grid-cols-1 border-t border-ink-100 bg-white text-sm md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ink-100">
            <MetaField label="Settore"     value={project.configurazione?.settore ?? meta.settore} />
            <MetaField label="Dataset"     value={meta.dataset} />
            <MetaField label="Metodologia" value={meta.metodologia} />
          </div>
        </div>
      </div>

      {/* Tab container */}
      <div className="px-4 pb-10 md:px-10">
        <div className="overflow-hidden bg-white border border-ink-100">

          {/* Tab bar */}
          <div className="flex overflow-x-auto border-b border-ink-100 px-4 md:px-6">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative px-4 py-3.5 text-sm whitespace-nowrap transition-colors ${
                  tab === t.id
                    ? "font-bold text-ink-900"
                    : "font-medium text-ink-700 hover:text-ink-900"
                }`}
              >
                {t.label}
                <span className={`ml-1.5 text-xs font-normal ${tab === t.id ? "text-ink-500" : "text-ink-300"}`}>
                  · {t.preview}
                </span>
                {tab === t.id && (
                  <span className="absolute left-0 right-0 -bottom-px h-[3px] bg-brand-violet" />
                )}
              </button>
            ))}
            <div className="ml-auto flex items-center shrink-0 py-2 pl-2 pr-1">
              <button
                onClick={() => setGlossaryOpen(o => !o)}
                title="Glossario termini"
                className={`flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-bold transition-colors select-none ${
                  glossaryOpen
                    ? "border-brand-violet bg-brand-violet text-white"
                    : "border-ink-300 text-ink-500 hover:border-brand-violet hover:text-brand-violet"
                }`}
              >
                ?
              </button>
            </div>
          </div>

          {/* Tab content */}
          <div key={tab} className="px-4 py-8 md:px-6 eia-fade-up" style={{ animationDuration: "320ms" }}>
            {tab === "sintesi" && <TabSintesi />}
            {tab === "componenti" && <TabComponenti />}
            {tab === "geografia" && <TabGeografia />}
            {tab === "settori" && <TabSettori />}
          </div>
        </div>
      </div>
      {glossaryOpen && (
        <GlossaryPopover tab={tab} onClose={() => setGlossaryOpen(false)} />
      )}
    </div>
  );
}

// ── Tab Sintesi ───────────────────────────────────────────────────────────────

function TabSintesi() {
  return (
    <div className="space-y-6">
      <SpendInputCard />
      <DidacticNote />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {EFFECTS.map((eff, i) => (
          <EffectCard key={eff.id} effect={eff} staggerIndex={i} />
        ))}
      </div>
      <KPIPillRow />
      <TakeawayBanner />
    </div>
  );
}

// ── Tab Componenti ────────────────────────────────────────────────────────────

function TabComponenti() {
  return (
    <div className="space-y-6">
      <ComponentsLegend />
      <div className="space-y-3">
        {COMP_DIMENSIONS.map(dim => (
          <DimensionRow key={dim.id} dim={dim} />
        ))}
      </div>
      <ComponentsTakeaway />
    </div>
  );
}

function ComponentsLegend() {
  const items = [
    { color: "bg-impact-direct",   label: "Diretto",   desc: "attivato direttamente dalla spesa" },
    { color: "bg-impact-indirect", label: "Indiretto", desc: "propagato lungo la filiera dei fornitori" },
    { color: "bg-impact-induced",  label: "Indotto",   desc: "generato dai consumi dei lavoratori" },
  ];
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-ink-700">
      {items.map(item => (
        <span key={item.label} className="flex items-center gap-1.5">
          <span className={`inline-block h-2.5 w-2.5 rounded-full ${item.color}`} />
          <span className="font-semibold">{item.label}</span>
          <span className="text-ink-400">— {item.desc}</span>
        </span>
      ))}
    </div>
  );
}

function DimensionRow({ dim }) {
  const [open, setOpen] = useState(false);
  const data  = dim.getData();
  const total = dim.getTotal();
  if (!data) return null;

  const { direct, indirect, induced } = data;
  const sum         = direct + indirect + induced;
  const pctDirect   = sum > 0 ? (direct   / sum) * 100 : 0;
  const pctIndirect = sum > 0 ? (indirect / sum) * 100 : 0;
  const pctInduced  = sum > 0 ? (induced  / sum) * 100 : 0;
  const totalFmt    = dim.isMoney ? fmtM(total) : fmtETP(total);

  return (
    <div className="border border-ink-100 bg-white overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full px-5 py-4 flex flex-col gap-3 text-left hover:bg-bg-page transition-colors"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ImpactIcon
              type={dim.icon}
              label={dim.label}
              className="h-4 w-4"
              wrapperClassName="flex h-5 w-5 shrink-0 items-center justify-center text-brand-violet"
            />
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-500">
              {dim.label}
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-sm font-bold font-mono text-ink-900">{totalFmt}</span>
            <svg
              className={`h-4 w-4 text-ink-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <StackedBar pctDirect={pctDirect} pctIndirect={pctIndirect} pctInduced={pctInduced} />
        <BarLabels pctDirect={pctDirect} pctIndirect={pctIndirect} pctInduced={pctInduced} />
      </button>
      <div
        className="overflow-hidden"
        style={{
          maxHeight: open ? 600 : 0,
          opacity: open ? 1 : 0,
          transition: "max-height 280ms cubic-bezier(0.4,0,0.2,1), opacity 180ms ease",
        }}
      >
        <ExpandedDetail data={data} isMoney={dim.isMoney} />
      </div>
    </div>
  );
}

function StackedBar({ pctDirect, pctIndirect, pctInduced }) {
  const [on, setOn] = useState(false);
  useEffect(() => { const id = requestAnimationFrame(() => setOn(true)); return () => cancelAnimationFrame(id); }, []);
  const trx = "width 0.55s cubic-bezier(0.16,1,0.3,1)";
  return (
    <div className="h-5 w-full flex overflow-hidden">
      <div className="h-full bg-impact-direct"   style={{ width: on ? `${pctDirect}%`   : "0%", transition: trx }} />
      <div className="h-full bg-impact-indirect" style={{ width: on ? `${pctIndirect}%` : "0%", transition: trx, transitionDelay: "60ms" }} />
      <div className="h-full bg-impact-induced"  style={{ width: on ? `${pctInduced}%`  : "0%", transition: trx, transitionDelay: "120ms" }} />
    </div>
  );
}

function BarLabels({ pctDirect, pctIndirect, pctInduced }) {
  return (
    <div className="flex text-[11px] font-mono">
      <span className="overflow-hidden text-brand-violet font-semibold" style={{ width: `${pctDirect}%` }}>
        {pctDirect > 8 ? `${Math.round(pctDirect)}%` : ""}
      </span>
      <span className="overflow-hidden text-ink-500 font-semibold" style={{ width: `${pctIndirect}%` }}>
        {pctIndirect > 8 ? `${Math.round(pctIndirect)}%` : ""}
      </span>
      <span className="overflow-hidden text-ink-400 font-semibold" style={{ width: `${pctInduced}%` }}>
        {pctInduced > 8 ? `${Math.round(pctInduced)}%` : ""}
      </span>
    </div>
  );
}

function ExpandedDetail({ data, isMoney }) {
  const fmt = v => isMoney ? fmtM(v) : fmtETP(v);
  const segments = [
    { key: "direct",   label: "Diretto",   dotColor: "bg-impact-direct",   textColor: "text-brand-violet", value: data.direct   },
    { key: "indirect", label: "Indiretto", dotColor: "bg-impact-indirect", textColor: "text-ink-500",      value: data.indirect },
    { key: "induced",  label: "Indotto",   dotColor: "bg-impact-induced",  textColor: "text-ink-400",      value: data.induced  },
  ];

  return (
    <div className="border-t border-ink-100 px-5 py-5 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ink-100 gap-0">
      {segments.map(seg => {
        const topSectors = data.top_sectors?.[seg.key] ?? [];
        return (
          <div key={seg.key} className="py-4 md:py-0 md:px-5 first:pt-0 last:pb-0 md:first:pl-0 md:last:pr-0">
            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-block h-2 w-2 rounded-full ${seg.dotColor}`} />
              <span className={`text-[10px] font-mono uppercase tracking-[0.18em] font-semibold ${seg.textColor}`}>
                {seg.label}
              </span>
              <span className="ml-auto text-xs font-bold font-mono text-ink-900">{fmt(seg.value)}</span>
            </div>
            <div className="h-px bg-ink-100 mb-3" />
            <ul className="space-y-2">
              {topSectors.map((s, i) => (
                <li key={i} className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-ink-600 truncate">{s.name}</span>
                  <span className="font-mono font-semibold text-ink-900 shrink-0">{fmt(s.value)}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function ComponentsTakeaway() {
  const g = comps.gdp;
  if (!g) return null;
  const sum         = g.direct + g.indirect + g.induced;
  const direttoPct  = Math.round((g.direct   / sum) * 100);
  const indirectPct = Math.round((g.indirect / sum) * 100);
  const indottoPct  = Math.round((g.induced  / sum) * 100);

  let text;
  if (indottoPct > 35) {
    text = `Il ${indottoPct}% dell'impatto sul PIL è indotto: la spesa innesca una catena di consumi che amplifica significativamente il ritorno economico sul territorio.`;
  } else if (direttoPct > 55) {
    text = `Il ${direttoPct}% del PIL attivato è effetto diretto della spesa: l'impatto è concentrato nelle imprese che realizzano il progetto e nelle filiere di primo livello.`;
  } else {
    text = `La struttura degli impatti è bilanciata: ${direttoPct}% diretto, ${indirectPct}% indiretto, ${indottoPct}% indotto. La spesa si propaga in modo articolato lungo l'economia del territorio.`;
  }

  return (
    <div className="border-l-[3px] border-accent-lime bg-bg-page px-6 py-5">
      <p className="text-sm font-semibold text-ink-900">{text}</p>
    </div>
  );
}

// ── Tab Geografia ─────────────────────────────────────────────────────────────

const GEO_DIMS = [
  { id: "gdp",        label: "PIL",       synKey: "gdp" },
  { id: "production", label: "Produzione",synKey: "production" },
  { id: "employment", label: "Occupazione",synKey:"employment" },
];

function TabGeografia() {
  const [dim, setDim] = useState("gdp");
  const [selectedRegion, setSelectedRegion] = useState(null);

  const regions   = geo.regions ?? [];
  const isMoney   = dim !== "employment";
  const fmt       = v => isMoney ? fmtM(v) : fmtETP(v);
  const dimLabel  = GEO_DIMS.find(d => d.id === dim)?.label ?? dim;

  const maxVal  = Math.max(...regions.map(r => r[dim] ?? 0), 1);
  const mapData = regions.map(r => {
    const val = r[dim] ?? 0;
    return {
      regione:   r.regione,
      intensita: Math.sqrt(val / maxVal),
      hoverText: `${r.regione}: ${fmt(val)}`,
    };
  });

  const sorted      = [...regions].sort((a, b) => (b[dim] ?? 0) - (a[dim] ?? 0));
  const top10       = sorted.slice(0, 10);
  const others      = sorted.slice(10);
  const othersTotal = others.reduce((s, r) => s + (r[dim] ?? 0), 0);
  const grandTotal  = regions.reduce((s, r) => s + (r[dim] ?? 0), 0);

  return (
    <div className="space-y-6">
      <p className="text-sm text-ink-700">
        L'investimento è localizzato in <strong>{origineLabel}</strong>. Vediamo dove si distribuisce{" "}
        il <strong>{fmt(grandTotal)}</strong> di {dimLabel} attivato sul territorio.
      </p>

      <GeoControls dim={dim} onDimChange={d => { setDim(d); setSelectedRegion(null); }} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 items-start">
        <div className="border border-ink-100 bg-white overflow-hidden">
          <ItalyMap
            data={mapData}
            tone="violet"
            onRegionClick={r => setSelectedRegion(prev => prev === r ? null : r)}
            selectedRegion={selectedRegion}
            minHeight={360}
          />
        </div>
        <RegionList
          top10={top10}
          othersCount={others.length}
          othersTotal={othersTotal}
          grandTotal={grandTotal}
          dim={dim}
          isMoney={isMoney}
          selectedRegion={selectedRegion}
          onSelect={r => setSelectedRegion(prev => prev === r ? null : r)}
        />
      </div>

      <div className="border border-ink-100 bg-bg-page px-4 py-4">
        <p className="text-xs italic text-ink-500 leading-relaxed">
          Più scura la regione, maggiore il valore di <strong className="not-italic">{dimLabel}</strong> attivato.
          La spesa è fisicamente localizzata in <strong className="not-italic">{origineLabel}</strong>;
          il colore mostra dove i suoi effetti si diffondono lungo le filiere produttive.
        </p>
      </div>

      <MacroAreaBand dim={dim} />
      <GeoTakeaway />
    </div>
  );
}

function GeoControls({ dim, onDimChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {GEO_DIMS.map(o => (
        <button
          key={o.id}
          onClick={() => onDimChange(o.id)}
          className={`px-4 py-2 text-sm font-semibold border transition-colors ${
            dim === o.id
              ? "bg-brand-violet text-white border-brand-violet"
              : "border-ink-300 text-ink-700 hover:border-brand-violet hover:text-brand-violet"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function RegionList({ top10, othersCount, othersTotal, grandTotal, dim, isMoney, selectedRegion, onSelect }) {
  const fmt = v => isMoney ? fmtM(v) : fmtETP(v);
  return (
    <div className="border border-ink-100 bg-white overflow-auto" style={{ maxHeight: 396 }}>
      <div className="sticky top-0 px-4 py-3 border-b border-ink-100 bg-white">
        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-500">Top regioni per valore</p>
      </div>
      <ul className="divide-y divide-ink-100">
        {top10.map((r, i) => {
          const val = r[dim] ?? 0;
          const pct = grandTotal > 0 ? Math.round((val / grandTotal) * 100) : 0;
          const sel = r.regione === selectedRegion;
          return (
            <li
              key={r.regione}
              onClick={() => onSelect(r.regione)}
              className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                sel ? "border-l-[3px] border-accent-lime bg-bg-page" : "hover:bg-bg-page"
              }`}
            >
              <span className="text-[11px] font-mono text-ink-300 w-4 shrink-0 select-none">{i + 1}</span>
              <span className="text-xs font-medium text-ink-900 flex-1 truncate">{r.regione}</span>
              <span className="text-xs font-mono font-semibold text-ink-900 shrink-0">{fmt(val)}</span>
              <span className="text-[11px] text-ink-400 shrink-0 w-7 text-right">{pct}%</span>
            </li>
          );
        })}
        {othersCount > 0 && (
          <li className="flex items-center gap-3 px-4 py-2.5">
            <span className="text-[11px] font-mono text-ink-300 w-4 shrink-0">—</span>
            <span className="text-xs font-semibold text-ink-600 flex-1">Altre {othersCount} regioni</span>
            <span className="text-xs font-mono font-semibold text-ink-600 shrink-0">{fmt(othersTotal)}</span>
          </li>
        )}
        <li className="flex items-center gap-3 px-4 py-2.5 border-t-2 border-ink-200">
          <span className="w-4 shrink-0" />
          <span className="text-xs font-bold text-ink-900 flex-1">Totale Italia</span>
          <span className="text-xs font-mono font-bold text-ink-900 shrink-0">{fmt(grandTotal)}</span>
        </li>
      </ul>
    </div>
  );
}

function MacroAreaBand({ dim }) {
  const isMoney = dim !== "employment";
  const fmt     = v => isMoney ? fmtM(v) : fmtETP(v);
  const synData = { gdp: syn.gdp, production: syn.production, employment: syn.employment }[dim] ?? {};
  const total   = synData.total ?? 0;

  const areas = [
    { label: "PROVINCIA DI ORIGINE",  pct: macroSplit.origin?.pct          ?? 0.46 },
    { label: "RESTO DELLA REGIONE",   pct: macroSplit.rest_of_region?.pct  ?? 0.38 },
    { label: "FUORI REGIONE",         pct: macroSplit.extra_region?.pct    ?? 0.16 },
  ].map(a => ({ ...a, value: Math.round(total * a.pct), pctLabel: Math.round(a.pct * 100) }));

  return (
    <div className="border border-ink-100 bg-white">
      <div className="px-4 py-3 border-b border-ink-100">
        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-500">
          Distribuzione per macro-area
        </p>
      </div>
      <div className="grid grid-cols-3 divide-x divide-ink-100">
        {areas.map(a => (
          <div key={a.label} className="px-4 py-5 text-center">
            <p className="text-[10px] font-mono uppercase tracking-[0.13em] text-ink-400 mb-3 leading-tight">
              {a.label}
            </p>
            <p className="text-xl font-bold font-mono text-ink-900">{fmt(a.value)}</p>
            <span className="mt-2 inline-flex rounded-full bg-accent-lime px-3 py-0.5 text-[11px] font-semibold text-ink-900">
              {a.pctLabel}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GeoTakeaway() {
  const pct = pctIntraRegion;
  const text = pct >= 80
    ? `L'${pct}% del valore generato resta in ${regionName}: la spesa è ancorata al territorio.`
    : pct >= 60
      ? `L'${pct}% del valore resta in ${regionName}; il restante ${100 - pct}% si attiva in altre regioni del Paese.`
      : `Solo l'${pct}% del valore resta in ${regionName}: una quota rilevante si attiva altrove attraverso le filiere nazionali.`;

  return (
    <div className="border-l-[3px] border-accent-lime bg-bg-page px-6 py-5">
      <p className="text-sm font-semibold text-ink-900">{text}</p>
    </div>
  );
}

// ── Tab Settori ───────────────────────────────────────────────────────────────

function TabSettori() {
  const [dim, setDim] = useState("gdp");
  const isMoney = dim !== "employment";

  const sorted = [...sectItems].sort((a, b) => {
    const tA = (a.values?.[dim]?.intra ?? 0) + (a.values?.[dim]?.extra ?? 0);
    const tB = (b.values?.[dim]?.intra ?? 0) + (b.values?.[dim]?.extra ?? 0);
    return tB - tA;
  });
  const top10      = sorted.slice(0, 10);
  const grandTotal = sectItems.reduce((s, r) => s + (r.values?.[dim]?.intra ?? 0) + (r.values?.[dim]?.extra ?? 0), 0);
  const threshold  = grandTotal * 0.02;
  const eligible   = sectItems.filter(s => (s.values?.[dim]?.intra ?? 0) + (s.values?.[dim]?.extra ?? 0) >= threshold);

  const topIntra = [...eligible].sort((a, b) => {
    const tA = (a.values?.[dim]?.intra ?? 0) + (a.values?.[dim]?.extra ?? 0);
    const tB = (b.values?.[dim]?.intra ?? 0) + (b.values?.[dim]?.extra ?? 0);
    return (tB > 0 ? (b.values?.[dim]?.intra ?? 0) / tB : 0) - (tA > 0 ? (a.values?.[dim]?.intra ?? 0) / tA : 0);
  }).slice(0, 3);

  const topExtra = [...eligible].sort((a, b) => {
    const tA = (a.values?.[dim]?.intra ?? 0) + (a.values?.[dim]?.extra ?? 0);
    const tB = (b.values?.[dim]?.intra ?? 0) + (b.values?.[dim]?.extra ?? 0);
    return (tB > 0 ? (b.values?.[dim]?.extra ?? 0) / tB : 0) - (tA > 0 ? (a.values?.[dim]?.extra ?? 0) / tA : 0);
  }).slice(0, 3);

  return (
    <div className="space-y-6">
      <p className="text-sm text-ink-700">
        Vediamo in quali settori si concentra il valore attivato dalla spesa, e quali catturano
        l'effetto sul territorio di <strong>{origineLabel}</strong> rispetto a quelli che lo
        disperdono fuori regione.
      </p>

      <GeoControls dim={dim} onDimChange={setDim} />

      <div className="border border-ink-100 bg-bg-page px-4 py-4">
        <p className="text-xs italic text-ink-500 leading-relaxed">
          Ogni barra è un settore. La parte{" "}
          <span className="font-semibold not-italic text-impact-leak">arancione a sinistra</span>{" "}
          mostra il valore che si attiva fuori regione; la parte{" "}
          <span className="font-semibold not-italic text-impact-retain">verde a destra</span>{" "}
          mostra il valore che resta in {regionName}.
        </p>
      </div>

      <DivergentBarChart sectors={top10} dim={dim} isMoney={isMoney} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectorInsightCard
          variant="intra" sectors={topIntra} dim={dim} isMoney={isMoney}
          label="Trattiene di più sul territorio"
        />
        <SectorInsightCard
          variant="extra" sectors={topExtra} dim={dim} isMoney={isMoney}
          label="Disperde di più fuori regione"
        />
      </div>

      <SettoriTakeaway topIntra={topIntra} topExtra={topExtra} />
    </div>
  );
}

function DivergentBarChart({ sectors, dim, isMoney }) {
  const [on, setOn] = useState(false);
  useEffect(() => { const id = requestAnimationFrame(() => setOn(true)); return () => cancelAnimationFrame(id); }, []);

  const fmt      = v => isMoney ? fmtM(v) : fmtETP(v);
  const maxTotal = Math.max(...sectors.map(s => (s.values?.[dim]?.intra ?? 0) + (s.values?.[dim]?.extra ?? 0)), 1);
  const COL      = "clamp(72px, 28%, 130px) 1fr 80px";

  return (
    <div className="border border-ink-100 bg-white overflow-hidden">
      {/* Scale header */}
      <div className="grid items-center gap-2 px-4 py-2.5 border-b border-ink-100" style={{ gridTemplateColumns: COL }}>
        <span />
        <div className="flex items-center min-w-0">
          <div className="flex-1 text-right pr-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-impact-leak">← Fuori</span>
          </div>
          <div className="w-px h-4 bg-ink-300 shrink-0" />
          <div className="flex-1 text-left pl-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-impact-retain">In regione →</span>
          </div>
        </div>
        <span />
      </div>

      <ul className="divide-y divide-ink-100">
        {sectors.map((s, i) => {
          const { intra = 0, extra = 0 } = s.values?.[dim] ?? {};
          const total    = intra + extra;
          const intraPct = total > 0 ? Math.round((intra / total) * 100) : 0;
          const delay    = `${i * 35}ms`;
          const trx      = `width 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}`;
          return (
            <li key={s.ateco_code} className="grid items-center gap-2 px-4 py-3" style={{ gridTemplateColumns: COL }}>
              <span className="text-xs font-medium text-ink-900 truncate">{s.ateco_name}</span>
              <div className="flex items-center min-w-0">
                <div className="flex-1 flex justify-end pr-0.5">
                  <div
                    className="h-5 bg-impact-leak"
                    style={{ width: on ? `${(extra / maxTotal) * 100}%` : "0%", transition: trx, borderRadius: "2px 0 0 2px" }}
                  />
                </div>
                <div className="w-px h-6 bg-ink-300 shrink-0" />
                <div className="flex-1 flex justify-start pl-0.5">
                  <div
                    className="h-5 bg-impact-retain"
                    style={{ width: on ? `${(intra / maxTotal) * 100}%` : "0%", transition: trx, borderRadius: "0 2px 2px 0" }}
                  />
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-mono font-semibold text-ink-900">{fmt(total)}</span>
                <span className="ml-1 text-[11px] text-ink-400">{intraPct}%</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SectorInsightCard({ variant, sectors, dim, isMoney, label }) {
  const isIntra     = variant === "intra";
  const fmt         = v => isMoney ? fmtM(v) : fmtETP(v);
  const accentColor = isIntra ? "#1F8C4A" : "#C45A2E";

  return (
    <div
      className="border border-ink-100 bg-white overflow-hidden"
      style={{ borderLeftWidth: 4, borderLeftColor: accentColor }}
    >
      <div className="px-5 py-4">
        <p className="text-[10px] font-mono uppercase tracking-[0.18em] mb-4" style={{ color: accentColor }}>
          {label}
        </p>
        <ul className="space-y-4">
          {sectors.map(s => {
            const v      = s.values?.[dim] ?? {};
            const total  = (v.intra ?? 0) + (v.extra ?? 0);
            const target = isIntra ? (v.intra ?? 0) : (v.extra ?? 0);
            const pct    = total > 0 ? Math.round((target / total) * 100) : 0;
            return (
              <li key={s.ateco_code} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-ink-900 truncate">{s.ateco_name}</span>
                  <span className="text-xs font-mono font-bold text-ink-900 shrink-0">{pct}%</span>
                </div>
                <div className="h-1.5 w-full bg-ink-100 overflow-hidden rounded-full">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: accentColor }} />
                </div>
                <span className="text-[11px] text-ink-400">{fmt(target)}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function SettoriTakeaway({ topIntra, topExtra }) {
  const topIntraName = topIntra[0]?.ateco_name ?? "";
  const topExtraName = topExtra[0]?.ateco_name ?? "";
  const LOCAL_KW    = ["Costruzioni", "Sanità", "Commercio", "Trasporti"];
  const DISPERS_KW  = ["Immobiliare", "Finanziari", "Energia", "Materiali"];

  const parts = [];
  if (LOCAL_KW.some(kw => topIntraName.includes(kw))) {
    parts.push("I settori che catturano più valore sul territorio sono quelli legati alla presenza fisica: cantieri, servizi locali, commercio. Sono attività non delocalizzabili.");
  }
  if (DISPERS_KW.some(kw => topExtraName.includes(kw))) {
    parts.push(`Una parte della dispersione si concentra su ${topExtraName.toLowerCase()} e filiere concentrate in pochi poli nazionali: è un pattern strutturale dell'economia italiana.`);
  }
  const text = parts.length > 0
    ? parts.join(" ")
    : "Il valore attivato si distribuisce tra settori con diversi gradi di radicamento territoriale: quelli legati alla presenza fisica trattengono la quota maggiore, mentre quelli con filiere nazionali disperdono parte dell'effetto.";

  return (
    <div className="border-l-[3px] border-accent-lime bg-bg-page px-6 py-5">
      <p className="text-sm font-semibold text-ink-900">{text}</p>
    </div>
  );
}

// ── SpendInputCard ─────────────────────────────────────────────────────────────

function SpendInputCard() {
  const totalSpend = inp.total_spend ?? 0;
  const isMulti    = (inp.origin_provinces?.length ?? 0) > 1;

  return (
    <div className="bg-ink-900 px-6 py-6 text-white">
      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50">
        Spesa totale investita
      </p>
      <p className="mt-3 text-4xl font-bold font-mono tracking-tight">
        {fmtM(totalSpend)}
      </p>
      <p className="mt-3 text-sm text-white/70 max-w-xl">
        L'investimento di partenza, distribuito su{" "}
        <span className="text-white font-medium">{nVoci} voci di spesa</span>{" "}
        {isMulti ? "nelle province di" : "nella provincia di"}{" "}
        <span className="text-white font-medium">{origineLabel}</span>.
      </p>
      {isMulti && (
        <div className="mt-3 flex flex-wrap gap-2">
          {inp.origin_provinces.map(p => (
            <span key={p.code} className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 text-xs font-mono">
              {p.name}
              <span className="text-white/50">{Math.round(p.spend_share * 100)}%</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── DidacticNote ──────────────────────────────────────────────────────────────

function DidacticNote() {
  return (
    <div className="flex items-start gap-3 border border-ink-100 bg-bg-page px-4 py-4">
      <svg
        className="mt-0.5 h-4 w-4 shrink-0 text-ink-400"
        fill="none" stroke="currentColor" strokeWidth={2}
        strokeLinecap="round" strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="8.01" />
        <path d="M12 12v4" />
      </svg>
      <p className="text-sm leading-relaxed text-ink-700">
        I cinque effetti qui sotto <strong>non sono passaggi in sequenza</strong>. Sono cinque modi diversi di misurare la stessa attivazione economica generata dalla spesa: PIL, valore della produzione, occupazione, redditi e gettito si attivano insieme, non uno dopo l'altro.
      </p>
    </div>
  );
}

// ── EffectCard ────────────────────────────────────────────────────────────────

function EffectCard({ effect, staggerIndex }) {
  const data          = effect.getData(syn);
  const total         = data?.total ?? 0;
  const extraRegional = data?.extra_regional ?? null;
  const isNational    = effect.isNational || data?.geographic_split === false;

  const mainValue  = effect.isMoney ? fmtM(total) : fmtETP(total);
  const extraValue = extraRegional != null
    ? (effect.isMoney ? fmtM(extraRegional) : fmtETP(extraRegional))
    : null;
  const description = effect.getDescription(regionName, syn);

  return (
    <div
      className="eia-fade-up border border-ink-100 bg-white p-5 flex flex-col gap-4"
      style={{ animationDelay: `${staggerIndex * 80}ms`, animationFillMode: "both" }}
    >
      <div className="flex items-center gap-2">
        <ImpactIcon
          type={effect.icon}
          label={effect.label}
          className="h-5 w-5"
          wrapperClassName="flex h-6 w-6 shrink-0 items-center justify-center text-brand-violet"
        />
        <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-500">
          {effect.label}
        </span>
      </div>

      <div>
        <p className="text-3xl font-bold font-mono tracking-tight text-ink-900">{mainValue}</p>
        {isNational ? (
          <p className="mt-1 text-[11px] text-ink-400 italic">* Valore nazionale</p>
        ) : extraValue != null ? (
          <p className="mt-1 text-[11px] font-mono text-ink-500">
            +{extraValue} fuori regione
          </p>
        ) : null}
      </div>

      <div className="h-px bg-ink-100" />

      <p className="text-xs leading-relaxed text-ink-600">{description}</p>
    </div>
  );
}

// ── KPIPillRow ────────────────────────────────────────────────────────────────

function KPIPillRow() {
  return (
    <div className="flex flex-wrap gap-3">
      {KPI_PILLS.map((pill, i) => (
        <KPIPill key={i} label={pill.getValue(syn)} tooltip={pill.tooltip} />
      ))}
    </div>
  );
}

function KPIPill({ label, tooltip }) {
  const [visible, setVisible] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <span className="inline-flex cursor-default select-none items-center rounded-full border border-ink-300 px-4 py-2 text-sm font-semibold text-ink-700">
        {label}
      </span>
      {visible && (
        <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-52 -translate-x-1/2 bg-ink-900 px-3 py-2 text-center text-xs leading-snug text-white">
          {tooltip}
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-ink-900" />
        </div>
      )}
    </div>
  );
}

// ── TakeawayBanner ────────────────────────────────────────────────────────────

function TakeawayBanner() {
  let text;
  if (pctIntraRegion >= 70) {
    text = `L'${pctIntraRegion}% del valore aggiunto attivato resta in ${regionName}. La spesa è fortemente ancorata al territorio.`;
  } else if (pctIntraRegion >= 40) {
    text = `Il ${pctIntraRegion}% del valore aggiunto resta in ${regionName}, il restante ${100 - pctIntraRegion}% si attiva in altre regioni attraverso le filiere di subfornitura.`;
  } else {
    text = `Solo il ${pctIntraRegion}% del valore aggiunto resta in ${regionName}: la struttura della filiera porta gran parte degli effetti fuori dal territorio di spesa.`;
  }

  return (
    <div className="border-l-[3px] border-accent-lime bg-bg-page px-6 py-5">
      <p className="text-sm font-semibold text-ink-900">{text}</p>
    </div>
  );
}

// ── MetaField ─────────────────────────────────────────────────────────────────

function MetaField({ label, value }) {
  return (
    <div className="px-6 py-4 md:px-8">
      <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-ink-500">{label}</p>
      <p className="mt-2 text-sm font-medium text-ink-900">{value}</p>
    </div>
  );
}

// ── GlossaryPopover ───────────────────────────────────────────────────────────

function GlossaryPopover({ tab, onClose }) {
  const ref     = useRef(null);
  const entries = GLOSSARY[tab] ?? [];

  useEffect(() => {
    function handleKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    // Delay one tick so the opening click doesn't immediately close the popover
    const id = setTimeout(() => document.addEventListener("mousedown", handleClick), 0);
    return () => { clearTimeout(id); document.removeEventListener("mousedown", handleClick); };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="fixed right-0 top-0 bottom-0 z-50 flex flex-col bg-white border-l border-ink-100 eia-slide-right"
      style={{ width: 320, boxShadow: "-4px 0 24px rgba(0,0,0,0.08)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100 bg-ink-900 shrink-0">
        <p className="text-sm font-bold text-white">Come si legge</p>
        <button
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center text-white/60 hover:text-white transition-colors"
        >
          <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tab label */}
      <div className="px-5 py-3 border-b border-ink-100 bg-bg-page shrink-0">
        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-500">
          {TABS.find(t => t.id === tab)?.label ?? tab}
        </p>
      </div>

      {/* Terms list */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {entries.map((entry, i) => (
          <div key={i} className={`${i < entries.length - 1 ? "border-b border-ink-100 pb-5" : ""}`}>
            <p className="text-xs font-bold text-ink-900 mb-1.5">{entry.term}</p>
            <p className="text-xs leading-relaxed text-ink-600">{entry.def}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
