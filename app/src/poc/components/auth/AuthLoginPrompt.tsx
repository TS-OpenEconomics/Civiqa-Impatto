import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/Button'

export function AuthLoginPrompt() {
  const { login, isLoading, error, clearError } = useAuth()

  return (
    <div className="auth-login-prompt" aria-labelledby="auth-heading">
      <div className="auth-login-card" role="region" aria-label="Accesso a Databricks">
        <h2 id="auth-heading" className="auth-login-title">
          Accesso richiesto
        </h2>
        <p className="auth-login-description">
          Per utilizzare Genie Space è necessario autenticarsi con il proprio account Databricks.
        </p>

        {error && (
          <div className="auth-login-error" role="alert" aria-live="assertive">
            <span className="auth-login-error-icon" aria-hidden="true">⚠</span>
            <span>{error}</span>
            <button
              type="button"
              className="auth-login-error-dismiss"
              onClick={clearError}
              aria-label="Chiudi messaggio di errore"
            >
              ×
            </button>
          </div>
        )}

        <Button
          variant="primary"
          size="l"
          onClick={() => { void login() }}
          loading={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? 'Accesso in corso…' : 'Accedi con Databricks'}
        </Button>
      </div>
    </div>
  )
}
