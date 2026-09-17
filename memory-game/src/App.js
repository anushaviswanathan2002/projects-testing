import React, { useState, useEffect } from 'react';
import './App.css';
import Card from './components/Card';
import GameStats from './components/GameStats';

const CARD_PAIRS = [
  { id: 1, emoji: '🎨' },
  { id: 2, emoji: '🎭' },
  { id: 3, emoji: '🎪' },
  { id: 4, emoji: '🎬' },
  { id: 5, emoji: '🎮' },
  { id: 6, emoji: '🎯' },
  { id: 7, emoji: '🎲' },
  { id: 8, emoji: '🎳' },
  { id: 9, emoji: '🧩' },
  { id: 10, emoji: '🎨' },
  { id: 11, emoji: '🎭' },
  { id: 12, emoji: '🎪' },
  { id: 13, emoji: '🎬' },
  { id: 14, emoji: '🎮' },
  { id: 15, emoji: '🎯' },
  { id: 16, emoji: '🎲' },
];

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

  // Check for match
  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      
      if (cards[first].emoji === cards[second].emoji) {
        setMatched([...matched, first, second]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
      
      setMoves(moves + 1);
    }
  }, [flipped, cards, matched, moves]);

  // Check if game is won
  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setGameWon(true);
    }
  }, [matched, cards.length]);

  const initializeGame = () => {
    const shuffled = [...CARD_PAIRS].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
  };

  const handleCardClick = (index) => {
    if (flipped.includes(index) || matched.includes(index) || gameWon) {
      return;
    }
    
    if (flipped.length < 2) {
      setFlipped([...flipped, index]);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🎮 Memory Game</h1>
        <GameStats moves={moves} matchedPairs={matched.length / 2} totalPairs={CARD_PAIRS.length / 2} />
      </header>

      <main className="game-container">
        <div className="cards-grid">
          {cards.map((card, index) => (
            <Card
              key={index}
              emoji={card.emoji}
              isFlipped={flipped.includes(index) || matched.includes(index)}
              isMatched={matched.includes(index)}
              onClick={() => handleCardClick(index)}
            />
          ))}
        </div>

        {gameWon && (
          <div className="game-won">
            <div className="win-message">
              <h2>🎉 You Won! 🎉</h2>
              <p>Completed in {moves} moves</p>
              <button onClick={initializeGame} className="restart-btn">Play Again</button>
            </div>
          </div>
        )}

        {!gameWon && (
          <button onClick={initializeGame} className="reset-btn">New Game</button>
        )}
      </main>
    </div>
  );
}

export default App;
