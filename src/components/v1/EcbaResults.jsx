import { useMemo, useState } from "react";
import { Badge } from "../ui/Badge";
import { PlotlyChart } from "../charts/PlotlyChart";
import { useToast } from "../../hooks/useToast";

function fmt(n) {
  if (n == null) return "—";
  return new Intl.NumberFormat("it-IT").format(Math.abs(Math.round(n)));
}

function buildFallback(assumptions) {
  const horizon = assumptions?.horizon ?? 25;
  const rate = assumptions?.discountRate ?? 3.5;
  const capex = 5_000_000;
  const opex = 200_000;
  const annualBenefits = 820_000;
  const flussi = [];
  let van_cum = -capex;
  let pvB = 0;
  let pvC = capex;
  for (let t = 1; t <= horizon; t++) {
    const benefici = Math.round(annualBenefits);
    const costi = opex;
    const df = Math.pow(1 + rate / 100, t);
    pvB += benefici / df;
    pvC += costi / df;
    van_cum += (benefici - costi) / df;
    flussi.push({ anno: t, benefici, costi, flusso_netto: benefici - costi, van_cumulato: Math.round(van_cum) });
  }
  const bcr = pvB / pvC;
  const payback = flussi.findIndex((f) => f.van_cumulato >= 0) + 1;
  return {
    benefici_totali: Math.round(pvB),
    costi_totali: Math.round(pvC),
    van: Math.round(van_cum),
    bcr,
    irr: 3.86,
    payback_period: payback > 0 ? payback : horizon,
    flussi,
  };
}

function KpiHighlight({ label, value, cls, note }) {
  return (
    <div className={`rounded p-4 ${cls}`}>
      <p className="text-xs font-medium mb-1 opacity-80">{label}</p>
      <p className="text-2xl font-bold font-mono leading-none">{value}</p>
      {note ? <p className="text-xs mt-2 opacity-70 leading-relaxed">{note}</p> : null}
    </div>
  );
}

