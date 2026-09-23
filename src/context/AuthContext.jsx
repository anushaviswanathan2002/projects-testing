import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const USERS_KEY = 'memory-todo:users'
const SESSION_KEY = 'memory-todo:session'

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(SESSION_KEY)
    }
  }, [user])

  function signup({ username, email, password }) {
    const users = readUsers()
    if (users.some((u) => u.email === email)) {
      throw new Error('An account with that email already exists.')
    }
    if (users.some((u) => u.username === username)) {
      throw new Error('That username is taken.')
    }
    const newUser = {
      id: crypto.randomUUID(),
      username,
      email,
      password,
      createdAt: new Date().toISOString(),
    }
    writeUsers([...users, newUser])
    const sessionUser = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    }
    setUser(sessionUser)
    return sessionUser
  }

  function login({ email, password }) {
    const users = readUsers()
    const found = users.find(
      (u) => u.email === email && u.password === password,
    )
    if (!found) {
      throw new Error('Invalid email or password.')
    }
    const sessionUser = {
      id: found.id,
      username: found.username,
      email: found.email,
    }
    setUser(sessionUser)
    return sessionUser
  }

  function logout() {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
