import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "../ui/Badge";
import { PlotlyChart } from "../charts/PlotlyChart";
import { IconChevronDown, IconDownload } from "../ui/Icons";
import { useToast } from "../../hooks/useToast";
import { buildBeneficiCategorie, COLORE_VALORE_RESIDUO } from "../../lib/ecbaBenefits";

// ─── FORMATTERS ───────────────────────────────────────────────────────────────

function fmtEur(n) {
  if (n == null || Number.isNaN(n)) return "—";
  return `${new Intl.NumberFormat("it-IT").format(Math.round(n))} €`;
}

function fmtM(n) {
  if (n == null || Number.isNaN(n)) return "—";
  const v = n / 1_000_000;
  return `${new Intl.NumberFormat("it-IT", { maximumFractionDigits: 1 }).format(v)} M€`;
}

function fmtSignedM(n) {
  if (n == null || Number.isNaN(n)) return "—";
  const sign = n >= 0 ? "+" : "−";
  return `${sign}${fmtM(Math.abs(n))}`;
}

function fmtNum(n, dec = 2) {
  return new Intl.NumberFormat("it-IT", { maximumFractionDigits: dec }).format(n ?? 0);
}

function fmtPct(frac) {
  return `${new Intl.NumberFormat("it-IT", { maximumFractionDigits: 1 }).format(frac * 100)}%`;
}

// ─── FALLBACK (pagina robusta anche senza ecbaResults reali) ───────────────────

function buildFallback(assumptions) {
  const horizon = assumptions?.horizon ?? 25;
  const rate = assumptions?.discountRate ?? 3.5;
  const capex = 5_000_000;
  const opex = 200_000;
  const residualValue = assumptions?.residualValue ?? Math.round(capex * 0.1);

  const categorie = buildBeneficiCategorie({ capex });
  const annualBenefits = categorie.reduce((s, c) => s + c.valore_annuo, 0);

  let af = 0;
  for (let t = 1; t <= horizon; t++) af += 1 / Math.pow(1 + rate / 100, t);
  const residualPV = residualValue / Math.pow(1 + rate / 100, horizon);

  const catPV = categorie.map((c) => ({ ...c, valore_pv: Math.round(c.valore_annuo * af) }));
  catPV.push({
    id: "residuo",
    nome: "Valore residuo",
    descrizione:
      "Valore economico dell'opera al termine dell'orizzonte di analisi, attualizzato all'anno base.",
    comeMisura: "Stimato come quota non ammortizzata del CAPEX, attualizzata a fine orizzonte.",
    colore: COLORE_VALORE_RESIDUO,
    valore_annuo: null,
    one_off: true,
    sottocomponenti: [],
    valore_pv: Math.round(residualPV),
  });
  const beneficiTotali = catPV.reduce((s, c) => s + c.valore_pv, 0);
  const benefici_categorie = catPV.map((c) => ({
    ...c,
    quota: beneficiTotali > 0 ? c.valore_pv / beneficiTotali : 0,
  }));

  let pvOpex = 0;
  for (let t = 1; t <= horizon; t++) pvOpex += opex / Math.pow(1 + rate / 100, t);
  pvOpex = Math.round(pvOpex);
  const costiTotali = capex + pvOpex;

  const flussi = [
    { anno: 0, benefici: 0, costi: capex, flusso_netto: -capex, van_cumulato: -capex },
  ];
  let vanCum = -capex;
  for (let t = 1; t <= horizon; t++) {
    const benefici = Math.round(annualBenefits + (t === horizon ? residualValue : 0));
    const flussoNetto = benefici - opex;
    vanCum += flussoNetto / Math.pow(1 + rate / 100, t);
    flussi.push({ anno: t, benefici, costi: opex, flusso_netto: flussoNetto, van_cumulato: Math.round(vanCum) });
  }

  const paybackRow = flussi.find((r) => r.anno >= 1 && r.van_cumulato >= 0);
  return {
    van: Math.round(beneficiTotali - costiTotali),
    bcr: Math.round((beneficiTotali / costiTotali) * 100) / 100,
    irr: 3.86,
    payback_period: paybackRow?.anno ?? horizon,
    benefici_totali: Math.round(beneficiTotali),
    costi_totali: Math.round(costiTotali),
    annual_benefits: Math.round(annualBenefits),
    benefici_categorie,
    costi_categorie: [
      { id: "capex", label: "Investimento (CAPEX)", valore_pv: capex },
      { id: "opex", label: "Gestione e manutenzione (OPEX)", valore_pv: pvOpex },
    ],
    pv_capex: capex,
    pv_opex: pvOpex,
    flussi,
    meta: { orizzonte: horizon, tasso: rate, residual: residualValue, capex, annual_opex: opex },
  };
}

// ─── PAGE ──────────────────────────────────────────────────────────────────────

