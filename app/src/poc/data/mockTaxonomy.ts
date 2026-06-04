/* ══════════════════════════════════════════════════════════════
   mockTaxonomy.ts — Tassonomia categorie e indicatori Data Room
   Basato su metadata_registry.xlsx e mockup Figma Civiqa
   ══════════════════════════════════════════════════════════════ */

export interface Indicatore {
  id: string
  nome: string
  descrizione: string
  udm: string
  mediaNazionale: number
  mediana: number
}

export interface Categoria {
  id: string
  nome: string
  descrizione: string
  icona: string
  indicatori: Indicatore[]
}

export const CATEGORIE: Categoria[] = [
  {
    id: 'ambiente',
    nome: 'Ambiente e sostenibilità',
    descrizione: 'Dati e indicatori su qualità ambientale, gestione delle risorse, consumo di suolo, energia, rifiuti e iniziative per la sostenibilità.',
    icona: '🌿',
    indicatori: [
      { id: 'amb-01', nome: 'Indice di emissione mezzi inquinanti', descrizione: 'Misura la quantità di emissioni prodotte da mezzi inquinanti su scala locale', udm: 'g/km²', mediaNazionale: 9.65, mediana: 9.65 },
      { id: 'amb-02', nome: 'Verde fruibile', descrizione: 'Estensione delle aree verdi accessibili e fruibili da cittadini e visitatori nel territorio comunale', udm: 'km', mediaNazionale: 1.8, mediana: 1.8 },
      { id: 'amb-03', nome: 'Superamenti giornalieri del limite di PM10', descrizione: 'Numero di giorni in cui il livello di PM10 ha superato la soglia consentita di legge', udm: 'gg', mediaNazionale: 34, mediana: 34 },
      { id: 'amb-04', nome: 'Indice di fragilità urbane', descrizione: 'Indica il livello di vulnerabilità urbana rispetto a fattori ambientali, economici e sociali', udm: '%', mediaNazionale: 22, mediana: 22 },
      { id: 'amb-05', nome: 'Tasso di motorizzazione ad alte emissioni', descrizione: 'Numero di veicoli ad alte emissioni per abitante', udm: '#', mediaNazionale: 0.43, mediana: 0.43 },
      { id: 'amb-06', nome: 'Raccolta differenziata per abitante', descrizione: 'Quantità di rifiuti differenziati raccolti annualmente per abitante', udm: 't/ab.', mediaNazionale: 9.52, mediana: 9.52 },
    ],
  },
  {
    id: 'cultura',
    nome: 'Cultura e turismo',
    descrizione: 'Informazioni su patrimonio culturale, offerta turistica, attrattività territoriale, flussi di visitatori e servizi culturali disponibili.',
    icona: '🏛️',
    indicatori: [
      { id: 'cul-01', nome: 'Densità di strutture ricettive', descrizione: 'Numero di strutture ricettive per kmq sul territorio comunale', udm: '#/kmq', mediaNazionale: 2.3, mediana: 1.8 },
      { id: 'cul-02', nome: 'Presenze turistiche annue', descrizione: 'Numero totale di presenze turistiche registrate nell\'anno', udm: 'migliaia', mediaNazionale: 45.2, mediana: 28.1 },
      { id: 'cul-03', nome: 'Spesa culturale pro capite', descrizione: 'Spesa dell\'ente in cultura e servizi culturali per abitante', udm: '€/ab.', mediaNazionale: 32.5, mediana: 25.0 },
      { id: 'cul-04', nome: 'Indice di dotazione museale', descrizione: 'Numero di musei e siti culturali visitabili per 10.000 abitanti', udm: '#/10k', mediaNazionale: 1.2, mediana: 0.8 },
    ],
  },
  {
    id: 'economia',
    nome: 'Economia e lavoro',
    descrizione: 'Indicatori economici, tessuto produttivo, imprese, occupazione, mercato del lavoro e dinamiche di sviluppo locale.',
    icona: '💼',
    indicatori: [
      { id: 'eco-01', nome: 'Tasso di occupazione', descrizione: 'Percentuale della popolazione in età lavorativa che risulta occupata', udm: '%', mediaNazionale: 58.2, mediana: 57.5 },
      { id: 'eco-02', nome: 'Tasso di disoccupazione giovanile', descrizione: 'Percentuale di giovani 15-29 anni in cerca di occupazione', udm: '%', mediaNazionale: 23.7, mediana: 22.1 },
      { id: 'eco-03', nome: 'Reddito medio pro capite', descrizione: 'Reddito medio dichiarato per abitante', udm: '€', mediaNazionale: 21400, mediana: 19800 },
      { id: 'eco-04', nome: 'Densità imprenditoriale', descrizione: 'Numero di imprese attive per 1.000 abitanti', udm: '#/1k', mediaNazionale: 85.3, mediana: 78.6 },
      { id: 'eco-05', nome: 'Tasso NEET', descrizione: 'Percentuale di giovani che non studiano e non lavorano', udm: '%', mediaNazionale: 19.0, mediana: 17.5 },
    ],
  },
  {
    id: 'governance',
    nome: 'Governance e welfare locale',
    descrizione: 'Dati su amministrazione, servizi pubblici, welfare territoriale, qualità dei servizi alla persona e capacità gestionale dell\'ente.',
    icona: '🏢',
    indicatori: [
      { id: 'gov-01', nome: 'Capacità di riscossione tributaria', descrizione: 'Rapporto tra tributi riscossi e tributi accertati', udm: '%', mediaNazionale: 72.5, mediana: 71.0 },
      { id: 'gov-02', nome: 'Spesa sociale pro capite', descrizione: 'Spesa dell\'ente per servizi sociali per abitante', udm: '€/ab.', mediaNazionale: 145, mediana: 120 },
      { id: 'gov-03', nome: 'Indice di digitalizzazione servizi', descrizione: 'Percentuale di servizi comunali disponibili online', udm: '%', mediaNazionale: 48.3, mediana: 42.0 },
      { id: 'gov-04', nome: 'Tempo medio risposta pratiche', descrizione: 'Tempo medio di evasione delle pratiche amministrative', udm: 'gg', mediaNazionale: 35, mediana: 30 },
    ],
  },
  {
    id: 'istruzione',
    nome: 'Istruzione',
    descrizione: 'Indicatori su scuole, formazione, livelli di istruzione, servizi educativi e accesso alle opportunità formative del territorio.',
    icona: '🎓',
    indicatori: [
      { id: 'ist-01', nome: 'Tasso di scolarizzazione 0-3 anni', descrizione: 'Percentuale di bambini 0-3 anni iscritti a servizi educativi', udm: '%', mediaNazionale: 26.3, mediana: 24.0 },
      { id: 'ist-02', nome: 'Posti disponibili asili nido per 100 bambini', descrizione: 'Rapporto tra posti disponibili negli asili nido e popolazione 0-3', udm: '#/100', mediaNazionale: 27.2, mediana: 25.0 },
      { id: 'ist-03', nome: 'Indice di adeguatezza degli edifici scolastici', descrizione: 'Score composito di adeguatezza strutturale, sismica ed energetica degli edifici scolastici (0–100)', udm: 'punti', mediaNazionale: 52.7, mediana: 55.0 },
      { id: 'ist-04', nome: 'Tasso di dispersione scolastica', descrizione: 'Percentuale di studenti che abbandonano il percorso scolastico', udm: '%', mediaNazionale: 12.7, mediana: 11.5 },
      { id: 'ist-05', nome: 'Spesa per istruzione pro capite', descrizione: 'Spesa dell\'ente per istruzione e servizi educativi per abitante', udm: '€/ab.', mediaNazionale: 198, mediana: 175 },
    ],
  },
  {
    id: 'mobilita',
    nome: 'Mobilità e trasporti',
    descrizione: 'Informazioni su infrastrutture, rete di trasporto, accessibilità, spostamenti, viabilità e servizi di mobilità pubblica e privata.',
    icona: '🚌',
    indicatori: [
      { id: 'mob-01', nome: 'Km di piste ciclabili per 10k abitanti', descrizione: 'Estensione della rete ciclabile in rapporto alla popolazione', udm: 'km/10k', mediaNazionale: 3.8, mediana: 2.5 },
      { id: 'mob-02', nome: 'Tasso di incidentalità stradale', descrizione: 'Numero di incidenti stradali per 1.000 abitanti', udm: '#/1k', mediaNazionale: 4.2, mediana: 3.8 },
      { id: 'mob-03', nome: 'Indice di accessibilità TPL', descrizione: 'Percentuale di popolazione servita dal trasporto pubblico locale', udm: '%', mediaNazionale: 62.0, mediana: 55.0 },
      { id: 'mob-04', nome: 'Età media parco veicolare', descrizione: 'Età media dei veicoli immatricolati nel territorio', udm: 'anni', mediaNazionale: 11.8, mediana: 12.2 },
    ],
  },
  {
    id: 'popolazione',
    nome: 'Popolazione e Demografia',
    descrizione: 'Informazioni su struttura della popolazione, distribuzione territoriale, dinamiche demografiche, età media, natalità, migrazioni.',
    icona: '👥',
    indicatori: [
      { id: 'pop-01', nome: 'Indice di vecchiaia', descrizione: 'Rapporto tra popolazione over 65 e popolazione under 15', udm: '%', mediaNazionale: 187.6, mediana: 180.0 },
      { id: 'pop-02', nome: 'Indice di dipendenza', descrizione: 'Rapporto tra popolazione non attiva e popolazione in età lavorativa', udm: '%', mediaNazionale: 56.3, mediana: 55.0 },
      { id: 'pop-03', nome: 'Tasso di natalità', descrizione: 'Numero di nati per 1.000 abitanti', udm: '‰', mediaNazionale: 6.7, mediana: 6.5 },
      { id: 'pop-04', nome: 'Saldo migratorio netto', descrizione: 'Differenza tra immigrati e emigrati per 1.000 abitanti', udm: '‰', mediaNazionale: 1.2, mediana: 0.8 },
    ],
  },
]

