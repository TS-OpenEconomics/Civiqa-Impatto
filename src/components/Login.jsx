import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/useToast.jsx";
import { Modal } from "./ui/Modal";
import { IconArrowRight, IconChevronDown, IconEye, IconEyeOff } from "./ui/Icons";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const canSubmit = email.length > 0 && password.length > 0;

  async function handleLogin() {
    if (!canSubmit || isSubmitting) return;
    setIsSubmitting(true);
    setError("");

    try {
      await login(email, password);
      if (remember) {
        window.localStorage.setItem("civiqa.remembered_email", email);
      }
      toast({
        tone: "success",
        title: "Accesso completato",
        description: "Benvenuto nella demo Civiqa.",
      });
      navigate("/valutazioni", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="h-screen w-screen bg-bg-page grid grid-cols-1 md:grid-cols-2">
        <div className="bg-white flex flex-col">
          <div className="flex-1 bg-brand-violet relative flex items-center justify-center">
            <div className="w-44 h-44 rounded-full bg-white flex items-center justify-center">
              <div className="w-20 h-20 bg-brand-violet" />
            </div>
          </div>
          <div className="h-1 bg-accent-lime" />
          <div className="flex-1 flex flex-col items-center justify-center px-10 text-center">
            <h1 className="font-bold text-4xl tracking-tight text-ink-900">OpenEconomics</h1>
            <p className="mt-8 text-lg font-semibold text-ink-900 max-w-md">
              Pronti ad esplorare le esternalita della vostra organizzazione?
            </p>
            <p className="mt-6 text-sm text-ink-700 max-w-md">
              Ecco una suite di analisi, scientificamente robuste ma facili da usare, per la compliance, il coinvolgimento degli stakeholder e la gestione dei rischi di transizione.
            </p>
          </div>
        </div>

        <div className="bg-bg-page flex flex-col">
          <div className="flex items-center justify-end p-6 gap-1 text-sm">
            <span className="font-medium">IT</span>
            <IconChevronDown />
          </div>
          <div className="flex-1 flex items-center justify-center px-10">
            <div className="w-full max-w-md bg-white p-10">
              <h2 className="text-2xl font-bold tracking-tight">Benvenuto in Civiqa</h2>
              <p className="mt-3 text-sm text-ink-700">Accedi per continuare</p>
              <div className="mt-3 rounded-md border border-brand-violet/20 bg-brand-violet-soft px-3 py-2 text-xs text-ink-700">
                Demo login: <strong>demo@civiqa.it</strong> / <strong>civiqa2024</strong>
              </div>

              <div className="mt-8">
                <label className="block text-sm font-semibold mb-2">Indirizzo e-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Inserisci indirizzo e-mail"
                  className="w-full h-11 px-3 border border-ink-300 bg-white text-sm placeholder:text-ink-300 focus:outline-none focus:border-brand-violet"
                />
              </div>

              <div className="mt-5">
                <label className="block text-sm font-semibold mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Inserisci password"
                    className="w-full h-11 px-3 pr-10 border border-ink-300 bg-white text-sm placeholder:text-ink-300 focus:outline-none focus:border-brand-violet"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500"
                  >
                    {showPassword ? <IconEye /> : <IconEyeOff />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleLogin}
                disabled={!canSubmit || isSubmitting}
                className={`mt-8 w-full h-12 flex items-center justify-between px-5 text-sm font-semibold transition-colors ${
                  canSubmit && !isSubmitting
                    ? "bg-brand-violet text-white hover:bg-brand-violet-dark"
                    : "bg-ink-100 text-ink-300 cursor-not-allowed"
                }`}
              >
                <span>{isSubmitting ? "Accesso in corso..." : "Accedi"}</span>
                <IconArrowRight className="w-5 h-5" />
              </button>
              {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}

              <div className="mt-4 flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setRecoveryEmail(email);
                    setShowForgotPassword(true);
                  }}
                  className="text-brand-violet font-medium underline"
                >
                  Password dimenticata?
                </button>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 accent-brand-violet"
                  />
                  <span>Ricordami</span>
                </label>
              </div>

              <p className="mt-8 text-sm">Oppure:</p>
              <button
                type="button"
                onClick={() =>
                  toast({
                    title: "SSO non disponibile",
                    description: "SSO disponibile nella versione Enterprise.",
                  })
                }
                className="mt-3 w-full h-12 flex items-center justify-between px-5 text-sm font-semibold border-2 border-brand-violet text-brand-violet"
              >
                <span>Accedi con le credenziali aziendali</span>
                <IconArrowRight className="w-5 h-5" />
              </button>

              <p className="mt-8 text-center text-xs text-ink-500">
                Per assistenza <a href="#" className="text-brand-violet underline">scrivi a supporto@mail.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
      {showForgotPassword ? (
        <Modal
          title="Recupera password"
          onClose={() => setShowForgotPassword(false)}
          onConfirm={() => {
            toast({
              tone: "success",
              title: "Email inviata",
              description: `Abbiamo inviato istruzioni a ${recoveryEmail || "supporto@mail.com"}.`,
            });
            setShowForgotPassword(false);
          }}
          confirmLabel="Invia email"
        >
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Indirizzo email</span>
            <input
              type="email"
              value={recoveryEmail}
              onChange={(event) => setRecoveryEmail(event.target.value)}
              className="w-full h-11 border border-ink-300 px-3 text-sm focus:outline-none focus:border-brand-violet"
              placeholder="nome@ente.it"
            />
          </label>
        </Modal>
      ) : null}
    </>
  );
}
