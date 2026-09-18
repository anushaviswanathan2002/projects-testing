import React from 'react';
import './GameStats.css';

function GameStats({ moves, matched, total }) {
  const pairs = total / 2;
  const matchedPairs = matched.length / 2;

  return (
    <div className="stats">
      <div className="stat-item">
        <span className="label">Moves:</span>
        <span className="value">{moves}</span>
      </div>
      <div className="stat-item">
        <span className="label">Matched:</span>
        <span className="value">{matchedPairs}/{pairs}</span>
      </div>
    </div>
  );
}

export default GameStats;
