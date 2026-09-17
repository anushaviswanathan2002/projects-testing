import { useState, useEffect } from 'react'
import './App.css'

const EMOJI_PAIRS = [
  '🎨', '🎭', '🎪', '🎬', '🎤', '🎧',
  '🎮', '🎯', '🎲', '🎳', '🎸', '🎺'
]

export default function MemoryGame() {
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState(new Set())
  const [matched, setMatched] = useState(new Set())
  const [moves, setMoves] = useState(0)
  const [gameWon, setGameWon] = useState(false)

  // Initialize game
  useEffect(() => {
    initializeGame()
  }, [])

  // Check for match whenever two cards are flipped
  useEffect(() => {
    if (flipped.size === 2) {
      const [first, second] = Array.from(flipped)
      if (cards[first] === cards[second]) {
        setMatched(new Set([...matched, first, second]))
        setFlipped(new Set())
      } else {
        setTimeout(() => setFlipped(new Set()), 1000)
      }
      setMoves(m => m + 1)
    }
  }, [flipped, cards, matched])

  // Check if game is won
  useEffect(() => {
    if (cards.length > 0 && matched.size === cards.length) {
      setGameWon(true)
    }
  }, [matched, cards.length])

  const initializeGame = () => {
    const gameCards = [...EMOJI_PAIRS, ...EMOJI_PAIRS].sort(() => Math.random() - 0.5)
    setCards(gameCards)
    setFlipped(new Set())
    setMatched(new Set())
    setMoves(0)
    setGameWon(false)
  }

  const toggleCard = (index) => {
    if (matched.has(index) || flipped.has(index) || flipped.size === 2) return
    setFlipped(new Set([...flipped, index]))
  }

  return (
    <div className="game-container">
      <h1>🎮 Memory Game</h1>
      
      <div className="stats">
        <div className="stat">
          <span className="label">Moves:</span>
          <span className="value">{moves}</span>
        </div>
        <div className="stat">
          <span className="label">Matched:</span>
          <span className="value">{matched.size / 2}/{EMOJI_PAIRS.length}</span>
        </div>
      </div>

      <div className="cards-grid">
        {cards.map((emoji, index) => (
          <button
            key={index}
            className={`card ${flipped.has(index) || matched.has(index) ? 'flipped' : ''}`}
            onClick={() => toggleCard(index)}
            disabled={matched.has(index)}
          >
            <div className="card-inner">
              <div className="card-front">?</div>
              <div className="card-back">{emoji}</div>
            </div>
          </button>
        ))}
      </div>

      {gameWon && (
        <div className="win-modal">
          <div className="win-content">
            <h2>🎉 You Won! 🎉</h2>
            <p>Completed in {moves} moves</p>
            <button className="restart-btn" onClick={initializeGame}>
              Play Again
            </button>
          </div>
        </div>
      )}

      <button className="restart-btn" onClick={initializeGame}>
        New Game
      </button>
    </div>
  )
}
