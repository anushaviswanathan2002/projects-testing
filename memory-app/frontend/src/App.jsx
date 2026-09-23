import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import GamePage from './pages/GamePage';
import './App.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username'));

  const handleLoginSuccess = (token, username) => {
    setToken(token);
    setUsername(username);
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    setCurrentPage('game');
  };

  const handleLogout = () => {
    setToken(null);
    setUsername(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setCurrentPage('login');
  };

  return (
    <div className="app">
      {!token ? (
        <>
          {currentPage === 'login' && (
            <LoginPage
              onLoginSuccess={handleLoginSuccess}
              onSwitchToSignup={() => setCurrentPage('signup')}
            />
          )}
          {currentPage === 'signup' && (
            <SignupPage
              onSignupSuccess={handleLoginSuccess}
              onSwitchToLogin={() => setCurrentPage('login')}
            />
          )}
        </>
      ) : (
        <GamePage username={username} token={token} onLogout={handleLogout} />
      )}
    </div>
  );
}
