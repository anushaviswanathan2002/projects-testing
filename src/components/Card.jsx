function Card({ emoji, isFlipped, isMatched, onClick, index }) {
  const className = [
    'card',
    isFlipped ? 'card--flipped' : '',
    isMatched ? 'card--matched' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      aria-label={isFlipped ? `Card showing ${emoji}` : 'Hidden card'}
      aria-pressed={isFlipped}
      data-index={index}
    >
      <div className="card__inner">
        <div className="card__face card__face--back" aria-hidden="true">
          <span className="card__pattern">?</span>
        </div>
        <div className="card__face card__face--front" aria-hidden={!isFlipped}>
          <span className="card__emoji">{emoji}</span>
        </div>
      </div>
    </button>
  )
}

export default Card