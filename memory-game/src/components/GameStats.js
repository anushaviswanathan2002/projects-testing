import React from 'react';

function GameStats({ moves, matchedPairs, totalPairs }) {
  return (
    <div className="game-stats">
      <p>Moves: <span className="stat-value">{moves}</span></p>
      <p>Matched: <span className="stat-value">{matchedPairs} / {totalPairs}</span></p>
    </div>
  );
}

export default GameStats;
