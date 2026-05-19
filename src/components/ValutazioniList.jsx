import { useState } from "react";
import { Badge } from "./ui/Badge";
import {
  IconArrowRight,
  IconChevronLeft,
  IconChevronRight,
} from "./ui/Icons";

const FEATURED = [
  {
    tag: "PROGETTI IN PARTENZA",
    nome: "Restauro Palazzo Reale",
    cup: "I63C22000050127",
    analisi: ["EIA", "ECBA", "ESG"],
    body: (
      <>
        L'intervento inizierà il <span className="font-mono font-semibold">15/09/2025</span>.
        Assicurati che le attività siano completate. Puoi monitorarne l'andamento dal
        modulo <strong>PMO</strong>.
      </>
    ),
    settore: "Attività di raccolta, recupero e smaltimento rifiuti",
    durata: "4 anni, 3 mesi",
  },
  {
    tag: "PROGETTI DA COMPLETARE",
    nome: "Progetti per la sostenibilità ambie...",
    cup: "I63C22000050127",
    analisi: ["EIA", "ECBA"],
    analisiDisabled: ["ESG"],
    body: (
      <>
        Hai avviato solo alcune delle analisi disponibili. Completa le restanti per
        ottenere una valutazione completa del progetto.
      </>
    ),
    settore: "Attività di raccolta, recupero e smaltimento rifiuti",
    durata: "4 anni, 3 mesi",
  },
  {
    tag: "ULTIMI AGGIORNAMENTI",
    nome: "Progetti per la sostenibilità ambie...",
    cup: "I63C22000050127",
    analisi: ["EIA", "ECBA", "ESG"],
    body: (
      <>
        Il progetto è stato aggiornato da <strong>Maria Concetta Rossi</strong> in data{" "}
        <span className="font-mono font-semibold">23/07/2025</span>.
      </>
    ),
    settore: "Attività di raccolta, recupero e smaltimento rifiuti",
    durata: "4 anni, 3 mesi",
  },
];

const PROJECTS = [
  { nome: "Intervento efficientamento servizio idrico", cup: "I63C22000050127", settore: "Infrastrutture ambientali e risorse idriche", analisi: ["EIA", "ECBA", "ESG"], stato: "Approvato", aggiornato: "15/05/2025" },
  { nome: "Restauro Palazzo Reale", cup: "I63C22000050128", settore: "Cultura e beni storici", analisi: ["EIA", "ECBA"], stato: "In valutazione", aggiornato: "10/05/2025" },
  { nome: "Riqualificazione Parco urbano", cup: "I63C22000050129", settore: "Spazi verdi e biodiversità", analisi: ["EIA"], stato: "Bozza", aggiornato: "02/05/2025" },
];