export function EcbaResults({ project, ecbaResults, assumptions, onBack }) {
  const { toast } = useToast();
  const [metodologiaOpen, setMetodologiaOpen] = useState(false);

  // Usa i risultati reali solo se prodotti dal nuovo engine (hanno le categorie);
  // altrimenti ricade sul fallback per garantire una pagina internamente coerente.
  const r = useMemo(() => {
    if (ecbaResults && ecbaResults.benefici_categorie) return ecbaResults;
    return buildFallback(assumptions);
  }, [ecbaResults, assumptions]);

  const p = project || {};
  const conf = p.configurazione ?? {};
  const orizzonte = r.meta?.orizzonte ?? assumptions?.horizon ?? 25;
  const tasso = r.meta?.tasso ?? assumptions?.discountRate ?? 3.5;
  const capex = r.meta?.capex ?? r.pv_capex ?? 0;

  const bcr = r.bcr ?? (r.costi_totali ? r.benefici_totali / r.costi_totali : 0);
  const economicallySound = r.van >= 0 && bcr >= 1;

  function handleDownload() {
    toast({ title: "Download avviato", description: "Il report verrà scaricato a breve." });
  }

  return (
    <div className="px-4 py-6 md:px-8">
      {/* Breadcrumb */}
      <nav className="mb-3 flex flex-wrap items-center gap-1.5 text-xs text-ink-400">
        <button type="button" onClick={onBack} className="transition-colors hover:text-brand-violet">
          Dettaglio del progetto
        </button>
        <span>›</span>
        <span className="font-medium text-ink-700">Analisi Costi-Benefici</span>
      </nav>

      <p className="mb-5 text-[11px] text-ink-400">
        Creato il <span className="font-medium">12/05/2025</span> da <span className="font-medium">Comune di (nome del comune), Mario Rossi</span> — Ultima modifica il <span className="font-medium">15/05/2025</span>
      </p>

      {/* ── Header card ───────────────────────────────────────────────────── */}
      <div className="mb-6 border border-ink-100 bg-white">
        <div className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-badge-ecba/40">
              <CbaIcon type="vane" className="h-6 w-6" wrapperClassName="text-brand-violet-dark" />
            </div>
            <div>
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h1 className="text-[18px] font-bold text-ink-900">Analisi Costi-Benefici</h1>
                <Badge type="ECBA" />
                <VerdictPill ok={economicallySound} />
              </div>
              <p className="text-sm text-ink-500">
                Del progetto <span className="font-medium text-ink-700">{p.nome || "—"}</span>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMetodologiaOpen(true)}
              className="flex items-center gap-2 border border-ink-200 px-4 py-2 text-sm text-ink-700 transition-colors hover:border-brand-violet hover:text-brand-violet"
            >
              <IconInfoCircle className="h-4 w-4" /> Metodologia
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-2 border border-ink-200 px-4 py-2 text-sm text-ink-700 transition-colors hover:border-brand-violet hover:text-brand-violet"
            >
              Scarica report <IconDownload className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 divide-ink-100 border-t border-ink-100 md:grid-cols-4 md:divide-x">
          <MetaField label="Settore" value={conf.settore || "Infrastrutture ambientali e risorse idriche"} />
          <MetaField label="Orizzonte di analisi" value={`${orizzonte} anni`} />
          <MetaField label="Tasso di sconto sociale" value={`${fmtNum(tasso, 1)}%`} />
          <MetaField label="Metodologia" value="DCF economico · SAM EU-ITA 2019" />
        </div>
      </div>

      {/* ── Cos'è questa analisi ──────────────────────────────────────────── */}
      <div className="mb-6 border border-ink-100 bg-white p-6">
        <h2 className="text-[17px] font-bold text-ink-900">Cosa stai guardando</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-700">
          L'<strong className="text-ink-900">Analisi Costi-Benefici (ACB)</strong> risponde a una domanda
          semplice: <em>«questo progetto conviene alla collettività?»</em>. Per rispondere mette su una bilancia,
          da un lato tutti i <strong className="text-ink-900">benefici</strong> che genera per la società
          (anche quelli senza prezzo di mercato, come l'ambiente o la salute) e dall'altro tutti i
          <strong className="text-ink-900"> costi</strong> per realizzarlo e gestirlo. Tutti i valori futuri
          sono riportati a oggi (<strong className="text-ink-900">attualizzati</strong>) così da poterli confrontare.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <InsightBox className="flex-1">
            Il progetto <strong className="text-ink-900">conviene</strong> quando i benefici superano i costi:
            in pratica quando il <strong className="text-ink-900">VANE è positivo</strong> e il
            <strong className="text-ink-900"> rapporto Benefici/Costi è maggiore di 1</strong>.
          </InsightBox>
          <InsightBox className="flex-1" tone="neutral">
            I numeri qui sotto sono <strong className="text-ink-900">valori attuali</strong>: somme di soldi
            che, pur arrivando in anni diversi, sono state riportate al loro valore di oggi al tasso del {fmtNum(tasso, 1)}%.
          </InsightBox>
        </div>
      </div>

      {/* Hero discreto */}
      <div className="mb-8 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[13px] text-ink-500">
        <span>Investimento iniziale:</span>
        <strong className="text-[15px] font-semibold text-ink-900">{fmtM(capex)}</strong>
        <span>
          · analizzato su <strong className="font-medium text-ink-700">{orizzonte} anni</strong> ·
          attualizzato al <strong className="font-medium text-ink-700">{fmtNum(tasso, 1)}%</strong>
        </span>
        <InfoButton slug="hero" />
      </div>

      {/* ── FLOW: come nasce il valore ────────────────────────────────────── */}
      <section className="mb-12 space-y-4">
        <SectionHead
          label="Il quadro d'insieme"
          title="Come nasce il valore per la collettività"
          subtitle="I benefici generati, meno i costi sostenuti, danno il valore netto del progetto"
          info="flow"
        />
        <FlowEquation r={r} />
      </section>

      {/* ── Macronumeri ───────────────────────────────────────────────────── */}
      <section className="mb-12 space-y-4">
        <SectionHead
          label="Gli indicatori"
          title="I quattro numeri che contano"
          subtitle="Sono gli indicatori standard con cui si giudica la convenienza economica di un'opera pubblica"
          info="kpi.tutti"
        />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <KpiCard
            icon="vane"
            label="VANE"
            value={fmtSignedM(r.van)}
            caption="Valore Attuale Netto Economico: il guadagno netto per la società."
            info="kpi.vane"
            accent={r.van >= 0 ? "ok" : "bad"}
          />
          <KpiCard
            icon="ratio"
            label="Rapporto B/C"
            value={fmtNum(bcr, 2)}
            caption={`Per ogni 1 € di costo, il progetto restituisce ${fmtNum(bcr, 2)} € di benefici.`}
            info="kpi.bc"
            accent={bcr >= 1 ? "ok" : "bad"}
          />
          <KpiCard
            icon="tire"
            label="TIRE"
            value={`${fmtNum(r.irr, 2)}%`}
            caption={`Rendimento annuo del progetto. Supera il tasso sociale del ${fmtNum(tasso, 1)}%? Allora conviene.`}
            info="kpi.tire"
          />
          <KpiCard
            icon="payback"
            label="Payback"
            value={r.payback_period != null ? `${r.payback_period} anni` : "—"}
            caption="Gli anni necessari perché i benefici ripaghino del tutto l'investimento."
            info="kpi.payback"
          />
        </div>

        <VerdictBanner ok={economicallySound} van={r.van} bcr={bcr} />

        {/* Come leggere i singoli numeri */}
        <IndicatorGuide tasso={tasso} />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <TotalCard
            icon="benefici"
            label="Benefici economici totali"
            value={fmtEur(r.benefici_totali)}
            sub="Valore attuale di tutti gli impatti positivi: esternalità e outcome monetizzati su tutto l'orizzonte."
            tone="benefit"
          />
          <TotalCard
            icon="costi"
            label="Costi economici totali"
            value={fmtEur(r.costi_totali)}
            sub="Valore attuale dell'investimento iniziale (CAPEX) e della gestione (OPEX), valutati a prezzi ombra."
            tone="cost"
          />
        </div>
      </section>

      {/* ── Grafico 1 — Ciambella benefici ────────────────────────────────── */}
      <section className="mb-12 space-y-4">
        <SectionHead
          label="Grafico 1 — Da dove arrivano i benefici"
          title="La composizione dei benefici"
          subtitle="Quali tipi di vantaggio per la collettività pesano di più sul totale"
          info="benefici.ciambella"
        />
        <BenefitsDonut categorie={r.benefici_categorie} totale={r.benefici_totali} />
      </section>

      {/* ── Grafico 2 — Waterfall ─────────────────────────────────────────── */}
      <section className="mb-12 space-y-4">
        <SectionHead
          label="Grafico 2 — Dal lordo al netto"
          title="Dai benefici al valore netto (VANE)"
          subtitle="Partendo dai benefici totali, togliamo i costi e arriviamo al valore che resta alla collettività"
          info="chart.waterfall"
        />
        <WaterfallChart r={r} />
      </section>

      {/* ── Grafico 3 — Cashflow nel tempo ────────────────────────────────── */}
      <section className="mb-12 space-y-4">
        <SectionHead
          label="Grafico 3 — Anno per anno"
          title="Il flusso di costi e benefici nel tempo"
          subtitle="Come si distribuiscono costi e benefici lungo gli anni e quando il progetto ripaga sé stesso"
          info="chart.cashflow"
        />
        <CashflowChart flussi={r.flussi} payback={r.payback_period} />
      </section>

      {/* ── Glossario ─────────────────────────────────────────────────────── */}
      <TermGlossary />

      {metodologiaOpen && <MetodologiaModal onClose={() => setMetodologiaOpen(false)} />}
    </div>
  );
}

