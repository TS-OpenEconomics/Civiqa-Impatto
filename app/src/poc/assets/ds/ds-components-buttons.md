# Design System — Componenti: Button
**Figma file:** `ULFrjRJzopTyLKczdJLJkn`

> **Dipendenze:** `ds-tokens.css`, `ds-typography.css`  
> Per il codice esatto di un componente: `Figma:get_design_context(fileKey: "ULFrjRJzopTyLKczdJLJkn", nodeId: "<ID>")`

---

## Regole globali Button

```css
/* Base comune a tutti i button */
button, .btn {
  font-family: var(--font-family-body);
  font-size: var(--type-body-s-size);      /* 16px */
  font-weight: var(--type-weight-medium);  /* 500 */
  line-height: var(--type-body-s-lh);      /* 130% */
  border-radius: var(--radius-smooth);     /* 2px */
  border: var(--border-double) solid transparent; /* 2px */
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}

/* Focus ring — SEMPRE box-shadow, mai outline */
button:focus-visible, .btn:focus-visible {
  box-shadow: 0 0 0 3px var(--color-border-focus);
  outline: none;
}

/* Disabled */
button:disabled, .btn:disabled,
button[aria-disabled="true"], .btn[aria-disabled="true"] {
  pointer-events: none;
  background-color: var(--color-background-disable) !important;
  color: var(--color-text-disable) !important;
  border-color: transparent !important;
}
```

---

## 1. Button Size Scale

| Size token | Height | Padding H | Icon slot | Figma prop |
|---|---|---|---|---|
| `btn--xs`  | 24px | 16px | 24×24px | `size=XS` |
| `btn--s`   | 32px | 16px | 24×24px | `size=S`  |
| `btn--m`   | 40px | 16px | 24×24px | `size=M`  |
| `btn--l`   | 48px | 16px | 24×24px | `size=L`  |
| `btn--xl`  | 64px | 16px | 24×24px | `size=XL` |

```css
.btn--xs  { height: 24px; padding: 0 var(--spacing-inset-s); }
.btn--s   { height: 32px; padding: 0 var(--spacing-inset-s); }
.btn--m   { height: 40px; padding: 0 var(--spacing-inset-s); }
.btn--l   { height: 48px; padding: 0 var(--spacing-inset-s); }
.btn--xl  { height: 64px; padding: 0 var(--spacing-inset-s); }
```

---

## 2. Button Varianti — Text Button

### `button-primary` — Figma `3298:4149`

```css
.btn-primary {
  background-color: var(--color-background-primary);   /* #4400b3 */
  color: var(--color-text-inverse);                    /* #ffffff */
  border-color: transparent;
}
.btn-primary:hover  { background-color: var(--color-background-primary-hover);  }  /* #340088 */
.btn-primary:active { background-color: var(--color-background-primary-active); }  /* #270065 */
```

### `button-secondary` — Figma `3298:4200`

```css
.btn-secondary {
  background-color: var(--color-background-secondary);  /* #545454 */
  color: var(--color-text-inverse);                     /* #ffffff */
  border-color: transparent;
}
.btn-secondary:hover  { background-color: var(--color-background-secondary-hover);  }  /* #2c2c2c */
.btn-secondary:active { background-color: var(--color-background-secondary-active); }  /* #000000 */
```

### `button-tertiary` — Figma `3298:4251`
Bordo visibile, sfondo trasparente.

```css
.btn-tertiary {
  background-color: transparent;
  color: var(--color-text-secondary);             /* #4400b3 */
  border-color: var(--color-border-primary);      /* #4400b3 */
}
.btn-tertiary:hover  { color: var(--color-text-secondary-hover);  border-color: var(--color-border-primary-hover);  }
.btn-tertiary:active { color: var(--color-text-secondary-active); border-color: var(--color-border-primary-active); }
```

### `button-ghost` — Figma `3298:4506`
Nessun bordo, nessun sfondo.

```css
.btn-ghost {
  background-color: transparent;
  color: var(--color-text-secondary);   /* #4400b3 */
  border-color: transparent;
}
.btn-ghost:hover  { color: var(--color-text-secondary-hover);  }
.btn-ghost:active { color: var(--color-text-secondary-active); }
```

### `button-primary-error` — Figma `3298:4302`

```css
.btn-primary-error {
  background-color: var(--color-background-error);
  color: var(--color-text-inverse);
  border-color: transparent;
}
.btn-primary-error:hover  { background-color: var(--color-background-error-hover);  }
.btn-primary-error:active { background-color: var(--color-background-error-active); }
```

