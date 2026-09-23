import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login({ onSwitch }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = login(form.username.trim(), form.password);
    setLoading(false);
    if (res.error) setError(res.error);
  };

  return (
    <div className="auth-card">
      <div className="auth-logo">🧠</div>
      <h1 className="auth-title">Memory Game</h1>
      <p className="auth-subtitle">Sign in to track your scores</p>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="field">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            autoFocus
          />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <p className="auth-switch">
        No account?{' '}
        <button className="link-btn" onClick={onSwitch}>
          Create one
        </button>
      </p>
    </div>
  );
}
