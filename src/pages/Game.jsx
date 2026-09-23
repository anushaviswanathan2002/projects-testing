import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import './Game.css';

const EMOJI_POOL = [
  '🦊','🐼','🦁','🐸','🦋','🌺','🍕','🎸',
  '🚀','🎃','🌈','⚡','🍦','🎯','🏆','🔮',
  '🎨','🦄','🐉','🍄','🎭','🌙','🔥','💎',
];

const DIFFICULTIES = {
  easy:   { pairs: 6,  cols: 4, label: 'Easy' },
  medium: { pairs: 10, cols: 5, label: 'Medium' },
  hard:   { pairs: 12, cols: 6, label: 'Hard' },
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
  const emojis = shuffle(EMOJI_POOL).slice(0, pairs);
  const doubled = [...emojis, ...emojis];
  return shuffle(doubled).map((emoji, i) => ({
    id: i,
    emoji,
    flipped: false,
    matched: false,
  }));
}

function formatTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

export default function Game({ onLeaderboard }) {
  const { user, logout, updateStats } = useAuth();
  const [difficulty, setDifficulty] = useState('medium');
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [won, setWon] = useState(false);
  const [locked, setLocked] = useState(false);
  const timerRef = useRef(null);

  const startGame = useCallback((diff = difficulty) => {
    const { pairs } = DIFFICULTIES[diff];
    setCards(buildDeck(pairs));
    setFlipped([]);
    setMoves(0);
    setTime(0);
    setRunning(false);
    setWon(false);
    setLocked(false);
    clearInterval(timerRef.current);
  }, [difficulty]);

  useEffect(() => { startGame(difficulty); }, [difficulty]);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [running]);

  const handleCardClick = (id) => {
    if (locked || won) return;

    if (!running) setRunning(true);

    setFlipped((prev) => {
      const next = [...prev, id];

      if (next.length === 2) {
        setLocked(true);
        setMoves((m) => m + 1);

        const [a, b] = next.map((fid) => cards.find((c) => c.id === fid));

        if (a.emoji === b.emoji) {
          // match
          setCards((cs) =>
            cs.map((c) => (c.id === a.id || c.id === b.id ? { ...c, matched: true, flipped: true } : c))
          );
          setFlipped([]);
          setLocked(false);

          // check win after state settles
          setTimeout(() => {
            setCards((cs) => {
              const allMatched = cs.every((c) => c.matched);
              if (allMatched) {
                setRunning(false);
                setWon(true);
                updateStats(time + 1, true);
              }
              return cs;
            });
          }, 0);
        } else {
          // no match — flip back
          setTimeout(() => {
            setCards((cs) =>
              cs.map((c) => (c.id === a.id || c.id === b.id ? { ...c, flipped: false } : c))
            );
            setFlipped([]);
            setLocked(false);
          }, 900);
        }

        return next;
      }

      return next;
    });

    setCards((cs) => cs.map((c) => (c.id === id ? { ...c, flipped: true } : c)));
  };

  const { cols } = DIFFICULTIES[difficulty];
  const matched = cards.filter((c) => c.matched).length / 2;
  const total = DIFFICULTIES[difficulty].pairs;

  return (
    <div className="game-page">
      {/* Header */}
      <header className="game-header">
        <div className="header-left">
          <span className="header-logo">🧠</span>
          <span className="header-title">Memory</span>
        </div>
        <div className="header-center">
          {(['easy', 'medium', 'hard']).map((d) => (
            <button
              key={d}
              className={`diff-btn ${difficulty === d ? 'active' : ''}`}
              onClick={() => { setDifficulty(d); startGame(d); }}
            >
              {DIFFICULTIES[d].label}
            </button>
          ))}
        </div>
        <div className="header-right">
          <button className="icon-btn" onClick={onLeaderboard} title="Leaderboard">🏆</button>
          <div className="user-pill">
            <span className="user-avatar">{user.username[0].toUpperCase()}</span>
            <span className="user-name">{user.username}</span>
          </div>
          <button className="icon-btn" onClick={logout} title="Logout">🚪</button>
        </div>
      </header>

      {/* Stats bar */}
      <div className="stats-bar">
        <div className="stat">
          <span className="stat-label">Time</span>
          <span className="stat-value">{formatTime(time)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Moves</span>
          <span className="stat-value">{moves}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Pairs</span>
          <span className="stat-value">{matched}/{total}</span>
        </div>
        <button className="restart-btn" onClick={() => startGame(difficulty)}>↺ New Game</button>
      </div>

      {/* Board */}
      <div
        className="board"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onClick={handleCardClick}
            disabled={locked || won}
          />
        ))}
      </div>

      {/* Win overlay */}
      {won && (
        <div className="win-overlay">
          <div className="win-card">
            <div className="win-emoji">🎉</div>
            <h2>You won!</h2>
            <p>
              Finished in <strong>{formatTime(time)}</strong> with <strong>{moves}</strong> moves
            </p>
            {user.stats.bestTime !== null && (
              <p className="best-time">🏆 Best time: {formatTime(user.stats.bestTime)}</p>
            )}
            <div className="win-actions">
              <button className="auth-btn" onClick={() => startGame(difficulty)}>
                Play Again
              </button>
              <button className="outline-btn" onClick={onLeaderboard}>
                Leaderboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
