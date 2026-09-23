import MemoryCard from './MemoryCard';
import './MemoryBoard.css';

export default function MemoryBoard({ cards, cols, onFlip }) {
  return (
    <div
      className="memory-board"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {cards.map(card => (
        <MemoryCard key={card.id} card={card} onFlip={onFlip} />
      ))}
    </div>
  );
}
