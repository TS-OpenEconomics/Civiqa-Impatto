import { useEffect, useRef, useState } from "react";
import Plotly from "plotly.js-dist-min";
import { useTheme } from "../../hooks/useTheme";
import { DARK_HOVERLABEL } from "./hoverlabel";

let cachedNuts3 = null;

function norm(s) {
  return s.toLowerCase().replace(/[´`''']/g,"'").replace(/\s+/g," ").trim();
}

export function ProvinceMap({ nuts2Code, data, minHeight = 220, className = "" }) {
  const ref = useRef(null);
  const [geojson, setGeojson] = useState(cachedNuts3);
  const theme = useTheme();

  useEffect(() => {
    if (cachedNuts3) return;
    fetch(`${import.meta.env.BASE_URL}nuts3_italy.geojson`).then(r => r.json()).then(gj => { cachedNuts3 = gj; setGeojson(gj); });
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element || !geojson) return;

    const prefixes = nuts2Code === "ITH1" ? ["ITH1","ITH2"] : nuts2Code ? [nuts2Code] : null;
    const features = prefixes
      ? geojson.features.filter(f => prefixes.some(p => f.properties.NUTS_ID.startsWith(p)))
      : geojson.features;
    if (!features.length) return;

    const filteredGj = { type:"FeatureCollection", features };
    const locations = [], z = [], text = [];

    features.forEach(f => {
      const nutsName = f.properties.NUTS_NAME;
      const match = data.find(d => norm(d.provincia) === norm(nutsName));
      locations.push(f.properties.NUTS_ID);
      z.push(match ? match.intensita : 0.05);
      text.push(nutsName);
    });

    Plotly.react(element, [{
      type:"choropleth", geojson:filteredGj, featureidkey:"properties.NUTS_ID",
      locations, z, text,
      colorscale:[[0,"#F3EEFE"],[0.5,"#7C3AED"],[1,"#2E0B86"]],
      zmin:0, zmax:1, showscale:false,
      hovertemplate:"<b>%{text}</b><extra></extra>",
      marker:{ line:{ color: theme === "dark" ? "#161618" : "white", width:1 } },
    }], {
      geo:{ fitbounds:"geojson", visible:false, projection:{type:"mercator"}, bgcolor:"rgba(0,0,0,0)" },
      paper_bgcolor:"rgba(0,0,0,0)", plot_bgcolor:"rgba(0,0,0,0)",
      margin:{ t:0, b:0, l:0, r:0 },
      hoverlabel: DARK_HOVERLABEL,
    }, { responsive:true, displayModeBar:false });

    return () => { if (element) Plotly.purge(element); };
  }, [geojson, nuts2Code, data, theme]);

  if (!geojson) return (
    <div className="flex items-center justify-center" style={{ minHeight }}>
      <div className="w-6 h-6 rounded-full border-4 border-ink-200 border-t-brand-violet animate-spin" />
    </div>
  );
  return <div ref={ref} className={className} style={{ width:"100%", minHeight }} />;
}
