/* ══════════════════════════════════════════════════════════════
   mockMOP.ts — Monitoraggio Opere Pubbliche
   Tipologie di intervento con costi e durate per cluster
   Basato su MOP_Pivot.xlsx (2013-2022)
   Almeno 3 interventi per fabbisogno
   ══════════════════════════════════════════════════════════════ */

export type TipoIntervento = 'nuova_costruzione' | 'ristrutturazione' | 'riqualificazione' | 'voucher_servizi'

export interface ParametroDimensionale {
  nome: string
  udm: string
  min: number
  max: number
  default: number
  costoUnitario: number
}

export interface InterventoMOP {
  id: string
  settore: string
  sottosettore: string
  categoriaIntervento: string
  tipo: TipoIntervento
  tipoLabel: string
  fabbisogniCorrelati: string[]

  capexMin: number
  capexMedio: number
  capexMax: number
  opexAnnuoMin: number
  opexAnnuoMedio: number
  opexAnnuoMax: number

  durataMin: number
  durataMedio: number
  durataMax: number

  parametri: ParametroDimensionale[]
}

export const INTERVENTI_MOP: InterventoMOP[] = [

  /* ═══════════════════════════════════════════
     ISTRUZIONE — fab-ist-01: Potenziamento servizi prima infanzia
     ═══════════════════════════════════════════ */
  {
    id: 'mop-ist-nc-01',
    settore: 'Infrastrutture sociali', sottosettore: 'Infrastrutture scolastiche',
    categoriaIntervento: 'Nuova costruzione asilo nido comunale',
    tipo: 'nuova_costruzione', tipoLabel: 'Nuova costruzione',
    fabbisogniCorrelati: ['fab-ist-01'],
    capexMin: 1_200_000, capexMedio: 1_800_000, capexMax: 3_000_000,
    opexAnnuoMin: 60_000, opexAnnuoMedio: 95_000, opexAnnuoMax: 140_000,
    durataMin: 18, durataMedio: 30, durataMax: 42,
    parametri: [
      { nome: 'Posti bambino', udm: 'posti', min: 20, max: 120, default: 60, costoUnitario: 30_000 },
      { nome: 'Superficie', udm: 'mq', min: 300, max: 1500, default: 750, costoUnitario: 2_400 },
    ],
  },
  {
    id: 'mop-ist-ri-02',
    settore: 'Infrastrutture sociali', sottosettore: 'Infrastrutture scolastiche',
    categoriaIntervento: 'Riadattamento struttura esistente ad asilo nido',
    tipo: 'ristrutturazione', tipoLabel: 'Ristrutturazione / Riadattamento',
    fabbisogniCorrelati: ['fab-ist-01'],
    capexMin: 400_000, capexMedio: 700_000, capexMax: 1_200_000,
    opexAnnuoMin: 40_000, opexAnnuoMedio: 70_000, opexAnnuoMax: 110_000,
    durataMin: 8, durataMedio: 14, durataMax: 22,
    parametri: [
      { nome: 'Posti bambino', udm: 'posti', min: 15, max: 80, default: 40, costoUnitario: 17_500 },
      { nome: 'Superficie', udm: 'mq', min: 200, max: 1000, default: 500, costoUnitario: 1_400 },
    ],
  },
  {
    id: 'mop-ist-vs-01',
    settore: 'Servizi sociali', sottosettore: 'Servizi educativi',
    categoriaIntervento: 'Voucher servizi educativi prima infanzia',
    tipo: 'voucher_servizi', tipoLabel: 'Voucher / Acquisto servizi',
    fabbisogniCorrelati: ['fab-ist-01', 'fab-ist-03'],
    capexMin: 50_000, capexMedio: 150_000, capexMax: 350_000,
    opexAnnuoMin: 50_000, opexAnnuoMedio: 150_000, opexAnnuoMax: 350_000,
    durataMin: 1, durataMedio: 3, durataMax: 6,
    parametri: [
      { nome: 'Famiglie beneficiarie', udm: 'famiglie', min: 10, max: 200, default: 50, costoUnitario: 3_000 },
    ],
  },

  /* ═══════════════════════════════════════════
     ISTRUZIONE — fab-ist-02: Adeguamento Edilizia Scolastica
     ═══════════════════════════════════════════ */
  {
    id: 'mop-ist-nc-02',
    settore: 'Infrastrutture sociali', sottosettore: 'Infrastrutture scolastiche',
    categoriaIntervento: 'Nuova costruzione edificio scolastico',
    tipo: 'nuova_costruzione', tipoLabel: 'Nuova costruzione',
    fabbisogniCorrelati: ['fab-ist-02'],
    capexMin: 1_800_000, capexMedio: 2_500_000, capexMax: 4_200_000,
    opexAnnuoMin: 80_000, opexAnnuoMedio: 120_000, opexAnnuoMax: 180_000,
    durataMin: 24, durataMedio: 36, durataMax: 48,
    parametri: [
      { nome: 'Posti alunno', udm: 'posti', min: 50, max: 300, default: 150, costoUnitario: 16_000 },
      { nome: 'Superficie', udm: 'mq', min: 500, max: 3000, default: 1500, costoUnitario: 1_650 },
    ],
  },
  {
    id: 'mop-ist-ri-01',
    settore: 'Infrastrutture sociali', sottosettore: 'Infrastrutture scolastiche',
    categoriaIntervento: 'Ristrutturazione e adeguamento sismico edificio scolastico',
    tipo: 'ristrutturazione', tipoLabel: 'Ristrutturazione',
    fabbisogniCorrelati: ['fab-ist-02'],
    capexMin: 600_000, capexMedio: 950_000, capexMax: 1_800_000,
    opexAnnuoMin: 40_000, opexAnnuoMedio: 65_000, opexAnnuoMax: 95_000,
    durataMin: 12, durataMedio: 18, durataMax: 30,
    parametri: [
      { nome: 'Posti alunno', udm: 'posti', min: 30, max: 200, default: 100, costoUnitario: 8_500 },
      { nome: 'Superficie', udm: 'mq', min: 300, max: 2000, default: 1000, costoUnitario: 900 },
    ],
  },
  {
    id: 'mop-ist-rq-01',
    settore: 'Infrastrutture sociali', sottosettore: 'Infrastrutture scolastiche',
    categoriaIntervento: 'Riqualificazione energetica edificio scolastico',
    tipo: 'riqualificazione', tipoLabel: 'Riqualificazione energetica',
    fabbisogniCorrelati: ['fab-ist-02', 'fab-amb-01'],
    capexMin: 350_000, capexMedio: 550_000, capexMax: 900_000,
    opexAnnuoMin: 15_000, opexAnnuoMedio: 25_000, opexAnnuoMax: 40_000,
    durataMin: 6, durataMedio: 12, durataMax: 18,
    parametri: [
      { nome: 'Superficie', udm: 'mq', min: 300, max: 2000, default: 800, costoUnitario: 680 },
    ],
  },

  /* ═══════════════════════════════════════════
     ISTRUZIONE — fab-ist-03: Contrasto dispersione scolastica
     ═══════════════════════════════════════════ */
  {
    id: 'mop-ist-vs-02',
    settore: 'Servizi sociali', sottosettore: 'Servizi educativi',
    categoriaIntervento: 'Programma tutoraggio e doposcuola',
    tipo: 'voucher_servizi', tipoLabel: 'Acquisto servizi',
    fabbisogniCorrelati: ['fab-ist-03'],
    capexMin: 80_000, capexMedio: 200_000, capexMax: 400_000,
    opexAnnuoMin: 80_000, opexAnnuoMedio: 200_000, opexAnnuoMax: 400_000,
    durataMin: 1, durataMedio: 3, durataMax: 6,
    parametri: [
      { nome: 'Studenti beneficiari', udm: 'studenti', min: 30, max: 300, default: 100, costoUnitario: 2_000 },
    ],
  },
  {
    id: 'mop-ist-ri-03',
    settore: 'Infrastrutture sociali', sottosettore: 'Infrastrutture scolastiche',
    categoriaIntervento: 'Realizzazione centro educativo polifunzionale',
    tipo: 'ristrutturazione', tipoLabel: 'Ristrutturazione / Riadattamento',
    fabbisogniCorrelati: ['fab-ist-03'],
    capexMin: 300_000, capexMedio: 550_000, capexMax: 900_000,
    opexAnnuoMin: 35_000, opexAnnuoMedio: 60_000, opexAnnuoMax: 90_000,
    durataMin: 8, durataMedio: 14, durataMax: 20,
    parametri: [
      { nome: 'Capienza', udm: 'posti', min: 30, max: 150, default: 80, costoUnitario: 6_800 },
    ],
  },
  {
    id: 'mop-ist-nc-03',
    settore: 'Infrastrutture sociali', sottosettore: 'Servizi educativi',
    categoriaIntervento: 'Nuova costruzione polo educativo integrato',
    tipo: 'nuova_costruzione', tipoLabel: 'Nuova costruzione',
    fabbisogniCorrelati: ['fab-ist-03', 'fab-ist-01'],
    capexMin: 1_500_000, capexMedio: 2_200_000, capexMax: 3_500_000,
    opexAnnuoMin: 100_000, opexAnnuoMedio: 160_000, opexAnnuoMax: 250_000,
    durataMin: 20, durataMedio: 30, durataMax: 42,
    parametri: [
      { nome: 'Capienza', udm: 'posti', min: 50, max: 250, default: 120, costoUnitario: 18_000 },
    ],
  },

  /* ═══════════════════════════════════════════
     AMBIENTE — fab-amb-01: Riduzione emissioni inquinanti
     ═══════════════════════════════════════════ */
  {
    id: 'mop-amb-rq-01',
    settore: 'Infrastrutture ambientali', sottosettore: 'Efficienza energetica',
    categoriaIntervento: 'Riqualificazione energetica edifici pubblici',
    tipo: 'riqualificazione', tipoLabel: 'Riqualificazione energetica',
    fabbisogniCorrelati: ['fab-amb-01'],
    capexMin: 250_000, capexMedio: 500_000, capexMax: 1_100_000,
    opexAnnuoMin: 10_000, opexAnnuoMedio: 20_000, opexAnnuoMax: 35_000,
    durataMin: 6, durataMedio: 10, durataMax: 16,
    parametri: [
      { nome: 'Superficie', udm: 'mq', min: 500, max: 5000, default: 2000, costoUnitario: 250 },
    ],
  },
  {
    id: 'mop-amb-nc-02',
    settore: 'Infrastrutture ambientali', sottosettore: 'Energia rinnovabile',
    categoriaIntervento: 'Installazione impianti fotovoltaici su edifici comunali',
    tipo: 'nuova_costruzione', tipoLabel: 'Nuova installazione',
    fabbisogniCorrelati: ['fab-amb-01'],
    capexMin: 150_000, capexMedio: 350_000, capexMax: 800_000,
    opexAnnuoMin: 5_000, opexAnnuoMedio: 12_000, opexAnnuoMax: 25_000,
    durataMin: 3, durataMedio: 6, durataMax: 12,
    parametri: [
      { nome: 'Potenza', udm: 'kW', min: 20, max: 200, default: 80, costoUnitario: 4_300 },
    ],
  },
  {
    id: 'mop-amb-vs-01',
    settore: 'Servizi ambientali', sottosettore: 'Mobilità green',
    categoriaIntervento: 'Sostituzione flotta comunale con veicoli elettrici',
    tipo: 'voucher_servizi', tipoLabel: 'Acquisto / Noleggio',
    fabbisogniCorrelati: ['fab-amb-01'],
    capexMin: 100_000, capexMedio: 280_000, capexMax: 600_000,
    opexAnnuoMin: 15_000, opexAnnuoMedio: 30_000, opexAnnuoMax: 55_000,
    durataMin: 2, durataMedio: 4, durataMax: 8,
    parametri: [
      { nome: 'Veicoli', udm: 'n°', min: 2, max: 20, default: 8, costoUnitario: 35_000 },
    ],
  },

  /* ═══════════════════════════════════════════
     AMBIENTE — fab-amb-02: Incremento verde urbano
     ═══════════════════════════════════════════ */
  {
    id: 'mop-amb-nc-01',
    settore: 'Infrastrutture ambientali', sottosettore: 'Verde urbano',
    categoriaIntervento: 'Nuovo parco urbano',
    tipo: 'nuova_costruzione', tipoLabel: 'Nuova costruzione',
    fabbisogniCorrelati: ['fab-amb-02'],
    capexMin: 300_000, capexMedio: 750_000, capexMax: 2_000_000,
    opexAnnuoMin: 25_000, opexAnnuoMedio: 45_000, opexAnnuoMax: 80_000,
    durataMin: 8, durataMedio: 14, durataMax: 24,
    parametri: [
      { nome: 'Superficie', udm: 'mq', min: 2000, max: 30000, default: 10000, costoUnitario: 75 },
    ],
  },
  {
    id: 'mop-amb-rq-02',
    settore: 'Infrastrutture ambientali', sottosettore: 'Verde urbano',
    categoriaIntervento: 'Riqualificazione giardini pubblici esistenti',
    tipo: 'riqualificazione', tipoLabel: 'Riqualificazione',
    fabbisogniCorrelati: ['fab-amb-02'],
    capexMin: 120_000, capexMedio: 300_000, capexMax: 600_000,
    opexAnnuoMin: 15_000, opexAnnuoMedio: 28_000, opexAnnuoMax: 45_000,
    durataMin: 4, durataMedio: 8, durataMax: 14,
    parametri: [
      { nome: 'Superficie', udm: 'mq', min: 1000, max: 15000, default: 5000, costoUnitario: 60 },
    ],
  },
  {
    id: 'mop-amb-nc-03',
    settore: 'Infrastrutture ambientali', sottosettore: 'Verde urbano',
    categoriaIntervento: 'Forestazione urbana e corridoi ecologici',
    tipo: 'nuova_costruzione', tipoLabel: 'Nuova realizzazione',
    fabbisogniCorrelati: ['fab-amb-02'],
    capexMin: 80_000, capexMedio: 200_000, capexMax: 450_000,
    opexAnnuoMin: 8_000, opexAnnuoMedio: 18_000, opexAnnuoMax: 35_000,
    durataMin: 3, durataMedio: 6, durataMax: 12,
    parametri: [
      { nome: 'Alberi piantati', udm: 'n°', min: 100, max: 2000, default: 500, costoUnitario: 400 },
    ],
  },

  /* ═══════════════════════════════════════════
     AMBIENTE — fab-amb-03: Miglioramento gestione rifiuti
     ═══════════════════════════════════════════ */
  {
    id: 'mop-amb-vs-02',
    settore: 'Servizi ambientali', sottosettore: 'Gestione rifiuti',
    categoriaIntervento: 'Potenziamento isole ecologiche e raccolta differenziata',
    tipo: 'voucher_servizi', tipoLabel: 'Acquisto servizi / Attrezzature',
    fabbisogniCorrelati: ['fab-amb-03'],
    capexMin: 80_000, capexMedio: 220_000, capexMax: 500_000,
    opexAnnuoMin: 30_000, opexAnnuoMedio: 60_000, opexAnnuoMax: 100_000,
    durataMin: 2, durataMedio: 6, durataMax: 10,
    parametri: [
      { nome: 'Isole ecologiche', udm: 'n°', min: 2, max: 20, default: 8, costoUnitario: 27_000 },
    ],
  },
  {
    id: 'mop-amb-nc-04',
    settore: 'Infrastrutture ambientali', sottosettore: 'Gestione rifiuti',
    categoriaIntervento: 'Nuovo centro di compostaggio comunale',
    tipo: 'nuova_costruzione', tipoLabel: 'Nuova costruzione',
    fabbisogniCorrelati: ['fab-amb-03'],
    capexMin: 350_000, capexMedio: 650_000, capexMax: 1_200_000,
    opexAnnuoMin: 40_000, opexAnnuoMedio: 70_000, opexAnnuoMax: 120_000,
    durataMin: 10, durataMedio: 16, durataMax: 24,
    parametri: [
      { nome: 'Capacità', udm: 't/anno', min: 500, max: 5000, default: 2000, costoUnitario: 325 },
    ],
  },
  {
    id: 'mop-amb-vs-03',
    settore: 'Servizi ambientali', sottosettore: 'Gestione rifiuti',
    categoriaIntervento: 'Campagna sensibilizzazione e incentivi raccolta differenziata',
    tipo: 'voucher_servizi', tipoLabel: 'Acquisto servizi',
    fabbisogniCorrelati: ['fab-amb-03'],
    capexMin: 30_000, capexMedio: 80_000, capexMax: 180_000,
    opexAnnuoMin: 20_000, opexAnnuoMedio: 50_000, opexAnnuoMax: 90_000,
    durataMin: 1, durataMedio: 3, durataMax: 6,
    parametri: [
      { nome: 'Famiglie coinvolte', udm: 'famiglie', min: 500, max: 10000, default: 3000, costoUnitario: 25 },
    ],
  },

  /* ═══════════════════════════════════════════
     MOBILITÀ — fab-mob-01: Potenziamento mobilità sostenibile
     ═══════════════════════════════════════════ */
  {
    id: 'mop-mob-nc-01',
    settore: 'Infrastrutture di trasporto', sottosettore: 'Viabilità e mobilità sostenibile',
    categoriaIntervento: 'Nuova pista ciclabile',
    tipo: 'nuova_costruzione', tipoLabel: 'Nuova costruzione',
    fabbisogniCorrelati: ['fab-mob-01'],
    capexMin: 200_000, capexMedio: 450_000, capexMax: 1_200_000,
    opexAnnuoMin: 8_000, opexAnnuoMedio: 15_000, opexAnnuoMax: 30_000,
    durataMin: 6, durataMedio: 12, durataMax: 18,
    parametri: [
      { nome: 'Lunghezza', udm: 'km', min: 1, max: 15, default: 5, costoUnitario: 90_000 },
    ],
  },
  {
    id: 'mop-mob-vs-01',
    settore: 'Servizi di trasporto', sottosettore: 'Mobilità condivisa',
    categoriaIntervento: 'Servizio bike sharing comunale',
    tipo: 'voucher_servizi', tipoLabel: 'Acquisto servizi / Noleggio',
    fabbisogniCorrelati: ['fab-mob-01'],
    capexMin: 60_000, capexMedio: 180_000, capexMax: 400_000,
    opexAnnuoMin: 30_000, opexAnnuoMedio: 60_000, opexAnnuoMax: 100_000,
    durataMin: 2, durataMedio: 4, durataMax: 8,
    parametri: [
      { nome: 'Stazioni', udm: 'n°', min: 5, max: 40, default: 15, costoUnitario: 12_000 },
    ],
  },
  {
    id: 'mop-mob-rq-01',
    settore: 'Infrastrutture di trasporto', sottosettore: 'Viabilità e mobilità sostenibile',
    categoriaIntervento: 'Realizzazione zone 30 e aree pedonali',
    tipo: 'riqualificazione', tipoLabel: 'Riqualificazione',
    fabbisogniCorrelati: ['fab-mob-01', 'fab-mob-02'],
    capexMin: 100_000, capexMedio: 280_000, capexMax: 600_000,
    opexAnnuoMin: 5_000, opexAnnuoMedio: 12_000, opexAnnuoMax: 22_000,
    durataMin: 4, durataMedio: 8, durataMax: 14,
    parametri: [
      { nome: 'Aree', udm: 'n°', min: 1, max: 10, default: 3, costoUnitario: 90_000 },
    ],
  },

  /* ═══════════════════════════════════════════
     MOBILITÀ — fab-mob-02: Riduzione incidentalità stradale
     ═══════════════════════════════════════════ */
  {
    id: 'mop-mob-ri-01',
    settore: 'Infrastrutture di trasporto', sottosettore: 'Strade e sicurezza stradale',
    categoriaIntervento: 'Messa in sicurezza intersezioni stradali',
    tipo: 'ristrutturazione', tipoLabel: 'Messa in sicurezza',
    fabbisogniCorrelati: ['fab-mob-02'],
    capexMin: 150_000, capexMedio: 380_000, capexMax: 800_000,
    opexAnnuoMin: 5_000, opexAnnuoMedio: 12_000, opexAnnuoMax: 25_000,
    durataMin: 4, durataMedio: 8, durataMax: 14,
    parametri: [
      { nome: 'Intersezioni', udm: 'n°', min: 1, max: 10, default: 3, costoUnitario: 125_000 },
    ],
  },
  {
    id: 'mop-mob-nc-02',
    settore: 'Infrastrutture di trasporto', sottosettore: 'Strade e sicurezza stradale',
    categoriaIntervento: 'Nuova rotatoria e riqualificazione viaria',
    tipo: 'nuova_costruzione', tipoLabel: 'Nuova costruzione',
    fabbisogniCorrelati: ['fab-mob-02'],
    capexMin: 300_000, capexMedio: 600_000, capexMax: 1_200_000,
    opexAnnuoMin: 8_000, opexAnnuoMedio: 18_000, opexAnnuoMax: 30_000,
    durataMin: 8, durataMedio: 14, durataMax: 22,
    parametri: [
      { nome: 'Rotatorie', udm: 'n°', min: 1, max: 5, default: 2, costoUnitario: 300_000 },
    ],
  },
  {
    id: 'mop-mob-vs-02',
    settore: 'Servizi di trasporto', sottosettore: 'Sicurezza stradale',
    categoriaIntervento: 'Installazione sistemi di moderazione traffico intelligenti',
    tipo: 'voucher_servizi', tipoLabel: 'Acquisto / Installazione',
    fabbisogniCorrelati: ['fab-mob-02'],
    capexMin: 80_000, capexMedio: 200_000, capexMax: 450_000,
    opexAnnuoMin: 10_000, opexAnnuoMedio: 25_000, opexAnnuoMax: 45_000,
    durataMin: 2, durataMedio: 5, durataMax: 10,
    parametri: [
      { nome: 'Punti di installazione', udm: 'n°', min: 3, max: 30, default: 10, costoUnitario: 20_000 },
    ],
  },

  /* ═══════════════════════════════════════════
     MOBILITÀ — fab-mob-03: Miglioramento TPL
     ═══════════════════════════════════════════ */
  {
    id: 'mop-mob-vs-03',
    settore: 'Servizi di trasporto', sottosettore: 'Trasporto pubblico',
    categoriaIntervento: 'Potenziamento linee TPL e nuove fermate',
    tipo: 'voucher_servizi', tipoLabel: 'Acquisto servizi',
    fabbisogniCorrelati: ['fab-mob-03'],
    capexMin: 200_000, capexMedio: 500_000, capexMax: 1_200_000,
    opexAnnuoMin: 100_000, opexAnnuoMedio: 250_000, opexAnnuoMax: 500_000,
    durataMin: 3, durataMedio: 6, durataMax: 12,
    parametri: [
      { nome: 'Nuove fermate', udm: 'n°', min: 3, max: 20, default: 8, costoUnitario: 62_000 },
    ],
  },
  {
    id: 'mop-mob-nc-03',
    settore: 'Infrastrutture di trasporto', sottosettore: 'Trasporto pubblico',
    categoriaIntervento: 'Realizzazione pensiline e hub intermodale',
    tipo: 'nuova_costruzione', tipoLabel: 'Nuova costruzione',
    fabbisogniCorrelati: ['fab-mob-03'],
    capexMin: 150_000, capexMedio: 400_000, capexMax: 900_000,
    opexAnnuoMin: 12_000, opexAnnuoMedio: 28_000, opexAnnuoMax: 50_000,
    durataMin: 6, durataMedio: 10, durataMax: 18,
    parametri: [
      { nome: 'Pensiline/Hub', udm: 'n°', min: 2, max: 15, default: 6, costoUnitario: 65_000 },
    ],
  },
  {
    id: 'mop-mob-rq-02',
    settore: 'Infrastrutture di trasporto', sottosettore: 'Trasporto pubblico',
    categoriaIntervento: 'Acquisto autobus elettrici per TPL',
    tipo: 'riqualificazione', tipoLabel: 'Sostituzione flotta',
    fabbisogniCorrelati: ['fab-mob-03', 'fab-amb-01'],
    capexMin: 500_000, capexMedio: 1_200_000, capexMax: 3_000_000,
    opexAnnuoMin: 50_000, opexAnnuoMedio: 120_000, opexAnnuoMax: 250_000,
    durataMin: 6, durataMedio: 12, durataMax: 18,
    parametri: [
      { nome: 'Autobus', udm: 'n°', min: 1, max: 10, default: 3, costoUnitario: 400_000 },
    ],
  },

  /* ═══════════════════════════════════════════
     ECONOMIA — fab-eco-01: Sostegno occupazione giovanile
     ═══════════════════════════════════════════ */
  {
    id: 'mop-eco-vs-01',
    settore: 'Servizi economici', sottosettore: 'Lavoro e formazione',
    categoriaIntervento: 'Programma tirocini e inserimento lavorativo giovani',
    tipo: 'voucher_servizi', tipoLabel: 'Voucher / Programma',
    fabbisogniCorrelati: ['fab-eco-01'],
    capexMin: 60_000, capexMedio: 180_000, capexMax: 400_000,
    opexAnnuoMin: 60_000, opexAnnuoMedio: 180_000, opexAnnuoMax: 400_000,
    durataMin: 1, durataMedio: 6, durataMax: 12,
    parametri: [
      { nome: 'Giovani beneficiari', udm: 'persone', min: 10, max: 150, default: 50, costoUnitario: 3_600 },
    ],
  },
  {
    id: 'mop-eco-nc-01',
    settore: 'Infrastrutture economiche', sottosettore: 'Spazi di lavoro',
    categoriaIntervento: 'Realizzazione spazio coworking e incubatore comunale',
    tipo: 'nuova_costruzione', tipoLabel: 'Nuova costruzione',
    fabbisogniCorrelati: ['fab-eco-01', 'fab-eco-02'],
    capexMin: 250_000, capexMedio: 500_000, capexMax: 1_000_000,
    opexAnnuoMin: 30_000, opexAnnuoMedio: 60_000, opexAnnuoMax: 100_000,
    durataMin: 8, durataMedio: 14, durataMax: 22,
    parametri: [
      { nome: 'Postazioni', udm: 'n°', min: 10, max: 80, default: 30, costoUnitario: 16_500 },
    ],
  },
  {
    id: 'mop-eco-ri-01',
    settore: 'Infrastrutture economiche', sottosettore: 'Formazione professionale',
    categoriaIntervento: 'Riadattamento struttura a centro formazione professionale',
    tipo: 'ristrutturazione', tipoLabel: 'Ristrutturazione',
    fabbisogniCorrelati: ['fab-eco-01'],
    capexMin: 200_000, capexMedio: 400_000, capexMax: 750_000,
    opexAnnuoMin: 25_000, opexAnnuoMedio: 50_000, opexAnnuoMax: 80_000,
    durataMin: 6, durataMedio: 12, durataMax: 18,
    parametri: [
      { nome: 'Capienza', udm: 'posti', min: 20, max: 120, default: 50, costoUnitario: 8_000 },
    ],
  },

  /* ═══════════════════════════════════════════
     ECONOMIA — fab-eco-02: Sviluppo tessuto imprenditoriale
     ═══════════════════════════════════════════ */
  {
    id: 'mop-eco-vs-02',
    settore: 'Servizi economici', sottosettore: 'Incentivi imprese',
    categoriaIntervento: 'Fondo incentivi per nuove attività imprenditoriali',
    tipo: 'voucher_servizi', tipoLabel: 'Fondo incentivi',
    fabbisogniCorrelati: ['fab-eco-02'],
    capexMin: 100_000, capexMedio: 300_000, capexMax: 700_000,
    opexAnnuoMin: 20_000, opexAnnuoMedio: 50_000, opexAnnuoMax: 100_000,
    durataMin: 1, durataMedio: 3, durataMax: 6,
    parametri: [
      { nome: 'Imprese beneficiarie', udm: 'n°', min: 5, max: 50, default: 20, costoUnitario: 15_000 },
    ],
  },

  /* ═══════════════════════════════════════════
     GOVERNANCE — fab-gov-01: Digitalizzazione servizi
     ═══════════════════════════════════════════ */
  {
    id: 'mop-gov-vs-01',
    settore: 'Servizi digitali', sottosettore: 'Digitalizzazione PA',
    categoriaIntervento: 'Piattaforma servizi digitali comunali',
    tipo: 'voucher_servizi', tipoLabel: 'Acquisto servizi / Piattaforma',
    fabbisogniCorrelati: ['fab-gov-01'],
    capexMin: 80_000, capexMedio: 180_000, capexMax: 400_000,
    opexAnnuoMin: 20_000, opexAnnuoMedio: 45_000, opexAnnuoMax: 80_000,
    durataMin: 3, durataMedio: 8, durataMax: 14,
    parametri: [
      { nome: 'Servizi digitalizzati', udm: 'n°', min: 5, max: 50, default: 15, costoUnitario: 12_000 },
    ],
  },
  {
    id: 'mop-gov-vs-03',
    settore: 'Servizi digitali', sottosettore: 'Digitalizzazione PA',
    categoriaIntervento: 'App mobile servizi al cittadino',
    tipo: 'voucher_servizi', tipoLabel: 'Sviluppo software',
    fabbisogniCorrelati: ['fab-gov-01'],
    capexMin: 40_000, capexMedio: 100_000, capexMax: 220_000,
    opexAnnuoMin: 12_000, opexAnnuoMedio: 25_000, opexAnnuoMax: 45_000,
    durataMin: 3, durataMedio: 6, durataMax: 10,
    parametri: [
      { nome: 'Funzionalità', udm: 'n°', min: 3, max: 20, default: 8, costoUnitario: 12_500 },
    ],
  },
  {
    id: 'mop-gov-rq-01',
    settore: 'Infrastrutture digitali', sottosettore: 'Connettività',
    categoriaIntervento: 'Potenziamento rete WiFi pubblica e connettività',
    tipo: 'riqualificazione', tipoLabel: 'Potenziamento infrastruttura',
    fabbisogniCorrelati: ['fab-gov-01'],
    capexMin: 60_000, capexMedio: 150_000, capexMax: 350_000,
    opexAnnuoMin: 8_000, opexAnnuoMedio: 18_000, opexAnnuoMax: 35_000,
    durataMin: 2, durataMedio: 5, durataMax: 10,
    parametri: [
      { nome: 'Hotspot', udm: 'n°', min: 5, max: 50, default: 20, costoUnitario: 7_500 },
    ],
  },

  /* ═══════════════════════════════════════════
     GOVERNANCE — fab-gov-02: Potenziamento welfare locale
     ═══════════════════════════════════════════ */
  {
    id: 'mop-gov-vs-02',
    settore: 'Servizi sociali', sottosettore: 'Welfare e assistenza',
    categoriaIntervento: 'Voucher servizi assistenziali anziani',
    tipo: 'voucher_servizi', tipoLabel: 'Voucher / Acquisto servizi',
    fabbisogniCorrelati: ['fab-pop-02', 'fab-gov-02'],
    capexMin: 30_000, capexMedio: 100_000, capexMax: 250_000,
    opexAnnuoMin: 80_000, opexAnnuoMedio: 200_000, opexAnnuoMax: 500_000,
    durataMin: 1, durataMedio: 3, durataMax: 6,
    parametri: [
      { nome: 'Anziani beneficiari', udm: 'persone', min: 20, max: 500, default: 100, costoUnitario: 2_000 },
    ],
  },
  {
    id: 'mop-gov-nc-01',
    settore: 'Infrastrutture sociali', sottosettore: 'Centri servizi',
    categoriaIntervento: 'Nuovo centro servizi sociali polifunzionale',
    tipo: 'nuova_costruzione', tipoLabel: 'Nuova costruzione',
    fabbisogniCorrelati: ['fab-gov-02'],
    capexMin: 400_000, capexMedio: 800_000, capexMax: 1_500_000,
    opexAnnuoMin: 50_000, opexAnnuoMedio: 90_000, opexAnnuoMax: 150_000,
    durataMin: 12, durataMedio: 20, durataMax: 30,
    parametri: [
      { nome: 'Superficie', udm: 'mq', min: 200, max: 1500, default: 600, costoUnitario: 1_300 },
    ],
  },
  {
    id: 'mop-gov-ri-01',
    settore: 'Infrastrutture sociali', sottosettore: 'Centri servizi',
    categoriaIntervento: 'Riadattamento struttura a sportello welfare integrato',
    tipo: 'ristrutturazione', tipoLabel: 'Ristrutturazione',
    fabbisogniCorrelati: ['fab-gov-02'],
    capexMin: 150_000, capexMedio: 320_000, capexMax: 600_000,
    opexAnnuoMin: 25_000, opexAnnuoMedio: 50_000, opexAnnuoMax: 85_000,
    durataMin: 6, durataMedio: 10, durataMax: 16,
    parametri: [
      { nome: 'Superficie', udm: 'mq', min: 100, max: 800, default: 300, costoUnitario: 1_050 },
    ],
  },

  /* ═══════════════════════════════════════════
     CULTURA — fab-cul-01: Valorizzazione patrimonio culturale
     ═══════════════════════════════════════════ */
  {
    id: 'mop-cul-ri-01',
    settore: 'Infrastrutture culturali', sottosettore: 'Patrimonio culturale',
    categoriaIntervento: 'Restauro e valorizzazione beni culturali',
    tipo: 'ristrutturazione', tipoLabel: 'Restauro / Valorizzazione',
    fabbisogniCorrelati: ['fab-cul-01'],
    capexMin: 400_000, capexMedio: 900_000, capexMax: 2_500_000,
    opexAnnuoMin: 30_000, opexAnnuoMedio: 55_000, opexAnnuoMax: 100_000,
    durataMin: 12, durataMedio: 20, durataMax: 36,
    parametri: [
      { nome: 'Superficie', udm: 'mq', min: 200, max: 3000, default: 800, costoUnitario: 1_100 },
    ],
  },
  {
    id: 'mop-cul-rq-01',
    settore: 'Infrastrutture culturali', sottosettore: 'Patrimonio culturale',
    categoriaIntervento: 'Allestimento museo e percorso espositivo',
    tipo: 'riqualificazione', tipoLabel: 'Allestimento / Riqualificazione',
    fabbisogniCorrelati: ['fab-cul-01'],
    capexMin: 150_000, capexMedio: 350_000, capexMax: 800_000,
    opexAnnuoMin: 20_000, opexAnnuoMedio: 40_000, opexAnnuoMax: 70_000,
    durataMin: 6, durataMedio: 10, durataMax: 18,
    parametri: [
      { nome: 'Sale espositive', udm: 'n°', min: 2, max: 15, default: 6, costoUnitario: 58_000 },
    ],
  },
  {
    id: 'mop-cul-vs-01',
    settore: 'Servizi culturali', sottosettore: 'Promozione culturale',
    categoriaIntervento: 'Piattaforma digitale promozione patrimonio UNESCO',
    tipo: 'voucher_servizi', tipoLabel: 'Acquisto servizi digitali',
    fabbisogniCorrelati: ['fab-cul-01', 'fab-cul-02'],
    capexMin: 40_000, capexMedio: 120_000, capexMax: 280_000,
    opexAnnuoMin: 15_000, opexAnnuoMedio: 30_000, opexAnnuoMax: 55_000,
    durataMin: 3, durataMedio: 6, durataMax: 10,
    parametri: [
      { nome: 'Siti digitalizzati', udm: 'n°', min: 1, max: 10, default: 4, costoUnitario: 30_000 },
    ],
  },

  /* ═══════════════════════════════════════════
     CULTURA — fab-cul-02: Sviluppo offerta turistica
     ═══════════════════════════════════════════ */
  {
    id: 'mop-cul-nc-01',
    settore: 'Infrastrutture turistiche', sottosettore: 'Accoglienza',
    categoriaIntervento: 'Realizzazione info point e centro accoglienza turistica',
    tipo: 'nuova_costruzione', tipoLabel: 'Nuova costruzione',
    fabbisogniCorrelati: ['fab-cul-02'],
    capexMin: 200_000, capexMedio: 450_000, capexMax: 900_000,
    opexAnnuoMin: 25_000, opexAnnuoMedio: 50_000, opexAnnuoMax: 85_000,
    durataMin: 6, durataMedio: 12, durataMax: 18,
    parametri: [
      { nome: 'Superficie', udm: 'mq', min: 50, max: 400, default: 150, costoUnitario: 3_000 },
    ],
  },
  {
    id: 'mop-cul-rq-02',
    settore: 'Infrastrutture turistiche', sottosettore: 'Segnaletica e percorsi',
    categoriaIntervento: 'Realizzazione segnaletica turistica e percorsi tematici',
    tipo: 'riqualificazione', tipoLabel: 'Riqualificazione',
    fabbisogniCorrelati: ['fab-cul-02'],
    capexMin: 50_000, capexMedio: 140_000, capexMax: 300_000,
    opexAnnuoMin: 5_000, opexAnnuoMedio: 12_000, opexAnnuoMax: 25_000,
    durataMin: 3, durataMedio: 6, durataMax: 10,
    parametri: [
      { nome: 'Percorsi', udm: 'n°', min: 1, max: 8, default: 3, costoUnitario: 45_000 },
    ],
  },

  /* ═══════════════════════════════════════════
     POPOLAZIONE — fab-pop-01: Contrasto spopolamento
     ═══════════════════════════════════════════ */
  {
    id: 'mop-pop-vs-02',
    settore: 'Servizi sociali', sottosettore: 'Politiche abitative',
    categoriaIntervento: 'Incentivi residenziali per giovani famiglie',
    tipo: 'voucher_servizi', tipoLabel: 'Voucher / Incentivi',
    fabbisogniCorrelati: ['fab-pop-01'],
    capexMin: 100_000, capexMedio: 300_000, capexMax: 700_000,
    opexAnnuoMin: 50_000, opexAnnuoMedio: 150_000, opexAnnuoMax: 350_000,
    durataMin: 1, durataMedio: 3, durataMax: 6,
    parametri: [
      { nome: 'Famiglie beneficiarie', udm: 'famiglie', min: 10, max: 100, default: 30, costoUnitario: 10_000 },
    ],
  },
  {
    id: 'mop-pop-ri-01',
    settore: 'Infrastrutture abitative', sottosettore: 'Edilizia residenziale',
    categoriaIntervento: 'Recupero immobili comunali per housing sociale',
    tipo: 'ristrutturazione', tipoLabel: 'Ristrutturazione',
    fabbisogniCorrelati: ['fab-pop-01'],
    capexMin: 300_000, capexMedio: 650_000, capexMax: 1_400_000,
    opexAnnuoMin: 20_000, opexAnnuoMedio: 40_000, opexAnnuoMax: 70_000,
    durataMin: 10, durataMedio: 18, durataMax: 28,
    parametri: [
      { nome: 'Alloggi', udm: 'n°', min: 4, max: 30, default: 12, costoUnitario: 54_000 },
    ],
  },
  {
    id: 'mop-pop-nc-01',
    settore: 'Infrastrutture sociali', sottosettore: 'Spazi aggregativi',
    categoriaIntervento: 'Nuovo centro aggregazione giovanile',
    tipo: 'nuova_costruzione', tipoLabel: 'Nuova costruzione',
    fabbisogniCorrelati: ['fab-pop-01', 'fab-eco-01'],
    capexMin: 200_000, capexMedio: 450_000, capexMax: 850_000,
    opexAnnuoMin: 25_000, opexAnnuoMedio: 50_000, opexAnnuoMax: 80_000,
    durataMin: 8, durataMedio: 14, durataMax: 20,
    parametri: [
      { nome: 'Capienza', udm: 'posti', min: 20, max: 150, default: 60, costoUnitario: 7_500 },
    ],
  },

  /* ═══════════════════════════════════════════
     POPOLAZIONE — fab-pop-02: Servizi popolazione anziana
     ═══════════════════════════════════════════ */
  {
    id: 'mop-pop-nc-02',
    settore: 'Infrastrutture sociali', sottosettore: 'Servizi anziani',
    categoriaIntervento: 'Nuovo centro diurno per anziani',
    tipo: 'nuova_costruzione', tipoLabel: 'Nuova costruzione',
    fabbisogniCorrelati: ['fab-pop-02'],
    capexMin: 350_000, capexMedio: 700_000, capexMax: 1_300_000,
    opexAnnuoMin: 60_000, opexAnnuoMedio: 110_000, opexAnnuoMax: 180_000,
    durataMin: 10, durataMedio: 18, durataMax: 26,
    parametri: [
      { nome: 'Posti', udm: 'posti', min: 15, max: 80, default: 40, costoUnitario: 17_500 },
    ],
  },
  {
    id: 'mop-pop-ri-02',
    settore: 'Infrastrutture sociali', sottosettore: 'Servizi anziani',
    categoriaIntervento: 'Riadattamento struttura a centro servizi anziani',
    tipo: 'ristrutturazione', tipoLabel: 'Ristrutturazione',
    fabbisogniCorrelati: ['fab-pop-02'],
    capexMin: 200_000, capexMedio: 420_000, capexMax: 800_000,
    opexAnnuoMin: 35_000, opexAnnuoMedio: 70_000, opexAnnuoMax: 120_000,
    durataMin: 6, durataMedio: 12, durataMax: 20,
    parametri: [
      { nome: 'Posti', udm: 'posti', min: 10, max: 60, default: 30, costoUnitario: 14_000 },
    ],
  },

  /* ═══════════════════════════════════════════
     INTERVENTI AGGIUNTIVI
     ═══════════════════════════════════════════ */
  {
    id: 'mop-ist-vs-03',
    fabbisogniCorrelati: ['fab-ist-02'],
    tipo: 'voucher_servizi',
    tipoLabel: 'Voucher / Supporto istituti privati',
    categoriaIntervento: 'Voucher per supporto adeguamento istituti scolastici privati',
    settore: 'Servizi sociali',
    sottosettore: 'Servizi educativi',
    capexMin: 80_000, capexMedio: 200_000, capexMax: 450_000,
    opexAnnuoMin: 30_000, opexAnnuoMedio: 80_000, opexAnnuoMax: 150_000,
    durataMin: 2, durataMedio: 6, durataMax: 12,
    parametri: [
      { nome: 'Istituti beneficiari', udm: 'n°', min: 1, max: 8, default: 3, costoUnitario: 65_000 },
    ],
  },
  {
    id: 'mop-eco-ri-02',
    fabbisogniCorrelati: ['fab-eco-02'],
    tipo: 'ristrutturazione',
    tipoLabel: 'Ristrutturazione',
    categoriaIntervento: 'Riqualificazione mercato comunale per spazi commerciali',
    settore: 'Infrastrutture economiche',
    sottosettore: 'Commercio locale',
    capexMin: 300_000, capexMedio: 550_000, capexMax: 900_000,
    opexAnnuoMin: 18_000, opexAnnuoMedio: 35_000, opexAnnuoMax: 60_000,
    durataMin: 8, durataMedio: 14, durataMax: 22,
    parametri: [
      { nome: 'Postazioni commerciali', udm: 'n°', min: 5, max: 40, default: 15, costoUnitario: 36_000 },
    ],
  },
  {
    id: 'mop-eco-nc-02',
    fabbisogniCorrelati: ['fab-eco-02'],
    tipo: 'nuova_costruzione',
    tipoLabel: 'Nuova costruzione',
    categoriaIntervento: 'Nuova area mercatale e artigianato locale',
    settore: 'Infrastrutture economiche',
    sottosettore: 'Commercio locale',
    capexMin: 500_000, capexMedio: 900_000, capexMax: 1_600_000,
    opexAnnuoMin: 30_000, opexAnnuoMedio: 55_000, opexAnnuoMax: 90_000,
    durataMin: 12, durataMedio: 20, durataMax: 30,
    parametri: [
      { nome: 'Superficie', udm: 'mq', min: 300, max: 2000, default: 800, costoUnitario: 1_100 },
    ],
  },
  {
    id: 'mop-cul-vs-02',
    fabbisogniCorrelati: ['fab-cul-02'],
    tipo: 'voucher_servizi',
    tipoLabel: 'Voucher / Acquisto servizi',
    categoriaIntervento: 'Promozione eventi turistici e festival culturali',
    settore: 'Servizi culturali',
    sottosettore: 'Promozione turistica',
    capexMin: 40_000, capexMedio: 90_000, capexMax: 200_000,
    opexAnnuoMin: 30_000, opexAnnuoMedio: 60_000, opexAnnuoMax: 100_000,
    durataMin: 1, durataMedio: 3, durataMax: 6,
    parametri: [
      { nome: 'Eventi annui', udm: 'n°', min: 2, max: 20, default: 6, costoUnitario: 15_000 },
    ],
  },
  {
    id: 'mop-pop-vs-01',
    fabbisogniCorrelati: ['fab-pop-02'],
    tipo: 'voucher_servizi',
    tipoLabel: 'Voucher / Assistenza domiciliare',
    categoriaIntervento: 'Voucher assistenza domiciliare per anziani',
    settore: 'Servizi sociali',
    sottosettore: 'Assistenza anziani',
    capexMin: 40_000, capexMedio: 80_000, capexMax: 180_000,
    opexAnnuoMin: 80_000, opexAnnuoMedio: 180_000, opexAnnuoMax: 350_000,
    durataMin: 1, durataMedio: 2, durataMax: 6,
    parametri: [
      { nome: 'Anziani beneficiari', udm: 'persone', min: 10, max: 200, default: 50, costoUnitario: 3_600 },
    ],
  },
]

