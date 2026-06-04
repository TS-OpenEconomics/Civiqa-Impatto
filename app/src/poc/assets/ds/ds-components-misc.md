# Design System — Componenti: Footer, Search Bar, Checkbox, Filtri, Tab
**Figma file:** `ULFrjRJzopTyLKczdJLJkn`

> **Dipendenze:** `ds-tokens.css`, `ds-typography.css`

---

## 1. Footer

**Figma frame:** `3476:369`  
Due varianti: desktop (1190px wide) e mobile (360px wide). Altezza fissa: **100px**.

### Struttura

```
[footer]
├── "(Nome App) è una piattaforma di" + logo OpenEconomics
└── "© 2025 Copyright OpenEconomics | Vat 12504821005"
```

### Regole CSS

```css
.footer {
  height: 100px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);              /* 8px */
  padding: 10px;
  background-color: var(--color-background-secondary-lighter); /* #f1f1f1 */
  border-top: 1px solid var(--color-border-secondary);         /* #545454 */
  overflow: hidden;
  box-sizing: border-box;
}

.footer__text {
  font-family: var(--font-family-body);
  font-size: 12px;                     /* Caption XXS */
  font-weight: var(--type-weight-regular);
  line-height: 130%;
  color: var(--color-text-primary);    /* #000000 */
  white-space: nowrap;
}

/* Contenitore logo OpenEconomics */
.footer__logo {
  height: 20px;
  width: 158px;
  overflow: hidden;
  flex-shrink: 0;
}
```

### Figma IDs

| Variante | Figma ID |
|---|---|
| desktop | `3462:713` |
| mobile | `3476:367` |

---

## 2. Search Bar

**Figma frame:** `3239:7667`  
3 size × 4 stati + Dropdown Search Bar.

### Size

| Size | Altezza | Figma ID default |
|---|---|---|
| S | 32px | `3239:7666` |
| M | 40px | `3239:7668` |
| L | 48px | `3239:7676` |

### Stati e Figma IDs

| Stato | S | M | L |
|---|---|---|---|
| default | `3239:7666` | `3239:7668` | `3239:7676` |
| filled | `3239:7764` | `3239:7766` | `3239:7768` |
| focus | `3239:7836` | `3239:7838` | `3239:7840` |
| disabled | `3239:7884` | `3239:7886` | `3239:7888` |

### Regole CSS

```css
.search-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background-color: var(--color-background-inverse);          /* #ffffff */
  border: var(--border-base) solid var(--color-border-secondary); /* 1px #545454 */
  border-radius: var(--radius-smooth);                         /* 2px */
  padding: 0 var(--spacing-inset-s);                           /* 0 16px */
  overflow: hidden;
  box-sizing: border-box;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

/* Size S */
.search-bar--s { height: 32px; }
/* Size M */
.search-bar--m { height: 40px; }
/* Size L */
.search-bar--l { height: 48px; }

/* Placeholder / testo */
.search-bar__input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-family-body);
  font-size: var(--type-body-s-size);       /* 16px */
  font-weight: var(--type-weight-regular);
  color: var(--color-text-primary-lighter); /* #6e6e6e placeholder */
}
.search-bar__input:not(:placeholder-shown) {
  color: var(--color-text-primary);         /* #000000 filled */
}

/* Icona search (right) — 24×24px */
.search-bar__icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: var(--color-icon-primary);
}

/* Focus */
.search-bar:focus-within {
  box-shadow: 0 0 0 3px var(--color-border-focus); /* #0000ff */
}

/* Disabled */
.search-bar--disabled {
  background-color: var(--color-background-disable); /* #e7e7e7 */
  border-color: var(--color-border-disabled);         /* #999999 */
  pointer-events: none;
}
.search-bar--disabled .search-bar__input,
.search-bar--disabled .search-bar__icon {
  color: var(--color-text-disable);                   /* #999999 */
}
```

### Dropdown Search Bar

