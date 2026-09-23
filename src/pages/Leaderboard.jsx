import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export default function Leaderboard() {
  const { getLeaderboard, username } = useAuth();
  const rows = useMemo(() => getLeaderboard(), [getLeaderboard]);

  return (
    <section className="page page-leaderboard">
      <div className="leaderboard-header">
        <div>
          <h1>Leaderboard</h1>
          <p className="muted">
            Best run per player. Fewer moves beats faster time on ties.
          </p>
        </div>
        <Link to="/game" className="btn btn-primary">Play →</Link>
      </div>

      <div className="card">
        {rows.length === 0 ? (
          <div className="empty">
            <p>No scores yet. Be the first!</p>
            <Link to="/game" className="btn btn-secondary">Start a game</Link>
          </div>
        ) : (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Player</th>
                <th>Moves</th>
                <th>Time</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.username}
                  className={row.username === username ? 'is-me' : ''}
                >
                  <td>{i + 1}</td>
                  <td>
                    <span className="player-name">
                      {row.username}
                      {row.username === username && (
                        <span className="me-tag">you</span>
                      )}
                    </span>
                  </td>
                  <td>{row.moves}</td>
                  <td>{formatTime(row.seconds)}</td>
                  <td>{new Date(row.at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}