import './Card.css'

function Card({ id, emoji, isFlipped, isMatched, onClick }) {
  return (
    <div
      className={`card ${isFlipped || isMatched ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
      onClick={onClick}
    >
      <div className="card-inner">
        <div className="card-front">?</div>
        <div className="card-back">{emoji}</div>
      </div>
    </div>
  )
}

export default Card
