import { useEffect, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { ENTE } from '../../../data/mockDataRoom'
import { useWizard } from '../../../hooks/useWizard'
import { InputField } from '../../ui/InputField'
import { SelectField } from '../../ui/SelectField'

type ZonaSismica = 1 | 2 | 3 | 4

interface ComuneRecord {
  comune: string
  provincia: string
  regione: string
  popolazione: number
  zonaSismica: ZonaSismica
  areaInternaSnai?: boolean
}

const REGIONE_TO_AREA_CER: Record<string, 'Nord' | 'Centro' | 'Sud e Isole'> = {
  Abruzzo: 'Centro',
  Basilicata: 'Sud e Isole',
  Calabria: 'Sud e Isole',
  Campania: 'Sud e Isole',
  'Emilia-Romagna': 'Nord',
  'Friuli-Venezia Giulia': 'Nord',
  Lazio: 'Centro',
  Liguria: 'Nord',
  Lombardia: 'Nord',
  Marche: 'Centro',
  Molise: 'Sud e Isole',
  Piemonte: 'Nord',
  Puglia: 'Sud e Isole',
  Sardegna: 'Sud e Isole',
  Sicilia: 'Sud e Isole',
  Toscana: 'Centro',
  'Trentino-Alto Adige': 'Nord',
  Umbria: 'Centro',
  "Valle d'Aosta": 'Nord',
  Veneto: 'Nord',
}

const COMUNI_ITALIANI: ComuneRecord[] = [
  { comune: 'Roma', provincia: 'Roma', regione: 'Lazio', popolazione: 2748109, zonaSismica: 3 },
  { comune: 'Milano', provincia: 'Milano', regione: 'Lombardia', popolazione: 1366180, zonaSismica: 3 },
  { comune: 'Napoli', provincia: 'Napoli', regione: 'Campania', popolazione: 908175, zonaSismica: 2 },
  { comune: 'Torino', provincia: 'Torino', regione: 'Piemonte', popolazione: 848885, zonaSismica: 4 },
  { comune: 'Palermo', provincia: 'Palermo', regione: 'Sicilia', popolazione: 630167, zonaSismica: 2 },
  { comune: 'Genova', provincia: 'Genova', regione: 'Liguria', popolazione: 558745, zonaSismica: 3 },
  { comune: 'Bologna', provincia: 'Bologna', regione: 'Emilia-Romagna', popolazione: 390636, zonaSismica: 3 },
  { comune: 'Firenze', provincia: 'Firenze', regione: 'Toscana', popolazione: 360930, zonaSismica: 3 },
  { comune: 'Bari', provincia: 'Bari', regione: 'Puglia', popolazione: 315041, zonaSismica: 3 },
  { comune: 'Catania', provincia: 'Catania', regione: 'Sicilia', popolazione: 298106, zonaSismica: 2 },
  { comune: 'Venezia', provincia: 'Venezia', regione: 'Veneto', popolazione: 249466, zonaSismica: 4 },
  { comune: 'Verona', provincia: 'Verona', regione: 'Veneto', popolazione: 255499, zonaSismica: 3 },
  { comune: 'Messina', provincia: 'Messina', regione: 'Sicilia', popolazione: 218303, zonaSismica: 1 },
  { comune: 'Padova', provincia: 'Padova', regione: 'Veneto', popolazione: 206496, zonaSismica: 4 },
  { comune: 'Trieste', provincia: 'Trieste', regione: 'Friuli-Venezia Giulia', popolazione: 201510, zonaSismica: 3 },
  { comune: 'Brescia', provincia: 'Brescia', regione: 'Lombardia', popolazione: 194990, zonaSismica: 3 },
  { comune: 'Taranto', provincia: 'Taranto', regione: 'Puglia', popolazione: 185799, zonaSismica: 3 },
  { comune: 'Prato', provincia: 'Prato', regione: 'Toscana', popolazione: 193809, zonaSismica: 3 },
  { comune: 'Parma', provincia: 'Parma', regione: 'Emilia-Romagna', popolazione: 195998, zonaSismica: 3 },
  { comune: 'Reggio Calabria', provincia: 'Reggio Calabria', regione: 'Calabria', popolazione: 171213, zonaSismica: 1 },
  { comune: 'Modena', provincia: 'Modena', regione: 'Emilia-Romagna', popolazione: 184153, zonaSismica: 3 },
  { comune: 'Reggio Emilia', provincia: 'Reggio Emilia', regione: 'Emilia-Romagna', popolazione: 171345, zonaSismica: 3 },
  { comune: 'Perugia', provincia: 'Perugia', regione: 'Umbria', popolazione: 161748, zonaSismica: 2 },
  { comune: 'Ravenna', provincia: 'Ravenna', regione: 'Emilia-Romagna', popolazione: 156057, zonaSismica: 3 },
  { comune: 'Livorno', provincia: 'Livorno', regione: 'Toscana', popolazione: 154947, zonaSismica: 3 },
  { comune: 'Cagliari', provincia: 'Cagliari', regione: 'Sardegna', popolazione: 147964, zonaSismica: 4 },
  { comune: 'Foggia', provincia: 'Foggia', regione: 'Puglia', popolazione: 146279, zonaSismica: 2 },
  { comune: 'Rimini', provincia: 'Rimini', regione: 'Emilia-Romagna', popolazione: 150951, zonaSismica: 2 },
  { comune: 'Salerno', provincia: 'Salerno', regione: 'Campania', popolazione: 127070, zonaSismica: 2 },
  { comune: 'Ferrara', provincia: 'Ferrara', regione: 'Emilia-Romagna', popolazione: 130350, zonaSismica: 3 },
  { comune: 'Sassari', provincia: 'Sassari', regione: 'Sardegna', popolazione: 121374, zonaSismica: 4 },
  { comune: 'Latina', provincia: 'Latina', regione: 'Lazio', popolazione: 126470, zonaSismica: 3 },
  { comune: 'Giugliano in Campania', provincia: 'Napoli', regione: 'Campania', popolazione: 123569, zonaSismica: 2 },
  { comune: 'Monza', provincia: 'Monza e Brianza', regione: 'Lombardia', popolazione: 122926, zonaSismica: 3 },
  { comune: 'Siracusa', provincia: 'Siracusa', regione: 'Sicilia', popolazione: 116447, zonaSismica: 2 },
  { comune: 'Pescara', provincia: 'Pescara', regione: 'Abruzzo', popolazione: 118657, zonaSismica: 3 },
  { comune: 'Bergamo', provincia: 'Bergamo', regione: 'Lombardia', popolazione: 119434, zonaSismica: 3 },
  { comune: 'Forli', provincia: 'Forli-Cesena', regione: 'Emilia-Romagna', popolazione: 117228, zonaSismica: 2 },
  { comune: 'Trento', provincia: 'Trento', regione: 'Trentino-Alto Adige', popolazione: 119011, zonaSismica: 3 },
  { comune: 'Vicenza', provincia: 'Vicenza', regione: 'Veneto', popolazione: 111500, zonaSismica: 3 },
  { comune: 'Terni', provincia: 'Terni', regione: 'Umbria', popolazione: 107060, zonaSismica: 2 },
  { comune: 'Bolzano', provincia: 'Bolzano', regione: 'Trentino-Alto Adige', popolazione: 107436, zonaSismica: 4 },
  { comune: 'Novara', provincia: 'Novara', regione: 'Piemonte', popolazione: 104306, zonaSismica: 4 },
  { comune: 'Piacenza', provincia: 'Piacenza', regione: 'Emilia-Romagna', popolazione: 102499, zonaSismica: 3 },
  { comune: 'Ancona', provincia: 'Ancona', regione: 'Marche', popolazione: 99766, zonaSismica: 2 },
  { comune: 'Andria', provincia: 'Barletta-Andria-Trani', regione: 'Puglia', popolazione: 97921, zonaSismica: 2 },
  { comune: 'Arezzo', provincia: 'Arezzo', regione: 'Toscana', popolazione: 97389, zonaSismica: 2 },
  { comune: 'Udine', provincia: 'Udine', regione: 'Friuli-Venezia Giulia', popolazione: 100170, zonaSismica: 2 },
  { comune: 'Lecce', provincia: 'Lecce', regione: 'Puglia', popolazione: 94989, zonaSismica: 4 },
  { comune: 'Cesena', provincia: 'Forli-Cesena', regione: 'Emilia-Romagna', popolazione: 96278, zonaSismica: 2 },
  { comune: 'Pesaro', provincia: 'Pesaro e Urbino', regione: 'Marche', popolazione: 94773, zonaSismica: 2 },
  { comune: 'Barletta', provincia: 'Barletta-Andria-Trani', regione: 'Puglia', popolazione: 92269, zonaSismica: 3 },
  { comune: 'La Spezia', provincia: 'La Spezia', regione: 'Liguria', popolazione: 91624, zonaSismica: 3 },
  { comune: 'Alessandria', provincia: 'Alessandria', regione: 'Piemonte', popolazione: 91206, zonaSismica: 4 },
  { comune: 'Pistoia', provincia: 'Pistoia', regione: 'Toscana', popolazione: 90543, zonaSismica: 3 },
  { comune: 'Pisa', provincia: 'Pisa', regione: 'Toscana', popolazione: 90445, zonaSismica: 3 },
  { comune: 'Lucca', provincia: 'Lucca', regione: 'Toscana', popolazione: 89309, zonaSismica: 3 },
  { comune: 'Catanzaro', provincia: 'Catanzaro', regione: 'Calabria', popolazione: 85688, zonaSismica: 1 },
  { comune: "L'Aquila", provincia: "L'Aquila", regione: 'Abruzzo', popolazione: 69620, zonaSismica: 1, areaInternaSnai: true },
  { comune: 'Potenza', provincia: 'Potenza', regione: 'Basilicata', popolazione: 66861, zonaSismica: 2, areaInternaSnai: true },
  { comune: 'Matera', provincia: 'Matera', regione: 'Basilicata', popolazione: 59398, zonaSismica: 2 },
  { comune: 'Aosta', provincia: 'Aosta', regione: "Valle d'Aosta", popolazione: 33561, zonaSismica: 4 },
  { comune: 'Campobasso', provincia: 'Campobasso', regione: 'Molise', popolazione: 46747, zonaSismica: 2, areaInternaSnai: true },
  { comune: 'Vibo Valentia', provincia: 'Vibo Valentia', regione: 'Calabria', popolazione: 31785, zonaSismica: 1, areaInternaSnai: true },
  { comune: 'Tivoli', provincia: 'Roma', regione: 'Lazio', popolazione: 55000, zonaSismica: 2 },
  { comune: 'Colleferro', provincia: 'Roma', regione: 'Lazio', popolazione: 22000, zonaSismica: 2 },
]

const REGIONI = Object.keys(REGIONE_TO_AREA_CER).sort((a, b) => a.localeCompare(b, 'it-IT'))

const CLASSIFICAZIONE_OPTIONS = [
  'Area metropolitana',
  'Area urbana media',
  'Area urbana piccola',
  'Area rurale/montana',
  'Area interna SNAI',
]

const ZONA_SISMICA_OPTIONS = [
  { value: '1', label: 'Zona 1 — alta pericolosità' },
  { value: '2', label: 'Zona 2 — medio-alta pericolosità' },
  { value: '3', label: 'Zona 3 — medio-bassa pericolosità' },
  { value: '4', label: 'Zona 4 — bassa pericolosità' },
]

const AREA_CER_OPTIONS = ['Nord', 'Centro', 'Sud e Isole']

function normalizeText(value: string): string {
  return value
    .toLocaleLowerCase('it-IT')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
}

function classifyArea(popolazione: number, areaInternaSnai: boolean): string {
  if (areaInternaSnai) return 'Area interna SNAI'
  if (popolazione > 250000) return 'Area metropolitana'
  if (popolazione >= 50000) return 'Area urbana media'
  if (popolazione >= 15000) return 'Area urbana piccola'
  return 'Area rurale/montana'
}

function findComuneByName(comune: string): ComuneRecord | undefined {
  const normalized = normalizeText(comune)
  return COMUNI_ITALIANI.find((item) => normalizeText(item.comune) === normalized)
}

export function Step4_1_Localizzazione() {
  const { state, setLocalizzazione } = useWizard()
  const { localizzazione } = state

  const enteComune = useMemo(() => ENTE.nome.replace(/^Comune di\s+/i, '').trim(), [])

  const comune = localizzazione.comune.trim() || enteComune
  const provincia = localizzazione.provincia.trim() || ENTE.provincia
  const regione = localizzazione.regione.trim() || ENTE.regione

  const comuneData = useMemo(
    () => findComuneByName(comune) ?? findComuneByName(enteComune),
    [comune, enteComune],
  )
  const popolazioneComune = comuneData?.popolazione ?? ENTE.popolazione

  const derivedZonaSismica = String(comuneData?.zonaSismica ?? '2')
  const derivedClassificazioneArea = classifyArea(
    popolazioneComune,
    Boolean(comuneData?.areaInternaSnai),
  )
  const derivedAreaCer = REGIONE_TO_AREA_CER[regione] ?? 'Centro'

  const zonaSismica = localizzazione.zonaSismica || derivedZonaSismica
  const classificazioneArea = localizzazione.classificazioneArea || derivedClassificazioneArea
  const areaGeograficaCer = localizzazione.areaGeograficaCer || derivedAreaCer

  // Province filtered by current region
  const provinceDiRegione = useMemo(() => {
    const provinceSet = new Set(
      COMUNI_ITALIANI.filter((c) => c.regione === regione).map((c) => c.provincia),
    )
    return [...provinceSet].sort((a, b) => a.localeCompare(b, 'it-IT'))
  }, [regione])

  // Sync derived values to store on first load
  useEffect(() => {
    type LocalPatch = Parameters<typeof setLocalizzazione>[0]
    const patch: LocalPatch = {}
    if (!localizzazione.comune) patch.comune = comune
    if (!localizzazione.provincia) patch.provincia = provincia
    if (!localizzazione.regione) patch.regione = regione
    if (!localizzazione.zonaSismica) patch.zonaSismica = derivedZonaSismica
    if (!localizzazione.classificazioneArea) patch.classificazioneArea = derivedClassificazioneArea
    if (!localizzazione.areaGeograficaCer) patch.areaGeograficaCer = derivedAreaCer
    if (Object.keys(patch).length > 0) setLocalizzazione(patch)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleRegioneChange = (value: string) => {
    const newAreaCer = REGIONE_TO_AREA_CER[value] ?? 'Centro'
    setLocalizzazione({
      regione: value,
      provincia: '',
      areaGeograficaCer: newAreaCer,
    })
  }

  const handleComuneChange = (value: string) => {
    const found = findComuneByName(value)
    if (found) {
      setLocalizzazione({
        comune: found.comune,
        provincia: found.provincia,
        regione: found.regione,
        zonaSismica: String(found.zonaSismica),
        classificazioneArea: classifyArea(found.popolazione, Boolean(found.areaInternaSnai)),
        areaGeograficaCer: REGIONE_TO_AREA_CER[found.regione] ?? 'Centro',
      })
    } else {
      setLocalizzazione({ comune: value })
    }
  }

  const regioniOptions = REGIONI.map((r) => ({ value: r, label: r }))
  const provinceOptions = (provinceDiRegione.length > 0 ? provinceDiRegione : [provincia])
    .map((p) => ({ value: p, label: p }))
  const classificazioneOptions = CLASSIFICAZIONE_OPTIONS.map((o) => ({ value: o, label: o }))
  const areaCerOptions = AREA_CER_OPTIONS.map((o) => ({ value: o, label: o }))

  return (
    <div style={rootStyle}>
      {/* Row: Regione / Provincia / Comune */}
      <div style={gridStyle}>
        <SelectField
          label="Regione"
          value={regione}
          onChange={handleRegioneChange}
          options={regioniOptions}
        />
        <SelectField
          label="Provincia"
          value={provincia}
          onChange={(value) => setLocalizzazione({ provincia: value })}
          options={provinceOptions}
        />
        <InputField
          label="Comune"
          value={comune}
          onChange={handleComuneChange}
        />
      </div>

      {/* Row: Classificazione area / Zona sismica / Area geografica CER */}
      <div style={gridStyle}>
        <SelectField
          label="Classificazione area"
          value={classificazioneArea}
          onChange={(value) => setLocalizzazione({ classificazioneArea: value })}
          options={classificazioneOptions}
        />
        <SelectField
          label="Zona sismica"
          value={zonaSismica}
          onChange={(value) => setLocalizzazione({ zonaSismica: value })}
          options={ZONA_SISMICA_OPTIONS}
        />
        <SelectField
          label="Area geografica CER"
          value={areaGeograficaCer}
          onChange={(value) => setLocalizzazione({ areaGeograficaCer: value })}
          options={areaCerOptions}
        />
      </div>
    </div>
  )
}

const rootStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-stack-m)',
}

const gridStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--spacing-inline-s)',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
}
