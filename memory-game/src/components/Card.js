import React from 'react';

function Card({ emoji, isFlipped, isMatched, onClick }) {
  return (
    <div
      className={`card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
      onClick={onClick}
    >
      {isFlipped || isMatched ? emoji : '?'}
    </div>
  );
}

export default Card;
