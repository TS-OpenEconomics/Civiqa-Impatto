import { useMemo, useState } from "react";
import { IconArrowRight, IconClose } from "./ui/Icons";

function fmt(n) {
  if (!n && n !== 0) return "—";
  return new Intl.NumberFormat("it-IT").format(Math.round(n));
}

function defaultBenefitItems() {
  return { gva: true, gettito: true, redditi: false, intangibili: false, intangibiliValue: "" };
}

function defaultSetup(conf) {
  return {
    horizon: conf.vita_utile ?? 25,
    discountRate: 3.5,
    residualValue: conf.capex ? Math.round(conf.capex * 0.1) : 0,
    benefitItems: defaultBenefitItems(),
  };
}

export function EcbaSetup({ project, eiaResults, initialValues, onClose, onRun }) {
  const conf = project.configurazione ?? {};
  const [values, setValues] = useState(() => {
    const defaults = defaultSetup(conf);
    if (!initialValues) return defaults;
    return {
      ...defaults,
      ...initialValues,
      benefitItems: { ...defaults.benefitItems, ...(initialValues.benefitItems ?? {}) },
    };
  });

  const vitaUtile = conf.vita_utile ?? 20;
  const capex = conf.capex ?? 0;
  const opex = conf.opex ?? 0;

  const benefitRows = eiaResults
    ? [
        { key: "gva", label: "Valore Aggiunto Lordo (GVA)", value: Math.round((eiaResults.gva?.totale ?? 0) / Math.max(1, vitaUtile)) },
        { key: "gettito", label: "Gettito fiscale", value: Math.round((eiaResults.gettito?.totale ?? 0) / Math.max(1, vitaUtile)) },
        { key: "redditi", label: "Redditi da lavoro", value: Math.round((eiaResults.redditi?.totale ?? 0) / Math.max(1, vitaUtile)) },
      ]
    : [];

  const annualBenefitsSelected = useMemo(() => {
    if (!eiaResults) return null;
    let total = 0;
    const perAnno = Math.max(1, vitaUtile);
    if (values.benefitItems.gva) total += (eiaResults.gva?.totale ?? 0) / perAnno;
    if (values.benefitItems.gettito) total += (eiaResults.gettito?.totale ?? 0) / perAnno;
    if (values.benefitItems.redditi) total += (eiaResults.redditi?.totale ?? 0) / perAnno;
    if (values.benefitItems.intangibili) total += Number(values.benefitItems.intangibiliValue) || 0;
    return Math.round(total);
  }, [eiaResults, values.benefitItems, vitaUtile]);

  const canRun = Number(values.horizon) >= 1 && Number(values.discountRate) >= 0;

  function update(field, val) {
    setValues((prev) => ({ ...prev, [field]: val }));
  }

  function updateBenefitItem(key, val) {
    setValues((prev) => ({
      ...prev,
      benefitItems: { ...prev.benefitItems, [key]: val },
    }));
  }

  return (
    <div className="fixed inset-0 bg-bg-page z-50 flex flex-col">
      <div className="h-14 bg-white flex items-center justify-end px-6 shrink-0 border-b border-ink-100">
        <button onClick={onClose} className="flex items-center gap-2 text-brand-violet text-sm font-semibold">
          Chiudi e torna al dettaglio progetto
          <IconClose />
        </button>
      </div>
      <div className="h-[3px] bg-accent-lime" />

      <div className="flex-1 overflow-y-auto px-10 py-8 max-w-5xl mx-auto w-full">
        <p className="text-xs font-mono uppercase tracking-[0.18em] text-ink-500">Analisi Costi-Benefici</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Configura le assunzioni economiche</h1>
        <p className="mt-3 text-sm text-ink-700 max-w-3xl leading-relaxed">
          I dati finanziari sono precompilati dalla configurazione del progetto. Seleziona i benefici da includere e definisci il tasso di attualizzazione.
        </p>

        <div className="mt-8 grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-4">

            {/* Parametri di calcolo */}
            <section className="bg-white p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-ink-500 mb-5">Parametri di calcolo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Orizzonte temporale" hint={`Da configurazione: ${vitaUtile} anni`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="number" min="5" max="50"
                      value={values.horizon}
                      onChange={(e) => update("horizon", e.target.value)}
                      className={inputClass}
                    />
                    <span className="text-sm text-ink-500 whitespace-nowrap">anni</span>
                  </div>
                </Field>

                <Field label="Tasso di attualizzazione">
                  <div className="flex items-center gap-3">
                    <input
                      type="number" min="0" max="20" step="0.1"
                      value={values.discountRate}
                      onChange={(e) => update("discountRate", e.target.value)}
                      className={inputClass}
                    />
                    <span className="text-sm text-ink-500">%</span>
                  </div>
                </Field>

                <Field label="Valore residuo (€)" hint="Stimato al termine dell'orizzonte">
                  <input
                    type="number" min="0"
                    value={values.residualValue}
                    onChange={(e) => update("residualValue", e.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>
            </section>

            {/* Benefici da includere */}
            <section className="bg-white p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-ink-500 mb-1">Benefici da includere</h2>
              <p className="text-xs text-ink-400 mb-5">
                {eiaResults
                  ? "Valori annui stimati dall'Analisi di Impatto Economico (GVA, gettito, redditi)."
                  : "Esegui l'EIA prima per importare i benefici automaticamente."}
              </p>

              {!eiaResults && (
                <div className="mb-5 px-4 py-3 bg-amber-50 border border-amber-200 text-sm text-amber-800 leading-relaxed">
                  L'Analisi EIA non è ancora stata eseguita. Senza di essa, i benefici vengono stimati automaticamente (18% del CAPEX/anno). Per risultati più accurati, esegui prima l'EIA.
                </div>
              )}

              <div className="space-y-0">
                {benefitRows.map((row) => (
                  <label key={row.key} className="flex items-center justify-between gap-3 py-3 border-b border-ink-100 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={values.benefitItems[row.key] ?? false}
                        onChange={(e) => updateBenefitItem(row.key, e.target.checked)}
                        className="w-4 h-4 accent-brand-violet shrink-0"
                      />
                      <span className="text-sm font-medium">{row.label}</span>
                    </div>
                    <span className="text-sm font-mono text-emerald-700 whitespace-nowrap">
                      +{fmt(row.value)} €/anno
                    </span>
                  </label>
                ))}

                <div>
                  <label className="flex items-center gap-3 py-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={values.benefitItems.intangibili ?? false}
                      onChange={(e) => updateBenefitItem("intangibili", e.target.checked)}
                      className="w-4 h-4 accent-brand-violet shrink-0"
                    />
                    <span className="text-sm font-medium">Benefici intangibili (immissione manuale)</span>
                  </label>
                  {values.benefitItems.intangibili && (
                    <div className="ml-7 flex items-center gap-3">
                      <input
                        type="number" min="0"
                        value={values.benefitItems.intangibiliValue}
                        onChange={(e) => updateBenefitItem("intangibiliValue", e.target.value)}
                        placeholder="Importo €/anno"
                        className={inputClass + " max-w-[200px]"}
                      />
                      <span className="text-sm text-ink-500">€/anno</span>
                    </div>
                  )}
                </div>
              </div>

              {annualBenefitsSelected !== null && (
                <div className="mt-5 flex items-center justify-between bg-emerald-50 border border-emerald-200 px-4 py-3">
                  <span className="text-sm font-semibold text-emerald-800">Benefici annui selezionati</span>
                  <span className="font-mono font-bold text-emerald-700">+{fmt(annualBenefitsSelected)} €/anno</span>
                </div>
              )}
            </section>
          </div>

          {/* Right panel */}
          <div className="space-y-3">
            <div className="border border-ink-100 bg-white">
              <p className="text-xs font-mono uppercase tracking-[0.16em] text-ink-500 px-6 pt-5">Base dati progetto</p>
              <div className="space-y-4 text-sm px-6 pb-6 pt-3">
                <SummaryRow label="CAPEX totale" value={`${fmt(capex)} €`} />
                <SummaryRow label="OPEX annuo" value={`${fmt(opex)} €`} />
                <SummaryRow label="Vita utile" value={`${vitaUtile} anni`} />
                <SummaryRow label="Anno base" value={String(conf.anno_attualizzazione ?? 2025)} />
              </div>
            </div>

            {eiaResults && (
              <div className="bg-white p-5 border border-emerald-200">
                <p className="text-xs font-mono uppercase tracking-[0.14em] text-emerald-700 mb-3">EIA disponibile</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ink-500">Produzione totale</span>
                    <span className="font-mono font-semibold">{fmt(eiaResults.produzione?.totale)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-500">GVA totale</span>
                    <span className="font-mono font-semibold">{fmt(eiaResults.gva?.totale)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-500">FTE generati</span>
                    <span className="font-mono font-semibold">{fmt(eiaResults.fte?.totale)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="h-20" />
      </div>

      <button
        onClick={() =>
          canRun &&
          onRun({
            horizon: Number(values.horizon),
            discountRate: Number(values.discountRate),
            residualValue: Number(values.residualValue),
            annualOpex: opex,
            benefitItems: values.benefitItems,
          })
        }
        disabled={!canRun}
        className={`h-14 shrink-0 flex items-center justify-end px-10 gap-3 text-base font-semibold ${
          canRun
            ? "bg-brand-violet text-white hover:bg-brand-violet-dark"
            : "bg-ink-100 text-ink-300 cursor-not-allowed"
        }`}
      >
        Esegui l'Analisi Costi-Benefici
        <IconArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold mb-1">{label}</span>
      {hint && <span className="block text-xs text-ink-400 mb-1">{hint}</span>}
      {children}
    </label>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="border-b border-ink-100 pb-3 last:border-0 last:pb-0">
      <p className="text-ink-500 text-xs">{label}</p>
      <p className="mt-1 font-mono font-semibold text-ink-900">{value}</p>
    </div>
  );
}

const inputClass =
  "w-full h-10 px-3 border border-ink-300 bg-white text-sm focus:outline-none focus:border-brand-violet";
