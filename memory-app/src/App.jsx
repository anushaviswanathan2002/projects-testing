import { useState, useEffect } from 'react';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Load users from localStorage on app start
  useEffect(() => {
    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser) {
      setCurrentUser(JSON.parse(loggedInUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const handleSignUp = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.find(u => u.email === email);
    
    if (userExists) {
      return { success: false, error: 'User already exists' };
    }

    const newUser = { 
      id: Date.now(), 
      name, 
      email, 
      password,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    setIsSignUp(false);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return { success: true };
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setIsSignUp(false);
    localStorage.removeItem('currentUser');
  };

  return (
    <div className="app">
      {!isLoggedIn ? (
        <div className="auth-container">
          {isSignUp ? (
            <>
              <SignUp onSignUp={handleSignUp} />
              <p className="toggle-auth">
                Already have an account?{' '}
                <button 
                  onClick={() => setIsSignUp(false)}
                  className="link-button"
                >
                  Login
                </button>
              </p>
            </>
          ) : (
            <>
              <Login onLogin={handleLogin} />
              <p className="toggle-auth">
                Don't have an account?{' '}
                <button 
                  onClick={() => setIsSignUp(true)}
                  className="link-button"
                >
                  Sign up
                </button>
              </p>
            </>
          )}
        </div>
      ) : (
        <Dashboard user={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
