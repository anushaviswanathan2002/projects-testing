import { useState, useEffect } from 'react'
import './App.css'

const EMOJI_PAIRS = [
  '🎨', '🎭', '🎪', '🎬', '🎯', '🎲',
  '🎸', '🎹', '🎺', '🎻', '🎤', '🎧'
]

function App() {
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState(new Set())
  const [matched, setMatched] = useState(new Set())
  const [moves, setMoves] = useState(0)
  const [gameWon, setGameWon] = useState(false)

  // Initialize game
  useEffect(() => {
    initializeGame()
  }, [])

  // Check for match
  useEffect(() => {
    if (flipped.size === 2) {
      const [first, second] = Array.from(flipped)
      if (cards[first].emoji === cards[second].emoji) {
        setMatched(prev => new Set([...prev, first, second]))
        setFlipped(new Set())
      } else {
        setTimeout(() => setFlipped(new Set()), 600)
      }
      setMoves(m => m + 1)
    }
  }, [flipped, cards])

  // Check for win
  useEffect(() => {
    if (cards.length > 0 && matched.size === cards.length) {
      setGameWon(true)
    }
  }, [matched, cards.length])

  const initializeGame = () => {
    const shuffled = [...EMOJI_PAIRS, ...EMOJI_PAIRS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, i) => ({ id: i, emoji }))
    
    setCards(shuffled)
    setFlipped(new Set())
    setMatched(new Set())
    setMoves(0)
    setGameWon(false)
  }

  const toggleFlip = (id) => {
    if (matched.has(id) || flipped.has(id) || flipped.size === 2) return
    setFlipped(prev => new Set([...prev, id]))
  }

  return (
    <div className="app">
      <div className="container">
        <header>
          <h1>🎮 Memory Game</h1>
          <div className="stats">
            <div className="stat">
              <span className="label">Moves</span>
              <span className="value">{moves}</span>
            </div>
            <div className="stat">
              <span className="label">Matched</span>
              <span className="value">{matched.size / 2} / {cards.length / 2}</span>
            </div>
          </div>
        </header>

        <div className="game-board">
          {cards.map(card => (
            <button
              key={card.id}
              className={`card ${flipped.has(card.id) || matched.has(card.id) ? 'flipped' : ''} ${matched.has(card.id) ? 'matched' : ''}`}
              onClick={() => toggleFlip(card.id)}
              disabled={matched.has(card.id)}
            >
              <span className="card-face front">?</span>
              <span className="card-face back">{card.emoji}</span>
            </button>
          ))}
        </div>

        {gameWon && (
          <div className="win-modal">
            <div className="win-content">
              <h2>🎉 You Won!</h2>
              <p>Completed in {moves} moves</p>
              <button className="btn-primary" onClick={initializeGame}>
                Play Again
              </button>
            </div>
          </div>
        )}

        <button className="btn-reset" onClick={initializeGame}>
          New Game
        </button>
      </div>
    </div>
  )
}

export default App
