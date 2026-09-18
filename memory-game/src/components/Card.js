import React from 'react';
import './Card.css';

function Card({ index, symbol, isFlipped, isMatched, onClick }) {
  return (
    <div
      className={`card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
      onClick={onClick}
    >
      <div className="card-inner">
        <div className="card-front">?</div>
        <div className="card-back">{symbol}</div>
      </div>
    </div>
  );
}

export default Card;
