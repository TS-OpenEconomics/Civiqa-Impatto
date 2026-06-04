# Design System — Layout: App Shell (Desktop Expanded)
**Riferimento screenshot:** `Desktop_-_Voci_attuali_-_Expanded.jpg`  
**Prodotto:** Externalytics

> Questo è il layout base di tutta l'applicazione. Ogni pagina lo usa come contenitore.  
> I componenti citati sono documentati nei file `ds-components-navigation.md` e `ds-components-misc.md`.

---

## Struttura generale

```
┌─────────────────────────────────────────────────────────────┐
│  TOP NAV (fixed, 80px, full-width)                          │
│  ■ Externalytics  [  search bar  ]  help  notif  settings  profile │
├──────────────────┬──────────────────────────────────────────┤
│  ACCENT LINE     │                                          │
│  (4px lime)      │                                          │
├──────────────────┤                                          │
│                  │                                          │
│  SIDE NAV        │  MAIN CONTENT AREA                       │
│  expanded 250px  │  (bg: #e7e7e7, flex: 1)                  │
│                  │                                          │
│  [resize btn]    │                                          │
│  80px            │                                          │
└──────────────────┴──────────────────────────────────────────┘
```

---

## 1. Top Navigation Bar

**Altezza:** 80px  
**Sfondo:** `var(--color-background-inverse)` `#ffffff`  
**Border-bottom:** accent line (vedi sotto)  
**Componente:** `top-nav` → `logo=externalytics` (Figma `3243:14225`)

### Struttura interna (left → right)

```
[Logo Externalytics]   [Search Bar — size L, flex-grow]   [help] [notif] [settings] [avatar + nome + chevron]
```

**Logo:** testo "■ Externalytics" — il quadratino è un'icona brand `#000000`, testo Body L Bold  
**Search Bar:** size L (48px), placeholder "Cerca documenti, progetti, pianificazioni..."  
**Icone right:** `help-outline`, `notification` (con badge), `settings` — tutte 32×32px, `--color-icon-primary`  
**Avatar utente:** cerchio 32px, sfondo `--color-background-primary` `#4400b3`, iniziali bianche Bold XS + nome + chevron-down

```css
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 80px;
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-inset-s);      /* 0 16px */
  gap: var(--spacing-inline-s);           /* 16px */
  background-color: var(--color-background-inverse);
}

.top-nav__logo {
  flex-shrink: 0;
  font-family: var(--font-family-body);
  font-size: var(--type-body-l-size);     /* 24px */
  font-weight: var(--type-weight-bold);
  color: var(--color-text-primary);
  white-space: nowrap;
}

.top-nav__search {
  flex: 1;
  max-width: 600px;
  /* usa componente .search-bar--l */
}

.top-nav__actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-inline-xs);          /* 8px */
}

.top-nav__avatar {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-circle);    /* 80px → risulta cerchio */
  background-color: var(--color-background-primary);
  color: var(--color-text-inverse);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--type-body-xs-size);
  font-weight: var(--type-weight-bold);
  flex-shrink: 0;
}

.top-nav__username {
  font-family: var(--font-family-body);
  font-size: var(--type-body-s-size);     /* 16px */
  font-weight: var(--type-weight-regular);
  color: var(--color-text-primary);
  white-space: nowrap;
}
```

---

## 2. Accent Line

**Altezza:** 4px  
**Colore:** `var(--color-background-accent)` = `#b9ff69` (lime)  
**Posizione:** sotto la top nav, sopra il contenuto, full-width  

```css
.accent-line {
  height: 4px;
  width: 100%;
  background-color: var(--color-background-accent); /* #b9ff69 */
  flex-shrink: 0;
}
```

---

## 3. Side Navigation — Expanded

**Larghezza:** 250px  
**Sfondo:** `var(--color-background-inverse)` `#ffffff`  
**Border-right:** `2px solid var(--color-border-secondary-light)` `#e7e7e7`  
**Componente:** `side-nav--expanded` (Figma `3246:18909`)

### Voce attiva (Dashboard nell'esempio)

La voce selezionata ha:
- **Background:** `var(--color-background-primary-lighter)` `#efe5ff`
- **Border-left:** `4px solid var(--color-background-primary)` `#4400b3`
- **Testo:** `var(--color-text-secondary)` `#4400b3`
- **Icona:** `var(--color-icon-secondary)` `#4400b3`

```css
.side-nav__voice--active {
  background-color: var(--color-background-primary-lighter); /* #efe5ff */
  border-left: 4px solid var(--color-background-primary);    /* #4400b3 */
  color: var(--color-text-secondary);
}
.side-nav__voice--active .side-nav__voice-label {
  color: var(--color-text-secondary);   /* #4400b3 */
  font-weight: var(--type-weight-medium); /* 500 — leggermente più bold */
}
```

### Sezione "VALUTAZIONI"

Label uppercase grigio `#6e6e6e`, Caption XS, con `border-top: 2px solid #e7e7e7` sopra.

