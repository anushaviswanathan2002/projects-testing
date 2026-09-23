import '../styles/card.css';

export default function Card({ card, onClick }) {
  return (
    <div
      className={`card ${card.flipped || card.matched ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
      onClick={onClick}
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
