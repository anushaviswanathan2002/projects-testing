function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function Stats({ moves, time, matchedCount, totalPairs }) {
  return (
    <div className="stats" role="status" aria-live="polite">
      <div className="stats__item">
        <span className="stats__label">Moves</span>
        <span className="stats__value">{moves}</span>
      </div>
      <div className="stats__item">
        <span className="stats__label">Time</span>
        <span className="stats__value">{formatTime(time)}</span>
      </div>
      <div className="stats__item">
        <span className="stats__label">Pairs</span>
        <span className="stats__value">
          {matchedCount} / {totalPairs}
        </span>
      </div>
    </div>
  )
}

export default Stats