**Figma frame:** `6114:1173`  
Larghezza 600px. 2 varianti: `full=yes` (400px altezza) e `full=no` (240px).

| Variante | Figma ID |
|---|---|
| full=yes | `6114:1172` |
| full=no | `6114:1174` |

```css
.dropdown-search {
  width: 100%;
  background-color: var(--color-background-inverse);
  border: 1px solid var(--color-border-secondary-light);
  border-radius: var(--radius-smooth);
  box-shadow: 0 4px 8px rgba(0,0,0,0.12);
  overflow: hidden;
}
.dropdown-search--full { max-height: 400px; overflow-y: auto; }
.dropdown-search--compact { max-height: 240px; overflow-y: auto; }
```

---

## 3. Checkbox

**Figma node:** `546:3437`  
3 sottocomponenti: box-only, with-label, with-text.

### 3a. Checkbox Box Only — Figma `545:3385`

Dimensione: **24×24px**. Box interno: **20×20px**, `border-radius: 4px`.

```css
.checkbox {
  position: relative;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;     /* outer wrapper */
  cursor: pointer;
}

.checkbox__box {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid var(--color-border-secondary);   /* #545454 */
  background-color: var(--color-background-inverse); /* #ffffff */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: background-color 0.1s ease, border-color 0.1s ease;
}

/* Checked */
.checkbox--checked .checkbox__box {
  background-color: var(--color-border-primary);    /* #4400b3 */
  border-color: var(--color-border-primary);
}
.checkbox__checkmark {
  width: 13px;
  height: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Intermediate */
.checkbox--intermediate .checkbox__box {
  background-color: var(--color-border-primary);
  border-color: var(--color-border-primary);
}
/* (usa icona minus al posto del check) */

/* Hover */
.checkbox:hover .checkbox__box {
  border-color: var(--color-border-secondary-hover); /* #2c2c2c */
}

/* Focus */
.checkbox:focus-visible .checkbox__box {
  box-shadow: 0 0 0 3px var(--color-border-focus);  /* #0000ff */
}

/* Disabled */
.checkbox--disabled {
  pointer-events: none;
}
.checkbox--disabled .checkbox__box {
  background-color: var(--color-background-disable); /* #e7e7e7 */
  border-color: var(--color-border-disabled);        /* #999999 */
}
.checkbox--disabled.checkbox--checked .checkbox__box {
  background-color: var(--color-border-disabled);
  border-color: var(--color-border-disabled);
}
```

### Figma IDs — Box Only

| Stato | Figma ID |
|---|---|
| default | `3061:2303` |
| hover | `3061:2305` |
| focused | `3061:2307` |
| checked | `3061:2332` |
| intermediate | `3061:2333` |
| disabled | `3061:2344` |
| disabled checked | `3061:2349` |
| disabled intermediate | `3061:2354` |

### 3b. Checkbox With Label — Figma `3061:2368`

```html
<label class="checkbox-label">
  <div class="checkbox [stato]">
    <div class="checkbox__box">
      <!-- checkmark opzionale -->
    </div>
  </div>
  <span class="checkbox-label__text">Label</span>
</label>
```

```css
.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-inline-xs);     /* 8px */
  cursor: pointer;
}
.checkbox-label__text {
  font-family: var(--font-family-body);
  font-size: var(--type-body-s-size);      /* 16px */
  font-weight: var(--type-weight-regular);
  color: var(--color-text-primary);        /* #000000 */
}
.checkbox--disabled ~ .checkbox-label__text {
  color: var(--color-text-disable);        /* #999999 */
}
```

| Stato | Figma ID |
|---|---|
| default | `3061:2367` |
| hover | `3061:2369` |
| focused | `3061:2380` |
| checked | `3061:2391` |
| intermediate | `3061:2402` |
| disabled | `3061:2413` |
| disabled checked | `3061:2424` |
| disabled intermediate | `3061:2435` |

### 3c. Checkbox With Text — Figma `3061:2466`

