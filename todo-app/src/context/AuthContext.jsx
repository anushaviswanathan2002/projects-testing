import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);
const USERS_KEY = 'todoapp.users';
const SESSION_KEY = 'todoapp.session';

// PBKDF2 parameters — Web Crypto API
const PBKDF2_ITERATIONS = 100000;
const PBKDF2_HASH = 'SHA-256';
const SALT_BYTES = 16;
const KEY_BITS = 256;

// Prefix used to mark records that were hashed with PBKDF2.
// Plaintext (legacy) records have no `$` separator and are ignored on login.
const HASH_PREFIX = 'pbkdf2$';

// ---------------------------------------------------------------------------
// Base64 helpers (standard encoding, not urlsafe)
// ---------------------------------------------------------------------------
function bytesToBase64(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBytes(b64) {
  const binary = atob(b64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    out[i] = binary.charCodeAt(i);
  }
  return out;
}

// ---------------------------------------------------------------------------
// PBKDF2 hashing via Web Crypto
// ---------------------------------------------------------------------------
async function pbkdf2Hash(password, saltBytes, iterations = PBKDF2_ITERATIONS) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations,
      hash: PBKDF2_HASH,
    },
    keyMaterial,
    KEY_BITS
  );
  return new Uint8Array(derivedBits);
}

// Encode a hashed record as: pbkdf2$<iters>$<saltB64>$<hashB64>
function encodeHashRecord(saltBytes, hashBytes, iterations) {
  return `${HASH_PREFIX}${iterations}$${bytesToBase64(saltBytes)}$${bytesToBase64(hashBytes)}`;
}

function decodeHashRecord(record) {
  if (typeof record !== 'string' || !record.startsWith(HASH_PREFIX)) return null;
  const parts = record.split('$');
  if (parts.length !== 4) return null;
  const iterations = parseInt(parts[1], 10);
  if (!Number.isFinite(iterations) || iterations < 100000) return null;
  try {
    const salt = base64ToBytes(parts[2]);
    const hash = base64ToBytes(parts[3]);
    return { iterations, salt, hash };
  } catch {
    return null;
  }
}

// Constant-time byte comparison. XOR-accumulate so total time depends only on
// the length of the buffer, not on which byte differs.
function constantTimeEqual(a, b) {
  if (!(a instanceof Uint8Array) || !(b instanceof Uint8Array)) return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

// ---------------------------------------------------------------------------
// localStorage helpers
// ---------------------------------------------------------------------------
function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => readSession());

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [currentUser]);

  const signup = async (username, password) => {
    const trimmed = (username || '').trim();
    if (!trimmed) return { ok: false, error: 'Username is required.' };
    if (trimmed.length < 3) return { ok: false, error: 'Username must be at least 3 characters.' };
    if (!password || password.length < 6) return { ok: false, error: 'Password must be at least 6 characters.' };

    const users = readUsers();
    if (users[trimmed]) return { ok: false, error: 'That username is already taken.' };

    // Generate a fresh random 16-byte salt and derive the hash.
    const saltBytes = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
    const hashBytes = await pbkdf2Hash(password, saltBytes, PBKDF2_ITERATIONS);

    users[trimmed] = { password: encodeHashRecord(saltBytes, hashBytes, PBKDF2_ITERATIONS) };
    writeUsers(users);

    const user = { username: trimmed };
    setCurrentUser(user);
    return { ok: true, user };
  };

  const login = async (username, password) => {
    const trimmed = (username || '').trim();
    if (!trimmed || !password) return { ok: false, error: 'Enter your username and password.' };

    const users = readUsers();
    const record = users[trimmed];

    // Migration guard: if the stored record is legacy plaintext (no `pbkdf2$`
    // prefix), do NOT attempt a plaintext compare. Treat it as "invalid" so
    // signup can later overwrite it.
    const decoded = decodeHashRecord(record && record.password);
    if (!decoded) {
      return { ok: false, error: 'Invalid username or password.' };
    }

    const candidate = await pbkdf2Hash(password, decoded.salt, decoded.iterations);
    if (!constantTimeEqual(candidate, decoded.hash)) {
      return { ok: false, error: 'Invalid username or password.' };
    }

    const user = { username: trimmed };
    setCurrentUser(user);
    return { ok: true, user };
  };

  const logout = () => setCurrentUser(null);

  return (
    <AuthContext.Provider value={{ currentUser, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
