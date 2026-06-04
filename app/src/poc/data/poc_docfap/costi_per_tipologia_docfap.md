# Costi Parametrici per Tipologia di Intervento — Guida Integrazione DOCFAP

## Panoramica

Il file `costi_per_tipologia.ts` contiene 264 record che mappano le categorie di intervento MOP (C###) ai costi parametrici unitari, modulati per 12 tipologie di intervento. Questo file alimenta il calcolo automatico del costo stimato durante la compilazione del DOCFAP nella POC Civiqa.

## Struttura dati

Ogni record contiene:

| Campo | Tipo | Descrizione |
|---|---|---|
| `cat_code` | `string` | Codice categoria MOP (es. `C001`, `C108`) — chiave di join con `mop_albero_v2.ts` |
| `cat_label` | `string` | Etichetta della categoria |
| `udm` | `string` | Unità di misura del costo (€/mq, €/km, €/UBA, €/posto letto, ecc.) |
| `val_min` | `number` | Costo base minimo (nuova realizzazione) |
| `val_max` | `number` | Costo base massimo (nuova realizzazione) |
| `val_med` | `number` | Costo base medio: `(val_min + val_max) / 2` |
| `tipologie` | `TipologiaPct[]` | Array delle tipologie applicabili con le percentuali di aggiustamento |
| `note_intervento` | `string` | Note specifiche per tipologia |
| `fonte_principale` | `string` | Fonte primaria del dato di costo |
| `fonti_secondarie` | `string` | Fonti secondarie e di cross-check |
| `note_metodologiche` | `string` | Note sul metodo di stima e range di applicabilità |

Le 12 tipologie di intervento sono:

| Codice | Etichetta | Range % tipico |
|---|---|---|
| `NUOVA_REALIZZAZIONE` | Nuova realizzazione | 100% (base) |
| `RISTRUTTURAZIONE` | Ristrutturazione | 30–85% |
| `RISTRUTTURAZIONE_CON_EE` | Ristrutturazione con efficientamento energetico | 35–90% |
| `MANUTENZIONE_STRAORD_EE` | Manutenzione straord. con efficientamento energetico | 10–50% |
| `MANUTENZIONE_ORDINARIA` | Manutenzione ordinaria | 2–8% |
| `RESTAURO` | Restauro | 40–130% |
| `RECUPERO` | Recupero | 25–90% |
| `AMPLIAMENTO_POTENZIAMENTO` | Ampliamento o potenziamento | 40–90% |
| `AMMODERNAMENTO_TECNOLOGICO` | Ammodernamento tecnologico e laboratoriale | 10–50% |
| `DEMOLIZIONE` | Demolizione | 3–18% |
| `LAVORI_SOCIALMENTE_UTILI` | Lavori socialmente utili | 5–20% |
| `ALTRO` | Altro | 10–50% |

> **Nota**: Non tutte le tipologie sono applicabili a tutte le categorie. Se una tipologia ha valore N/A nel file sorgente, non compare nell'array `tipologie` del record. L'array contiene solo le tipologie effettivamente utilizzabili.

## Flusso nel DOCFAP

### Quando si attiva il calcolo

Nel wizard DOCFAP a 7 step, il calcolo dei costi parametrici si attiva nello **Step 2 (Definizione dell'intervento)** quando l'utente:

1. **Seleziona una categoria di intervento** (C###) dal dropdown alimentato da `mop_albero_v2.ts`
2. **Seleziona una tipologia di intervento** dal secondo dropdown (filtrato sulle tipologie applicabili)

### Logica di calcolo

```
costo_min = val_min × (tipologia.pct_min / 100)
costo_max = val_max × (tipologia.pct_max / 100)
costo_med = val_med × (tipologia.pct_med / 100)
```

Esempio concreto — **C108 Scuole** + **Ristrutturazione**:

```
val_min = 900, val_max = 1500, val_med = 1200 (€/mq SLP)
pct_min = 40%, pct_max = 65%, pct_med = 52.5%

→ costo_min = 900 × 0.40 = 360 €/mq SLP
→ costo_max = 1500 × 0.65 = 975 €/mq SLP
→ costo_med = 1200 × 0.525 = 630 €/mq SLP
```

### Uso delle helper functions

Il file esporta tre funzioni pronte all'uso:

```typescript
import {
  getCostiByCategory,
  calcolaCostoTipologia,
  getTipologieApplicabili,
  type TipologiaIntervento,
} from './costi_per_tipologia';

// 1. Recupera tutti i record per una categoria
const records = getCostiByCategory('C108');

// 2. Calcola il costo per una tipologia specifica
const costo = calcolaCostoTipologia(records[0], 'RISTRUTTURAZIONE');
// → { val_min: 360, val_max: 975, val_med: 630, udm: '€/mq SLP' }

// 3. Oppure ottieni tutte le tipologie applicabili con i costi precalcolati
const tutte = getTipologieApplicabili('C108');
// → Array di oggetti con tipologia, label, val_min, val_max, val_med, udm, fonti, note
```

### Cosa restituire al frontend

Dopo il calcolo, il backend deve restituire al frontend un oggetto con questa struttura:

```typescript
interface CostoStimato {
  /** Range di costo per la combinazione categoria × tipologia */
  val_min: number;
  val_max: number;
  val_med: number;
  udm: string;

  /** Metadati per il pannello informativo */
  fonte_principale: string;
  fonti_secondarie: string;
  note_metodologiche: string;
  note_intervento: string;

  /** Info sulla tipologia selezionata */
  tipologia_label: string;
  tipologia_pct_min: number;
  tipologia_pct_max: number;
}
```

### Rendering frontend (UX)

Il componente frontend dovrebbe mostrare:

1. **Card Costo Stimato** — Valore medio in grande, con range min–max in piccolo sotto. L'unità di misura sempre visibile accanto al valore.

2. **Barra di range** — Visualizzazione grafica del range min/med/max con indicatore della posizione del valore medio. Stile: barra orizzontale con gradiente dal verde chiaro al verde scuro.

3. **Pannello Note** — Sezione collassabile che mostra:
   - Note metodologiche (sempre visibile di default)
   - Fonte principale e fonti secondarie (in un sotto-blocco "Fonti")
   - Note specifiche per tipologia (in un sotto-blocco "Dettaglio intervento")

4. **Disclaimer** — Testo fisso: *"I valori indicati sono stime parametriche basate su fonti istituzionali e banche dati OpenCoesione. Il costo effettivo dipende dalle specifiche progettuali, dalla localizzazione e dalle condizioni di mercato."*

## Categorie con record multipli

40 categorie MOP hanno più di un record nel file sorgente (es. C058 ha 3 record, C260 ne ha 5). Questo accade quando il file Excel contiene sotto-voci più granulari che mappano sulla stessa categoria MOP.

La funzione `getCostiByCategory()` restituisce tutti i record; il frontend può:
- **Usare il primo record** (`records[0]`) come primario per il calcolo
- **Mostrare i record aggiuntivi** come voci alternative in un dropdown "Specifica tipologia MOP"

## Note tecniche

- I valori `val_min`, `val_max`, `val_med` sono espressi in euro nell'unità specificata da `udm`
- Le percentuali sono numeri interi (es. `40` = 40%, non 0.40)
- La formula di calcolo usa `Math.round()` per arrotondare all'intero
- Il file non ha dipendenze esterne — può essere importato direttamente nel progetto React
- Il campo `cat_code` è la chiave di join con `mop_albero_v2.ts`, `cost_params_layer2.ts` e `kpi_benefits_layer2.ts`
