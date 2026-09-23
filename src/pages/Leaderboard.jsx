import { useAuth } from '../context/AuthContext';
import './Leaderboard.css';

function formatTime(ms) {
  if (!ms) return '--';
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}

export default function Leaderboard() {
  const { getLeaderboard, user } = useAuth();
  const entries = getLeaderboard();

  return (
    <div className="lb-page">
      <div className="lb-header">
        <h2 className="lb-title">🏆 Leaderboard</h2>
        <p className="lb-sub">Top 10 scores across all players</p>
      </div>

      {entries.length === 0 ? (
        <div className="lb-empty card">
          <span className="lb-empty-icon">🎮</span>
          <p>No scores yet — play a game to get on the board!</p>
        </div>
      ) : (
        <div className="lb-table card">
          <div className="lb-row lb-head">
            <span className="lb-col rank">#</span>
            <span className="lb-col player">Player</span>
            <span className="lb-col">Score</span>
            <span className="lb-col">Moves</span>
            <span className="lb-col">Time</span>
            <span className="lb-col diff">Difficulty</span>
          </div>
          {entries.map((e, i) => (
            <div key={i} className={`lb-row ${e.username === user.username ? 'lb-me' : ''}`}>
              <span className="lb-col rank">
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
              </span>
              <span className="lb-col player">
                {e.username}
                {e.username === user.username && <span className="you-badge">you</span>}
              </span>
              <span className="lb-col score-val">{e.score.toLocaleString()}</span>
              <span className="lb-col">{e.moves}</span>
              <span className="lb-col">{formatTime(e.time)}</span>
              <span className="lb-col diff">
                <span className={`diff-tag diff-${e.difficulty}`}>{e.difficulty}</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