Come with-label ma con body text descrittivo sotto il label. Larghezza: 560px.

| Stato | Figma ID |
|---|---|
| default | `3061:2464` |
| hover | `3061:2559` |
| focused | `3061:2572` |
| checked | `3061:2585` |
| checked intermediate | `3061:2598` |
| disabled | `3061:2611` |
| disabled checked | `3061:2628` |
| disabled intermediate | `3061:2641` |

---

## 4. Filtri

**Figma node:** `5982:705`  
Due livelli: filtri semplici e filtri avanzati (per contesto applicativo).

### 4a. Filtri Semplici

#### filter-icon — Figma `3667:2092`
Bottone "Filtra per:" con icona Filter. Altezza: **40px**.

```css
.filter-icon {
  display: flex;
  align-items: center;
  gap: var(--spacing-inline-xs);    /* 8px */
}
.filter-icon__label {
  font-family: var(--font-family-body);
  font-size: var(--type-body-s-size);
  font-weight: var(--type-weight-regular);
  color: var(--color-text-primary);
  white-space: nowrap;
}
.filter-icon__btn {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--spacing-inset-xs);  /* 8px */
  background-color: var(--color-background-secondary-lighter); /* #f1f1f1 */
  border: 1px solid var(--color-border-secondary-light);       /* #e7e7e7 */
  border-radius: var(--radius-smooth);
  cursor: pointer;
  gap: var(--spacing-inline-xs);
}
.filter-icon__btn:hover { background-color: var(--color-background-secondary-light); }
.filter-icon__btn--disabled { pointer-events: none; color: var(--color-text-disable); }
```

| Stato | Figma ID |
|---|---|
| default | `3667:2093` |
| hover | `3667:2095` |
| disable | `3667:2097` |

#### filter-number — Figma `3667:2099`
Filtro con contatore numerico. Altezza: **40px**, larghezza: 148px.

| Stato | Figma ID |
|---|---|
| default | `3667:2100` |
| hover | `3667:2102` |

#### filter-text — Figma `3667:2104`
Filtro testuale con dropdown. Default 40px, hover espanso 330px.

| Stato | Figma ID |
|---|---|
| default | `3667:2105` |
| hover (aperto) | `3667:2107` |
| disable | `3696:3669` |

#### dropdown-filtri — Figma `3692:1600`
Dropdown con lista opzioni. Dimensioni: 210×288px.

### 4b. Filtri Avanzati

Pannelli avanzati per contestualizzazione. Larghezza: **420px** per pannello, altezza: **1024px**.

| Componente | Frame ID | Varianti |
|---|---|---|
| advanced-filter-lista-progetti | `9074:7881` | Default `9074:7882`, Selected `9074:9478` |
| advanced-filter-province-comuni | `5990:931` | Default `5990:948`, Dropdown `7308:2707`, Selected `9075:4263` |
| advanced-filter-settore | `9074:10377` | Default `6186:5518`, Dropdown `6186:5733`, Selected `6186:5734` |
| advanced-filter-cashflow | `6186:6331` | Default `6186:6330`, Selected `6186:6388` |
| advanced-filter-esternalità | `6186:6660` | Default `6186:6658`, Selected `6186:6659` |
| advanced-filter-territori | `7306:2191` | Default `7306:2192`, Dropdown territorio `7306:2207`, Regione `7306:2226`, Provincia `7306:2242`, Comune `7306:2259` |
| advanced-filter-enti | `7306:2046` | (unico pannello) |

```css
.advanced-filter-panel {
  width: 420px;
  height: 1024px;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background-inverse);
  border: 1px solid var(--color-border-secondary-light);
  border-radius: var(--radius-smooth);
  overflow: hidden;
}
```

---

## 5. Tab

**Figma node:** `3305:669`  
Due componenti distinti: **Tab** (con sfondo) e **Switcher** (underline).

### 5a. Tab — _TAB-item

