import React, { useState, useEffect } from 'react';
import './MemoryGame.css';

const EMOJI_SET = ['🐶', '🐱', '🦁', '🐯', '🐻', '🐼', '🐨', '🐮'];

const MemoryGame = () => {
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
      }
      setMoves(moves + 1);
      setTimeout(() => setFlipped([]), 500);
    }
  }, [flipped]);

  // Check for win
  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setGameWon(true);
    }
  }, [matched, cards.length]);

  const initializeGame = () => {
    const shuffled = [...EMOJI_SET, ...EMOJI_SET]
      .sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
  };

  const handleCardClick = (index) => {
    if (flipped.length < 2 && !flipped.includes(index) && !matched.includes(index)) {
      setFlipped([...flipped, index]);
    }
  };

  return (
    <div className="memory-game">
      <div className="header">
        <h1>🎮 Memory Game</h1>
        <div className="stats">
          <p>Moves: <span>{moves}</span></p>
          <p>Matched: <span>{matched.length / 2}</span>/{EMOJI_SET.length}</p>
        </div>
      </div>

      {gameWon && (
        <div className="win-message">
          🎉 You Won! Completed in {moves} moves!
        </div>
      )}

      <div className="cards-grid">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`card ${flipped.includes(index) || matched.includes(index) ? 'flipped' : ''}`}
            onClick={() => handleCardClick(index)}
          >
            {flipped.includes(index) || matched.includes(index) ? card : '?'}
          </div>
        ))}
      </div>

      <button className="reset-btn" onClick={initializeGame}>
        New Game
      </button>
    </div>
  );
};

export default MemoryGame;
