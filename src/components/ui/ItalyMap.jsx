// Mappa Italia stilizzata: SVG inline con path approssimativi delle regioni.
// Per la POC è sufficiente, in produzione si userebbe topojson + d3-geo.

const REGIONI = [
  { id: "valdaosta", nome: "Valle d'Aosta", d: "M 80 60 L 95 55 L 100 70 L 88 75 Z" },
  { id: "piemonte", nome: "Piemonte", d: "M 95 55 L 140 50 L 145 90 L 100 95 Z" },
  { id: "liguria", nome: "Liguria", d: "M 100 95 L 145 90 L 165 110 L 110 115 Z" },
  { id: "lombardia", nome: "Lombardia", d: "M 140 50 L 195 45 L 200 85 L 145 90 Z" },
  { id: "trentino", nome: "Trentino-Alto Adige", d: "M 195 45 L 245 40 L 250 75 L 200 80 Z" },
  { id: "veneto", nome: "Veneto", d: "M 200 80 L 250 75 L 270 110 L 215 115 Z" },
  { id: "friuli", nome: "Friuli-Venezia Giulia", d: "M 250 75 L 290 70 L 300 95 L 270 110 Z" },
  { id: "emilia", nome: "Emilia-Romagna", d: "M 145 90 L 215 115 L 220 135 L 155 140 Z" },
  { id: "toscana", nome: "Toscana", d: "M 155 140 L 220 135 L 220 175 L 165 180 Z" },
  { id: "marche", nome: "Marche", d: "M 220 135 L 250 140 L 250 175 L 220 175 Z" },
  { id: "umbria", nome: "Umbria", d: "M 200 165 L 230 160 L 230 195 L 200 200 Z" },
  { id: "lazio", nome: "Lazio", d: "M 180 195 L 230 195 L 235 240 L 185 245 Z" },
  { id: "abruzzo", nome: "Abruzzo", d: "M 230 195 L 265 195 L 270 230 L 235 235 Z" },
  { id: "molise", nome: "Molise", d: "M 265 220 L 285 215 L 290 240 L 270 245 Z" },
  { id: "campania", nome: "Campania", d: "M 235 240 L 285 240 L 290 285 L 240 290 Z" },
  { id: "puglia", nome: "Puglia", d: "M 285 240 L 340 250 L 360 305 L 295 300 Z" },
  { id: "basilicata", nome: "Basilicata", d: "M 285 285 L 325 295 L 335 325 L 290 320 Z" },
  { id: "calabria", nome: "Calabria", d: "M 290 320 L 325 325 L 330 380 L 305 385 Z" },
  { id: "sicilia", nome: "Sicilia", d: "M 230 410 L 305 405 L 315 440 L 240 445 Z" },
  { id: "sardegna", nome: "Sardegna", d: "M 90 270 L 130 260 L 140 340 L 100 350 Z" },
];

function colorFromIntensity(t, tone = "violet") {
  // t in [0, 1]
  if (tone === "violet") {
    // da #F3EEFE (chiaro) a #2E0B86 (scuro)
    const r = Math.round(243 - (243 - 46) * t);
    const g = Math.round(238 - (238 - 11) * t);
    const b = Math.round(254 - (254 - 134) * t);
    return `rgb(${r},${g},${b})`;
  }
  // tone teal/verde
  const r = Math.round(232 - (232 - 16) * t);
  const g = Math.round(244 - (244 - 80) * t);
  const b = Math.round(242 - (242 - 95) * t);
  return `rgb(${r},${g},${b})`;
}

function findIntensita(regioneId, dati) {
  const match = dati.find((d) =>
    d.regione.toLowerCase().includes(regioneId.toLowerCase()) ||
    regioneId.toLowerCase().includes(d.regione.toLowerCase().split("-")[0].split(" ")[0].toLowerCase())
  );
  return match ? match.intensita : 0.1;
}

export function ItalyMap({ data, tone = "violet" }) {
  return (
    <div className="w-full">
      <svg viewBox="0 0 450 460" className="w-full h-auto">
        {/* Background con pattern dot */}
        <defs>
          <pattern id="dotmap" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="0.5" fill="#A3A3AA" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="450" height="460" fill="url(#dotmap)" />

        {REGIONI.map((r) => {
          const intensita = findIntensita(r.id, data);
          return (
            <path
              key={r.id}
              d={r.d}
              fill={colorFromIntensity(intensita, tone)}
              stroke="#FFFFFF"
              strokeWidth="1"
            >
              <title>{r.nome}</title>
            </path>
          );
        })}
      </svg>

      {/* Legenda */}
      <div className="mt-3 flex items-center gap-2 text-xs justify-center">
        <span className="text-ink-500">0</span>
        <div className="w-40 h-3 flex">
          {[0, 0.2, 0.4, 0.6, 0.8, 1].map((t) => (
            <div
              key={t}
              className="flex-1 h-full"
              style={{ background: colorFromIntensity(t, tone) }}
            />
          ))}
        </div>
        <span className="text-ink-500 font-mono">999.9</span>
      </div>
    </div>
  );
}
