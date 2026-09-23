import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

export default function AuthForm({ mode: initialMode = 'login', onSuccess }) {
  const [mode, setMode] = useState(initialMode)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const { login, signup } = useAuth()

  const isSignup = mode === 'signup'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (isSignup && password !== confirm) {
      setError("Passwords don't match.")
      return
    }
    setBusy(true)
    try {
      const result = isSignup
        ? await signup(username, password)
        : await login(username, password)
      if (!result.ok) {
        setError(result.error)
        return
      }
      onSuccess?.(result.user)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const switchMode = () => {
    setMode(isSignup ? 'login' : 'signup')
    setError('')
    setPassword('')
    setConfirm('')
  }

  return (
    <div className="auth-card">
      <div className="auth-header">
        <span className="logo">🧠</span>
        <h1>{isSignup ? 'Create your account' : 'Welcome back'}</h1>
        <p className="tagline">
          {isSignup
            ? 'Sign up to save your progress and high scores.'
            : 'Log in to continue your memory training.'}
        </p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <label className="field">
          <span>Username</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. brain_trainer"
            autoComplete="username"
            required
            minLength={3}
            disabled={busy}
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isSignup ? 'At least 6 characters' : '••••••••'}
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            required
            minLength={6}
            disabled={busy}
          />
        </label>

        {isSignup && (
          <label className="field">
            <span>Confirm password</span>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat your password"
              autoComplete="new-password"
              required
              minLength={6}
              disabled={busy}
            />
          </label>
        )}

        {error && <div className="auth-error" role="alert">{error}</div>}

        <button type="submit" className="btn primary auth-submit" disabled={busy}>
          {busy ? 'Please wait…' : isSignup ? 'Create account' : 'Log in'}
        </button>
      </form>

      <p className="auth-switch">
        {isSignup ? (
          <>
            Already have an account?{' '}
            <button type="button" className="link-btn" onClick={switchMode}>
              Log in
            </button>
          </>
        ) : (
          <>
            New here?{' '}
            <button type="button" className="link-btn" onClick={switchMode}>
              Create an account
            </button>
          </>
        )}
      </p>
    </div>
  )
}
