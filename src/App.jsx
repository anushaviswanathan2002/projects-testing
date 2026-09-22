import React, { useState, useEffect } from 'react'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (user) => {
    setCurrentUser(user)
    setIsAuthenticated(true)
    localStorage.setItem('currentUser', JSON.stringify(user))
  }

  const handleSignUp = (user) => {
    setCurrentUser(user)
    setIsAuthenticated(true)
    localStorage.setItem('currentUser', JSON.stringify(user))
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('currentUser')
  }

  return (
    <div className="app">
      {isAuthenticated ? (
        <Dashboard user={currentUser} onLogout={handleLogout} />
      ) : (
        <AuthPage onLogin={handleLogin} onSignUp={handleSignUp} />
      )}
    </div>
  )
}

export default App
