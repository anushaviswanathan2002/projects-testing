function Card({ card, flipped, matched, onClick, disabled }) {
  const showFace = flipped || matched
  return (
    <button
      type="button"
      className={`card ${showFace ? 'flipped' : ''} ${matched ? 'matched' : ''}`}
      onClick={() => onClick(card.index)}
      aria-label={matched ? `${card.emoji} matched` : 'Hidden card'}
      aria-pressed={showFace}
      disabled={disabled}
    >
      <div className="card-inner">
        <div className="card-face card-back" aria-hidden="true">
          <span className="card-back-mark">?</span>
        </div>
        <div className="card-face card-front">
          <span className="card-emoji" role="img" aria-hidden="true">
            {card.emoji}
          </span>
        </div>
      </div>
    </button>
  )
}

export default Card
