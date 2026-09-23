import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import styles from './MemoryGame.module.css'

const EMOJI_POOL = [
  '🦁','🐯','🦊','🐺','🦝','🐻','🐼','🦄',
  '🐸','🦋','🐙','🦑','🐠','🦈','🦅','🦜',
  '🌸','🌺','🌻','🌈','⚡','🔥','❄️','🌊',
  '🎸','🎺','🎻','🎹','🎯','🎲','🎪','🎭',
  '🍕','🍔','🍦','🍩','🍓','🍋','🍇','🍑',
  '🚀','🛸','🌙','⭐','🌍','☄️','🔭','🪐',
]

const DIFFICULTY = {
  easy:   { pairs: 6,  cols: 4, label: 'Easy',   time: null },
  medium: { pairs: 10, cols: 5, label: 'Medium',  time: null },
  hard:   { pairs: 18, cols: 6, label: 'Hard',    time: null },
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

function buildDeck(pairs) {
  const emojis = shuffle(EMOJI_POOL).slice(0, pairs)
  return shuffle([...emojis, ...emojis].map((emoji, id) => ({
    id,
    emoji,
    flipped: false,
    matched: false,
  })))
}

export default function MemoryGame() {
  const { saveScore } = useAuth()
  const [difficulty, setDifficulty] = useState('easy')
  const [cards, setCards] = useState(() => buildDeck(DIFFICULTY.easy.pairs))
  const [flipped, setFlipped] = useState([])   // indices of currently flipped (unmatched) cards
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [locked, setLocked] = useState(false)  // prevents extra flips during check
  const [gameState, setGameState] = useState('idle') // idle | playing | won
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef(null)
  const startRef = useRef(null)

  const totalPairs = DIFFICULTY[difficulty].pairs

  // Timer
  useEffect(() => {
    if (gameState === 'playing') {
      startRef.current = Date.now() - elapsed * 1000
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startRef.current) / 1000))
      }, 500)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [gameState]) // eslint-disable-line

  // Check win
  useEffect(() => {
    if (matches > 0 && matches === totalPairs) {
      setGameState('won')
      saveScore({
        moves,
        time: elapsed,
        difficulty,
        date: new Date().toISOString(),
      })
    }
  }, [matches, totalPairs]) // eslint-disable-line

  const startGame = useCallback((diff = difficulty) => {
    const d = DIFFICULTY[diff]
    setCards(buildDeck(d.pairs))
    setFlipped([])
    setMoves(0)
    setMatches(0)
    setLocked(false)
    setElapsed(0)
    setGameState('playing')
  }, [difficulty])

  const handleCardClick = (index) => {
    if (locked) return
    if (cards[index].flipped || cards[index].matched) return
    if (flipped.length === 1 && flipped[0] === index) return

    const newCards = cards.map((c, i) =>
      i === index ? { ...c, flipped: true } : c
    )
    const newFlipped = [...flipped, index]
    setCards(newCards)
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setMoves(m => m + 1)
      const [a, b] = newFlipped
      if (newCards[a].emoji === newCards[b].emoji) {
        // Match!
        setTimeout(() => {
          setCards(prev => prev.map((c, i) =>
            i === a || i === b ? { ...c, matched: true } : c
          ))
          setMatches(m => m + 1)
          setFlipped([])
        }, 400)
      } else {
        // No match — flip back
        setLocked(true)
        setTimeout(() => {
          setCards(prev => prev.map((c, i) =>
            i === a || i === b ? { ...c, flipped: false } : c
          ))
          setFlipped([])
          setLocked(false)
        }, 900)
      }
    }
  }

  const changeDifficulty = (d) => {
    setDifficulty(d)
    setGameState('idle')
    setCards(buildDeck(DIFFICULTY[d].pairs))
    setFlipped([])
    setMoves(0)
    setMatches(0)
    setElapsed(0)
  }

  const cols = DIFFICULTY[difficulty].cols

  return (
    <div className={styles.wrapper}>
      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.diffRow}>
          {Object.entries(DIFFICULTY).map(([key, val]) => (
            <button
              key={key}
              className={`${styles.diffBtn} ${difficulty === key ? styles.diffBtnActive : ''}`}
              onClick={() => changeDifficulty(key)}
            >
              {val.label}
            </button>
          ))}
        </div>

        <div className={styles.hud}>
          <div className={styles.hudItem}>
            <span className={styles.hudIcon}>🎯</span>
            <div>
              <div className={styles.hudValue}>{moves}</div>
              <div className={styles.hudLabel}>Moves</div>
            </div>
          </div>
          <div className={styles.hudItem}>
            <span className={styles.hudIcon}>✅</span>
            <div>
              <div className={styles.hudValue}>{matches}/{totalPairs}</div>
              <div className={styles.hudLabel}>Pairs</div>
            </div>
          </div>
          <div className={styles.hudItem}>
            <span className={styles.hudIcon}>⏱️</span>
            <div>
              <div className={styles.hudValue}>{formatTime(elapsed)}</div>
              <div className={styles.hudLabel}>Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Board or start screen */}
      {gameState === 'idle' ? (
        <div className={styles.startScreen}>
          <div className={styles.startEmoji}>🃏</div>
          <h2 className={styles.startTitle}>Ready to play?</h2>
          <p className={styles.startSub}>
            {DIFFICULTY[difficulty].pairs} pairs · {difficulty} mode
          </p>
          <button className={styles.startBtn} onClick={() => startGame(difficulty)}>
            Start Game →
          </button>
        </div>
      ) : gameState === 'won' ? (
        <WinScreen moves={moves} elapsed={elapsed} difficulty={difficulty} onPlay={() => startGame(difficulty)} />
      ) : (
        <div
          className={styles.board}
          style={{ '--cols': cols }}
        >
          {cards.map((card, i) => (
            <Card key={card.id} card={card} index={i} onClick={handleCardClick} />
          ))}
        </div>
      )}

      {gameState === 'playing' && (
        <button className={styles.resetBtn} onClick={() => startGame(difficulty)}>
          🔄 Restart
        </button>
      )}
    </div>
  )
}

