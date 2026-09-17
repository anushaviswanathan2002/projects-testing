import { useState, useEffect } from 'react'
import './App.css'
import Card from './components/Card'

const EMOJIS = ['🎨', '🎭', '🎪', '🎬', '🎸', '🎹', '🎺', '🎻', '🎮', '🎲', '🎯', '🎳']

export default function App() {
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [moves, setMoves] = useState(0)
  const [gameWon, setGameWon] = useState(false)

  // Initialize game
  useEffect(() => {
    initializeGame()
  }, [])

  // Check for match
  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped
      const delay = setTimeout(() => {
        if (cards[first].emoji === cards[second].emoji) {
          setMatched([...matched, cards[first].emoji])
        }
        setFlipped([])
        setMoves(m => m + 1)
      }, 600)
      return () => clearTimeout(delay)
    }
  }, [flipped, cards, matched])

  // Check win condition
  useEffect(() => {
    if (matched.length > 0 && matched.length === EMOJIS.length) {
      setGameWon(true)
    }
  }, [matched])

  const initializeGame = () => {
    const shuffled = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji }))
    
    setCards(shuffled)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setGameWon(false)
  }

  const handleCardClick = (index) => {
    if (
      flipped.includes(index) ||
      matched.includes(cards[index].emoji) ||
      flipped.length === 2
    ) {
      return
    }
    setFlipped([...flipped, index])
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🎮 Memory Game</h1>
        <div className="stats">
          <div className="stat">
            <span>Moves:</span>
            <strong>{moves}</strong>
          </div>
          <div className="stat">
            <span>Matched:</span>
            <strong>{matched.length}/{EMOJIS.length}</strong>
          </div>
        </div>
      </div>

      {gameWon && (
        <div className="win-message">
          <h2>🎉 You Won!</h2>
          <p>You completed the game in {moves} moves!</p>
        </div>
      )}

      <div className="game-board">
        {cards.map((card, index) => (
          <Card
            key={card.id}
            emoji={card.emoji}
            isFlipped={flipped.includes(index) || matched.includes(card.emoji)}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>

      <button className="reset-btn" onClick={initializeGame}>
        {gameWon ? 'Play Again' : 'Reset Game'}
      </button>
    </div>
  )
}
