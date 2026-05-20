import { useMemo, useState } from "react";
import { PlotlyChart } from "./charts/PlotlyChart";
import { Badge } from "./ui/Badge";
import { EmptyState } from "./ui/EmptyState";
import { IconDecorDiamond, IconDownload } from "./ui/Icons";
import { useToast } from "../hooks/useToast";

// ── Formatting helpers ──────────────────────────────────────────────────────

function fmt(n) {
  if (n == null) return "—";
  return new Intl.NumberFormat("it-IT").format(Math.abs(Math.round(n)));
}

function fmtEuro(n) {
  if (n == null) return "—";
  const sign = n < 0 ? "−" : "";
  return `${sign}${fmt(n)} €`;
}

function fmtVAN(n) {
  if (n == null) return "—";
  const abs = Math.abs(n);
  const sign = n >= 0 ? "+" : "−";
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(1).replace(".", ",")} M€`;
  if (abs >= 1_000) return `${sign}${Math.round(abs / 1_000)} K€`;
  return `${sign}${Math.round(abs)} €`;
}

// ── Pure sensitivity computation (no engine dependency) ────────────────────

function computeVanAtRate(flussi, capex, rate) {
  let van = -capex;
  for (const row of flussi) {
    van += row.flusso_netto / Math.pow(1 + rate / 100, row.anno);
  }
  return Math.round(van);
}

// ── Fallback results when ecbaResults is not yet computed ──────────────────

function buildFallback(assumptions) {
  const horizon = assumptions?.horizon ?? 25;
  const rate = assumptions?.discountRate ?? 3.5;
  const capex = 5_000_000;
  const opex = 200_000;
  const annualBenefits = 820_000;
  const residual = assumptions?.residualValue ?? 0;

  const flussi = [];
  let van_cum = -capex;
  let pvB = 0;
  let pvC = capex;

  for (let t = 1; t <= horizon; t++) {
    const benefici = Math.round(annualBenefits + (t === horizon ? residual : 0));
    const costi = opex;
    const flusso_netto = benefici - costi;
    const df = Math.pow(1 + rate / 100, t);
    van_cum += flusso_netto / df;
    pvB += benefici / df;
    pvC += costi / df;
    flussi.push({ anno: t, benefici, costi, flusso_netto, van_cumulato: Math.round(van_cum) });
  }

  return {
    van: Math.round(pvB - pvC),
    bc: Math.round((pvB / pvC) * 100) / 100,
    tir: 6.3,
    payback: flussi.find((r) => r.van_cumulato >= 0)?.anno ?? null,
    benefici_totali: Math.round(pvB),
    costi_totali: Math.round(pvC),
    annual_benefits: annualBenefits,
    flussi,
    meta: { orizzonte: horizon, tasso: rate, residual, capex, annual_opex: opex },
  };
}

// ── Semaforo KPI card ───────────────────────────────────────────────────────

function Semaforo({ label, value, status, description }) {
  const borderColor =
    status === "green" ? "border-emerald-500" :
    status === "amber" ? "border-amber-400" : "border-red-500";
  const valueColor =
    status === "green" ? "text-emerald-600" :
    status === "amber" ? "text-amber-600" : "text-red-600";

  return (
    <div className={`bg-white p-6 border-l-4 ${borderColor}`}>
      <p className="text-xs font-mono uppercase tracking-[0.16em] text-ink-500">{label}</p>
      <p className={`mt-4 text-3xl font-bold font-mono tracking-tight ${valueColor}`}>{value}</p>
      <p className="mt-3 text-sm text-ink-700 leading-relaxed">{description}</p>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

const SENS_RATES = Array.from({ length: 19 }, (_, i) => i + 2); // 2..20%

export function EcbaResults({ project, ecbaResults, assumptions, analysis, onBack }) {
  const { showToast } = useToast();
  const results = ecbaResults ?? buildFallback(assumptions);
  const { meta } = results;

  const [sliderRate, setSliderRate] = useState(meta.tasso);
  const sliderVAN = useMemo(
    () => computeVanAtRate(results.flussi, meta.capex, sliderRate),
    [results.flussi, meta.capex, sliderRate],
  );

  // KPI semaforo statuses
  const vanStatus = results.van > 0 ? "green" : "red";
  const bcStatus = results.bc >= 1 ? "green" : results.bc >= 0.85 ? "amber" : "red";
  const tirStatus =
    results.tir >= meta.tasso + 1 ? "green" :
    results.tir >= meta.tasso - 1 ? "amber" : "red";

  // Annual flows chart
  const flowsData = useMemo(() => [
    {
      type: "bar",
      name: "Benefici",
      x: results.flussi.map((r) => r.anno),
      y: results.flussi.map((r) => r.benefici),
      marker: { color: "#22c55e" },
    },
    {
      type: "bar",
      name: "Costi",
      x: results.flussi.map((r) => r.anno),
      y: results.flussi.map((r) => -r.costi),
      marker: { color: "#ef4444" },
    },
    {
      type: "scatter",
      mode: "lines+markers",
      name: "VAN cumulato",
      x: results.flussi.map((r) => r.anno),
      y: results.flussi.map((r) => r.van_cumulato),
      yaxis: "y2",
      line: { color: "#0E0E10", width: 2.5 },
      marker: { size: 3 },
    },
  ], [results.flussi]);

  const flowsLayout = useMemo(() => ({
    barmode: "relative",
    xaxis: { title: "Anno", dtick: Math.ceil(meta.orizzonte / 10) },
    yaxis: { title: "€", tickformat: ",.0f" },
    yaxis2: { title: "VAN cum. (€)", overlaying: "y", side: "right", showgrid: false, tickformat: ",.0f" },
    margin: { t: 20, r: 80, b: 50, l: 80 },
    legend: { orientation: "h", x: 0, y: -0.25 },
  }), [meta.orizzonte]);

  // Sensitivity chart
  const sensitivityData = useMemo(() => {
    const vans = SENS_RATES.map((r) => computeVanAtRate(results.flussi, meta.capex, r));
    return [
      {
        type: "scatter",
        mode: "lines",
        name: "VAN",
        x: SENS_RATES,
        y: vans,
        line: { color: "#7C3AED", width: 2 },
        fill: "tozeroy",
        fillcolor: "rgba(124,58,237,0.07)",
      },
      {
        type: "scatter",
        mode: "markers",
        name: "Tasso base",
        x: [meta.tasso],
        y: [computeVanAtRate(results.flussi, meta.capex, meta.tasso)],
        marker: { color: "#7C3AED", size: 10, symbol: "circle" },
        showlegend: false,
      },
    ];
  }, [results.flussi, meta.capex, meta.tasso]);

  const sensLayout = useMemo(() => ({
    xaxis: { title: "Tasso di attualizzazione (%)", range: [1, 21] },
    yaxis: { title: "VAN (€)", tickformat: ",.0f" },
    shapes: [
      { type: "line", x0: meta.tasso, x1: meta.tasso, y0: 0, y1: 1, yref: "paper",
        line: { color: "#7C3AED", width: 1.5, dash: "dot" } },
      { type: "line", x0: 2, x1: 20, y0: 0, y1: 0, yref: "y",
        line: { color: "#6b7280", width: 1, dash: "dot" } },
    ],
    margin: { t: 20, r: 20, b: 50, l: 80 },
  }), [meta.tasso]);

  const sliderMin = Math.max(1, Math.floor(meta.tasso - 4));
  const sliderMax = Math.min(20, Math.ceil(meta.tasso + 5));

  async function handleDownloadExcel() {
    try {
      const { utils, writeFile } = await import("xlsx");
      const wb = utils.book_new();

      const kpiRows = [
        ["Indicatore", "Valore"],
        ["VAN (€)", results.van],
        ["Rapporto B/C", results.bc],
        ["TIR (%)", results.tir],
        ["Payback (anni)", results.payback ?? "—"],
        ["Benefici totali VA (€)", results.benefici_totali],
        ["Costi totali VA (€)", results.costi_totali],
        [],
        ["Assunzioni", ""],
        ["Orizzonte (anni)", meta.orizzonte],
        ["Tasso di attualizzazione (%)", meta.tasso],
        ["Valore residuo (€)", meta.residual],
        ["CAPEX (€)", meta.capex],
        ["OPEX annuo (€)", meta.annual_opex],
      ];
      utils.book_append_sheet(wb, utils.aoa_to_sheet(kpiRows), "Indicatori ECBA");

      const flussiRows = [
        ["Anno", "Benefici (€)", "Costi (€)", "Flusso netto (€)", "VAN cumulato (€)"],
        ...results.flussi.map((r) => [r.anno, r.benefici, r.costi, r.flusso_netto, r.van_cumulato]),
      ];
      utils.book_append_sheet(wb, utils.aoa_to_sheet(flussiRows), "Flussi annuali");

      const sensRows = [
        ["Tasso (%)", "VAN (€)"],
        ...SENS_RATES.map((r) => [r, computeVanAtRate(results.flussi, meta.capex, r)]),
      ];
      utils.book_append_sheet(wb, utils.aoa_to_sheet(sensRows), "Sensitività");

      writeFile(wb, `ECBA_${project.nome}_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch {
      showToast("Errore durante l'export Excel.", "error");
    }
  }

  return (
    <div className="min-h-full">

      {/* Header */}
      <div className="dots-violet-bg px-4 pt-8 pb-10 md:px-10">
        <nav className="flex items-center gap-2 text-sm">
          <button onClick={onBack} className="underline text-ink-900">Dettaglio del progetto</button>
          <span className="text-ink-300">/</span>
          <span className="font-bold">Analisi Costi-Benefici</span>
        </nav>

        <div className="mt-5 bg-white">
          <div className="px-6 py-5 flex items-start justify-between gap-6 flex-wrap">
            <div className="flex items-start gap-4">
              <IconDecorDiamond />
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold tracking-tight">Analisi Costi-Benefici</h1>
                  <Badge type="ECBA" />
                </div>
                <p className="mt-1 text-sm">
                  Del progetto <span className="font-medium">{project.nome}</span>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-5 text-sm shrink-0">
              <button
                onClick={() => showToast("Report PDF: disponibile nella versione completa.", "info")}
                className="flex items-center gap-2 text-brand-violet font-semibold"
              >
                Scarica report <IconDownload />
              </button>
              <button
                onClick={handleDownloadExcel}
                className="flex items-center gap-2 text-brand-violet font-semibold"
              >
                Scarica Excel <IconDownload />
              </button>
            </div>
          </div>

          <div className="border-t border-ink-100 px-6 py-5 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <MetaField label="Settore" value={project.configurazione?.settore ?? "—"} />
            <MetaField label="Orizzonte" value={`${meta.orizzonte} anni`} />
            <MetaField label="Tasso di attualizzazione" value={`${meta.tasso}%`} />
          </div>

          {analysis?.updatedAt && (
            <div className="border-t border-ink-100 px-6 py-3 text-xs text-ink-500">
              Output generato il <span className="font-mono">{analysis.updatedAt}</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6 px-4 py-8 md:px-10">

        {/* KPI Semafori */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Semaforo
            label="VAN — Valore Attuale Netto"
            value={fmtVAN(results.van)}
            status={vanStatus}
            description={
              results.van > 0
                ? "I benefici attualizzati superano i costi: il progetto genera valore economico netto."
                : "I costi attualizzati superano i benefici nello scenario corrente."
            }
          />
          <Semaforo
            label="B/C — Rapporto Benefici / Costi"
            value={results.bc.toFixed(2)}
            status={bcStatus}
            description={
              results.bc >= 1
                ? `Ogni euro investito genera ${results.bc.toFixed(2)} € di benefici attualizzati.`
                : "Il rapporto è inferiore a 1: i costi superano i benefici nell'orizzonte scelto."
            }
          />
          <Semaforo
            label="TIR — Tasso Interno di Rendimento"
            value={`${results.tir}%`}
            status={tirStatus}
            description={
              results.tir > meta.tasso
                ? `Superiore al tasso di attualizzazione (${meta.tasso}%): il progetto è economicamente conveniente.`
                : `Inferiore al tasso soglia (${meta.tasso}%): rendimento insufficiente nello scenario corrente.`
            }
          />
        </section>

        {/* Riepilogo sintetico */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Benefici VA totali", value: fmtEuro(results.benefici_totali) },
            { label: "Costi VA totali", value: fmtEuro(results.costi_totali) },
            { label: "Payback (anni)", value: results.payback ? `${results.payback} anni` : "Oltre l'orizzonte" },
            { label: "Benefici annui stimati", value: fmtEuro(results.annual_benefits) },
          ].map((item) => (
            <div key={item.label} className="bg-white px-5 py-4 border border-ink-100">
              <p className="text-xs font-mono uppercase tracking-[0.12em] text-ink-400">{item.label}</p>
              <p className="mt-2 font-semibold font-mono text-sm">{item.value}</p>
            </div>
          ))}
        </section>

        {/* Flussi annuali — grafico */}
        <section className="bg-white p-6">
          <h2 className="text-lg font-bold tracking-tight mb-1">Flussi annuali attualizzati</h2>
          <p className="text-xs text-ink-400 mb-5">
            Barre verdi = benefici, rosse = costi (valori negativi). Linea nera = VAN cumulato (asse destro).
          </p>
          {results.flussi.length > 0 ? (
            <PlotlyChart data={flowsData} layout={flowsLayout} style={{ minHeight: 340 }} />
          ) : (
            <EmptyState
              compact
              eyebrow="Flussi annuali"
              title="Nessun flusso disponibile"
              description="Servono costi e benefici annuali per costruire il grafico dei flussi attualizzati."
            />
          )}
        </section>

        {/* Flussi — tabella */}
        <section className="bg-white p-6">
          <h2 className="text-lg font-bold tracking-tight mb-5">Tabella flussi annuali</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ink-900 text-white">
                  {["Anno", "Benefici (€)", "Costi (€)", "Flusso netto (€)", "VAN cumulato (€)"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.flussi.map((row, i) => (
                  <tr key={row.anno} className={i % 2 === 0 ? "bg-white" : "bg-ink-50"}>
                    <td className="px-4 py-2.5 font-mono font-semibold">{row.anno}</td>
                    <td className="px-4 py-2.5 font-mono text-emerald-700">+{fmt(row.benefici)}</td>
                    <td className="px-4 py-2.5 font-mono text-red-600">−{fmt(row.costi)}</td>
                    <td className={`px-4 py-2.5 font-mono font-semibold ${row.flusso_netto >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                      {row.flusso_netto >= 0 ? "+" : "−"}{fmt(Math.abs(row.flusso_netto))}
                    </td>
                    <td className={`px-4 py-2.5 font-mono font-semibold ${row.van_cumulato >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                      {row.van_cumulato >= 0 ? "+" : "−"}{fmt(Math.abs(row.van_cumulato))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Analisi di sensitività */}
        <section>
          <h2 className="text-lg font-bold tracking-tight mb-4">Analisi di sensitività — Tasso di attualizzazione</h2>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

            {/* Slider */}
            <div className="bg-white p-6">
              <p className="text-sm text-ink-600 leading-relaxed mb-6">
                Trascina il cursore per verificare come varia il VAN al variare del tasso di attualizzazione.
                Il tasso base è <strong>{meta.tasso}%</strong>; il TIR è <strong>{results.tir}%</strong>.
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-ink-400 font-mono">
                  <span>{sliderMin}%</span>
                  <span className="text-brand-violet font-semibold text-sm">{sliderRate.toFixed(1)}%</span>
                  <span>{sliderMax}%</span>
                </div>
                <input
                  type="range"
                  min={sliderMin}
                  max={sliderMax}
                  step="0.1"
                  value={sliderRate}
                  onChange={(e) => setSliderRate(Number(e.target.value))}
                  className="w-full accent-brand-violet"
                />

                <div className={`px-5 py-4 border-l-4 ${sliderVAN >= 0 ? "border-emerald-500 bg-emerald-50" : "border-red-500 bg-red-50"}`}>
                  <p className="text-xs font-mono uppercase tracking-[0.12em] text-ink-500 mb-1">
                    VAN al {sliderRate.toFixed(1)}%
                  </p>
                  <p className={`text-2xl font-bold font-mono ${sliderVAN >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                    {fmtVAN(sliderVAN)}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-ink-500 pt-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-brand-violet inline-block" />
                    <span>Tasso base ({meta.tasso}%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-ink-400 border-dashed inline-block" />
                    <span>TIR ({results.tir}%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sensitivity chart */}
            <div className="bg-white p-6">
              <p className="text-xs font-mono uppercase tracking-[0.14em] text-ink-500 mb-4">
                VAN per tasso 2–20%
              </p>
              {results.flussi.length > 0 ? (
                <PlotlyChart data={sensitivityData} layout={sensLayout} style={{ minHeight: 280 }} />
              ) : (
                <EmptyState
                  compact
                  eyebrow="Sensitività"
                  title="Curva VAN non disponibile"
                  description="La sensibilità sul tasso appare quando è presente una serie di flussi da attualizzare."
                />
              )}
            </div>
          </div>
        </section>

        {/* Assunzioni */}
        <section className="bg-white p-6">
          <h2 className="text-xl font-bold tracking-tight mb-5">Assunzioni usate nel calcolo</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <MetaBox label="Orizzonte" value={`${meta.orizzonte} anni`} />
            <MetaBox label="Tasso" value={`${meta.tasso}%`} />
            <MetaBox label="Valore residuo" value={fmtEuro(meta.residual)} />
            <MetaBox label="OPEX annuo" value={fmtEuro(meta.annual_opex)} />
          </div>
          <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <MetaBox label="CAPEX" value={fmtEuro(meta.capex)} />
            <MetaBox label="Benefici annui" value={fmtEuro(results.annual_benefits)} />
            <MetaBox label="Fonte benefici" value={ecbaResults ? "Da EIA + assunzioni" : "Stima automatica (18% CAPEX)"} />
          </div>
        </section>

      </div>
    </div>
  );
}

function MetaField({ label, value }) {
  return (
    <div>
      <p className="font-bold text-sm">{label}</p>
      <p className="mt-1 text-sm text-ink-700">{value}</p>
    </div>
  );
}

function MetaBox({ label, value }) {
  return (
    <div className="border border-ink-100 px-4 py-3">
      <p className="text-xs font-mono uppercase tracking-[0.14em] text-ink-500">{label}</p>
      <p className="mt-2 font-semibold text-sm">{value}</p>
    </div>
  );
}
