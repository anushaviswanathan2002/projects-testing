import { useState, useEffect } from 'react'
import Card from './Card'
import '../styles/MemoryGame.css'

const EMOJIS = ['🎨', '🎭', '🎪', '🎬', '🎤', '🎧', '🎸', '🎹', '🎺', '🎻', '🏀', '⚽']

export default function MemoryGame() {
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [moves, setMoves] = useState(0)
  const [gameWon, setGameWon] = useState(false)

  // Initialize game
  useEffect(() => {
    initializeGame()
  }, [])

  // Check for matches
  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped
      if (cards[first].emoji === cards[second].emoji) {
        setMatched([...matched, first, second])
        setFlipped([])
      } else {
        setTimeout(() => setFlipped([]), 600)
      }
      setMoves(moves + 1)
    }
  }, [flipped])

  // Check for win
  useEffect(() => {
    if (matched.length > 0 && matched.length === cards.length) {
      setGameWon(true)
    }
  }, [matched, cards.length])

  const initializeGame = () => {
    const gameCards = []
    EMOJIS.forEach((emoji, index) => {
      gameCards.push({ id: index * 2, emoji })
      gameCards.push({ id: index * 2 + 1, emoji })
    })
    
    // Shuffle cards
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]]
    }
    
    setCards(gameCards)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setGameWon(false)
  }

  const handleCardClick = (index) => {
    if (flipped.includes(index) || matched.includes(index) || flipped.length === 2) {
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
          <span className="value">{matched.length / 2} / {cards.length / 2}</span>
        </div>
      </div>

      {gameWon && (
        <div className="win-message">
          🎉 You Won! Completed in {moves} moves!
        </div>
      )}

      <div className="grid">
        {cards.map((card, index) => (
          <Card
            key={index}
            emoji={card.emoji}
            isFlipped={flipped.includes(index) || matched.includes(index)}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>

      <button className="reset-btn" onClick={initializeGame}>
        New Game
      </button>
    </div>
  )
}
