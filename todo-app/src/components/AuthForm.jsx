import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthForm({ mode }) {
  const { login, signup } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isSignup = mode === 'signup';
  const heading = isSignup ? 'Create your account' : 'Welcome back';
  const subheading = isSignup ? 'Sign up to start tracking your tasks.' : 'Log in to pick up where you left off.';
  const cta = isSignup ? 'Sign up' : 'Log in';
  const switchPrompt = isSignup ? 'Already have an account?' : "Don't have an account?";
  const switchLabel = isSignup ? 'Log in' : 'Sign up';
  const switchTarget = isSignup ? 'login' : 'signup';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = isSignup ? signup(username, password) : login(username, password);
    if (!result.ok) setError(result.error);
  };

  return (
    <div className="auth-card">
      <h1 className="auth-title">{heading}</h1>
      <p className="auth-subtitle">{subheading}</p>

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <label className="field">
          <span className="field-label">Username</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="your-name"
            autoComplete="username"
            autoFocus
          />
        </label>

        <label className="field">
          <span className="field-label">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete={isSignup ? 'new-password' : 'current-password'}
          />
        </label>

        {error && <div className="auth-error" role="alert">{error}</div>}

        <button type="submit" className="btn btn-primary btn-block">{cta}</button>
      </form>

      <p className="auth-switch">
        {switchPrompt}{' '}
        <a
          href={`#/${switchTarget}`}
          onClick={(e) => {
            e.preventDefault();
            window.location.hash = `/${switchTarget}`;
            setError('');
          }}
        >
          {switchLabel}
        </a>
      </p>
    </div>
  );
}