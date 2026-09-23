import "../styles/WinModal.css";

export default function WinModal({ moves, time, onRestart }) {
  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-emoji">🎉</div>
        <h2 className="modal-title">You Won!</h2>
        <p className="modal-subtitle">Congratulations, you matched all pairs!</p>
        <div className="modal-stats">
          <div className="modal-stat">
            <span className="stat-label">Moves</span>
            <span className="stat-value">{moves}</span>
          </div>
          <div className="modal-stat">
            <span className="stat-label">Time</span>
            <span className="stat-value">{fmt(time)}</span>
          </div>
        </div>
        <button className="modal-btn" onClick={onRestart}>
          Play Again
        </button>
      </div>
    </div>
  );
}
