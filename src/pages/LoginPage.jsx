import { useState } from 'react'

export default function LoginPage({ onLogin, onToggleToSignup }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    const result = onLogin(email, password)
    if (!result.success) {
      setError(result.message)
    }
  }

  return (
    <div className="container">
      <h1>🔐 Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit">Login</button>
      </form>

      <div className="toggle-link">
        <p>Don't have an account? <button type="button" onClick={onToggleToSignup}>Sign up here</button></p>
      </div>
    </div>
  )
}
