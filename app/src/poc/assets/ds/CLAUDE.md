# Design System — Regole per Claude Code

Questo file è il punto d'ingresso per Claude Code. Contiene le istruzioni operative generali e i riferimenti agli altri documenti del design system.

**Figma file key:** `ULFrjRJzopTyLKczdJLJkn`

---

## File del Design System

| File | Contenuto |
|---|---|
| `ds-tokens.css` | Tutti i CSS custom properties (colori, spacing, radius, border) |
| `ds-typography.css` | Tipografia: font families, scale headings e body |
| `ds-components-buttons.md` | Regole e varianti dei componenti Button e Icon Button |
| `ds-components-inputs.md` | Regole e varianti dei componenti Input Field e Textarea |
| `ds-components-icons.md` | Catalogo completo icone: 8 categorie, 200+ icone, regole di utilizzo |
| `ds-components-navigation.md` | Side nav desktop, top nav, mobile nav, menù contestuale |
| `ds-components-misc.md` | Footer, Search Bar, Checkbox, Filtri, Tab e Switcher |
| `ds-layout-app-shell.md` | **Layout principale dell'app** — top nav, accent line, sidebar, content area |

---

## Regole generali — SEMPRE rispettare

1. **Mai usare colori o valori di spacing hardcoded.** Usare sempre i CSS custom properties da `ds-tokens.css`.
2. **Font principale:** `Atkinson Hyperlegible Next` per tutti i testi UI. `Atkinson Mono` per numeri/dati tabulari.
3. **Border-radius:** sempre `var(--radius-smooth)` = `2px` per tutti i componenti. Eccezione: `var(--radius-rounded)` = `40px` per pill/badge, `var(--radius-circle)` = `80px` per avatar/dot.
4. **Focus ring:** sempre `box-shadow: 0 0 0 3px var(--color-border-focus)`. NON usare `outline`.
5. **Stati disabled:** `pointer-events: none` + tutti i colori → token `disable` (`#999999` testo/icone, `#e7e7e7` bg).
6. **Dark mode:** il sistema ha un set di token dark mode. Usare `[data-theme="dark"]` o `prefers-color-scheme: dark` per applicarli.
7. **Naming convention token:** camelCase in JS/TS (es. `colorBackgroundPrimary`), kebab-case in CSS (es. `--color-background-primary`).

---

## Come recuperare un componente da Figma

Se hai bisogno del codice esatto di un componente specifico, chiama:
```
Figma:get_design_context(fileKey: "ULFrjRJzopTyLKczdJLJkn", nodeId: "<ID>")
```
Gli ID dei nodi sono documentati nei file `ds-components-*.md`.
