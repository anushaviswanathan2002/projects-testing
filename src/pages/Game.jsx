import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Card from '../components/Card'

const EMOJIS = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐙','🦋']

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildDeck(count = 8) {
  const chosen = shuffle(EMOJIS).slice(0, count)
  const pairs = [...chosen, ...chosen]
  return shuffle(pairs).map((emoji, i) => ({
    id: i,
    emoji,
    isFlipped: false,
    isMatched: false,
  }))
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function Game() {
  const { user, logout, saveScore, getUserStats } = useAuth()
  const [cards, setCards] = useState(() => buildDeck())
  const [flipped, setFlipped] = useState([])
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [locked, setLocked] = useState(false)
  const [stats, setStats] = useState(null)
  const [difficulty, setDifficulty] = useState('normal') // easy=6 pairs, normal=8, hard=16
  const timerRef = useRef(null)

  const pairCount = difficulty === 'easy' ? 6 : difficulty === 'hard' ? 16 : 8

  useEffect(() => {
    setStats(getUserStats())
  }, [gameWon])

  // Timer
  useEffect(() => {
    if (gameStarted && !gameWon) {
      timerRef.current = setInterval(() => setTime(t => t + 1), 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [gameStarted, gameWon])

  // Check win
  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.isMatched)) {
      setGameWon(true)
      const updated = saveScore(moves, time)
      if (updated) setStats(updated)
    }
  }, [cards])

  const handleCardClick = useCallback((id) => {
    if (locked || gameWon) return
    if (flipped.includes(id)) return
    const card = cards.find(c => c.id === id)
    if (!card || card.isMatched) return

    if (!gameStarted) setGameStarted(true)

    const newFlipped = [...flipped, id]
    setCards(prev => prev.map(c => c.id === id ? { ...c, isFlipped: true } : c))

    if (newFlipped.length === 2) {
      setLocked(true)
      setMoves(m => m + 1)
      const [a, b] = newFlipped.map(fid => cards.find(c => c.id === fid))
      if (a.emoji === b.emoji) {
        setCards(prev => prev.map(c =>
          newFlipped.includes(c.id) ? { ...c, isMatched: true, isFlipped: true } : c
        ))
        setFlipped([])
        setLocked(false)
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            newFlipped.includes(c.id) ? { ...c, isFlipped: false } : c
          ))
          setFlipped([])
          setLocked(false)
        }, 900)
      }
    } else {
      setFlipped(newFlipped)
    }
  }, [locked, gameWon, flipped, cards, gameStarted])

  function restart() {
    clearInterval(timerRef.current)
    setCards(buildDeck(pairCount))
    setFlipped([])
    setMoves(0)
    setTime(0)
    setGameStarted(false)
    setGameWon(false)
    setLocked(false)
  }

  function changeDifficulty(d) {
    setDifficulty(d)
    clearInterval(timerRef.current)
    const count = d === 'easy' ? 6 : d === 'hard' ? 16 : 8
    setCards(buildDeck(count))
    setFlipped([])
    setMoves(0)
    setTime(0)
    setGameStarted(false)
    setGameWon(false)
    setLocked(false)
  }

  const matched = cards.filter(c => c.isMatched).length / 2
  const total = cards.length / 2

  const gridClass = pairCount === 6 ? 'grid-6' : pairCount === 16 ? 'grid-16' : 'grid-8'

  return (
    <div className="game-page">
      {/* Header */}
      <header className="game-header">
        <div className="game-brand">
          <span>🃏</span>
          <span>Memory Game</span>
        </div>
        <div className="user-info">
          <span className="avatar">{user.username[0].toUpperCase()}</span>
          <span className="username">{user.username}</span>
          <button className="btn-logout" onClick={logout}>Logout</button>
        </div>
      </header>

      <main className="game-main">
        {/* Stats bar */}
        <div className="stats-bar">
          <div className="stat">
            <span className="stat-label">Moves</span>
            <span className="stat-value">{moves}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Pairs</span>
            <span className="stat-value">{matched}/{total}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Time</span>
            <span className="stat-value">{formatTime(time)}</span>
          </div>
          {stats?.bestScore && (
            <div className="stat best">
              <span className="stat-label">Best</span>
              <span className="stat-value">{stats.bestScore.moves} moves</span>
            </div>
          )}
        </div>

        {/* Difficulty */}
        <div className="difficulty-bar">
          {['easy', 'normal', 'hard'].map(d => (
            <button
              key={d}
              className={`diff-btn ${difficulty === d ? 'active' : ''}`}
              onClick={() => changeDifficulty(d)}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
          <button className="restart-btn" onClick={restart}>🔄 New Game</button>
        </div>

        {/* Win overlay */}
        {gameWon && (
          <div className="win-overlay">
            <div className="win-card">
              <div className="win-icon">🎉</div>
              <h2>You won!</h2>
              <p>You matched all {total} pairs in <strong>{moves} moves</strong> and <strong>{formatTime(time)}</strong>.</p>
              {stats?.bestScore && (
                <p className="best-note">
                  🏆 Best: {stats.bestScore.moves} moves — {formatTime(stats.bestScore.time)}
                </p>
              )}
              <div className="win-actions">
                <button className="btn-primary" onClick={restart}>Play again</button>
              </div>
            </div>
          </div>
        )}

        {/* Card grid */}
        <div className={`card-grid ${gridClass}`}>
          {cards.map(card => (
            <Card key={card.id} card={card} onClick={() => handleCardClick(card.id)} />
          ))}
        </div>

        {/* Player info bar */}
        {stats && (
          <div className="player-stats">
            <span>🎮 Games played: <strong>{stats.gamesPlayed}</strong></span>
            {stats.bestScore && (
              <span>🏆 Best: <strong>{stats.bestScore.moves} moves</strong> in <strong>{formatTime(stats.bestScore.time)}</strong></span>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
