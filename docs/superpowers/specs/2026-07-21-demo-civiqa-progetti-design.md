# Demo Civiqa — Progetti ad-hoc per il cliente (Analisi Alternativa + Analisi Ricadute)

> Data: 2026-07-21 · Autore: Riccardo Scialla + Claude · Demo prevista: 2026-07-23 (dopodomani)
> Obiettivo: preparare due progetti dimostrabili end-to-end, con flusso wizard completo e
> numeri coerenti, superando i limiti della POC.

---

## 1. Contesto e problema

La piattaforma ha **due moduli** con dati e motori distinti e **non collegati**:

| Menu | Modulo | Motore | Sorgente dati |
|---|---|---|---|
| **Analisi Alternativa** | DOCFAP (wizard a fasi, confronto A1/A2/A3: MCA+CBA+Impatto+Rischio) | `runPOCAnalysis()` — **cablato, ignora gli input** | `DocfapList.tsx` (righe) + `docfapDemo.ts` (unico scenario) |
| **Analisi Ricadute** | Valutazione `/valutazioni` (EIA + ECBA + ESG) | `eiaEngine/ecbaEngine/esgEngine` — **calcolano davvero** | `projectState.js` (`buildSeedProjects`) + `mocks/*` |

**Perché gli output del wizard DOCFAP sono "sballati":** `Step7_ScoreFinale.tsx` → `runFullAnalysis()` →
`runPOCAnalysis()` non riceve nessun input e restituisce sempre lo scenario "Asilo Nido"
(A1 Nuova costruzione / A2 Ristrutturazione / A3 Voucher) con CAPEX e punteggi fissi. Esiste un motore
DOCFAP reale (`cba.ts`, `impatto.ts`, `sensitivita.ts`) ma è **scollegato** (dead code).

**Limiti che impattano la demo:**
1. Il wizard DOCFAP live produce sempre lo stesso output a prescindere dagli input.
2. Tutte le righe DOCFAP "Completato" aprono lo **stesso** dettaglio (cambia solo la testata).
3. Il cross-link dal dettaglio DOCFAP ("Analisi completa alternativa Aₓ") punta a progetti-seed
   Ricadute non pertinenti (`PROJ-002 Palazzo Reale`, `PROJ-003 Parco Urbano`).
4. Il lato Ricadute invece calcola correttamente dagli input → è demo-abile dal vivo.

---

## 2. Approccio scelto (confermato con l'utente)

**Approccio 1 — "Curato & coerente". Nessuna chirurgia sul motore.** Sfruttiamo il fatto che lo scenario
cablato del DOCFAP *è* l'asilo nido, rendendo il flusso live coerente per costruzione; sul lato Ricadute
usiamo il motore reale (che calcola) e la pipeline di ingestione Excel già esistente per i numeri reali.

Sono ammesse modifiche a **valori/costanti** e a **mappe di navigazione** (rischio nullo), ma **non** al
codice di calcolo del motore.

---

## 3. Progetto A — Asilo nido comunale

### 3.1 Analisi Alternativa (DOCFAP) — flusso wizard live → dettaglio

- **Coerenza wizard→dettaglio:** allineare i **prefill/default** delle fasi del wizard
  (`DocfapWizard.tsx` autofill FAB-51/C03; `wizardStore.ts` default; `docfapDemo.ts` `DEMO_ALTERNATIVES`)
  ai valori finali mostrati nel dettaglio, così ciò che il presenter vede/accetta nel wizard corrisponde
  all'output. Il presenter segue lo script accettando i default (non digita valori contraddittori).
- **Curatela numeri alternative:** editare le **costanti** in `engine/pocAnalysis.ts`
  (`ALT`, `CBA_SCORE`, `IMP_SCORE`, `RSK_SCORE`, `MCA_SCORE`, `SENS`, `BENEFIT_PER_POSTO`, `N_POSTI`,
  nomi alternative alle righe ~120/135/151) per renderli realistici e coerenti con i 3 progetti Ricadute
  (§3.2). Sono valori, non logica → rischio nullo.
