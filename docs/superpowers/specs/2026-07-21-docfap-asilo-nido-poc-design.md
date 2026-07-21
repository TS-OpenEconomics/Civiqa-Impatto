# DOCFAP Asilo Nido — sistemazione per POC di vendita

> Data: 2026-07-21 · Autore: Riccardo Scialla + Claude
> Contesto: POC di vendita. Progetto DOCFAP «Ristrutturazione e ampliamento dell'asilo
> nido comunale». Estende ed è coerente con `2026-07-21-demo-civiqa-progetti-design.md`.

---

## 1. Obiettivo

Sistemare il progetto DOCFAP asilo nido in vista di una POC di vendita, su tre desiderata:

1. **Verificare** che il progetto e le sue 3 alternative abbiano CAPEX/OPEX realistici.
2. **Costruire** le viste di dettaglio delle singole alternative in Analisi Ricadute,
   coerenti con i numeri del DOCFAP, raggiunte cliccando "Analisi completa alternativa Aₓ"
   dal dettaglio DOCFAP.
3. **Ragionare** (solo strategia, niente codice ora) su come costruire "a ritroso" il
   wizard di costruzione del DOCFAP.

---

## 2. Contesto tecnico e scoperte chiave

La piattaforma ha due moduli con motori distinti (vedi memoria `two-module-architecture`):
- **DOCFAP** (`app/src/poc/`): il dettaglio è alimentato da `runPOCAnalysis()`
  (`engine/pocAnalysis.ts`), che **ignora gli input** e restituisce sempre lo scenario
  asilo nido cablato con 3 alternative A1/A2/A3.
- **Analisi Ricadute** (`/valutazioni`, `app/src/lib/` + `app/src/components/`): motori
  `eiaEngine.js`/`ecbaEngine.js` che **calcolano davvero** dagli input di configurazione.

### 2.1 Scoperta 1 — I numeri DOCFAP sono coerenti *per costruzione* col motore Ricadute

Verifica end-to-end effettuata sul codice:

- **Beneficio annuo per posto = €10.220**, somma dei 5 KPI della categoria "Asili Nido"
  (C106) in `kpi_benefits_layer2.ts`, valutati dalle loro formule:

  | KPI | Voce | Formula | €/posto/anno |
  |---|---|---|---|
  | NID-00 | Valore servizio educativo (custodia/cura 0-3) | A×B (B=MF-IST-NIDO=7000) | 7.000 |
  | NID-01 | Maggior reddito da sviluppo cognitivo | A×B×C (23000×0,05) | 1.150 |
  | NID-02 | Occupazione femminile attivata | A×B×C (23000×0,012) | 276 |
  | NID-03 | Risparmio sanitario 0-3 | A×B×C (0,06×3500) | 210 |
  | NID-04 | Recupero povertà educativa (equità) | A×B×C×D (0,33×0,08×60000) | 1.584 |
  | | **Totale** | | **10.220** |

- A1 (90 posti) → 919.800 ≈ `ALT.A1.ben=920.000`. A2 (84) → 858.480 ≈ `858.000`.
  A3 voucher (72 addizionali, `MF-IST-NIDO`=0 via override) → 3.220×72 = 231.840 ≈ `232.000`.
  ⇒ **I `ALT.ben` cablati nel DOCFAP sono stati retro-calcolati sull'output del motore.**
- **Moltiplicatori EIA identici**: `pocAnalysis.calcEconPOC` usa gli stessi valori di
  `SECTOR_MULTIPLIERS["Infrastrutture sociali"]` di `eiaEngine.js` (produzione 1,85; GVA 0,62;
  FTE 12,4/M€; redditi = GVA×0,55) e la stessa base (solo CAPEX).
- **Stessa formula CBA**: `pocAnalysis.calcVAN` e `ecbaEngine.computeEcba` calcolano il VANE
  con lo stesso fattore di annualità (3%, 20 anni ⇒ AF≈14,877) e lo stesso valore residuo
  attualizzato. VANE ricalcolati: A1≈5,16 M€ (BCR 1,58) · A2≈7,08 M€ (BCR 2,20) · A3≈−5,47 M€ (BCR 0,39).

