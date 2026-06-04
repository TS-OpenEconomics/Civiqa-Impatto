/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";

const DEMO_USER = {
  email: "demo@civiqa.it",
  name: "Marco Bianchi",
  initials: "MB",
  role: "RUP",
  ente: "Comune di Colleferro",
};

const STORAGE_KEY = "civiqa.auth";

function readInitialAuth() {
  if (typeof window === "undefined") return { user: null, token: null };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { user: null, token: null };
    const parsed = JSON.parse(raw);
    if (parsed?.token && parsed?.user?.email) return parsed;
  } catch {
    /* ignore corrupt payload */
  }
  return { user: null, token: null };
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(readInitialAuth);

  const value = useMemo(
    () => ({
      user: authState.user,
      token: authState.token,
      isAuthenticated: Boolean(authState.token),
      async login(email, password) {
        await new Promise((resolve) => window.setTimeout(resolve, 1500));

        if (email !== "demo@civiqa.it" || password !== "civiqa2024") {
          throw new Error("Credenziali non valide. Usa demo@civiqa.it / civiqa2024");
        }

        const next = {
          token: "demo-auth-token",
          user: { ...DEMO_USER, email },
        };
        setAuthState(next);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        }
        return next.user;
      },
      logout() {
        setAuthState({ user: null, token: null });
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(STORAGE_KEY);
          window.localStorage.removeItem("auth_token");
        }
      },
    }),
    [authState],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
