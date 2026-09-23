import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import WinModal from '../components/WinModal';
import '../styles/Game.css';

const EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐸', '🐙', '🦋', '🌸', '🍕'];

function buildDeck(pairs) {
  const selected = EMOJIS.slice(0, pairs);
  const deck = [...selected, ...selected].map((emoji, i) => ({
    id: i,
    emoji,
    flipped: false,
    matched: false,
  }));
  return deck.sort(() => Math.random() - 0.5);
}

const DIFFICULTIES = [
  { label: 'Easy', pairs: 6, cols: 4 },
  { label: 'Medium', pairs: 10, cols: 5 },
  { label: 'Hard', pairs: 16, cols: 8 },
];

export default function Game() {
  const { user, logout, updateStats } = useAuth();
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[0]);
  const [cards, setCards] = useState(() => buildDeck(DIFFICULTIES[0].pairs));
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [won, setWon] = useState(false);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (running) {
      timer = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [running]);

  const startNewGame = useCallback((diff = difficulty) => {
    setCards(buildDeck(diff.pairs));
    setFlipped([]);
    setMoves(0);
    setLocked(false);
    setWon(false);
    setTime(0);
    setRunning(false);
  }, [difficulty]);

  function handleDifficultyChange(diff) {
    setDifficulty(diff);
    startNewGame(diff);
  }

  function handleCardClick(id) {
    if (locked) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.flipped || card.matched) return;

    if (!running) setRunning(true);

    const newFlipped = [...flipped, id];
    const newCards = cards.map(c => c.id === id ? { ...c, flipped: true } : c);
    setCards(newCards);
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setLocked(true);
      const [a, b] = newFlipped.map(fid => newCards.find(c => c.id === fid));
      if (a.emoji === b.emoji) {
        const matched = newCards.map(c =>
          c.id === a.id || c.id === b.id ? { ...c, matched: true } : c
        );
        setCards(matched);
        setFlipped([]);
        setLocked(false);
        if (matched.every(c => c.matched)) {
          setRunning(false);
          setWon(true);
          updateStats(moves + 1);
        }
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === a.id || c.id === b.id ? { ...c, flipped: false } : c
          ));
          setFlipped([]);
          setLocked(false);
        }, 900);
      }
    }
  }

  function formatTime(s) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  return (
    <div className="game-wrapper">
      <header className="game-header">
        <div className="header-left">
          <span className="logo-small">🧠</span>
          <span className="app-name">Memory Game</span>
        </div>
        <div className="header-center">
          {DIFFICULTIES.map(d => (
            <button
              key={d.label}
              className={`diff-btn ${difficulty.label === d.label ? 'active' : ''}`}
              onClick={() => handleDifficultyChange(d)}
            >
              {d.label}
            </button>
          ))}
        </div>
        <div className="header-right">
          <span className="user-greeting">👤 {user.username}</span>
          <button className="btn-logout" onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="stats-bar">
        <div className="stat">
          <span className="stat-label">Moves</span>
          <span className="stat-value">{moves}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Time</span>
          <span className="stat-value">{formatTime(time)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Best</span>
          <span className="stat-value">{user.bestScore !== null ? `${user.bestScore} moves` : '—'}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Games</span>
          <span className="stat-value">{user.gamesPlayed}</span>
        </div>
        <button className="btn-new-game" onClick={() => startNewGame()}>New Game</button>
      </div>

      <main className="board-container">
        <div
          className="board"
          style={{ gridTemplateColumns: `repeat(${difficulty.cols}, 1fr)` }}
        >
          {cards.map(card => (
            <Card
              key={card.id}
              card={card}
              onClick={() => handleCardClick(card.id)}
            />
          ))}
        </div>
      </main>

      {won && (
        <WinModal
          moves={moves}
          time={formatTime(time)}
          bestScore={user.bestScore}
          onPlayAgain={() => startNewGame()}
        />
      )}
    </div>
  );
}
