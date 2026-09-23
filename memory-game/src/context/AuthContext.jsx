import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('memoryGame_currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  function getUsers() {
    const users = localStorage.getItem('memoryGame_users');
    return users ? JSON.parse(users) : [];
  }

  function signup(username, password) {
    const users = getUsers();
    if (users.find(u => u.username === username)) {
      return { success: false, error: 'Username already exists.' };
    }
    const newUser = { username, password, bestScore: null, gamesPlayed: 0 };
    const updated = [...users, newUser];
    localStorage.setItem('memoryGame_users', JSON.stringify(updated));
    localStorage.setItem('memoryGame_currentUser', JSON.stringify(newUser));
    setUser(newUser);
    return { success: true };
  }

  function login(username, password) {
    const users = getUsers();
    const found = users.find(u => u.username === username && u.password === password);
    if (!found) {
      return { success: false, error: 'Invalid username or password.' };
    }
    localStorage.setItem('memoryGame_currentUser', JSON.stringify(found));
    setUser(found);
    return { success: true };
  }

  function logout() {
    localStorage.removeItem('memoryGame_currentUser');
    setUser(null);
  }

  function updateStats(moves) {
    const users = getUsers();
    const idx = users.findIndex(u => u.username === user.username);
    if (idx === -1) return;
    const updated = { ...users[idx] };
    updated.gamesPlayed = (updated.gamesPlayed || 0) + 1;
    if (updated.bestScore === null || moves < updated.bestScore) {
      updated.bestScore = moves;
    }
    users[idx] = updated;
    localStorage.setItem('memoryGame_users', JSON.stringify(users));
    localStorage.setItem('memoryGame_currentUser', JSON.stringify(updated));
    setUser(updated);
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
