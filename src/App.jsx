import React, { useState } from 'react';
import Board from './components/Board.jsx';
import Stats from './components/Stats.jsx';
import WinModal from './components/WinModal.jsx';
import { useMemoryGame } from './hooks/useMemoryGame.js';
import { formatTime } from './lib/game.js';

const DIFFICULTIES = [
  { label: 'Easy', pairs: 6 },
  { label: 'Medium', pairs: 8 },
  { label: 'Hard', pairs: 12 },
];

export default function App() {
  const [pairs, setPairs] = useState(8);
  const {
    deck,
    flipped,
    matchedIds,
    moves,
    seconds,
    matchedPairs,
    totalPairs,
    isWon,
    toast,
    best,
    onCardClick,
    reset,
  } = useMemoryGame(pairs);

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">
          <span aria-hidden="true">🧠</span> Memory Match
        </h1>
        <p className="subtitle">
          Flip two cards at a time. Match every pair in as few moves and as little time as possible.
        </p>

        <div className="controls">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.pairs}
              type="button"
              className={`btn ${pairs === d.pairs ? 'primary' : ''}`}
              onClick={() => setPairs(d.pairs)}
              aria-pressed={pairs === d.pairs}
            >
              {d.label} ({d.pairs * 2})
            </button>
          ))}
          <button type="button" className="btn" onClick={reset}>
            New game
          </button>
          <Stats
            moves={moves}
            seconds={seconds}
            matchedPairs={matchedPairs}
            totalPairs={totalPairs}
          />
        </div>
      </header>

      <Board
        deck={deck}
        flipped={flipped}
        matchedIds={matchedIds}
        onCardClick={onCardClick}
      />

      <footer>
        Best for this size:{' '}
        <strong>
          {best?.[totalPairs]
            ? `${best[totalPairs].moves} moves · ${formatTime(best[totalPairs].seconds)}`
            : '—'}
        </strong>
      </footer>

      {toast && (
        <div className={`toast ${toast.kind}`} role="status">
          {toast.text}
        </div>
      )}

      {isWon && (
        <WinModal
          moves={moves}
          seconds={seconds}
          totalPairs={totalPairs}
          best={best}
          onPlayAgain={reset}
        />
      )}
    </div>
  );
}
