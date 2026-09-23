import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('memoryGame_session');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  function getUsers() {
    return JSON.parse(localStorage.getItem('memoryGame_users') || '{}');
  }

  function saveUsers(users) {
    localStorage.setItem('memoryGame_users', JSON.stringify(users));
  }

  function signup(username, password) {
    const users = getUsers();
    if (users[username]) {
      return { ok: false, error: 'Username already taken.' };
    }
    users[username] = { password, bestScore: null, gamesPlayed: 0 };
    saveUsers(users);
    const sessionUser = { username, bestScore: null, gamesPlayed: 0 };
    setUser(sessionUser);
    localStorage.setItem('memoryGame_session', JSON.stringify(sessionUser));
    return { ok: true };
  }

  function login(username, password) {
    const users = getUsers();
    if (!users[username]) {
      return { ok: false, error: 'User not found.' };
    }
    if (users[username].password !== password) {
      return { ok: false, error: 'Incorrect password.' };
    }
    const sessionUser = {
      username,
      bestScore: users[username].bestScore,
      gamesPlayed: users[username].gamesPlayed,
    };
    setUser(sessionUser);
    localStorage.setItem('memoryGame_session', JSON.stringify(sessionUser));
    return { ok: true };
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('memoryGame_session');
  }

  function updateStats(moves) {
    if (!user) return;
    const users = getUsers();
    const u = users[user.username];
    u.gamesPlayed = (u.gamesPlayed || 0) + 1;
    if (u.bestScore === null || moves < u.bestScore) {
      u.bestScore = moves;
    }
    saveUsers(users);
    const updated = { username: user.username, bestScore: u.bestScore, gamesPlayed: u.gamesPlayed };
    setUser(updated);
    localStorage.setItem('memoryGame_session', JSON.stringify(updated));
  }

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, updateStats }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
