import { useEffect, useState, useCallback } from 'react'
import Header from './components/Header.jsx'
import Board from './components/Board.jsx'
import WinModal from './components/WinModal.jsx'
import { buildDeck } from './game/deck.js'
import './App.css'

const DEFAULT_PAIRS = 8

export default function App() {
  const [pairCount, setPairCount] = useState(DEFAULT_PAIRS)
  const [deck, setDeck] = useState(() => buildDeck(DEFAULT_PAIRS))
  const [flipped, setFlipped] = useState([]) // indices currently face-up
  const [matched, setMatched] = useState(new Set())
  const [moves, setMoves] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const [locked, setLocked] = useState(false)
  const [won, setWon] = useState(false)

  // Reset board when pair count changes
  const resetGame = useCallback((pairs = pairCount) => {
    setDeck(buildDeck(pairs))
    setFlipped([])
    setMatched(new Set())
    setMoves(0)
    setSeconds(0)
    setRunning(false)
    setLocked(false)
    setWon(false)
  }, [pairCount])

  const handlePairChange = (n) => {
    setPairCount(n)
    resetGame(n)
  }

  // Timer
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [running])

  // Card click handler
  const handleCardClick = (index) => {
    if (locked) return
    if (matched.has(index)) return
    if (flipped.includes(index)) return
    if (flipped.length === 2) return

    if (!running) setRunning(true)

    const next = [...flipped, index]
    setFlipped(next)

    if (next.length === 2) {
      setMoves((m) => m + 1)
      const [a, b] = next
      if (deck[a].pairId === deck[b].pairId) {
        // Match
        setMatched((prev) => {
          const updated = new Set(prev)
          updated.add(a)
          updated.add(b)
          return updated
        })
        setFlipped([])
      } else {
        // Mismatch — flip back after short delay
        setLocked(true)
        setTimeout(() => {
          setFlipped([])
          setLocked(false)
        }, 800)
      }
    }
  }

  // Win detection
  useEffect(() => {
    if (matched.size === deck.length && deck.length > 0) {
      setRunning(false)
      setWon(true)
    }
  }, [matched, deck])

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const ss = (s % 60).toString().padStart(2, '0')
    return `${m}:${ss}`
  }

  return (
    <div className="app">
      <Header
        moves={moves}
        time={formatTime(seconds)}
        pairCount={pairCount}
        onPairChange={handlePairChange}
        onReset={() => resetGame()}
      />
      <Board
        deck={deck}
        flipped={flipped}
        matched={matched}
        onCardClick={handleCardClick}
      />
      <WinModal
        open={won}
        moves={moves}
        time={formatTime(seconds)}
        pairs={pairCount}
        onPlayAgain={() => resetGame()}
      />
    </div>
  )
}
