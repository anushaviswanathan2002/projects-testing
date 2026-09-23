import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('memgame_session')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem('memgame_session')
      }
    }
    setLoading(false)
  }, [])

  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem('memgame_users') || '[]')
    } catch {
      return []
    }
  }

  function saveUsers(users) {
    localStorage.setItem('memgame_users', JSON.stringify(users))
  }

  function signup({ username, email, password }) {
    const users = getUsers()
    if (users.find((u) => u.email === email)) {
      return { error: 'An account with this email already exists.' }
    }
    if (users.find((u) => u.username === username)) {
      return { error: 'This username is already taken.' }
    }
    const newUser = {
      id: crypto.randomUUID(),
      username,
      email,
      password,
      createdAt: Date.now(),
      scores: [],
    }
    saveUsers([...users, newUser])
    const session = { id: newUser.id, username: newUser.username, email: newUser.email }
    localStorage.setItem('memgame_session', JSON.stringify(session))
    setUser(session)
    return { success: true }
  }

  function login({ email, password }) {
    const users = getUsers()
    const found = users.find((u) => u.email === email && u.password === password)
    if (!found) {
      return { error: 'Invalid email or password.' }
    }
    const session = { id: found.id, username: found.username, email: found.email }
    localStorage.setItem('memgame_session', JSON.stringify(session))
    setUser(session)
    return { success: true }
  }

  function logout() {
    localStorage.removeItem('memgame_session')
    setUser(null)
  }

  function saveScore({ moves, time, difficulty }) {
    if (!user) return
    const users = getUsers()
    const idx = users.findIndex((u) => u.id === user.id)
    if (idx === -1) return
    const score = { moves, time, difficulty, date: Date.now() }
    users[idx].scores = [score, ...(users[idx].scores || [])].slice(0, 20)
    saveUsers(users)
  }

  function getLeaderboard() {
    const users = getUsers()
    const entries = []
    for (const u of users) {
      for (const s of u.scores || []) {
        entries.push({ username: u.username, ...s })
      }
    }
    return entries.sort((a, b) => a.moves - b.moves || a.time - b.time)
  }

  function getUserScores() {
    if (!user) return []
    const users = getUsers()
    const found = users.find((u) => u.id === user.id)
    return found?.scores || []
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, saveScore, getLeaderboard, getUserScores }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
