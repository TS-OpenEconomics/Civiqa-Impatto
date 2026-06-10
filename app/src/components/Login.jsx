import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme, toggleTheme } from "../../hooks/useTheme";
import { Modal } from "../ui/Modal";
import { IconChevronDown, IconEye, IconEyeOff, IconOEBlack, IconOEWhite } from "../ui/Icons";

// Credenziali demo precompilate: in questa build l'accesso è immediato (basta "Accedi").
const DEMO_EMAIL = "demo@civiqa.it";
const DEMO_PASSWORD = "civiqa2024";

export function Login() {
  const { login } = useAuth();
  const theme = useTheme();
  const dark = theme === "dark";
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [ssoOpen, setSsoOpen] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err?.message || "Credenziali non valide. Usa demo@civiqa.it / civiqa2024");
    } finally {
      setSubmitting(false);
    }
  }

  const filled = email.trim() && password.trim();

  return (
    <div className="grid grid-cols-2 h-screen">
      {/* ── Left panel: violet top / lime bar / white bottom ── */}
      <div className="flex flex-col">
        {/* Violet section – logo mark: cerchio bianco con foro quadrato (rivela il viola) */}
        <div className="flex-1 bg-brand-violet flex items-center justify-center">
          <IconOEWhite className="w-44 h-44" />
        </div>

        {/* Lime accent bar */}
        <div className="h-2 bg-accent-lime shrink-0" />

        {/* White section – brand text */}
        <div className="flex-1 bg-white flex flex-col items-center justify-center px-10 text-center">
          {/* OpenEconomics wordmark: IconOEBlack come "O" + testo "penEconomics" */}
          <div className="flex items-center gap-0 mb-6">
            <IconOEBlack className="w-10 h-10 shrink-0" />
            <span className="text-4xl font-bold tracking-tight text-ink-900 leading-none">
              penEconomics
            </span>
          </div>

          <h2 className="text-lg font-bold text-ink-900 leading-snug mb-4">
            Pronti ad esplorare le esternalità<br />della vostra organizzazione?
          </h2>
          <p className="text-sm text-ink-500 leading-relaxed max-w-xs">
            Ecco una suite di analisi, scientificamente robuste ma facili da usare,
            per la compliance, il coinvolgimento degli stakeholder e la gestione dei
            rischi di transizione.
          </p>
        </div>
      </div>

      {/* ── Right panel: gray background ── */}
      <div className="bg-bg-page flex flex-col">
        {/* Theme toggle + language selector */}
        <div className="flex items-center justify-end px-6 py-5 gap-3 text-sm font-medium text-ink-700">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={dark ? "Passa al tema chiaro" : "Passa al tema scuro"}
            title={dark ? "Tema chiaro" : "Tema scuro"}
            className="flex h-8 w-8 items-center justify-center rounded text-ink-500 hover:text-ink-900 focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_var(--color-border-focus)]"
          >
            {dark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.6" />
                <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M20 14.5A8 8 0 0 1 9.5 4 7 7 0 1 0 20 14.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
            )}
          </button>
          <span className="flex items-center gap-0.5">IT <IconChevronDown className="w-4 h-4 text-ink-400" /></span>
        </div>

        {/* Centered card */}
        <div className="flex-1 flex items-center justify-center px-10 pb-10">
          <div className="w-full max-w-md bg-white p-10 shadow-sm">
            <h1 className="text-2xl font-bold text-ink-900 mb-1">Benvenuto in Civiqa</h1>
            <p className="text-sm text-ink-500 mb-8">Accedi per continuare</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-ink-900 mb-1.5">
                  Indirizzo e-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Inserisci indirizzo e-mail"
                  className="w-full border border-ink-200 px-4 py-3 text-sm placeholder:text-ink-300 focus:outline-none focus:border-brand-violet"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink-900 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Inserisci password"
                    className="w-full border border-ink-200 rounded px-4 py-3 pr-12 text-sm placeholder:text-ink-300 focus:outline-none focus:border-brand-violet"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-500"
                  >
                    {showPw ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error ? <p className="text-xs text-red-600">{error}</p> : null}

              <button
                type="submit"
                disabled={!filled || submitting}
                className={`w-full flex items-center justify-between px-5 py-4 text-sm font-semibold transition-colors ${
                  filled && !submitting
                    ? "bg-brand-violet text-white hover:bg-brand-violet-dark"
                    : "bg-ink-100 text-ink-400 cursor-not-allowed"
                }`}
              >
                <span>{submitting ? "Accesso in corso…" : "Accedi"}</span>
                <span>{submitting ? "…" : "→"}</span>
              </button>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => setForgotOpen(true)}
                  className="text-brand-violet hover:underline"
                >
                  Password dimenticata?
                </button>
                <label className="flex items-center gap-2 text-ink-700 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 accent-brand-violet" />
                  Ricordami
                </label>
              </div>

              <div>
                <p className="text-sm text-ink-700 mb-3">Oppure:</p>
                <button
                  type="button"
                  onClick={() => setSsoOpen(true)}
                  className="w-full flex items-center justify-between border border-brand-violet px-5 py-4 text-sm font-semibold text-brand-violet hover:bg-brand-violet-light transition-colors"
                >
                  <span>Accedi con le credenziali aziendali</span>
                  <span>→</span>
                </button>
              </div>
            </form>

            <p className="mt-8 text-center text-sm text-ink-500">
              Per assistenza{" "}
              <a href="mailto:supporto@openeconomics.eu" className="text-brand-violet hover:underline">
                scrivi a supporto@openeconomics.eu
              </a>
            </p>
          </div>
        </div>
      </div>

      {forgotOpen && (
        <Modal title="Recupero password" onClose={() => setForgotOpen(false)}>
          <div className="space-y-3 text-sm leading-relaxed text-ink-700">
            <p>
              Nella versione demo non è disponibile il reset password. Le credenziali preconfigurate sono:
            </p>
            <div className="rounded border border-ink-100 bg-bg-page px-3 py-2 font-mono text-[12px]">
              demo@civiqa.it / civiqa2024
            </div>
            <p className="text-ink-500">
              Per un account dedicato puoi scrivere a{" "}
              <a href="mailto:supporto@openeconomics.eu" className="text-brand-violet hover:underline">
                supporto@openeconomics.eu
              </a>.
            </p>
          </div>
        </Modal>
      )}

      {ssoOpen && (
        <Modal title="Accesso aziendale (SSO)" onClose={() => setSsoOpen(false)}>
          <div className="space-y-3 text-sm leading-relaxed text-ink-700">
            <p>
              L'integrazione SSO (SAML/OIDC) con le credenziali aziendali è prevista nella versione completa.
            </p>
            <p className="text-ink-500">
              Nella demo usa le credenziali preconfigurate <span className="font-mono text-[12px]">demo@civiqa.it / civiqa2024</span>.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
