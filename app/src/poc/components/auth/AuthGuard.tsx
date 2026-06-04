import type { ReactNode } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { AuthLoginPrompt } from './AuthLoginPrompt'

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { authState, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="auth-guard-loading" role="status" aria-live="polite">
        <span className="auth-guard-spinner" aria-hidden="true" />
        <span>Autenticazione in corso…</span>
      </div>
    )
  }

  if (!authState.isAuthenticated) {
    return <AuthLoginPrompt />
  }

  return <>{children}</>
}