export function EcbaResults({ project, ecbaResults, assumptions, analysis, onBack }) {
  const { toast } = useToast();
  const r = useMemo(() => ecbaResults || buildFallback(assumptions), [ecbaResults, assumptions]);
  const p = project || {};

  function handleDownload() {
    toast({ title: "Download avviato", description: "Il report verrà scaricato a breve." });
  }

  const bcr = r.bcr ?? (r.benefici_totali / r.costi_totali);
  const economicallySound = r.van >= 0 && bcr >= 1;

  const cashFlowTrace = r.flussi
    ? [{
        x: r.flussi.map((f) => f.anno),
        y: r.flussi.map((f) => f.van_cumulato / 1_000_000),
        type: "scatter",
        mode: "lines+markers",
        name: "VAN cumulato (M€)",
        line: { color: "#5B21F7", width: 2 },
        marker: { size: 4 },
      }]
    : [];

  return (
    <div className="px-4 py-6 md:px-8">
      {/* Breadcrumbs */}
      <nav className="text-xs text-ink-400 flex flex-wrap items-center gap-1.5 mb-4">
        <span>•••</span>
        <span>›</span>
        <button type="button" onClick={onBack} className="hover:text-brand-violet transition-colors">
          Dettaglio del progetto
        </button>
        <span>›</span>
        <span className="text-ink-700 font-medium">Dettaglio dell'Analisi Costi-Benefici</span>
      </nav>

      <p className="text-xs text-ink-400 mb-5">
        Creato il <span className="font-medium">12/05/2025</span> da Comune di (nome del comune), (Mario Rossi) – Ultima modifica il <span className="font-medium">15/05/2025</span>
      </p>

      {/* Analysis header card */}
      <div className="bg-white border border-ink-100 rounded p-5 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-badge-ecba/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-700" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="10" cy="10" r="7" />
                <path d="M7 10h6M10 7v6" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <h1 className="text-base font-bold text-ink-900">Analisi Costi-Benefici</h1>
                <Badge type="ecba" />
              </div>
              <p className="text-xs text-ink-500">Del progetto {p.nome || "—"}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-brand-violet">
            <button type="button" onClick={handleDownload} className="flex items-center gap-1 hover:underline">
              Scarica Report, Metodologia e Fonti
            </button>
            <button type="button" onClick={handleDownload} className="flex items-center gap-1 hover:underline">
              Scarica documento
            </button>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-ink-100 grid grid-cols-3 gap-4 text-xs">
          <div>
            <p className="text-ink-400 mb-0.5">Settore</p>
            <p className="text-ink-900 font-medium">{p.configurazione?.settore || "Infrastrutture ambientali e risorse idriche"}</p>
          </div>
          <div>
            <p className="text-ink-400 mb-0.5">Dataset</p>
            <p className="text-ink-900 font-medium">Matrice contabilità sociale</p>
          </div>
          <div>
            <p className="text-ink-400 mb-0.5">Metodologia</p>
            <p className="text-ink-900 font-medium">SAM EU-ITA 2019</p>
          </div>
        </div>
      </div>

      {/* Intro text */}
      <div className="bg-white border border-ink-100 rounded p-6 mb-6">
        <p className="text-sm text-ink-700 leading-relaxed mb-4">
          Questa sezione classifica i principali indicatori dell'Analisi Costi-Benefici Economica (ECBA),
          lo strumento usato per misurare la validità a medio-lungo periodo. L'analisi definisce il valore
          economico comparando i costi con i benefici (sociali, economici e ambientali) generati per la
          collettività, offrendo un bilancio del valore netto prodotto.
        </p>
        <p className="text-sm text-ink-700 leading-relaxed">
          Gli indicatori misurano la capacità del progetto di trasformare le risorse in vantaggi economici,
          sociali e ambientali. Un rapporto benefici/costi superiore a 1 indica la sostenibilità.
        </p>
      </div>

      {/* KPI highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <KpiHighlight
          label="Benefici economici:"
          value={`${fmt(r.benefici_totali)} €`}
          cls="bg-green-50 border border-green-200 text-green-900"
          note="rappresentano il valore attualizzato degli impatti positivi generali del progetto (es. risparmi energetici, miglioramento della qualità, sicurezza, attrattività territoriale)."
        />
        <KpiHighlight
          label="Costi economici:"
          value={`${fmt(r.costi_totali)} €`}
          cls="bg-ink-50 border border-ink-200 text-ink-900"
          note="Includono i costi sostenuti per realizzare l'intervento, attualizzati sul periodo di analisi."
        />
        <KpiHighlight
          label="VANE:"
          value={`${r.van >= 0 ? "+" : "−"}${fmt(r.van)} €`}
          cls={`border ${economicallySound ? "bg-brand-violet-light border-brand-violet text-brand-violet-dark" : "bg-red-50 border-red-200 text-red-900"}`}
          note={economicallySound
            ? "è il Valore Attuale Netto Economico. Un valore positivo come questo indica che i benefici superano i costi, rendendo l'intervento economicamente vantaggioso."
            : "Il VANE negativo segnala che i costi superano i benefici attualizzati nel periodo considerato."}
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-ink-100 rounded p-5">
          <p className="text-xs text-ink-500 mb-1">Payback period:</p>
          <p className="text-2xl font-bold font-mono text-ink-900">{r.payback_period} Anni</p>
          <p className="text-xs text-ink-500 mt-2 leading-relaxed">
            è il tempo necessario per recuperare, attraverso i benefici generati, i costi di investimento.
          </p>
        </div>
        <div className="bg-white border border-ink-100 rounded p-5">
          <p className="text-xs text-ink-500 mb-1">Rapporto benefici/costi:</p>
          <p className="text-2xl font-bold font-mono text-ink-900">{bcr.toFixed(2)}</p>
          <p className="text-xs text-ink-500 mt-2 leading-relaxed">
            Indica che per ogni euro speso, se ne generano {bcr.toFixed(2)} di benefici.
          </p>
        </div>
        <div className="bg-white border border-ink-100 rounded p-5">
          <p className="text-xs text-ink-500 mb-1">TIRЕ:</p>
          <p className="text-2xl font-bold font-mono text-ink-900">{(r.irr ?? 3.86).toFixed(2)}%</p>
          <p className="text-xs text-ink-500 mt-2 leading-relaxed">
            è il tasso interno di rendimento economico, cioè il rendimento annuale implicito del progetto.
          </p>
        </div>
      </div>

      {/* Cash flow chart */}
      {cashFlowTrace.length > 0 && (
        <div className="bg-white border border-ink-100 rounded p-6">
          <h3 className="text-sm font-bold text-ink-900 mb-4">Flusso di cassa cumulato (M€)</h3>
          <PlotlyChart
            data={cashFlowTrace}
            layout={{
              height: 280,
              margin: { l: 40, r: 20, t: 10, b: 40 },
              xaxis: { title: "Anno", tickfont: { size: 11 } },
              yaxis: { title: "VAN cumulato (M€)", tickfont: { size: 11 } },
              shapes: [{ type: "line", x0: 0, x1: r.flussi?.length ?? 25, y0: 0, y1: 0, line: { color: "#999", dash: "dot" } }],
            }}
          />
        </div>
      )}
    </div>
  );
}
