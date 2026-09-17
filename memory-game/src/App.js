import React, { useState, useEffect } from 'react';
import './App.css';

const EMOJIS = ['🎨', '🎭', '🎪', '🎬', '🎮', '🎲', '🎯', '🎳'];

const App = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  // Check if game is won
  useEffect(() => {
    if (cards.length > 0 && matched.length === cards.length) {
      setGameWon(true);
    }
  }, [matched, cards.length]);

  // Check for matches
  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (cards[first].emoji === cards[second].emoji) {
        setMatched([...matched, first, second]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 600);
      }
      setMoves(m => m + 1);
    }
  }, [flipped, cards, matched]);

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
    if (
      flipped.includes(index) ||
      matched.includes(index) ||
      flipped.length >= 2 ||
      gameWon
    ) {
      return;
    }
    setFlipped([...flipped, index]);
  };

  const isCardFlipped = (index) => flipped.includes(index) || matched.includes(index);
  const isCardMatched = (index) => matched.includes(index);

  return (
    <div className="app">
      <div className="header">
        <h1 className="title">🎮 Memory Game</h1>
        <div className="stats">
          <div className="stat">
            <span className="stat-label">Moves</span>
            <span className="stat-value">{moves}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Matched</span>
            <span className="stat-value">{Math.floor(matched.length / 2)}/{EMOJIS.length}</span>
          </div>
        </div>
      </div>

      <div className="game-board">
        {cards.map((card, index) => (
          <button
            key={index}
            className={`card ${isCardFlipped(index) ? 'flipped' : ''} ${isCardMatched(index) ? 'matched' : ''}`}
            onClick={() => handleCardClick(index)}
            disabled={gameWon}
          >
            {isCardFlipped(index) ? card.emoji : '?'}
          </button>
        ))}
      </div>

      {gameWon && (
        <div className="message success">
          🎉 You Won! Completed in {moves} moves!
        </div>
      )}

      <div className="button-group">
        <button className="btn btn-primary" onClick={initializeGame}>
          {gameWon ? 'Play Again' : 'New Game'}
        </button>
      </div>
    </div>
  );
};

export default App;
