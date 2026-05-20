/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AUTH_STORAGE_KEY = "civiqa.auth.v1";
const DEMO_USER = {
  email: "demo@civiqa.it",
  name: "Mario Rossi",
  initials: "MR",
  role: "Analista",
};

const AuthContext = createContext(null);

function readAuthState() {
  if (typeof window === "undefined") {
    return { user: null, token: null };
  }

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return { user: null, token: null };
    return JSON.parse(raw);
  } catch {
    return { user: null, token: null };
  }
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(readAuthState);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
  }, [authState]);

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
          window.localStorage.setItem("auth_token", next.token);
        }
        return next.user;
      },
      logout() {
        setAuthState({ user: null, token: null });
        if (typeof window !== "undefined") {
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
