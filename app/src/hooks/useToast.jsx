/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { ToastViewport } from "../components/ui/Toast";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const pushToast = useCallback(
    ({ title, description, tone = "info", duration = 3200 }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setToasts((prev) => [...prev, { id, title, description, tone }]);
      window.setTimeout(() => dismissToast(id), duration);
    },
    [dismissToast],
  );

  const value = useMemo(
    () => ({
      toast: pushToast,
      showToast(message, tone = "info") {
        pushToast({ title: message, tone });
      },
      dismissToast,
    }),
    [dismissToast, pushToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}
