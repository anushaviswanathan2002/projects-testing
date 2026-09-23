import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('memory_session')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem('memory_session')
      }
    }
  }, [])

  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem('memory_users') || '[]')
    } catch {
      return []
    }
  }

  function signup(username, email, password) {
    const users = getUsers()
    if (users.find(u => u.email === email)) {
      throw new Error('An account with this email already exists.')
    }
    if (users.find(u => u.username === username)) {
      throw new Error('This username is already taken.')
    }
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password, // stored as-is for this demo; in production use hashing
      bestScore: null,
      gamesPlayed: 0,
    }
    users.push(newUser)
    localStorage.setItem('memory_users', JSON.stringify(users))
    const session = { id: newUser.id, username: newUser.username, email: newUser.email }
    localStorage.setItem('memory_session', JSON.stringify(session))
    setUser(session)
    return session
  }

  function login(email, password) {
    const users = getUsers()
    const found = users.find(u => u.email === email && u.password === password)
    if (!found) {
      throw new Error('Invalid email or password.')
    }
    const session = { id: found.id, username: found.username, email: found.email }
    localStorage.setItem('memory_session', JSON.stringify(session))
    setUser(session)
    return session
  }

  function logout() {
    localStorage.removeItem('memory_session')
    setUser(null)
  }

  function saveScore(moves, time) {
    const users = getUsers()
    const idx = users.findIndex(u => u.id === user.id)
    if (idx === -1) return
    users[idx].gamesPlayed += 1
    const score = { moves, time, date: new Date().toISOString() }
    if (!users[idx].bestScore || moves < users[idx].bestScore.moves ||
        (moves === users[idx].bestScore.moves && time < users[idx].bestScore.time)) {
      users[idx].bestScore = score
    }
    localStorage.setItem('memory_users', JSON.stringify(users))
    return users[idx]
  }

  function getUserStats() {
    if (!user) return null
    const users = getUsers()
    return users.find(u => u.id === user.id) || null
  }

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, saveScore, getUserStats }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
