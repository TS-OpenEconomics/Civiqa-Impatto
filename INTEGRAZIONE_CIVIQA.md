# Integrazione Civiqa — POC → app/ (re-skin + impatto rivisto)

**Branch:** `civiqa-1.0` · **Data:** 2026-06-04 · **Autore:** Claude (Opus 4.8)

## 0. Obiettivo (confermato con l'utente)

L'app finale è **`app/`** (la cartella "fuori"). Deve:

1. **Avere esattamente le funzionalità e la struttura di `Civiqa_POC/` di oggi** — tutte le sezioni: Dashboard Impatti, DOCFAP (wizard 7 fasi + list + detail), Pianificazione, Genie, Data Room, Risorse.
2. **Con la skin UI di `app/`** — palette violet `#5B21F7` / lime `#C7F03A`, font Inter + JetBrains Mono, chrome (header + sidebar) in stile `app/`.
3. **Con il modulo impatto di `app/`** — EIA (moltiplicatori SAM) / ECBA (VAN/BCR/TIR) / ESG (rating), motori in `app/src/lib/`. Il wizard "Valutazione" 14-step della POC viene **scartato**; ogni rimando a "valutazione/impatto" delle sezioni POC viene **ricollegato** al flusso `/valutazioni` di `app/` nella nuova UI.
4. **Genie = placeholder keyless** — nessuna chiamata API (no Anthropic/Databricks/Express).

Dopo l'integrazione, `Civiqa_POC/` verrà **cancellata**. Quindi tutto deve vivere dentro `app/`, senza dipendere da `Civiqa_POC/`.

> Nota stato reale: `app/src/docfap/` è oggi **vuota** su entrambi i branch (`civiqa-1.0` e `main`, identici). L'integrazione descritta nella memoria di progetto non è su nessun branch → si parte **da zero**.

## 1. Le due app a confronto

| | `app/` (host, sopravvive) | `Civiqa_POC/` (sorgente, da cancellare) |
|---|---|---|
| Nome | `civiqa-eia-poc` | `docfap-poc` |
| Linguaggio | JS/JSX | TypeScript (.ts/.tsx) |
| Router | react-router-dom v6 | react-router-dom v7 |
| Styling | Tailwind (violet/lime, Inter/JetBrains) | Tailwind (bluette/lime Atkinson) + CSS custom props `var(--color-*)` da `ds-tokens.css` |
| Charts | Plotly, Leaflet | recharts (solo Genie) |
| State | Context (Auth/Project/Toast) | custom store `useSyncExternalStore` + Context (Auth/Valutazione/Planning) |
| Vite base | `/Civiqa-Impatto/` | `/` |
| Sezioni | solo `/valutazioni` (EIA/ECBA/ESG) | `/impatti/*`, `/genie`, `/data-room`, `/risorse`, HomeLauncher |

## 2. Strategia architetturale

**Host = `app/`.** Si **copia il sorgente POC dentro `app/src/poc/`** preservando la struttura e il TypeScript (Vite/esbuild transpila `.tsx` senza `tsc` gate; build = `vite build`). Le sezioni POC diventano il contenuto principale dell'app, renderizzate **dentro il Layout (chrome) di `app/`** e **re-skinnate** ai token di `app/`. Il modulo EIA/ECBA/ESG di `app/` resta intatto ed è la "Valutazione".

Perché copiare invece di riscrivere TS→JSX: l'utente vuole "esattamente come funziona oggi". Riscrivere ~centinaia di file introdurrebbe regressioni. Copiando il sorgente as-is e re-skinnando via token + tailwind config, si preserva il comportamento e si applica la grafica con poche modifiche mirate.

### 2.1 Re-skin senza toccare ogni componente

I componenti POC si colorano in due modi → due leve globali:

1. **CSS custom properties** (`var(--color-*)` da `ds-tokens.css`). → Creo **`app/src/poc/poc-theme.css`** che importa i token POC e poi **sovrascrive i VALORI** dei token semantici sulla palette `app/`:
   - `--color-background-primary` `#4400b3` → `#5B21F7` (violet)
   - `--color-text-secondary` / `--color-icon-secondary` / `--color-border-primary` → `#5B21F7`
   - `--color-background-accent` `#b9ff69` → `#C7F03A` (lime)
   - `--color-border-focus` `#0000ff` → `#5B21F7` (focus ring brand)
   - font: Atkinson → Inter (testo) / JetBrains Mono (dati)
   - `--radius-smooth` resta 2px (coerente con app).
2. **Classi Tailwind con nomi colore POC** (`bluette-*`, `lime`, `status-*`, `gray-*`, `boxShadow s/m/l`, `font-serif`). → **Estendo `app/tailwind.config.js`** `theme.extend` mappando quei nomi alla palette `app/` e **aggiungo il glob** `./src/**/*.{ts,tsx}` al `content` (altrimenti Tailwind non genera le classi usate dai .tsx → componenti scoloriti). Font `serif`→Inter.

