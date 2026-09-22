import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const handleSignup = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setAuthMode('login');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    setAuthMode('login');
  };

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <>
      {authMode === 'login' ? (
        <Login
          onLogin={handleLogin}
          onSwitchToSignup={() => setAuthMode('signup')}
        />
      ) : (
        <Signup
          onSignup={handleSignup}
          onSwitchToLogin={() => setAuthMode('login')}
        />
      )}
    </>
  );
}

export default App;
