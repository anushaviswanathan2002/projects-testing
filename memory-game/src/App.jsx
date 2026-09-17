import React, { useState, useEffect } from 'react';
import './App.css';
import Card from './components/Card';

const SYMBOLS = ['🎨', '🎭', '🎪', '🎯', '🎲', '🎳', '🎸', '🎺'];

function App() {
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
      setMoves(moves + 1);
      const [first, second] = flipped;
      
      if (cards[first].symbol === cards[second].symbol) {
        setMatched([...matched, first, second]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  }, [flipped]);

  // Check for win condition
  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setGameWon(true);
    }
  }, [matched, cards.length]);

  const initializeGame = () => {
    const gameCards = [];
    SYMBOLS.forEach(symbol => {
      gameCards.push({ symbol, id: Math.random() });
      gameCards.push({ symbol, id: Math.random() });
    });
    
    // Shuffle cards
    gameCards.sort(() => Math.random() - 0.5);
    
    setCards(gameCards);
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
    <div className="app">
      <div className="container">
        <h1>🎮 Memory Game</h1>
        
        <div className="stats">
          <div className="stat">
            <span className="label">Moves:</span>
            <span className="value">{moves}</span>
          </div>
          <div className="stat">
            <span className="label">Matched:</span>
            <span className="value">{matched.length / 2} / {cards.length / 2}</span>
          </div>
        </div>

        {gameWon && (
          <div className="win-message">
            🎉 You Won! 🎉<br />
            Completed in {moves} moves
          </div>
        )}

        <div className="grid">
          {cards.map((card, index) => (
            <Card
              key={index}
              symbol={card.symbol}
              isFlipped={flipped.includes(index) || matched.includes(index)}
              onClick={() => handleCardClick(index)}
            />
          ))}
        </div>

        <button className="reset-button" onClick={initializeGame}>
          {gameWon ? 'Play Again' : 'Reset Game'}
        </button>
      </div>
    </div>
  );
}

export default App;
