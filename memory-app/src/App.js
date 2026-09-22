import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const handleLogin = (username, password) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser({ username, userId: user.id });
    } else {
      alert('Invalid username or password');
    }
  };

  const handleSignup = (username, password) => {
    if (users.some(u => u.username === username)) {
      alert('Username already exists');
      return;
    }
    const newUser = {
      id: Date.now(),
      username,
      password,
      stats: { gamesPlayed: 0, bestTime: null, bestMoves: null }
    };
    setUsers([...users, newUser]);
    setCurrentUser({ username, userId: newUser.id });
    setIsSigningUp(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return (
      <div className="auth-container">
        {isSigningUp ? (
          <>
            <Signup onSignup={handleSignup} />
            <p className="toggle-auth">
              Already have an account? <button onClick={() => setIsSigningUp(false)}>Login</button>
            </p>
          </>
        ) : (
          <>
            <Login onLogin={handleLogin} />
            <p className="toggle-auth">
              Don't have an account? <button onClick={() => setIsSigningUp(true)}>Sign up</button>
            </p>
          </>
        )}
      </div>
    );
  }

  return <Dashboard user={currentUser} onLogout={handleLogout} />;
}

export default App;
