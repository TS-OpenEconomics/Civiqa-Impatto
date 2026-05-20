import { useEffect, useRef, useState } from "react";
import Plotly from "plotly.js-dist-min";

const REGION_TO_NUTS = {
  "Piemonte":["ITC1"],"Valle d'Aosta":["ITC2"],"Liguria":["ITC3"],"Lombardia":["ITC4"],
  "Trentino-Alto Adige":["ITH1","ITH2"],"Veneto":["ITH3"],"Friuli-Venezia Giulia":["ITH4"],
  "Emilia-Romagna":["ITH5"],"Toscana":["ITI1"],"Umbria":["ITI2"],"Marche":["ITI3"],
  "Lazio":["ITI4"],"Abruzzo":["ITF1"],"Molise":["ITF2"],"Campania":["ITF3"],
  "Puglia":["ITF4"],"Basilicata":["ITF5"],"Calabria":["ITF6"],"Sicilia":["ITG1"],"Sardegna":["ITG2"],
};

const NUTS_TO_REGION = {};
Object.entries(REGION_TO_NUTS).forEach(([reg, ids]) => ids.forEach(id => { NUTS_TO_REGION[id] = reg; }));

let cachedGeojson = null;

export function ItalyMap({ data, tone = "violet", onRegionClick, selectedRegion, minHeight = 280, className = "" }) {
  const ref = useRef(null);
  const [geojson, setGeojson] = useState(cachedGeojson);

  useEffect(() => {
    if (cachedGeojson) return;
    fetch("/nuts2_italy.geojson").then(r => r.json()).then(gj => { cachedGeojson = gj; setGeojson(gj); });
  }, []);

  useEffect(() => {
    if (!ref.current || !geojson) return;

    const locations = [], z = [], text = [];
    data.forEach(item => {
      const ids = REGION_TO_NUTS[item.regione];
      if (!ids) return;
      ids.forEach(id => { locations.push(id); z.push(item.intensita ?? 0); text.push(item.hoverText ?? item.regione); });
    });
    geojson.features.forEach(f => {
      const id = f.properties.NUTS_ID;
      if (!locations.includes(id)) { locations.push(id); z.push(0); text.push(f.properties.NUTS_NAME); }
    });

    const colorscale = tone === "violet"
      ? [[0,"#F3EEFE"],[0.5,"#7C3AED"],[1,"#2E0B86"]]
      : [[0,"#E8F4F2"],[0.5,"#2DD4BF"],[1,"#0F766E"]];

    const traces = [{
      type:"choropleth", geojson, featureidkey:"properties.NUTS_ID",
      locations, z, text, colorscale, zmin:0, zmax:1, showscale:false,
      hovertemplate:"<b>%{text}</b><extra></extra>",
      marker:{ line:{ color:"white", width:1.5 } },
    }];

    if (selectedRegion) {
      const selIds = REGION_TO_NUTS[selectedRegion] ?? [];
      traces.push({
        type:"choropleth", geojson, featureidkey:"properties.NUTS_ID",
        locations:selIds, z:selIds.map(()=>0.5),
        colorscale:[[0,"rgba(0,0,0,0)"],[1,"rgba(0,0,0,0)"]],
        showscale:false, hoverinfo:"skip",
        marker:{ line:{ color:"#F59E0B", width:3 } },
      });
    }

    Plotly.react(ref.current, traces, {
      geo:{ fitbounds:"geojson", visible:false, projection:{type:"mercator"}, bgcolor:"white" },
      paper_bgcolor:"white", plot_bgcolor:"white",
      margin:{ t:0, b:0, l:0, r:0 },
    }, { responsive:true, displayModeBar:false });

    if (onRegionClick) {
      ref.current.on("plotly_click", evtData => {
        const loc = evtData.points?.[0]?.location;
        if (loc) {
          const reg = NUTS_TO_REGION[loc];
          if (reg) onRegionClick(reg);
        }
      });
    }

    return () => { if (ref.current) Plotly.purge(ref.current); };
  }, [geojson, data, tone, onRegionClick, selectedRegion]);

  if (!geojson) return (
    <div className="flex items-center justify-center" style={{ minHeight }}>
      <div className="w-8 h-8 rounded-full border-4 border-ink-200 border-t-brand-violet animate-spin" />
    </div>
  );
  return <div ref={ref} className={className} style={{ width:"100%", minHeight }} />;
}
