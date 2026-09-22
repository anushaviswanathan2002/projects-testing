import React from 'react';
import { formatTime } from '../lib/game.js';

export default function WinModal({ moves, seconds, totalPairs, best, onPlayAgain }) {
  const bestForPairs = best?.[totalPairs] ?? null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="win-title">
      <div className="modal">
        <h2 id="win-title">You matched them all!</h2>
        <p>Nice memory. Try to beat your best run.</p>
        <div className="summary">
          <div>
            <span>Moves</span>
            <strong>{moves}</strong>
          </div>
          <div>
            <span>Time</span>
            <strong>{formatTime(seconds)}</strong>
          </div>
          <div>
            <span>Best moves</span>
            <strong>{bestForPairs ? bestForPairs.moves : '—'}</strong>
          </div>
        </div>
        <button type="button" className="btn primary" onClick={onPlayAgain}>
          Play again
        </button>
      </div>
    </div>
  );
}
