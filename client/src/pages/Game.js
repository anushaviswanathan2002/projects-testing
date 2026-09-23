import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Game.css';

const EMOJI_SETS = {
  easy:   ['🐶','🐱','🐭','🐹','🐰','🦊'],
  medium: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯'],
  hard:   ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐸','🐙','🦋','🌸','🍕'],
};

const COLS = { easy: 3, medium: 4, hard: 4 };

function buildDeck(difficulty) {
  const emojis = EMOJI_SETS[difficulty];
  return [...emojis, ...emojis]
    .sort(() => Math.random() - 0.5)
    .map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));
}

function fmt(s) {
  return `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;
}

function Game({ user, onLogout }) {
  const [difficulty, setDifficulty] = useState('medium');
  const [cards, setCards] = useState(() => buildDeck('medium'));
  const [selected, setSelected] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [locked, setLocked] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const startNewGame = useCallback((diff) => {
    const d = diff || difficulty;
    setCards(buildDeck(d));
    setSelected([]);
    setMoves(0);
    setTime(0);
    setRunning(false);
    setLocked(false);
    setWon(false);
  }, [difficulty]);

  const handleDifficulty = (d) => {
    setDifficulty(d);
    startNewGame(d);
  };

  const handleFlip = (id) => {
    if (locked || won) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;
    if (!running) setRunning(true);

    const updated = cards.map((c) => c.id === id ? { ...c, flipped: true } : c);
    setCards(updated);

    const newSel = [...selected, id];
    setSelected(newSel);

    if (newSel.length === 2) {
      setMoves((m) => m + 1);
      setLocked(true);
      const [a, b] = newSel.map((sid) => updated.find((c) => c.id === sid));
      if (a.emoji === b.emoji) {
        setTimeout(() => {
          const matched = updated.map((c) =>
            c.id === a.id || c.id === b.id ? { ...c, matched: true } : c
          );
          setCards(matched);
          setSelected([]);
          setLocked(false);
          if (matched.every((c) => c.matched)) {
            setRunning(false);
            setWon(true);
            saveGame(moves + 1);
          }
        }, 600);
      } else {
        setTimeout(() => {
          setCards(updated.map((c) =>
            c.id === a.id || c.id === b.id ? { ...c, flipped: false } : c
          ));
          setSelected([]);
          setLocked(false);
        }, 900);
      }
    }
  };

  const saveGame = async (finalMoves) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/games', {
        score: Math.max(0, 500 - finalMoves * 10 - time * 2),
        moves: finalMoves,
        time_seconds: time,
        completed: true,
      }, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) { /* silent */ }
  };

  const pairs = EMOJI_SETS[difficulty].length;
  const matchedCount = cards.filter((c) => c.matched).length / 2;

  return (
    <div className="game-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-brand">🃏 Memory Game</div>
        <div className="nav-right">
          <Link to="/profile" className="nav-link-btn">📊 Profile</Link>
          <div className="nav-avatar">{user.username[0].toUpperCase()}</div>
          <span className="nav-username">{user.username}</span>
          <button className="logout-btn" onClick={onLogout}>Sign out</button>
        </div>
      </nav>

      <main className="game-main">
        {/* Controls */}
        <div className="game-controls">
          <div className="difficulty-btns">
            {['easy','medium','hard'].map((d) => (
              <button
                key={d}
                className={`diff-btn ${difficulty === d ? 'active' : ''}`}
                onClick={() => handleDifficulty(d)}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
          <button className="restart-btn" onClick={() => startNewGame()}>↺ New Game</button>
        </div>

        {/* Stats bar */}
        <div className="game-stats">
          <div className="stat-chip">🕐 {fmt(time)}</div>
          <div className="stat-chip">🎯 {moves} moves</div>
          <div className="stat-chip">✅ {matchedCount} / {pairs} pairs</div>
        </div>

        {/* Card grid */}
        <div
          className="grid"
          style={{ gridTemplateColumns: `repeat(${COLS[difficulty]}, 1fr)` }}
        >
          {cards.map((card) => (
            <div
              key={card.id}
              className={`card ${card.flipped || card.matched ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
              onClick={() => handleFlip(card.id)}
            >
              <div className="card-inner">
                <div className="card-back">❓</div>
                <div className="card-front">{card.emoji}</div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Win Modal */}
      {won && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-emoji">🎉</div>
            <h2 className="modal-title">You Won!</h2>
            <p className="modal-subtitle">All pairs matched! Great job!</p>
            <div className="modal-stats">
              <div className="modal-stat">
                <span className="stat-label">Moves</span>
                <span className="stat-value">{moves}</span>
              </div>
              <div className="modal-stat">
                <span className="stat-label">Time</span>
                <span className="stat-value">{fmt(time)}</span>
              </div>
              <div className="modal-stat">
                <span className="stat-label">Score</span>
                <span className="stat-value">{Math.max(0, 500 - moves * 10 - time * 2)}</span>
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-btn" onClick={() => startNewGame()}>Play Again</button>
              <Link to="/profile" className="modal-btn modal-btn-secondary">View Profile</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;
