import Card from './Card.jsx'
import './Board.css'

function Board({ deck, flipped, matched, onCardClick }) {
  return (
    <div className="board" role="grid" aria-label="Memory board">
      {deck.map((card, index) => (
        <Card
          key={`${card.id}-${index}`}
          card={card}
          isFlipped={flipped.includes(index) || matched.includes(index)}
          isMatched={matched.includes(index)}
          onClick={() => onCardClick(index)}
        />
      ))}
    </div>
  )
}

export default Board
