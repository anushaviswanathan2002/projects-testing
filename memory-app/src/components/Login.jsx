import { useState } from 'react'
import './Auth.css'

function Login({ onLogin, onToggleSignup }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields')
      return
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find(u => u.username === username)

    if (!user) {
      setError('User not found')
      return
    }

    if (user.password !== password) {
      setError('Invalid password')
      return
    }

    onLogin(username)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Login</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
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
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="submit-btn">
            Login
          </button>
        </form>
        <p className="auth-toggle">
          Don't have an account?{' '}
          <button 
            type="button" 
            onClick={onToggleSignup}
            className="toggle-link"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login