- **3 alternative** (input di riferimento, allineati ai progetti Ricadute):
  - **A1 Nuova costruzione** — CAPEX 2.640.000 € · OPEX 420.000 €/anno · ~90 posti · durata 24 mesi
  - **A2 Ristrutturazione** — CAPEX 1.440.000 € · OPEX 310.000 €/anno · ~66 posti · durata 18 mesi
  - **A3 Voucher famiglie** — CAPEX 0 € · OPEX 600.000 €/anno · ~180 beneficiari · durata 6 mesi
- Orizzonte CBA 20 anni · tasso di sconto 3% · Comune di Colleferro (RM).

### 3.2 Analisi Ricadute — 3 progetti asilo nido (destinazione del salto dal DOCFAP)

Creare **3 progetti Valutazione**, uno per alternativa, come seed in `projectState.js`
(`buildSeedProjects`), forma `mocks/project.json` (config annidata). Categoria intervento **"Asili Nido"
(C106)** → lo spaccato benefici sociali è **reale e specifico** (via `buildBeneficiKpi`, non il template
generico). Settore "Infrastrutture sociali".

| | A1 Nuova costruzione | A2 Ristrutturazione | A3 Voucher |
|---|---|---|---|
| CAPEX | 2.640.000 | 1.440.000 | 0 |
| OPEX/anno | 420.000 | 310.000 | 600.000 |
| Vita utile | 30 | 25 | 5 |
| Categoria | Asili Nido (C106) | Asili Nido (C106) | Servizi per l'Infanzia (C119) |
| Analisi | EIA+ECBA(+ESG opz.) | EIA+ECBA | EIA+ECBA |

- **Output EIA/ECBA: calcolati dal motore** dagli input di config (coerenti per costruzione). I numeri
  finali si leggono dopo la build; non si inseriscono a mano.
- **Rimappare il cross-link** DOCFAP→Ricadute: in `DocfapDetail.tsx` la mappa `OPTION_PROJECT`
  (`{A1:'PROJ-002', A2:'PROJ-003'}`) → puntare ai nuovi id (`A1→asilo-nuova`, `A2→asilo-ristrutt`,
  `A3→asilo-voucher`). Verificare le route target (`/valutazioni/:id/eia/results`,
  `/valutazioni/:id/ecba/results`).
- **Wizard live Ricadute:** uno di questi 3 (consigliato A1 Nuova costruzione) è il progetto che si
  ricostruisce dal vivo col wizard Ricadute completo (config → EIA → ECBA → ESG → dettaglio).

---

## 4. Progetto B — Ospedale pediatrico (potenziamento infrastrutturale)

Progetto **reale**, dati forniti dall'utente. Deve avere **EIA + ECBA + ESG**.

### 4.1 Ingestione dati reali (EIA + ECBA)

Riuso della pipeline `scripts/build-muba-project.cjs`, adattata a `scripts/build-ospedale-project.cjs`,
che genera `app/src/mocks/ospedaleProject.js` (stessi export: `*_PROJECT`, `*_EIA_RESULTS`,
`*_ECBA_RESULTS`, `*_EIA_DATASET`, `*_ECBA_DATASET`). Formato Excel atteso (identico a scenario 976):
- **IA (impatto):** fogli `metadata · shock · gdp · production · employment · incomes` (valori in k€).
- **ACB (costi-benefici):** foglio `sroi` con righe `TOT` (benefici/costi/vane/tire/sroi), `CSH`
  (cashflow annuo), `KPI` (valore per voce di beneficio; il codice KPI → nome leggibile via
  `kpi_benefits_layer2`). Qui vivono i **benefici sociali** dell'ospedale.

Poi agganciare il workspace in `buildSeedProjects` (come `buildMubaWorkspace`) e bumpare la versione
`localStorage` (`civiqa.projects.vN`) per invalidare la cache.

### 4.2 ESG (non presente negli Excel)

- Se l'utente fornisce **risposte/valori ESG** → si compone `esgAnswers` coerente e si marca
  `analyses.esg = completed` con i risultati di `computeEsg` (o iniettati).
- In alternativa: **questionario ESG curato** coerente con un presidio sanitario pediatrico
  (settore sanità/assistenza) → rating calcolato dal motore.

### 4.3 Nota su "numeri reali" vs "wizard live"

Progetto B è **pre-costruito** e si apre già "Completato": i numeri reali vengono dagli Excel e **non**
sono riproducibili dal motore semplificato. Quindi **non** si ricostruisce col wizard (che ricalcolerebbe).
Il "wizard completo live" si mostra sul Progetto A (asilo nido), dove il motore calcola.

