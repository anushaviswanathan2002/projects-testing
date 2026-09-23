import { createContext, useContext, useEffect, useState, useMemo } from 'react'

const AuthContext = createContext(null)

const USERS_KEY = 'memory-app:users'
const SESSION_KEY = 'memory-app:current-user'

// Hash password with SHA-256 using Web Crypto. Demo-only; real apps need
// a server with bcrypt/argon2.
async function hashPassword(password) {
  const data = new TextEncoder().encode(password)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}')
  } catch {
    return {}
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser))
    } else {
      localStorage.removeItem(SESSION_KEY)
    }
  }, [currentUser])

  const signup = useMemo(
    () =>
      async ({ username, password }) => {
        const cleanUser = (username || '').trim()
        if (!cleanUser) throw new Error('Username is required')
        if (!password || password.length < 4)
          throw new Error('Password must be at least 4 characters')

        const users = readUsers()
        if (users[cleanUser]) throw new Error('Username is already taken')

        const passwordHash = await hashPassword(password)
        users[cleanUser] = { username: cleanUser, passwordHash, createdAt: Date.now() }
        writeUsers(users)
        setCurrentUser({ username: cleanUser })
        return { username: cleanUser }
      },
    []
  )

  const login = useMemo(
    () =>
      async ({ username, password }) => {
        const cleanUser = (username || '').trim()
        if (!cleanUser || !password) throw new Error('Enter your username and password')

        const users = readUsers()
        const record = users[cleanUser]
        if (!record) throw new Error('No account with that username')

        const passwordHash = await hashPassword(password)
        if (passwordHash !== record.passwordHash)
          throw new Error('Incorrect password')

        setCurrentUser({ username: cleanUser })
        return { username: cleanUser }
      },
    []
  )

  const logout = () => setCurrentUser(null)

  const value = { currentUser, signup, login, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}