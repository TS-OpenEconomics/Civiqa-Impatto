# Civiqa / Externalytics — POC Flusso EIA

POC frontend del flusso di Analisi di Impatto (EIA) per Civiqa, basata sui mockup Figma forniti. Replica fedelmente: Login, Lista Valutazioni, Wizard di creazione, Dettaglio progetto, Verifica KPI, schermata di esecuzione e i 6 tab dei risultati EIA (Riepilogo, Spese, PIL, Occupazione, Produzione, Redditi) con distribuzione territoriale.

## Setup

```bash
npm install
npm run dev
```

L'app gira su `http://localhost:5173`. Apri quella URL nel browser.

```bash
npm run build      # build di produzione in dist/
npm run preview    # serve la build di produzione
```

## Navigazione dev

In basso a tutte le viste c'è una barra DEV nera che permette di saltare tra le schermate senza dover completare i flussi. Da rimuovere prima di una demo pubblica eliminando il componente `DevNav` in `src/App.jsx`.

L'ordine "naturale" del flusso è: Login → Lista → Wizard (nuova valutazione) → Dettaglio progetto → Verifica KPI EIA → Analisi in corso → Risultati EIA.

## Stack

- **React 19** + **Vite** — bundler veloce, hot reload
- **Tailwind CSS 3** — utility-first, design tokens in `tailwind.config.js`
- **JetBrains Mono** + **Inter** da Google Fonts — per fedeltà al mockup, i numeri sono in monospace
- Zero librerie di chart/map: tutto SVG inline

## Design tokens

Definiti in `tailwind.config.js`:

| Token | Hex | Uso |
|---|---|---|
| `brand-violet` | `#5B21F7` | CTA, accenti, link |
| `brand-violet-dark` | `#2E0B86` | Hover CTA, login hero |
| `brand-violet-light` | `#E8DEFC` | Hero puntinato analisi |
| `brand-violet-soft` | `#F3EEFE` | Sidebar item attivo |
| `accent-lime` | `#C7F03A` | Filetto sotto header, tag "In evidenza" |
| `badge-eia` | `#F8A8E2` | Badge EIA |
| `badge-ecba` | `#A8D8F8` | Badge ECBA |
| `badge-esg` | `#86E8DC` | Badge ESG |
| `ink-{900..100}` | scala grigi | Testo, bordi |
| `bg-page` | `#EEEEF0` | Sfondo principale schermate |
| `bg-dark` | `#0E0E10` | Card scure dei macro-KPI |

Utility CSS personalizzata: `.dots-violet-bg` per il pattern puntinato del hero analisi.

## Struttura

```
src/
├── App.jsx                          ← routing tra viste con useState
├── main.jsx
├── index.css                        ← direttive Tailwind + reset
├── components/
│   ├── Layout.jsx                   ← header + sidebar condivisi
│   ├── Login.jsx                    ← schermata accesso
│   ├── ValutazioniList.jsx          ← lista + card "In evidenza"
│   ├── Wizard.jsx                   ← wizard nuova valutazione (Contesto operativo/Localizzazione)
│   ├── ProjectDetail.jsx            ← dettaglio progetto + analisi disponibili
│   ├── EiaKpiVerification.jsx       ← tabella KPI × Anni con verifica
│   ├── EiaRunning.jsx               ← transizione "Analisi in corso"
│   ├── EiaResults.jsx               ← 6 tab risultati + mappa
│   └── ui/
│       ├── Badge.jsx                ← badge tipi analisi EIA/ECBA/ESG
│       ├── Icons.jsx                ← icone SVG inline
│       └── ItalyMap.jsx             ← mappa Italia stilizzata
└── mocks/
    ├── project.json                 ← progetto di esempio
    ├── eiaKpi.json                  ← KPI con stima anno per la verifica
    └── eiaResults.json              ← risultati EIA: dimensioni, moltiplicatori, regioni
```

## Punti di estensione

**Modello dati KPI.** Ogni KPI nel mock `eiaKpi.json` ha:
- `id`, `nome`, `udm_code`, `udm_label`, `stima_anno`
- `tipo` (`input` editabile, `fisso` readonly)
- `fonte` (citazione obbligatoria per la metodologia MIT 2017)

Quando il backend sarà disponibile, basta sostituire l'import del JSON con una fetch e mantenere lo stesso shape.

**Distribuzione territoriale.** La mappa Italia in `ItalyMap.jsx` è una stilizzazione minima a path SVG geometrici, sufficiente per la POC. In produzione si userebbe un topojson (es. via `react-simple-maps` o `d3-geo`).

**Calcoli derivati.** Tutti i numeri vengono dal mock. Quando arrivano le formule reali, la logica di calcolo va nel backend, non a frontend: il frontend deve solo renderizzare valori pre-calcolati per coerenza con la versionabilità del DOCFAP.

## Note di rendering

- I numeri sono formattati con `Intl.NumberFormat("it-IT")` (separatore migliaia con punto, decimale con virgola)
- L'input degli anni della verifica KPI accetta sia `,` che `.` come decimale e normalizza
- Le card scure dei macro-KPI hanno icona diversa per ogni dimensione (Spese=monete, PIL=barre, Occupazione=persone, Produzione=grafico, Redditi=salvadanaio)
