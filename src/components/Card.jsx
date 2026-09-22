export default function Card({ card, isFlipped, onClick }) {
  const className = [
    'card',
    isFlipped ? 'flipped' : '',
    card.matched ? 'matched' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      aria-label={isFlipped ? `Card showing ${card.symbol}` : 'Hidden card'}
      aria-pressed={isFlipped}
    >
      <div className="card-inner">
        <div className="card-face card-back" aria-hidden="true">?</div>
        <div className="card-face card-front">
          <span className="symbol">{card.symbol}</span>
        </div>
      </div>
    </button>
  );
}