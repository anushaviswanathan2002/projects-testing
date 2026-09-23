import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const USERS_KEY = 'memory_app_users';
const SESSION_KEY = 'memory_app_session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setLoading(false);
  }, []);

  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
    } catch {
      return {};
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function signup(username, password) {
    const users = getUsers();
    if (users[username]) {
      throw new Error('Username already taken');
    }
    const newUser = { username, password, scores: [], createdAt: Date.now() };
    users[username] = newUser;
    saveUsers(users);
    const session = { username };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
  }

  function login(username, password) {
    const users = getUsers();
    const found = users[username];
    if (!found || found.password !== password) {
      throw new Error('Invalid username or password');
    }
    const session = { username };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  function saveScore(score, time, difficulty) {
    const users = getUsers();
    if (!users[user.username]) return;
    const entry = { score, time: time ?? 0, difficulty: difficulty ?? 'Easy', date: Date.now() };
    users[user.username].scores = [entry, ...(users[user.username].scores || [])].slice(0, 20);
    saveUsers(users);
  }

  function getUserData() {
    if (!user) return null;
    const users = getUsers();
    return users[user.username] || null;
  }

  function getLeaderboard() {
    const users = getUsers();
    return Object.values(users)
      .map(u => ({
        username: u.username,
        bestScore: u.scores?.length
          ? Math.min(...u.scores.map(s => s.score))
          : null,
        gamesPlayed: u.scores?.length || 0,
      }))
      .filter(u => u.bestScore !== null)
      .sort((a, b) => a.bestScore - b.bestScore);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, saveScore, getUserData, getLeaderboard }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
