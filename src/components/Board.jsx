import Card from './Card.jsx'

function Board({ deck, flipped, matched, onCardClick }) {
  if (deck.length === 0) {
    return <div className="board board--empty">Loading…</div>
  }
  return (
    <div className="board" role="grid" aria-label="Memory board">
      {deck.map((card, index) => {
        const isFlipped = flipped.includes(index) || matched.includes(index)
        const isMatched = matched.includes(index)
        return (
          <Card
            key={card.id}
            emoji={card.emoji}
            isFlipped={isFlipped}
            isMatched={isMatched}
            onClick={() => onCardClick(index)}
            index={index}
          />
        )
      })}
    </div>
  )
}

export default Board