/* ── Helper: trova interventi per fabbisogno ── */
export function getInterventiPerFabbisogno(fabbisognoId: string): InterventoMOP[] {
  return INTERVENTI_MOP.filter(i => i.fabbisogniCorrelati.includes(fabbisognoId))
}

/* ── Helper: filtra per budget e tempo ── */
export interface FiltroVincoli {
  capexMax: number
  orizzonteTemporaleMesi: number
}

export interface InterventoFiltrato {
  intervento: InterventoMOP
  ammissibile: boolean
  motivoEsclusione?: 'budget' | 'tempo' | 'entrambi'
}

export function filtraInterventi(interventi: InterventoMOP[], vincoli: FiltroVincoli): InterventoFiltrato[] {
  return interventi.map(i => {
    const fuoriBudget = i.capexMedio > vincoli.capexMax
    const fuoriTempo = i.durataMedio > vincoli.orizzonteTemporaleMesi

    let motivoEsclusione: 'budget' | 'tempo' | 'entrambi' | undefined
    if (fuoriBudget && fuoriTempo) motivoEsclusione = 'entrambi'
    else if (fuoriBudget) motivoEsclusione = 'budget'
    else if (fuoriTempo) motivoEsclusione = 'tempo'

    return {
      intervento: i,
      ammissibile: !fuoriBudget && !fuoriTempo,
      motivoEsclusione,
    }
  })
}

/* ── Helper: stima costo da parametri dimensionali ── */
export function stimaCosto(intervento: InterventoMOP, valoriParametri: Record<string, number>): number {
  let fattoreScala = 0
  let nParametri = 0
  for (const p of intervento.parametri) {
    const valore = valoriParametri[p.nome] ?? p.default
    fattoreScala += valore / p.default
    nParametri++
  }
  if (nParametri > 0) fattoreScala /= nParametri
  else fattoreScala = 1
  return Math.round(intervento.capexMedio * fattoreScala)
}