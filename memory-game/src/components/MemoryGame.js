import React, { useState, useEffect } from 'react';
import Card from './Card';
import '../styles/MemoryGame.css';

const SYMBOLS = ['🌟', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎬'];

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

  const initializeGame = () => {
    const gameCards = [...SYMBOLS, ...SYMBOLS]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({ id: index, symbol }));
    
    setCards(gameCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
  };

  // Check for match
  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      
      if (cards[first].symbol === cards[second].symbol) {
        setMatched(prev => [...prev, first, second]);
      }
      
      setMoves(m => m + 1);
      
      // Reset flipped after delay
      setTimeout(() => {
        setFlipped([]);
      }, 600);
    }
  }, [flipped, cards]);

  // Check for win
  useEffect(() => {
    if (cards.length > 0 && matched.length === cards.length) {
      setGameWon(true);
    }
  }, [matched, cards.length]);

  const handleCardClick = (index) => {
    // Don't click if already flipped, matched, or already 2 flipped
    if (flipped.includes(index) || matched.includes(index) || flipped.length === 2) {
      return;
    }

    setFlipped([...flipped, index]);
  };

  return (
    <div className="memory-game">
      <div className="game-info">
        <div className="moves">Moves: {moves}</div>
        <button className="reset-btn" onClick={initializeGame}>
          New Game
        </button>
      </div>

      {gameWon && (
        <div className="win-message">
          🎉 You Won! 🎉
          <p>Completed in {moves} moves</p>
        </div>
      )}

      <div className="cards-grid">
        {cards.map((card, index) => (
          <Card
            key={index}
            symbol={card.symbol}
            isFlipped={flipped.includes(index) || matched.includes(index)}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default MemoryGame;
