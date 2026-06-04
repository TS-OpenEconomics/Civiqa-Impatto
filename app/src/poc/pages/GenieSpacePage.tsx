import { useAuth } from '../contexts/AuthContext'
import { AuthGuard } from '../components/auth/AuthGuard'
import { GenieChatWindow } from '../components/genie/GenieChatWindow'
import '../components/auth/auth.css'

function GenieSpaceContent() {
  const { getValidToken } = useAuth()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <GenieChatWindow getValidToken={getValidToken} />
    </div>
  )
}

export function GenieSpacePage() {
  return (
    <AuthGuard>
      <GenieSpaceContent />
    </AuthGuard>
  )
}
