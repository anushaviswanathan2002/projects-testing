import React, { useState, useEffect } from 'react'
import Card from './Card'
import '../styles/MemoryGame.css'

const CARD_SYMBOLS = ['🍎', '🍌', '🍊', '🍉', '🍓', '🥝', '🍒', '🍑']

export default function MemoryGame() {
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [moves, setMoves] = useState(0)
  const [isWon, setIsWon] = useState(false)

  // Initialize game
  useEffect(() => {
    initializeGame()
  }, [])

  // Check win condition
  useEffect(() => {
    if (matched.length > 0 && matched.length === cards.length) {
      setIsWon(true)
    }
  }, [matched, cards])

  // Check for matches
  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped
      if (cards[first].id === cards[second].id) {
        setMatched([...matched, cards[first].id])
        setFlipped([])
      } else {
        setTimeout(() => {
          setFlipped([])
        }, 800)
      }
      setMoves(moves + 1)
    }
  }, [flipped])

  const initializeGame = () => {
    const newCards = []
    CARD_SYMBOLS.forEach((symbol) => {
      newCards.push({ id: symbol, symbol })
      newCards.push({ id: symbol, symbol })
    })
    
    // Shuffle cards
    const shuffled = newCards.sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setIsWon(false)
  }

  const handleCardClick = (index) => {
    if (
      flipped.includes(index) ||
      matched.includes(cards[index].id) ||
      flipped.length === 2
    ) {
      return
    }
    setFlipped([...flipped, index])
  }

  return (
    <div className="memory-game">
      <h1>Memory Game</h1>
      <div className="stats">
        <div className="stat">
          <span className="label">Moves:</span>
          <span className="value">{moves}</span>
        </div>
        <div className="stat">
          <span className="label">Matched:</span>
          <span className="value">{matched.length} / {CARD_SYMBOLS.length}</span>
        </div>
      </div>

      {isWon && (
        <div className="win-message">
          🎉 You Won! 🎉<br />
          Completed in {moves} moves!
        </div>
      )}

      <div className="cards-grid">
        {cards.map((card, index) => (
          <Card
            key={index}
            symbol={card.symbol}
            isFlipped={flipped.includes(index) || matched.includes(card.id)}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>

      <button className="reset-button" onClick={initializeGame}>
        {isWon ? 'Play Again' : 'Reset Game'}
      </button>
    </div>
  )
}