function Card({ card, index, onClick }) {
  return (
    <div
      className={`${styles.cardOuter} ${card.flipped || card.matched ? styles.cardFlipped : ''} ${card.matched ? styles.cardMatched : ''}`}
      onClick={() => onClick(index)}
      role="button"
      aria-label={card.flipped || card.matched ? `Card: ${card.emoji}` : 'Hidden card'}
    >
      <div className={styles.cardInner}>
        <div className={styles.cardBack}>❓</div>
        <div className={styles.cardFront}>{card.emoji}</div>
      </div>
    </div>
  )
}

function WinScreen({ moves, elapsed, difficulty, onPlay }) {
  const rating = moves <= DIFFICULTY[difficulty].pairs * 1.5 ? '⭐⭐⭐'
               : moves <= DIFFICULTY[difficulty].pairs * 2.5 ? '⭐⭐'
               : '⭐'
  return (
    <div className={styles.winScreen}>
      <div className={styles.winConfetti}>🎉</div>
      <h2 className={styles.winTitle}>You Won!</h2>
      <p className={styles.winRating}>{rating}</p>
      <div className={styles.winStats}>
        <div className={styles.winStat}>
          <span className={styles.winStatVal}>{moves}</span>
          <span className={styles.winStatLabel}>Moves</span>
        </div>
        <div className={styles.winStat}>
          <span className={styles.winStatVal}>{formatTime(elapsed)}</span>
          <span className={styles.winStatLabel}>Time</span>
        </div>
        <div className={styles.winStat}>
          <span className={styles.winStatVal}>{difficulty}</span>
          <span className={styles.winStatLabel}>Difficulty</span>
        </div>
      </div>
      <button className={styles.startBtn} onClick={onPlay}>
        Play Again →
      </button>
    </div>
  )
}

function formatTime(s) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}
