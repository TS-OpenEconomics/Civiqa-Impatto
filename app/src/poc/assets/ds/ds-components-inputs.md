# Design System — Componenti: Input Fields
**Figma file:** `ULFrjRJzopTyLKczdJLJkn`

> **Dipendenze:** `ds-tokens.css`, `ds-typography.css`  
> Per il codice esatto di un componente: `Figma:get_design_context(fileKey: "ULFrjRJzopTyLKczdJLJkn", nodeId: "<ID>")`

---

## Struttura anatomica — comune a tutti gli input

```html
<div class="input-field">
  <label class="input-field__label">Label</label>
  <span class="input-field__description">Description text</span>  <!-- opzionale -->
  <div class="input-field__wrapper">
    <input class="input-field__input" type="text" placeholder="Text-field" />
    <div class="input-field__icon"><!-- icona 32×32px, opzionale --></div>
  </div>
  <span class="input-field__helper">*Helper text</span>
</div>
```

---

## Regole CSS base — Input Field

```css
.input-field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-stack-xs);   /* 8px tra label, description, wrapper, helper */
  width: 100%;
}

/* Label */
.input-field__label {
  font-family: var(--font-family-body);
  font-size: var(--type-body-s-size);      /* 16px */
  font-weight: var(--type-weight-bold);    /* 700 */
  line-height: var(--type-body-s-lh);      /* 130% */
  color: var(--color-text-primary);        /* #000000 */
}

/* Description (sotto il label) */
.input-field__description {
  font-family: var(--font-family-body);
  font-size: var(--type-body-xs-size);     /* 14px */
  font-weight: var(--type-weight-regular); /* 400 */
  line-height: var(--type-body-xs-lh);
  color: var(--color-text-primary-light);  /* #545454 */
}

/* Wrapper (il campo visivo) */
.input-field__wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 11px var(--spacing-inset-xs);   /* 11px top/bottom, 8px left/right */
  background-color: var(--color-background-inverse);  /* #ffffff */
  border: var(--border-base) solid var(--color-border-secondary);  /* 1px #545454 */
  border-radius: var(--radius-smooth);     /* 2px */
  overflow: hidden;
  gap: var(--spacing-inline-xs);           /* 8px */
  box-sizing: border-box;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

/* Input element */
.input-field__input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-family-body);
  font-size: var(--type-body-s-size);       /* 16px */
  font-weight: var(--type-weight-regular);  /* 400 */
  color: var(--color-text-primary-lighter); /* #6e6e6e — placeholder */
}
.input-field__input:not(:placeholder-shown) {
  color: var(--color-text-primary);         /* #000000 — filled */
}

/* Icon slot */
.input-field__icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-icon-primary-lighter);
}

/* Helper text */
.input-field__helper {
  font-family: var(--font-family-body);
  font-size: var(--type-body-xs-size);      /* 14px */
  font-weight: var(--type-weight-regular);
  line-height: var(--type-body-xs-lh);
  color: var(--color-text-primary-light);   /* #545454 */
}


/* ---- STATI ---- */

/* Hover */
.input-field:hover .input-field__wrapper {
  border-color: var(--color-border-secondary-hover);   /* #2c2c2c */
}
.input-field:hover .input-field__label {
  color: var(--color-text-primary-hover);
}

/* Focus */
.input-field__wrapper:focus-within {
  border-color: var(--color-border-secondary);
  box-shadow: 0 0 0 3px var(--color-border-focus);    /* #0000ff */
}

/* Disabled */
.input-field--disabled .input-field__wrapper {
  background-color: var(--color-background-disable);  /* #e7e7e7 */
  border-color: var(--color-border-disabled);         /* #999999 */
  pointer-events: none;
}
.input-field--disabled .input-field__label,
.input-field--disabled .input-field__helper,
.input-field--disabled .input-field__input {
  color: var(--color-text-disable);                   /* #999999 */
}
.input-field--disabled .input-field__icon {
  color: var(--color-icon-disable);
}
```

---

## 1. Input Text Field — Standard — Figma `575:1382`

| Stato | Figma ID | Border | Background | Placeholder | Focus ring | Label | Helper |
|---|---|---|---|---|---|---|---|
| default  | `575:1381` | `1px solid #545454` | `#ffffff` | `#6e6e6e` | — | `#000000` | `#545454` |
| hover    | `575:1417` | `1px solid #2c2c2c` | `#ffffff` | `#6e6e6e` | — | `#2c2c2c` | `#545454` |
| focused  | `575:1451` | `1px solid #545454` | `#ffffff` | `#6e6e6e` | `0 0 0 3px #0000ff` | `#000000` | `#545454` |
| filled   | `575:1662` | `1px solid #545454` | `#ffffff` | `#000000` | — | `#000000` | `#545454` |
| disabled | `575:1485` | `1px solid #999999` | `#e7e7e7` | `#999999` | — | `#999999` | `#999999` |

---