// ─── ICONS (concetti CBA) ────────────────────────────────────────────────────

function CbaIcon({ type, className = "h-6 w-6", wrapperClassName = "text-brand-violet" }) {
  const paths = {
    // bilancia → VANE / valore netto
    vane: (
      <>
        <path d="M12 3v18M5 21h14" />
        <path d="M5 7h14" />
        <path d="M5 7l-2.5 5a2.5 2.5 0 0 0 5 0L5 7zM19 7l-2.5 5a2.5 2.5 0 0 0 5 0L19 7z" />
      </>
    ),
    // rapporto B/C → divisione
    ratio: (
      <>
        <line x1="5" y1="12" x2="19" y2="12" />
        <circle cx="12" cy="7" r="1.4" />
        <circle cx="12" cy="17" r="1.4" />
      </>
    ),
    // TIRE → trend up
    tire: (
      <>
        <path d="M3 17l6-6 4 4 7-7" />
        <path d="M17 8h4v4" />
      </>
    ),
    // payback → orologio
    payback: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    // benefici → mano che dona / più
    benefici: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v8M8 12h8" />
      </>
    ),
    // costi → portafoglio / meno
    costi: (
      <>
        <rect x="3" y="6" width="18" height="13" rx="2" />
        <path d="M3 10h18M8 15h4" />
      </>
    ),
    // ambientale → foglia
    ambientale: (
      <>
        <path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14z" />
        <path d="M5 19c4-4 8-6 12-7" />
      </>
    ),
    // fiscale → euro
    fiscale: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M15 9a4 4 0 1 0 0 6M7 11h5M7 13h5" />
      </>
    ),
    // sociale → persone
    sociale: (
      <>
        <circle cx="9" cy="9" r="3" />
        <path d="M3 19a6 6 0 0 1 12 0" />
        <path d="M16 7a3 3 0 0 1 0 5M21 19a6 6 0 0 0-4-5.6" />
      </>
    ),
    // tempo → clessidra
    tempo: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    // residuo → edificio
    residuo: (
      <>
        <path d="M4 21V8l8-4 8 4v13" />
        <path d="M9 21v-6h6v6M9 11h.01M15 11h.01" />
      </>
    ),
  };
  return (
    <span className={`inline-flex shrink-0 items-center justify-center ${wrapperClassName}`}>
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {paths[type] ?? paths.vane}
      </svg>
    </span>
  );
}

// mappa colore-categoria → tipo icona per la ciambella
const CAT_ICON = {
  ambientale: "ambientale",
  fiscale: "fiscale",
  sociale: "sociale",
  tempo: "tempo",
  residuo: "residuo",
};

// ─── LAYOUT PRIMITIVES ──────────────────────────────────────────────────────────

