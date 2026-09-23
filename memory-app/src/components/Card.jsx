export default function Card({ card, isFlipped, onClick }) {
  return (
    <button
      type="button"
      className={`card ${isFlipped ? 'is-flipped' : ''} ${card.matched ? 'is-matched' : ''}`}
      onClick={onClick}
      aria-pressed={isFlipped}
      aria-label={isFlipped ? `${card.name}, revealed` : 'Hidden card'}
      disabled={card.matched}
    >
      <span className="card__inner">
        <span className="card__face card__face--back" aria-hidden="true">?</span>
        <span className="card__face card__face--front" aria-hidden="true">
          <span className="card__emoji">{card.emoji}</span>
          <span className="card__name">{card.name}</span>
        </span>
      </span>
    </button>
  );
}