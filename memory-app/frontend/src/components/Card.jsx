import React from 'react';
import '../styles/Card.css';

export default function Card({ emoji, isFlipped, onClick }) {
  return (
    <div
      className={`card ${isFlipped ? 'flipped' : ''}`}
      onClick={onClick}
    >
      <div className="card-inner">
        <div className="card-front">?</div>
        <div className="card-back">{emoji}</div>
      </div>
    </div>
  );
}
