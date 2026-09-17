import React, { useState, useEffect, useCallback } from 'react';
import './MemoryGame.css';

const SYMBOLS = ['🌟', '🎨', '🎭', '🎪', '🎸', '🎬', '🎯', '🎲'];

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  // Initialize game
  const initializeGame = useCallback(() => {
    const shuffled = [...SYMBOLS, ...SYMBOLS]
      .sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setIsWon(false);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Check for match when two cards are flipped
  useEffect(() => {
    if (flipped.length === 2) {
      setMoves(m => m + 1);
      
      if (cards[flipped[0]] === cards[flipped[1]]) {
        setMatched([...matched, flipped[0], flipped[1]]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  }, [flipped, cards, matched]);

  // Check if game is won
  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setIsWon(true);
    }
  }, [matched, cards.length]);

  const toggleCard = (index) => {
    if (
      flipped.includes(index) ||
      matched.includes(index) ||
      flipped.length === 2
    ) {
      return;
    }
    setFlipped([...flipped, index]);
  };

  const isFlipped = (index) => flipped.includes(index) || matched.includes(index);

  return (
    <div className="memory-game-container">
      <h1>Memory Game 🎮</h1>
      
      <div className="game-stats">
        <div className="stat">
          <span className="stat-label">Moves:</span>
          <span className="stat-value">{moves}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Matched:</span>
          <span className="stat-value">{Math.floor(matched.length / 2)}/{SYMBOLS.length}</span>
        </div>
      </div>

      {isWon && (
        <div className="win-message">
          <h2>🎉 You Won! 🎉</h2>
          <p>Completed in {moves} moves</p>
        </div>
      )}

      <div className="game-board">
        {cards.map((symbol, index) => (
          <button
            key={index}
            className={`card ${isFlipped(index) ? 'flipped' : ''} ${matched.includes(index) ? 'matched' : ''}`}
            onClick={() => toggleCard(index)}
            disabled={isWon}
          >
            <span className="card-symbol">{isFlipped(index) ? symbol : '?'}</span>
          </button>
        ))}
      </div>

      <button className="reset-btn" onClick={initializeGame}>
        New Game
      </button>
    </div>
  );
};

export default MemoryGame;
