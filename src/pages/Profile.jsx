import { useAuth } from '../context/AuthContext';
import './Profile.css';

function formatTime(ms) {
  if (!ms) return '--';
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Profile() {
  const { user, logout } = useAuth();
  const scores = user.scores || [];

  const bestScore = scores.length ? Math.max(...scores.map(s => s.score)) : null;
  const totalGames = scores.length;
  const avgScore = scores.length ? Math.round(scores.reduce((a, s) => a + s.score, 0) / scores.length) : null;

  return (
    <div className="profile-page">
      {/* Avatar card */}
      <div className="profile-hero card">
        <div className="profile-avatar">{user.username[0].toUpperCase()}</div>
        <div className="profile-info">
          <h2 className="profile-name">{user.username}</h2>
          <p className="profile-email">{user.email}</p>
        </div>
        <button className="btn btn-ghost btn-sm profile-logout" onClick={logout}>
          Sign Out
        </button>
      </div>

      {/* Stats */}
      <div className="profile-stats">
        <div className="pstat card">
          <span className="pstat-val">{totalGames}</span>
          <span className="pstat-label">Games Played</span>
        </div>
        <div className="pstat card">
          <span className="pstat-val accent">{bestScore !== null ? bestScore.toLocaleString() : '--'}</span>
          <span className="pstat-label">Best Score</span>
        </div>
        <div className="pstat card">
          <span className="pstat-val">{avgScore !== null ? avgScore.toLocaleString() : '--'}</span>
          <span className="pstat-label">Avg Score</span>
        </div>
      </div>

      {/* History */}
      <div className="profile-history card">
        <h3 className="history-title">Recent Games</h3>
        {scores.length === 0 ? (
          <p className="history-empty">No games yet — go play one!</p>
        ) : (
          <div className="history-list">
            {scores.map((s, i) => (
              <div key={i} className="history-row">
                <div className="hr-left">
                  <span className={`diff-dot diff-${s.difficulty}`} />
                  <span className="hr-diff">{s.difficulty}</span>
                  <span className="hr-date">{formatDate(s.date)}</span>
                </div>
                <div className="hr-right">
                  <span className="hr-score">{s.score.toLocaleString()} pts</span>
                  <span className="hr-meta">{s.moves} moves · {formatTime(s.time)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
