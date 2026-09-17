import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const emojis = ['🎮', '🎮', '🎨', '🎨', '🎭', '🎭', '🎪', '🎪', '🎯', '🎯', '🎲', '🎲']
  
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
      setMoves(m => m + 1)
      
      if (cards[first].id === cards[second].id) {
        setMatched([...matched, cards[first].id])
      }
      
      // Auto flip back after delay
      const timeout = setTimeout(() => {
        setFlipped([])
      }, 800)
      
      return () => clearTimeout(timeout)
    }
  }, [flipped])

  // Check if game is won
  useEffect(() => {
    if (matched.length > 0 && matched.length === emojis.length / 2) {
      setGameWon(true)
    }
  }, [matched])

  const initializeGame = () => {
    const shuffled = [...emojis].sort(() => Math.random() - 0.5)
    const cardArray = shuffled.map((emoji, index) => ({
      id: Math.floor(index / 2),
      emoji: emoji
    }))
    setCards(cardArray)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setGameWon(false)
  }

  const handleCardClick = (index) => {
    if (flipped.includes(index)) return // Already flipped
    if (matched.includes(cards[index].id)) return // Already matched
    if (flipped.length >= 2) return // Already checking a pair
    
    setFlipped([...flipped, index])
  }

  const isFlipped = (index) => flipped.includes(index)
  const isMatched = (index) => matched.includes(cards[index].id)

  return (
    <div className="app">
      <div className="container">
        <h1>Memory Game</h1>
        
        <div className="stats">
          <div className="stat">Moves: <span>{moves}</span></div>
          <div className="stat">Matched: <span>{matched.length}/{emojis.length / 2}</span></div>
        </div>

        <div className="game-board">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`card ${isFlipped(index) ? 'flipped' : ''} ${isMatched(index) ? 'matched' : ''}`}
              onClick={() => handleCardClick(index)}
            >
              <div className="card-inner">
                <div className="card-front">?</div>
                <div className="card-back">{card.emoji}</div>
              </div>
            </div>
          ))}
        </div>

        {gameWon && (
          <div className="win-message">
            <h2>🎉 You won!</h2>
            <p>Completed in {moves} moves</p>
          </div>
        )}

        <button className="reset-btn" onClick={initializeGame}>
          {gameWon ? 'Play Again' : 'Reset Game'}
        </button>
      </div>
    </div>
  )
}

export default App
