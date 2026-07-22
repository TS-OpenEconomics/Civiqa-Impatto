# Wizard OPEX nido + voucher — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Rendere realistico l'OPEX degli asili nido nel wizard DOCFAP (range % corretto) e permettere l'inserimento dell'OPEX come valore assoluto €/anno quando il CAPEX è 0 (voucher).

**Architecture:** Due modifiche isolate: (1) dato di categoria (range OPEX % per C106/C119) in `intervention_categories_layer3.ts`; (2) logica UI in `InputParamsStep.tsx` per la modalità "solo OPEX" quando CAPEX=0, incluso lo sblocco del blocco progressivo OPEX e il salvataggio.

**Tech Stack:** React + TypeScript (modulo DOCFAP `app/src/poc`), Vite.

## Global Constraints
- **Nessun test runner** nel repo. Verifica = `npm run build` (dalla root) verde + controllo a schermo. NON introdurre framework di test.
- Build: `npm run build` dalla root.
- Non modificare i motori di calcolo né altri componenti oltre ai due file elencati.
- Range OPEX categorie infanzia = **`{ pct_min: 0.12, pct_med: 0.18, pct_max: 0.25 }`**.
- Trigger modalità "solo OPEX" = **CAPEX confermato a 0**.
- Per CAPEX > 0 (A1/A2) il flusso resta **identico a oggi** (nessuna regressione).

---

### Task 1: Range OPEX realistico per categorie infanzia

**Files:**
- Modify: `app/src/poc/data/poc_docfap/intervention_categories_layer3.ts` (riga 6873 = opex di C106; riga 7744 = opex di C119)

**Interfaces:** nessuna (dati statici).

- [ ] **Step 1: Aggiornare l'opex di C106 (Asili Nido)**

Leggere il file attorno a riga 6873 (blocco `code: "C106"`, `label: "Asili Nido"`). La riga è:
```
    opex: { pct_min: 0.03, pct_med: 0.05, pct_max: 0.07 },
```
Poiché questa stringa NON è unica nel file, costruire un `old_string` multilinea che includa le righe immediatamente precedenti del blocco C106 per renderlo univoco (le due righe che chiudono `useful_life` di C106 + la riga opex), verificando con una Read che il match sia unico. Sostituire il valore opex con:
```
    opex: { pct_min: 0.12, pct_med: 0.18, pct_max: 0.25 },
```
Deve cambiare SOLO la riga opex di C106.

- [ ] **Step 2: Aggiornare l'opex di C119 (Servizi Per L'Infanzia)**

Leggere attorno a riga 7744 (blocco `code: "C119"`, `label: "Servizi Per L'Infanzia"`, che termina prima di `code: "C120"` a riga 7752). La riga è:
```
    opex: { pct_min: 0.02, pct_med: 0.035, pct_max: 0.05 },
```
Anche questa non è unica: usare un `old_string` multilinea con il contesto specifico del blocco C119 (righe che precedono la sua opex, es. la chiusura di `useful_life`/`tipologie` di C119), verificando l'unicità con una Read. Sostituire con:
```
    opex: { pct_min: 0.12, pct_med: 0.18, pct_max: 0.25 },
```

- [ ] **Step 3: Verifica edit mirato**

Run: `git diff --stat` e una ricerca del nuovo triplo.
Grep: `pct_min: 0.12, pct_med: 0.18, pct_max: 0.25` deve comparire **esattamente 2 volte** nel file. Il `git diff` deve mostrare solo 2 righe cambiate (le due opex), nient'altro.

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: build verde.

- [ ] **Step 5: Commit**

```bash
git add app/src/poc/data/poc_docfap/intervention_categories_layer3.ts
git commit -m "fix(docfap): OPEX realistico per categorie infanzia (C106/C119: 12/18/25%)"
```

---

### Task 2: Modalità "solo OPEX" quando CAPEX = 0 (voucher)

**Files:**
- Modify: `app/src/poc/components/wizard/fase3/InputParamsStep.tsx`

**Interfaces:**
- Consumes: stato/handler esistenti (`capexStr`, `opexValStr`, `hasCapex`, `capexNum`, `opexNum`, `hasOpex`, `handleOpexValChange`, `displayInt`, `stripDots`, `focusedField`, `setFocusedField`, stili `panelInputRowStyle`/`panelInputStyle`/`udmBadgeStyle`/`blockBodyStyle`/`questionStyle`/`fieldHeadingStyle`, `formatEur`).
- Produces: comportamento invariato per CAPEX>0; nuovo input OPEX €/anno per CAPEX=0.

- [ ] **Step 1: Derivare i flag "CAPEX confermato a 0" / "blocco CAPEX completo"**

Dopo la riga che definisce `hasCapex` (attorno a riga 350: `const hasCapex = !isNaN(capexNum) && capexNum > 0`), aggiungere:
```ts
  // CAPEX confermato esplicitamente a 0 (es. voucher: nessun investimento fisico).
  // Distinto dal campo vuoto (non ancora compilato): abilita la modalità "solo OPEX".
  const capexIsZeroConfirmed = capexStr.trim() !== '' && !isNaN(capexNum) && capexNum === 0
  const capexBlockComplete = hasCapex || capexIsZeroConfirmed
```

- [ ] **Step 2: Sbloccare il blocco progressivo OPEX quando CAPEX è 0**

