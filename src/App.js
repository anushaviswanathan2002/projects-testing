import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    const storedCurrentUser = localStorage.getItem('currentUser');
    
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
    if (storedCurrentUser) {
      setCurrentUser(JSON.parse(storedCurrentUser));
    }
  }, []);

  const handleSignup = (email, password, name) => {
    const userExists = users.some(user => user.email === email);
    
    if (userExists) {
      alert('Email already registered!');
      return;
    }

    const newUser = {
      id: Date.now(),
      email,
      password,
      name,
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    setCurrentUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setIsSignupMode(false);
  };

  const handleLogin = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      alert('Invalid email or password!');
      return;
    }

    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  if (!currentUser) {
    return (
      <div className="auth-container">
        {isSignupMode ? (
          <Signup 
            onSignup={handleSignup}
            onToggleMode={() => setIsSignupMode(false)}
          />
        ) : (
          <Login 
            onLogin={handleLogin}
            onToggleMode={() => setIsSignupMode(true)}
          />
        )}
      </div>
    );
  }

  return (
    <Dashboard 
      user={currentUser}
      onLogout={handleLogout}
    />
  );
}

export default App;
