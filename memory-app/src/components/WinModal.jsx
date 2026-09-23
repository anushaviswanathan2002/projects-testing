import { useEffect } from 'react'

export default function WinModal({ open, moves, time, pairs, onPlayAgain }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter') onPlayAgain()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onPlayAgain])

  if (!open) return null

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="win-title">
      <div className="modal">
        <div className="modal-icon" aria-hidden="true">🎉</div>
        <h2 id="win-title" className="modal-title">You matched them all!</h2>
        <p className="modal-subtitle">{pairs} pairs cleared</p>
        <div className="modal-stats">
          <div className="modal-stat">
            <span className="modal-stat-label">Moves</span>
            <span className="modal-stat-value">{moves}</span>
          </div>
          <div className="modal-stat">
            <span className="modal-stat-label">Time</span>
            <span className="modal-stat-value">{time}</span>
          </div>
        </div>
        <button type="button" className="btn btn-primary btn-large" onClick={onPlayAgain}>
          Play again
        </button>
      </div>
    </div>
  )
}