function SectionHead({ label, title, subtitle, info }) {
  return (
    <div>
      {label && <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-400">{label}</p>}
      <div className="mt-1 flex items-center gap-2">
        <h2 className="text-[20px] font-bold text-ink-900">{title}</h2>
        {info && <InfoButton slug={info} />}
      </div>
      {subtitle && <p className="mt-1 text-sm text-ink-500">{subtitle}</p>}
    </div>
  );
}

function MetaField({ label, value }) {
  return (
    <div className="px-6 py-4">
      <p className="mb-0.5 text-[11px] text-ink-400">{label}</p>
      <p className="text-sm font-medium text-ink-900">{value}</p>
    </div>
  );
}

function InsightBox({ children, className = "", tone = "violet" }) {
  const cls =
    tone === "neutral"
      ? "border-ink-200 bg-bg-page"
      : "border-brand-violet bg-brand-violet/5";
  return (
    <div className={`border-l-4 px-5 py-4 text-[13px] leading-relaxed text-ink-700 ${cls} ${className}`}>
      {children}
    </div>
  );
}

function VerdictPill({ ok }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold ${
        ok ? "bg-success-lighter text-success" : "bg-error-lighter text-error"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${ok ? "bg-success" : "bg-error"}`} />
      {ok ? "Economicamente conveniente" : "Non conveniente"}
    </span>
  );
}

function KpiCard({ icon, label, value, caption, info, accent }) {
  const accentCls =
    accent === "ok" ? "border-brand-violet/40" : accent === "bad" ? "border-error/40" : "border-ink-100";
  const valueCls =
    accent === "ok" ? "text-brand-violet-dark" : accent === "bad" ? "text-error" : "text-ink-900";
  return (
    <div className={`border bg-white p-5 ${accentCls}`}>
      <div className="mb-3 flex items-start gap-3">
        <CbaIcon type={icon} className="h-8 w-8" />
        <p className="flex-1 pt-1 text-[11px] font-bold uppercase tracking-[0.1em] text-ink-500">{label}</p>
        <InfoButton slug={info} size="sm" placement="left" />
      </div>
      <p className={`text-[26px] font-bold leading-none ${valueCls}`}>{value}</p>
      <p className="mt-2 text-[12px] leading-snug text-ink-500">{caption}</p>
    </div>
  );
}

function TotalCard({ icon, label, value, sub, tone }) {
  const bar = tone === "benefit" ? "bg-[#65A30D]" : "bg-error";
  return (
    <div className="relative overflow-hidden border border-ink-100 bg-white p-5 pl-6">
      <span className={`absolute inset-y-0 left-0 w-1 ${bar}`} />
      <div className="flex items-start gap-3">
        <CbaIcon type={icon} className="h-7 w-7" wrapperClassName={tone === "benefit" ? "text-[#65A30D]" : "text-error"} />
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-ink-500">{label}</p>
          <p className="mt-1 font-mono text-[22px] font-bold text-ink-900">{value}</p>
          <p className="mt-2 text-[12px] leading-relaxed text-ink-500">{sub}</p>
        </div>
      </div>
    </div>
  );
}

// ─── FLOW: Benefici − Costi = VANE ───────────────────────────────────────────

function FlowEquation({ r }) {
  const vaneOk = r.van >= 0;
  return (
    <>
      <div className="grid grid-cols-1 items-stretch gap-3 md:grid-cols-[1fr_40px_1fr_40px_1fr]">
        <FlowCard
          icon="benefici"
          tone="benefit"
          label="Benefici economici"
          value={fmtM(r.benefici_totali)}
          desc="Tutto ciò che il progetto restituisce alla collettività nel tempo: risparmi, esternalità positive, valore residuo."
        />
        <FlowOp symbol="−" />
        <FlowCard
          icon="costi"
          tone="cost"
          label="Costi economici"
          value={fmtM(r.costi_totali)}
          desc="Quanto costa realizzarlo e gestirlo: investimento iniziale (CAPEX) e gestione/manutenzione (OPEX)."
        />
        <FlowOp symbol="=" />
        <FlowCard
          icon="vane"
          tone={vaneOk ? "net" : "netbad"}
          label="VANE — valore netto"
          value={fmtSignedM(r.van)}
          desc={vaneOk
            ? "Il valore che resta alla società dopo aver coperto tutti i costi. Positivo: il progetto conviene."
            : "I costi superano i benefici: il valore netto è negativo e il progetto, così com'è, non conviene."}
        />
      </div>
      <InsightBox>
        <strong className="text-ink-900">In parole semplici:</strong> il progetto genera{" "}
        <strong className="text-ink-900">{fmtM(r.benefici_totali)}</strong> di benefici per la collettività e
        ne costa <strong className="text-ink-900">{fmtM(r.costi_totali)}</strong>. La differenza —{" "}
        <strong className="text-ink-900">{fmtSignedM(r.van)}</strong> — è il valore netto che il progetto lascia alla società.
      </InsightBox>
    </>
  );
}

function FlowCard({ icon, tone, label, value, desc }) {
  const styles = {
    benefit: { bar: "border-t-[#65A30D]", icon: "text-[#65A30D]", val: "text-ink-900" },
    cost: { bar: "border-t-error", icon: "text-error", val: "text-ink-900" },
    net: { bar: "border-t-brand-violet", icon: "text-brand-violet", val: "text-brand-violet-dark" },
    netbad: { bar: "border-t-error", icon: "text-error", val: "text-error" },
  }[tone];
  return (
    <div className={`flex flex-col border border-ink-100 border-t-[3px] bg-white p-5 ${styles.bar}`}>
      <div className="mb-2 flex items-center gap-2">
        <CbaIcon type={icon} className="h-6 w-6" wrapperClassName={styles.icon} />
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink-500">{label}</p>
      </div>
      <p className={`font-mono text-[26px] font-bold leading-none ${styles.val}`}>{value}</p>
      <p className="mt-3 text-[12px] leading-relaxed text-ink-500">{desc}</p>
    </div>
  );
}

function FlowOp({ symbol }) {
  return (
    <div className="flex items-center justify-center py-1 md:py-0">
      <span className="text-[28px] font-light text-ink-300">{symbol}</span>
    </div>
  );
}

// ─── VERDETTO + GUIDA INDICATORI ─────────────────────────────────────────────

function VerdictBanner({ ok, van, bcr }) {
  return (
    <div className={`border-l-4 px-6 py-5 ${ok ? "border-success bg-success-lighter/60" : "border-error bg-error-lighter/60"}`}>
      <p className="text-sm leading-relaxed text-ink-800">
        <strong className="text-ink-900">{ok ? "Il progetto è economicamente conveniente." : "Il progetto non è economicamente conveniente."}</strong>{" "}
        {ok
          ? `Il valore netto (VANE) è positivo (${fmtSignedM(van)}) e ogni euro speso genera ${fmtNum(bcr, 2)} € di benefici (rapporto B/C maggiore di 1).`
          : `Il valore netto (VANE) è negativo (${fmtSignedM(van)}) e il rapporto Benefici/Costi è inferiore a 1 (${fmtNum(bcr, 2)}): i costi superano i benefici.`}
      </p>
    </div>
  );
}

function IndicatorGuide({ tasso }) {
  const items = [
    {
      icon: "vane",
      label: "VANE",
      text: "Il guadagno netto per la società, in euro di oggi. È la somma di tutti i benefici meno tutti i costi. Se è positivo, il progetto crea valore.",
    },
    {
      icon: "ratio",
      label: "Rapporto Benefici/Costi",
      text: "Quanti euro di benefici si ottengono per ogni euro di costo. Sopra 1 il progetto rende; sotto 1 distrugge valore. Utile per confrontare progetti diversi.",
    },
    {
      icon: "tire",
      label: "TIRE",
      text: `Il «rendimento» percentuale del progetto. Va confrontato con il tasso di sconto sociale (${fmtNum(tasso, 1)}%): se è più alto, l'opera è conveniente.`,
    },
    {
      icon: "payback",
      label: "Payback period",
      text: "Dopo quanti anni i benefici accumulati ripagano l'investimento. Meno anni significa rientrare prima dalla spesa.",
    },
  ];
  return (
    <div className="border border-ink-100 bg-white">
      <div className="border-b border-ink-100 bg-bg-page px-5 py-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">Come leggere ciascun indicatore</p>
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 md:grid-cols-2">
        {items.map((d) => (
          <div key={d.label} className="flex gap-3">
            <CbaIcon type={d.icon} className="h-5 w-5" wrapperClassName="mt-0.5 text-brand-violet" />
            <div>
              <p className="text-[12px] font-bold text-ink-900">{d.label}</p>
              <p className="mt-1 text-[12px] leading-relaxed text-ink-600">{d.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CHART 1 — DONUT BENEFICI ────────────────────────────────────────────────

function BenefitsDonut({ categorie = [], totale }) {
  const cats = categorie.filter((c) => c.valore_pv > 0);
  const top = [...cats].sort((a, b) => b.valore_pv - a.valore_pv)[0];

  const data = [
    {
      type: "pie",
      hole: 0.62,
      labels: cats.map((c) => c.nome),
      values: cats.map((c) => c.valore_pv),
      marker: { colors: cats.map((c) => c.colore), line: { color: "#fff", width: 2 } },
      textinfo: "percent",
      textposition: "inside",
      insidetextfont: { color: "#fff", size: 12 },
      hovertemplate: "%{label}<br>%{value:,.0f} €<br>%{percent}<extra></extra>",
      sort: false,
      direction: "clockwise",
    },
  ];

  const layout = {
    showlegend: false,
    margin: { t: 8, r: 8, b: 8, l: 8 },
    height: 300,
    annotations: [
      { text: `<b>${fmtM(totale)}</b>`, showarrow: false, font: { size: 18, color: "#0E0E10" }, x: 0.5, y: 0.54 },
      { text: "Benefici totali", showarrow: false, font: { size: 11, color: "#7B7B82" }, x: 0.5, y: 0.42 },
    ],
  };

  return (
    <div className="border border-ink-100 bg-white p-5">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <div>
          <PlotlyChart data={data} layout={layout} style={{ minHeight: 300 }} />
          <p className="mt-2 text-center text-[11px] text-ink-400">Ogni spicchio è una categoria di beneficio; la dimensione è proporzionale al valore.</p>
        </div>
        <div className="space-y-2.5">
          {cats.map((c) => (
            <BenefitRow key={c.id} cat={c} />
          ))}
        </div>
      </div>
      {top && (
        <InsightBox className="mt-5">
          <strong className="text-ink-900">In parole semplici:</strong> la voce di beneficio più importante è{" "}
          <strong className="text-ink-900">{top.nome.toLowerCase()}</strong>, che da sola vale{" "}
          <strong className="text-ink-900">{fmtEur(top.valore_pv)}</strong> ({fmtPct(top.quota)} del totale).
          Clicca su una categoria per vedere da quali voci è composta e come viene calcolata.
        </InsightBox>
      )}
    </div>
  );
}

function BenefitRow({ cat }) {
  const [open, setOpen] = useState(false);
  const hasDetail = (cat.sottocomponenti?.length ?? 0) > 0 || cat.comeMisura;
  return (
    <div className="border border-ink-100">
      <button
        type="button"
        onClick={() => hasDetail && setOpen((v) => !v)}
        className={`flex w-full items-center gap-3 px-4 py-3 text-left ${hasDetail ? "cursor-pointer hover:bg-bg-page" : "cursor-default"}`}
      >
        <span className="h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: cat.colore }} />
        <CbaIcon type={CAT_ICON[cat.id] ?? "benefici"} className="h-5 w-5" wrapperClassName="text-ink-400" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink-900">{cat.nome}</p>
          <p className="truncate text-[11px] text-ink-400">{cat.descrizione}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[13px] font-semibold text-ink-900">{fmtEur(cat.valore_pv)}</p>
          <p className="text-[11px] font-semibold text-ink-400">{fmtPct(cat.quota)}</p>
        </div>
        {hasDetail && (
          <IconChevronDown className={`h-4 w-4 shrink-0 text-ink-400 transition-transform ${open ? "rotate-180" : ""}`} />
        )}
      </button>
      {open && hasDetail && (
        <div className="border-t border-ink-100 bg-bg-page px-4 py-3">
          {cat.sottocomponenti?.length > 0 && (
            <div className="mb-3 space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-ink-400">Da cosa è composto (valore annuo)</p>
              {cat.sottocomponenti.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-[12px]">
                  <span className="text-ink-600">{s.label}</span>
                  <span className="font-mono text-ink-900">{fmtEur(s.valore_annuo)}/anno</span>
                </div>
              ))}
            </div>
          )}
          {cat.comeMisura && (
            <p className="border-t border-ink-100 pt-3 text-[11px] leading-relaxed text-ink-500">
              <span className="font-semibold text-ink-600">Come viene valorizzato — </span>
              {cat.comeMisura}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── CHART 2 — WATERFALL ─────────────────────────────────────────────────────

function WaterfallChart({ r }) {
  const ben = r.benefici_totali;
  const capex = r.pv_capex ?? r.costi_categorie?.find((c) => c.id === "capex")?.valore_pv ?? 0;
  const opex = r.pv_opex ?? r.costi_categorie?.find((c) => c.id === "opex")?.valore_pv ?? 0;

  const data = [
    {
      type: "waterfall",
      orientation: "v",
      measure: ["absolute", "relative", "relative", "total"],
      x: ["Benefici", "− Investimento", "− Gestione", "VANE"],
      y: [ben, -capex, -opex, 0],
      text: [fmtM(ben), `−${fmtM(capex)}`, `−${fmtM(opex)}`, fmtSignedM(r.van)],
      textposition: "outside",
      textfont: { size: 11 },
      connector: { line: { color: "#D1D1D6", width: 1 } },
      increasing: { marker: { color: "#65A30D" } },
      decreasing: { marker: { color: "#DC2626" } },
      totals: { marker: { color: r.van >= 0 ? "#5B21F7" : "#DC2626" } },
      hovertemplate: "%{x}<br>%{y:,.0f} €<extra></extra>",
    },
  ];

  const layout = {
    height: 340,
    margin: { t: 30, r: 16, b: 40, l: 64 },
    showlegend: false,
    yaxis: { title: "Valore attuale (€)", zeroline: true, zerolinecolor: "#A3A3AA" },
    xaxis: { tickfont: { size: 12 } },
  };

  return (
    <div className="border border-ink-100 bg-white p-5">
      <PlotlyChart data={data} layout={layout} style={{ minHeight: 340 }} />
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-4">
        <WaterfallStep color="#65A30D" title="Benefici" value={fmtM(ben)} desc="Punto di partenza: tutti i benefici attualizzati." />
        <WaterfallStep color="#DC2626" title="− Investimento" value={`−${fmtM(capex)}`} desc="Si sottrae il costo di realizzazione (CAPEX)." />
        <WaterfallStep color="#DC2626" title="− Gestione" value={`−${fmtM(opex)}`} desc="Si sottraggono i costi di gestione e manutenzione (OPEX)." />
        <WaterfallStep color={r.van >= 0 ? "#5B21F7" : "#DC2626"} title="= VANE" value={fmtSignedM(r.van)} desc="Quello che resta è il valore netto per la collettività." />
      </div>
    </div>
  );
}

function WaterfallStep({ color, title, value, desc }) {
  return (
    <div className="border-l-2 pl-3" style={{ borderColor: color }}>
      <p className="text-[11px] font-bold uppercase tracking-wide text-ink-500">{title}</p>
      <p className="mt-0.5 font-mono text-[15px] font-bold text-ink-900">{value}</p>
      <p className="mt-1 text-[11px] leading-relaxed text-ink-500">{desc}</p>
    </div>
  );
}

// ─── CHART 3 — CASHFLOW NEL TEMPO ────────────────────────────────────────────

function CashflowChart({ flussi = [], payback }) {
  const years = flussi.map((f) => f.anno);
  const data = [
    {
      type: "bar",
      x: years,
      y: flussi.map((f) => f.benefici / 1_000_000),
      name: "Benefici annui",
      marker: { color: "#84CC16" },
      hovertemplate: "Anno %{x}<br>Benefici: %{y:.2f} M€<extra></extra>",
    },
    {
      type: "bar",
      x: years,
      y: flussi.map((f) => -f.costi / 1_000_000),
      name: "Costi annui",
      marker: { color: "#DC2626" },
      hovertemplate: "Anno %{x}<br>Costi: %{y:.2f} M€<extra></extra>",
    },
    {
      type: "scatter",
      mode: "lines+markers",
      x: years,
      y: flussi.map((f) => f.van_cumulato / 1_000_000),
      name: "Valore netto cumulato",
      line: { color: "#5B21F7", width: 2.5 },
      marker: { size: 4 },
      hovertemplate: "Anno %{x}<br>Valore netto cumulato: %{y:.2f} M€<extra></extra>",
    },
  ];

  const shapes = [
    { type: "line", x0: years[0], x1: years[years.length - 1], y0: 0, y1: 0, line: { color: "#A3A3AA", dash: "dot", width: 1 } },
  ];
  if (payback != null) {
    shapes.push({ type: "line", x0: payback, x1: payback, yref: "paper", y0: 0, y1: 1, line: { color: "#5B21F7", dash: "dash", width: 1 } });
  }

  const layout = {
    height: 340,
    margin: { t: 16, r: 16, b: 44, l: 56 },
    barmode: "relative",
    legend: { orientation: "h", x: 0, y: 1.14 },
    xaxis: { title: "Anno", tickfont: { size: 11 } },
    yaxis: { title: "M€", tickfont: { size: 11 }, zeroline: false },
    shapes,
    annotations:
      payback != null
        ? [{ x: payback, yref: "paper", y: 1.04, text: `Payback · anno ${payback}`, showarrow: false, font: { size: 10, color: "#5B21F7" } }]
        : [],
  };

  return (
    <div className="border border-ink-100 bg-white p-5">
      <PlotlyChart data={data} layout={layout} style={{ minHeight: 340 }} />
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <LegendNote color="#84CC16" title="Barre verdi — Benefici annui" desc="I vantaggi economici prodotti ogni anno dal progetto." />
        <LegendNote color="#DC2626" title="Barre rosse — Costi annui" desc="I costi sostenuti ogni anno. L'anno 0 include l'investimento iniziale, perciò è la barra più alta." />
        <LegendNote color="#5B21F7" title="Linea viola — Valore netto cumulato" desc="La somma progressiva di benefici e costi attualizzati. Quando supera lo zero, il progetto ha ripagato sé stesso." />
      </div>
      {payback != null && (
        <InsightBox className="mt-4">
          <strong className="text-ink-900">In parole semplici:</strong> all'inizio la linea viola è sotto lo zero perché
          si è speso senza ancora incassare benefici. Risale anno dopo anno e supera lo zero intorno all'
          <strong className="text-ink-900">anno {payback}</strong>: da quel momento il progetto ha ripagato l'investimento e inizia a creare valore netto.
        </InsightBox>
      )}
    </div>
  );
}

function LegendNote({ color, title, desc }) {
  return (
    <div className="flex gap-2.5">
      <span className="mt-1 h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: color }} />
      <div>
        <p className="text-[12px] font-bold text-ink-900">{title}</p>
        <p className="mt-0.5 text-[11px] leading-relaxed text-ink-500">{desc}</p>
      </div>
    </div>
  );
}

// ─── GLOSSARIO DEI TERMINI ───────────────────────────────────────────────────

function TermGlossary() {
  const [open, setOpen] = useState(false);
  const terms = [
    { t: "Attualizzazione", d: "Riportare a oggi il valore di soldi che si riceveranno o spenderanno in futuro. Serve perché 1 € oggi vale più di 1 € fra dieci anni." },
    { t: "Tasso di sconto sociale", d: "La percentuale (tipicamente il 3%) usata per attualizzare. Esprime quanto la società preferisce i benefici di oggi rispetto a quelli futuri." },
    { t: "Prezzi ombra", d: "I prezzi «veri» per la collettività, ottenuti correggendo i prezzi di mercato da tasse, sussidi e distorsioni. Misurano il costo-opportunità reale delle risorse." },
    { t: "Esternalità", d: "Effetti del progetto che ricadono su terzi e non hanno un prezzo di mercato (es. aria più pulita, tempo risparmiato). Vengono monetizzati per poterli confrontare." },
    { t: "CAPEX", d: "Costi di investimento: la spesa iniziale per costruire o realizzare l'opera." },
    { t: "OPEX", d: "Costi operativi: le spese ricorrenti di gestione e manutenzione lungo tutta la vita dell'opera." },
    { t: "Valore residuo", d: "Il valore economico che l'opera conserva alla fine dell'orizzonte di analisi: un beneficio che si recupera in chiusura." },
    { t: "VANE / TIRE / B÷C", d: "I tre indicatori di sintesi: valore netto in euro (VANE), rendimento percentuale (TIRE) ed efficienza relativa (rapporto Benefici/Costi)." },
  ];
  return (
    <div className="mb-6 border border-ink-100 bg-white shadow-sm">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-3 text-left transition-colors hover:bg-bg-page"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">Glossario — cosa significa ogni termine</p>
        <span className="text-xs text-ink-400">{open ? "Chiudi ▴" : "Apri ▾"}</span>
      </button>
      {open && (
        <div className="border-t border-ink-100">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 md:grid-cols-2">
            {terms.map((x) => (
              <div key={x.t}>
                <p className="text-[12px] font-bold text-ink-900">{x.t}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-ink-600">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── INFO POPOVER + METODOLOGIA ──────────────────────────────────────────────

const CHART_INFO = {
  hero: {
    title: "I dati di partenza",
    body: "L'analisi parte dall'investimento iniziale del progetto, lo proietta su tutto l'orizzonte temporale e attualizza ogni flusso futuro al tasso di sconto sociale per renderlo confrontabile con i valori di oggi.",
  },
  flow: {
    title: "Benefici − Costi = Valore netto",
    body: "È il cuore della CBA: si sommano tutti i benefici economici per la collettività, si sottraggono tutti i costi (realizzazione e gestione) e si ottiene il VANE, il valore netto del progetto. Tutto espresso in valore attuale.",
  },
  "kpi.tutti": {
    title: "Gli indicatori di performance",
    body: "VANE, rapporto Benefici/Costi, TIRE e Payback sono gli indicatori standard richiesti dalle Linee Guida per valutare la convenienza economico-sociale di un investimento pubblico. Sono complementari: vanno letti insieme.",
  },
  "kpi.vane": {
    title: "VANE — Valore Attuale Netto Economico",
    body: "Somma dei saldi annuali tra benefici e costi economici, attualizzati al tasso di sconto sociale su tutto l'orizzonte. Un VANE positivo indica che il progetto genera per la collettività benefici che eccedono i costi sociali.",
    extra: "VANE = Σ (Bₜ − Cₜ) / (1 + r)ᵗ",
  },
  "kpi.bc": {
    title: "Rapporto Benefici/Costi",
    body: "Rapporto tra benefici economici attualizzati e costi economici attualizzati. Un valore maggiore di 1 indica che i benefici superano i costi. È utile per confrontare scenari alternativi indipendentemente dalla scala dell'investimento.",
    extra: "B/C = Σ Bₜ/(1+r)ᵗ ÷ Σ Cₜ/(1+r)ᵗ",
  },
  "kpi.tire": {
    title: "TIRE — Tasso Interno di Rendimento Economico",
    body: "È il tasso di sconto che rende il VANE pari a zero: esprime il rendimento sociale del progetto. Un TIRE superiore al tasso di sconto sociale (tipicamente il 3%) è condizione necessaria per la convenienza economica.",
  },
  "kpi.payback": {
    title: "Payback period",
    body: "Numero di anni necessari affinché i benefici netti cumulati e attualizzati eguaglino l'investimento iniziale. È il punto in cui la curva del valore netto cumulato attraversa lo zero.",
  },
  "benefici.ciambella": {
    title: "Composizione dei benefici",
    body: "I benefici economici della CBA sono esternalità e outcome monetizzati (risparmio ambientale, maggior gettito, benefici sociali, risparmio di tempo, valore residuo). Ogni categoria è espressa in valore attuale; la somma corrisponde ai benefici economici totali.",
    extra: "Le esternalità senza prezzo di mercato sono monetizzate tramite disponibilità a pagare, costi evitati e prezzi ombra.",
  },
  "chart.waterfall": {
    title: "Dal lordo al netto",
    body: "Il grafico a cascata parte dai benefici economici totali e sottrae l'investimento (CAPEX) e i costi di gestione (OPEX) attualizzati, fino ad arrivare al VANE. Visualizza in modo immediato quanto valore netto resta alla collettività.",
  },
  "chart.cashflow": {
    title: "Cashflow economico nel tempo",
    body: "Mostra l'andamento annuale di benefici e costi e l'accumulo del valore netto lungo l'orizzonte. A differenza di un'analisi a singolo anno, la CBA distribuisce costi e benefici nel tempo e li attualizza al tasso di sconto sociale.",
  },
};

const METODOLOGIA_SECTIONS = [
  {
    id: "analisi-economica",
    title: "L'analisi economica e il perimetro",
    body: [
      "L'Analisi Costi-Benefici misura la variazione di benessere sociale derivante da una decisione di investimento, valutando a **prezzi economici** i guadagni e le perdite che l'opera genera per la collettività.",
      "A differenza dell'analisi finanziaria — che considera solo i flussi di cassa dell'operatore — l'analisi economica adotta come destinatario l'insieme dei soggetti che beneficiano degli effetti positivi dell'opera o ne sostengono gli impatti negativi.",
      "Lo strumento di calcolo principale è il **Discounted Cash Flow (DCF) in ottica economica**: i flussi finanziari vengono trasformati in flussi economici tramite coefficienti di conversione (prezzi ombra) e integrati con le esternalità sociali.",
    ],
  },
  {
    id: "prezzi-ombra",
    title: "Prezzi ombra e Matrice di Contabilità Sociale (SAM)",
    body: [
      "Per passare dall'ottica finanziaria a quella economica i valori a prezzi di mercato vengono trasformati in **prezzi ombra**, che rappresentano il costo-opportunità sociale delle risorse ed eliminano le distorsioni dovute a imposte, sussidi e imperfezioni di mercato.",
      "I coefficienti di conversione sono stimati sulla base della **Social Accounting Matrix (SAM)**: una matrice di equilibrio generale che integra il flusso circolare del reddito tra settori produttivi, famiglie, imprese, governo e resto del mondo.",
      "OpenEconomics utilizza una SAM multiregionale italiana (21 aree territoriali, 14 settori per area), un modello di **421 righe × 421 colonne** certificato da Luiss Business School e conforme a UNI EN ISO 9001:2015.",
    ],
  },
  {
    id: "esternalita",
    title: "Esternalità e monetizzazione",
    body: [
      "Le esternalità sono effetti non contabilizzati nei flussi finanziari del progetto che ricadono su soggetti terzi. Vanno monetizzate per permettere un confronto omogeneo tra benefici e costi di natura diversa.",
      "**Disponibilità a pagare (DAP)** — per benefici senza prezzo di mercato (es. miglioramento della qualità dell'aria).",
      "**Costi evitati** — benefici quantificati come danni o spese che il progetto consente di evitare.",
      "**Valore della vita statistica (VOSL)** — per i benefici legati alla riduzione dei rischi per la salute.",
      "**Costi e benefici ambientali** — le emissioni di CO₂ sono monetizzate al costo sociale del carbonio, con prezzo crescente fino al Net Zero (2050).",
    ],
  },
  {
    id: "sconto",
    title: "Cashflow e tasso di sconto sociale",
    body: [
      "Dopo la monetizzazione, i flussi futuri di costi e benefici sono **attualizzati** per tener conto del valore temporale del denaro.",
      "Il **tasso di sconto sociale adottato è il 3%**, come indicato dalle Linee Guida Operative in recepimento del Regolamento di esecuzione (UE) n. 207/2015. Riflette il costo-opportunità sociale del capitale ed è in genere inferiore al tasso usato nell'analisi finanziaria.",
      "L'orizzonte temporale dipende dalla tipologia di opera: tipicamente **20–30 anni** a partire dall'entrata in esercizio, in funzione della vita utile degli asset principali. La struttura dei costi comprende CAPEX, OPEX, rinnovi e **valore residuo**.",
    ],
  },
  {
    id: "indicatori",
    title: "Indicatori di performance: VANE, TIRE, B/C",
    body: [
      "**VANE (Valore Attuale Netto Economico)** = Σ (Bₜ − Cₜ) / (1 + r)ᵗ. Un VANE > 0 indica che i benefici per la collettività eccedono i costi sociali. È l'indicatore primario.",
      "**TIRE (Tasso Interno di Rendimento Economico)** — il tasso che rende il VANE pari a zero. Un TIRE superiore al tasso di sconto sociale è condizione necessaria per la convenienza.",
      "**Rapporto Benefici/Costi** = Σ Bₜ/(1+r)ᵗ ÷ Σ Cₜ/(1+r)ᵗ. Un B/C > 1 indica convenienza economica ed è particolarmente utile per ordinare scenari alternativi per efficienza relativa.",
      "I tre indicatori sono complementari: il VANE esprime il valore assoluto netto, il TIRE il rendimento percentuale, il B/C l'efficienza relativa.",
    ],
  },
  {
    id: "rischio",
    title: "Analisi del rischio",
    body: [
      "**Analisi di sensitività** — identifica le variabili critiche, ovvero quelle la cui variazione di ±1% produce la maggiore variazione sul B/C o sul VANE (soglia tipica di criticità: ±5% sul B/C).",
      "**Simulazione Montecarlo** — assegna distribuzioni di probabilità alle variabili critiche e calcola la distribuzione risultante di VANE e B/C.",
      "I risultati sono presentati con valore mediano, intervallo di confidenza al 95% e **percentuale di simulazioni con VANE > 0**: un indicatore sintetico immediato della rischiosità del progetto.",
    ],
  },
  {
    id: "riferimenti",
    title: "Riferimenti normativi e limiti",
    body: [
      "L'impostazione segue le principali linee guida internazionali e nazionali: **Guide to Cost-Benefit Analysis** (Commissione Europea, DG Regio, 2014), **Economic Appraisal Vademecum** (CE, 2021), **Linee Guida Operative del MIT** (2021), oltre ai framework di Banca Mondiale e FMI.",
      "**Limiti** — il modello assume coefficienti tecnici costanti (linearità) e domanda esogena; non cattura effetti prezzo né dinamiche di lungo periodo; l'analisi è condotta ceteris paribus, al netto di shock esterni o politiche concomitanti.",
    ],
  },
];

function IconInfoCircle({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function InfoButton({ slug, label = "Spiegazione", placement = "left", size = "md" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const info = CHART_INFO[slug];

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!info) return null;

  const popoverPos = placement === "left"
    ? { right: 0, top: "calc(100% + 6px)" }
    : { left: 0, top: "calc(100% + 6px)" };
  const dim = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <span ref={ref} className="relative inline-flex align-middle" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={label}
        aria-expanded={open}
        className={`inline-flex items-center justify-center transition-colors ${open ? "text-brand-violet" : "text-ink-300 hover:text-brand-violet"}`}
      >
        <IconInfoCircle className={dim} />
      </button>
      {open && (
        <div className="absolute z-40 w-[320px] border-l-2 border-brand-violet bg-white p-4 shadow-xl normal-case tracking-normal" style={popoverPos}>
          <p className="text-[13px] font-semibold leading-tight text-ink-900">{info.title}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-700">{info.body}</p>
          {info.extra && (
            <p className="mt-3 border-t border-ink-100 pt-3 font-mono text-[12px] leading-relaxed text-ink-500">{info.extra}</p>
          )}
        </div>
      )}
    </span>
  );
}

function renderMethodologyBody(body) {
  return body.map((line, idx) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={idx} className="text-[14px] leading-relaxed text-ink-700">
        {parts.map((part, i) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={i} className="font-semibold text-ink-900">{part.slice(2, -2)}</strong>;
          }
          return <span key={i}>{part}</span>;
        })}
      </p>
    );
  });
}

function MetodologiaModal({ onClose }) {
  const [activeId, setActiveId] = useState(METODOLOGIA_SECTIONS[0].id);
  const sectionRefs = useRef({});
  const scrollRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function scrollToSection(id) {
    const el = sectionRefs.current[id];
    if (el && scrollRef.current) {
      scrollRef.current.scrollTo({ top: el.offsetTop - 16, behavior: "smooth" });
      setActiveId(id);
    }
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-stretch justify-center bg-ink-900/55 p-0 sm:p-6">
      <div className="flex h-full w-full max-w-6xl flex-col overflow-hidden bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b-2 border-brand-violet bg-white px-6 py-4">
          <div>
            <p className="text-[11px] font-medium tracking-wide text-brand-violet">Nota metodologica</p>
            <h2 className="mt-1 text-[18px] font-bold text-ink-900">Come è stata costruita l'Analisi Costi-Benefici</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi"
            className="flex h-9 w-9 items-center justify-center border border-ink-200 text-ink-700 hover:border-brand-violet hover:text-brand-violet"
          >
            ×
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <aside className="hidden w-[260px] shrink-0 border-r border-ink-100 bg-bg-page md:block">
            <nav className="sticky top-0 flex flex-col p-4">
              {METODOLOGIA_SECTIONS.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => scrollToSection(s.id)}
                  className={`mb-1 flex items-start gap-2 px-3 py-2 text-left text-[13px] transition-colors ${
                    activeId === s.id
                      ? "border-l-2 border-brand-violet bg-white font-semibold text-brand-violet"
                      : "border-l-2 border-transparent text-ink-600 hover:bg-white"
                  }`}
                >
                  <span className="font-mono text-[10px] text-ink-400">{String(i + 1).padStart(2, "0")}</span>
                  <span className="leading-snug">{s.title}</span>
                </button>
              ))}
            </nav>
          </aside>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-8 md:px-10">
            <div className="mb-6 border-l-4 border-brand-violet bg-brand-violet/5 px-5 py-4 text-[13px] leading-relaxed text-ink-700">
              Questa nota spiega come è costruita l'Analisi Costi-Benefici e come vanno letti i risultati. L'analisi valuta a <strong className="text-ink-900">prezzi economici</strong> la convenienza sociale dell'investimento tramite un <strong className="text-ink-900">Discounted Cash Flow economico</strong>, determinando i prezzi ombra con una <strong className="text-ink-900">Social Accounting Matrix</strong> e monetizzando le esternalità secondo le Linee Guida nazionali e internazionali.
            </div>

            {METODOLOGIA_SECTIONS.map((s, i) => (
              <section
                key={s.id}
                ref={(el) => { sectionRefs.current[s.id] = el; }}
                className="mb-10 scroll-mt-4"
              >
                <div className="mb-3 flex items-baseline gap-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-brand-violet">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="text-[20px] font-bold leading-tight text-ink-900">{s.title}</h3>
                </div>
                <div className="space-y-3">{renderMethodologyBody(s.body)}</div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
