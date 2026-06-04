# Design System — Componenti: Icons
**Figma file:** `ULFrjRJzopTyLKczdJLJkn`  
**Pagina:** `✅ Icons` — Node `39:7122`

> **Dipendenze:** `ds-tokens.css`  
> Per il codice esatto di un'icona: `Figma:get_design_context(fileKey: "ULFrjRJzopTyLKczdJLJkn", nodeId: "<ID>")`

---

## Regole generali

### Sizes supportate
Le icone sono progettate su griglia **48×48px** (default). Le size utilizzabili nei componenti UI sono:

| Size (px) | Utilizzo | Note |
|---|---|---|
| **16px** | ❌ Non usare | Troppo piccolo, illeggibile |
| **24px** | ✅ Inline, badge, chip | Dimensione minima raccomandata |
| **32px** | ✅ Controlli (input icon slot) | Slot icona nei campi form |
| **48px** | ✅ Default, bottoni, card | Dimensione nativa del DS |
| **64px** | ✅ Prominenza alta | Header, sezioni |
| **>64px** | ❌ Non usare | Usare Hero Icons (80px) |

### Colorazione
Le icone ereditano il colore tramite token CSS — mai colori hardcoded.

```css
/* Colori icona standard */
.icon { color: var(--color-icon-primary);         }  /* #000000 */
.icon--secondary { color: var(--color-icon-secondary); }  /* #4400b3 */
.icon--inverse   { color: var(--color-icon-inverse);   }  /* #ffffff */
.icon--disable   { color: var(--color-icon-disable);   }  /* #999999 */
.icon--error     { color: var(--color-icon-error);     }  /* #cc0000 */
.icon--success   { color: var(--color-icon-success);   }  /* #007840 */
.icon--warning   { color: var(--color-icon-warning);   }  /* #ca8600 */
```

### Struttura HTML base

```html
<!-- Icona standalone 48px -->
<div class="icon" style="width:48px; height:48px; overflow:hidden; position:relative;">
  <img src="[URL_ASSET]" alt="[nome icona]" style="width:100%; height:100%;" />
</div>

<!-- Icona con style background (Commercial Icons) -->
<div class="icon icon--bg-primary" style="width:48px; height:48px; background-color: var(--color-icon-secondary); overflow:hidden; position:relative; border-radius: var(--radius-smooth);">
  <img src="[URL_ASSET]" alt="[nome icona]" style="width:54.16%; height:54.16%; position:absolute; top:50%; left:22.92%; transform:translateY(-50%);" />
</div>
```

---

## 1. Miscellaneous Icons — Figma `3156:11955`
Icone generali per uso applicativo. Size nativa: **48×48px**.

### UI & Tools
| Nome | Figma ID | Note |
|---|---|---|
| Tools | `3156:9396` | |
| Link | `3156:9389` | |
| Colors | `3156:9403` | |
| Palette | `3156:9410` | |
| Graphic | `3156:9417` | |
| Analytics | `3156:9432` | |
| Placeholder | `3156:9915` | Icona generica di default |
| Add-squared-fill | `3156:9450` | |
| Minus-squared-fill | `4313:6185` | |
| Eye-open | `3156:9457` | Mostra/nascondi |
| Eye-closed | `3156:9957` | |
| Expand-2 | `3156:9971` | |
| Expand-1 | `3156:10027` | |
| Windows | `3156:10013` | |
| AI | `3156:10020` | |
| Check | `3156:9515` | Selezione, conferma |
| Filter | `3156:9543` | |
| Frame | `3156:9936` | |
| Collapse | `3156:9943` | |
| Calendar | `3156:9950` | |
| reload | `3156:9964` | |

### Azioni su file & oggetti (fill/stroke pairs)
| Nome | ID Fill | ID Stroke |
|---|---|---|
| Save | `3156:9701` | `3156:9695` |
| Trash | `3156:9714` | `3156:9708` |
| Sound | `3156:9740` | `3156:9734` |
| Star | `3156:9843` | `3156:9837` |
| Location | `3156:9775` | `3156:9769` |
| Location-error | `5083:5112` | — |
| Verified | `3156:9791` | `3156:9784` |
| User | `3156:9856` | `3156:9850` |
| Search | — | `3239:7095` |

### Social & Analytics
| Nome | Figma ID |
|---|---|
| Explore | `3328:1745` |
| Composing | `3328:2239` |
| Intrusion-prevention | `3328:1758` |
| IBM-cloud--resiliency | `3328:2199` |
| chart-combo | `3328:2238` |
| compare | `3328:2237` |
| binoculars | `3328:2235` |
| coins | `3344:1465` |
| dashboard | `3344:1554` |
| candidature | `3344:1556` |

