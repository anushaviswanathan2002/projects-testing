import { useState, useEffect, useCallback } from 'react'
import Board from './components/Board.jsx'
import { buildDeck } from './data/deck.js'
import './App.css'

const PAIRS_PER_GAME = 8

function App() {
  const [deck, setDeck] = useState([])
  const [flipped, setFlipped] = useState([]) // indices currently face up
  const [matched, setMatched] = useState([]) // indices that are matched
  const [moves, setMoves] = useState(0)
  const [locked, setLocked] = useState(false)
  const [won, setWon] = useState(false)
  const [bestScore, setBestScore] = useState(() => {
    const stored = localStorage.getItem('memory-best')
    return stored ? Number(stored) : null
  })

  const startNewGame = useCallback(() => {
    setDeck(buildDeck(PAIRS_PER_GAME))
    setFlipped([])
    setMatched([])
    setMoves(0)
    setLocked(false)
    setWon(false)
  }, [])

  // Initial deck
  useEffect(() => {
    startNewGame()
  }, [startNewGame])

  // Win detection
  useEffect(() => {
    if (matched.length > 0 && matched.length === deck.length) {
      setWon(true)
      setBestScore((prev) => {
        if (prev === null || moves < prev) {
          localStorage.setItem('memory-best', String(moves))
          return moves
        }
        return prev
      })
    }
  }, [matched, deck.length, moves])

  const handleCardClick = (index) => {
    if (locked) return
    if (flipped.includes(index) || matched.includes(index)) return

    const nextFlipped = [...flipped, index]
    setFlipped(nextFlipped)

    if (nextFlipped.length === 2) {
      setLocked(true)
      setMoves((m) => m + 1)
      const [a, b] = nextFlipped
      if (deck[a].id === deck[b].id) {
        // Match
        setTimeout(() => {
          setMatched((prev) => [...prev, a, b])
          setFlipped([])
          setLocked(false)
        }, 500)
      } else {
        // No match — flip back
        setTimeout(() => {
          setFlipped([])
          setLocked(false)
        }, 900)
      }
    }
  }

  return (
    <div className="app">
      <h1>Memory Match</h1>
      <p className="subtitle">Find all the matching pairs in as few moves as possible.</p>

      <div className="stats">
        <div className="stat">
          <span className="stat-label">Moves</span>
          <span className="stat-value">{moves}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Matches</span>
          <span className="stat-value">{matched.length / 2} / {PAIRS_PER_GAME}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Best</span>
          <span className="stat-value">{bestScore ?? '—'}</span>
        </div>
      </div>

      <Board
        deck={deck}
        flipped={flipped}
        matched={matched}
        onCardClick={handleCardClick}
      />

      <div className="actions">
        <button className="primary" onClick={startNewGame}>
          {won ? 'Play again' : 'Restart'}
        </button>
      </div>

      {won && (
        <div className="win-banner" role="status">
          🎉 You won in <strong>{moves}</strong> moves!
        </div>
      )}
    </div>
  )
}

export default App
