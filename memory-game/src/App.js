import React, { useState, useEffect } from 'react';
import './App.css';
import Card from './components/Card';
import GameStats from './components/GameStats';

function App() {
  const symbols = ['🎨', '🎭', '🎪', '🎬', '🎤', '🎸', '🎹', '🎺', '🎻', '🥁', '🎲', '🃏'];
  
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  // Check for match
  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (cards[first].symbol === cards[second].symbol) {
        setMatched([...matched, first, second]);
      }
      setMoves(moves + 1);
      setTimeout(() => setFlipped([]), 800);
    }
  }, [flipped]);

  // Check for win
  useEffect(() => {
    if (cards.length > 0 && matched.length === cards.length) {
      setGameWon(true);
    }
  }, [matched, cards.length]);

  const initializeGame = () => {
    const gameCards = [];
    symbols.forEach((symbol) => {
      gameCards.push({ symbol, id: Math.random() });
      gameCards.push({ symbol, id: Math.random() });
    });
    
    gameCards.sort(() => Math.random() - 0.5);
    setCards(gameCards);
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
    <div className="app">
      <div className="header">
        <h1>🎮 Memory Game</h1>
        <GameStats moves={moves} matched={matched.length} total={cards.length} />
      </div>
      
      {gameWon && (
        <div className="win-message">
          <p>🎉 You Won! Completed in {moves} moves!</p>
          <button onClick={initializeGame} className="play-again-btn">
            Play Again
          </button>
        </div>
      )}

      <div className="game-board">
        {cards.map((card, index) => (
          <Card
            key={index}
            index={index}
            symbol={card.symbol}
            isFlipped={flipped.includes(index) || matched.includes(index)}
            isMatched={matched.includes(index)}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>

      {!gameWon && (
        <button onClick={initializeGame} className="reset-btn">
          Reset Game
        </button>
      )}
    </div>
  );
}

export default App;