/* ── Mapping categoria → fabbisogni tipici ── */
export interface FabbisognoTipo {
  id: string
  categoriaId: string
  nome: string
  descrizione: string
  indicatoriCorrelati: string[]
}

export const FABBISOGNI_TIPO: FabbisognoTipo[] = [
  { id: 'fab-ist-01', categoriaId: 'istruzione', nome: 'Potenziamento servizi prima infanzia', descrizione: 'Incremento della capacità ricettiva per la fascia 0-3 anni', indicatoriCorrelati: ['ist-01', 'ist-02'] },
  { id: 'fab-ist-02', categoriaId: 'istruzione', nome: 'Adeguamento Edilizia Scolastica', descrizione: 'Messa in sicurezza e riqualificazione degli edifici scolastici', indicatoriCorrelati: ['ist-03'] },
  { id: 'fab-ist-03', categoriaId: 'istruzione', nome: 'Contrasto alla dispersione scolastica', descrizione: 'Interventi per ridurre l\'abbandono scolastico', indicatoriCorrelati: ['ist-04'] },
  { id: 'fab-amb-01', categoriaId: 'ambiente', nome: 'Riduzione emissioni inquinanti', descrizione: 'Interventi per la riduzione delle emissioni su scala locale', indicatoriCorrelati: ['amb-01', 'amb-05'] },
  { id: 'fab-amb-02', categoriaId: 'ambiente', nome: 'Incremento verde urbano', descrizione: 'Ampliamento delle aree verdi fruibili dal pubblico', indicatoriCorrelati: ['amb-02'] },
  { id: 'fab-amb-03', categoriaId: 'ambiente', nome: 'Miglioramento gestione rifiuti', descrizione: 'Potenziamento della raccolta differenziata e riduzione rifiuti', indicatoriCorrelati: ['amb-06'] },
  { id: 'fab-mob-01', categoriaId: 'mobilita', nome: 'Potenziamento mobilità sostenibile', descrizione: 'Estensione rete ciclabile e pedonale', indicatoriCorrelati: ['mob-01'] },
  { id: 'fab-mob-02', categoriaId: 'mobilita', nome: 'Riduzione incidentalità stradale', descrizione: 'Interventi di sicurezza viaria e moderazione del traffico', indicatoriCorrelati: ['mob-02'] },
  { id: 'fab-mob-03', categoriaId: 'mobilita', nome: 'Miglioramento trasporto pubblico', descrizione: 'Ampliamento copertura e frequenza del TPL', indicatoriCorrelati: ['mob-03'] },
  { id: 'fab-eco-01', categoriaId: 'economia', nome: 'Sostegno all\'occupazione giovanile', descrizione: 'Interventi per favorire l\'inserimento lavorativo dei giovani', indicatoriCorrelati: ['eco-02', 'eco-05'] },
  { id: 'fab-eco-02', categoriaId: 'economia', nome: 'Sviluppo tessuto imprenditoriale', descrizione: 'Incentivi e infrastrutture per nuove imprese', indicatoriCorrelati: ['eco-04'] },
  { id: 'fab-gov-01', categoriaId: 'governance', nome: 'Digitalizzazione servizi comunali', descrizione: 'Transizione digitale dei servizi al cittadino', indicatoriCorrelati: ['gov-03'] },
  { id: 'fab-gov-02', categoriaId: 'governance', nome: 'Potenziamento welfare locale', descrizione: 'Ampliamento dei servizi sociali e di assistenza', indicatoriCorrelati: ['gov-02'] },
  { id: 'fab-cul-01', categoriaId: 'cultura', nome: 'Valorizzazione patrimonio culturale', descrizione: 'Restauro e promozione di beni culturali e museali', indicatoriCorrelati: ['cul-04'] },
  { id: 'fab-cul-02', categoriaId: 'cultura', nome: 'Sviluppo offerta turistica', descrizione: 'Potenziamento infrastrutture e servizi per il turismo', indicatoriCorrelati: ['cul-01', 'cul-02'] },
  { id: 'fab-pop-01', categoriaId: 'popolazione', nome: 'Contrasto allo spopolamento', descrizione: 'Interventi per attrarre e trattenere popolazione residente', indicatoriCorrelati: ['pop-03', 'pop-04'] },
  { id: 'fab-pop-02', categoriaId: 'popolazione', nome: 'Servizi per la popolazione anziana', descrizione: 'Potenziamento assistenza e servizi per over 65', indicatoriCorrelati: ['pop-01', 'pop-02'] },
]
