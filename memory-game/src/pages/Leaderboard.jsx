import { useAuth } from '../context/AuthContext'
import '../styles/leaderboard.css'

function formatTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, '0')
  const sec = (s % 60).toString().padStart(2, '0')
  return `${m}:${sec}`
}

function formatDate(ts) {
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

const MEDAL = ['🥇', '🥈', '🥉']

export default function Leaderboard() {
  const { user, getLeaderboard, getUserScores } = useAuth()
  const global = getLeaderboard().slice(0, 20)
  const mine = getUserScores()

  return (
    <div className="page-content leaderboard-page">
      <h1 className="lb-title">🏆 Leaderboard</h1>

      <section className="lb-section">
        <h2>Global Top 20</h2>
        {global.length === 0 ? (
          <p className="lb-empty">No scores yet. Be the first to play!</p>
        ) : (
          <div className="lb-table-wrap">
            <table className="lb-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Player</th>
                  <th>Difficulty</th>
                  <th>Moves</th>
                  <th>Time</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {global.map((entry, i) => (
                  <tr key={i} className={entry.username === user?.username ? 'highlight-row' : ''}>
                    <td className="rank-cell">{MEDAL[i] ?? i + 1}</td>
                    <td className="name-cell">{entry.username}</td>
                    <td className="diff-cell">
                      <span className={`badge badge-${entry.difficulty}`}>
                        {entry.difficulty.charAt(0).toUpperCase() + entry.difficulty.slice(1)}
                      </span>
                    </td>
                    <td>{entry.moves}</td>
                    <td>{formatTime(entry.time)}</td>
                    <td>{formatDate(entry.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {user && (
        <section className="lb-section">
          <h2>Your Recent Games</h2>
          {mine.length === 0 ? (
            <p className="lb-empty">You haven&apos;t finished a game yet.</p>
          ) : (
            <div className="lb-table-wrap">
              <table className="lb-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Difficulty</th>
                    <th>Moves</th>
                    <th>Time</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {mine.map((s, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>
                        <span className={`badge badge-${s.difficulty}`}>
                          {s.difficulty.charAt(0).toUpperCase() + s.difficulty.slice(1)}
                        </span>
                      </td>
                      <td>{s.moves}</td>
                      <td>{formatTime(s.time)}</td>
                      <td>{formatDate(s.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  )
}
