import React, { useState, useEffect } from 'react';
import './MemoryGame.css';

const EMOJIS = ['🎨', '🎭', '🎪', '🎬', '🎮', '🎯', '🎲', '🎸', '🎺', '🎻', '🎱', '🎳'];

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  // Check for matches
  useEffect(() => {
    if (flipped.length === 2) {
      setIsChecking(true);
      setMoves(moves + 1);

      const [first, second] = flipped;
      if (cards[first] === cards[second]) {
        setMatched([...matched, first, second]);
        setFlipped([]);
        setIsChecking(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setIsChecking(false);
        }, 800);
      }
    }
  }, [flipped]);

  // Check for win
  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setGameWon(true);
    }
  }, [matched, cards.length]);

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
    if (
      flipped.includes(index) ||
      matched.includes(index) ||
      isChecking ||
      gameWon
    ) {
      return;
    }
    setFlipped([...flipped, index]);
  };

  const handleReset = () => {
    initializeGame();
  };

  return (
    <div className="memory-game-container">
      <div className="game-header">
        <h1>🎮 Memory Game</h1>
        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">Moves:</span>
            <span className="stat-value">{moves}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Matched:</span>
            <span className="stat-value">{matched.length / 2}/{cards.length / 2}</span>
          </div>
        </div>
      </div>

      {gameWon && (
        <div className="win-message">
          🎉 You won in {moves} moves! 🎉
        </div>
      )}

      <div className="cards-grid">
        {cards.map((emoji, index) => (
          <div
            key={index}
            className={`card ${
              flipped.includes(index) || matched.includes(index) ? 'flipped' : ''
            }`}
            onClick={() => handleCardClick(index)}
          >
            <div className="card-inner">
              <div className="card-front">?</div>
              <div className="card-back">{emoji}</div>
            </div>
          </div>
        ))}
      </div>

      <button className="reset-button" onClick={handleReset}>
        {gameWon ? 'Play Again' : 'Reset Game'}
      </button>
    </div>
  );
};

export default MemoryGame;