### Navigation app
| Nome | ID Fill | ID Stroke |
|---|---|---|
| Home | `3551:21582` | `3558:1131` |
| Settings | `9692:46071` | `3344:1557` |
| Notification | `3684:2196` | `3684:2195` |
| Notification--off | `3684:2197` | `3684:2198` |
| Notification--new | `3684:2199` | — |
| Notifications-paused | `3684:2200` | — |
| Bookmark | `3684:2699` | `3684:2701` |
| Bookmark-add | `3684:2700` | — |

### Azioni utente
| Nome | Figma ID |
|---|---|
| close | `3749:545` |
| expand | `3411:1417` |
| collapse | `3411:1424` |
| edit | `3684:2697` |
| edit-off | `3684:2698` |
| share | `3684:2861` |
| user-add | `3684:2870` |
| recap | `3744:559` |
| assign | `3757:1003` |
| Personal-data | `3469:325` |
| Alarm | `3453:826` |
| notification | `3684:2195` |

### Finance & Business
| Nome | Figma ID |
|---|---|
| Sales-ops | `3932:7339` |
| Family | `3938:7342` |
| Analytics-euro | `3938:7343` |
| Financial-assets | `3938:7344` |
| Piggy-bank | `3938:7345` |
| Growth | `4059:319` |
| Recycle | `4233:1657` |
| Recommend | `4059:320` |
| Insert automatically | `4090:780` |
| Category | `4201:1920` |
| Coin | `4239:1462` |
| PIL | `4972:4690` |

### Categorie ESG / Tematiche
| Nome | Figma ID |
|---|---|
| Ambiente e sostenibilità | `4233:1640` |
| Transazione Energetica | `4233:1641` |
| Mobilità | `4233:1643` |
| Inclusione | `4233:1642` |
| Education | `4233:1644` |
| Salute | `4233:1645` |
| Governance | `4233:1646` |
| Hr | `4233:1647` |
| Parità | `4233:1648` |
| Innovazione | `4233:1649` |

### Ranking / Status numerici
| Nome | Figma ID |
|---|---|
| Up | `6389:702` |
| Down | `6389:710` |
| Warning | `6389:717` |
| Neutral | `6389:728` |
| Unequal | `6399:691` |
| Equal | `6399:692` |
| Approximation | `6399:693` |
| First place | `7587:21311` |
| Second place | `7586:21292` |
| Third place | `7587:21299` |

### Settori geografici / Governance
| Nome | Figma ID |
|---|---|
| Cultura e turismo | `7214:16197` |
| Economia e lavoro | `7214:16199` |
| Governance e welfare totale | `7214:16201` |
| Popolazione e demografia | `7214:16203` |
| Ente | `8150:5693` |

### Misc
| Nome | Figma ID |
|---|---|
| Pending | `4355:5744` |
| Profile | `4563:4572` |
| Log out | `4563:4581` |
| Admin console | `4569:6609` |
| Mouse | `4866:3200` |
| Stamp | `5046:4981` |
| Email | `8965:21120` |
| Replace | `9831:20664` |
| Aggregazione | `9920:3104` |
| Confronto | `9920:3103` |
| Storia | `9920:3105` |
| Firma | `10383:4763` |

---

## 2. Status Icons — Figma `3413:3109`
Icone semantiche per feedback, alert, e stati sistema. Size nativa: **48×48px**.

> Usare sempre la versione semanticamente corretta — fill per stati prominenti, outline per stati secondari.

| Nome | Figma ID | Colore token | Utilizzo |
|---|---|---|---|
| warning-fill | `3413:2744` | `--color-icon-warning` `#ca8600` | Alert warning prominente |
| warning-outline | `3413:2745` | `--color-icon-warning` | Alert warning secondario |
| error-fill | `3413:2746` | `--color-icon-error` `#cc0000` | Errore prominente |
| error-outline | `3413:2747` | `--color-icon-error` | Errore secondario |
| success-fill | `3413:2748` | `--color-icon-success` `#007840` | Successo prominente |
| success-outline | `3413:2749` | `--color-icon-success` | Successo secondario |
| information-fill | `3413:2750` | `--color-icon-secondary` `#4400b3` | Info prominente |
| information-outline | `3413:2751` | `--color-icon-secondary` | Info secondaria |
| help-fill | `3413:2752` | `--color-icon-primary` | Aiuto prominente |
| help-outline | `3413:2753` | `--color-icon-primary` | Aiuto secondario |
| pending-fill | `3413:2754` | `--color-icon-primary` | In attesa prominente |
| pending-outline | `3413:2755` | `--color-icon-primary` | In attesa secondario |
| alert-outline | `4901:785` | `--color-icon-warning` | Alert generico |
| alert-fill | `4901:801` | `--color-icon-warning` | Alert generico prominente |
| success-mail | `8965:22443` | `--color-icon-success` | Email inviata con successo |

