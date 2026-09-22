export default function StatsBar({
  moves,
  matches,
  total,
  time,
  onReset,
  onChangePairs,
  numPairs,
}) {
  const pairOptions = [4, 6, 8, 10, 12];

  return (
    <div className="stats-bar">
      <div className="stat">
        <span className="stat-label">Moves</span>
        <span className="stat-value">{moves}</span>
      </div>
      <div className="stat">
        <span className="stat-label">Matches</span>
        <span className="stat-value">
          {matches}/{total}
        </span>
      </div>
      <div className="stat">
        <span className="stat-label">Time</span>
        <span className="stat-value">{formatTime(time)}</span>
      </div>
      <div className="controls">
        <label className="pair-select">
          Pairs:
          <select
            value={numPairs}
            onChange={(e) => onChangePairs(Number(e.target.value))}
          >
            {pairOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="btn" onClick={onReset}>
          Reset
        </button>
      </div>
    </div>
  );
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}