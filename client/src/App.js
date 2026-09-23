import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Game from './pages/Game';
import Profile from './pages/Profile';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading-spinner" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"   element={user ? <Navigate to="/game" replace /> : <Login onLogin={handleLogin} />} />
        <Route path="/signup"  element={user ? <Navigate to="/game" replace /> : <Signup onSignup={handleLogin} />} />
        <Route path="/game"    element={user ? <Game user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
        <Route path="/profile" element={user ? <Profile user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
        <Route path="*"        element={<Navigate to={user ? "/game" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
