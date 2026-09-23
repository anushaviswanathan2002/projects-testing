import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("mg_current_user");
    return saved ? JSON.parse(saved) : null;
  });

  const getUsers = () => {
    const data = localStorage.getItem("mg_users");
    return data ? JSON.parse(data) : [];
  };

  const saveUsers = (users) => {
    localStorage.setItem("mg_users", JSON.stringify(users));
  };

  const signUp = (username, email, password) => {
    const users = getUsers();
    if (users.find((u) => u.email === email)) {
      return { error: "An account with this email already exists." };
    }
    if (users.find((u) => u.username.toLowerCase() === username.toLowerCase())) {
      return { error: "This username is already taken." };
    }
    const newUser = {
      id: Date.now(),
      username,
      email,
      password,
      stats: { gamesPlayed: 0, bestMoves: null, bestTime: null },
    };
    saveUsers([...users, newUser]);
    setUser(newUser);
    localStorage.setItem("mg_current_user", JSON.stringify(newUser));
    return { success: true };
  };

  const login = (email, password) => {
    const users = getUsers();
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) return { error: "Invalid email or password." };
    setUser(found);
    localStorage.setItem("mg_current_user", JSON.stringify(found));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("mg_current_user");
  };

  const updateStats = (moves, time) => {
    if (!user) return;
    const users = getUsers();
    const updated = users.map((u) => {
      if (u.id !== user.id) return u;
      const stats = {
        gamesPlayed: u.stats.gamesPlayed + 1,
        bestMoves: u.stats.bestMoves === null ? moves : Math.min(u.stats.bestMoves, moves),
        bestTime: u.stats.bestTime === null ? time : Math.min(u.stats.bestTime, time),
      };
      return { ...u, stats };
    });
    saveUsers(updated);
    const updatedUser = updated.find((u) => u.id === user.id);
    setUser(updatedUser);
    localStorage.setItem("mg_current_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, signUp, login, logout, updateStats }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
