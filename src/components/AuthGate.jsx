import { useAuth } from '../context/AuthContext.jsx'
import AuthForm from './AuthForm.jsx'

export default function AuthGate() {
  const { user, hydrated } = useAuth()

  if (!hydrated) {
    return (
      <div className="auth-screen">
        <div className="auth-card loading">Loading…</div>
      </div>
    )
  }

  if (user) return null // Should not happen behind the gate, but guard anyway.

  return (
    <div className="auth-screen">
      <AuthForm mode="login" />
    </div>
  )
}
