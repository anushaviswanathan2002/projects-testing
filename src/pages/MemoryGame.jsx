import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const DIFFICULTIES = {
  easy: { pairs: 8, cols: 4, label: 'Easy (8 pairs)' },
  medium: { pairs: 10, cols: 5, label: 'Medium (10 pairs)' },
  hard: { pairs: 18, cols: 6, label: 'Hard (18 pairs)' },
};

// Curated emoji set — each game picks a random subset sized to the difficulty.
const EMOJI_BANK = [
  '🐶', '🐱', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁',
  '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🦄', '🐝',
  '🦋', '🐢', '🐬', '🦉', '🦔', '🐙', '🦖', '🐳',
];

const HISTORY_KEY = 'memory-app:history';

function readAllHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeAllHistory(map) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(map));
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(pairs) {
  const chosen = shuffle(EMOJI_BANK).slice(0, pairs);
  const tiles = shuffle(
    chosen.flatMap((emoji, i) => [
      { id: `${i}-a`, pairId: i, emoji },
      { id: `${i}-b`, pairId: i, emoji },
    ])
  );
  return tiles.map((t, idx) => ({ ...t, index: idx }));
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function MemoryGame() {
  const { currentUser } = useAuth();
  const [difficulty, setDifficulty] = useState('medium');
  const [deck, setDeck] = useState(() => buildDeck(DIFFICULTIES.medium.pairs));
  const [flipped, setFlipped] = useState([]); // indices currently face-up
  const [matched, setMatched] = useState(() => new Set());
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [won, setWon] = useState(false);
  const [history, setHistory] = useState(() => {
    const all = readAllHistory();
    return all[currentUser?.username] || [];
  });
  const [shakeIdx, setShakeIdx] = useState(null);
  const lockRef = useRef(false);

  const cfg = DIFFICULTIES[difficulty];

  // Reset the board when difficulty changes.
  const newGame = useCallback(
    (diff = difficulty) => {
      setDeck(buildDeck(DIFFICULTIES[diff].pairs));
      setFlipped([]);
      setMatched(new Set());
      setMoves(0);
      setSeconds(0);
      setRunning(false);
      setWon(false);
      setShakeIdx(null);
      lockRef.current = false;
    },
    [difficulty]
  );

  useEffect(() => {
    newGame(difficulty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  // Timer.
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  // Persist history when it changes.
  useEffect(() => {
    if (!currentUser) return;
    const all = readAllHistory();
    all[currentUser.username] = history;
    writeAllHistory(all);
  }, [history, currentUser]);

  const totalPairs = cfg.pairs;

  // Detect win.
  useEffect(() => {
    if (matched.size === 0) return;
    if (matched.size === totalPairs) {
      setRunning(false);
      setWon(true);
      setHistory((prev) => [
        {
          difficulty,
          moves,
          seconds,
          finishedAt: new Date().toISOString(),
        },
        ...prev,
      ].slice(0, 10));
    }
  }, [matched, totalPairs, difficulty, moves, seconds]);

  const handleFlip = (idx) => {
    if (lockRef.current) return;
    if (flipped.includes(idx)) return;
    if (matched.has(deck[idx].pairId)) return;
    if (won) return;

    if (!running) setRunning(true);

    const next = [...flipped, idx];
    setFlipped(next);

    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next;
      if (deck[a].pairId === deck[b].pairId) {
        // Match — flip both permanently.
        setMatched((prev) => {
          const s = new Set(prev);
          s.add(deck[a].pairId);
          return s;
        });
        setFlipped([]);
      } else {
        // Mismatch — shake, then flip back.
        lockRef.current = true;
        setShakeIdx(b);
        setTimeout(() => {
          setFlipped([]);
          setShakeIdx(null);
          lockRef.current = false;
        }, 700);
      }
    }
  };

  const gridClass = useMemo(() => {
    if (cfg.cols === 3) return 'grid cols-3';
    if (cfg.cols === 4) return 'grid';
    return 'grid';
  }, [cfg.cols]);

  return (
    <div className="card wide">
      <div className="game-header">
        <div>
          <h1 style={{ margin: 0 }}>Memory</h1>
          <p className="subtitle" style={{ margin: '6px 0 0' }}>
            Match every pair in the fewest moves and shortest time.
          </p>
        </div>
        <div className="toolbar">
          <select
            className="select"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            aria-label="Difficulty"
          >
            {Object.entries(DIFFICULTIES).map(([key, d]) => (
              <option key={key} value={key}>
                {d.label}
              </option>
            ))}
          </select>
          <button
            className="btn ghost small"
            onClick={() => newGame(difficulty)}
            type="button"
          >
            New game
          </button>
        </div>
      </div>

      <div className="game-header" style={{ marginBottom: 14 }}>
        <div className="stats">
          <span>Moves<strong>{moves}</strong></span>
          <span>Time<strong>{formatTime(seconds)}</strong></span>
          <span>Pairs<strong>{matched.size}/{totalPairs}</strong></span>
        </div>
      </div>

      <div className={gridClass} style={cfg.cols === 5 ? { gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' } : cfg.cols === 6 ? { gridTemplateColumns: 'repeat(6, minmax(0, 1fr))' } : undefined}>
        {deck.map((tile, idx) => {
          const isFlipped = flipped.includes(idx) || matched.has(tile.pairId);
          const isMatched = matched.has(tile.pairId);
          const isShaking = shakeIdx === idx;
          return (
            <button
              key={tile.id}
              type="button"
              className={[
                'tile',
                isFlipped ? 'flipped' : '',
                isMatched ? 'matched' : '',
                isShaking ? 'shake' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => handleFlip(idx)}
              aria-label={isMatched ? 'matched tile' : 'hidden tile'}
            >
              <div className="tile-inner">
                <div className="tile-face tile-back">
                  <span className="mark-dot" />
                </div>
                <div className="tile-face tile-front">{tile.emoji}</div>
              </div>
            </button>
          );
        })}
      </div>

      {won && (
        <div className="win" role="status">
          <h2>You won!</h2>
          <p style={{ margin: '4px 0 12px' }}>
            {moves} moves · {formatTime(seconds)} · {cfg.label}
          </p>
          <button className="btn" type="button" onClick={() => newGame(difficulty)}>
            Play again
          </button>
        </div>
      )}

      {history.length > 0 && (
        <div className="history">
          <strong>Your recent games</strong>
          <ul>
            {history.map((h, i) => (
              <li key={i}>
                <span>{new Date(h.finishedAt).toLocaleString()}</span>
                <span>
                  {h.moves} moves · {formatTime(h.seconds)} · {DIFFICULTIES[h.difficulty].label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}