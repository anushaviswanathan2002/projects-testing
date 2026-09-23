import '../styles/WinModal.css';

export default function WinModal({ moves, time, bestScore, onPlayAgain }) {
  const isNewBest = bestScore === moves;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="win-emoji">🎉</div>
        <h2>You Win!</h2>
        {isNewBest && <p className="new-best">🏆 New Best Score!</p>}
        <div className="win-stats">
          <div className="win-stat">
            <span className="win-stat-label">Moves</span>
            <span className="win-stat-value">{moves}</span>
          </div>
          <div className="win-stat">
            <span className="win-stat-label">Time</span>
            <span className="win-stat-value">{time}</span>
          </div>
          <div className="win-stat">
            <span className="win-stat-label">Best</span>
            <span className="win-stat-value">{bestScore !== null ? `${bestScore} moves` : '—'}</span>
          </div>
        </div>
        <button className="btn-primary play-again-btn" onClick={onPlayAgain}>
          Play Again
        </button>
      </div>
    </div>
  );
}
