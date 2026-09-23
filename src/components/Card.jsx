export default function Card({ card, faceUp, onClick, disabled }) {
  const classes = [
    'memory-card',
    faceUp ? 'is-face-up' : '',
    card.matched ? 'is-matched' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      disabled={disabled || card.matched || faceUp}
      aria-label={faceUp ? `Card showing ${card.symbol}` : 'Hidden card'}
    >
      <div className="memory-card-inner">
        <div className="memory-card-face memory-card-back">?</div>
        <div className="memory-card-face memory-card-front">{card.symbol}</div>
      </div>
    </button>
  );
}