export function ValutazioniList({ onOpenProject, onNewEvaluation }) {
  const [tab, setTab] = useState("dipartimento");

  return (
    <div className="px-10 py-8">
      <div className="flex items-start justify-between gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-brand-violet-soft text-brand-violet flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                <path d="M3 5c0 1.66 4 3 9 3s9-1.34 9-3-4-3-9-3-9 1.34-9 3z" />
              </svg>
            </span>
            <h1 className="text-2xl font-bold tracking-tight">Valutazione</h1>
          </div>
          <p className="mt-5 text-sm text-ink-700 leading-relaxed">
            All'interno di questa sezione potrai configurare i tuoi progetti e consultare
            le valutazioni già elaborate. Creando una nuova valutazione ti verrà chiesto
            di definire un progetto, sul quale potrai eseguire analisi di impatto, analisi
            costi-benefici e analisi ESG.{" "}
            <a href="#" className="text-brand-violet underline">
              Approfondisci ulteriormente
            </a>
          </p>
        </div>
        <button
          onClick={onNewEvaluation}
          className="h-12 px-6 bg-brand-violet text-white text-sm font-semibold flex items-center gap-3 hover:bg-brand-violet-dark"
        >
          <span>Nuova valutazione</span>
          <span className="text-xl leading-none">+</span>
        </button>
      </div>

      <h2 className="mt-10 text-base font-bold">In evidenza</h2>

      <div className="mt-4 relative">
        <button className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 w-9 h-16 bg-ink-700 text-white flex items-center justify-center z-10">
          <IconChevronLeft />
        </button>

        <div className="overflow-hidden">
          <div className="flex gap-5 px-10">
            {FEATURED.map((card, i) => (
              <FeaturedCard key={i} {...card} onOpen={onOpenProject} />
            ))}
          </div>
        </div>

        <button className="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 w-9 h-16 bg-ink-700 text-white flex items-center justify-center z-10">
          <IconChevronRight />
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-ink-500 flex items-center justify-center gap-2">
        <span className="w-4 h-4 rounded-full bg-ink-300 text-white text-[10px] flex items-center justify-center">i</span>
        Usa le frecce per navigare i contenuti
      </p>

      {/* Tabs */}
      <div className="mt-10 border-b border-ink-100 flex gap-10 justify-center">
        <TabButton active={tab === "dipartimento"} onClick={() => setTab("dipartimento")}>
          Valutazioni del tuo dipartimento
        </TabButton>
        <TabButton active={tab === "province"} onClick={() => setTab("province")}>
          Valutazioni delle province e dei comuni
        </TabButton>
      </div>

      {/* Filtri */}
      <div className="mt-5 flex items-center gap-6 text-sm">
        <span className="font-medium">Visualizza solo:</span>
        <Checkbox label="Valutazioni in bozza" />
        <Checkbox label="Valutazioni senza analisi" />
      </div>

      {/* Tabella progetti */}
      <div className="mt-6 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink-900 text-white text-left">
            <tr>
              <th className="px-5 py-3 font-semibold">Progetto</th>
              <th className="px-5 py-3 font-semibold">CUP</th>
              <th className="px-5 py-3 font-semibold">Settore</th>
              <th className="px-5 py-3 font-semibold">Analisi</th>
              <th className="px-5 py-3 font-semibold">Stato</th>
              <th className="px-5 py-3 font-semibold">Aggiornato il</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {PROJECTS.map((p, i) => (
              <tr key={i} className="border-b border-ink-100 hover:bg-bg-page">
                <td className="px-5 py-4 font-medium">{p.nome}</td>
                <td className="px-5 py-4 font-mono text-xs">{p.cup}</td>
                <td className="px-5 py-4 text-ink-700">{p.settore}</td>
                <td className="px-5 py-4">
                  <div className="flex gap-1">
                    {p.analisi.map((a) => (
                      <Badge key={a} type={a} />
                    ))}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <StatoChip stato={p.stato} />
                </td>
                <td className="px-5 py-4 font-mono text-xs">{p.aggiornato}</td>
                <td className="px-5 py-4">
                  <button
                    onClick={onOpenProject}
                    className="text-brand-violet font-semibold flex items-center gap-1"
                  >
                    Apri <IconArrowRight />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FeaturedCard({ tag, nome, cup, analisi, analisiDisabled, body, settore, durata, onOpen }) {
  return (
    <div className="min-w-[440px] flex-1 bg-ink-900 text-white flex flex-col">
      {/* Tag verde lime */}
      <div className="bg-accent-lime text-ink-900 px-4 py-1.5 text-xs font-bold tracking-wider self-start">
        {tag}
      </div>

      <div className="px-5 pt-4 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-bold text-lg leading-snug">{nome}</h3>
            <p className="mt-1 text-xs font-mono text-ink-300">CUP {cup}</p>
          </div>
          <div className="flex gap-1 shrink-0 mt-1">
            {analisi.map((a) => (
              <Badge key={a} type={a} />
            ))}
            {analisiDisabled?.map((a) => (
              <Badge key={a} type={a} dimmed />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white text-ink-900 px-5 py-5 grid grid-cols-2 gap-5 text-sm">
        <div className="leading-relaxed">{body}</div>
        <div className="flex flex-col gap-3">
          <div>
            <p className="font-bold">Settore</p>
            <p className="text-ink-700">{settore}</p>
          </div>
          <div>
            <p className="font-bold">Durata lavori</p>
            <p className="text-ink-700">{durata}</p>
          </div>
        </div>
      </div>

      <button
        onClick={onOpen}
        className="bg-brand-violet h-12 text-white text-sm font-semibold flex items-center justify-between px-5 hover:bg-brand-violet-dark"
      >
        <span>Vai al dettaglio</span>
        <IconArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`py-3 text-sm font-semibold transition-colors relative ${
        active ? "text-brand-violet" : "text-ink-500"
      }`}
    >
      {children}
      {active && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-brand-violet" />}
    </button>
  );
}

function Checkbox({ label }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" className="w-4 h-4 accent-brand-violet" />
      <span>{label}</span>
    </label>
  );
}

function StatoChip({ stato }) {
  const map = {
    Approvato: "bg-emerald-100 text-emerald-700",
    "In valutazione": "bg-amber-100 text-amber-700",
    Bozza: "bg-ink-100 text-ink-700",
  };
  return (
    <span className={`px-2 py-0.5 text-xs font-semibold ${map[stato] || ""}`}>{stato}</span>
  );
}
