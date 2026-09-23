import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const API_URL = 'http://localhost:3001/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for saved token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      verifyToken(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (tok) => {
    try {
      const response = await fetch(`${API_URL}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tok })
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        setToken(tok);
      } else {
        localStorage.removeItem('authToken');
      }
    } catch (error) {
      console.error('Verification error:', error);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, name) => {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    const data = await response.json();
    if (data.success) {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('authToken', data.token);
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const login = async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (data.success) {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('authToken', data.token);
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const logout = async () => {
    if (token) {
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
  };

  const updateScore = async (score) => {
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, score })
      });
      const data = await response.json();
      if (data.success) {
        setUser(prev => ({ ...prev, score: data.score }));
      }
    } catch (error) {
      console.error('Score update error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signup, login, logout, updateScore }}>
      {children}
    </AuthContext.Provider>
  );
}
