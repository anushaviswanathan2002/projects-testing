import { useState, useEffect, useCallback } from 'react'
import Board from './components/Board.jsx'
import Stats from './components/Stats.jsx'
import { buildDeck, EMOJIS } from './game/deck.js'
import './App.css'

const DEFAULT_PAIRS = 8

function App() {
  const [deck, setDeck] = useState([])
  const [flipped, setFlipped] = useState([]) // indices currently face-up (max 2)
  const [matched, setMatched] = useState([]) // indices permanently matched
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [running, setRunning] = useState(false)
  const [won, setWon] = useState(false)
  const [pairs, setPairs] = useState(DEFAULT_PAIRS)
  const [busy, setBusy] = useState(false) // disable input while resolving

  // Start a new game with `pairs` pairs (so pairs * 2 cards total).
  const startGame = useCallback((pairCount = pairs) => {
    const newDeck = buildDeck(pairCount, EMOJIS)
    setDeck(newDeck)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setTime(0)
    setRunning(true)
    setWon(false)
    setBusy(false)
  }, [pairs])

  // Initial game on mount.
  useEffect(() => {
    startGame(DEFAULT_PAIRS)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Timer.
  useEffect(() => {
    if (!running || won) return
    const id = setInterval(() => setTime((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [running, won])

  // Win detection.
  useEffect(() => {
    if (deck.length > 0 && matched.length === deck.length) {
      setRunning(false)
      setWon(true)
    }
  }, [matched, deck])

  const handleCardClick = useCallback(
    (index) => {
      if (busy) return
      if (flipped.includes(index)) return
      if (matched.includes(index)) return

      const next = [...flipped, index]
      setFlipped(next)

      if (next.length === 2) {
        setMoves((m) => m + 1)
        const [a, b] = next
        if (deck[a].emoji === b && a === b) return // safety
        if (deck[a].emoji === deck[b].emoji) {
          // Match!
          setBusy(true)
          setTimeout(() => {
            setMatched((m) => [...m, a, b])
            setFlipped([])
            setBusy(false)
          }, 600)
        } else {
          // No match — flip back.
          setBusy(true)
          setTimeout(() => {
            setFlipped([])
            setBusy(false)
          }, 900)
        }
      }
    },
    [busy, flipped, matched, deck],
  )

  const handlePairsChange = (e) => {
    const value = parseInt(e.target.value, 10)
    if (!Number.isNaN(value) && value >= 2 && value <= EMOJIS.length) {
      setPairs(value)
      startGame(value)
    }
  }

  const bestTime = null // could persist to localStorage; keep simple

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">
          <span className="app__title-emoji" aria-hidden="true">🧠</span>
          Memory Match
        </h1>
        <p className="app__subtitle">
          Flip two cards at a time. Find every matching pair in the fewest moves.
        </p>
      </header>

      <Stats
        moves={moves}
        time={time}
        pairs={pairs}
        matchedCount={matched.length / 2}
        totalPairs={deck.length / 2}
      />

      <div className="app__controls">
        <label className="control">
          <span className="control__label">Pairs</span>
          <input
            type="number"
            min={2}
            max={EMOJIS.length}
            value={pairs}
            onChange={handlePairsChange}
            className="control__input"
          />
        </label>
        <button type="button" className="btn btn--primary" onClick={() => startGame()}>
          New Game
        </button>
      </div>

      <Board
        deck={deck}
        flipped={flipped}
        matched={matched}
        onCardClick={handleCardClick}
      />

      {won && (
        <div className="win" role="dialog" aria-label="You won">
          <div className="win__card">
            <h2 className="win__title">You won! 🎉</h2>
            <p className="win__text">
              {moves} moves · {time}s
            </p>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => startGame()}
            >
              Play again
            </button>
          </div>
        </div>
      )}

      <footer className="app__footer">
        <small>Built with React + Vite</small>
      </footer>
    </div>
  )
}

export default App