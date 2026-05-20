export function EmptyState({
  eyebrow,
  title,
  description,
  actionLabel,
  onAction,
  compact = false,
}) {
  return (
    <div
      className={`border border-dashed border-ink-200 bg-white text-center ${
        compact ? "px-6 py-8" : "px-8 py-12"
      }`}
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-violet-soft text-brand-violet">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-6 w-6">
          <path d="M12 7v6" />
          <path d="M12 16h.01" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      </div>
      {eyebrow ? (
        <p className="mt-4 text-xs font-mono uppercase tracking-[0.18em] text-ink-500">{eyebrow}</p>
      ) : null}
      <h3 className="mt-2 text-xl font-bold tracking-tight">{title}</h3>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink-700">{description}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 h-11 bg-brand-violet px-5 text-sm font-semibold text-white hover:bg-brand-violet-dark"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
