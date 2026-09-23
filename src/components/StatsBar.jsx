function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function StatsBar({ moves, elapsed, matched, total, best }) {
  return (
    <section className="stats" aria-label="Game stats">
      <div className="stat">
        <span className="stat-label">Moves</span>
        <span className="stat-value">{moves}</span>
      </div>
      <div className="stat">
        <span className="stat-label">Time</span>
        <span className="stat-value">{formatTime(elapsed)}</span>
      </div>
      <div className="stat">
        <span className="stat-label">Matched</span>
        <span className="stat-value">
          {matched} <small>/ {total}</small>
        </span>
      </div>
      <div className="stat best">
        <span className="stat-label">Best</span>
        <span className="stat-value">
          {best ? `${best.moves} · ${formatTime(best.time)}` : '—'}
        </span>
      </div>
    </section>
  )
}

export default StatsBar