---

## 5. Dati necessari dall'utente (Progetto B)

1. **Excel IA** (impatto) e **Excel ACB** (`sroi`) dell'ospedale pediatrico, stesso formato di scenario 976
   → da mettere in una cartella `progetto ospedale pediatrico/`.
2. **Anagrafica:** denominazione, CUP, comune/provincia, ente/proprietario, descrizione, anno di
   attualizzazione, tasso di sconto, orizzonte, vita utile, CAPEX/OPEX (se non deducibili dagli Excel).
3. **ESG:** risposte al questionario **oppure** ok a un questionario curato coerente col progetto.
4. **Gettito fiscale** (se rilevante e non nell'IA, come per il MUBA).

---

## 6. Narrazione della demo (script)

1. **Analisi Alternativa** — aprire il **wizard DOCFAP** sull'asilo nido, scorrere le fasi (accettando i
   default) → generare il DOCFAP → **dettaglio** con i 4 box (Impatto/CBA/MCA/Rischio) e alternativa
   raccomandata. Dal box, "**Analisi completa alternativa A1**" → salto al **dettaglio Ricadute**
   dell'asilo Nuova costruzione (EIA/ECBA coerenti, spaccato benefici sociali).
2. **Analisi Ricadute** — (a) aprire il **Progetto B ospedale pediatrico** già "Completato" → dettaglio
   EIA + ECBA (waterfall/donut benefici) + ESG. (b) Mostrare il **wizard Ricadute completo dal vivo**
   ricostruendo l'asilo Nuova costruzione: config → EIA → ECBA → ESG → dettaglio.

---

## 7. File coinvolti

- `app/src/poc/engine/pocAnalysis.ts` — curatela costanti/nomi alternative asilo nido.
- `app/src/poc/components/wizard/DocfapWizard.tsx`, `store/wizardStore.ts`, `data/docfapDemo.ts` —
  allineamento prefill/default.
- `app/src/poc/pages/DocfapDetail.tsx` — rimappa `OPTION_PROJECT` (cross-link → progetti asilo Ricadute).
- `app/src/lib/projectState.js` — 3 seed asilo nido + workspace ospedale; bump versione cache.
- `app/src/mocks/ospedaleProject.js` — **nuovo**, generato dalla pipeline.
- `scripts/build-ospedale-project.cjs` — **nuovo**, adattato da `build-muba-project.cjs`.
- (Eventuale) ESG: `esgAnswers` per ospedale e/o asilo A1.

---

## 8. Rischi e non-obiettivi

**Rischi**
- Il wizard DOCFAP resta coerente **solo** sul percorso scriptato (asilo nido). Fuori script mostra numeri
  fissi → non improvvisare valori diversi in demo.
- La categoria C106 potrebbe non avere `kpi_links` risolvibili → in tal caso lo spaccato benefici asilo
  cade sul template generico. **Da verificare in build**; se serve, forzare `cat_code` o override.
- Formato Excel ospedale diverso da scenario 976 → adattare il parser (tempo).
- Bump versione `localStorage`: gli utenti con stato in cache devono ricaricare (o si azzera in demo).

**Non-obiettivi**
- Nessun aggancio del motore DOCFAP reale (`cba/impatto/sensitivita`) al wizard (è l'Approccio 2, futuro).
- Nessun motore che leghi davvero l'opzione DOCFAP alla valutazione (resta navigazione mappata).
- Export PDF/Excel restano placeholder.

---

## 9. Verifica (prima della demo)

- `npm run build` (in `app/`) verde.
- Wizard DOCFAP asilo nido: fasi → dettaglio senza incongruenze visibili input/output.
- Cross-link DOCFAP → dettaglio Ricadute asilo corretto per A1/A2/A3.
- 3 progetti asilo + ospedale visibili in `/valutazioni`; dettagli EIA/ECBA(/ESG) popolati.
- Spaccato benefici (sociali) visibile sia nel wizard ECBA sia nel dettaglio.
- Ospedale: EIA/ECBA reali dagli Excel + ESG presente.
- Prova end-to-end del flusso demo (§6) su build servita, non solo dev.
