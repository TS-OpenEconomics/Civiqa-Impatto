import type { OAuthConfig } from '../types/auth'

// Databricks workspace URL — set via VITE_DATABRICKS_HOST env var
const DATABRICKS_HOST = import.meta.env.VITE_DATABRICKS_HOST ?? 'https://your-workspace.azuredatabricks.net'

export const OAUTH_CONFIG: OAuthConfig = {
  clientId: import.meta.env.VITE_DATABRICKS_CLIENT_ID ?? 'civiqa-poc',
  redirectUri: `${window.location.origin}/auth/callback`,
  authorizationEndpoint: `${DATABRICKS_HOST}/oidc/v1/authorize`,
  // Token exchange goes through the local proxy to avoid CORS on the Databricks endpoint
  tokenEndpoint: 'http://localhost:3001/api/auth/token',
  scope: 'all-apis offline_access',
}

// Token refresh buffer: refresh 5 minutes before expiration
export const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000
