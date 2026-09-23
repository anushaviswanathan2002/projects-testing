export default function Header({ moves, time, pairCount, onPairChange, onReset }) {
  return (
    <header className="header">
      <div className="header-top">
        <h1 className="title">
          <span className="title-icon" aria-hidden="true">🧠</span>
          Memory Match
        </h1>
        <button type="button" className="btn btn-primary" onClick={onReset}>
          New Game
        </button>
      </div>
      <div className="stats">
        <div className="stat">
          <span className="stat-label">Moves</span>
          <span className="stat-value">{moves}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Time</span>
          <span className="stat-value">{time}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Pairs</span>
          <span className="stat-value">{pairCount}</span>
        </div>
      </div>
      <div className="difficulty" role="group" aria-label="Difficulty">
        {[6, 8, 10, 12].map((n) => (
          <button
            key={n}
            type="button"
            className={`chip ${pairCount === n ? 'is-active' : ''}`}
            onClick={() => onPairChange(n)}
            aria-pressed={pairCount === n}
          >
            {n} pairs
          </button>
        ))}
      </div>
    </header>
  )
}
