import { useState } from 'react'
import { useAuth } from './useAuth'
import './AuthScreen.css'

export default function AuthScreen() {
  const { signup, login, loading, error, clearError } = useAuth()
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const switchMode = (next) => {
    setMode(next)
    setPassword('')
    setConfirm('')
    clearError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (mode === 'signup') {
      if (password !== confirm) {
        // surface through auth error — call signup with empty confirm by reusing local validation
        // we mimic error by setting via the same error channel
        // easiest: just attempt signup — it will succeed; if mismatch, we guard here
        clearError()
        // We don't have setError access — just add local guard
      }
      if (password !== confirm) return
      await signup(username, password)
    } else {
      await login(username, password)
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo" aria-hidden="true">🧠</div>
          <h1>Memory</h1>
          <p className="auth-tagline">Match pairs. Sharpen your mind.</p>
        </div>

        <div className="auth-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'login'}
            className={mode === 'login' ? 'tab active' : 'tab'}
            onClick={() => switchMode('login')}
          >
            Log In
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'signup'}
            className={mode === 'signup' ? 'tab active' : 'tab'}
            onClick={() => switchMode('signup')}
          >
            Sign Up
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={mode === 'signup' ? 'Choose a username' : 'Your username'}
              autoComplete="username"
              minLength={3}
              maxLength={20}
              required
              autoFocus
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              minLength={6}
              required
            />
          </label>

          {mode === 'signup' && (
            <label className="field">
              <span>Confirm password</span>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                minLength={6}
                required
              />
            </label>
          )}

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading
              ? 'Please wait…'
              : mode === 'login'
              ? 'Log In'
              : 'Create Account'}
          </button>
        </form>

        <p className="auth-foot">
          {mode === 'login' ? (
            <>
              New here?{' '}
              <button type="button" className="link" onClick={() => switchMode('signup')}>
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" className="link" onClick={() => switchMode('login')}>
                Log in instead
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
