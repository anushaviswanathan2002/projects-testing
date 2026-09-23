import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Signup({ onSwitch }) {
  const { signup } = useAuth();
  const [form, setForm] = useState({ username: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    const res = signup(form.username.trim(), form.password);
    setLoading(false);
    if (res.error) setError(res.error);
  };

  return (
    <div className="auth-card">
      <div className="auth-logo">🧠</div>
      <h1 className="auth-title">Memory Game</h1>
      <p className="auth-subtitle">Create an account to get started</p>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="field">
          <label>Username</label>
          <input
            type="text"
            placeholder="Choose a username"
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
            placeholder="At least 6 characters"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
        <div className="field">
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Repeat your password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            required
          />
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? 'Creating account…' : 'Sign Up'}
        </button>
      </form>

      <p className="auth-switch">
        Already have an account?{' '}
        <button className="link-btn" onClick={onSwitch}>
          Sign in
        </button>
      </p>
    </div>
  );
}
