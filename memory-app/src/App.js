import React, { useState, useEffect } from 'react';
import './index.css';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);

  // Load users from localStorage on mount
  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    const loggedInUser = localStorage.getItem('currentUser');
    
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
    
    if (loggedInUser) {
      setCurrentUser(JSON.parse(loggedInUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleSignUp = (email, password) => {
    const userExists = users.some(user => user.email === email);
    
    if (userExists) {
      alert('User already exists');
      return false;
    }

    const newUser = { id: Date.now(), email, password };
    const updatedUsers = [...users, newUser];
    
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    alert('Sign up successful! Please log in.');
    return true;
  };

  const handleLogin = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      alert('Invalid email or password');
      return false;
    }

    setCurrentUser(user);
    setIsLoggedIn(true);
    localStorage.setItem('currentUser', JSON.stringify(user));
    return true;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('currentUser');
  };

  return (
    <div className="app">
      {isLoggedIn ? (
        <Dashboard user={currentUser} onLogout={handleLogout} />
      ) : (
        <AuthPage onSignUp={handleSignUp} onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