---

## 3. Navigation Icons — Figma `3413:3492`
Icone per navigazione, paginazione e controlli direzionali. Size nativa: **48×48px**.

### Frecce direzionali
| Nome | Figma ID |
|---|---|
| arrow-small-left | `3156:9867` |
| arrow-small-right | `3156:9880` |
| arrow-down | `3413:3983` |
| arrow-up | `3413:3984` |
| arrow-left | `3413:3985` |
| arrow-right | `3413:3986` |
| arrow-down-right | `3413:3987` |
| arrow-down-left | `3413:3988` |
| arrow-up-left | `3413:3989` |
| arrow-up-right | `3413:3994` |

### Chevron
| Nome | Figma ID |
|---|---|
| chevron-left-small | `3260:24693` |
| chevron-right-small | `3260:24694` |
| chevron-up-small | `3260:24695` |
| chevron-down-small | `3260:24696` |
| chevron-left | `3636:2289` |
| chevron-right | `3636:2290` |
| Chevron--down | `4273:1628` |
| Chevron--up | `4273:1744` |

### Paginazione
| Nome | Figma ID |
|---|---|
| page-first | `3636:2291` |
| page-last | `3636:2292` |
| CaretDoubleUp | `4602:2195` |
| CaretDoubleDown | `4602:2194` |
| Caret--sort | `4060:713` |

### Menu & controlli UI
| Nome | Figma ID |
|---|---|
| menu | `3413:3990` |
| switcher | `3413:3991` |
| overflow-menu-vertical | `3413:3908` |
| overflow-menu-horizontal | `3413:3909` |
| close-small | `3512:755` |
| close-large | `3512:747` |
| subtract | `3518:1802` |
| subtract-large | `3518:1803` |
| add | `3518:1804` |
| add-large | `3518:1805` |
| Turn back | `9548:23033` |

---

## 4. Documents & Folders Icons — Figma `3419:4676`
Icone per file, documenti e operazioni su cartelle. Size nativa: **48×48px**.

| Nome | ID Fill | ID Outline |
|---|---|---|
| file | `3156:9762` | `3156:9753` |
| PDF | `3156:9804` | `3156:9798` |
| XLS | `3156:9817` | `3156:9811` |
| DOC | `3156:9584` | `3156:9578` |
| JPG | `3156:9830` | `3156:9824` |
| upload | `3156:9632` | `3156:9609` |
| download | `3156:9684` | `3156:9661` |
| folder | `3156:9727` | `3156:9721` |
| folder-share | — | `3328:2236` |
| duplicate | `3684:823` | — |
| Folder-error | `9874:4953` | — |
| Folder-add | `10108:492` | — |
| DOCFAP | `6084:3081` | — |
| Bandi | `10354:8840` | — |

---

## 5. Commercial Website Icons — Figma `3058:4568`
Icone con **3 varianti di stile** (primary, accent, plane). Size nativa: **48×48px**.

> Queste icone hanno un background colorato e sono pensate per la landing/sito commerciale.

### Varianti di stile

| Style | Background | Icona |
|---|---|---|
| `primary` | `var(--color-background-primary)` `#4400b3` | `var(--color-icon-inverse)` `#ffffff` |
| `accent` | `var(--color-background-accent)` `#b9ff69` | `var(--color-icon-primary)` `#000000` |
| `plane` | `transparent` | `var(--color-icon-primary)` `#000000` |

### Icone disponibili

