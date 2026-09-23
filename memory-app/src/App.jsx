import { useEffect, useState } from 'react';
import Board from './components/Board.jsx';
import Stats from './components/Stats.jsx';
import { createShuffledDeck } from './utils/deck.js';

const PAIR_COUNTS = { easy: 6, medium: 8, hard: 12 };

export default function App() {
  const [difficulty, setDifficulty] = useState('medium');
  const [deck, setDeck] = useState(() => createShuffledDeck(PAIR_COUNTS.medium));
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [locked, setLocked] = useState(false);
  const [bestByDifficulty, setBestByDifficulty] = useState({ easy: null, medium: null, hard: null });

  const totalPairs = PAIR_COUNTS[difficulty];

  useEffect(() => {
    setDeck(createShuffledDeck(totalPairs));
    setFlippedIndices([]);
    setMoves(0);
    setMatches(0);
    setLocked(false);
  }, [difficulty, totalPairs]);

  useEffect(() => {
    if (flippedIndices.length !== 2) return;
    const [a, b] = flippedIndices;
    setLocked(true);
    setMoves((m) => m + 1);

    if (deck[a].id === deck[b].id) {
      const nextMatches = matches + 1;
      setDeck((prevDeck) =>
        prevDeck.map((card, index) =>
          index === a || index === b ? { ...card, matched: true } : card,
        ),
      );
      setMatches(nextMatches);
      setFlippedIndices([]);
      setLocked(false);

      if (nextMatches === totalPairs) {
        const prevBest = bestByDifficulty[difficulty];
        if (prevBest === null || moves + 1 < prevBest) {
          setBestByDifficulty({ ...bestByDifficulty, [difficulty]: moves + 1 });
        }
      }
    } else {
      const timeout = setTimeout(() => {
        setFlippedIndices([]);
        setLocked(false);
      }, 900);
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flippedIndices]);

  const handleCardClick = (index) => {
    if (locked) return;
    if (flippedIndices.includes(index)) return;
    if (deck[index].matched) return;
    setFlippedIndices((current) => [...current, index]);
  };

  const resetGame = () => {
    setDeck(createShuffledDeck(totalPairs));
    setFlippedIndices([]);
    setMoves(0);
    setMatches(0);
    setLocked(false);
  };

  const won = matches === totalPairs;

  return (
    <div className="app">
      <header className="app__header">
        <h1>Memory Match</h1>
        <p className="app__subtitle">Find every matching pair in as few moves as possible.</p>
      </header>

      <div className="controls">
        <div className="difficulty" role="radiogroup" aria-label="Difficulty">
          {Object.keys(PAIR_COUNTS).map((level) => (
            <button
              key={level}
              role="radio"
              aria-checked={difficulty === level}
              className={`difficulty__btn ${difficulty === level ? 'is-active' : ''}`}
              onClick={() => setDifficulty(level)}
            >
              {level[0].toUpperCase() + level.slice(1)} <span>({PAIR_COUNTS[level]} pairs)</span>
            </button>
          ))}
        </div>
        <button className="reset-btn" onClick={resetGame} aria-label="Reset game">
          ↻ Reset
        </button>
      </div>

      <Stats
        moves={moves}
        matches={matches}
        totalPairs={totalPairs}
        best={bestByDifficulty[difficulty]}
      />

      {won && (
        <div className="win-banner" role="status">
          🎉 You won in <strong>{moves}</strong> move{moves === 1 ? '' : 's'}!
        </div>
      )}

      <Board deck={deck} flippedIndices={flippedIndices} onCardClick={handleCardClick} />
    </div>
  );
}