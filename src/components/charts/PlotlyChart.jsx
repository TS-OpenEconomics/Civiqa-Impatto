import { useEffect, useRef } from "react";
import { useResizeObserver } from "../../hooks/useResizeObserver";

// plotly.js-dist-min è importato staticamente perché questo modulo
// viene caricato solo da EiaResults (che è lazy-loaded nel router)
import Plotly from "plotly.js-dist-min";

const BASE_LAYOUT = {
  paper_bgcolor: "white",
  plot_bgcolor:  "white",
  font: { family: "Inter, ui-sans-serif, sans-serif", size: 11, color: "#27272A" },
  margin: { t: 20, r: 10, b: 50, l: 60 },
  legend: { orientation: "h", x: 0, y: -0.2 },
  colorway: ["#7C3AED", "#A78BFA", "#DDD6FE", "#84CC16", "#4ADE80"],
};

const BASE_CONFIG = {
  responsive: true,
  displayModeBar: false,
  locale: "it",
};

export function PlotlyChart({ data, layout = {}, config = {}, style }) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    Plotly.react(
      element,
      data,
      { ...BASE_LAYOUT, ...layout },
      { ...BASE_CONFIG, ...config },
    );
  }, [data, layout, config]);

  useEffect(() => {
    const element = ref.current;
    return () => {
      if (element) Plotly.purge(element);
    };
  }, []);

  useResizeObserver(ref, () => {
    if (ref.current) {
      Plotly.Plots.resize(ref.current);
    }
  });

  return <div ref={ref} style={{ width: "100%", minHeight: 280, ...style }} />;
}
