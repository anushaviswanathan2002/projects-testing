import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

export default function Signup({ onSwitch }) {
  const { signup } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handle(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  }

  async function submit(e) {
    e.preventDefault();
    const { username, email, password, confirm } = form;
    if (!username || !email || !password || !confirm) { setError('Please fill in all fields.'); return; }
    if (username.length < 3) { setError('Username must be at least 3 characters.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      signup(username, email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card card">
        <div className="auth-logo">🧠</div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Start your memory training today</p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={submit} className="auth-form">
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              id="username" name="username" type="text"
              className="input" placeholder="e.g. MemoryMaster"
              value={form.username} onChange={handle} autoComplete="username"
            />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email" name="email" type="email"
              className="input" placeholder="you@example.com"
              value={form.email} onChange={handle} autoComplete="email"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password <span className="hint">(min 6 chars)</span></label>
            <input
              id="password" name="password" type="password"
              className="input" placeholder="••••••••"
              value={form.password} onChange={handle} autoComplete="new-password"
            />
          </div>
          <div className="field">
            <label htmlFor="confirm">Confirm Password</label>
            <input
              id="confirm" name="confirm" type="password"
              className="input" placeholder="••••••••"
              value={form.confirm} onChange={handle} autoComplete="new-password"
            />
          </div>
          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <button className="link-btn" onClick={onSwitch}>Sign in</button>
        </p>
      </div>
    </div>
  );
}
