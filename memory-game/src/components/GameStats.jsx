import './GameStats.css'

function GameStats({ moves, matched, total }) {
  return (
    <div className="game-stats">
      <div className="stat">
        <span className="label">Moves</span>
        <span className="value">{moves}</span>
      </div>
      <div className="stat">
        <span className="label">Matched</span>
        <span className="value">{matched}/{total}</span>
      </div>
    </div>
  )
}

export default GameStats
