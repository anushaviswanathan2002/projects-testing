export default function Stats({ moves, matches, totalPairs, best }) {
  return (
    <div className="stats" aria-live="polite">
      <div className="stat">
        <span className="stat__label">Moves</span>
        <span className="stat__value">{moves}</span>
      </div>
      <div className="stat">
        <span className="stat__label">Matches</span>
        <span className="stat__value">{matches} / {totalPairs}</span>
      </div>
      <div className="stat">
        <span className="stat__label">Best</span>
        <span className="stat__value">{best === null ? '—' : best}</span>
      </div>
    </div>
  );
}