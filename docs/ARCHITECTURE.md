# Civiqa Impatto — Architecture & Developer Guide

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Starting the Server](#3-starting-the-server)
4. [Provider Hierarchy & State Flow](#4-provider-hierarchy--state-flow)
5. [localStorage Keys](#5-localstorage-keys)
6. [Routing Structure](#6-routing-structure)
7. [The V1 / V2 Versioning System](#7-the-v1--v2-versioning-system)
8. [V1 Components — What They Do](#8-v1-components--what-they-do)
9. [V2 Components — What They Do](#9-v2-components--what-they-do)
10. [Shared Business Logic (Engines)](#10-shared-business-logic-engines)
11. [Mock Data](#11-mock-data)
12. [Lazy Loading Strategy](#12-lazy-loading-strategy)
13. [Tailwind Design Tokens](#13-tailwind-design-tokens)

---

## 1. Project Overview

Civiqa Impatto (marketed as **Externalytics**) is a single-page application for Italian public administrations to configure infrastructure projects and run three types of economic analyses:

| Code | Name | What it measures |
|------|------|-----------------|
| **EIA** | Analisi di Impatto Economico | Macroeconomic effects: GDP, employment, income, production value |
| **ECBA** | Analisi Costi-Benefici Economica | Net Present Value, BCR, IRR, payback period |
| **ESG** | Analisi di Sostenibilità | Environmental, Social, Governance score and rating |

The app supports **two coexisting visual designs** — v1 (the original Classic design, recreated from mockups) and v2 (the current redesign) — switchable at runtime without any data loss or page reload.

---

## 2. Tech Stack

| Layer | Tool | Version |
|-------|------|---------|
| UI framework | React | 19 |
| Routing | React Router | 6 |
| Build tool | Vite | 8 |
| CSS | Tailwind CSS | 3 |
| Charts | Plotly.js | (lazy-loaded) |
| Maps | Leaflet | (lazy-loaded via LeafletMap) |
| Runtime (portable) | Node.js | 24.15.0 (embedded at `.tools/`) |

No backend: all state is client-side, persisted to `localStorage`.

---

## 3. Starting the Server

### Development mode (hot-reload)

The project ships with a **portable Node.js** runtime so no global installation is required.

```powershell
# From the project root in PowerShell:
.\.tools\node-v24.15.0-win-x64\node.exe node_modules\vite\bin\vite.js

# Or if you have Node installed globally:
npx vite
```

The dev server starts on **http://localhost:5173** with HMR (hot module replacement).

### Production build

```powershell
# Build the dist/ folder:
.\.tools\node-v24.15.0-win-x64\node.exe node_modules\vite\bin\vite.js build

# Serve the built dist/:
.\.tools\node-v24.15.0-win-x64\node.exe serve-dist.js
```

The `start_poc_portable.ps1` script automates the serve step. It looks for the portable Node at `.tools/node-v24.15.0-win-x64/node.exe` first, falls back to system Node, then runs `serve-dist.js` which serves the pre-built `dist/` folder as a static site.

> **Important**: `start_poc_portable.ps1` serves the **pre-built** `dist/`. It does NOT start the Vite dev server. Always run the Vite build first if you changed source code.

### Demo credentials

```
Email:    demo@civiqa.it
Password: civiqa2024
```

---

## 4. Provider Hierarchy & State Flow

The provider tree (defined in `src/main.jsx`) wraps the entire app:

```
BrowserRouter
  └── VersionProvider          ← which UI version to show (v1 or v2)
        └── AuthProvider       ← authentication state (user, token)
              └── ProjectProvider  ← all project workspaces + UI state
                    └── ToastProvider  ← ephemeral toast notifications
                          └── App → AppRouter → Layout → page components
```

Each provider stores state in `localStorage` and restores it on page load, making the session fully persistent across browser refreshes.

### AuthContext (`src/contexts/AuthContext.jsx`)

- **What it stores**: `{ user, token }` — whether the user is logged in and who they are
- **Key method**: `login(email, password)` — simulates a 1500ms network delay, validates against hardcoded demo credentials, writes a token
- **Consumed by**: `ProtectedRoute` (redirects to `/login` if not authenticated), `Layout` (displays user name/initials), `LoginV1` and `Login`

### ProjectContext (`src/contexts/ProjectContext.jsx`)

The most complex context. It manages all project workspaces and the UI search/filter state.

- **What it stores**: `projects[]` (array of workspace objects), `draftProject` (the project being configured in the Wizard), `uiState` (search term, sort mode, sector filters)
- **A workspace object** has the shape:
  ```js
  {
    id: "PROJ-001",
    project: { nome, cup, descrizione, stato, configurazione: { settore, capex, opex, ... } },
    eiaInputs: null,      // set after EiaScenario form
    eiaResults: null,     // set after EiaRunning completes
    ecbaInputs: { horizon: 25, discountRate: 3.5, ... },
    ecbaResults: null,
    esgAnswers: null,
    esgResults: null,
    analyses: {
      eia:  { status: "needs_input" | "running" | "completed", updatedAt },
      ecba: { status: "needs_input" | "running" | "completed", updatedAt },
      esg:  { status: "needs_input" | "running" | "completed", updatedAt },
    }
  }
  ```
- **Seed data**: On first load (empty localStorage), `buildSeedProjects()` in `src/lib/projectState.js` creates 3 demo projects so the app is never empty.
- **Key methods**: `addProject`, `saveProjectConfig`, `saveAnalysisInputs`, `updateAnalysis`, `duplicateProject`, `deleteProject`, `clearAnalysisData`

### VersionContext (`src/contexts/VersionContext.jsx`)

- **What it stores**: `version` — either `"v1"` or `"v2"`, defaulting to `"v2"` on first load
- **Persisted**: `localStorage` under key `civiqa.version`
- **Consumed by**: `router.jsx` (every version-aware route reads this to decide which component to render), `Layout.jsx` (`VersionSwitcher` reads and writes it)

### ToastContext (`src/hooks/useToast.jsx`)

- **What it stores**: queue of `{ id, title, description }` toast objects
- **Consumed by**: any component that calls `useToast().toast({ title, description })` — currently the download buttons in EIA, ECBA, and ESG results pages

---

## 5. localStorage Keys

| Key | Written by | Purpose |
|-----|-----------|---------|
| `civiqa.auth.v1` | `AuthContext` | Auth state: `{ user, token }` |
| `civiqa.projects.v1` | `ProjectContext` | Array of all project workspaces |
| `civiqa.ui.v1` | `ProjectContext` | UI state: `{ searchTerm, debouncedSearchTerm, sectorFilters, sortMode }` |
| `civiqa.version` | `VersionContext` | Selected UI version: `"v1"` or `"v2"` |
| `civiqa.sidebar.collapsed` | `Layout` | Sidebar collapsed state: `"true"` or `"false"` |
| `auth_token` | `AuthContext` | Duplicate token write (legacy, not read back) |

---

## 6. Routing Structure

All routes are defined in `src/router.jsx`. The structure is:

```
/login                               ← LoginScreen (version-aware: LoginV1 or Login)
/                                    ← redirects to /valutazioni
/valutazioni                         ← ValutazioniListRoute (version-aware)
/valutazioni/nuova/intro             ← ValutazioneIntroRoute (v2 only)
/valutazioni/nuova                   ← WizardRoute (v2 only — multi-step config form)
/valutazioni/nuova/riepilogo         ← ConfigurationSummaryRoute (v2 only)
/valutazioni/nuova/completata        ← ConfigurationCompleteRoute (v2 only)
/valutazioni/:id                     ← ProjectDetailRoute (version-aware)
/valutazioni/:id/eia                 ← EiaInputRoute (v2 only — EiaScenario form)
/valutazioni/:id/eia/running         ← EiaRunningRoute (simulated computation)
/valutazioni/:id/eia/results         ← EiaResultsRoute (version-aware)
/valutazioni/:id/ecba                ← EcbaSetupRoute (v2 only — EcbaSetup form)
/valutazioni/:id/ecba/running        ← EcbaRunningRoute
/valutazioni/:id/ecba/results        ← EcbaResultsRoute (version-aware)
/valutazioni/:id/esg                 ← EsgFormRoute (v2 only — EsgQuestionnaire form)
/valutazioni/:id/esg/running         ← EsgRunningRoute
/valutazioni/:id/esg/results         ← EsgResultsRoute (version-aware)
```

### Route guards

- `ProtectedRoute` wraps all non-login routes; redirects to `/login` if `isAuthenticated` is false
- `LayoutRoute` wraps the main content in the `Layout` component (header + sidebar)
- `useWorkspace()` is a local hook that reads `:id` from params and calls `getProject(id)`, returning `null` if not found (which then redirects back to `/valutazioni`)

### Analysis navigation logic

`navigateToAnalysis(workspace, analysisId, navigate)` decides where to navigate when a user clicks an analysis button:

- `"completed"` → go directly to `/results`
- `"running"` → go to `/running` (so the simulation can finish)
- `"needs_input"` → go to the input form

---

## 7. The V1 / V2 Versioning System

### Philosophy

Both versions share **100% of the business logic** — the same contexts, engines, mock data, and routing. Only the **presentation layer** differs. No v1 component imports a v2 component or vice versa. They coexist as completely independent subtrees under `src/components/v1/` and `src/components/`.

### How switching works — step by step

1. **User clicks the switcher** in the sidebar (`VersionSwitcher` in `Layout.jsx`)
2. `setVersion("v1")` or `setVersion("v2")` is called — this updates `VersionContext` state AND writes to `localStorage`
3. Because `version` is React state, **every consumer re-renders immediately**
4. In `router.jsx`, every version-aware route function calls `const { version } = useVersion()` and returns either the v1 or v2 component:
   ```jsx
   return version === "v1" ? <ProjectDetailV1 {...props} /> : <ProjectDetail {...props} />;
   ```
5. The URL **does not change** — same route, different component
6. Props passed to v1 and v2 components are **identical** — both receive the same `project`, `analyses`, `results`, `onBack`, `onOpenEia` etc.
7. On the next page load, `VersionContext` reads from `localStorage` and restores the last selected version

### Which routes are version-aware

| Route | V1 component | V2 component |
|-------|-------------|-------------|
| `/login` | `LoginV1` | `Login` |
| `/valutazioni` | `ValutazioniListV1` | `ValutazioniList` |
| `/valutazioni/:id` | `ProjectDetailV1` | `ProjectDetail` |
| `/valutazioni/:id/eia/results` | `EiaResultsV1` | `EiaResults` |
| `/valutazioni/:id/ecba/results` | `EcbaResultsV1` | `EcbaResults` |
| `/valutazioni/:id/esg/results` | `EsgResultsV1` | `EsgResults` |

Routes with **no v1 equivalent** (Wizard, intro, summary, complete, input forms, running screens) always render the v2 component regardless of the selected version. This is intentional — the configuration and analysis-launch flows are new features that did not exist in v1.

### The VersionSwitcher component

Located in `Layout.jsx` (above the nav in the sidebar):

```jsx
function VersionSwitcher({ isCollapsed }) {
  const { version, setVersion } = useVersion();
  if (isCollapsed) return null;   // hides when sidebar is collapsed to icon-only mode
  return (
    <div className="mx-3 mb-5 flex items-center rounded-full border ...">
      <button onClick={() => setVersion("v1")} className={version === "v1" ? "active" : ""}>
        v1 — Classic
      </button>
      <button onClick={() => setVersion("v2")} className={version === "v2" ? "active" : ""}>
        v2 — Current
      </button>
    </div>
  );
}
```

The active button gets a white pill with shadow; the inactive one is gray text. The switcher is hidden when the sidebar is collapsed to icon-only width (below 1100px or manually toggled).

---

## 8. V1 Components — What They Do

All v1 components live in `src/components/v1/`. They are faithful recreations of the original design documented in the Word file mockups.

### LoginV1 (`LoginV1.jsx`)

Split-screen layout:

- **Left half** (`bg-brand-violet`): circular white logo with purple square inside, "■ OpenEconomics" branding, tagline, two-line description, `bg-accent-lime` bar pinned to the very bottom
- **Right half** (white/`bg-page`): centered card with email + password fields, "Accedi" button (disabled/gray when fields empty, purple when filled), "Password dimenticata?" link, "Ricordami" checkbox label, "Accedi con credenziali aziendali" outlined button

Calls `useAuth().login()` and navigates to `/valutazioni` on success.

### ValutazioniListV1 (`ValutazioniListV1.jsx`)

Page layout:

- **Header**: title "Valutazione" with plus icon, description paragraph, "Nuova valutazione +" button (purple, no border-radius — square corners)
- **In evidenza carousel**: 3 hardcoded `FEATURED` cards with colored top borders (green/amber/gray). Each card has a tag, project name, CUP, badge pills, body text, and footer with Settore + Durata. Navigation uses `prev`/`next` square black buttons.
- **Tabs**: "Valutazioni del tuo dipartimento" | "Valutazioni delle province e dei comuni" with underline active state
- **Filter row**: "Visualizza solo:" static pill buttons + Recenti/A-Z sort buttons (sort is wired to `setSortMode` from `ProjectContext`)
- **Project list**: real projects from `useProjects()` rendered as `ProjectRow` — click navigates to `/valutazioni/:id`

### ProjectDetailV1 (`ProjectDetailV1.jsx`)

- **Breadcrumb**: "Valutazione › Dettaglio del progetto" — "Valutazione" is clickable and calls `onBack`
- **Skeleton loader**: shows for 650ms on mount, then renders the real content
- **Project header**: name + status badge (amber/blue/green pill) + CUP in mono font + description + "Opzioni ▾" button
- **Config table**: 9-cell grid reading from `project.configurazione` — settore, sottosettore, categoria, tipoIntervento, durataLavori, localizzazione, annoAttualizzazione, CAPEX, OPEX
- **AnalysisCard** (rendered for each of EIA / ECBA / ESG):
  - Colored SVG icon + Badge chip + description text
  - Status label (Non avviata / In corso… / Completata)
  - Action button: "Avvia analisi" → or "Vai al dettaglio" → depending on status
  - Expand chevron (only visible when status is `"completed"` and results exist)
  - Expanded summary panels (inline): EIA shows 5 dark KPI boxes; ECBA shows benefici/costi/VANE; ESG shows overall rating + E/S/G pillars

### EiaResultsV1 (`EiaResultsV1.jsx`)

- **`adaptResults(eiaResults)`**: if real `eiaResults` were computed, uses them; otherwise builds a consistent object from `staticResults` (mock JSON) using fixed sector shares
- **Breadcrumb** → date line → **header card** (icon + EIA badge + two download buttons) → **metadata row** (settore, dataset, metodologia)
- **Underline tab bar**: Riepilogo / Spese / PIL / Occupazione / Produzione / Redditi
- **TabContent**:
  - `riepilogo`: descriptive paragraph + `MetricRow` list (Produzione, PIL, Occupazione, Redditi) on the left; dark `bg-ink-900` Spese card (large mono number + unit) on the right
  - Other tabs: descriptive paragraph + metric rows (diretto / indiretto / indotto / totale) on the left; colored metric card on the right. PIL tab also shows multiplier rows.

> Note: does NOT use `buildInsights()` from `eiaEngine.js` — that function returns an array, not the keyed object shape that would be needed. Metric descriptions are static text instead.

### EcbaResultsV1 (`EcbaResultsV1.jsx`)

- **`buildFallback(assumptions)`**: generates synthetic ECBA data from the `assumptions` object (horizon, discountRate) when no real results exist. Computes PV of benefits and costs, cumulative NPV series, BCR, and a fixed IRR of 3.86%.
- **`KpiHighlight`**: a colored box showing label + large mono value + optional note text
- **3 highlight KPIs**: green (benefici totali), gray (costi totali), brand-violet (VANE — color shifts to red if negative)
- **3 secondary cards**: payback period, BCR (formatted to 2 decimals), TIRE (IRR)
- **PlotlyChart**: cumulative cash flow line chart (VAN cumulato in M€ per year), guarded with `cashFlowTrace.length > 0`

### EsgResultsV1 (`EsgResultsV1.jsx`)

- **`RATING_SCALE`**: 11-point scale `["D", "CC", "C", "BB", "B", "BBB", "A", "A+", "AA", "AA+", "AAA"]`
- **`getRatingColor(index)`**: maps position in the scale to a Tailwind background color (red → amber → yellow → green → emerald)
- **`RatingBadge`**: colored square badge in three sizes (sm / md / lg)
- **`ScoreBar`**: horizontal filled progress bar with color thresholds
- **`ComplianceBar`**: proportional 3-segment bar (green = aligned, amber = partial, red = non-aligned) with legend
- **`buildResults()`**: returns complete mock ESG data when no real results
- **Tabs**: Riepilogo / Environmental / Social / Governance
  - Riepilogo: description + toggle between Grafico view (rating scale visualization, compliance bar) and Tabella view (pillar breakdown table with RatingBadge + score)
  - Pillar tabs: letter badge + overall score bar + compliance bar + descriptive text block + "Scatta istantanea" link (decorative)

---

## 9. V2 Components — What They Do

V2 components live in `src/components/`. These are the current production design.

### Login (`Login.jsx`)

Compact centered card on a white background. Single-column form with logo at top.

### ValutazioniList (`ValutazioniList.jsx`)

Uses `ProjectContext` for real-time search/sort. Has a tabbed interface and a richer filter sidebar concept. Projects are displayed in a list with sortable columns.

### ProjectDetail (`ProjectDetail.jsx`)

Richer layout with more visual hierarchy. AnalysisCard components have progress-style status indicators.

### EiaResults (`EiaResults.jsx`)

Uses `buildInsights()` from `eiaEngine.js` for descriptive insight text. Includes Plotly charts for sector distribution and regional breakdown. Has a scenario comparison toggle.

### EcbaResults (`EcbaResults.jsx`)

Same structure as v1 but with additional scenario sensitivity charts and more granular cash flow tables.

### EsgResults (`EsgResults.jsx`)

Radar chart for E/S/G pillar visualization. Detailed criterion-level breakdown table.

---

## 10. Shared Business Logic (Engines)

Engines live in `src/lib/` and are used by both v1 and v2 results components.

### `eiaEngine.js` — Economic Impact Analysis

**`computeEia(project, scenario)`**: Main computation function. Reads CAPEX/OPEX from `project.configurazione`, applies Social Accounting Matrix (SAM EU-ITA 2019) multipliers to produce:

```js
{
  shock_totale,      // total investment shock (€)
  moltiplicatore,    // output multiplier
  produzione: { diretto, indiretto, indotto, totale },   // production value (€)
  gva:        { diretto, indiretto, indotto, totale },   // GDP/GVA (€)
  fte:        { diretto, indiretto, indotto, totale },   // full-time equivalent jobs
  redditi:    { diretto, indiretto, indotto, totale },   // household income (€)
  gettito:    { diretto, indiretto, indotto, totale },   // tax revenue (€)
  per_territorio: [...],  // regional distribution
  per_settore: [...],     // sector breakdown
  per_anno: [...],        // year-by-year profile
  scenario,               // echoed back from input
}
```

**`buildInsights(results, scenario)`** — returns an **array** of 3 objects `[{ title, value, text }]` for produzione, occupazione, PIL. This is NOT a keyed object. V1 does not use this function; v2 uses it to populate insight text boxes.

### `ecbaEngine.js` — Cost-Benefit Analysis

**`computeEcba(project, eiaResults, inputs)`**: Discounts cash flows over `inputs.horizon` years at `inputs.discountRate`. Returns `{ benefici_totali, costi_totali, van, bcr, irr, payback_period, flussi[] }`.

### `esgEngine.js` — ESG Analysis

**`computeEsg(answers, settore, eiaResults)`**: Scores questionnaire answers against sector-specific criteria weights. Returns `{ rating, score, environmental_rating, environmental_score, social_rating, social_score, governance_rating, governance_score, criteri[] }`.

### `projectState.js` — Persistence Utilities

Pure functions for reading/writing to localStorage and building workspace objects. No React dependencies — can be called outside components.

---

## 11. Mock Data

Mock data files in `src/mocks/`:

| File | Used by |
|------|---------|
| `project.json` | `ProjectContext` (initial draft project), `projectState.js` (seed data base) |
| `eiaResults.json` | `EiaResultsV1.adaptResults()` when no real EIA results |
| `esgResults.json` | (imported but currently unused — `buildResults()` in EsgResultsV1 builds its own) |

---

## 12. Lazy Loading Strategy

Six components are **lazy-loaded** (excluded from the main JS bundle) because they import Plotly.js, which is ~3 MB:

```js
// src/router.jsx
const EiaResults   = lazy(() => import("./components/EiaResults"));
const EcbaResults  = lazy(() => import("./components/EcbaResults"));
const EsgResults   = lazy(() => import("./components/EsgResults"));
const EiaResultsV1  = lazy(() => import("./components/v1/EiaResultsV1"));
const EcbaResultsV1 = lazy(() => import("./components/v1/EcbaResultsV1"));
const EsgResultsV1  = lazy(() => import("./components/v1/EsgResultsV1"));
```

Each lazy component is wrapped in `<Suspense fallback={<ResultsPageFallback />}>` at its route. The fallback renders skeleton placeholders that match the approximate shape of the results page.

All other components (Login, ValutazioniList, ProjectDetail, etc.) are **eagerly imported** — they are small and benefit from being available immediately without a loading state.

---

## 13. Tailwind Design Tokens

Custom tokens defined in `tailwind.config.js`:

| Token | Value | Used for |
|-------|-------|---------|
| `brand-violet` | `#5B21F7` | Primary action color — buttons, active nav, focus rings |
| `brand-violet-dark` | darker shade | Hover state for primary buttons |
| `brand-violet-light` | very light violet | VANE positive background in ECBA |
| `brand-violet-soft` | soft violet | Active sidebar item background |
| `ink-900` → `ink-100` | near-black → near-white | All text and border colors (replaces gray-*) |
| `bg-page` | off-white | Main content area background |
| `accent-lime` | `#CAFF5A` | Green accent bar (header bottom stripe, v1 login bottom bar) |
| `badge-eia` | pink | EIA badge background |
| `badge-ecba` | blue | ECBA badge background |
| `badge-esg` | teal | ESG badge background |

The `dots-violet-bg` class (used in some v2 result page headers) applies a CSS dot-pattern background in brand-violet.
