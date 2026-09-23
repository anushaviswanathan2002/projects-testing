import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const AuthContext = createContext(null)

const USERS_KEY = 'memory-app:users'
const SESSION_KEY = 'memory-app:current-user'
const SCORES_KEY = 'memory-app:scores' // map of username -> {moves, seconds, at}

// Demo-grade hashing with Web Crypto SHA-256. Real apps need a server with
// bcrypt/argon2 — this is only here to avoid storing plaintext in localStorage.
async function hashPassword(password) {
  const data = new TextEncoder().encode(password)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function readUsers() {
  return readJson(USERS_KEY, {})
}
function readScores() {
  return readJson(SCORES_KEY, {})
}

function isBetter(candidate, current) {
  if (!current) return true
  if (candidate.moves !== current.moves) return candidate.moves < current.moves
  return candidate.seconds < current.seconds
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() =>
    readJson(SESSION_KEY, null)
  )
  const [, force] = useState(0)
  const bump = useCallback(() => force((n) => n + 1), [])

  useEffect(() => {
    if (currentUser) writeJson(SESSION_KEY, currentUser)
    else localStorage.removeItem(SESSION_KEY)
  }, [currentUser])

  const signup = useCallback(async ({ username, password }) => {
    const cleanUser = (username || '').trim()
    if (!cleanUser) throw new Error('Username is required')
    if (!password || password.length < 4)
      throw new Error('Password must be at least 4 characters')

    const users = readUsers()
    if (users[cleanUser]) throw new Error('Username is already taken')

    const passwordHash = await hashPassword(password)
    users[cleanUser] = {
      username: cleanUser,
      passwordHash,
      createdAt: Date.now(),
    }
    writeJson(USERS_KEY, users)
    setCurrentUser({ username: cleanUser })
    return { username: cleanUser }
  }, [])

  const login = useCallback(async ({ username, password }) => {
    const cleanUser = (username || '').trim()
    if (!cleanUser || !password)
      throw new Error('Enter your username and password')

    const users = readUsers()
    const record = users[cleanUser]
    if (!record) throw new Error('No account with that username')

    const passwordHash = await hashPassword(password)
    if (passwordHash !== record.passwordHash)
      throw new Error('Incorrect password')

    setCurrentUser({ username: cleanUser })
    return { username: cleanUser }
  }, [])

  const logout = useCallback(() => setCurrentUser(null), [])

  // ---- Score tracking (per-user best, plus a leaderboard view) ----

  const saveScore = useCallback(
    ({ moves, seconds }) => {
      if (!currentUser) return null
      const username = currentUser.username
      const scores = readScores()
      const prev = scores[username]
      const candidate = {
        username,
        moves,
        seconds,
        at: Date.now(),
      }
      if (!isBetter({ moves, seconds }, prev)) return prev || null
      scores[username] = candidate
      writeJson(SCORES_KEY, scores)
      bump()
      return candidate
    },
    [currentUser, bump]
  )

  const getBest = useCallback(() => {
    if (!currentUser) return null
    const scores = readScores()
    return scores[currentUser.username] || null
  }, [currentUser])

  const getLeaderboard = useCallback(() => {
    const scores = readScores()
    return Object.values(scores).sort((a, b) => {
      if (a.moves !== b.moves) return a.moves - b.moves
      return a.seconds - b.seconds
    })
  }, [])

  const value = useMemo(
    () => ({
      // Session
      currentUser,
      isAuthenticated: !!currentUser,
      username: currentUser?.username || null,
      // Auth
      login,
      signup,
      logout,
      // Scores
      saveScore,
      getBest,
      getLeaderboard,
    }),
    [currentUser, login, signup, logout, saveScore, getBest, getLeaderboard]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}