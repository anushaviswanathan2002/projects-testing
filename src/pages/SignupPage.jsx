import { useState } from 'react'

export default function SignupPage({ onSignup, onToggleToLogin }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    const result = onSignup(name, email, password, confirmPassword)
    if (result.success) {
      setSuccess('Account created successfully! Redirecting to login...')
      setTimeout(() => {
        onToggleToLogin()
      }, 1500)
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="container">
      <h1>📝 Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
          />
        </div>

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
            placeholder="Enter password (min 6 characters)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password:</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
          />
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button type="submit">Create Account</button>
      </form>

      <div className="toggle-link">
        <p>Already have an account? <button type="button" onClick={onToggleToLogin}>Login here</button></p>
      </div>
    </div>
  )
}
