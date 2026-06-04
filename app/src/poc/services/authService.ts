import { OAUTH_CONFIG, TOKEN_REFRESH_BUFFER_MS } from '../config/oauth'
import type { AuthState, DatabricksUser, AuthError } from '../types/auth'

const STORAGE_KEY = 'civiqa_auth'

// ── PKCE helpers ──────────────────────────────────────────────────────────────

function generateCodeVerifier(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

// ── Token storage ─────────────────────────────────────────────────────────────

function saveAuthState(state: AuthState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function loadAuthState(): AuthState {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return emptyState()
  try {
    return JSON.parse(raw) as AuthState
  } catch {
    return emptyState()
  }
}

function emptyState(): AuthState {
  return { isAuthenticated: false, accessToken: null, refreshToken: null, expiresAt: null, user: null }
}

// ── AuthService singleton ─────────────────────────────────────────────────────

class AuthService {
  private state: AuthState = loadAuthState()
  private listeners: Array<(state: AuthState) => void> = []

  getState(): AuthState {
    return this.state
  }

  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notify(): void {
    this.listeners.forEach(l => l(this.state))
  }

  private setState(next: AuthState): void {
    this.state = next
    saveAuthState(next)
    this.notify()
  }

  // Initiates OAuth Authorization Code + PKCE flow
  async login(): Promise<void> {
    const verifier = generateCodeVerifier()
    const challenge = await generateCodeChallenge(verifier)
    const state = generateCodeVerifier() // reuse for CSRF nonce

    sessionStorage.setItem('pkce_verifier', verifier)
    sessionStorage.setItem('oauth_state', state)

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: OAUTH_CONFIG.clientId,
      redirect_uri: OAUTH_CONFIG.redirectUri,
      scope: OAUTH_CONFIG.scope,
      state,
      code_challenge: challenge,
      code_challenge_method: 'S256',
    })

    window.location.href = `${OAUTH_CONFIG.authorizationEndpoint}?${params}`
  }

  // Handles the OAuth callback — exchanges code for tokens
  async handleCallback(code: string, returnedState: string): Promise<void> {
    const verifier = sessionStorage.getItem('pkce_verifier')
    const expectedState = sessionStorage.getItem('oauth_state')

    if (!verifier) throw this.authError('oauth_error', 'Missing PKCE verifier')
    if (returnedState !== expectedState) throw this.authError('oauth_error', 'State mismatch — possible CSRF')

    sessionStorage.removeItem('pkce_verifier')
    sessionStorage.removeItem('oauth_state')

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: OAUTH_CONFIG.redirectUri,
      client_id: OAUTH_CONFIG.clientId,
      code_verifier: verifier,
    })

    const response = await this.fetchToken(body)
    const user = this.parseUser(response.access_token)

    this.setState({
      isAuthenticated: true,
      accessToken: response.access_token,
      refreshToken: response.refresh_token ?? null,
      expiresAt: Date.now() + (response.expires_in ?? 3600) * 1000,
      user,
    })
  }

  logout(): void {
    this.setState(emptyState())
  }

  getAccessToken(): string | null {
    return this.state.accessToken
  }

  isAuthenticated(): boolean {
    return this.state.isAuthenticated && !this.isExpired()
  }

  isExpired(): boolean {
    if (!this.state.expiresAt) return false
    return Date.now() >= this.state.expiresAt
  }

  needsRefresh(): boolean {
    if (!this.state.expiresAt) return false
    return Date.now() >= this.state.expiresAt - TOKEN_REFRESH_BUFFER_MS
  }

  async refreshToken(): Promise<void> {
    if (!this.state.refreshToken) throw this.authError('refresh_failed', 'No refresh token available')

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: this.state.refreshToken,
      client_id: OAUTH_CONFIG.clientId,
    })

    try {
      const response = await this.fetchToken(body)
      this.setState({
        ...this.state,
        accessToken: response.access_token,
        refreshToken: response.refresh_token ?? this.state.refreshToken,
        expiresAt: Date.now() + (response.expires_in ?? 3600) * 1000,
      })
    } catch {
      this.setState(emptyState())
      throw this.authError('refresh_failed', 'Token refresh failed — re-authentication required')
    }
  }

  // Returns a valid access token, refreshing if needed
  async getValidToken(): Promise<string> {
    if (this.needsRefresh() && this.state.refreshToken) {
      await this.refreshToken()
    }
    if (!this.state.accessToken) throw this.authError('token_expired', 'No valid token available')
    return this.state.accessToken
  }

  private async fetchToken(body: URLSearchParams): Promise<TokenResponse> {
    let response: Response
    try {
      response = await fetch(OAUTH_CONFIG.tokenEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      })
    } catch {
      throw this.authError('network_error', 'Network failure during token exchange')
    }

    if (!response.ok) {
      const text = await response.text().catch(() => 'unknown error')
      throw this.authError('oauth_error', `Token endpoint returned ${response.status}: ${text}`)
    }

    return response.json() as Promise<TokenResponse>
  }

  // Minimal JWT decode — only reads payload claims (no signature verification for POC)
  private parseUser(accessToken: string): DatabricksUser | null {
    try {
      const parts = accessToken.split('.')
      if (parts.length !== 3) return null
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
      return {
        id: payload.sub ?? payload.uid ?? '',
        email: payload.email ?? payload.preferred_username ?? '',
        name: payload.name ?? payload.preferred_username ?? 'Utente Databricks',
      }
    } catch {
      return null
    }
  }

  private authError(type: AuthError, message: string): Error {
    const err = new Error(message)
    ;(err as Error & { authErrorType: AuthError }).authErrorType = type
    return err
  }
}

interface TokenResponse {
  access_token: string
  refresh_token?: string
  expires_in?: number
  token_type: string
}

export const authService = new AuthService()
