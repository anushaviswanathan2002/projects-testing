import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);
const USERS_KEY = 'todoapp.users';
const SESSION_KEY = 'todoapp.session';

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

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => readSession());

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [currentUser]);

  const signup = (username, password) => {
    const trimmed = username.trim();
    if (!trimmed) return { ok: false, error: 'Username is required.' };
    if (trimmed.length < 3) return { ok: false, error: 'Username must be at least 3 characters.' };
    if (!password || password.length < 4) return { ok: false, error: 'Password must be at least 4 characters.' };

    const users = readUsers();
    if (users[trimmed]) return { ok: false, error: 'That username is already taken.' };

    users[trimmed] = { password };
    writeUsers(users);

    const user = { username: trimmed };
    setCurrentUser(user);
    return { ok: true, user };
  };

  const login = (username, password) => {
    const trimmed = username.trim();
    if (!trimmed || !password) return { ok: false, error: 'Enter your username and password.' };

    const users = readUsers();
    const record = users[trimmed];
    if (!record || record.password !== password) {
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