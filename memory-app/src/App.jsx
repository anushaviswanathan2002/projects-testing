import { useState, useEffect } from 'react'
import './App.css'
import Login from './components/Login'
import Signup from './components/Signup'
import Stopwatch from './components/Stopwatch'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [showSignup, setShowSignup] = useState(false)

  useEffect(() => {
    // Check if user is already logged in
    const loggedInUser = localStorage.getItem('currentUser')
    if (loggedInUser) {
      setCurrentUser(JSON.parse(loggedInUser))
    }
  }, [])

  const handleLogin = (username) => {
    setCurrentUser(username)
    localStorage.setItem('currentUser', JSON.stringify(username))
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('currentUser')
  }

  return (
    <div className="app-container">
      {!currentUser ? (
        <>
          {showSignup ? (
            <Signup 
              onSignup={handleLogin}
              onToggleLogin={() => setShowSignup(false)}
            />
          ) : (
            <Login 
              onLogin={handleLogin}
              onToggleSignup={() => setShowSignup(true)}
            />
          )}
        </>
      ) : (
        <div className="main-app">
          <div className="header">
            <h1>Welcome, {currentUser}! 🎯</h1>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
          <Stopwatch username={currentUser} />
        </div>
      )}
    </div>
  )
}

export default App
