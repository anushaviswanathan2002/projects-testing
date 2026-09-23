import Card from './Card.jsx'

export default function Board({ deck, flipped, matched, onCardClick }) {
  // Compute a stable grid size from the board length.
  // Supports 12 (4x3), 16 (4x4), 20 (5x4), 24 (6x4) cards.
  const cols = deck.length <= 12 ? 4 : deck.length <= 16 ? 4 : deck.length <= 20 ? 5 : 6
  const style = { '--cols': cols }

  return (
    <section className="board" style={style} aria-label="Memory card board">
      {deck.map((card, i) => (
        <Card
          key={`${card.pairId}-${i}-${card.emoji}`}
          card={card}
          index={i}
          isFlipped={flipped.includes(i)}
          isMatched={matched.has(i)}
          onClick={onCardClick}
        />
      ))}
    </section>
  )
}
