import React, { useState } from 'react'
import '../styles/AuthPage.css'

function AuthPage({ onLogin, onSignUp }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  })
  const [error, setError] = useState('')
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('users')
    return saved ? JSON.parse(saved) : []
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (isLogin) {
      // Login logic
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields')
        return
      }

      if (!validateEmail(formData.email)) {
        setError('Invalid email format')
        return
      }

      const user = users.find(u => u.email === formData.email && u.password === formData.password)
      if (user) {
        onLogin({
          id: user.id,
          email: user.email,
          username: user.username
        })
      } else {
        setError('Invalid email or password')
      }
    } else {
      // Sign up logic
      if (!formData.email || !formData.password || !formData.confirmPassword || !formData.username) {
        setError('Please fill in all fields')
        return
      }

      if (!validateEmail(formData.email)) {
        setError('Invalid email format')
        return
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters')
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return
      }

      if (users.some(u => u.email === formData.email)) {
        setError('Email already registered')
        return
      }

      const newUser = {
        id: Date.now(),
        email: formData.email,
        password: formData.password,
        username: formData.username,
        createdAt: new Date().toISOString()
      }

      const updatedUsers = [...users, newUser]
      setUsers(updatedUsers)
      localStorage.setItem('users', JSON.stringify(updatedUsers))

      onSignUp({
        id: newUser.id,
        email: newUser.email,
        username: newUser.username
      })
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setFormData({ email: '', password: '', confirmPassword: '', username: '' })
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">{isLogin ? 'Login' : 'Sign Up'}</h1>
        <p className="auth-subtitle">{isLogin ? 'Welcome back!' : 'Create your account'}</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="form-input"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="form-input"
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="form-input"
              />
            </div>
          )}

          <button type="submit" className="submit-btn">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="toggle-mode">
          <p>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button type="button" onClick={toggleMode} className="toggle-btn">
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
