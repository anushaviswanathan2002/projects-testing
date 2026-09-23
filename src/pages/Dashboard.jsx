import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function Dashboard({ onPlay }) {
  const { user, logout, getUserData, getLeaderboard } = useAuth();
  const userData = getUserData();
  const leaderboard = getLeaderboard();
  const scores = userData?.scores || [];
  const bestScore = scores.length ? Math.min(...scores.map(s => s.score)) : null;

  function formatScore(moves) {
    return `${moves} move${moves !== 1 ? 's' : ''}`;
  }

  function formatDate(ts) {
    return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  return (
    <div className="dashboard-bg">
      <header className="dash-header">
        <div className="dash-logo">🧠 Memory Game</div>
        <div className="dash-user">
          <span className="dash-avatar">{user.username[0].toUpperCase()}</span>
          <span className="dash-username">{user.username}</span>
          <button className="dash-logout" onClick={logout} title="Log out">
            ⎋ Logout
          </button>
        </div>
      </header>

      <main className="dash-main">
        <section className="dash-hero">
          <div className="hero-content">
            <h2 className="hero-title">Ready to play?</h2>
            <p className="hero-desc">
              Flip cards and find all matching pairs. Fewer moves = better score!
            </p>
            <div className="hero-stats">
              <div className="stat-box">
                <span className="stat-value">{scores.length}</span>
                <span className="stat-label">Games Played</span>
              </div>
              <div className="stat-box">
                <span className="stat-value">{bestScore !== null ? formatScore(bestScore) : '—'}</span>
                <span className="stat-label">Best Score</span>
              </div>
            </div>
            <button className="play-btn" onClick={onPlay}>
              🎮 Play Now
            </button>
          </div>
          <div className="hero-cards-preview">
            {['🐶', '🐱', '🦊', '🐼'].map((e, i) => (
              <div key={i} className={`preview-card preview-card-${i}`}>{e}</div>
            ))}
          </div>
        </section>

        <div className="dash-grid">
          <section className="dash-section recent-section">
            <h3 className="section-title">📋 Recent Games</h3>
            {scores.length === 0 ? (
              <p className="empty-msg">No games yet. Play your first game!</p>
            ) : (
              <ul className="score-list">
                {scores.slice(0, 8).map((s, i) => (
                  <li key={i} className="score-item">
                    <span className="score-rank">#{i + 1}</span>
                    <span className="score-moves">{formatScore(s.score)}</span>
                    <span className="score-date">{formatDate(s.date)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="dash-section leaderboard-section">
            <h3 className="section-title">🏆 Leaderboard</h3>
            {leaderboard.length === 0 ? (
              <p className="empty-msg">Be the first to set a score!</p>
            ) : (
              <ul className="leaderboard-list">
                {leaderboard.slice(0, 8).map((entry, i) => (
                  <li
                    key={entry.username}
                    className={`lb-item ${entry.username === user.username ? 'lb-item-me' : ''}`}
                  >
                    <span className="lb-rank">{MEDALS[i] || `#${i + 1}`}</span>
                    <span className="lb-name">
                      {entry.username}
                      {entry.username === user.username && <span className="lb-you"> (you)</span>}
                    </span>
                    <span className="lb-score">{formatScore(entry.bestScore)}</span>
                    <span className="lb-games">{entry.gamesPlayed}g</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
