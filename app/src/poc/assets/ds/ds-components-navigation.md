# Design System — Componenti: Navigation
**Figma file:** `ULFrjRJzopTyLKczdJLJkn`  
**Node di riferimento:** `3330:7628`

> **Dipendenze:** `ds-tokens.css`, `ds-typography.css`

---

## 1. Side Navigation — Desktop

**Figma frame:** `3246:18908`  
Due varianti di larghezza: **collapsed** (100px) e **expanded** (250px).

### Struttura

```
[side-nav]
├── [menu] — flex-col, flex: 1, scroll verticale
│   ├── [desktop-side-nav-voice] × N  — ogni voce 70px (collapsed) / 60px (expanded)
│   │   ├── icona 48px (collapsed) | icona 40px + label (expanded)
│   │   └── separatore border-top tra sezioni logiche
│   └── [sezione-label] — solo in expanded, Caption XS #6e6e6e uppercase
└── [desktop-side-nav-resize-button] — 80px fisso in fondo
```

### Regole CSS

```css
.side-nav {
  background-color: var(--color-background-inverse);    /* #ffffff */
  border-right: 2px solid var(--color-border-secondary-light); /* #e7e7e7 */
  display: flex;
  flex-direction: column;
  height: 100vh;                                         /* altezza piena */
  overflow: hidden;
  transition: width 0.2s ease;
}

/* Collapsed */
.side-nav--collapsed { width: 100px; align-items: center; }

/* Expanded */
.side-nav--expanded  { width: 250px; align-items: flex-start; }

/* Voce menu — collapsed */
.side-nav__voice {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70px;
  width: 100%;
  padding: 0 4px;
  cursor: pointer;
}
.side-nav__voice:hover { background-color: var(--color-background-secondary-lighter); }

/* Voce menu — expanded */
.side-nav--expanded .side-nav__voice {
  flex-direction: row;
  align-items: center;
  height: 60px;
  padding: 0 var(--spacing-inset-s);   /* 16px */
  gap: 4px;
}

/* Icona in collapsed */
.side-nav__voice .icon { width: 48px; height: 48px; }

/* Icona in expanded */
.side-nav--expanded .side-nav__voice .icon { width: 40px; height: 40px; }

/* Label voce (solo expanded) */
.side-nav__voice-label {
  font-family: var(--font-family-body);
  font-size: var(--type-body-s-size);       /* 16px */
  font-weight: var(--type-weight-regular);  /* 400 */
  line-height: var(--type-body-s-lh);
  color: var(--color-text-primary);         /* #000000 */
  white-space: nowrap;
}

/* Separatore sezione */
.side-nav__section-divider {
  border-top: 2px solid var(--color-border-secondary-light);
}

/* Label sezione (solo expanded) */
.side-nav__section-label {
  font-family: var(--font-family-body);
  font-size: var(--type-body-xs-size);      /* 14px */
  font-weight: var(--type-weight-regular);
  color: var(--color-text-primary-lighter); /* #6e6e6e */
  padding: 16px 16px 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Bottone resize (fondo) */
.side-nav__resize-btn {
  height: 80px;
  width: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  flex-shrink: 0;
}
.side-nav--collapsed .side-nav__resize-btn { justify-content: center; }
.side-nav--expanded  .side-nav__resize-btn { justify-content: flex-end; padding: 0 var(--spacing-inset-s); }
```

### Figma IDs

| Variante | Figma ID |
|---|---|
| side-nav collapsed | `3246:18869` |
| side-nav expanded | `3246:18909` |
| resize button (collapsed) | `3251:22196` |
| resize button (expanded) | `3251:22176` |

### Voci menu disponibili (props)

`showDashboard` · `showDataRoom` · `showPmo` · `showValutazioneProgettuale` · `showComposing` · `showPianificazione` · `showDocfap` · `showDocumentiCollaborativi` · `showScoutingBandi` · `showCandidature`

---

## 2. Top Navigation — Desktop

**Figma frame:** `6070:6316`  
3 varianti per prodotto (logo diverso).

| Variante | Figma ID |
|---|---|
| logo=externalytics | `3243:14225` |
| logo=civiqa | `6070:6317` |
| logo=sonar | `8410:2725` |

### Regole CSS

```css
.top-nav {
  height: 80px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-inset-s);
  background-color: var(--color-background-inverse);
  border-bottom: 1px solid var(--color-border-secondary-light);
}
```

---

## 3. Mobile Top Navigation

**Figma frame:** `3543:776` (Externalytics), `6070:6355` (Civiqa)  
3 stati: `closed` · `open` · `submenu`. Larghezza: 360px.

| Variante | ID closed | ID open | ID submenu |
|---|---|---|---|
| Externalytics | `3543:775` | `3543:777` | `4574:12951` |
| Civiqa | `6070:6356` | `6070:6358` | `6070:6360` |

### Regole CSS

```css
.mobile-top-nav {
  width: 360px;
  background-color: var(--color-background-inverse);
  border-bottom: 1px solid var(--color-border-secondary-light);
}

/* Closed: barra singola 70px */
.mobile-top-nav--closed { height: 70px; }

/* Open / Submenu: menu espanso 640px */
.mobile-top-nav--open,
.mobile-top-nav--submenu { height: 640px; }
```

---

## 4. Profile Dropdown — Top Navigation

**Figma frame:** `6067:16032`  
Dropdown profilo utente, ancorato a top-right nella top nav.

```css
.dropdown-azioni {
  width: 209px;
  background-color: var(--color-background-inverse);
  border: 1px solid var(--color-border-secondary-light);
  border-radius: var(--radius-smooth);
  box-shadow: 0 4px 8px rgba(0,0,0,0.12);
}
```

---

## 5. Menù Contestuale

**Figma frame:** `4381:5068`  
Menu contestuale per azioni inline (es. tabelle, card).

| Variante | Figma ID | Dimensioni |
|---|---|---|
| desktop default | `4270:727` | 169×44px |
| desktop hover | `9333:9363` | 169×44px |
| desktop focus | `9333:9369` | 169×44px |
| desktop disable | `9333:9377` | 169×44px |
| mobile default | `4381:5067` | 56×44px |
| mobile disable | `9333:9381` | 56×44px |

```css
.menu-contestuale__item {
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-inset-s);
  font-family: var(--font-family-body);
  font-size: var(--type-body-s-size);
  font-weight: var(--type-weight-regular);
  color: var(--color-text-primary);
  cursor: pointer;
  white-space: nowrap;
}
.menu-contestuale__item:hover  { background-color: var(--color-background-secondary-lighter); }
.menu-contestuale__item:focus  { box-shadow: 0 0 0 3px var(--color-border-focus); outline: none; }
.menu-contestuale__item--disabled {
  color: var(--color-text-disable);
  pointer-events: none;
}
```

---

## 6. Azione Chiusura Modale Fullscreen

**Figma frame:** `6067:16076`

| Variante | Figma ID | Larghezza |
|---|---|---|
| desktop | `6067:16077` | 1440px, h 64px |
| mobile | `6067:16079` | 360px, h 64px |

```css
.modal-close-bar {
  height: 64px;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-inset-s);
  background-color: var(--color-background-inverse);
  border-bottom: 1px solid var(--color-border-secondary-light);
}
```
