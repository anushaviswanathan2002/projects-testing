import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Game.css'

const EMOJIS = ['🐶', '🐱', '🐸', '🦊', '🐻', '🦁', '🐼', '🦄', '🐙', '🦋', '🌸', '⭐', '🍕', '🎸', '🚀', '🎯']

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildDeck(count) {
  const emojis = EMOJIS.slice(0, count / 2)
  return shuffle([...emojis, ...emojis].map((emoji, i) => ({
    id: i,
    emoji,
    flipped: false,
    matched: false,
  })))
}

const DIFFICULTY = {
  easy:   { label: 'Easy',   pairs: 6,  cols: 4 },
  medium: { label: 'Medium', pairs: 8,  cols: 4 },
  hard:   { label: 'Hard',   pairs: 12, cols: 6 },
}

export default function Game() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [difficulty, setDifficulty] = useState('medium')
  const [cards, setCards] = useState(() => buildDeck(DIFFICULTY.medium.pairs * 2))
  const [flipped, setFlipped] = useState([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [locked, setLocked] = useState(false)
  const [time, setTime] = useState(0)
  const [running, setRunning] = useState(false)
  const [won, setWon] = useState(false)

  const totalPairs = DIFFICULTY[difficulty].pairs

  // Timer
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setTime(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [running])

  // Win detection
  useEffect(() => {
    if (matches > 0 && matches === totalPairs) {
      setRunning(false)
      setWon(true)
    }
  }, [matches, totalPairs])

  const startGame = useCallback((diff = difficulty) => {
    const d = DIFFICULTY[diff]
    setCards(buildDeck(d.pairs * 2))
    setFlipped([])
    setMoves(0)
    setMatches(0)
    setLocked(false)
    setTime(0)
    setRunning(false)
    setWon(false)
  }, [difficulty])

  function handleDifficulty(diff) {
    setDifficulty(diff)
    startGame(diff)
  }

  function handleCardClick(card) {
    if (locked || card.flipped || card.matched) return

    if (!running) setRunning(true)

    const newFlipped = [...flipped, card.id]
    setCards(prev => prev.map(c => c.id === card.id ? { ...c, flipped: true } : c))

    if (newFlipped.length === 1) {
      setFlipped(newFlipped)
      return
    }

    // Two cards flipped
    setMoves(m => m + 1)
    setFlipped([])
    setLocked(true)

    const [firstId, secondId] = newFlipped
    const first = cards.find(c => c.id === firstId)
    const second = card

    if (first.emoji === second.emoji) {
      setCards(prev => prev.map(c =>
        c.id === firstId || c.id === secondId ? { ...c, matched: true, flipped: true } : c
      ))
      setMatches(m => m + 1)
      setLocked(false)
    } else {
      setTimeout(() => {
        setCards(prev => prev.map(c =>
          c.id === firstId || c.id === secondId ? { ...c, flipped: false } : c
        ))
        setLocked(false)
      }, 900)
    }
  }

  function formatTime(s) {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const cols = DIFFICULTY[difficulty].cols

  return (
    <div className="game-page">
      {/* Navbar */}
      <header className="game-nav">
        <div className="game-nav-logo">🃏 Memory</div>
        <div className="game-nav-right">
          <span className="game-nav-user">👤 {user?.username}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="game-main">
        {/* Controls */}
        <div className="game-controls">
          <div className="difficulty-tabs">
            {Object.entries(DIFFICULTY).map(([key, val]) => (
              <button
                key={key}
                className={`diff-tab ${difficulty === key ? 'active' : ''}`}
                onClick={() => handleDifficulty(key)}
              >
                {val.label}
              </button>
            ))}
          </div>
          <button className="new-game-btn" onClick={() => startGame(difficulty)}>
            🔄 New Game
          </button>
        </div>

        {/* Stats */}
        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">Moves</span>
            <span className="stat-value">{moves}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Pairs</span>
            <span className="stat-value">{matches} / {totalPairs}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Time</span>
            <span className="stat-value">{formatTime(time)}</span>
          </div>
        </div>

        {/* Board */}
        <div
          className="card-grid"
          style={{ '--cols': cols }}
        >
          {cards.map(card => (
            <div
              key={card.id}
              className={`card ${card.flipped || card.matched ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
              onClick={() => handleCardClick(card)}
              role="button"
              aria-label={card.flipped || card.matched ? card.emoji : 'Hidden card'}
            >
              <div className="card-inner">
                <div className="card-front">
                  <span className="card-emoji">{card.emoji}</span>
                </div>
                <div className="card-back">
                  <span className="card-back-icon">❓</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Win overlay */}
        {won && (
          <div className="win-overlay" role="dialog" aria-modal="true" aria-label="You won!">
            <div className="win-card">
              <div className="win-emoji">🎉</div>
              <h2>You Won!</h2>
              <p>Solved in <strong>{moves}</strong> moves and <strong>{formatTime(time)}</strong></p>
              <button className="auth-btn" onClick={() => startGame(difficulty)}>Play Again</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
