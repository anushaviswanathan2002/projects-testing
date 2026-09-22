import { useState } from 'react';
import './Auth.css';

function Auth({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const getUsers = () => {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  };

  const saveUsers = (users) => {
    localStorage.setItem('users', JSON.stringify(users));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Username and password are required');
      return false;
    }

    if (isSignUp) {
      if (!formData.email.trim()) {
        setError('Email is required for sign up');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const users = getUsers();

    if (isSignUp) {
      // Sign up
      const userExists = users.some(
        (u) => u.username === formData.username || u.email === formData.email
      );

      if (userExists) {
        setError('Username or email already exists');
        return;
      }

      const newUser = {
        id: Date.now(),
        username: formData.username,
        email: formData.email,
        password: formData.password, // In production, never store plain passwords!
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      saveUsers(users);
      
      onLogin({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      });
    } else {
      // Login
      const user = users.find(
        (u) => u.username === formData.username && u.password === formData.password
      );

      if (!user) {
        setError('Invalid username or password');
        return;
      }

      onLogin({
        id: user.id,
        username: user.username,
        email: user.email,
      });
    }

    setFormData({ username: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Memory App</h1>
        <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
            />
          </div>

          {isSignUp && (
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
            />
          </div>

          {isSignUp && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
              />
            </div>
          )}

          <button type="submit" className="submit-btn">
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <div className="auth-toggle">
          <p>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setFormData({ username: '', email: '', password: '', confirmPassword: '' });
                setError('');
              }}
              className="toggle-btn"
            >
              {isSignUp ? 'Login' : 'Sign Up'}
            </button>
          </p>
        </div>

        <div className="demo-info">
          <p>📝 Demo Credentials:</p>
          <p>Username: demo</p>
          <p>Password: demo123</p>
        </div>
      </div>
    </div>
  );
}

export default Auth;
