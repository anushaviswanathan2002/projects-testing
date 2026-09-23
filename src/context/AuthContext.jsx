import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('memory_current_user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const getUsers = () => {
    return JSON.parse(localStorage.getItem('memory_users') || '[]');
  };

  const saveUsers = (users) => {
    localStorage.setItem('memory_users', JSON.stringify(users));
  };

  const signup = (username, password) => {
    const users = getUsers();
    if (users.find((u) => u.username.toLowerCase() === username.toLowerCase())) {
      return { error: 'Username already taken.' };
    }
    if (username.length < 3) return { error: 'Username must be at least 3 characters.' };
    if (password.length < 6) return { error: 'Password must be at least 6 characters.' };

    const newUser = { username, password, stats: { wins: 0, bestTime: null, gamesPlayed: 0 } };
    saveUsers([...users, newUser]);
    setUser(newUser);
    localStorage.setItem('memory_current_user', JSON.stringify(newUser));
    return { success: true };
  };

  const login = (username, password) => {
    const users = getUsers();
    const found = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );
    if (!found) return { error: 'Invalid username or password.' };
    setUser(found);
    localStorage.setItem('memory_current_user', JSON.stringify(found));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('memory_current_user');
  };

  const updateStats = (timeSeconds, won) => {
    const users = getUsers();
    const idx = users.findIndex((u) => u.username === user.username);
    if (idx === -1) return;
    const u = users[idx];
    u.stats.gamesPlayed += 1;
    if (won) {
      u.stats.wins += 1;
      if (u.stats.bestTime === null || timeSeconds < u.stats.bestTime) {
        u.stats.bestTime = timeSeconds;
      }
    }
    users[idx] = u;
    saveUsers(users);
    setUser({ ...u });
    localStorage.setItem('memory_current_user', JSON.stringify(u));
  };

  const getLeaderboard = () => {
    const users = getUsers();
    return users
      .filter((u) => u.stats.wins > 0)
      .sort((a, b) => {
        if (a.stats.bestTime === null) return 1;
        if (b.stats.bestTime === null) return -1;
        return a.stats.bestTime - b.stats.bestTime;
      });
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, updateStats, getLeaderboard }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
