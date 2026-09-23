import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('memoryGame_currentUser');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  function getUsers() {
    return JSON.parse(localStorage.getItem('memoryGame_users') || '[]');
  }

  function signup(username, email, password) {
    const users = getUsers();
    if (users.find(u => u.email === email)) {
      throw new Error('An account with this email already exists.');
    }
    if (users.find(u => u.username === username)) {
      throw new Error('This username is already taken.');
    }
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password, // In a real app, hash this — localStorage is demo-only
      createdAt: new Date().toISOString(),
      scores: [],
    };
    users.push(newUser);
    localStorage.setItem('memoryGame_users', JSON.stringify(users));
    const { password: _p, ...safeUser } = newUser;
    localStorage.setItem('memoryGame_currentUser', JSON.stringify(safeUser));
    setUser(safeUser);
  }

  function login(email, password) {
    const users = getUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) throw new Error('Invalid email or password.');
    const { password: _p, ...safeUser } = found;
    localStorage.setItem('memoryGame_currentUser', JSON.stringify(safeUser));
    setUser(safeUser);
  }

  function logout() {
    localStorage.removeItem('memoryGame_currentUser');
    setUser(null);
  }

  function saveScore(score) {
    const users = getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx === -1) return;
    users[idx].scores = [score, ...(users[idx].scores || [])].slice(0, 10);
    localStorage.setItem('memoryGame_users', JSON.stringify(users));
    const { password: _p, ...safeUser } = users[idx];
    localStorage.setItem('memoryGame_currentUser', JSON.stringify(safeUser));
    setUser(safeUser);
  }

  function getLeaderboard() {
    const users = getUsers();
    const entries = [];
    users.forEach(u => {
      if (u.scores && u.scores.length > 0) {
        const best = u.scores.reduce((b, s) => s.score > b.score ? s : b, u.scores[0]);
        entries.push({ username: u.username, ...best });
      }
    });
    return entries.sort((a, b) => b.score - a.score).slice(0, 10);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, saveScore, getLeaderboard }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
