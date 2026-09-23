import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import MemoryBoard from '../components/MemoryBoard';
import './GamePage.css';

const DIFFICULTIES = [
  { label: 'Easy', pairs: 6, cols: 4 },
  { label: 'Medium', pairs: 10, cols: 5 },
  { label: 'Hard', pairs: 16, cols: 6 },
];

const EMOJI_POOL = [
  '🐶','🐱','🦊','🐼','🐸','🦁','🐯','🐺',
  '🦋','🐬','🦜','🦄','🐙','🦈','🦕','🦖',
  '🌈','🍕','🍩','🎸','🚀','⚡','🔥','🌸',
  '🎃','🎯','🎲','🏆','💎','🌙','🍀','🤖',
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildCards(pairs) {
  const emojis = shuffle(EMOJI_POOL).slice(0, pairs);
  return shuffle(
    emojis.flatMap((emoji, i) => [
      { id: `${i}-a`, emoji, pairId: i, flipped: false, matched: false },
      { id: `${i}-b`, emoji, pairId: i, flipped: false, matched: false },
    ])
  );
}

export default function GamePage({ onExit }) {
  const { saveScore } = useAuth();
  const [diffIdx, setDiffIdx] = useState(0);
  const [phase, setPhase] = useState('select'); // 'select' | 'playing' | 'won'
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [startTime, setStartTime] = useState(null);

  const diff = DIFFICULTIES[diffIdx];

  // Timer
  useEffect(() => {
    if (phase !== 'playing') return;
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [phase, startTime]);

  function startGame() {
    setCards(buildCards(diff.pairs));
    setFlipped([]);
    setMoves(0);
    setElapsed(0);
    setLocked(false);
    setStartTime(Date.now());
    setPhase('playing');
  }

  function handleFlip(cardId) {
    if (locked) return;
    setCards(prev => {
      const card = prev.find(c => c.id === cardId);
      if (!card || card.flipped || card.matched) return prev;
      return prev.map(c => c.id === cardId ? { ...c, flipped: true } : c);
    });
    setFlipped(prev => [...prev, cardId]);
  }

  // Check for match after flipping second card
  useEffect(() => {
    if (flipped.length !== 2) return;
    setLocked(true);
    setMoves(m => m + 1);

    const [id1, id2] = flipped;
    setCards(prev => {
      const c1 = prev.find(c => c.id === id1);
      const c2 = prev.find(c => c.id === id2);
      if (c1 && c2 && c1.pairId === c2.pairId) {
        // Match
        const next = prev.map(c =>
          c.id === id1 || c.id === id2 ? { ...c, matched: true } : c
        );
        return next;
      }
      return prev;
    });

    setTimeout(() => {
      setCards(prev => {
        const c1 = prev.find(c => c.id === id1);
        const c2 = prev.find(c => c.id === id2);
        if (c1 && c2 && c1.pairId !== c2.pairId) {
          return prev.map(c =>
            c.id === id1 || c.id === id2 ? { ...c, flipped: false } : c
          );
        }
        return prev;
      });
      setFlipped([]);
      setLocked(false);
    }, 900);
  }, [flipped]);

  // Detect win
  useEffect(() => {
    if (phase !== 'playing' || cards.length === 0) return;
    if (cards.every(c => c.matched)) {
      setPhase('won');
      saveScore(moves + (flipped.length === 2 ? 1 : 0));
    }
  }, [cards, phase]);

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  const matched = cards.filter(c => c.matched).length / 2;
  const total = diff.pairs;
  const pct = total ? Math.round((matched / total) * 100) : 0;

  return (
    <div className="game-bg">
      <header className="game-header">
        <button className="back-btn" onClick={onExit}>← Back</button>
        <span className="game-header-title">🧠 Memory Game</span>
        {phase === 'playing' && (
          <div className="game-stats">
            <span>⏱ {formatTime(elapsed)}</span>
            <span>🕹 {moves} moves</span>
          </div>
        )}
        {phase !== 'playing' && <span />}
      </header>

      {phase === 'select' && (
        <div className="select-screen">
          <h2 className="select-title">Choose Difficulty</h2>
          <p className="select-sub">Pick a level to start playing</p>
          <div className="diff-cards">
            {DIFFICULTIES.map((d, i) => (
              <button
                key={d.label}
                className={`diff-card ${diffIdx === i ? 'selected' : ''}`}
                onClick={() => setDiffIdx(i)}
              >
                <span className="diff-icon">{['🟢', '🟡', '🔴'][i]}</span>
                <span className="diff-label">{d.label}</span>
                <span className="diff-info">{d.pairs} pairs</span>
              </button>
            ))}
          </div>
          <button className="start-btn" onClick={startGame}>Start Game →</button>
        </div>
      )}

      {phase === 'playing' && (
        <div className="playing-screen">
          <div className="progress-bar-wrap">
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="progress-label">{matched}/{total} pairs</span>
          </div>
          <MemoryBoard cards={cards} cols={diff.cols} onFlip={handleFlip} />
          <button className="restart-btn" onClick={startGame}>↺ Restart</button>
        </div>
      )}

      {phase === 'won' && (
        <div className="won-screen">
          <div className="won-card">
            <div className="won-emoji">🎉</div>
            <h2 className="won-title">You Won!</h2>
            <p className="won-desc">Amazing job! Here's how you did:</p>
            <div className="won-stats">
              <div className="won-stat">
                <span className="won-stat-value">{moves}</span>
                <span className="won-stat-label">Total Moves</span>
              </div>
              <div className="won-stat">
                <span className="won-stat-value">{formatTime(elapsed)}</span>
                <span className="won-stat-label">Time</span>
              </div>
              <div className="won-stat">
                <span className="won-stat-value">{diff.label}</span>
                <span className="won-stat-label">Difficulty</span>
              </div>
            </div>
            <div className="won-actions">
              <button className="play-again-btn" onClick={startGame}>🔄 Play Again</button>
              <button className="exit-btn" onClick={onExit}>🏠 Dashboard</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