Nel blocco `capex` dell'array `blocks` (attorno a riga 785-791), sostituire:
```ts
      complete: hasCapex,
      summary: hasCapex ? formatEur(Math.round(capexNum)) : undefined,
```
con:
```ts
      complete: capexBlockComplete,
      summary: hasCapex
        ? formatEur(Math.round(capexNum))
        : capexIsZeroConfirmed
          ? 'Nessun investimento (CAPEX 0)'
          : undefined,
```
(Così, con CAPEX confermato a 0, il blocco CAPEX risulta completo e il blocco OPEX — `sequential` — si sblocca.)

- [ ] **Step 3: Ramo "solo OPEX" nel blocco OPEX**

Nel `opexBlock` (attorno a riga 637-642), il ramo `!hasCapex` oggi è:
```tsx
      {!hasCapex ? (
        <p style={hintStyle} aria-live="polite">
          Conferma prima il CAPEX per stimare l'OPEX annuo.
        </p>
      ) : (
```
Sostituire l'intero ramo `!hasCapex` (solo la parte fra `{!hasCapex ? (` e `) : (`) con: se il CAPEX è confermato a 0, un input €/anno editabile; altrimenti l'hint originale.
```tsx
      {!hasCapex ? (
        capexIsZeroConfirmed ? (
          <div style={blockBodyStyle}>
            <p style={questionStyle}>
              Questa alternativa non prevede un investimento (CAPEX 0): inserisci direttamente il
              costo operativo annuo (es. trasferimenti/voucher alle famiglie).
            </p>
            <div>
              <p style={fieldHeadingStyle}>OPEX annuo</p>
              <div style={panelInputRowStyle}>
                <input
                  id={`opex-abs-${alternativaId}`}
                  type="text"
                  inputMode="numeric"
                  value={displayInt(opexValStr, focusedField === `opex-abs-${alternativaId}`)}
                  onChange={(e) => handleOpexValChange(stripDots(e.target.value))}
                  onFocus={() => setFocusedField(`opex-abs-${alternativaId}`)}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Inserisci importo"
                  style={panelInputStyle}
                  aria-label="OPEX annuo in euro"
                />
                <span style={udmBadgeStyle}>€/anno</span>
              </div>
            </div>
          </div>
        ) : (
          <p style={hintStyle} aria-live="polite">
            Conferma prima il CAPEX per stimare l'OPEX annuo.
          </p>
        )
      ) : (
```
Nota: `handleOpexValChange` già oggi calcola la % solo se `capex > 0` (riga ~288), quindi con CAPEX 0 imposta solo il valore € senza divisione per zero. Lo stepper % e l'aside "Tasso OPEX di riferimento" vivono nel ramo `else` (CAPEX>0) e quindi NON compaiono in modalità solo-OPEX: nessuna modifica ulteriore.

- [ ] **Step 4: Salvare l'alternativa anche con CAPEX 0**

Nell'effetto di auto-save (attorno a riga 320-331), sostituire:
```ts
    const capex = parseFloat(capexStr)
    const opex = parseFloat(opexValStr)
    const duration = parseInt(durationStr)
    if (isNaN(capex) || capex <= 0) return
    addAlternativa(alternativaId as AlternativaId, {
      ...altRef.current,
      quantita: totalQty,
      capex,
      opex: isNaN(opex) ? 0 : opex,
      durataStimata: isNaN(duration) ? undefined : duration,
      vitaUtileProgram: vitaUtile > 0 ? vitaUtile : undefined,
    })
```
con:
```ts
    const capex = parseFloat(capexStr)
    const opex = parseFloat(opexValStr)
    const duration = parseInt(durationStr)
    const capexOk = !isNaN(capex) && capex > 0
    // Modalità "solo OPEX" (voucher): CAPEX 0 ma OPEX valido → si salva comunque.
    const opexOnly = (isNaN(capex) || capex === 0) && !isNaN(opex) && opex > 0
    if (!capexOk && !opexOnly) return
    addAlternativa(alternativaId as AlternativaId, {
      ...altRef.current,
      quantita: totalQty,
      capex: capexOk ? capex : 0,
      opex: isNaN(opex) ? 0 : opex,
      durataStimata: isNaN(duration) ? undefined : duration,
      vitaUtileProgram: vitaUtile > 0 ? vitaUtile : undefined,
    })
```

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: build verde (nessun errore TypeScript; attenzione a `capexIsZeroConfirmed`/`capexBlockComplete` usati e non "unused").

- [ ] **Step 6: Verifica a schermo (per l'operatore, dopo la build)**

- A1/A2 (CAPEX > 0): l'aside "Tasso OPEX di riferimento" mostra 12/18/25%; impostando la % a ~16-18% l'OPEX €/anno è realistico; flusso invariato.
- Voucher (categoria "Servizi per l'infanzia", tipologia "Altro", CAPEX = 0): il blocco CAPEX si completa a "Nessun investimento (CAPEX 0)", il blocco OPEX si sblocca e mostra il campo "OPEX annuo (€/anno)" editabile; inserendo es. 600.000 l'alternativa prosegue/salva; nessuno stepper %/aside % visibile; console pulita.

- [ ] **Step 7: Commit**

```bash
git add app/src/poc/components/wizard/fase3/InputParamsStep.tsx
git commit -m "feat(docfap): input OPEX in euro assoluti quando CAPEX 0 (voucher)"
```

---

## Self-review checklist
- [ ] Task 1 cambia SOLO le 2 righe opex (grep del nuovo triplo = 2).
- [ ] Task 2 non tocca il flusso CAPEX>0 (ramo `else` invariato).
- [ ] `capexIsZeroConfirmed`/`capexBlockComplete` usati (no TS "unused").
- [ ] Save-effect: nessuna regressione per alternative normali (capexOk copre il caso attuale).
