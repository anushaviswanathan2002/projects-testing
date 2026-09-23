import './MemoryCard.css';

export default function MemoryCard({ card, onFlip }) {
  const { id, emoji, flipped, matched } = card;

  return (
    <div
      className={`card-scene ${flipped || matched ? 'is-flipped' : ''} ${matched ? 'is-matched' : ''}`}
      onClick={() => !flipped && !matched && onFlip(id)}
      role="button"
      aria-label={flipped || matched ? emoji : 'Hidden card'}
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && !flipped && !matched && onFlip(id)}
    >
      <div className="card-inner">
        <div className="card-face card-back">
          <span className="card-back-icon">?</span>
        </div>
        <div className="card-face card-front">
          <span className="card-emoji">{emoji}</span>
        </div>
      </div>
    </div>
  );
}
