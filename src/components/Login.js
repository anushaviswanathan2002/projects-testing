import React, { useState } from 'react';
import './Auth.css';

function Login({ onLogin, onToggleMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email, password);
    } else {
      alert('Please fill in all fields!');
    }
  };

  return (
    <div className="auth-form">
      <div className="auth-header">
        <h1>Welcome Back</h1>
        <p>Login to your account</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button type="submit" className="btn-primary">
          Login
        </button>
      </form>

      <div className="auth-footer">
        <p>Don't have an account? <button onClick={onToggleMode} className="link-btn">Sign up</button></p>
      </div>
    </div>
  );
}

export default Login;
