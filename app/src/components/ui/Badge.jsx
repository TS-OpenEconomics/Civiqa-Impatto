// Badge per i tipi di analisi: usa i colori brand definiti in tailwind.config

const BADGE_STYLES = {
  EIA: "bg-badge-eia text-ink-900",
  ECBA: "bg-badge-ecba text-ink-900",
  ESG: "bg-badge-esg text-ink-900",
};

export function Badge({ type, dimmed = false, className = "" }) {
  const base = "inline-flex items-center px-2.5 py-1 text-xs font-semibold tracking-wide font-mono";
  const style = dimmed ? "bg-ink-100 text-ink-300" : BADGE_STYLES[type] || "bg-ink-100 text-ink-700";
  return <span className={`${base} ${style} ${className}`}>{type}</span>;
}
