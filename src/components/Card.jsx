import './Card.css';

export default function Card({ card, onClick, disabled }) {
  const handleClick = () => {
    if (!disabled && !card.flipped && !card.matched) {
      onClick(card.id);
    }
  };

  return (
    <div
      className={`card ${card.flipped || card.matched ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
      onClick={handleClick}
      role="button"
      aria-label={card.flipped || card.matched ? card.emoji : 'Hidden card'}
    >
      <div className="card-inner">
        <div className="card-back">❓</div>
        <div className="card-front">{card.emoji}</div>
      </div>
    </div>
  );
}