### `button-primary-success` — Figma `3298:4353`

```css
.btn-primary-success {
  background-color: var(--color-background-success);
  color: var(--color-text-inverse);
  border-color: transparent;
}
.btn-primary-success:hover  { background-color: var(--color-background-success-hover);  }
.btn-primary-success:active { background-color: var(--color-background-success-active); }
```

### `button-tertiary-error` — Figma `3298:4404`

```css
.btn-tertiary-error {
  background-color: transparent;
  color: var(--color-text-error);
  border-color: var(--color-border-error);
}
.btn-tertiary-error:hover  { border-color: var(--color-border-error-hover);  color: var(--color-text-error-hover);  }
.btn-tertiary-error:active { border-color: var(--color-border-error-active); color: var(--color-text-error-active); }
```

### `button-tertiary-success` — Figma `3298:4455`

```css
.btn-tertiary-success {
  background-color: transparent;
  color: var(--color-text-success);
  border-color: var(--color-border-success);
}
.btn-tertiary-success:hover  { border-color: var(--color-border-success-hover);  color: var(--color-text-success-hover);  }
.btn-tertiary-success:active { border-color: var(--color-border-success-active); color: var(--color-text-success-active); }
```

### `button-ghost-error` — Figma `5531:7012`

```css
.btn-ghost-error {
  background-color: transparent;
  color: var(--color-text-error);
  border-color: transparent;
}
.btn-ghost-error:hover  { color: var(--color-text-error-hover);  }
.btn-ghost-error:active { color: var(--color-text-error-active); }
```

### `button-ghost-success` — Figma `5531:7264`

```css
.btn-ghost-success {
  background-color: transparent;
  color: var(--color-text-success);
  border-color: transparent;
}
.btn-ghost-success:hover  { color: var(--color-text-success-hover);  }
.btn-ghost-success:active { color: var(--color-text-success-active); }
```

---

## 3. Icon Button

Stesse varianti dei text button, ma forma quadrata. Contiene solo un'icona centrata.

| Size | Dimensione |
|---|---|
| XS | 24×24px |
| S  | 32×32px |
| M  | 40×40px |
| L  | 48×48px |
| XL | 64×64px |

```css
.btn-icon {
  padding: 0;
  justify-content: center;
}
.btn-icon.btn--xs  { width: 24px;  height: 24px; }
.btn-icon.btn--s   { width: 32px;  height: 32px; }
.btn-icon.btn--m   { width: 40px;  height: 40px; }
.btn-icon.btn--l   { width: 48px;  height: 48px; }
.btn-icon.btn--xl  { width: 64px;  height: 64px; }
```

**Figma IDs Icon Button:**

| Variante | Figma ID |
|---|---|
| button-icon-primary | `3238:2224` |
| button-icon-secondary | `3303:2418` |
| button-icon-tertiary | `3303:2519` |
| button-icon-error | `3303:2652` |
| button-icon-success | `3303:2753` |
| button-icon-tertiary-error | `3303:2854` |
| button-icon-tertiary-success | `3303:2955` |
| button-icon-ghost | `3303:3056` |
| button-icon-ghost-error | `5731:19489` |
| button-icon-ghost-success | `5731:19590` |

---

## 4. Add New Item Button — Figma `4533:4207`

Full-width, altezza 80px. Usato per aggiungere elementi a liste/tabelle.

```css
.btn-add-new-item {
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: var(--border-double) dashed var(--color-border-secondary);
  border-radius: var(--radius-smooth);
  color: var(--color-text-secondary);
  font-family: var(--font-family-body);
  font-size: var(--type-body-s-size);
  font-weight: var(--type-weight-medium);
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}
.btn-add-new-item:hover {
  background-color: var(--color-background-secondary-lighter);
  border-color: var(--color-border-secondary-hover);
}
.btn-add-new-item:disabled {
  pointer-events: none;
  color: var(--color-text-disable);
  border-color: var(--color-border-disabled);
}
```

---

## 5. Riepilogo Figma IDs

| Componente | Figma ID |
|---|---|
| button-primary | `3298:4149` |
| button-secondary | `3298:4200` |
| button-tertiary | `3298:4251` |
| button-primary-error | `3298:4302` |
| button-primary-success | `3298:4353` |
| button-tertiary-error | `3298:4404` |
| button-tertiary-success | `3298:4455` |
| button-ghost | `3298:4506` |
| button-ghost-error | `5531:7012` |
| button-ghost-success | `5531:7264` |
| add-new-item-button | `4533:4207` |
