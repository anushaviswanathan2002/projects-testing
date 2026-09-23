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
    return <div className="loading">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <div className="nav-logo">🎮 Memory Game</div>
            {user ? (
              <div className="nav-links">
                <span className="nav-user">Hi, {user.username}!</span>
                <a href="/profile" className="nav-link">Profile</a>
                <a href="/game" className="nav-link">Play</a>
                <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
              </div>
            ) : (
              <div className="nav-links">
                <a href="/login" className="nav-link">Login</a>
                <a href="/signup" className="nav-link">Sign Up</a>
              </div>
            )}
          </div>
        </nav>

        <Routes>
          <Route path="/login" element={user ? <Navigate to="/game" /> : <Login onLogin={handleLogin} />} />
          <Route path="/signup" element={user ? <Navigate to="/game" /> : <Signup onSignup={handleLogin} />} />
          <Route path="/game" element={user ? <Game onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/login" />} />
          <Route path="/" element={user ? <Navigate to="/game" /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
