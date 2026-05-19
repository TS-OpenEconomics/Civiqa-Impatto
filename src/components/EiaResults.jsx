import { useState } from "react";
import results from "../mocks/eiaResults.json";
import projectData from "../mocks/project.json";
import { Badge } from "./ui/Badge";
import { ItalyMap } from "./ui/ItalyMap";
import {
  IconDownload,
  IconCoins,
  IconDecorDiamond,
} from "./ui/Icons";

const TABS = [
  { id: "riepilogo", label: "Riepilogo" },
  { id: "spese", label: "Spese" },
  { id: "pil", label: "PIL" },
  { id: "occupazione", label: "Occupazione" },
  { id: "produzione", label: "Produzione" },
  { id: "redditi", label: "Redditi" },
];

function formatNum(num, decimals = 2) {
  return new Intl.NumberFormat("it-IT", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

function formatInt(num) {
  return new Intl.NumberFormat("it-IT").format(num);
}

export function EiaResults({ onBack }) {
  const [tab, setTab] = useState("riepilogo");
  const p = projectData;
  const m = results.metadata;

  return (
    <div className="min-h-full">
      {/* Hero lilla puntinato */}
      <div className="dots-violet-bg px-10 pt-8 pb-10 relative">
        <nav className="flex items-center gap-2 text-sm">
          <span className="text-brand-violet font-bold tracking-widest">···</span>
          <span className="text-ink-300">›</span>
          <button onClick={onBack} className="underline text-ink-900">
            Dettaglio del progetto
          </button>
          <span className="text-ink-300">›</span>
          <span className="font-bold">Dettaglio dell'Analisi di Impatto</span>
        </nav>

        <p className="mt-5 text-xs text-ink-700">
          Creato il <span className="font-mono font-semibold">{m.creato_il}</span> da{" "}
          <strong>{m.creato_da}</strong> - Ultima modifica il{" "}
          <span className="font-mono font-semibold">{m.ultima_modifica}</span>
        </p>

        <div className="mt-5 bg-white">
          <div className="px-6 py-5 flex items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <IconDecorDiamond />
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold tracking-tight">
                    Analisi di Impatto
                  </h1>
                  <Badge type="EIA" />
                </div>
                <p className="mt-1 text-sm">
                  Del progetto <span className="font-medium">{p.nome}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm shrink-0">
              <button className="flex items-center gap-2 text-brand-violet font-semibold">
                Scarica Report, Metodologia e Fonti
                <IconDownload />
              </button>
              <button className="flex items-center gap-2 text-brand-violet font-semibold">
                Scarica excel
                <IconDownload />
              </button>
            </div>
          </div>
          <div className="border-t border-ink-100 px-6 py-5 grid grid-cols-3 gap-6 text-sm">
            <div>
              <p className="font-bold">Settore</p>
              <p className="mt-1 text-ink-700">{m.settore}</p>
            </div>
            <div>
              <p className="font-bold">Dataset</p>
              <p className="mt-1 text-ink-700">{m.dataset}</p>
            </div>
            <div>
              <p className="font-bold">Metodologia</p>
              <p className="mt-1 text-ink-700">{m.metodologia}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-bg-page">
        <div className="px-10 flex gap-10 justify-center border-b border-ink-100">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`py-4 text-base font-semibold transition-colors relative ${
                tab === t.id ? "text-brand-violet" : "text-ink-500"
              }`}
            >
              {t.label}
              {tab === t.id && (
                <span className="absolute left-0 right-0 -bottom-px h-1 bg-brand-violet" />
              )}
            </button>
          ))}
        </div>

        {/* Contenuto tab */}
        <div className="px-10 py-8">
          {tab === "riepilogo" ? (
            <Riepilogo dimensioni={results.dimensioni} />
          ) : (
            <DettaglioDimensione
              dim={results.dimensioni[tab]}
              tabId={tab}
              distribuzione={results.distribuzione_regionale.spese}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- RIEPILOGO ---------------- */

function Riepilogo({ dimensioni }) {
  const order = ["spese", "pil", "occupazione", "produzione", "redditi"];
  const main = dimensioni[order[0]];

  return (
    <div>
      <div className="grid grid-cols-2 gap-8 items-start">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Riepilogo generale dell'impatto
          </h2>
          <p className="mt-5 text-sm text-ink-700 leading-relaxed">
            {results.riepilogo.descrizione_1}
          </p>
          <p className="mt-4 text-sm text-ink-700 leading-relaxed">
            {results.riepilogo.descrizione_2}
          </p>
        </div>
        <div className="flex justify-end">
          <a
            href="#"
            className="text-brand-violet text-sm font-semibold flex items-center gap-2"
          >
            Scarica la scheda del riepilogo <IconDownload />
          </a>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-12 gap-5">
        {/* Card principale Spese */}
        <div className="col-span-5">
          <MacroCard dim={main} large />
        </div>

        {/* Altre 4 card */}
        <div className="col-span-7 grid grid-cols-2 gap-5">
          {order.slice(1).map((id) => (
            <MacroCard key={id} dim={dimensioni[id]} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MacroCard({ dim, large = false }) {
  return (
    <div
      className={`bg-bg-dark text-white flex flex-col items-center text-center ${
        large ? "p-8 min-h-[460px]" : "p-6 min-h-[220px]"
      }`}
    >
      <h3 className={large ? "text-2xl font-bold" : "text-base font-bold"}>
        {dim.label}
      </h3>
      <div
        className={`my-${large ? "6" : "3"} text-brand-violet-light/70`}
      >
        <DimensionIcon
          dimensione={dim.label.toLowerCase()}
          size={large ? 56 : 36}
        />
      </div>
      <p
        className={`font-mono font-bold tracking-tight ${
          large ? "text-5xl" : "text-2xl"
        }`}
      >
        {dim.unita_breve === "ETP"
          ? formatNum(dim.valore)
          : formatNum(dim.valore)}
      </p>
      <p
        className={`mt-2 font-semibold ${large ? "text-sm" : "text-xs"} text-ink-300`}
      >
        {dim.unita}
      </p>
      {large && (
        <p className="mt-6 text-xs text-ink-300 leading-relaxed">
          {dim.narrativa_corta}
        </p>
      )}
    </div>
  );
}

function DimensionIcon({ dimensione, size = 48 }) {
  // Icone diverse per dimensione, ispirate ai mockup
  if (dimensione.includes("spese")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <ellipse cx="24" cy="20" rx="14" ry="6" />
        <path d="M10 20v8c0 3.3 6.3 6 14 6s14-2.7 14-6v-8" />
        <path d="M10 28v8c0 3.3 6.3 6 14 6s14-2.7 14-6v-8" />
        <ellipse cx="44" cy="38" rx="10" ry="4" />
        <path d="M34 38v6c0 2.2 4.5 4 10 4s10-1.8 10-4v-6" />
      </svg>
    );
  }
  if (dimensione.includes("pil")) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="currentColor">
        <rect x="10" y="36" width="10" height="20" />
        <rect x="24" y="24" width="10" height="32" />
        <rect x="38" y="12" width="10" height="44" />
        <path d="M52 6 L60 14 L52 22 Z" />
      </svg>
    );
  }
  if (dimensione.includes("occupa")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <circle cx="22" cy="22" r="8" />
        <path d="M8 50c0-7 6-12 14-12s14 5 14 12" />
        <circle cx="44" cy="26" r="6" />
        <path d="M36 50c0-5 4-9 10-9s10 4 10 9" />
      </svg>
    );
  }
  if (dimensione.includes("produz")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="8 48 24 32 36 40 56 16" />
        <polyline points="44 16 56 16 56 28" />
      </svg>
    );
  }
  // Redditi → salvadanaio
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 32c0-10 9-16 22-16s22 6 22 16-9 16-22 16-22-6-22-16z" />
      <circle cx="46" cy="28" r="2" fill="currentColor" />
      <path d="M28 16v-4h8v4" />
      <path d="M16 44v6m12-2v4m16-4v4m12-2v6" />
    </svg>
  );
}

/* ---------------- DETTAGLIO DIMENSIONE ---------------- */

function DettaglioDimensione({ dim, tabId, distribuzione }) {
  const isETP = dim.unita_breve === "ETP";

  return (
    <div>
      {/* Titolo + descrizione */}
      <h2 className="text-2xl font-bold tracking-tight">{dim.titolo_dettaglio}</h2>
      <p className="mt-5 text-sm text-ink-700 leading-relaxed max-w-5xl">
        {dim.descrizione_dettaglio}
      </p>

      {/* Macro card + tabella moltiplicatori */}
      <div className="mt-8 grid grid-cols-2 gap-5">
        <div className="bg-bg-dark text-white p-8 flex flex-col items-center text-center min-h-[420px]">
          <h3 className="text-2xl font-bold">{dim.label}</h3>
          <div className="my-6 text-brand-violet-light/70">
            <DimensionIcon dimensione={tabId} size={72} />
          </div>
          <p className="font-mono text-6xl font-bold tracking-tight">
            {formatNum(dim.valore)}
          </p>
          <p className="mt-3 font-semibold text-ink-300">{dim.unita}</p>
          <p className="mt-6 text-sm text-ink-300 leading-relaxed max-w-md">
            {dim.narrativa_corta}
          </p>
        </div>

        <div className="bg-white">
          <div className="bg-ink-900 text-white px-5 py-3 grid grid-cols-[1fr_100px] text-sm font-bold">
            <span>Moltiplicatori di {tabId === "occupazione" ? "occupazione" : "spesa"}</span>
            <span className="text-right">Range</span>
          </div>
          <div className="h-1 bg-accent-lime" />
          <div className="divide-y divide-ink-100">
            {dim.moltiplicatori.map((m, i) => (
              <div
                key={i}
                className="px-5 py-5 grid grid-cols-[1fr_80px_100px] items-center gap-4"
              >
                <div>
                  <p className="font-semibold">{m.label}</p>
                  <p className="text-xs text-ink-500 mt-0.5">({m.sublabel})</p>
                </div>
                <p className="font-mono text-2xl font-bold text-right">
                  {formatNum(m.valore)}
                </p>
                <p className="font-mono text-sm text-ink-500 text-right">
                  {m.range}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Distribuzione territoriale */}
      <div className="mt-10">
        <DistribuzioneTerritoriale
          dim={dim}
          tabId={tabId}
          distribuzione={distribuzione}
        />
      </div>
    </div>
  );
}

/* ---------------- DISTRIBUZIONE TERRITORIALE ---------------- */

function DistribuzioneTerritoriale({ dim, tabId, distribuzione }) {
  const [view, setView] = useState("grafico");
  const [page, setPage] = useState(1);
  const perPage = 8;
  const totalPages = Math.ceil(distribuzione.length / perPage);
  const pageItems = distribuzione.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="bg-white p-6">
      <h3 className="text-xl font-bold">
        Distribuzione territoriale
      </h3>
      <p className="mt-2 text-sm text-ink-700">
        Distribuzione territoriale dell'indicatore <strong>{dim.label}</strong>{" "}
        per regione. {view === "grafico" ? "La mappa mostra l'intensità per regione" : "Colonne: nome della regione, valore espresso in migliaia di euro"}.
      </p>

      {/* Switcher */}
      <div className="mt-5 grid grid-cols-2 max-w-md border-2 border-brand-violet">
        <button
          onClick={() => setView("grafico")}
          className={`py-2 text-sm font-semibold ${
            view === "grafico" ? "bg-brand-violet text-white" : "text-brand-violet"
          }`}
        >
          Grafico
        </button>
        <button
          onClick={() => setView("tabella")}
          className={`py-2 text-sm font-semibold ${
            view === "tabella" ? "bg-brand-violet text-white" : "text-brand-violet"
          }`}
        >
          Dati in tabella
        </button>
      </div>

      {/* Contenuto */}
      <div className="mt-6">
        {view === "grafico" ? (
          <div className="grid grid-cols-[1fr_320px] gap-8 items-start">
            <div>
              <p className="text-sm font-bold">
                {projectData.nome}
              </p>
              <p className="text-xs text-ink-500">
                Confronto geografico dell'impatto sui vari indicatori
              </p>
              <p className="text-xs text-ink-500">
                OpenEconomics per Comune di {projectData.configurazione.localizzazione.split(",").pop().trim()}
              </p>
              <p className="text-xs text-ink-500 mt-0.5">
                Ultimo aggiornamento: 01/01/2025
              </p>

              <div className="mt-4 max-w-md mx-auto">
                <ItalyMap data={distribuzione} tone="violet" />
              </div>

              <p className="mt-4 text-xs text-ink-500 text-right">
                Elaborazione dei dati: OpenEconomics<br />
                Fonte: ISTAT, Fonte Ipsum<br />
                <strong>OpenEconomics</strong>
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <p className="font-bold">Cosa mostra:</p>
                <p className="text-ink-700">
                  la distribuzione per regione delle{" "}
                  {dim.label.toLowerCase()} attivate dal progetto{" "}
                  <span className="font-mono">{formatNum(dim.valore * 11.1)} €</span>.
                </p>
              </div>
              <div>
                <p className="font-bold">Cosa evidenzia:</p>
                <p className="text-ink-700">
                  <strong>Regioni migliori:</strong> Piemonte, Liguria, Puglia.{" "}
                  <strong>Regioni peggiori:</strong> Marche, Alto Adige, Toscana.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <RegioniTable
            items={pageItems}
            unita={dim.unita_breve}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            total={distribuzione.length}
          />
        )}
      </div>
    </div>
  );
}

function RegioniTable({ items, unita, page, totalPages, onPageChange, total }) {
  return (
    <div className="max-w-2xl">
      <div className="bg-ink-700 text-white grid grid-cols-2 px-5 py-3 text-sm font-bold">
        <span>Esternalità</span>
        <span className="text-right">Valore attuale ({unita})</span>
      </div>
      <div className="h-1 bg-accent-lime" />
      <div className="bg-white divide-y divide-ink-100">
        {items.map((r) => (
          <div key={r.regione} className="grid grid-cols-2 px-5 py-3 text-sm">
            <span>{r.regione}</span>
            <span className="text-right font-mono">{formatInt(r.valore)}</span>
          </div>
        ))}
      </div>
      <div className="px-5 py-3 bg-bg-page flex items-center justify-between text-xs">
        <span>{total} totali</span>
        <div className="flex items-center gap-1 font-mono">
          <button onClick={() => onPageChange(1)} disabled={page === 1} className="px-2 disabled:opacity-30">|◁</button>
          <button onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1} className="px-2 disabled:opacity-30">‹</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`px-2 ${p === page ? "font-bold text-brand-violet" : ""}`}
            >
              {p}
            </button>
          ))}
          <button onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-2 disabled:opacity-30">›</button>
          <button onClick={() => onPageChange(totalPages)} disabled={page === totalPages} className="px-2 disabled:opacity-30">▷|</button>
        </div>
      </div>
    </div>
  );
}
