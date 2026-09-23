import { useAuth } from '../context/AuthContext';
import './Leaderboard.css';

function formatTime(s) {
  if (s === null) return '—';
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

const medals = ['🥇', '🥈', '🥉'];

export default function Leaderboard({ onBack }) {
  const { user, getLeaderboard, logout } = useAuth();
  const leaders = getLeaderboard();

  return (
    <div className="lb-page">
      <header className="game-header" style={{ maxWidth: 760, width: '100%', padding: '1rem 1.5rem' }}>
        <div className="header-left">
          <span className="header-logo">🧠</span>
          <span className="header-title">Memory</span>
        </div>
        <div className="header-right">
          <div className="user-pill">
            <span className="user-avatar">{user.username[0].toUpperCase()}</span>
            <span className="user-name">{user.username}</span>
          </div>
          <button className="icon-btn" onClick={logout} title="Logout">🚪</button>
        </div>
      </header>

      <div className="lb-container">
        <div className="lb-header">
          <h2>🏆 Leaderboard</h2>
          <p>Ranked by fastest winning time</p>
        </div>

        {/* Current user stats card */}
        <div className="my-stats">
          <h3>Your Stats</h3>
          <div className="my-stats-grid">
            <div className="my-stat">
              <span className="my-stat-val">{user.stats.gamesPlayed}</span>
              <span className="my-stat-label">Games</span>
            </div>
            <div className="my-stat">
              <span className="my-stat-val">{user.stats.wins}</span>
              <span className="my-stat-label">Wins</span>
            </div>
            <div className="my-stat">
              <span className="my-stat-val">{formatTime(user.stats.bestTime)}</span>
              <span className="my-stat-label">Best Time</span>
            </div>
          </div>
        </div>

        {leaders.length === 0 ? (
          <div className="lb-empty">
            <span>No winners yet — be the first! 🎮</span>
          </div>
        ) : (
          <div className="lb-table">
            <div className="lb-row lb-head">
              <span>#</span>
              <span>Player</span>
              <span>Best Time</span>
              <span>Wins</span>
            </div>
            {leaders.map((u, i) => (
              <div
                key={u.username}
                className={`lb-row ${u.username === user.username ? 'lb-me' : ''} ${i < 3 ? 'lb-top' : ''}`}
              >
                <span className="lb-rank">{medals[i] ?? i + 1}</span>
                <span className="lb-name">
                  {u.username}
                  {u.username === user.username && <span className="lb-you-badge">You</span>}
                </span>
                <span className="lb-time">{formatTime(u.stats.bestTime)}</span>
                <span className="lb-wins">{u.stats.wins}</span>
              </div>
            ))}
          </div>
        )}

        <button className="auth-btn" onClick={onBack} style={{ marginTop: '1.5rem' }}>
          ← Back to Game
        </button>
      </div>
    </div>
  );
}
