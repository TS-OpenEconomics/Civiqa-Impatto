export interface DatabricksUser {
  id: string
  email: string
  name: string
}

export interface AuthState {
  isAuthenticated: boolean
  accessToken: string | null
  refreshToken: string | null
  expiresAt: number | null
  user: DatabricksUser | null
}

export interface OAuthConfig {
  clientId: string
  redirectUri: string
  authorizationEndpoint: string
  tokenEndpoint: string
  scope: string
}

export type AuthError =
  | 'network_error'
  | 'invalid_credentials'
  | 'token_expired'
  | 'refresh_failed'
  | 'oauth_error'
  | 'unknown'
