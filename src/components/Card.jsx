import './Card.css'

export default function Card({ emoji, isFlipped, onClick }) {
  return (
    <button
      className={`card ${isFlipped ? 'flipped' : ''}`}
      onClick={onClick}
      disabled={isFlipped}
    >
      <div className="card-inner">
        <div className="card-front">?</div>
        <div className="card-back">{emoji}</div>
      </div>
    </button>
  )
}
