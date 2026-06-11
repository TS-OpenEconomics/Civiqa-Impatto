# Refactor sezione Risultati DOCFAP

> Branch: `refactor_civiqa_docfap` · Documento di design + roadmap di implementazione.
> Obiettivo: rifare **da zero** la sezione di risultati del DOCFAP (Summary, Impatto, CBA, MCA, Rischio)
> ricalcandola sul pattern della **pagina di summary di un progetto valutazione** (`ProjectDetail.jsx`).

---

## 1. Visione

Oggi la sezione risultati del DOCFAP è la pagina **`DocfapDetail.tsx`** (`/impatti/docfap/detail`):
un hero + KPI + card "Dati configurazione" + un blocco a **tab** (Riepilogo / CBA / MCA / Rischio / Impatto),
dove ogni tab è una tabella di confronto A1/A2 + grafici.

La nuova sezione diventa una **pagina di summary** sullo stile di `app/src/components/ProjectDetail.jsx`
(il dettaglio di un progetto `/valutazioni`):

```
┌─────────────────────────────────────────────────────────────┐
│  INFO GENERALI                                                │
│  Titolo intervento · stato · meta (ente/RUP/date) · descr.    │
│  KPI di sintesi (alternativa raccomandata, score finale…)     │
│  Card "Dati della configurazione"                             │
├─────────────────────────────────────────────────────────────┤
│  LE ANALISI DEL DOCFAP  (4 box di sintesi)                    │
│  ┌───────────────┐  ┌───────────────┐                         │
│  │  IMPATTO      │  │  CBA          │                         │
│  │  sintesi A1/A2│  │  sintesi A1/A2│                         │
│  │  [A1][A2][⇄]  │  │  [A1][A2][⇄]  │                         │
│  └───────────────┘  └───────────────┘                         │
│  ┌───────────────┐  ┌───────────────┐                         │
│  │  MCA          │  │  RISCHIO      │                         │
│  │  sintesi A1/A2│  │  sintesi A1/A2│                         │
│  │  [A1][A2][⇄]  │  │  [A1][A2][⇄]  │                         │
│  └───────────────┘  └───────────────┘                         │
└─────────────────────────────────────────────────────────────┘
```

Ogni box contiene una **sintesi dei risultati** delle due opzioni e tre azioni:

| Azione | Comportamento |
|---|---|
| **Analisi completa — Opzione A1** | Naviga (route) verso il dettaglio analisi della singola opzione |
| **Analisi completa — Opzione A2** | Idem per A2 |
| **Confronta le opzioni (⇄)** | Apre un **overlay** a tutto schermo con il confronto A1 vs A2 |

### Decisioni dell'utente (vincolanti)

1. **Confronto = overlay**; **analisi singola = route** (pagina).
2. **Destinazione analisi singola per dimensione:**
   - **Impatto** → pagina risultati reale del modulo `/valutazioni` → `EiaResults` (`/valutazioni/:id/eia/results`).
   - **CBA** → pagina risultati reale `/valutazioni` → `EcbaResults` (`/valutazioni/:id/ecba/results`).
   - **Rischio** → **è compreso nell'ACB completa** → punta anch'esso a `EcbaResults`.
   - **MCA** → esiste **solo nel DOCFAP** → pagina di dettaglio interna (`/impatti/docfap/mca/:option`).
3. **Dati EIA/ECBA non devono essere "corretti"** (non c'è un motore che lega l'opzione DOCFAP al
   progetto `/valutazioni`): conta che **la logica di navigazione funzioni**. Per la demo si mappa ogni
   opzione a un progetto seed `/valutazioni` già con EIA+ECBA completi.
4. **LAYOUT DI RIFERIMENTO = quello del modulo `/valutazioni`** (`ProjectDetail.jsx`, `EiaResults.jsx`,
   `EcbaResults.jsx`): **Tailwind** con palette `brand-violet` / `ink-*` / `accent-lime`, card
   `rounded border border-ink-100 bg-white`, tipografia `text-[..]px`. Il **layout attuale del DOCFAP è
   vecchio** (inline-style su `var(--color-*)`, squadrato) e **non va più usato** per la pagina di summary.
   - Conseguenza tecnica: la nuova `DocfapDetail` (e `DocfapMcaDetail`) vanno **renderizzate RAW, fuori da
     `.poc-scope`** (in `router.jsx` niente più `<PocPage>` attorno), perché `.poc-scope *{border-radius:0
     !important}` azzererebbe gli angoli arrotondati Tailwind. Esattamente come le pagine `/valutazioni`,
     che il router monta raw.
   - I componenti **Tab di confronto** riusati nell'overlay restano inline-style su token: funzionano
     comunque perché i token `--color-*` sono definiti su `:root` (non solo dentro `.poc-scope`).

