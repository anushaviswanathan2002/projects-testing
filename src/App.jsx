import { useEffect, useState, useCallback, useRef } from 'react'
import Board from './components/Board.jsx'
import StatsBar from './components/StatsBar.jsx'
import WinModal from './components/WinModal.jsx'
import AuthGate from './components/AuthGate.jsx'
import { useAuth } from './context/AuthContext.jsx'
import { buildDeck, EMOJI_THEMES } from './lib/deck.js'
import { loadBestFor, saveBestFor } from './lib/auth.js'

const GRID_SIZES = {
  easy: { pairs: 6, cols: 4 },
  medium: { pairs: 8, cols: 4 },
  hard: { pairs: 12, cols: 6 },
}

function MemoryGame() {
  const { user, logout } = useAuth()
  const [theme, setTheme] = useState('animals')
  const [difficulty, setDifficulty] = useState('medium')
  const [deck, setDeck] = useState([])
  const [flipped, setFlipped] = useState([]) // indices of currently flipped cards
  const [matchedIds, setMatchedIds] = useState(new Set())
  const [moves, setMoves] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [best, setBest] = useState(() => loadBestFor(user?.username))

  const lockRef = useRef(false)
  const timerRef = useRef(null)

  // Reload best scores when the signed-in user changes.
  useEffect(() => {
    setBest(loadBestFor(user?.username))
  }, [user])

  const { pairs, cols } = GRID_SIZES[difficulty]

  // Build / rebuild the deck whenever theme or difficulty changes
  const startGame = useCallback(() => {
    const newDeck = buildDeck(EMOJI_THEMES[theme], pairs)
    setDeck(newDeck)
    setFlipped([])
    setMatchedIds(new Set())
    setMoves(0)
    setElapsed(0)
    setRunning(true)
    lockRef.current = false
  }, [theme, pairs])

  // Initial game on mount
  useEffect(() => {
    startGame()
  }, [startGame])

  // Timer
  useEffect(() => {
    if (!running) return
    timerRef.current = setInterval(() => setElapsed((t) => t + 1), 1000)
    return () => clearInterval(timerRef.current)
  }, [running])

  const handleCardClick = useCallback(
    (index) => {
      if (lockRef.current) return
      if (flipped.includes(index)) return
      if (matchedIds.has(deck[index].id)) return

      const next = [...flipped, index]
      setFlipped(next)

      if (next.length === 2) {
        lockRef.current = true
        setMoves((m) => m + 1)
        const [a, b] = next
        const match = deck[a].id === deck[b].id
        if (match) {
          setTimeout(() => {
            setMatchedIds((prev) => {
              const nextSet = new Set(prev)
              nextSet.add(deck[a].id)
              return nextSet
            })
            setFlipped([])
            lockRef.current = false
          }, 450)
        } else {
          setTimeout(() => {
            setFlipped([])
            lockRef.current = false
          }, 900)
        }
      }
    },
    [flipped, matchedIds, deck]
  )

  const matchedCount = matchedIds.size
  const won = matchedCount === pairs && pairs > 0

  // Persist best score when the game is won
  useEffect(() => {
    if (!won) return
    setRunning(false)
    const key = `${theme}:${difficulty}`
    const entry = { moves, time: elapsed, at: Date.now() }
    setBest((prev) => {
      const current = prev[key]
      const isBetter =
        !current || moves < current.moves || (moves === current.moves && elapsed < current.time)
      const updated = isBetter ? { ...prev, [key]: entry } : prev
      saveBestFor(user?.username, updated)
      return updated
    })
  }, [won, theme, difficulty, moves, elapsed, user])

  const bestForCurrent = best[`${theme}:${difficulty}`]

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-main">
          <h1>
            <span className="logo">🧠</span> Memory
          </h1>
          <p className="tagline">
            Flip cards. Find pairs. Train your brain.
          </p>
        </div>
        <div className="hero-user">
          <span className="user-chip">
            <span className="avatar" aria-hidden="true">
              {user?.username?.[0]?.toUpperCase() || '?'}
            </span>
            <span className="user-name">{user?.username}</span>
          </span>
          <button type="button" className="btn ghost" onClick={logout}>
            Log out
          </button>
        </div>
      </header>

      <section className="controls">
        <div className="control-group">
          <label>Theme</label>
          <div className="chips">
            {Object.keys(EMOJI_THEMES).map((key) => (
              <button
                key={key}
                type="button"
                className={`chip ${theme === key ? 'active' : ''}`}
                onClick={() => setTheme(key)}
              >
                {EMOJI_THEMES[key][0]} {key}
              </button>
            ))}
          </div>
        </div>

        <div className="control-group">
          <label>Difficulty</label>
          <div className="chips">
            {Object.entries(GRID_SIZES).map(([key, cfg]) => (
              <button
                key={key}
                type="button"
                className={`chip ${difficulty === key ? 'active' : ''}`}
                onClick={() => setDifficulty(key)}
              >
                {key} <small>({cfg.pairs} pairs)</small>
              </button>
            ))}
          </div>
        </div>

        <button type="button" className="btn primary" onClick={startGame}>
          🔄 New game
        </button>
      </section>

      <StatsBar
        moves={moves}
        elapsed={elapsed}
        matched={matchedCount}
        total={pairs}
        best={bestForCurrent}
      />

      <Board
        deck={deck}
        flipped={flipped}
        matchedIds={matchedIds}
        cols={cols}
        onCardClick={handleCardClick}
      />

      <WinModal
        open={won}
        moves={moves}
        time={elapsed}
        best={bestForCurrent}
        onPlayAgain={startGame}
      />

      <footer className="footer">
        Built with React + Vite · {pairs * 2} cards · match them all to win
      </footer>
    </div>
  )
}

export default function App() {
  const { user, hydrated } = useAuth()

  if (!hydrated) {
    return (
      <div className="auth-screen">
        <div className="auth-card loading">Loading…</div>
      </div>
    )
  }

  if (!user) return <AuthGate />

  // Keying on username resets the game when a different user signs in.
  return <MemoryGame key={user.username} />
}
