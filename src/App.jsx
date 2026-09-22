import { useState, useEffect } from 'react'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [currentPage, setCurrentPage] = useState('login')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('users')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users))
  }, [users])

  const handleLogin = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password)
    if (user) {
      setIsLoggedIn(true)
      setCurrentUser(user)
      return { success: true }
    }
    return { success: false, message: 'Invalid email or password' }
  }

  const handleSignup = (name, email, password, confirmPassword) => {
    if (password !== confirmPassword) {
      return { success: false, message: 'Passwords do not match' }
    }
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Email already registered' }
    }
    const newUser = { id: Date.now(), name, email, password }
    setUsers([...users, newUser])
    return { success: true }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentUser(null)
    setCurrentPage('login')
  }

  if (isLoggedIn) {
    return <Dashboard user={currentUser} onLogout={handleLogout} />
  }

  return (
    <>
      {currentPage === 'login' && (
        <LoginPage 
          onLogin={handleLogin} 
          onToggleToSignup={() => setCurrentPage('signup')}
        />
      )}
      {currentPage === 'signup' && (
        <SignupPage 
          onSignup={handleSignup} 
          onToggleToLogin={() => setCurrentPage('login')}
        />
      )}
    </>
  )
}
