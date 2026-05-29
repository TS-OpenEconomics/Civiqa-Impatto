export function ImpactIcon({ type, label, className = "h-12 w-12", wrapperClassName = "flex h-12 w-12 shrink-0 items-center justify-center text-brand-violet" }) {
  const iconProps = {
    className,
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 48 48",
    strokeWidth: 2.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const icons = {
    spese: (
      <svg {...iconProps}>
        <circle cx="24" cy="24" r="14.5" />
        <path d="M29.5 17.5a9 9 0 1 0 0 13" />
        <path d="M16.5 22h12" />
        <path d="M16.5 26h11" />
      </svg>
    ),
    pil: (
      <svg {...iconProps}>
        <path d="M10 34h28" />
        <path d="M14 28l7-9 7 5 6-11 6 5" />
      </svg>
    ),
    occupazione: (
      <svg {...iconProps}>
        <circle cx="19" cy="16" r="5" />
        <circle cx="31" cy="16" r="5" />
        <path d="M11 35c.9-7 4-10.5 8-10.5s7.1 3.5 8 10.5" />
        <path d="M25 25.5c1.6-.8 3.7-1 5.8-.4 3.7 1 6 4.4 6.7 9.9" />
      </svg>
    ),
    produzione: (
      <svg {...iconProps}>
        <path d="M10 35h28V21l-9 5v-9l-9 5v-9l-10 6z" />
        <path d="M16 35v-6h5v6" />
        <path d="M26 35v-6h5v6" />
      </svg>
    ),
    redditi: (
      <svg {...iconProps}>
        <circle cx="24" cy="15" r="4" />
        <circle cx="14" cy="20" r="4" />
        <circle cx="34" cy="20" r="4" />
        <path d="M18 34v-5a6 6 0 0 1 12 0v5" />
        <path d="M8 34v-4a5.5 5.5 0 0 1 7.5-5.1" />
        <path d="M40 34v-4a5.5 5.5 0 0 0-7.5-5.1" />
      </svg>
    ),
    gettito: (
      <svg {...iconProps}>
        <path d="M9 40h30" />
        <path d="M11 24l13-12 13 12" />
        <path d="M11 24h26" />
        <path d="M15 24v14" />
        <path d="M21 24v14" />
        <path d="M27 24v14" />
        <path d="M33 24v14" />
      </svg>
    ),
  };

  return (
    <span className={wrapperClassName} aria-label={label}>
      {icons[type]}
    </span>
  );
}
