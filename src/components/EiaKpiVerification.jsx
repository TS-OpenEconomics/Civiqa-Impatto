import { useState, useMemo } from "react";
import kpiData from "../mocks/eiaKpi.json";
import {
  IconArrowRight,
  IconClose,
  IconTrash,
  IconCheck,
} from "./ui/Icons";

// Formattazione locale numero italiano
function formatNumber(value, kpi) {
  if (value === "" || value === null || value === undefined) return "";
  const num = Number(value);
  if (Number.isNaN(num)) return value;
  if (kpi.udm_code === "PCT") return num;
  if (Number.isInteger(num)) return new Intl.NumberFormat("it-IT").format(num);
  return new Intl.NumberFormat("it-IT", { maximumFractionDigits: 4 }).format(num);
}

function buildInitialValues(savedValues) {
  if (savedValues) return savedValues;
  // Per i KPI readonly (es. costi parametrici fissi) precompila con stima_anno
  const initial = {};
  kpiData.gruppi.forEach((g) => {
    g.kpi.forEach((k) => {
      kpiData.anni.forEach((a) => {
        initial[`${k.id}-${a}`] = k.readonly ? k.stima_anno : "";
      });
    });
  });
  return initial;
}

export function EiaKpiVerification({ initialValues, onClose, onRun }) {
  const [values, setValues] = useState(() => buildInitialValues(initialValues));

  const totals = useMemo(() => {
    let filled = 0;
    let total = 0;
    kpiData.gruppi.forEach((g) =>
      g.kpi.forEach((k) =>
        kpiData.anni.forEach((a) => {
          if (k.readonly) return;
          total += 1;
          const v = values[`${k.id}-${a}`];
          if (v !== "" && v !== null && v !== undefined) filled += 1;
        })
      )
    );
    return { filled, total, missing: total - filled };
  }, [values]);

  const allFilled = totals.missing === 0;

  function handleChange(kpiId, year, raw) {
    // Accetta sia "," che "." come decimal separator
    const normalized = String(raw).replace(",", ".");
    setValues((prev) => ({ ...prev, [`${kpiId}-${year}`]: normalized }));
  }

  function autoFillFromStima() {
    setValues(() => {
      const next = {};
      kpiData.gruppi.forEach((g) =>
        g.kpi.forEach((k) =>
          kpiData.anni.forEach((a) => {
            next[`${k.id}-${a}`] = k.stima_anno;
          })
        )
      );
      return next;
    });
  }

  function clearAll() {
    setValues(() => {
      const next = {};
      kpiData.gruppi.forEach((g) =>
        g.kpi.forEach((k) =>
          kpiData.anni.forEach((a) => {
            next[`${k.id}-${a}`] = k.readonly ? k.stima_anno : "";
          })
        )
      );
      return next;
    });
  }

  return (
    <div className="fixed inset-0 bg-bg-page z-50 flex flex-col">
      {/* Top bar */}
      <div className="h-14 bg-white flex items-center justify-end px-6 shrink-0 border-b border-ink-100">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-brand-violet text-sm font-semibold"
        >
          Chiudi e torna al dettaglio progetto
          <IconClose />
        </button>
      </div>
      <div className="h-[3px] bg-accent-lime" />

      {/* Contenuto scrollabile */}
      <div className="flex-1 overflow-y-auto px-6 py-10 md:px-12">
        <div className="overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_top_right,_rgba(199,240,58,0.14),_transparent_24%),linear-gradient(135deg,_#100C1E_0%,_#24153F_56%,_#51358C_100%)] px-6 py-7 text-white shadow-[0_24px_70px_rgba(17,24,39,0.14)] md:px-8">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Verifica gli indicatori stimati per il progetto
        </h1>
        <p className="mt-4 max-w-4xl text-sm leading-relaxed text-white/75">
          Ti presentiamo una stima dei KPI ambientali, economici e sociali associati
          al tuo progetto, elaborata a partire da open data e linee guida di settore.
          Il valore "Stima anno" è suggerito, non obbligatorio: se non ti soddisfacesse,
          puoi inserire tu un valore autonomamente.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
          <StatPill label="Campi compilati" value={String(totals.filled)} />
          <StatPill label="Campi da completare" value={String(totals.missing)} />
          <StatPill label="Stato" value={allFilled ? "Pronto" : "In verifica"} />
        </div>
        </div>

        {/* Tabella */}
        <div className="mt-8 overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ minWidth: "1200px" }}>
              <thead>
                <tr className="bg-ink-700 text-white">
                  <th className="sticky left-0 z-10 bg-ink-700 text-center font-semibold px-4 py-3 w-64">
                    KPI
                  </th>
                  <th className="sticky left-64 z-10 bg-ink-700 text-center font-semibold px-4 py-3 w-32 border-r-2 border-ink-900">
                    Stima anno
                  </th>
                  {kpiData.anni.map((a) => (
                    <th
                      key={a}
                      className="font-semibold text-center px-4 py-3 font-mono"
                    >
                      {a}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {kpiData.gruppi.map((gruppo) => (
                  <RenderGruppo
                    key={gruppo.id}
                    gruppo={gruppo}
                    anni={kpiData.anni}
                    values={values}
                    onChange={handleChange}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Toolbar tabella */}
        <div className="mt-5 flex items-center justify-between">
          <button
            onClick={autoFillFromStima}
            className="flex h-11 items-center gap-3 rounded-full bg-brand-violet px-5 text-sm font-semibold text-white hover:bg-brand-violet-dark"
          >
            Inserisci automaticamente sugli anni
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button
            onClick={clearAll}
            className="text-red-600 text-sm font-semibold flex items-center gap-2"
          >
            Pulisci la distribuzione <IconTrash />
          </button>
        </div>

        {/* Contatore campi */}
        <div className="mt-5 flex items-center gap-2 text-sm">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center ${
            allFilled ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
          }`}>
            {allFilled ? <IconCheck className="w-3.5 h-3.5" /> : "!"}
          </span>
          <span>Campi totali compilati: <strong className="font-mono">{totals.filled}</strong></span>
          <span className="text-ink-300 mx-2">|</span>
          <span>Campi da compilare: <strong className="font-mono">{totals.missing}</strong></span>
          <span className="ml-auto">
            {!allFilled && (
              <button className="text-brand-violet font-semibold underline">
                Vai al primo campo mancante
              </button>
            )}
          </span>
        </div>

        <div className="h-24" />
      </div>

      {/* Footer fisso */}
      <button
        onClick={() => allFilled && onRun(values)}
        disabled={!allFilled}
        className={`h-14 shrink-0 flex items-center justify-end px-10 gap-3 text-base font-semibold ${
          allFilled
            ? "bg-brand-violet text-white hover:bg-brand-violet-dark"
            : "bg-ink-100 text-ink-300 cursor-not-allowed"
        }`}
      >
        Esegui l'analisi
        <IconArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}

function RenderGruppo({ gruppo, anni, values, onChange }) {
  return (
    <>
      <tr className="bg-ink-100">
        <td colSpan={2 + anni.length} className="px-4 py-2 font-bold text-sm">
          {gruppo.nome}
        </td>
      </tr>
      {gruppo.kpi.map((k) => (
        <tr key={k.id} className="border-t border-ink-100">
          <td className="sticky left-0 z-[5] bg-white px-4 py-3 align-top">
            <p className="font-medium leading-snug">{k.nome}</p>
            <p className="mt-1 text-xs text-ink-500 truncate" title={k.fonte}>
              {k.fonte}
            </p>
          </td>
          <td className="sticky left-64 z-[5] bg-white text-right px-4 py-3 border-r-2 border-ink-900">
            <div className="font-mono flex items-baseline justify-end gap-2">
              <span>{formatNumber(k.stima_anno, k)}</span>
              <span className="text-xs text-ink-500">{k.udm_label}</span>
            </div>
          </td>
          {anni.map((a) => (
            <td key={a} className="px-2 py-3">
              <div className="flex items-center gap-1">
                {k.readonly ? (
                  <>
                    <span className="flex-1 text-right font-mono text-ink-500">
                      {formatNumber(k.stima_anno, k)}
                    </span>
                    <span className="w-8 text-xs text-ink-500">{k.udm_label}</span>
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={
                        values[`${k.id}-${a}`] === ""
                          ? ""
                          : formatNumber(values[`${k.id}-${a}`], k)
                      }
                      onChange={(e) => {
                        // Rimuovi separatori di migliaia per editing
                        const raw = e.target.value.replace(/\./g, "").replace(",", ".");
                        onChange(k.id, a, raw === "" ? "" : raw);
                      }}
                      className="h-10 w-full rounded-xl border border-ink-200 bg-ink-50 px-2 text-right font-mono text-sm focus:outline-none focus:border-brand-violet focus:bg-white"
                    />
                    <span className="w-8 text-xs text-ink-500">{k.udm_label}</span>
                  </>
                )}
              </div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function StatPill({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4 backdrop-blur">
      <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-white/55">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
