import Card from './Card.jsx';

export default function Board({ deck, flippedIndices, onCardClick }) {
  return (
    <div className="board" role="grid" aria-label="Memory cards">
      {deck.map((card, index) => (
        <Card
          key={card.key}
          card={card}
          isFlipped={flippedIndices.includes(index) || card.matched}
          onClick={() => onCardClick(index)}
        />
      ))}
    </div>
  );
}