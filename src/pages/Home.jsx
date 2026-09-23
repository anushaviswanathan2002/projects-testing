import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
  const { isAuthenticated, username, getBest } = useAuth();
  const best = getBest();

  return (
    <section className="page page-home">
      <div className="hero">
        <h1>Train your brain.</h1>
        <p className="hero-sub">
          A classic memory card-matching game. Sign in to track your best runs
          and compete on the leaderboard.
        </p>
        {isAuthenticated ? (
          <div className="hero-cta">
            <Link to="/game" className="btn btn-primary btn-lg">▶ Play now</Link>
            <Link to="/leaderboard" className="btn btn-secondary btn-lg">
              View leaderboard
            </Link>
          </div>
        ) : (
          <div className="hero-cta">
            <Link to="/signup" className="btn btn-primary btn-lg">Get started</Link>
            <Link to="/login" className="btn btn-secondary btn-lg">I have an account</Link>
          </div>
        )}

        {isAuthenticated && best && (
          <div className="best-card">
            <div className="best-label">Your best</div>
            <div className="best-row">
              <span><strong>{best.moves}</strong> moves</span>
              <span><strong>{formatTime(best.seconds)}</strong></span>
            </div>
            <div className="best-user">Signed in as {username}</div>
          </div>
        )}
      </div>

      <div className="features-grid">
        <Feature icon="🎴" title="Flip & match">
          Click cards to reveal their symbol. Find every pair to win.
        </Feature>
        <Feature icon="⏱️" title="Beat your time">
          Fewer moves and a faster clock = better score.
        </Feature>
        <Feature icon="🏆" title="Leaderboard">
          Your best run is saved to your account and shown on the board.
        </Feature>
      </div>
    </section>
  );
}

function Feature({ icon, title, children }) {
  return (
    <div className="feature">
      <div className="feature-icon" aria-hidden>{icon}</div>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
}