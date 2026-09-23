import { useState, useEffect } from 'react'
import './App.css'
import Card from './components/Card'

const EMOJIS = ['🐕', '🐈', '🐠', '🦋', '🐢', '🦎', '🐙', '🦑']

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

  const initializeGame = () => {
    const shuffledCards = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji }))
    
    setCards(shuffledCards)
    setFlipped(new Set())
    setMatched(new Set())
    setMoves(0)
    setGameWon(false)
  }

  useEffect(() => {
    if (matched.size === cards.length && cards.length > 0) {
      setGameWon(true)
    }
  }, [matched, cards.length])

  const handleCardClick = (id) => {
    // Prevent clicking if card is already matched or flipped
    if (matched.has(id) || flipped.has(id) || flipped.size >= 2) {
      return
    }

    const newFlipped = new Set(flipped)
    newFlipped.add(id)
    setFlipped(newFlipped)

    // Check for match when 2 cards are flipped
    if (newFlipped.size === 2) {
      setMoves(moves + 1)
      const [first, second] = Array.from(newFlipped)
      
      if (cards[first].emoji === cards[second].emoji) {
        // Match found
        const newMatched = new Set(matched)
        newMatched.add(first)
        newMatched.add(second)
        setMatched(newMatched)
        setFlipped(new Set())
      } else {
        // No match, flip back after delay
        setTimeout(() => {
          setFlipped(new Set())
        }, 1000)
      }
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🎮 Memory Game</h1>
        <div className="stats">
          <span>Moves: {moves}</span>
          <span>Matched: {matched.size / 2} / {cards.length / 2}</span>
        </div>
      </header>

      <div className="game-board">
        {cards.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            emoji={card.emoji}
            isFlipped={flipped.has(card.id)}
            isMatched={matched.has(card.id)}
            onClick={() => handleCardClick(card.id)}
          />
        ))}
      </div>

      {gameWon && (
        <div className="modal">
          <div className="modal-content">
            <h2>🎉 You Won!</h2>
            <p>Completed in {moves} moves</p>
            <button onClick={initializeGame}>Play Again</button>
          </div>
        </div>
      )}

      <button className="reset-btn" onClick={initializeGame}>
        Reset Game
      </button>
    </div>
  )
}

export default App