---

## 2. Mappatura opzione → progetto `/valutazioni` (demo)

Progetti seed con `eia.status === 'completed'` e `ecba.status === 'completed'`
(`app/src/lib/projectState.js` → `buildSeedProjects()`):

- `PROJ-002` — *Restauro Palazzo Reale*
- `PROJ-003` — *Riqualificazione Parco Urbano*

Mappatura demo (cablata in `DocfapDetail`):

```ts
const OPTION_PROJECT: Partial<Record<AlternativaId, string>> = {
  A1: 'PROJ-002',
  A2: 'PROJ-003',
}
```

> Quando in futuro esisterà un motore che lega l'opzione DOCFAP a una valutazione reale, basterà
> sostituire questa mappa con l'id del progetto generato per quell'opzione.

Navigazione (con `useNavigate`, i `basename` `/Civiqa-Impatto/` è gestito da react-router):

- Impatto Aₓ → `navigate('/valutazioni/' + OPTION_PROJECT[opt] + '/eia/results')`
- CBA Aₓ / Rischio Aₓ → `navigate('/valutazioni/' + OPTION_PROJECT[opt] + '/ecba/results')`
- MCA Aₓ → `navigate('/impatti/docfap/mca/' + opt)`

---

## 3. Modello dati (riuso, niente nuovi motori)

I dati vivono già nello **store DOCFAP** `wizardStore` (`app/src/poc/store/wizardStore.ts`), seedato da
`loadDocfapDemo()` (`app/src/poc/data/docfapDemo.ts`) con **A1/A2**.

Score per alternativa = `ScoreComposito` (`app/src/poc/types/docfap.ts`):

```ts
interface ScoreComposito {
  alternativaId: 'A0'|'A1'|'A2'|'A3'|'A4'|'A5'
  // CBA
  cbaScore: number; van: number; bcr: number; tir: number; orizzonte: number; tassoSconto: number
  // Impatto
  impattoScore: number; impattoAmbientale/Sociale/Territoriale: number
  pil: number; occupati: number; produzione: number; redditi: number
  // MCA
  mcaScore: number
  // Rischio / sensitività
  rischioScore: number; sensitivityScore: number; sensitivitaDetail?: {...}
  // Finale
  scoreComposito: number; scoreFinale: number
}
```

Helper esistenti (riusati):
- `getDefinedScores(scoreFinale, alternativeDefinite)` → solo le opzioni definite (A1/A2).
- `getRecommendedAlternativeId(scores)` → opzione con `scoreFinale` massimo.
- `getAlternativeDisplayLabel(id, alt)` → etichetta leggibile (categoria — tipologia).
- `MC_MOCK_DATA[altId].summary` (`engine/riskMonteCarlo.ts`) → `probBest`, `probNegative`, `mean/std/p5/p50/p95` per la sintesi Rischio.

Sintesi per box (numeri chiave mostrati nella card):

| Box | Score | Metriche di sintesi (per opzione) |
|---|---|---|
| Impatto | `impattoScore` | PIL (`pil` M€), Occupati (`occupati`), Produzione (`produzione` M€) |
| CBA | `cbaScore` | VANE (`van`), TIRE (`tir`), B/C (`bcr`) |
| MCA | `mcaScore` | punteggio MCA (0–100) + n° criteri valutati |
| Rischio | `sensitivityScore` | P(migliore) (`probBest`), P(VAN<0) (`probNegative`), score robustezza |

---

## 4. Architettura componenti

### Nuovi / modificati

