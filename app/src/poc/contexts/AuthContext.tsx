import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { authService } from '../services/authService'
import type { AuthState } from '../types/auth'

interface AuthContextValue {
  authState: AuthState
  login: () => Promise<void>
  logout: () => void
  getValidToken: () => Promise<string>
  isLoading: boolean
  error: string | null
  clearError: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(() => authService.getState())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    return authService.subscribe(setAuthState)
  }, [])

  // Read auth_error forwarded from the callback page
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const authError = params.get('auth_error')
    if (authError) {
      setError(decodeURIComponent(authError))
      const clean = new URL(window.location.href)
      clean.searchParams.delete('auth_error')
      window.history.replaceState({}, '', clean.pathname + clean.search)
    }
  }, [])

  async function login() {
    setIsLoading(true)
    setError(null)
    try {
      await authService.login()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Errore durante il login'
      setError(message)
      setIsLoading(false)
    }
  }

  function logout() {
    authService.logout()
    setError(null)
  }

  async function getValidToken() {
    try {
      return await authService.getValidToken()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Token non disponibile'
      setError(message)
      throw err
    }
  }

  function clearError() {
    setError(null)
  }

  return (
    <AuthContext.Provider value={{ authState, login, logout, getValidToken, isLoading, error, clearError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve essere usato dentro <AuthProvider>')
  return ctx
}
