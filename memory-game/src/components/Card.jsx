import '../styles/Card.css';

export default function Card({ card, onClick }) {
  const { emoji, flipped, matched } = card;

  return (
    <div
      className={`card ${flipped || matched ? 'flipped' : ''} ${matched ? 'matched' : ''}`}
      onClick={onClick}
      role="button"
      aria-label={flipped || matched ? emoji : 'Hidden card'}
    >
      <div className="card-inner">
        <div className="card-front">?</div>
        <div className="card-back">{emoji}</div>
      </div>
    </div>
  );
}
