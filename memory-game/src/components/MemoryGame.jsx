import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import '../styles/game.css'

const EMOJI_POOL = [
  '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼',
  '🐨','🐯','🦁','🐮','🐷','🐸','🐙','🦋',
  '🦄','🐬','🦩','🦚','🦜','🦝','🦔','🐢',
]

const DIFFICULTIES = {
  easy:   { label: 'Easy',   pairs: 6,  cols: 4 },
  medium: { label: 'Medium', pairs: 10, cols: 5 },
  hard:   { label: 'Hard',   pairs: 16, cols: 6 },
}

function buildCards(pairs) {
  const emojis = EMOJI_POOL.slice(0, pairs)
  const deck = [...emojis, ...emojis].map((emoji, i) => ({
    id: i,
    emoji,
    flipped: false,
    matched: false,
  }))
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

export default function MemoryGame() {
  const { user, saveScore } = useAuth()
  const [difficulty, setDifficulty] = useState('easy')
  const [cards, setCards] = useState(() => buildCards(DIFFICULTY_PAIRS('easy')))
  const [flipped, setFlipped] = useState([])
  const [moves, setMoves] = useState(0)
  const [matched, setMatched] = useState(0)
  const [time, setTime] = useState(0)
  const [running, setRunning] = useState(false)
  const [won, setWon] = useState(false)
  const [locked, setLocked] = useState(false)
  const timerRef = useRef(null)

  function DIFFICULTY_PAIRS(d) {
    return DIFFICULTIES[d].pairs
  }

  const totalPairs = DIFFICULTIES[difficulty].pairs

  const startGame = useCallback((diff = difficulty) => {
    clearInterval(timerRef.current)
    setCards(buildCards(DIFFICULTIES[diff].pairs))
    setFlipped([])
    setMoves(0)
    setMatched(0)
    setTime(0)
    setWon(false)
    setLocked(false)
    setRunning(false)
  }, [difficulty])

  useEffect(() => {
    startGame(difficulty)
  }, [difficulty]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setTime((t) => t + 1), 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [running])

  useEffect(() => {
    if (matched > 0 && matched === totalPairs) {
      clearInterval(timerRef.current)
      setRunning(false)
      setWon(true)
      saveScore({ moves, time, difficulty })
    }
  }, [matched]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleCardClick(idx) {
    if (locked || cards[idx].flipped || cards[idx].matched) return

    if (!running && !won) setRunning(true)

    const newCards = cards.map((c, i) => i === idx ? { ...c, flipped: true } : c)
    const newFlipped = [...flipped, idx]
    setCards(newCards)
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setLocked(true)
      setMoves((m) => m + 1)
      const [a, b] = newFlipped
      if (newCards[a].emoji === newCards[b].emoji) {
        setTimeout(() => {
          setCards((cs) => cs.map((c, i) =>
            i === a || i === b ? { ...c, matched: true } : c
          ))
          setMatched((m) => m + 1)
          setFlipped([])
          setLocked(false)
        }, 500)
      } else {
        setTimeout(() => {
          setCards((cs) => cs.map((c, i) =>
            i === a || i === b ? { ...c, flipped: false } : c
          ))
          setFlipped([])
          setLocked(false)
        }, 900)
      }
    }
  }

  const cols = DIFFICULTIES[difficulty].cols

  return (
    <div className="game-wrapper">
      <div className="game-header">
        <div className="game-stats">
          <div className="stat-box">
            <span className="stat-label">Moves</span>
            <span className="stat-value">{moves}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Time</span>
            <span className="stat-value">{formatTime(time)}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Pairs</span>
            <span className="stat-value">{matched}/{totalPairs}</span>
          </div>
        </div>

        <div className="game-controls">
          <div className="difficulty-tabs">
            {Object.entries(DIFFICULTIES).map(([key, { label }]) => (
              <button
                key={key}
                className={`diff-btn ${difficulty === key ? 'active' : ''}`}
                onClick={() => setDifficulty(key)}
              >
                {label}
              </button>
            ))}
          </div>
          <button className="btn-restart" onClick={() => startGame(difficulty)}>↺ Restart</button>
        </div>
      </div>

      <div
        className="card-grid"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {cards.map((card, idx) => (
          <div
            key={card.id}
            className={`card ${card.flipped || card.matched ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
            onClick={() => handleCardClick(idx)}
            role="button"
            aria-label={card.flipped || card.matched ? card.emoji : 'Hidden card'}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleCardClick(idx)}
          >
            <div className="card-inner">
              <div className="card-back">❓</div>
              <div className="card-front">{card.emoji}</div>
            </div>
          </div>
        ))}
      </div>

      {won && (
        <div className="win-overlay" role="dialog" aria-modal="true">
          <div className="win-card">
            <div className="win-emoji">🎉</div>
            <h2>You won!</h2>
            <p>
              Completed in <strong>{moves} moves</strong> and{' '}
              <strong>{formatTime(time)}</strong>
            </p>
            <p className="win-user">Nice work, <strong>{user?.username}</strong>!</p>
            <div className="win-actions">
              <button className="btn-primary" onClick={() => startGame(difficulty)}>
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function formatTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, '0')
  const sec = (s % 60).toString().padStart(2, '0')
  return `${m}:${sec}`
}
