import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import '../components/auth/auth.css'

export function AuthCallbackPage() {
  const navigate = useNavigate()
  const processed = useRef(false)

  useEffect(() => {
    if (processed.current) return
    processed.current = true

    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const state = params.get('state')
    const error = params.get('error')

    if (error) {
      const desc = params.get('error_description') ?? error
      navigate(`/genie?auth_error=${encodeURIComponent(desc)}`, { replace: true })
      return
    }

    if (!code || !state) {
      navigate('/genie', { replace: true })
      return
    }

    authService
      .handleCallback(code, state)
      .then(() => navigate('/genie', { replace: true }))
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Errore autenticazione'
        navigate(`/genie?auth_error=${encodeURIComponent(msg)}`, { replace: true })
      })
  }, [navigate])

  return (
    <div className="auth-guard-loading" role="status" aria-live="polite">
      <span className="auth-guard-spinner" aria-hidden="true" />
      <span>Completamento autenticazione…</span>
    </div>
  )
}
