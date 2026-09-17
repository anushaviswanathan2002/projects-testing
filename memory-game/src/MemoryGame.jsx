import { useState, useEffect } from 'react';
import './MemoryGame.css';

const EMOJIS = ['🎨', '🎭', '🎪', '🎬', '🎤', '🎧', '🎮', '🎯'];

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

  // Check for match when two cards are flipped
  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (cards[first].emoji === cards[second].emoji) {
        setMatched([...matched, first, second]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 500);
      }
      setMoves(moves + 1);
    }
  }, [flipped]);

  // Check if game is won
  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setGameWon(true);
    }
  }, [matched, cards.length]);

  const initializeGame = () => {
    const shuffled = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, idx) => ({ id: idx, emoji }));
    
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
  };

  const handleCardClick = (index) => {
    if (flipped.includes(index) || matched.includes(index) || flipped.length === 2) {
      return;
    }
    setFlipped([...flipped, index]);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🎮 Memory Game</h1>
        <div className="stats">
          <div className="stat">
            <span className="label">Moves:</span>
            <span className="value">{moves}</span>
          </div>
          <div className="stat">
            <span className="label">Matched:</span>
            <span className="value">{matched.length / 2}/{EMOJIS.length}</span>
          </div>
        </div>
      </div>

      {gameWon && (
        <div className="won-message">
          <h2>🎉 You Won!</h2>
          <p>Completed in {moves} moves</p>
        </div>
      )}

      <div className="game-board">
        {cards.map((card, index) => (
          <button
            key={card.id}
            className={`card ${flipped.includes(index) || matched.includes(index) ? 'flipped' : ''}`}
            onClick={() => handleCardClick(index)}
            disabled={matched.includes(index)}
          >
            <div className="card-inner">
              <div className="card-front">?</div>
              <div className="card-back">{card.emoji}</div>
            </div>
          </button>
        ))}
      </div>

      <button className="reset-btn" onClick={initializeGame}>
        New Game
      </button>
    </div>
  );
}
