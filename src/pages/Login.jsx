import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login({ username, password });
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
        <h1>Welcome back</h1>
        <p className="muted">Log in to continue your memory training.</p>

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
            autoComplete="current-password"
            required
          />
        </label>

        {error && <div className="alert alert-error">{error}</div>}

        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'Signing in…' : 'Log in'}
        </button>

        <div className="auth-foot">
          New here? <Link to="/signup">Create an account</Link>
        </div>
      </form>
    </section>
  );
}