import { IconCheck, IconClose, IconHelp } from "./Icons";

const TONE_STYLES = {
  info: {
    border: "border-brand-violet/20",
    badge: "bg-brand-violet text-white",
    icon: <IconHelp className="w-4 h-4" />,
  },
  success: {
    border: "border-emerald-200",
    badge: "bg-emerald-600 text-white",
    icon: <IconCheck className="w-4 h-4" />,
  },
  error: {
    border: "border-rose-200",
    badge: "bg-rose-600 text-white",
    icon: <IconClose className="w-4 h-4" />,
  },
};

export function ToastViewport({ toasts, onDismiss }) {
  return (
    <div className="fixed right-4 top-4 z-[120] flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastCard({ toast, onDismiss }) {
  const tone = TONE_STYLES[toast.tone] || TONE_STYLES.info;

  return (
    <div className={`border bg-white shadow-xl ${tone.border}`}>
      <div className="flex items-start gap-3 p-4">
        <span className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${tone.badge}`}>
          {tone.icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink-900">{toast.title}</p>
          {toast.description ? (
            <p className="mt-1 text-sm leading-relaxed text-ink-700">{toast.description}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="text-ink-500 transition-colors hover:text-ink-900"
          aria-label="Chiudi notifica"
        >
          <IconClose />
        </button>
      </div>
    </div>
  );
}
