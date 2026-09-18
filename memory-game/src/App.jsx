import { useState, useEffect } from 'react'
import './App.css'
import Card from './components/Card'
import GameStats from './components/GameStats'

function App() {
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [moves, setMoves] = useState(0)
  const [gameWon, setGameWon] = useState(false)

  // Initialize game
  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = () => {
    const symbols = ['🌟', '🎨', '🎵', '🎮', '🏆', '🚀', '💎', '🎭']
    const gameCards = [...symbols, ...symbols].sort(() => Math.random() - 0.5)
    setCards(gameCards)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setGameWon(false)
  }

  const handleCardClick = (index) => {
    // Don't flip if already flipped, matched, or game won
    if (flipped.includes(index) || matched.includes(index) || gameWon) {
      return
    }

    const newFlipped = [...flipped, index]
    setFlipped(newFlipped)

    // Check for match when two cards are flipped
    if (newFlipped.length === 2) {
      const [first, second] = newFlipped
      setMoves(moves + 1)

      if (cards[first] === cards[second]) {
        // Match found
        setMatched([...matched, first, second])
        setFlipped([])

        // Check if game is won
        if (matched.length + 2 === cards.length) {
          setGameWon(true)
        }
      } else {
        // No match, flip back after delay
        setTimeout(() => {
          setFlipped([])
        }, 600)
      }
    }
  }

  return (
    <div className="app">
      <header>
        <h1>Memory Game</h1>
        <GameStats moves={moves} matched={matched.length / 2} total={cards.length / 2} />
      </header>

      <main>
        <div className="game-board">
          {cards.map((symbol, index) => (
            <Card
              key={index}
              symbol={symbol}
              isFlipped={flipped.includes(index) || matched.includes(index)}
              isMatched={matched.includes(index)}
              onClick={() => handleCardClick(index)}
            />
          ))}
        </div>

        {gameWon && (
          <div className="win-message">
            <h2>🎉 You Won! 🎉</h2>
            <p>Completed in {moves} moves</p>
            <button onClick={initializeGame} className="reset-btn">
              Play Again
            </button>
          </div>
        )}

        {!gameWon && (
          <button onClick={initializeGame} className="reset-btn">
            Reset Game
          </button>
        )}
      </main>
    </div>
  )
}

export default App
