import { useEffect, useState, useCallback } from 'react'
import { AuthContext } from './authContextValue'

const USERS_KEY = 'memory_app_users_v1'
const SESSION_KEY = 'memory_app_session_v1'

async function hashPassword(password, salt = 'memory_app_salt_v1') {
  const enc = new TextEncoder()
  const data = enc.encode(`${salt}::${password}`)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveSession(session) {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } else {
    localStorage.removeItem(SESSION_KEY)
  }
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => loadUsers())
  const [user, setUser] = useState(() => loadSession())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    saveSession(user)
  }, [user])

  const signup = useCallback(async (username, password) => {
    setError(null)
    setLoading(true)
    try {
      const name = username.trim()
      if (name.length < 3) throw new Error('Username must be at least 3 characters.')
      if (name.length > 20) throw new Error('Username must be 20 characters or fewer.')
      if (!/^[A-Za-z0-9_.-]+$/.test(name)) {
        throw new Error('Username may only contain letters, numbers, "_", ".", and "-".')
      }
      if (password.length < 6) throw new Error('Password must be at least 6 characters.')

      const current = loadUsers()
      if (current.some((u) => u.username.toLowerCase() === name.toLowerCase())) {
        throw new Error('That username is already taken.')
      }

      const hash = await hashPassword(password)
      const newUser = {
        username: name,
        hash,
        createdAt: new Date().toISOString(),
      }
      const updated = [...current, newUser]
      saveUsers(updated)
      setUsers(updated)
      setUser({ username: name, loggedInAt: new Date().toISOString() })
      return true
    } catch (e) {
      setError(e.message)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (username, password) => {
    setError(null)
    setLoading(true)
    try {
      const name = username.trim()
      if (!name || !password) throw new Error('Please enter your username and password.')

      const current = loadUsers()
      const found = current.find((u) => u.username.toLowerCase() === name.toLowerCase())
      if (!found) throw new Error('No account found with that username.')

      const hash = await hashPassword(password)
      if (hash !== found.hash) throw new Error('Incorrect password.')

      setUser({ username: found.username, loggedInAt: new Date().toISOString() })
      return true
    } catch (e) {
      setError(e.message)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const value = { user, users, signup, login, logout, loading, error, clearError: () => setError(null) }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