### 2.2 Routing e navigazione

- Router resta **`app/src/router.jsx`** (v6). Aggiungo le rotte POC dentro il `LayoutRoute` (così ereditano il chrome di `app/`):
  - `/impatti/dashboard` → `ImpattDashboard`
  - `/impatti/docfap` → `DocfapList` · `/impatti/docfap/detail` → `DocfapDetail`
  - `/impatti/pianificazione` → `PianificazioneModule`
  - `/genie` → placeholder · `/data-room` → `DataRoomPage` · `/risorse` → `RisorsePage`
  - `/impatti/valutazione` → **redirect a `/valutazioni`** (modulo impatto di app).
- **Sidebar di `app/`** (`Layout.jsx`) estesa con due gruppi:
  - **Impatti**: Dashboard (`/impatti/dashboard`), Valutazione (`/valutazioni`, emphasize), DOCFAP (`/impatti/docfap`), Pianificazione (`/impatti/pianificazione`), Osservatorio (disabled).
  - **Strumenti**: Genie (`/genie`), Data Room (`/data-room`), Risorse (`/risorse`).
- POC's `HomeLauncher`/`AppShell`/`SideNav`/`TopNav` **non** usati come chrome (sostituiti dal Layout di app = "skin di app"); restano nel tree come riferimento ma non montati.
- I `Link`/`navigate` interni POC verso `/impatti/valutazione` vengono ripuntati a `/valutazioni`.

### 2.3 Provider e store

- Provider top-level = quelli di `app/` (Auth/Project/Toast) in `main.jsx`.
- I componenti POC che usano contesti propri (`AuthContext`, `ValutazioneWizardContext`, `PlanningContext`, wizardStore) vengono avvolti **a livello di rotta** con i provider POC necessari (la `ValutazioneModule` POC viene scartata, quindi `ValutazioneWizardContext` probabilmente non serve). `wizardStore` è uno store singleton (useSyncExternalStore) → funziona senza provider.
- POC `AuthGuard` (per Genie) → neutralizzato (Genie diventa placeholder pubblico).

### 2.4 Dipendenze

- Installare in `app/`: **`recharts`** (se serve a qualche grafico POC mantenuto), **`papaparse`** (se importato a runtime da file mantenuti). Verificare gli import reali prima.
- **Escludere dal path attivo**: `@anthropic-ai/sdk`, `express`, `cors`, `dotenv` (server `/api`, Genie reale). Stub di `genieService` o esclusione del file.
- `leaflet`/`plotly` già in `app/` (usati dal modulo impatto).

## 3. Piano operativo (fasi)

1. **Baseline**: toolchain node portatile (`.tools/node-v24.15.0-win-x64`), `npm.cmd run build` su `app/` deve essere verde prima di iniziare.
2. **Copia sorgente**: `Civiqa_POC/src/**` → `app/src/poc/**` (escludendo `__tests__`, `main.tsx`, `App.tsx`, `App.css`, file server). Aggiungere `app/tsconfig.json` permissivo. Installare deps mancanti.
3. **Re-skin**: `poc-theme.css` (remap token + font) importato dal barrel POC; estendere `tailwind.config.js` (colori POC + glob ts/tsx); gestire `@font-face` Atkinson → Inter.
4. **Routing + nav**: rotte POC in `router.jsx`; sidebar `Layout.jsx`; barrel `app/src/poc/index.jsx` che importa il tema e ri-esporta le pagine.
5. **Impatto**: redirect `/impatti/valutazione` → `/valutazioni`; rewire link interni; widget Dashboard "Valutazione" → `/valutazioni`.
6. **Genie keyless**: placeholder; rimuovere import Anthropic/Databricks.
7. **Build verde + fix**: classi Tailwind mancanti, token, font, import rotti; rifinitura visiva (icone, spacing, contrasti, dark non richiesto).

## 4. Rischi / note

- **Classi Tailwind POC non generate** se manca il glob ts/tsx o i nomi colore → componenti scoloriti. (lezione nota)
- **Charting hardcoded chiaro**: i grafici POC/recharts vanno verificati sui colori brand.
- **`vite.config.js` base** `/Civiqa-Impatto/`: i fallback `window.location.assign` POC devono usare `import.meta.env.BASE_URL`.
- **Asset POC** (logo comune, hero, ds) vanno copiati sotto `app/src/poc/assets`.
- **Comportamento POC "corretto" as-is**: `POC_MODE` hardcoded nei punteggi finali DOCFAP è intenzionale (è una POC) → non "correggere".

## 5. Definizione di "fatto"

- `npm run build` su `app/` verde.
- Tutte le sezioni POC raggiungibili dal menu, re-skinnate (violet/lime/Inter), funzionanti come oggi.
- "Valutazione" apre il flusso EIA/ECBA/ESG di `app/`.
- Genie placeholder senza errori/chiavi.
- Nessuna dipendenza residua da `Civiqa_POC/`.
