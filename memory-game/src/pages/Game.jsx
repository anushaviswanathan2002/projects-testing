import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Game.css";

const EMOJI_POOL = [
  "🦁","🐯","🦊","🐺","🦝","🐻","🐼","🐨",
  "🦄","🐸","🐙","🦋","🦜","🦩","🦚","🐠",
  "🍕","🍔","🌮","🍣","🍜","🍩","🧁","🍭",
  "⚡","🔮","🎯","🎸","🚀","🌈","💎","🏆",
];

const DIFFICULTIES = [
  { label: "Easy",   cols: 4, pairs: 8 },
  { label: "Medium", cols: 6, pairs: 18 },
  { label: "Hard",   cols: 8, pairs: 32 },
];

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
  return shuffle(
    [...emojis, ...emojis].map((emoji, i) => ({
      id: i,
      emoji,
      flipped: false,
      matched: false,
    }))
  );
}

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export default function Game() {
  const { user, logout, updateStats } = useAuth();
  const [diffIdx, setDiffIdx] = useState(0);
  const diff = DIFFICULTIES[diffIdx];

  const [cards, setCards] = useState(() => buildDeck(diff.pairs));
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [locked, setLocked] = useState(false);
  const [won, setWon] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [statsUpdated, setStatsUpdated] = useState(false);
  const timerRef = useRef(null);

  // Timer
  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [running]);

  const startNew = useCallback(
    (idx = diffIdx) => {
      const d = DIFFICULTIES[idx];
      setCards(buildDeck(d.pairs));
      setFlipped([]);
      setMoves(0);
      setMatches(0);
      setLocked(false);
      setWon(false);
      setSeconds(0);
      setRunning(false);
      setStatsUpdated(false);
    },
    [diffIdx]
  );

  const changeDiff = (idx) => {
    setDiffIdx(idx);
    startNew(idx);
  };

  const handleCardClick = (card) => {
    if (locked || card.flipped || card.matched || won) return;

    if (!running) setRunning(true);

    const newFlipped = [...flipped, card.id];
    setCards((prev) =>
      prev.map((c) => (c.id === card.id ? { ...c, flipped: true } : c))
    );

    if (newFlipped.length === 1) {
      setFlipped(newFlipped);
      return;
    }

    // Two cards flipped
    const newMoves = moves + 1;
    setMoves(newMoves);
    setFlipped([]);
    setLocked(true);

    const [a, b] = newFlipped;
    const cardA = cards.find((c) => c.id === a);
    const cardB = card; // current card

    if (cardA.emoji === cardB.emoji) {
      // Match!
      const newMatches = matches + 1;
      setCards((prev) =>
        prev.map((c) =>
          c.id === a || c.id === b ? { ...c, flipped: true, matched: true } : c
        )
      );
      setMatches(newMatches);
      setLocked(false);

      if (newMatches === diff.pairs) {
        setRunning(false);
        setWon(true);
      }
    } else {
      // No match — flip back
      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) =>
            c.id === a || c.id === b ? { ...c, flipped: false } : c
          )
        );
        setLocked(false);
      }, 900);
    }
  };

  // Save stats once when won
  useEffect(() => {
    if (won && !statsUpdated) {
      updateStats(moves, seconds);
      setStatsUpdated(true);
    }
  }, [won, statsUpdated, moves, seconds, updateStats]);

  const initials = user?.username?.slice(0, 2) ?? "?";

  return (
    <div className="game-wrapper">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-brand">
          <span>🧠</span> Memory Game
        </div>
        <div className="navbar-user">
          <div className="navbar-avatar">{initials}</div>
          <span>{user?.username}</span>
          <button className="btn-logout" onClick={logout}>
            Sign out
          </button>
        </div>
      </nav>

      <div className="game-content">
        {/* STATS ROW */}
        <div className="stats-row">
          <div className="stat-pill">
            <span className="stat-icon">🎯</span>
            Moves: <strong>{moves}</strong>
          </div>
          <div className="stat-pill">
            <span className="stat-icon">⏱</span>
            <span className="timer">{formatTime(seconds)}</span>
          </div>
          <div className="stat-pill">
            <span className="stat-icon">✅</span>
            Pairs: <strong>{matches}/{diff.pairs}</strong>
          </div>
          {user?.stats?.gamesPlayed > 0 && (
            <div className="stat-pill">
              <span className="stat-icon">🏆</span>
              Best: <strong>{user.stats.bestMoves} moves</strong>
            </div>
          )}
        </div>

        {/* DIFFICULTY */}
        <div className="difficulty-row">
          {DIFFICULTIES.map((d, i) => (
            <button
              key={d.label}
              className={`diff-btn${diffIdx === i ? " active" : ""}`}
              onClick={() => changeDiff(i)}
            >
              {d.label} ({d.pairs} pairs)
            </button>
          ))}
        </div>

        {/* CONTROLS */}
        <div className="controls-row">
          <button className="btn-primary" onClick={() => startNew(diffIdx)}>
            🔄 New Game
          </button>
        </div>

        {/* CARD GRID */}
        <div className="card-grid" data-size={diff.cols}>
          {cards.map((card) => (
            <div
              key={card.id}
              className={`card${card.flipped ? " flipped" : ""}${card.matched ? " matched" : ""}`}
              onClick={() => handleCardClick(card)}
              role="button"
              aria-label={card.matched ? `Matched: ${card.emoji}` : card.flipped ? card.emoji : "Hidden card"}
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleCardClick(card)}
            >
              <div className="card-inner">
                <div className="card-back" />
                <div className="card-front">{card.emoji}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WIN MODAL */}
      {won && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-trophy">🏆</div>
            <h2>You Won!</h2>
            <p>Congratulations, {user?.username}! Puzzle complete.</p>

            <div className="modal-stats">
              <div className="modal-stat">
                <div className="label">Moves</div>
                <div className="value">{moves}</div>
              </div>
              <div className="modal-stat">
                <div className="label">Time</div>
                <div className="value">{formatTime(seconds)}</div>
              </div>
              <div className="modal-stat">
                <div className="label">Games</div>
                <div className="value">{user?.stats?.gamesPlayed ?? 1}</div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-primary" onClick={() => startNew(diffIdx)}>
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
