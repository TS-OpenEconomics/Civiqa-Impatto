import { IconClose } from "./Icons";

export function Modal({ title, children, onClose, onConfirm, confirmLabel = "Conferma", cancelLabel = "Annulla" }) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-ink-900/45 px-4">
      <div className="w-full max-w-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
          <h2 className="text-lg font-bold tracking-tight">{title}</h2>
          <button type="button" onClick={onClose} className="text-ink-500 hover:text-ink-900">
            <IconClose />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        <div className="flex items-center justify-end gap-3 border-t border-ink-100 px-6 py-4">
          <button type="button" onClick={onClose} className="h-10 px-4 border border-ink-100 text-sm font-semibold">
            {cancelLabel}
          </button>
          {onConfirm ? (
            <button type="button" onClick={onConfirm} className="h-10 px-4 bg-brand-violet text-sm font-semibold text-white hover:bg-brand-violet-dark">
              {confirmLabel}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
