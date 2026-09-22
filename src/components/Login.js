import React, { useState } from 'react';
import '../styles/Auth.css';

function Login({ onLogin, onSwitchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (!users[email]) {
      setError('User not found. Please sign up first');
      return;
    }

    if (users[email].password !== password) {
      setError('Invalid password');
      return;
    }

    onLogin({ email, name: users[email].name });
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn-primary">Login</button>
        </form>
        <p className="switch-auth">
          Don't have an account?{' '}
          <button onClick={onSwitchToSignup} className="switch-btn">
            Sign up here
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