| File | Tipo | Ruolo |
|---|---|---|
| `app/src/poc/pages/DocfapDetail.tsx` | **riscritto** | Summary page: info generali + KPI + config + 4 box + stato overlay + navigazione |
| `app/src/poc/components/docfap/ResultBox.tsx` | **nuovo** | Card di sintesi per dimensione (header, mini-confronto A1/A2, azioni) |
| `app/src/poc/components/docfap/ConfrontoOverlay.tsx` | **nuovo** | Overlay fullscreen (z-200) che monta il Tab di confronto della dimensione |
| `app/src/poc/pages/DocfapMcaDetail.tsx` | **nuovo** | Analisi MCA completa di **una** opzione (interna al DOCFAP) |
| `app/src/poc/index.jsx` | **modificato** | export `DocfapMcaDetail` |
| `app/src/router.jsx` | **modificato** | route `/impatti/docfap/mca/:option`; `DocfapDetail`/`DocfapMcaDetail` montati **raw** (senza `<PocPage>`) |

> **Stile:** `DocfapDetail`, `ResultBox`, `DocfapMcaDetail` e la chrome dell'overlay sono scritti in
> **Tailwind** (classi `brand-violet`/`ink-*`/`rounded`/`shadow-sm`…) ricalcando `ProjectDetail.jsx`.
> Solo il **contenuto** dell'overlay (i Tab di confronto già esistenti) resta inline-style su token.

### Riuso esistente

- **Confronto (overlay)** → riuso 1:1 dei Tab attuali (leggono lo store, mostrano A1+A2):
  - Impatto → `TabImpatto`
  - CBA → `TabCBA`
  - MCA → `TabMCA`
  - Rischio → `TabSensitivita`
- **MCA singola** → riuso della logica di `TabMCA` / `MCARadarChart`, filtrata su una sola colonna opzione.

### Routing & flussi

```
/impatti/docfap            → DocfapList (invariata; "Completato" → /detail, altrimenti wizard)
/impatti/docfap/detail     → DocfapDetail (summary, 4 box)
   ├─ box ⇄ Confronta       → overlay in-page (nessuna route)
   ├─ Impatto A1/A2         → /valutazioni/{proj}/eia/results
   ├─ CBA A1/A2             → /valutazioni/{proj}/ecba/results
   ├─ Rischio A1/A2         → /valutazioni/{proj}/ecba/results   (rischio ∈ ACB)
   └─ MCA A1/A2             → /impatti/docfap/mca/{A1|A2}
/impatti/docfap/mca/:option → DocfapMcaDetail (← back a /detail)
```

L'overlay è montato **dentro** `.poc-scope` (DocfapDetail) così eredita i token `--color-*`; usa
`position:fixed; inset:0; z-index:200` per coprire la chrome (`TopNav` z-100), come il wizard.

---

## 5. UX dei box (sintesi)

Ogni `ResultBox` (stile coerente con DocfapDetail, inline-style su `var(--color-*)`):

```
┌──────────────────────────────────────────────────────┐
│ [icona]  Titolo dimensione           [TAG]            │
│ breve descrizione della dimensione                    │
│ ──────────────────────────────────────────────────── │
│             Opzione A1        Opzione A2 ★(raccom.)    │
│  Score        71.0             84.0                    │
│  Metrica 1    …                …                       │
│  Metrica 2    …                …                       │
│ ──────────────────────────────────────────────────── │
│  Analisi completa:  [A1 →]  [A2 →]      [⇄ Confronta]  │
└──────────────────────────────────────────────────────┘
```

- Colonna dell'opzione raccomandata evidenziata (token viola translucido già usato negli helper).
- "Score" = score della dimensione (0–100), non lo score finale.
- Le label opzioni usano `getAlternativeDisplayLabel`.

---

## 6. Piano di implementazione (ordine)

1. **ConfrontoOverlay** — wrapper fullscreen generico (titolo + `onClose` + children).
2. **ResultBox** — card di sintesi data-driven (config per dimensione).
3. **DocfapDetail** — riscrittura: info generali + KPI + config + griglia 4 box + stato overlay + `useNavigate`.
4. **DocfapMcaDetail** — pagina MCA singola opzione.
5. **router.jsx + index.jsx** — route + export.
6. **Build** `vite` verde + verifica logica di navigazione.

### Non-obiettivi (per ora)
- Nessun nuovo motore di calcolo; numeri EIA/ECBA non agganciati all'opzione (POC).
- Nessuna modifica al wizard, agli engine o ai dati DOCFAP.
- Export PDF/Excel restano placeholder.
