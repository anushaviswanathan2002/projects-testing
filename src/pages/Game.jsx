import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card.jsx';
import { buildDeck } from '../game/cards.js';
import { useAuth } from '../context/AuthContext.jsx';

const DECK_SIZE = 36; // 6x6 grid

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export default function Game() {
  const { username: playerName, saveScore, getBest } = useAuth();

  const [deck, setDeck] = useState(() => buildDeck(DECK_SIZE));
  const [flippedIds, setFlippedIds] = useState([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [won, setWon] = useState(false);
  const [newBest, setNewBest] = useState(false);

  const best = getBest();
  const matchedCount = useMemo(
    () => deck.filter((c) => c.matched).length,
    [deck]
  );
  const totalPairs = DECK_SIZE / 2;
  const pairsFound = matchedCount / 2;

  const timerRef = useRef(null);

  // Timer
  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [running]);

  // Match check whenever two cards are flipped
  useEffect(() => {
    if (flippedIds.length !== 2) return;
    const [aId, bId] = flippedIds;
    const a = deck.find((c) => c.id === aId);
    const b = deck.find((c) => c.id === bId);
    if (!a || !b) return;

    setMoves((m) => m + 1);

    if (a.symbol === b.symbol) {
      const t = setTimeout(() => {
        setDeck((d) =>
          d.map((c) =>
            c.id === aId || c.id === bId ? { ...c, matched: true } : c
          )
        );
        setFlippedIds([]);
      }, 450);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setFlippedIds([]), 900);
      return () => clearTimeout(t);
    }
  }, [flippedIds, deck]);

  // Win detection
  useEffect(() => {
    if (matchedCount === DECK_SIZE && !won) {
      setRunning(false);
      setWon(true);
      const result = saveScore({ moves, seconds });
      // If moves/seconds already updated by saveScore, result is the new one
      // when better. We can't tell client-side easily, so flag based on best.
      const updatedBest = getBest();
      if (
        updatedBest &&
        updatedBest.moves === moves &&
        updatedBest.seconds === seconds
      ) {
        setNewBest(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchedCount]);

  function handleCardClick(card) {
    if (!running) setRunning(true);
    if (flippedIds.length >= 2) return;
    if (card.matched) return;
    if (flippedIds.includes(card.id)) return;
    setFlippedIds((ids) => [...ids, card.id]);
  }

  function resetGame() {
    setDeck(buildDeck(DECK_SIZE));
    setFlippedIds([]);
    setMoves(0);
    setSeconds(0);
    setRunning(false);
    setWon(false);
    setNewBest(false);
  }

  return (
    <section className="page page-game">
      <div className="game-header">
        <div>
          <h1>Memory</h1>
          <p className="muted">
            Hello <strong>{playerName}</strong> — find every pair.
          </p>
        </div>
        <div className="game-stats">
          <Stat label="Moves" value={moves} />
          <Stat label="Time" value={formatTime(seconds)} />
          <Stat label="Found" value={`${pairsFound} / ${totalPairs}`} />
        </div>
      </div>

      <div className="board" role="grid" aria-label="Memory board">
        {deck.map((card) => {
          const faceUp =
            card.matched || flippedIds.includes(card.id);
          return (
            <Card
              key={card.id}
              card={card}
              faceUp={faceUp}
              onClick={() => handleCardClick(card)}
              disabled={flippedIds.length >= 2 && !flippedIds.includes(card.id)}
            />
          );
        })}
      </div>

      <div className="game-actions">
        <button className="btn btn-secondary" onClick={resetGame}>
          ↻ Restart
        </button>
        <Link to="/leaderboard" className="btn btn-ghost">
          View leaderboard →
        </Link>
      </div>

      {best && !won && (
        <div className="best-pill">
          Personal best: <strong>{best.moves}</strong> moves ·{' '}
          <strong>{formatTime(best.seconds)}</strong>
        </div>
      )}

      {won && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal card">
            <h2>🎉 You matched them all!</h2>
            <div className="result-grid">
              <Stat label="Moves" value={moves} />
              <Stat label="Time" value={formatTime(seconds)} />
              <Stat label="Pairs" value={totalPairs} />
            </div>
            {newBest ? (
              <p className="alert alert-success">New personal best!</p>
            ) : (
              <p className="muted">
                Best so far: {best?.moves} moves · {best && formatTime(best.seconds)}
              </p>
            )}
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={resetGame}>
                Play again
              </button>
              <Link to="/leaderboard" className="btn btn-secondary">
                See leaderboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}