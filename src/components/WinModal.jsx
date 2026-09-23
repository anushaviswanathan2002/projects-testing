function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function WinModal({ open, moves, time, best, onPlayAgain }) {
  if (!open) return null
  const isNewBest = best && best.moves === moves && best.time === time
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="win-title">
      <div className="modal">
        <div className="modal-icon">🎉</div>
        <h2 id="win-title">You matched them all!</h2>
        {isNewBest && <p className="new-best">✨ New personal best!</p>}
        <div className="modal-stats">
          <div>
            <span className="stat-label">Moves</span>
            <span className="stat-value">{moves}</span>
          </div>
          <div>
            <span className="stat-label">Time</span>
            <span className="stat-value">{formatTime(time)}</span>
          </div>
        </div>
        <button type="button" className="btn primary" onClick={onPlayAgain}>
          Play again
        </button>
      </div>
    </div>
  )
}

export default WinModal
