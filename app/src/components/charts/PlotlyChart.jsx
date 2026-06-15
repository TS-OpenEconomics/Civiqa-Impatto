import { useEffect, useRef } from "react";
import { useResizeObserver } from "../../hooks/useResizeObserver";
import { useTheme } from "../../hooks/useTheme";

// plotly.js-dist-min è importato staticamente perché questo modulo
// viene caricato solo da EiaResults (che è lazy-loaded nel router)
import Plotly from "plotly.js-dist-min";

const baseLayout = (theme) => ({
  paper_bgcolor: "rgba(0,0,0,0)",
  plot_bgcolor: "rgba(0,0,0,0)",
  font: {
    family: "Inter, ui-sans-serif, sans-serif",
    size: 11,
    color: theme === "dark" ? "#D1D1D6" : "#27272A",
  },
  margin: { t: 20, r: 10, b: 50, l: 60 },
  legend: { orientation: "h", x: 0, y: -0.2 },
  colorway: ["#7C3AED", "#A78BFA", "#DDD6FE", "#84CC16", "#4ADE80"],
  // Tooltip scuro uniforme con i grafici a barre / le cartine
  hoverlabel: {
    bgcolor: "#0E0E10",
    bordercolor: "#0E0E10",
    font: { color: "#FFFFFF", family: "Inter, ui-sans-serif, sans-serif", size: 12 },
  },
});

const BASE_CONFIG = {
  responsive: true,
  displayModeBar: false,
  locale: "it",
};

export function PlotlyChart({ data, layout = {}, config = {}, style, onClick }) {
  const ref = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    Plotly.react(
      element,
      data,
      { ...baseLayout(theme), ...layout },
      { ...BASE_CONFIG, ...config },
    );
    if (!onClick) return;
    const handler = (event) => onClick(event);
    element.on("plotly_click", handler);
    return () => {
      element.removeListener?.("plotly_click", handler);
    };
  }, [data, layout, config, theme, onClick]);

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
