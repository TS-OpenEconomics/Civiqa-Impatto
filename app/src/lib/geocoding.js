const GEOCODING_TABLE = [
  { terms: ["palermo", " pa "],          lat: 38.1157, lon: 13.3615, nuts_code: "ITG12", nuts_label: "Palermo" },
  { terms: ["roma", "rome", " rm "],     lat: 41.9028, lon: 12.4964, nuts_code: "ITI43", nuts_label: "Roma" },
  { terms: ["milano", "milan", " mi "],  lat: 45.4642, lon:  9.1900, nuts_code: "ITC4C", nuts_label: "Milano" },
  { terms: ["napoli", "naples", " na "], lat: 40.8518, lon: 14.2681, nuts_code: "ITF33", nuts_label: "Napoli" },
  { terms: ["torino", "turin", " to "],  lat: 45.0703, lon:  7.6869, nuts_code: "ITC11", nuts_label: "Torino" },
  { terms: ["bologna", " bo "],          lat: 44.4949, lon: 11.3426, nuts_code: "ITH55", nuts_label: "Bologna" },
  { terms: ["firenze", "florence", " fi "], lat: 43.7696, lon: 11.2558, nuts_code: "ITI14", nuts_label: "Firenze" },
  { terms: ["genova", "genoa", " ge "],  lat: 44.4056, lon:  8.9463, nuts_code: "ITC33", nuts_label: "Genova" },
  { terms: ["bari", " ba "],             lat: 41.1171, lon: 16.8719, nuts_code: "ITF47", nuts_label: "Bari" },
  { terms: ["catania", " ct "],          lat: 37.5079, lon: 15.0830, nuts_code: "ITG17", nuts_label: "Catania" },
  { terms: ["venezia", "venice", " ve "], lat: 45.4408, lon: 12.3155, nuts_code: "ITH35", nuts_label: "Venezia" },
  { terms: ["verona", " vr "],           lat: 45.4384, lon: 10.9916, nuts_code: "ITH31", nuts_label: "Verona" },
  { terms: ["messina", " me "],          lat: 38.1938, lon: 15.5540, nuts_code: "ITG13", nuts_label: "Messina" },
  { terms: ["padova", "padua", " pd "],  lat: 45.4064, lon: 11.8768, nuts_code: "ITH36", nuts_label: "Padova" },
  { terms: ["trieste", " ts "],          lat: 45.6495, lon: 13.7768, nuts_code: "ITH44", nuts_label: "Trieste" },
  { terms: ["bergamo", " bg "],          lat: 45.6983, lon:  9.6773, nuts_code: "ITC46", nuts_label: "Bergamo" },
  { terms: ["brescia", " bs "],          lat: 45.5416, lon: 10.2118, nuts_code: "ITC47", nuts_label: "Brescia" },
  { terms: ["trento", "trentino", " tn "], lat: 46.0748, lon: 11.1217, nuts_code: "ITH20", nuts_label: "Trento" },
  { terms: ["ancona", " an "],           lat: 43.6158, lon: 13.5189, nuts_code: "ITI31", nuts_label: "Ancona" },
  { terms: ["lecce", " le "],            lat: 40.3516, lon: 18.1751, nuts_code: "ITF44", nuts_label: "Lecce" },
  { terms: ["cagliari", " ca "],         lat: 39.2238, lon:  9.1217, nuts_code: "ITG25", nuts_label: "Cagliari" },
  { terms: ["salerno", " sa "],          lat: 40.6824, lon: 14.7681, nuts_code: "ITF35", nuts_label: "Salerno" },
  { terms: ["perugia", " pg "],          lat: 43.1107, lon: 12.3908, nuts_code: "ITI21", nuts_label: "Perugia" },
  { terms: ["ravenna", " ra "],          lat: 44.4185, lon: 12.1977, nuts_code: "ITH57", nuts_label: "Ravenna" },
  { terms: ["ferrara", " fe "],          lat: 44.8381, lon: 11.6197, nuts_code: "ITH53", nuts_label: "Ferrara" },
  { terms: ["taranto", " ta "],          lat: 40.4668, lon: 17.2479, nuts_code: "ITF43", nuts_label: "Taranto" },
  { terms: ["foggia", " fg "],           lat: 41.4621, lon: 15.5444, nuts_code: "ITF41", nuts_label: "Foggia" },
  { terms: ["reggio calabria", " rc "],  lat: 38.1113, lon: 15.6476, nuts_code: "ITF65", nuts_label: "Reggio Calabria" },
  { terms: ["modena", " mo "],           lat: 44.6471, lon: 10.9252, nuts_code: "ITH52", nuts_label: "Modena" },
  { terms: ["livorno", " li "],          lat: 43.5485, lon: 10.3106, nuts_code: "ITI16", nuts_label: "Livorno" },
  { terms: ["pisa", " pi "],             lat: 43.7228, lon: 10.4017, nuts_code: "ITI15", nuts_label: "Pisa" },
  { terms: ["siena", " si "],            lat: 43.3188, lon: 11.3307, nuts_code: "ITI19", nuts_label: "Siena" },
  { terms: ["pescara", " pe "],          lat: 42.4612, lon: 14.2159, nuts_code: "ITF13", nuts_label: "Pescara" },
  { terms: ["l'aquila", "aquila", " aq "], lat: 42.3511, lon: 13.3987, nuts_code: "ITF11", nuts_label: "L'Aquila" },
  { terms: ["potenza", " pz "],          lat: 40.6420, lon: 15.7990, nuts_code: "ITF51", nuts_label: "Potenza" },
  { terms: ["cosenza", " cs "],          lat: 39.3088, lon: 16.2514, nuts_code: "ITF61", nuts_label: "Cosenza" },
  { terms: ["catanzaro", " cz "],        lat: 38.9098, lon: 16.5874, nuts_code: "ITF63", nuts_label: "Catanzaro" },
  { terms: ["sassari", " ss "],          lat: 40.7259, lon:  8.5557, nuts_code: "ITG27", nuts_label: "Sassari" },
  { terms: ["nuoro", " nu "],            lat: 40.3217, lon:  9.3268, nuts_code: "ITG26", nuts_label: "Nuoro" },
  { terms: ["udine", " ud "],            lat: 46.0636, lon: 13.2350, nuts_code: "ITH43", nuts_label: "Udine" },
  { terms: ["pordenone", " pn "],        lat: 45.9565, lon: 12.6615, nuts_code: "ITH41", nuts_label: "Pordenone" },
];

export function geocodeAddress(address) {
  if (!address || address.trim().length < 3) return null;
  const norm = (" " + address.toLowerCase() + " ")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
  for (const entry of GEOCODING_TABLE) {
    if (entry.terms.some((t) => norm.includes(t))) {
      return { lat: entry.lat, lon: entry.lon, nuts_code: entry.nuts_code, nuts_label: entry.nuts_label };
    }
  }
  return null;
}

export function findNearest(lat, lon) {
  let best = GEOCODING_TABLE[0];
  let bestDist = Infinity;
  for (const entry of GEOCODING_TABLE) {
    const d = Math.hypot(lat - entry.lat, lon - entry.lon);
    if (d < bestDist) { bestDist = d; best = entry; }
  }
  return { nuts_code: best.nuts_code, nuts_label: best.nuts_label };
}
