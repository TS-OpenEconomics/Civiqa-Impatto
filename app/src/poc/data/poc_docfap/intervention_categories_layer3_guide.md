# Analyst & Developer Guide — `intervention_categories_layer3.ts`
## OpenCore Layer 3 · Categorie di Intervento

> Intended audience: Evaluation analysts, ICT developers, and AI coding assistants.
> Last updated: May 2026 · Pre-populated from Layer 1 + Layer 2

---

## Table of Contents

1. [What this table is and what it does](#1-what-this-table-is-and-what-it-does)
2. [Where it fits in the CBA architecture](#2-where-it-fits-in-the-cba-architecture)
3. [How this table was built — source data and pre-population pipeline](#3-how-this-table-was-built)
4. [Record structure — field-by-field reference](#4-record-structure)
5. [The link system — how categories reference Layer 1 and Layer 2](#5-the-link-system)
6. [Classification MOP — Settore, Sotto Settore, Cluster](#6-classification-mop)
7. [CBA parameters — discount rate, useful life, construction, OPEX](#7-cba-parameters)
8. [Zero Scenario Categories — the counterfactual](#8-zero-scenario-categories)
9. [Decisions made and why](#9-decisions-made-and-why)
10. [Known limitations and pending work](#10-known-limitations)
11. [How to create or modify a category](#11-how-to-create-or-modify)
12. [Companion files](#12-companion-files)
13. [Current table status](#13-current-table-status)
14. [FAQ](#14-faq)

---

## 1. What this table is and what it does

`intervention_categories_layer3.ts` is the **central aggregating entity** of the OpenCore CBA engine. It contains 285 records, each representing a single MOP intervention category with all the links required to compute a full Cost-Benefit Analysis.

An **intervention category** is the unit of classification for Italian public works (D.Lgs. 36/2023). For example, category C108 — "Scuole Elementari, Medie E Superiori" — aggregates:
- 5 KPI benefit formulas (SCU-01 through SCU-05) that quantify the social benefits of investing in schools
- 2 Cost Parameters (CP-073, CP-115) that estimate the investment cost
- 12 intervention typologies with applicability flags and cost/benefit adjustments
- 4 fabbisogni (FAB-02, FAB-15, FAB-53, FAB-54) that anchor the need for the investment
- 2 beneficiary targets (TGT-02 children, TGT-12 school community)
- 4 NACE economic sectors with expenditure allocation (F 60%, P85 15%, M71 15%, C31-32 10%)
- CBA parameters: discount rate (3%), useful life (10–40 years by typology), construction duration (6–24 months), OPEX (3–7% of CAPEX annually)

### What the table provides

**Aggregate.** Before this table, the connections between KPIs, CPs, fabbisogni, targets, and CBA parameters existed across 20+ separate files with no single point of reference. This table unifies everything under one entity: the MOP category code.

**Activate.** When a municipal officer selects a category in the DOCFAP wizard, the system loads this record and knows immediately: which benefits to calculate, which costs to estimate, which questions to ask, which targets to offer, and which parameters to use for the CBA.

**Configure.** Every field is configurable by the analyst. For the 285 existing categories, most fields are pre-populated from Layer 1 and Layer 2 data. For new categories created by the analyst, all fields start empty and must be configured through the backoffice wizard.

### What this table activates

- **Wizard DOCFAP** — the IC record is the data source for every step of the wizard: fabbisogno selection, cost estimation, benefit calculation, typology selection, CBA computation
- **OpenCore backoffice** — the analyst configures categories through the CRUD interface, linking KPIs, CPs, targets, NACE sectors, and setting CBA parameters
- **CBA engine** — `computeCBA(categoryCode, typology, municipality)` loads the IC record, resolves all links, evaluates all formulas, and produces VANE/BCR/TIRE
- **DOCFAP document** — the generated document draws classification data (sector, fabbisogno, DUP mission, EU objective) from the IC record via fabbisogni

| Metric | Value |
|---|---|
| Intervention categories | 285 (C001–C285, including CM01–CM08 Civiqa) |
| Categories with KPI links | 212 (907 total KPI links) |
| Categories with CP links | 225 (276 total CP links) |
| Categories with fabbisogni | 285 (396 total links, 89 cats in 2+ fabbisogni) |
| Typologies per category | 10–12 (12 available, 2 occasionally not applicable) |
| NACE sectors per category | 4 (Σ pct = 100%) |
| CBA parameters per category | discount rate + OPEX + useful life by typology + construction duration by typology |

---

## 2. Where it fits in the CBA architecture

```
Layer 0 — Municipal statistics              statistics.ts
           ↓                                input_params.ts
Layer 1 — Reference tables
           fixed_params.ts          ← physical constants, rates, benchmarks
           monetization_factors.ts  ← shadow prices (€/unit)
           cost_factors.ts          ← unit costs (€/mq, €/km)
           mop_albero_v2.ts         ← MOP tree (S→SS→C)
           fabbisogni_v2.ts         ← territorial needs
           domande_contesto.ts      ← context questions for KPI activation
           targets.ts               ← beneficiary targets
           settori_nace.ts          ← NACE economic sectors
           tipologie_intervento.ts  ← intervention types with benefit weights
           tipologie_fc.ts          ← cost correction by type
           territorialita_fc.ts     ← cost correction by geography
           evaluation_matrix.ts     ← MCA evaluation questions
           ↓
Layer 2 — Calculation formulas
           kpi_benefits_layer2.ts   ← 907 KPI benefit formulas
           cost_params_layer2.ts    ← 268 cost parameter formulas
           ↓
Layer 3 — Category aggregation              ← THIS TABLE
           intervention_categories_layer3.ts    285 categories
           zero_scenario_categories_layer3.ts   63 zero scenarios
           ↓
Layer 4 — DOCFAP scoring and ranking         Wizard Step 7
```

### The activation chain

```
Officer selects Fabbisogno → system offers eligible Categories
  → Officer selects Category C###
    → system loads InterventionCategory record
      → activates KPIs (with conditional DC activation)
      → activates CPs
      → offers applicable Typologies
      → loads CBA parameters (discount rate, useful life, OPEX)
    → Officer selects Typology
      → system computes CAPEX (CP × geo_k × tipo_k)
      → system computes Benefits (KPI × benefit_pct)
      → system computes CBA (VANE, BCR, TIRE)
```

---

## 3. How this table was built — source data and pre-population pipeline

The table was pre-populated in 5 phases from existing Layer 1 and Layer 2 data.

### Phase 0 — Identity and classification (from mop_albero_v2.ts)

All 285 categories were initialised with `code`, `label`, `subsector_code`, `sector_code`, and `cluster_id` from `mop_albero_v2.ts`. These are FK references, not copies — the labels are resolved at runtime.

### Phase 1 — Layer 2 links (from KPI_MAPPINGS and CP_MAPPINGS)

- **KPI links**: populated from `KPI_MAPPINGS` in `kpi_benefits_layer2.ts` (212 categories, 907 total links). Each link initialised with `is_negative_externality: false`, `benefit_pct_override: null`, `activation_question_ids: []` — analyst must configure these.
- **CP links**: populated from `CP_MAPPINGS` in `cost_params_layer2.ts` (225 categories, 276 total links). CP-NNN → CF-NNN (1:1 mapping confirmed).

### Phase 2 — Layer 1 reverse lookups

- **Fabbisogni**: reverse lookup from `fabbisogni_v2.ts → category_codes[]`. All 285 categories have ≥1 fabbisogno.
- **Cost Factors (CF)**: reverse lookup from `cost_factors.ts → mop_codes[]`. 225 categories have ≥1 CF; 60 categories (mainly training, R&D, services) have none.
- **Tipologie**: populated from `tipologie_fc.ts` via `subsector_code`. 12 typologies per category, with `applicable` flags from the subsector coefficients. Two typologies have selective restrictions: `restauro` (71 categories ❌), `lavori_socialmente_utili` (140 categories ❌).
- **OPEX**: derived from `tipologie_fc.ts → manutenzione_ordinaria` coefficients per subsector. 6 distinct profiles (min/med/max ranges from 2%–5% to 5%–12%).

### Phase 3 — Analyst-configured fields (subsector-first propagation)

These fields were assigned at the subsector level (44 configurations) and propagated to 285 categories, with category-level overrides where needed.

- **Targets**: 14 available targets, assigned per subsector with 27 category overrides (mainly SS25 schools/social, SS24 health, SS16 housing).
- **NACE sectors**: 4 sectors per category with % allocation (Σ = 100%), assigned per subsector with 16 category overrides.
- **Useful life**: base years per subsector (10–50), multiplied by typology factor (×0.25 to ×1.00), rounded to 5 years. 14 category overrides. Corrected against EC Guide to CBA 2014 Table 2.1.
- **Construction duration**: base months per subsector (3–48), multiplied by typology factor (×0.25 to ×1.00), rounded to 3 months. 13 category overrides.
- **Discount rate**: default EC 3% (range 1%–5%) for all categories. Source: EC Guide to CBA 2014, § 2.8.3.

### Institutional sources used

| Source | What it provides | Applied to |
|---|---|---|
| EC Guide to CBA 2014, Table 2.1 | Reference time horizons by sector (10–30 years) | Useful life base values |
| Reg. Delegato UE 480/2014, Art. 15(2) | Regulatory framework for reference periods | Useful life validation |
| NTC 2018 (D.M. 17/01/2018), § 2.4.1 | Structural design life: 10/50/100 years by type | Upper bound validation |
| Agenzia Coesione Territoriale, Rapporto Tempi 2018 | Average OO.PP. completion: 4.4 years | Construction duration validation |
| Banca d'Italia, QEF 538/2019 | Econometric analysis of OO.PP. completion times | Construction duration validation |
| EC Guide to CBA 2014, § 2.8.3 | Social discount rate: 3% for high-income EU | Discount rate default |

---

## 4. Record structure — field-by-field reference

```typescript
interface InterventionCategory {
  // ── IDENTITY ──
  code: string;                       // "C001"–"C285" or "CM01"–"CM08". Stable, never renumber.
  label: string;                      // MOP Title Case label. Editable.

  // ── MOP CLASSIFICATION (configurable links) ──
  subsector_code: string;             // FK → ProjectSubsector.code. Determines tipologie, OPEX, geo coefficients.
  sector_code: string;                // FK → ProjectSector.code. Auto-derived from subsector.
  cluster_id: string;                 // FK → MCA cluster ("C01"–"C13" or "NONE"). Determines adaptive questions D5/D6.

  // ── LAYER 2 LINKS ──
  kpi_links: CategoryKpiLink[];       // KPIs with externality flag, benefit override, and activation conditions.
  cp_links: CategoryCpLink[];         // CPs with denormalized CF code.

  // ── CONTEXT QUESTIONS ──
  context_question_ids: string[];     // FK[] → ContextQuestion.id. Analyst configuration.

  // ── INTERVENTION TYPOLOGIES ──
  tipologie_links: CategoryTipologiaLink[];  // 12 typologies with applicable flag and benefit override.

  // ── TERRITORIAL CLASSIFICATION ──
  fabbisogno_codes: string[];         // FK[] → Fabbisogno.code. 1–4 per category.

  // ── BENEFICIARY TARGETS ──
  target_codes: string[];             // FK[] → Target.code. Recommended targets for wizard.

  // ── ECONOMIC SECTORS ──
  nace_links: CategoryNaceLink[];     // NACE sectors with % allocation (Σ = 100%).

  // ── CBA PARAMETERS ──
  discount_rate: DiscountRate;        // { pct_med, pct_min, pct_max }
  construction_durations: ConstructionDuration[];  // months per applicable typology
  useful_life: UsefulLifeByType[];    // years per applicable typology
  opex: OpexRange;                    // { pct_min, pct_med, pct_max } — annual % of CAPEX
}
```

### Sub-interfaces

```typescript
interface CategoryKpiLink {
  kpi_id: string;                        // FK → KpiBenefit.id
  is_negative_externality: boolean;      // UI flag: avoided damage vs direct benefit
  benefit_pct_override: number | null;   // Category-level override (0.0–1.0). Null = use typology default.
  activation_question_ids: string[];     // FK[] → DC-###. Empty = always active. AND logic.
}

interface CategoryCpLink {
  cp_id: string;                         // FK → CostParam.id (e.g. "CP-001")
  cf_code: string;                       // FK → CostFactor.code (e.g. "CF-001"). 1:1 with cp_id.
}

interface CategoryTipologiaLink {
  tipologia_code: InterventionType;      // FK → InterventionType code
  applicable: boolean;                   // Pre-populated from tipologie_fc.ts
  benefit_pct_override: number | null;   // Category-typology override. Null = use default.
}

interface CategoryNaceLink {
  nace_code: string;                     // FK → NaceSector.code
  pct_sector: number;                    // Expenditure allocation (0.0–1.0). Σ = 1.0.
}

interface DiscountRate {
  pct_med: number;   // Central rate (default: 0.03)
  pct_min: number;   // Lower bound for sensitivity (default: 0.01)
  pct_max: number;   // Upper bound for sensitivity (default: 0.05)
}

interface ConstructionDuration {
  tipologia_code: InterventionType;
  duration_months: number;               // Rounded to multiples of 3
}

interface UsefulLifeByType {
  tipologia_code: InterventionType;
  years: number;                         // Rounded to multiples of 5
}

interface OpexRange {
  pct_min: number;   // Minimum annual OPEX as % of CAPEX
  pct_med: number;   // Median
  pct_max: number;   // Maximum
}
```

---

## 5. The link system — how categories reference Layer 1 and Layer 2

### KPI links

Every KPI link connects a category to a benefit formula in Layer 2. The link carries three pieces of analyst configuration:

**`is_negative_externality`** — Determines UI presentation only. When `true`, the KPI is displayed as "avoided damage" (red→green icon) rather than "direct benefit" (green icon). The monetary value is positive in both cases — the distinction is semantic, not computational.

**`benefit_pct_override`** — Overrides the benefit percentage at the category level. The benefit percentage determines what fraction of the computed benefit is attributed to the intervention. Priority chain: project-level override > category-level override > typology default (`tipologie_intervento.ts → benefit_pct_default`).

**`activation_question_ids`** — Links the KPI to context questions. If empty, the KPI is always active for this category. If populated, the KPI activates only when ALL linked context questions produce `is_activating = true` from the officer's answers (AND logic). The linked DC-### must be in the category's `context_question_ids` — the system validates this.

### CP links

Each CP link connects a category to a cost parameter formula in Layer 2 and its associated cost factor in Layer 1. The relationship chain is:

```
InterventionCategory → cp_links[].cp_id → CostParam (Layer 2) → formula → variables → Layer 1
InterventionCategory → cp_links[].cf_code → CostFactor (Layer 1) → val_min/med/max
```

CP-NNN and CF-NNN have a confirmed 1:1 mapping. The `cf_code` is denormalized on the link for direct access to the unit cost without passing through Layer 2.

### Fabbisogni (reverse lookup)

Categories don't "select" fabbisogni — fabbisogni select categories. In `fabbisogni_v2.ts`, each fabbisogno has a `category_codes[]` array listing the MOP categories that can respond to that need. The Layer 3 table reverses this lookup: `fabbisogno_codes[]` on the category contains all fabbisogni that include this category.

The relationship is N:M: one category can serve 1–4 fabbisogni (e.g. C108 Scuole appears in FAB-02 seismic safety, FAB-15 education capacity, FAB-53 school quality, FAB-54 accessibility). One fabbisogno can suggest 2–21 categories.

### Derived data (not stored, resolved at runtime)

The following data is NOT on the IC record but is derivable from fabbisogni:
- **Temi Civiqa** → `fabbisogni_v2.ts → tema_code`
- **Missioni DUP** → `fabbisogni_v2.ts → mission_codes`
- **Obiettivi UE (RSO)** → `fabbisogni_v2.ts → rso_codes`
- **Fondi** → `fabbisogni_v2.ts → funds`
- **Funzione SOSE** → `fabbisogni_v2.ts → sose_function`

This avoids duplication and ensures consistency — changing a fabbisogno's theme automatically updates all associated categories.

---

## 6. Classification MOP — Settore, Sotto Settore, Cluster

The MOP classification determines the position of the category in the official Italian public works taxonomy:

```
Settore (S01–S10)
  └─ Sotto Settore (SS01–SS44)
       └─ Categoria (C001–C285)
```

**Subsector drives cost coefficients.** Changing a category's `subsector_code` automatically changes:
- Which typologies are applicable (`tipologie_fc.ts`)
- Which geographic correction coefficients apply (`territorialita_fc.ts`)
- The OPEX range (derived from `manutenzione_ordinaria` coefficients)

**Cluster drives evaluation questions.** The `cluster_id` determines which adaptive questions (D5, D6) appear in the MCA evaluation matrix. Categories with `cluster_id = "NONE"` (19 categories, mainly training and services) are evaluated with the 4 fixed questions only.

For existing categories, subsector and cluster are inherited from `mop_albero_v2.ts` and should not be changed without strong justification. For new categories created by the analyst, both must be explicitly selected.

---

## 7. CBA parameters — discount rate, useful life, construction, OPEX

### Discount rate

Default: 3% social discount rate for Italy (EC Guide CBA 2014, § 2.8.3). Range 1%–5% for sensitivity analysis. The analyst can override per category for sectors with specific EC guidance (e.g. transport projects may use 5%).

### Useful life

Base useful life per subsector, adjusted by typology multiplier:

| Typology | Multiplier | Rationale |
|---|---|---|
| Nuova realizzazione | ×1.00 | Full design life of new asset |
| Ristrutturazione + EE | ×0.70 | Major renovation extends life significantly |
| Ristrutturazione | ×0.65 | Significant but less than EE variant |
| Restauro | ×0.80 | Heritage conservation, specialised techniques |
| Ampliamento/potenziamento | ×0.75 | Expansion adds capacity with good remaining life |
| Recupero | ×0.60 | Recovery of degraded asset |
| Manutenzione straordinaria EE | ×0.40 | Targeted upgrade, shorter cycle |
| Ammodernamento tecnologico | ×0.35 | Technology cycle, rapid obsolescence |
| Altro | ×0.50 | Conservative default |
| Lavori socialmente utili | ×0.25 | Limited output, short effective life |

Values rounded to multiples of 5 years (minimum 5). Source: EC Guide to CBA 2014 Table 2.1, corrected against sector-specific reference periods.

### Construction duration

Same subsector × typology logic as useful life, with multipliers:

| Typology | Multiplier | Rationale |
|---|---|---|
| Nuova realizzazione | ×1.00 | Full construction phase |
| Restauro | ×0.90 | Slow, specialised techniques |
| Ristrutturazione + EE | ×0.75 | Significant works on existing structure |
| Ristrutturazione | ×0.70 | Shorter than new build |
| Recupero | ×0.65 | Moderate intervention |
| Ampliamento/potenziamento | ×0.60 | Partial construction |
| Altro | ×0.50 | Conservative default |
| Manutenzione straordinaria EE | ×0.40 | Targeted intervention |
| Ammodernamento tecnologico | ×0.35 | Equipment replacement |
| Lavori socialmente utili | ×0.30 | Light works |
| Demolizione | ×0.25 | Rapid phase |

Values rounded to multiples of 3 months (minimum 3). Source: Agenzia Coesione Territoriale, Rapporto Tempi OO.PP. 2018; Banca d'Italia QEF 538/2019.

### OPEX

Annual operating costs as % of CAPEX, derived from `tipologie_fc.ts → manutenzione_ordinaria` coefficients per subsector. 6 distinct profiles ranging from 2%/3.5%/5% (standard buildings, roads) to 5%/8.5%/12% (R&D, telecom, high-maintenance).

---

## 8. Zero Scenario Categories — the counterfactual

`zero_scenario_categories_layer3.ts` contains 63 records (one per fabbisogno) representing the "do nothing" option.

```typescript
interface ZeroScenarioCategory {
  code: string;              // "SZ-01"–"SZ-63"
  label: string;             // "Scenario zero — [fabbisogno label]"
  description: string;       // Counterfactual description
  fabbisogno_code: string;   // FK → Fabbisogno.code (1:1)
  kpi_links: CategoryKpiLink[];  // KPIs measuring do-nothing costs
  cluster_id: string;        // From fabbisogno.cluster_mca
  discount_rate: DiscountRate;
}
```

The zero scenario is simpler than the intervention category: it has KPIs (measuring ongoing damage from inaction) but no CPs, typologies, targets, NACE, construction duration, useful life, or OPEX. The DOCFAP wizard always includes the zero scenario (A0) as the first alternative in the ranking.

**Current status**: 63 records pre-populated with code, label, fabbisogno link, cluster, and discount rate. KPI links are empty — must be configured by the analyst with KPIs that quantify the cost of inaction.

---

## 9. Decisions made and why

**[D1] Subsector and cluster as configurable links.** For existing categories, these are inherited from `mop_albero_v2.ts`. For new categories, the analyst selects them. Subsector determines cost coefficients (cascade effect on tipologie_fc and territorialita_fc).

**[D2] Derived data not stored on category.** Temi, Missioni DUP, RSO codes, funds, and SOSE functions are derived from fabbisogni at runtime. This avoids duplication and desynchronisation.

**[D3] Benefit percentage three-level override.** Priority: project > category > typology default. This allows progressive refinement from the global default (typology-level) to the specific (project-level).

**[D4] Useful life and construction duration per typology.** A school built new lasts 40 years; the same school renovated lasts 25 years. This per-typology granularity is essential for accurate CBA.

**[D5] NACE allocation sums to 100%.** Hard constraint. Every euro of investment must be allocated to an economic sector for the Input-Output analysis.

**[D6] Context questions AND logic.** When multiple questions are linked to a KPI, ALL must produce `is_activating = true`. This is the stricter interpretation — it reduces false positives.

**[D7] EC reference periods for useful life, not NTC structural life.** NTC 2018 defines structural design life (50 years for ordinary buildings). The CBA uses economic useful life (EC Guide: 15–30 years by sector), which is systematically shorter. This is intentional: the CBA horizon captures the period of maximum economic benefit, not the physical lifespan of the structure.

---

## 10. Known limitations and pending work

1. **Context questions not configured.** 0/285 categories have DC assignments. This is the next analyst task — defines which KPIs are conditionally activated.

2. **KPI activation conditions empty.** All 907 KPI links have `activation_question_ids: []` (always active). Once context questions are configured, the analyst must link specific DCs to specific KPIs.

3. **73 categories without KPIs.** Mainly new categories (C191+) and training/services. These categories cannot produce a CBA until KPIs are assigned.

4. **60 categories without CPs.** Mainly training, R&D, and services. The officer must enter costs manually for these categories.

5. **`is_negative_externality` all false.** Analyst must review and set to `true` for KPIs measuring avoided damages (e.g. flood damage avoided, accident reduction, pollution avoided).

6. **`benefit_pct_override` all null.** Analyst may set category-specific overrides where the typology default is inappropriate.

7. **Zero scenario KPIs empty.** All 63 zero scenarios have no KPI links — analyst must configure the do-nothing cost KPIs.

---

## 11. How to create or modify a category

### Creating a new category

1. **Step 1 — Identity and MOP classification**: Assign code (auto-generated C286+), label, subsector (dropdown — cascades to tipologie and OPEX), cluster (dropdown).
2. **Step 2 — Primary links**: Select fabbisogni, KPIs (with flag/override/DC config), CPs.
3. **Step 3 — Classification**: Select targets, NACE sectors with %, context questions.
4. **Step 4 — CBA parameters**: Set discount rate, construction durations, useful life, OPEX.

### Modifying an existing category

Each section is independently editable through the backoffice detail view. Changes to subsector trigger automatic recalculation of tipologie applicability and OPEX range.

### Adding a KPI to a category

1. Select the KPI from the catalogue (search by code, label, or benefit category).
2. Set `is_negative_externality` (default: false).
3. Optionally set `benefit_pct_override` (leave null for typology default).
4. Optionally link to context questions (must be in category's `context_question_ids`).

### Validation rules

| Rule | Scope | Type |
|---|---|---|
| `code` must be unique | Global | Hard |
| `subsector_code` must exist in mop_albero | Record | Hard |
| `cluster_id` must be valid ("C01"–"C13" or "NONE") | Record | Hard |
| Σ `nace_links[].pct_sector` = 1.0 (±0.001) | Record | Hard |
| `activation_question_ids` must be subset of `context_question_ids` | KPI link | Hard |
| At least 1 fabbisogno linked | Record | Warning |
| At least 1 KPI linked | Record | Warning |
| At least 1 target assigned | Record | Warning |
| `useful_life` ≥ `construction_duration` (same typology) | Record | Warning |

---

## 12. Companion files

| File | Content |
|---|---|
| `schema_layer3.ts` | TypeScript interfaces for IC and ZeroScenario |
| `zero_scenario_categories_layer3.ts` | 63 zero scenario records |
| `us_layer3_categories.md` | 12 User Stories for backoffice CRUD |
| `Layer3_Fonti_Istituzionali_Validazione.md` | Source validation for useful life and construction |
| `Layer3_Mapping_Category_Target.xlsx` | Analyst review: 285 categories with target assignments |
| `Layer3_Mapping_Category_NACE.xlsx` | Analyst review: 285 categories with NACE allocations |
| `Layer3_Mapping_Category_VitaUtile.xlsx` | Analyst review: 285 categories with useful life per typology |
| `Layer3_Mapping_Category_Cantiere.xlsx` | Analyst review: 285 categories with construction duration per typology |

---

## 13. Current table status

| Metric | Value |
|---|---|
| **Total categories** | 285 |
| Categories with KPI | 212 (907 links) |
| Categories with CP | 225 (276 links) |
| Categories with fabbisogni | 285 (396 links) |
| Categories with targets | 285 (27 overrides) |
| Categories with NACE | 285 (16 overrides, Σ=100%) |
| Categories with useful life | 285 (14 overrides, corrected against EC Guide) |
| Categories with construction duration | 285 (13 overrides) |
| Categories with OPEX | 285 (6 profiles from tipologie_fc) |
| Categories with discount rate | 285 (default EC 3%) |
| Categories with context questions | 0 (⏳ analyst) |
| Zero scenario categories | 63 (KPIs ⏳) |

### Pre-population completeness by field

| Field | System | Analyst | Status |
|---|---|---|---|
| Identity (code, label, SS, S, cluster) | ✅ | — | Complete |
| KPI links | ✅ (212 cats) | Configuration needed | Partial |
| CP links | ✅ (225 cats) | — | Partial |
| Context questions | — | ⏳ Full configuration | Empty |
| Tipologie | ✅ | Override optional | Complete |
| Fabbisogni | ✅ | — | Complete |
| Targets | ✅ | Validation | Complete |
| NACE | ✅ | Validation | Complete |
| Discount rate | ✅ (default) | Override optional | Complete |
| Construction duration | ✅ | Validation | Complete |
| Useful life | ✅ | Validation | Complete |
| OPEX | ✅ | Override optional | Complete |

---

## 14. FAQ

**Q: Why are useful life values lower than NTC 2018 structural life (50 years)?**
A: The CBA uses economic useful life (EC Guide reference periods), not structural design life. A school building may stand for 50 years (NTC), but its economic benefit horizon for CBA purposes is 25–40 years (EC). This is standard CBA methodology.

**Q: Why do some categories have no KPIs or CPs?**
A: 73 categories without KPIs are mainly new MOP categories (C191+) and training/services not yet covered by the analyst benefit formulas. 60 categories without CPs are non-physical interventions (training, services) where parametric costing doesn't apply — the officer enters costs manually.

**Q: Can I add more than 4 NACE sectors to a category?**
A: The current pre-population uses 4 per category. The schema supports any number as long as Σ = 100%. If the analyst needs 5+ sectors for specific categories, the UI supports it.

**Q: What happens if I change a category's subsector?**
A: The system recalculates: (1) applicable typologies from tipologie_fc, (2) OPEX range from manutenzione_ordinaria coefficients, (3) geographic correction coefficients from territorialita_fc. Construction duration and useful life are NOT automatically recalculated — the analyst must review them.

**Q: Where do Temi Civiqa and Missioni DUP appear?**
A: They are NOT on the IC record. They are derived at runtime from the fabbisogni: `getCategoryThemes(code) → union of fabbisogni[].tema_code`. This avoids data duplication.

**Q: How does the benefit percentage work across three levels?**
A: Priority: (1) project-level override (officer in wizard), (2) `CategoryKpiLink.benefit_pct_override` on this table, (3) `CategoryTipologiaLink.benefit_pct_override` on this table, (4) `tipologie_intervento.ts → benefit_pct_default`. The first non-null value wins.

---

*OpenCore Layer 3 · Intervention Categories · Civiqa · May 2026*
