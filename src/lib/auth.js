// Lightweight client-side auth stored in localStorage.
// Note: This is a demo for a frontend-only app. In production, auth must run
// on a server. Passwords are hashed via SubtleCrypto SHA-256 with a per-user
// random salt before storage.

const USERS_KEY = 'memory:users'
const SESSION_KEY = 'memory:session'

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function sha256(text) {
  const data = new TextEncoder().encode(text)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return toHex(hash)
}

async function hashPassword(password, salt) {
  return sha256(`${salt}::${password}`)
}

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
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

export function isAuthAvailable() {
  return typeof crypto !== 'undefined' && !!crypto.subtle
}

export function getCurrentUser() {
  const session = loadSession()
  if (!session) return null
  const users = loadUsers()
  const user = users[session.username]
  if (!user) return null
  return { username: user.username, createdAt: user.createdAt }
}

export async function signup(username, password) {
  const trimmed = (username || '').trim()
  if (trimmed.length < 3) {
    return { ok: false, error: 'Username must be at least 3 characters.' }
  }
  if (!/^[a-zA-Z0-9_.-]+$/.test(trimmed)) {
    return {
      ok: false,
      error: 'Username may only contain letters, numbers, "_", ".", and "-".',
    }
  }
  if (!password || password.length < 6) {
    return { ok: false, error: 'Password must be at least 6 characters.' }
  }
  const users = loadUsers()
  if (users[trimmed]) {
    return { ok: false, error: 'That username is already taken.' }
  }
  const salt = crypto.randomUUID().replace(/-/g, '')
  const hash = await hashPassword(password, salt)
  users[trimmed] = {
    username: trimmed,
    salt,
    hash,
    createdAt: Date.now(),
  }
  saveUsers(users)
  const session = { username: trimmed, loggedInAt: Date.now() }
  saveSession(session)
  return { ok: true, user: { username: trimmed, createdAt: users[trimmed].createdAt } }
}

export async function login(username, password) {
  const trimmed = (username || '').trim()
  if (!trimmed || !password) {
    return { ok: false, error: 'Enter both username and password.' }
  }
  const users = loadUsers()
  const user = users[trimmed]
  if (!user) {
    return { ok: false, error: 'Invalid username or password.' }
  }
  const hash = await hashPassword(password, user.salt)
  if (hash !== user.hash) {
    return { ok: false, error: 'Invalid username or password.' }
  }
  const session = { username: trimmed, loggedInAt: Date.now() }
  saveSession(session)
  return { ok: true, user: { username: trimmed, createdAt: user.createdAt } }
}

export function logout() {
  saveSession(null)
}

// Per-user best scores, keyed by `memory:best:<username>`.
export function loadBestFor(username) {
  if (!username) return {}
  try {
    const raw = localStorage.getItem(`memory:best:${username}`)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function saveBestFor(username, best) {
  if (!username) return
  try {
    localStorage.setItem(`memory:best:${username}`, JSON.stringify(best))
  } catch {}
}