**Conseguenza di design:** la vista ponte NON deve riconciliare numeri divergenti — DOCFAP
e Ricadute coincidono già a meno degli arrotondamenti. Il rischio principale è rimosso.

### 2.2 Scoperta 2 — Le pagine di dettaglio Ricadute *ignorano* i numeri calcolati

Le pagine `EiaResults.jsx`/`EcbaResults.jsx` non leggono il workspace calcolato: leggono un
"dataset ricco" da un registro per-progetto.

- `EcbaResults.jsx:612` → `applyEcbaDataset(getEcbaDataset(project))`. In `mocks/ecbaDatasets.js`
  il registro `ECBA_DATASETS` contiene solo `PROJ-MUBA-976` e `PROJ-OSP-841`; per tutto il
  resto (inclusi `PROJ-NIDO-*`) **fallback su `ECBA_DATA`** (mock generico asilo nido).
- `EiaResults` idem via `mocks/eiaDatasets.js` → fallback su `staticResults` (mock di **Palermo**).

⇒ Oggi, cliccando "Analisi completa alternativa Aₓ", **tutte e 3 le alternative mostrano lo
stesso mock statico**, scollegato dal DOCFAP (l'EIA mostra addirittura un progetto di Palermo).
I progetti `PROJ-NIDO-A1/A2/A3` esistono già come seed calcolati (`buildComputedWorkspace` in
`projectState.js`) con EIA/ECBA corrette nel workspace — ma le pagine non le leggono.

**Questo è il vero difetto del desiderata 2.**

### 2.3 Approccio confermato con l'utente

- Desiderata 2: **riuso delle pagine EIA/ECBA esistenti**, alimentate da **dataset per-alternativa
  costruiti a runtime dai numeri del motore**, più un banner di contesto DOCFAP. (Nessuna
  riscrittura delle pagine; nessuna chirurgia sul motore.)
- Desiderata 3: **solo documento di strategia**, nessuna implementazione in questa iterazione.

---

## 3. Desiderata 1 — Realismo dei numeri: verdetto e correzioni

### 3.1 Verdetto

**I CAPEX/OPEX sono realistici e internamente coerenti.**

| | A1 Nuova costr. | A2 Ristrutt. | A3 Voucher |
|---|---|---|---|
| CAPEX | 2.640.000 (≈29,3k€/posto, 90) | 1.440.000 (≈17,1k€/posto, 84) | 0 |
| OPEX/anno | 420.000 | 300.000 | 600.000 |
| Beneficio/anno | 920.000 | 858.000 | 232.000 |
| VANE / BCR | 5,16 M€ / 1,58 | 7,08 M€ / 2,20 | −5,47 M€ / 0,39 |

- CAPEX nuova costruzione ~29k€/posto e ristrutturazione ~17k€/posto (55% del nuovo) in linea
  con i parametri PNRR asili nido.
- Beneficio/posto identico A1/A2 (~10,2k€), più basso per il voucher (niente valore servizio,
  solo bambini addizionali) → nessun doppio conteggio.
- Racconto CBA solido: A2 (ristrutturazione) raccomandata; voucher in VANE negativo perché il
  trasferimento costa più della gestione di un nido proprio dando meno posti e nessun asset.

### 3.2 Correzione A.1 — Coerenza card della lista DOCFAP

In `DocfapList.tsx` (`MOCK_PROJECTS[2]` / `DOCFAP_ENTE` `docfap-003`) la card
"Ristrutturazione e ampliamento dell'asilo nido comunale" è incoerente col dettaglio:
`tipoIntervento: 'Nuova costruzione'`, comune Monterotondo, **OPEX 80.000** (irrealistico per
un nido). Poiché il dettaglio è lo scenario Colleferro A1/A2/A3, allineare la card:

- `tipoIntervento` → "Ristrutturazione" (coerente con l'alternativa raccomandata A2).
- `comune`/`provincia` → "Colleferro" / "Roma" (come i seed `PROJ-NIDO-*`).
- CAPEX/OPEX della card → valori dell'alternativa raccomandata A2 (1.440.000 / 300.000) o
  un aggregato coerente; rimuovere l'OPEX 80.000.
- `handleOpenProject` passa già `denominazione/comune/provincia/proprietario` a `loadDocfapDemo`:
  verificare che la testata del dettaglio risulti coerente (Colleferro).

*Nota:* i campi `vane/tire/bc/pil/...` di `MOCK_PROJECTS` non sono mostrati nel dettaglio (che
usa `runPOCAnalysis`); si aggiornano solo per igiene del dato nella card.

### 3.3 Correzione A.2 — Etichetta OPEX come costo pubblico netto

Gli OPEX reggono come **costo pubblico netto** (dopo rette famiglie e contributi). Un nido da 90
posti ha costo di gestione *lordo* ~700-850k€/anno; i 420k€ sono il netto a carico dell'ente. Per
non esporre il fianco in demo, esplicitare l'interpretazione con una nota/label ("OPEX = costo
pubblico netto annuo, al netto di rette e contributi") nelle viste dove l'OPEX è mostrato
(dettaglio DOCFAP e/o vista ponte). **Non si modificano i valori.**

---

## 4. Desiderata 2 — Vista ponte per singola alternativa

### 4.1 Architettura

```
DOCFAP DocfapDetail — box "Analisi completa alternativa A₁"
   │  openSingle(): navigate("/valutazioni/PROJ-NIDO-A1/ecba/results" | ".../eia/results")
   ▼
EcbaResults / EiaResults  (pagine esistenti, invariate nel markup)
   │  applyEcbaDataset(getEcbaDataset(project))
   ▼
getEcbaDataset(PROJ-NIDO-A1)  →  dataset costruito a runtime dal workspace calcolato
   │
   ▼
buildNidoEcbaDataset(workspace) / buildNidoEiaDataset(workspace)   ← NUOVI
   mappano l'output di computeEcba/computeEia sulla forma "dataset ricco"
```

**Perché builder a runtime e non file statici** (come MUBA/Ospedale): i progetti reali usano
file statici perché i loro numeri vengono da Excel e il motore semplificato non li sa
ricalcolare. I nido invece **sono già calcolati dal motore** in `buildComputedWorkspace`. Un
builder a runtime mantiene un'**unica fonte di verità** (il motore) e azzera il rischio di drift
tra dettaglio DOCFAP e vista Ricadute.

### 4.2 Unità di lavoro

**B.1 — `buildNidoEcbaDataset(workspace)`**
- Input: `workspace.ecbaResults` (output `computeEcba`) + `workspace.project.configurazione`.
- Output: oggetto forma `ecbaData.js` (vedi `MUBA_ECBA_DATASET`).
- Mappatura diretta:
  - `kpi`: `{ investimento: M(capex), orizzonte, tasso, vane: M(van), tire: tir, bcr: bc, paybackAnno: payback, progetto, luogo, categoria }`.
  - `waterfall`: `{ benefici: M(benefici_totali_lordi), costi: M(costi_totali), esternalitaNeg: 0, vane: M(van) }` (i nido non hanno esternalità negative).
  - `donut`: da `benefici_categorie` (escluso il "residuo") → `{ label: nome, pct: quota×100, color }`.
  - `cashflow`: da `flussi` → `{ cost: [...], ben: [...] }` in M€.
- Campi rischio (sensitivity/montecarlo/riskSummary/elasticities/variances/heatmap):
  **sintetizzati dal VANE** con lo stesso schema di `MUBA_ECBA_DATASET`, marcati
  `_riskIllustrative: true`.
- **Caso A3 (VANE negativo):** `riskSummary.probPositive` bassa (coerente con VANE<0),
  `montecarlo` centrato sotto zero, sensitivity/heatmap con segno corretto. Verificare che
  `EcbaResults` renderizzi correttamente VANE negativi (banda, colori).

**B.2 — `buildNidoEiaDataset(workspace)`**
- Input: `workspace.eiaResults` (output `computeEia`) + config.
- Output: oggetto forma `eiaResults.json` (vedi `MUBA_EIA_DATASET`): `metadata`, `previews`,
  `input`, `synthesis` (`by_perimeter`, `fiscal_national`, `three_segments`, `per_capita`,
  `synthetic_kpis`), `components`, `geography` (`regions`, `provinces`, `macro_split`), `sectors`.
- **Parte più onerosa.** `computeEia` fornisce produzione/GVA/FTE/redditi/gettito +
  `per_territorio`/`per_anno`/`per_settore`. La forma dataset è più ricca (geografia con
  popolazione/NUTS, settori intra/extra, segmenti di sintesi).
- Proposta: **geografia minimale realistica** per un intervento locale (Colleferro → provincia
  Roma → regione Lazio), sufficiente a far renderizzare la pagina senza inventare dettaglio
  multiprovinciale non pertinente. **Da confermare in fase di plan** la lista esatta dei campi
  che `EiaResults` legge e quali sono obbligatori vs opzionali.
- Se la mappatura completa risultasse troppo costosa per la POC, ripiego documentato: geografia
  ridotta al minimo che la pagina tollera.

**B.3 — Registrazione dataset**
- In `ecbaDatasets.js`/`eiaDatasets.js`, aggiungere `PROJ-NIDO-A1/A2/A3` ai registri,
  costruendo i dataset dal workspace calcolato. Attenzione al punto in cui si ottiene il
  workspace: i registri sono importati staticamente; valutare se costruire i dataset da
  `buildSeedProjects()`/`buildComputedWorkspace` (esposto) oppure ricalcolare on-demand nel
  getter. Preferenza: getter che, per gli id nido, calcola/recupera il workspace e applica il
  builder (memoizzato).

**B.4 — Banner ponte di contesto**
- Nelle pagine EIA/ECBA, quando il progetto è un'alternativa DOCFAP, mostrare un banner
  "Alternativa Aₓ · dal DOCFAP «Asilo nido comunale»" con azione di ritorno al dettaglio DOCFAP
  (`/impatti/docfap/detail`). Riuso della `simple-banner` già presente; contenuto condizionato
  all'id `PROJ-NIDO-*` (mappa id→alternativa).

### 4.3 Ordine e priorità
1. **B.1 ECBA** (star della demo: spaccato benefici sociali, waterfall, VANE/BCR).
2. **B.3/B.4** registrazione + banner per l'ECBA.
3. **B.2 EIA** + registrazione.
4. **A.1/A.2** correzioni card + label OPEX.

### 4.4 Casi limite e verifica
- A3 con VANE negativo reso correttamente in tutte le sezioni ECBA.
- Voucher: donut senza la voce "valore servizio" (NID-00=0) — verificare etichette coerenti.
- Coerenza numerica: VANE/BCR/impatto mostrati nella vista ponte = quelli del box DOCFAP
  (a meno degli arrotondamenti), verificati a schermo su tutte e 3 le alternative.
- Le pagine MUBA/Ospedale restano invariate (nessuna regressione sui dataset statici).

---

## 5. Desiderata 3 — Strategia: costruire "a ritroso" il wizard DOCFAP

**Solo ragionamento in questa iterazione. Nessun codice.**

### 5.1 Il problema
Il wizard DOCFAP oggi è "sballato" perché `Step7` → `runPOCAnalysis()` non riceve input e
restituisce sempre lo scenario cablato. Gli output non cambiano mai al variare di ciò che si
digita. Esiste un motore DOCFAP reale (`cba.ts`, `impatto.ts`, `sensitivita.ts`) ma è scollegato.

### 5.2 Il metodo inverso
Partire dall'**output noto-buono** e derivare gli input necessari a riprodurlo:

- **Beneficio**: è `posti × Σ KPI(categoria)`. Il driver primario è **i posti** (per il voucher,
  i beneficiari addizionali). I €/posto vengono dai KPI di categoria (costanti + dati
  territoriali). ⇒ Il wizard deve raccogliere: categoria d'intervento, posti/beneficiari,
  eventuale addizionalità (deadweight), ed esporre i dati territoriali (redditi, Gini) come
  confermabili.
- **Impatto EIA**: è `CAPEX × moltiplicatori(settore)`. ⇒ Il wizard deve raccogliere: settore,
  CAPEX per alternativa.
- **CBA**: VANE/BCR/TIRE = funzione di CAPEX, OPEX, beneficio annuo, orizzonte, tasso, valore
  residuo. ⇒ Il wizard deve raccogliere questi per ogni alternativa.

### 5.3 Mappa step → input → motore
Tabella (da dettagliare nel doc) che, per ciascuna fase del wizard, indica: cosa chiede oggi,
quale input alimenta quale grandezza dell'output, e dove il **motore KPI di Ricadute** (che già
calcola beneficio da posti+categoria) potrebbe sostituire il cablato `runPOCAnalysis`.

### 5.4 Percorso di migrazione
- **Approccio 1 (attuale, curato):** allineare prefill/default del wizard così che il percorso
  scriptato asilo nido produca esattamente A1/A2/A3. Demo-safe, rischio nullo, ma coerente solo
  sul percorso previsto.
- **Approccio 2 (target):** ricollegare gli input del wizard al motore KPI di Ricadute (già
  funzionante e già fonte dei numeri) invece di `runPOCAnalysis`, così che qualsiasi input dia
  output coerenti. Punti di decisione: dove vive il calcolo (condiviso tra i due moduli?),
  gestione delle N alternative, riuso di `buildBeneficiKpi`/`computeEcba`/`computeEia`.
- Rischi, non-obiettivi e stima per ciascun approccio.

---

## 6. File coinvolti (desiderata 1 e 2)

- `app/src/mocks/ecbaDatasets.js` — nuovo builder `buildNidoEcbaDataset` + registrazione nido.
- `app/src/mocks/eiaDatasets.js` — nuovo builder `buildNidoEiaDataset` + registrazione nido.
- `app/src/lib/projectState.js` — eventuale export del workspace nido calcolato per i builder.
- `app/src/components/EcbaResults.jsx` / `EiaResults.jsx` — banner ponte condizionato agli id nido.
- `app/src/poc/pages/DocfapList.tsx` — allineamento card `docfap-003` (A.1).
- Etichetta OPEX (A.2): `DocfapDetail.tsx` e/o pagine ponte.

## 7. Non-obiettivi
- Nessuna modifica ai motori di calcolo (`ecbaEngine`/`eiaEngine`/`pocAnalysis`).
- Nessuna riscrittura delle pagine `EiaResults`/`EcbaResults` (solo dataset + banner).
- Nessuna implementazione del wizard "a ritroso" (desiderata 3 resta strategia).
- Export PDF/Excel restano placeholder.

## 8. Rischi
- **Mappatura EIA (B.2)** più onerosa del previsto: mitigata da geografia minimale e conferma
  shape in fase di plan.
- **Punto di accesso al workspace** dai registri dataset (import statici): da risolvere con
  getter/memoization.
- **Rendering VANE negativo (A3)** in `EcbaResults`: da verificare a schermo.
- **Bump cache `localStorage`** dei progetti se cambia la forma dei seed nido.

## 9. Verifica (prima della POC)
- `npm run build` (in `app/`) verde.
- Da DOCFAP asilo nido: "Analisi completa A1/A2/A3" → pagine ECBA/EIA con numeri **coerenti col
  box DOCFAP** (VANE/BCR/impatto) per tutte e 3 le alternative.
- Spaccato benefici sociali (5 KPI NID) visibile nel donut ECBA della vista ponte.
- Banner ponte presente con ritorno al DOCFAP.
- Card `docfap-003` coerente col dettaglio (Colleferro, ristrutturazione, senza OPEX 80k).
- Nessuna regressione su MUBA/Ospedale.
- Capitolo strategia wizard (desiderata 3) presente e revisionato.
