import { useState, useEffect } from 'react';
import './App.css';

const EMOJIS = ['🎮', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎺'];

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  // Check for matches
  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (cards[first] === cards[second]) {
        setMatched([...matched, first, second]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
      setMoves(m => m + 1);
    }
  }, [flipped]);

  // Check win condition
  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setGameWon(true);
    }
  }, [matched]);

  const initializeGame = () => {
    const shuffled = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
  };

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) {
      return;
    }
    setFlipped([...flipped, index]);
  };

  const isFlipped = (index) => flipped.includes(index) || matched.includes(index);

  return (
    <div className="memory-game">
      <div className="header">
        <h1>🧠 Memory Game</h1>
        <div className="stats">
          <div className="stat">
            <span>Moves:</span>
            <span className="number">{moves}</span>
          </div>
          <div className="stat">
            <span>Matched:</span>
            <span className="number">{matched.length / 2} / {cards.length / 2}</span>
          </div>
        </div>
      </div>

      {gameWon && (
        <div className="win-message">
          🎉 You won in {moves} moves! 🎉
        </div>
      )}

      <div className="grid">
        {cards.map((emoji, index) => (
          <button
            key={index}
            className={`card ${isFlipped(index) ? 'flipped' : ''} ${matched.includes(index) ? 'matched' : ''}`}
            onClick={() => handleCardClick(index)}
            disabled={gameWon}
          >
            <div className="card-inner">
              <div className="card-front">?</div>
              <div className="card-back">{emoji}</div>
            </div>
          </button>
        ))}
      </div>

      <button className="reset-btn" onClick={initializeGame}>
        {gameWon ? 'Play Again' : 'Reset Game'}
      </button>
    </div>
  );
}
