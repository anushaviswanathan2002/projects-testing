import { useMemo, useState, useCallback } from 'react'
import { useAuth } from './useAuth'
import AuthScreen from './AuthScreen'
import './App.css'

const EMOJIS = ['🐶', '🐱', '🦊', '🐼', '🐯', '🦁', '🐨', '🐸']
const PAIR_COUNT = EMOJIS.length // 8 pairs = 16 cards (4x4)
const BEST_KEY_PREFIX = 'memory_app_best_v1::'

function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function buildDeck() {
  const pairs = EMOJIS.flatMap((emoji, i) => [
    { id: `${i}-a`, pairId: i, emoji },
    { id: `${i}-b`, pairId: i, emoji },
  ])
  return shuffle(pairs)
}

function bestKeyFor(username) {
  return `${BEST_KEY_PREFIX}${username}`
}

function loadBestFor(username) {
  try {
    const raw = localStorage.getItem(bestKeyFor(username))
    return raw ? Number(raw) : null
  } catch {
    return null
  }
}

function saveBestFor(username, value) {
  try {
    localStorage.setItem(bestKeyFor(username), String(value))
  } catch {
    /* ignore */
  }
}

function MemoryGame({ username, onLogout }) {
  // Game state. Keyed by username via the parent's <MemoryGame key={...}/>,
  // so a fresh component (and fresh state) is mounted when the user changes.
  const [deck, setDeck] = useState(buildDeck)
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState(() => new Set())
  const [moves, setMoves] = useState(0)
  const [locked, setLocked] = useState(false)
  const [hasRecordedScore, setHasRecordedScore] = useState(false)
  const [bestMoves, setBestMoves] = useState(() => loadBestFor(username))

  const reset = useCallback(() => {
    setDeck(buildDeck())
    setFlipped([])
    setMatched(new Set())
    setMoves(0)
    setLocked(false)
    setHasRecordedScore(false)
  }, [])

  const handleFlip = (idx) => {
    if (locked) return
    if (hasRecordedScore) return
    if (flipped.includes(idx)) return
    if (matched.has(deck[idx].pairId)) return

    const next = [...flipped, idx]
    setFlipped(next)

    if (next.length === 2) {
      const [a, b] = next
      const isMatch = deck[a].pairId === deck[b].pairId
      const newMoves = moves + 1
      setMoves(newMoves)
      setLocked(true)

      if (isMatch) {
        setMatched((prev) => {
          const s = new Set(prev)
          s.add(deck[a].pairId)

          if (s.size === PAIR_COUNT) {
            setBestMoves((prevBest) => {
              const best = prevBest == null ? newMoves : Math.min(prevBest, newMoves)
              saveBestFor(username, best)
              return best
            })
            setHasRecordedScore(true)
          }
          return s
        })
        setTimeout(() => {
          setFlipped([])
          setLocked(false)
        }, 450)
      } else {
        setTimeout(() => {
          setFlipped([])
          setLocked(false)
        }, 850)
      }
    }
  }

  const won = hasRecordedScore
  const remaining = PAIR_COUNT - matched.size

  const statusText = useMemo(() => {
    if (won) return 'You matched them all!'
    if (locked && flipped.length === 2) return 'Checking…'
    return 'Find the matching pairs.'
  }, [won, locked, flipped])

  return (
    <div className="game">
      <header className="topbar">
        <div className="brand">
          <span className="brand-logo" aria-hidden="true">🧠</span>
          <span className="brand-name">Memory</span>
        </div>
        <div className="user-chip">
          <span className="user-avatar" aria-hidden="true">
            {username.slice(0, 1).toUpperCase()}
          </span>
          <span className="user-name" title={username}>
            {username}
          </span>
          <button className="logout-btn" onClick={onLogout} type="button">
            Log out
          </button>
        </div>
      </header>

      <main className="stage">
        <section className="hud">
          <div className="hud-stat">
            <span className="hud-label">Moves</span>
            <span className="hud-value">{moves}</span>
          </div>
          <div className="hud-stat">
            <span className="hud-label">Pairs left</span>
            <span className="hud-value">{remaining}</span>
          </div>
          <div className="hud-stat">
            <span className="hud-label">Best</span>
            <span className="hud-value">{bestMoves == null ? '—' : bestMoves}</span>
          </div>
          <button className="reset-btn" onClick={reset} type="button">
            New Game
          </button>
        </section>

        <p className="status">{statusText}</p>

        <div className="grid" role="grid" aria-label="Memory card grid">
          {deck.map((card, idx) => {
            const isMatched = matched.has(card.pairId)
            const isFlipped = flipped.includes(idx) || isMatched || won
            return (
              <button
                key={card.id}
                type="button"
                className={
                  'card' +
                  (isFlipped ? ' flipped' : '') +
                  (isMatched ? ' matched' : '')
                }
                onClick={() => handleFlip(idx)}
                aria-label={isFlipped ? card.emoji : 'Hidden card'}
                aria-pressed={isFlipped}
                disabled={locked && !isFlipped}
              >
                <span className="card-face card-back" aria-hidden="true">?</span>
                <span className="card-face card-front" aria-hidden="true">{card.emoji}</span>
              </button>
            )
          })}
        </div>

        {won && (
          <div className="win-banner" role="dialog" aria-live="polite">
            <div className="win-card">
              <h2>🎉 You Win!</h2>
              <p>
                You matched all <strong>{PAIR_COUNT}</strong> pairs in{' '}
                <strong>{moves}</strong> moves.
              </p>
              {bestMoves != null && (
                <p className="win-best">
                  {moves <= bestMoves
                    ? 'New personal best! 🏆'
                    : `Personal best: ${bestMoves} moves.`}
                </p>
              )}
              <button className="reset-btn primary" onClick={reset} type="button">
                Play again
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function App() {
  const { user, logout } = useAuth()
  if (!user) return <AuthScreen />
  return <MemoryGame key={user.username} username={user.username} onLogout={logout} />
}

export default App
