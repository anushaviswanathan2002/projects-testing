import './Card.css'

function Card({ card, isFlipped, isMatched, onClick }) {
  return (
    <button
      type="button"
      className={`card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
      onClick={onClick}
      aria-label={isFlipped ? `Showing ${card.label}` : 'Hidden card'}
      aria-pressed={isFlipped}
    >
      <div className="card-inner">
        <div className="card-face card-back" aria-hidden="true">?</div>
        <div className="card-face card-front">
          <span className="card-emoji" role="img" aria-label={card.label}>
            {card.emoji}
          </span>
        </div>
      </div>
    </button>
  )
}

export default Card
