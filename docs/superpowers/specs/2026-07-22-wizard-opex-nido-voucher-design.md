# Wizard DOCFAP — OPEX realistici per asili nido e voucher

> Data: 2026-07-22 · Autore: Riccardo Scialla + Claude
> Contesto: POC di vendita. Emerso provando il wizard live sul DOCFAP asilo nido.
> Estende `2026-07-21-docfap-asilo-nido-poc-design.md`.

---

## 1. Problema

Provando il wizard DOCFAP dal vivo (Fase 3 → parametri alternativa, componente
`InputParamsStep.tsx`) emergono due criticità sull'OPEX:

1. **Range OPEX sbagliato per gli asili nido.** Lo "specchietto Tasso OPEX di riferimento"
   e il valore auto-seed vengono dal dato di categoria `opex.pct_min/med/max`. Per
   C106 "Asili Nido" è `3/5/7%` del CAPEX. Ma un nido è ad alta intensità di personale
   educativo: l'OPEX reale (costo pubblico netto) è ~16-21% del CAPEX (A1 nido 420k su
   2,64M = 16%; A2 300k su 1,44M = 21%). Il suggerimento a 3-7% è fuori scala e l'auto-seed
   (~3-5%) produce valori irrealistici (~80-130k invece di ~400k).
2. **Il voucher non è rappresentabile.** Il voucher ha CAPEX 0 e costo tutto OPEX
   (trasferimento alle famiglie). In `InputParamsStep`:
   - l'OPEX è calcolato come `CAPEX × %` → con CAPEX 0 fa 0;
   - il blocco OPEX quando `!hasCapex` (CAPEX 0) mostra solo *"Conferma prima il CAPEX…"* →
     vicolo cieco, non si può inserire l'OPEX;
   - l'effetto di salvataggio fa `return` se `capex <= 0` → l'alternativa non verrebbe
     nemmeno salvata.

Inoltre, oggi l'unico controllo OPEX editabile è la **% del CAPEX** (lo stepper); il box
"OPEX annuale stimato" in €/anno è di sola lettura. Per il caso CAPEX 0 serve invece
l'inserimento diretto in €.

## 2. Approccio scelto (confermato con l'utente)

**Opzione 1 — "% primaria + range corretto + voucher in € assoluti".**
- Per le alternative con CAPEX > 0 (A1/A2) il modello resta invariato: la **% del CAPEX**
  è il controllo primario, si corregge solo il **range di riferimento**.
- Per le alternative con **CAPEX = 0** (voucher e simili) l'OPEX si inserisce come
  **valore assoluto €/anno**, senza la % (che con CAPEX 0 non ha senso).
- Trigger della modalità "solo OPEX" = **CAPEX = 0** (regola semplice, categoria-agnostica).
- Range OPEX per categorie infanzia = **12 / 18 / 25%** (min/medio/max).

Non-obiettivi: nessun campo € editabile aggiuntivo per il caso CAPEX > 0; nessuna modifica
ai motori di calcolo, agli altri step o agli altri componenti costi (`Step3_CostiAlternativaV2`
è codice morto e resta tale).

## 3. Modifiche

### 3.1 Dati — range OPEX categorie infanzia
File: `app/src/poc/data/poc_docfap/intervention_categories_layer3.ts`.
- **C106 "Asili Nido"**: `opex` da `{ pct_min: 0.03, pct_med: 0.05, pct_max: 0.07 }`
  a **`{ pct_min: 0.12, pct_med: 0.18, pct_max: 0.25 }`**.
- **C119 "Servizi Per L'Infanzia"**: stesso nuovo range `{ 0.12, 0.18, 0.25 }`.

Effetti a cascata (voluti):
- `InputParamsStep`: aside "Tasso OPEX di riferimento" mostra 12/18/25%; auto-seed della
  quota parte da 18%.
- `DocfapWizard` autofill (`paramsFor` usa `cat.opex.pct_med`): l'OPEX seed di A1/A2 diventa
  ~18% del CAPEX (~475k / ~260k), vicino ai valori realistici del dettaglio.

### 3.2 UI — modalità "solo OPEX" quando CAPEX = 0
File: `app/src/poc/components/wizard/fase3/InputParamsStep.tsx`.

Nel blocco OPEX (`opexBlock`), sostituire il ramo `!hasCapex` (oggi solo un hint
"Conferma prima il CAPEX…") con:
- Se `!hasCapex` **e** è stata inserita una quantità/l'alternativa è attiva → mostrare un
  **input editabile "OPEX annuo (€/anno)"** legato a `opexValStr`, con un handler diretto
  che imposta l'OPEX senza derivare la %.
- In modalità CAPEX 0 **non** renderizzare lo stepper % né l'aside "Tasso OPEX di
  riferimento" (evita la % e la divisione per zero). Mantenere gli altri riquadri
  informativi utili (vita utile / periodo OPEX / OPEX totale) se applicabili.
- `handleOpexValChange` non deve calcolare la % quando `capex` è 0 (evita `/0`): lasciare
  `opexPctStr` vuoto/non applicabile.

Correggere l'effetto di salvataggio (attualmente `if (isNaN(capex) || capex <= 0) return`)
così che l'alternativa venga salvata anche con `capex === 0` purché ci sia un OPEX valido
(`opex > 0`). Mantenere il vincolo che senza né CAPEX né OPEX non si salva nulla.

Per `hasCapex` (CAPEX > 0) il comportamento resta identico a oggi (nessuna regressione).

## 4. File coinvolti
- `app/src/poc/data/poc_docfap/intervention_categories_layer3.ts` — range OPEX C106, C119.
- `app/src/poc/components/wizard/fase3/InputParamsStep.tsx` — modalità CAPEX 0 → OPEX €,
  save-effect con capex 0.

## 5. Rischi
- La modifica del `pct_med` di C106/C119 sposta l'OPEX auto-seed dell'autofill: verificare che
  A1/A2 restino coerenti col dettaglio (valori ~realistici, non identici).
- `InputParamsStep` è un componente grande: la modifica va confinata al blocco OPEX e
  all'effetto di salvataggio, senza toccare il flusso CAPEX>0.
- Il voucher passa da categoria "Servizi per l'infanzia" + tipologia "Altro" + CAPEX 0:
  verificare che con CAPEX 0 si raggiunga il campo OPEX (richiede quantità inserita).

## 6. Verifica (nessun test runner → build + a schermo)
- `npm run build` verde.
- Wizard A1/A2 (CAPEX > 0): l'aside OPEX mostra 12/18/25%; impostando 16-18% l'OPEX €/anno è
  realistico; nessun cambiamento di flusso rispetto a prima.
- Wizard voucher (categoria Servizi per l'infanzia, tipologia Altro, CAPEX 0): compare il
  campo "OPEX annuo (€/anno)" editabile; inserendo es. 600.000 l'alternativa si salva e
  prosegue; nessuno stepper %/aside % visibile; nessun errore in console.
