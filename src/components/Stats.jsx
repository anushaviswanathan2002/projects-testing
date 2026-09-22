import React from 'react';
import { formatTime } from '../lib/game.js';

export default function Stats({ moves, seconds, matchedPairs, totalPairs }) {
  return (
    <div className="stats" role="status" aria-live="polite">
      <span className="stat">
        Moves <strong>{moves}</strong>
      </span>
      <span className="stat">
        Time <strong>{formatTime(seconds)}</strong>
      </span>
      <span className="stat">
        Pairs <strong>{matchedPairs}/{totalPairs}</strong>
      </span>
    </div>
  );
}
