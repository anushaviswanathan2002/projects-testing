import React from 'react';

export default function Card({ card, isFlipped, isMatched, onClick }) {
  const className = [
    'card',
    isFlipped ? 'flipped' : '',
    isMatched ? 'matched' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={className}
      onClick={() => onClick(card)}
      aria-label={isMatched || isFlipped ? card.symbol : 'Hidden card'}
      aria-pressed={isFlipped}
      disabled={isMatched}
    >
      <div className="card-inner">
        <div className="card-face card-back">
          <span className="badge">M</span>
        </div>
        <div className="card-face card-front" aria-hidden={!isFlipped && !isMatched}>
          <span>{card.symbol}</span>
        </div>
      </div>
    </button>
  );
}
