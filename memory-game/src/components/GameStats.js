import React from 'react';
import './GameStats.css';

function GameStats({ moves, matched, total }) {
  const progress = total > 0 ? Math.round((matched / total) * 100) : 0;

  return (
    <div className="stats">
      <div className="stat-item">
        <span className="stat-label">Moves:</span>
        <span className="stat-value">{moves}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Pairs:</span>
        <span className="stat-value">{matched / 2}/{total / 2}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Progress:</span>
        <span className="stat-value">{progress}%</span>
      </div>
    </div>
  );
}

export default GameStats;
