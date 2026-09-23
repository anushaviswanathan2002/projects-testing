import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from './Card';
import './MemoryGame.css';

const EMOJI_POOL = [
  '🐶','🐱','🦊','🐻','🐼','🦁','🐯','🦄','🐸','🐙',
  '🦋','🌺','🍕','🎸','🚀','⚡','🎯','💎','🏆','🎪',
  '🍦','🎠','🌈','🔮','🎭',
];

const DIFFICULTY = {
  easy:   { label: 'Easy',   pairs: 6,  cols: 4 },
  medium: { label: 'Medium', pairs: 10, cols: 5 },
  hard:   { label: 'Hard',   pairs: 15, cols: 6 },
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(pairs) {
  const chosen = shuffle(EMOJI_POOL).slice(0, pairs);
  return shuffle([...chosen, ...chosen].map((emoji, idx) => ({
    id: idx,
    emoji,
    flipped: false,
    matched: false,
  })));
}

function calcScore(moves, timeMs, pairs) {
  const timeSec = timeMs / 1000;
  const base = pairs * 100;
  const moveBonus = Math.max(0, (pairs * 2 - (moves - pairs)) * 5);
  const timeBonus = Math.max(0, Math.floor(600 - timeSec) * 2);
  return Math.max(0, base + moveBonus + timeBonus);
}

function formatTime(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}

export default function MemoryGame({ onLeaderboard }) {
  const { user, saveScore } = useAuth();

  const [difficulty, setDifficulty] = useState('medium');
  const [phase, setPhase] = useState('setup'); // setup | playing | won
  const [cards, setCards] = useState([]);
  const [flippedIds, setFlippedIds] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [score, setScore] = useState(null);
  const [blocking, setBlocking] = useState(false);

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const cfg = DIFFICULTY[difficulty];

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  useEffect(() => () => stopTimer(), [stopTimer]);

  function startGame() {
    stopTimer();
    const deck = buildDeck(cfg.pairs);
    setCards(deck);
    setFlippedIds([]);
    setMoves(0);
    setMatchedCount(0);
    setElapsed(0);
    setScore(null);
    setBlocking(false);
    setPhase('playing');
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed(Date.now() - startTimeRef.current);
    }, 500);
  }

  function handleCardClick(card) {
    if (blocking || flippedIds.length >= 2) return;
    if (flippedIds.includes(card.id)) return;

    const newFlipped = [...flippedIds, card.id];
    setFlippedIds(newFlipped);
    setCards(prev => prev.map(c => c.id === card.id ? { ...c, flipped: true } : c));

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = newFlipped.map(id => cards.find(c => c.id === id));
      const isMatch = a.emoji === b.emoji;

      if (isMatch) {
        setCards(prev => prev.map(c =>
          newFlipped.includes(c.id) ? { ...c, flipped: true, matched: true } : c
        ));
        setFlippedIds([]);
        setMatchedCount(mc => {
          const next = mc + 1;
          if (next === cfg.pairs) {
            stopTimer();
            const finalTime = Date.now() - startTimeRef.current;
            const finalMoves = moves + 1;
            const finalScore = calcScore(finalMoves, finalTime, cfg.pairs);
            setScore(finalScore);
            setPhase('won');
            saveScore({
              score: finalScore,
              moves: finalMoves,
              time: finalTime,
              difficulty,
              date: new Date().toISOString(),
            });
          }
          return next;
        });
      } else {
        setBlocking(true);
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            newFlipped.includes(c.id) && !c.matched ? { ...c, flipped: false } : c
          ));
          setFlippedIds([]);
          setBlocking(false);
        }, 900);
      }
    }
  }

  /* ── UI ── */
  if (phase === 'setup') {
    return (
      <div className="game-setup card">
        <div className="game-logo">🧠</div>
        <h2 className="game-setup-title">Memory Match</h2>
        <p className="game-setup-sub">Select difficulty and flip your way to victory!</p>

        <div className="difficulty-group">
          {Object.entries(DIFFICULTY).map(([key, val]) => (
            <button
              key={key}
              className={`diff-btn ${difficulty === key ? 'active' : ''}`}
              onClick={() => setDifficulty(key)}
            >
              <span className="diff-label">{val.label}</span>
              <span className="diff-meta">{val.pairs} pairs</span>
            </button>
          ))}
        </div>

        <button className="btn btn-primary game-start-btn" onClick={startGame}>
          ▶ Start Game
        </button>
      </div>
    );
  }

  if (phase === 'won') {
    return (
      <div className="game-won card">
        <div className="won-emoji">🏆</div>
        <h2>You won!</h2>
        <p className="won-sub">Congratulations, {user.username}!</p>

        <div className="won-stats">
          <div className="stat-item">
            <span className="stat-label">Score</span>
            <span className="stat-val accent">{score.toLocaleString()}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Moves</span>
            <span className="stat-val">{moves}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Time</span>
            <span className="stat-val">{formatTime(elapsed)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Difficulty</span>
            <span className="stat-val">{cfg.label}</span>
          </div>
        </div>

        <div className="won-actions">
          <button className="btn btn-primary" onClick={startGame}>Play Again</button>
          <button className="btn btn-outline" onClick={() => setPhase('setup')}>Change Difficulty</button>
          <button className="btn btn-ghost" onClick={onLeaderboard}>Leaderboard</button>
        </div>
      </div>
    );
  }

  // playing
  const progress = (matchedCount / cfg.pairs) * 100;

  return (
    <div className="game-play">
      <div className="game-hud">
        <div className="hud-item">
          <span className="hud-label">⏱ Time</span>
          <span className="hud-val">{formatTime(elapsed)}</span>
        </div>
        <div className="hud-item">
          <span className="hud-label">🃏 Moves</span>
          <span className="hud-val">{moves}</span>
        </div>
        <div className="hud-item">
          <span className="hud-label">✅ Pairs</span>
          <span className="hud-val">{matchedCount}/{cfg.pairs}</span>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={startGame}>↺ Restart</button>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div
        className="card-grid"
        style={{ gridTemplateColumns: `repeat(${cfg.cols}, 1fr)` }}
      >
        {cards.map(card => (
          <Card
            key={card.id}
            card={card}
            onClick={handleCardClick}
            disabled={blocking || flippedIds.length >= 2}
          />
        ))}
      </div>
    </div>
  );
}