## 2. Input Text Field — Number — Figma `575:1524`

Struttura identica a Standard. Differenza: `helper text` sempre visibile (non opzionale).

| Stato | Figma ID |
|---|---|
| default  | `575:1525` |
| hover    | `575:1529` |
| focused  | `575:1533` |
| filled   | `575:1696` |
| disabled | `575:1537` |

---

## 3. Input Text Field — Success — Figma `575:2192`

```css
.input-field--success .input-field__wrapper {
  border-color: var(--color-border-success);   /* #007840 */
}
.input-field--success .input-field__helper {
  color: var(--color-text-success);            /* #007840 */
}
.input-field--success .input-field__wrapper:focus-within {
  box-shadow: 0 0 0 3px var(--color-border-focus);
}
```

| Stato | Figma ID |
|---|---|
| default  | `575:2193` |
| filled   | `3273:29781` |
| hover    | `575:2197` |
| focused  | `575:2201` |
| disabled | `575:2205` |

---

## 4. Input Text Field — Warning — Figma `575:2633`

```css
.input-field--warning .input-field__wrapper {
  border-color: var(--color-border-warning);   /* #ca8600 */
}
.input-field--warning:hover .input-field__wrapper {
  border-color: var(--color-border-warning-hover);  /* #996500 */
}
.input-field--warning .input-field__helper {
  color: var(--color-text-warning);            /* #ca8600 */
}
.input-field--warning .input-field__wrapper:focus-within {
  box-shadow: 0 0 0 3px var(--color-border-focus);
}
```

| Stato | Figma ID |
|---|---|
| default  | `575:2634` |
| filled   | `3273:29793` |
| hover    | `575:2638` |
| focused  | `575:2642` |
| disabled | `575:2646` |

---

## 5. Input Text Field — Error — Figma `575:2774`

```css
.input-field--error .input-field__wrapper {
  border-color: var(--color-border-error);     /* #cc0000 */
}
.input-field--error:hover .input-field__wrapper {
  border-color: var(--color-border-error-hover);  /* #990000 */
}
.input-field--error .input-field__helper {
  color: var(--color-text-error);              /* #cc0000 */
}
.input-field--error .input-field__wrapper:focus-within {
  box-shadow: 0 0 0 3px var(--color-border-focus);
}
```

| Stato | Figma ID |
|---|---|
| default  | `575:2775` |
| filled   | `3273:29805` |
| hover    | `575:2779` |
| focused  | `575:2783` |
| disabled | `575:2787` |

---

## 6. Input Text Area — Figma `575:516`

### HTML

```html
<div class="input-field input-textarea">
  <label class="input-field__label">Label</label>
  <div class="input-field__textarea-group">
    <span class="input-field__description">Description text</span>
    <div class="input-field__wrapper input-field__wrapper--textarea">
      <textarea class="input-field__input" rows="5" maxlength="500"></textarea>
    </div>
    <span class="input-field__counter">0/500</span>
  </div>
</div>
```

### CSS

```css
.input-field__wrapper--textarea {
  height: auto;
  min-height: 120px;
  padding: var(--spacing-inset-s);          /* 16px tutti i lati */
  align-items: flex-start;
  resize: vertical;                          /* handle bottom-right nativo */
  position: relative;
}

.input-field__input[type="textarea"],
textarea.input-field__input {
  width: 100%;
  min-height: 100%;
  resize: none;                              /* resize gestito dal wrapper */
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-family-body);
  font-size: var(--type-body-s-size);
  font-weight: var(--type-weight-regular);
  line-height: var(--type-body-s-lh);
  color: var(--color-text-primary-lighter);
}
textarea.input-field__input:not(:placeholder-shown) {
  color: var(--color-text-primary);
}

/* Contatore caratteri */
.input-field__counter {
  font-family: var(--font-family-mono);      /* Atkinson Mono */
  font-size: var(--type-number-xs-size);     /* 14px */
  font-weight: var(--type-number-xs-weight); /* 400 */
  line-height: var(--type-number-xs-lh);
  color: var(--color-text-primary-light);
  text-align: right;
  align-self: flex-end;
}
```

| Stato | Figma ID | Border |
|---|---|---|
| default  | `575:519`  | `1px solid #545454` |
| hover    | `575:523`  | `1px solid #2c2c2c` |
| focused  | `575:527`  | `1px solid #545454` + `box-shadow: 0 0 0 3px #0000ff` |
| filled   | `932:1146` | `1px solid #545454` |
| disabled | `575:531`  | `1px solid #999999`, bg `#e7e7e7` |

---

## 7. Riepilogo Figma IDs

| Componente | Figma ID frame |
|---|---|
| input-text-field-standard | `575:1382` |
| input-text-field-number   | `575:1524` |
| input-text-field-success  | `575:2192` |
| input-text-field-warning  | `575:2633` |
| input-text-field-error    | `575:2774` |
| input-text-area           | `575:516`  |
