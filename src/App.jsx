import { useEffect, useMemo, useState } from 'react';
import Card from './components/Card.jsx';
import StatsBar from './components/StatsBar.jsx';
import { buildDeck, shuffle } from './lib/deck.js';
import './styles.css';

const DEFAULT_PAIRS = 8;

export default function App() {
  const [numPairs, setNumPairs] = useState(DEFAULT_PAIRS);
  const [cards, setCards] = useState(() => shuffle(buildDeck(DEFAULT_PAIRS)));
  const [flippedIds, setFlippedIds] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [locked, setLocked] = useState(false);

  // Timer effect
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  // Start timer when first card is flipped
  useEffect(() => {
    if (flippedIds.length === 1 && !running) setRunning(true);
  }, [flippedIds, running]);

  // Handle match resolution when two cards are flipped
  useEffect(() => {
    if (flippedIds.length !== 2) return;
    setLocked(true);
    const [a, b] = flippedIds;
    const cardA = cards.find((c) => c.id === a);
    const cardB = cards.find((c) => c.id === b);
    const isMatch = cardA && cardB && cardA.pairId === cardB.pairId;

    setMoves((m) => m + 1);

    const timeout = setTimeout(() => {
      if (isMatch) {
        setCards((prev) =>
          prev.map((c) =>
            c.id === a || c.id === b ? { ...c, matched: true } : c
          )
        );
        setMatches((m) => m + 1);
      }
      setFlippedIds([]);
      setLocked(false);
    }, 650);

    return () => clearTimeout(timeout);
  }, [flippedIds, cards]);

  // Detect win
  const won = matches === numPairs && numPairs > 0;

  useEffect(() => {
    if (won) setRunning(false);
  }, [won]);

  const handleCardClick = (id) => {
    if (locked) return;
    if (flippedIds.includes(id)) return;
    if (cards.find((c) => c.id === id)?.matched) return;
    setFlippedIds((prev) => [...prev, id]);
  };

  const resetGame = (nextPairs = numPairs) => {
    setNumPairs(nextPairs);
    setCards(shuffle(buildDeck(nextPairs)));
    setFlippedIds([]);
    setMoves(0);
    setMatches(0);
    setTime(0);
    setRunning(false);
    setLocked(false);
  };

  const best = useMemo(() => {
    if (!won) return null;
    const key = `memory-best-${numPairs}`;
    const stored = Number(localStorage.getItem(key));
    if (!Number.isFinite(stored) || moves < stored) {
      localStorage.setItem(key, String(moves));
      return { moves, time, newRecord: true };
    }
    return { moves: stored, time, newRecord: false, current: moves };
  }, [won, moves, time, numPairs]);

  return (
    <div className="app">
      <header className="header">
        <h1>Memory Match</h1>
        <p className="subtitle">Flip cards, find pairs, beat your best.</p>
      </header>

      <StatsBar
        moves={moves}
        matches={matches}
        total={numPairs}
        time={time}
        onReset={() => resetGame(numPairs)}
        onChangePairs={(n) => resetGame(n)}
        numPairs={numPairs}
      />

      {won ? (
        <div className="win-banner" role="status">
          <h2>You won! 🎉</h2>
          <p>
            Completed in {moves} moves and {formatTime(time)}.
          </p>
          {best?.newRecord ? (
            <p className="record">New personal best for {numPairs} pairs!</p>
          ) : (
            best && (
              <p className="record">
                Best so far: {best.moves} moves / {formatTime(best.time)}
              </p>
            )
          )}
          <button className="btn primary" onClick={() => resetGame(numPairs)}>
            Play again
          </button>
        </div>
      ) : (
        <div className="grid" data-pairs={numPairs}>
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              isFlipped={flippedIds.includes(card.id) || card.matched}
              onClick={() => handleCardClick(card.id)}
            />
          ))}
        </div>
      )}

      <footer className="footer">
        <small>Built with React + Vite</small>
      </footer>
    </div>
  );
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}