| Nome | ID style=primary | ID style=accent | ID style=plane |
|---|---|---|---|
| search | `3058:4469` | `3058:4471` | `3058:4473` |
| stack | `3058:4476` | `3058:4478` | `3058:4480` |
| user | `3058:4483` | `3058:4485` | `3058:4487` |
| web | `3058:4490` | `3058:4492` | `3058:4494` |
| arrow | `3058:4497` | `3058:4499` | `3058:4501` |
| lock | `3058:4504` | `3058:4506` | `3058:4508` |
| compass | `3058:4511` | `3058:4513` | `3058:4515` |
| mail | `3058:4518` | `3058:4520` | `3058:4522` |
| copy | `3058:4525` | `3058:4527` | `3058:4529` |
| paper | `3058:4532` | `3058:4534` | `3058:4536` |
| home | `3058:4539` | `3058:4541` | `3058:4543` |

---

## 6. Hero Icons — Figma `4161:785`
Icone grandi per uso in sezioni hero, onboarding, empty state. Size nativa: **80×80px**.

| Nome | Figma ID |
|---|---|
| Default | `4227:1481` |
| ECBA | `4161:871` |
| ESG | `4419:5656` |
| EIA | `4161:872` |
| Piggy-bank | `4199:2583` |
| coins | `4585:6835` |
| chart-combo | `4199:2601` |
| Sales-ops | `4199:2602` |
| Family | `4199:2603` |
| Analytics-euro | `4199:2604` |
| Categorie e indicatori | `6326:3227` |
| Enti | `6326:3240` |
| Watchlist | `6326:3246` |
| Compare | `5024:10268` |
| Credit | `4251:1474` |

---

## 7. SDG Icons — Figma `6259:12794`
Icone degli Obiettivi di Sviluppo Sostenibile (SDG/OSS ONU). Size nativa: **80×80px**.

> Icone a colori fissi — non sovrascrivere il colore con i token del DS.

| Nome | Figma ID |
|---|---|
| Placeholder | `7421:41952` |
| 1 No Poverty | `6259:626` |
| 2 Zero hunger | `6259:581` |
| 3 Good health and well-being | `6259:605` |
| 4 Quality Education | `6259:608` |
| 5 Gender Equality | `6259:611` |
| 6 Clean Water and Sanitation | `6259:614` |
| 7 Affordable and clean energy | `6259:617` |
| 8 Decent work and economic growth | `6259:620` |
| 9 Industry and innovation | `6259:623` |
| 10 Reduced Inequalities | `6259:629` |
| 11 Sustainable Cities and Communities | `6259:584` |
| 12 Responsible consumption and production | `6259:587` |
| 13 Climate action | `6259:590` |
| 14 Life below water | `6259:593` |
| 15 Life on Land | `6259:596` |
| 16 Peace and liberty | `6259:599` |
| 17 Partnerships for the goals | `6259:602` |

---

## 8. Commons Icons — Figma `7421:41831`
Icone di regioni italiane. Size nativa: **80×80px**.

| Nome | Figma ID |
|---|---|
| Placeholder | `8420:20244` |
| Piemonte | `8420:20247` |
| Marche | `8420:20245` |
| Lazio | `8420:20246` |
| Lombardia | `8425:20577` |

---

## 9. Illustrations — Figma `5188:5272`
Illustrazioni tematiche per sezioni/empty state. Size nativa: **180×140px**.

| Nome | Figma ID |
|---|---|
| Placeholder | `5450:7855` |
| Valore della produzione | `5450:7484` |
| Occupati | `5448:7440` |
| PIL | `5448:7439` |
| Redditi | `5448:7438` |
| Spese | `5448:7437` |
| Entrate dirette | `5448:7436` |
| Entrate indirette | `5448:7435` |

---

## 10. Istruzioni per Claude Code

1. **Size minima usabile:** 24px. Sotto i 24px le icone non sono leggibili — non usarle.
2. **Size default nei componenti UI** (button icon slot, input icon): **32px**.
3. **Colore:** applicare tramite token CSS, mai valori hardcoded. Le SDG Icons fanno eccezione — i loro colori sono fissi e semantici (colori ONU).
4. **Fill vs Stroke:** usare la variante `fill` per stati prominenti/attivi, `stroke/outline` per stati secondari o inattivi.
5. **Commercial Icons**: hanno sempre un `background-color` come parte del design. Usare i tre stili (`primary`, `accent`, `plane`) in base al contesto della pagina.
6. **Hero Icons e SDG Icons** (80px): non ridimensionare sotto 64px — perdono leggibilità.
7. **Illustrations** (180×140px): usare solo in sezioni dedicate (empty state, hero, onboarding). Non usare inline nel testo.
8. Per recuperare l'SVG/asset di una specifica icona: `Figma:get_design_context(fileKey: "ULFrjRJzopTyLKczdJLJkn", nodeId: "<ID>")`.
