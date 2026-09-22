import { useState, useEffect, useCallback } from 'react'
import './App.css'

const EMOJIS = ['🐶', '🐱', '🐰', '🦊', '🐼', '🐨', '🐯', '🦁']

function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function buildDeck() {
  const pairs = [...EMOJIS, ...EMOJIS]
  return shuffle(pairs).map((emoji, i) => ({
    id: i,
    emoji,
    isFlipped: false,
    isMatched: false,
  }))
}

export default function App() {
  const [deck, setDeck] = useState(() => buildDeck())
  const [picks, setPicks] = useState([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [locked, setLocked] = useState(false)
  const [bestMoves, setBestMoves] = useState(null)

  const totalPairs = EMOJIS.length
  const won = matches === totalPairs

  const handlePick = useCallback(
    (card) => {
      if (locked || card.isFlipped || card.isMatched) return
      setPicks((prev) => [...prev, card])
    },
    [locked],
  )

  useEffect(() => {
    if (picks.length !== 2) return
    setLocked(true)
    setMoves((m) => m + 1)
    const [a, b] = picks
    if (a.emoji === b.emoji) {
      setTimeout(() => {
        setDeck((prev) =>
          prev.map((c) =>
            c.id === a.id || c.id === b.id
              ? { ...c, isMatched: true, isFlipped: true }
              : c,
          ),
        )
        setPicks([])
        setLocked(false)
        setMatches((m) => m + 1)
      }, 500)
    } else {
      setTimeout(() => {
        setDeck((prev) =>
          prev.map((c) =>
            c.id === a.id || c.id === b.id ? { ...c, isFlipped: false } : c,
          ),
        )
        setPicks([])
        setLocked(false)
      }, 900)
    }
  }, [picks])

  useEffect(() => {
    if (won && (bestMoves === null || moves < bestMoves)) {
      setBestMoves(moves)
    }
  }, [won, moves, bestMoves])

  const reset = () => {
    setDeck(buildDeck())
    setPicks([])
    setMoves(0)
    setMatches(0)
    setLocked(false)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Memory Match</h1>
        <div className="stats">
          <div className="stat">
            <span className="stat-label">Moves</span>
            <span className="stat-value">{moves}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Matches</span>
            <span className="stat-value">
              {matches} / {totalPairs}
            </span>
          </div>
          {bestMoves !== null && (
            <div className="stat">
              <span className="stat-label">Best</span>
              <span className="stat-value">{bestMoves}</span>
            </div>
          )}
        </div>
      </header>

      <main className="board" aria-label="Memory card grid">
        {deck.map((card) => {
          const showFace = card.isFlipped || card.isMatched
          return (
            <button
              key={card.id}
              type="button"
              className={
                'card' +
                (showFace ? ' card--flipped' : '') +
                (card.isMatched ? ' card--matched' : '')
              }
              onClick={() => handlePick(card)}
              disabled={card.isMatched || locked}
              aria-label={
                showFace ? `${card.emoji}, face up` : 'Face down card'
              }
            >
              <span className="card__inner">
                <span className="card__back" aria-hidden="true">?</span>
                <span className="card__face" aria-hidden="true">
                  {card.emoji}
                </span>
              </span>
            </button>
          )
        })}
      </main>

      {won && (
        <div className="overlay" role="dialog" aria-modal="true">
          <div className="overlay__card">
            <h2>You won! 🎉</h2>
            <p>You matched all pairs in {moves} moves.</p>
            <button type="button" className="btn-primary" onClick={reset}>
              Play again
            </button>
          </div>
        </div>
      )}

      <button type="button" className="btn-reset" onClick={reset}>
        Reset
      </button>
    </div>
  )
}
