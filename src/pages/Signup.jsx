import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setBusy(true);
    try {
      await signup({ username, password });
      navigate('/game', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="page page-auth">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>Create your account</h1>
        <p className="muted">Pick a username and password to start playing.</p>

        <label>
          <span>Username</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            autoComplete="username"
            required
          />
        </label>

        <label>
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
            minLength={4}
          />
          <small className="hint">At least 4 characters.</small>
        </label>

        <label>
          <span>Confirm password</span>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            required
          />
        </label>

        {error && <div className="alert alert-error">{error}</div>}

        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'Creating account…' : 'Sign up'}
        </button>

        <div className="auth-foot">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </form>
    </section>
  );
}