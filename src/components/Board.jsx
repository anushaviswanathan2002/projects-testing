import Card from './Card.jsx'

function Board({ deck, flipped, matchedIds, cols, onCardClick }) {
  if (!deck.length) return null
  return (
    <section
      className="board"
      style={{ '--cols': cols }}
      aria-label="Memory game board"
    >
      {deck.map((card) => (
        <Card
          key={card.key}
          card={card}
          flipped={flipped.includes(card.index)}
          matched={matchedIds.has(card.id)}
          onClick={onCardClick}
        />
      ))}
    </section>
  )
}

export default Board