Figma frame: `7369:3797`  
Altezza: **48px**. Padding: `0 16px`. `border-radius: 4px 4px 0 0` (top-left, top-right).

```css
/* Contenitore tablist */
.tab-list {
  display: flex;
  align-items: flex-end;
  gap: 0;
  border-bottom: none;
}

/* Singolo tab item */
.tab-item {
  height: 48px;
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-inset-s);   /* 16px */
  border-radius: 4px 4px 0 0;
  cursor: pointer;
  font-family: var(--font-family-body);
  font-size: var(--type-body-m-size);  /* 18px */
  font-weight: var(--type-weight-bold); /* 700 */
  line-height: var(--type-body-m-lh);
  white-space: nowrap;
  transition: background-color 0.15s ease, color 0.15s ease;
}

/* Selected */
.tab-item--selected {
  background-color: var(--color-background-primary); /* #4400b3 */
  color: var(--color-text-inverse);                  /* #ffffff */
  box-shadow: 0 4px 8px rgba(0,0,0,0.25);
}

/* Unselected */
.tab-item--unselected {
  background-color: var(--color-background-inverse); /* #ffffff */
  color: var(--color-text-primary);                  /* #000000 */
}

/* Hover */
.tab-item--unselected:hover {
  background-color: var(--color-background-primary-lighter); /* #efe5ff */
}

/* Disabled */
.tab-item--disabled {
  pointer-events: none;
  color: var(--color-text-disable);
  background-color: var(--color-background-inverse);
}
```

| Stato | Figma ID |
|---|---|
| selected | `7369:3796` |
| unselected | `7369:3804` |
| hover | `7369:3806` |
| disable | `7369:3808` |

### 5b. Switcher — _switcher-item

Figma frame: `3663:1754`  
Stile underline, senza sfondo. Altezza: **39px**. Usato per navigation secondaria interna a sezioni.

```css
/* Contenitore switcher */
.switcher {
  display: flex;
  align-items: center;
  gap: 0;
  border-bottom: 2px solid var(--color-border-secondary-light);
}

/* Singolo switcher item */
.switcher__item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 39px;
  padding: 8px 0;
  cursor: pointer;
  font-family: var(--font-family-body);
  font-size: var(--type-body-m-size);   /* 18px */
  font-weight: var(--type-weight-bold); /* 700 */
  white-space: nowrap;
  border-bottom: 4px solid transparent;
  margin-bottom: -2px;                  /* overlap il border del container */
  transition: color 0.15s ease, border-color 0.15s ease;
}

/* Selected */
.switcher__item--selected {
  color: var(--color-text-secondary-light);       /* #6e1aff */
  border-bottom-color: var(--color-border-primary-light); /* #6e1aff */
}

/* Unselected */
.switcher__item--unselected {
  color: var(--color-text-primary);               /* #000000 */
  border-bottom-color: transparent;
}

/* Hover */
.switcher__item--unselected:hover {
  color: var(--color-text-secondary-light);
}

/* Disabled */
.switcher__item--disabled {
  pointer-events: none;
  color: var(--color-text-disable);               /* #999999 */
}
```

| Stato | Figma ID |
|---|---|
| selected | `3663:1755` |
| unselected | `3663:1757` |
| hover | `4514:4482` |
| disable | `7373:3789` |

### Accessibilità Tab (da Figma)

```html
<!-- Struttura HTML corretta -->
<div role="tablist">
  <button role="tab" aria-selected="true"  id="tab-1" aria-controls="panel-1">Label</button>
  <button role="tab" aria-selected="false" id="tab-2" aria-controls="panel-2">Label</button>
</div>
<div role="tabpanel" id="panel-1" aria-labelledby="tab-1">...</div>
```

**Tastiera:**
- `Tab / Shift+Tab` → navigazione standard tra elementi pagina
- `← →` → spostamento tra tab adiacenti
- `Enter / Space` → attiva tab e mostra pannello