```css
.side-nav__section-label {
  padding: 16px 16px 4px;
  font-size: var(--type-body-xs-size);      /* 14px */
  font-weight: var(--type-weight-regular);
  color: var(--color-text-primary-lighter); /* #6e6e6e */
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
```

### Resize button

In fondo alla sidebar, allineato a destra, icona `collapse` (freccia sinistra).

---

## 4. Main Content Area

**Sfondo:** `var(--color-background-secondary-light)` `#e7e7e7`  
**Flex:** 1 (occupa tutto lo spazio rimanente)  
**Overflow:** auto (scroll verticale del contenuto)

```css
.main-content {
  flex: 1;
  background-color: var(--color-background-secondary-light); /* #e7e7e7 */
  overflow-y: auto;
  min-width: 0;
}
```

---

## 5. CSS completo — App Shell

```css
/* Reset base */
* { box-sizing: border-box; margin: 0; padding: 0; }

/* Root layout */
.app-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  font-family: var(--font-family-body);
}

/* Top nav fisso */
.app-shell__topnav {
  flex-shrink: 0;
  height: 80px;
  z-index: 100;
  /* vedi .top-nav sopra */
}

/* Accent line */
.app-shell__accent {
  flex-shrink: 0;
  height: 4px;
  background-color: var(--color-background-accent); /* #b9ff69 */
}

/* Corpo sotto la nav */
.app-shell__body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* Sidebar */
.app-shell__sidebar {
  flex-shrink: 0;
  width: 250px;             /* expanded */
  /* width: 100px;          collapsed */
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  transition: width 0.2s ease;
  /* vedi .side-nav in ds-components-navigation.md */
}

.app-shell__sidebar--collapsed {
  width: 100px;
}

/* Area contenuto principale */
.app-shell__main {
  flex: 1;
  background-color: var(--color-background-secondary-light); /* #e7e7e7 */
  overflow-y: auto;
  min-width: 0;
}
```

---

## 6. HTML boilerplate

```html
<div class="app-shell">

  <!-- Top Navigation -->
  <header class="app-shell__topnav top-nav">
    <div class="top-nav__logo">■ Externalytics</div>
    <div class="top-nav__search">
      <div class="search-bar search-bar--l">
        <input class="search-bar__input" placeholder="Cerca documenti, progetti, pianificazioni..." />
        <div class="search-bar__icon"><!-- icona search-stroke 24px --></div>
      </div>
    </div>
    <div class="top-nav__actions">
      <div class="icon"><!-- help-outline 32px --></div>
      <div class="icon"><!-- notification 32px --></div>
      <div class="icon"><!-- settings 32px --></div>
      <div class="top-nav__avatar">MR</div>
      <span class="top-nav__username">Mario Rossi</span>
      <div class="icon"><!-- chevron-down-small 24px --></div>
    </div>
  </header>

  <!-- Accent Line -->
  <div class="app-shell__accent"></div>

  <!-- Body -->
  <div class="app-shell__body">

    <!-- Sidebar -->
    <nav class="app-shell__sidebar side-nav side-nav--expanded">
      <!-- voce attiva -->
      <div class="side-nav__voice side-nav__voice--active">
        <div class="icon"><!-- dashboard 40px --></div>
        <span class="side-nav__voice-label">Dashboard</span>
      </div>
      <!-- voce normale -->
      <div class="side-nav__voice">
        <div class="icon"><!-- Explore 40px --></div>
        <span class="side-nav__voice-label">Osservatorio</span>
      </div>
      <!-- separatore + label sezione -->
      <div class="side-nav__section-divider"></div>
      <div class="side-nav__section-label">VALUTAZIONI</div>
      <div class="side-nav__voice">
        <div class="icon"><!-- chart-combo 40px --></div>
        <span class="side-nav__voice-label">Valutazione</span>
      </div>
      <!-- resize button -->
      <button class="side-nav__resize-btn">
        <div class="icon"><!-- collapse 48px --></div>
      </button>
    </nav>

    <!-- Main Content -->
    <main class="app-shell__main">
      <!-- contenuto pagina -->
    </main>

  </div>
</div>
```

---

## 7. Note per Claude Code

1. **La top nav è `position: fixed`** — il body sotto deve avere `padding-top: 84px` (80px nav + 4px accent line), oppure usare il layout flex column con `height: 100vh` e `overflow: hidden` come mostrato sopra.
2. **La sidebar NON scrolla la top nav** — solo `.app-shell__main` fa scroll.
3. **Voce attiva nella sidebar:** border-left 4px `#4400b3` + bg `#efe5ff` + testo/icona in viola `#4400b3`.
4. **Accent line lime** (`#b9ff69`) è un elemento identitario fisso — non rimuoverla, non cambiarla di colore.
5. **Collapsed sidebar:** cambia solo la larghezza da 250px a 100px — le voci mostrano solo l'icona (48px centrata), niente label. Gestire con una classe `.app-shell__sidebar--collapsed`.
6. **Sfondo content area:** `#e7e7e7` (`--color-background-secondary-light`), non bianco.
7. **Breakpoint mobile:** sotto 768px la sidebar scompare e si usa la `mobile-top-nav` (vedi `ds-components-navigation.md`).
