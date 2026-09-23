export default function Card({ card, onClick }) {
  const { emoji, isFlipped, isMatched } = card

  return (
    <div
      className={`card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
      onClick={onClick}
      aria-label={isFlipped || isMatched ? emoji : 'Hidden card'}
    >
      <div className="card-inner">
        <div className="card-front">
          <span>{emoji}</span>
        </div>
        <div className="card-back">
          <span>❓</span>
        </div>
      </div>
    </div>
  )
}
