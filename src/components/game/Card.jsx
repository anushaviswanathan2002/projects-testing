import './Card.css';

export default function Card({ card, onClick, disabled }) {
  const { emoji, flipped, matched } = card;

  return (
    <div
      className={`card-scene ${flipped ? 'flipped' : ''} ${matched ? 'matched' : ''}`}
      onClick={() => !disabled && !flipped && !matched && onClick(card)}
      role="button"
      aria-label={flipped || matched ? emoji : 'Hidden card'}
      aria-pressed={flipped}
    >
      <div className="card-inner">
        <div className="card-face card-back">
          <span className="card-mark">?</span>
        </div>
        <div className="card-face card-front">
          <span className="card-emoji">{emoji}</span>
        </div>
      </div>
    </div>
  );
}
