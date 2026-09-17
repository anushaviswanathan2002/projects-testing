import React from 'react'
import '../styles/Card.css'

export default function Card({ symbol, isFlipped, onClick }) {
  return (
    <div
      className={`card ${isFlipped ? 'flipped' : ''}`}
      onClick={onClick}
    >
      <div className="card-inner">
        <div className="card-front">?</div>
        <div className="card-back">{symbol}</div>
      </div>
    </div>
  )
}
