export default function Card({ card, index, isFlipped, isMatched, onClick }) {
  const showFace = isFlipped || isMatched
  const className = [
    'card',
    showFace ? 'is-flipped' : '',
    isMatched ? 'is-matched' : '',
  ].filter(Boolean).join(' ')

  return (
    <button
      type="button"
      className={className}
      onClick={() => onClick(index)}
      aria-label={showFace ? card.emoji : 'Hidden card'}
      aria-pressed={showFace}
      disabled={isMatched}
    >
      <div className="card-inner">
        <div className="card-face card-back" aria-hidden="true">
          <span className="card-back-mark">?</span>
        </div>
        <div className="card-face card-front">
          <span className="card-emoji">{card.emoji}</span>
        </div>
      </div>
    </button>
  )
}
