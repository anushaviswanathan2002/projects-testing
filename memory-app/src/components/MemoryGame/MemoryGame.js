import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MemoryGame.css';

function MemoryGame({ currentUser, onLogout }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const navigate = useNavigate();

  const emojis = ['🎮', '🎨', '🎭', '🎪', '🎬', '🎤', '🎧', '🎸'];

  const initializeGame = () => {
    const gameCards = [...emojis, ...emojis];
    const shuffled = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameStarted(true);
  };

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (cards[first] === cards[second]) {
        setMatched([...matched, first, second]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
      setMoves(moves + 1);
    }
  }, [flipped]);

  const handleCardClick = (index) => {
    if (!gameStarted || flipped.includes(index) || matched.includes(index)) return;
    setFlipped([...flipped, index]);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="memory-game">
      <div className="header">
        <h1>Memory Game</h1>
        <div className="user-info">
          <span>Welcome, {currentUser?.name}!</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="nav-buttons">
        <button onClick={() => navigate('/stopwatch')} className="nav-btn">Go to Stopwatch</button>
      </div>

      <div className="game-container">
        {!gameStarted ? (
          <div className="start-screen">
            <h2>Ready to play Memory?</h2>
            <button onClick={initializeGame} className="start-btn">Start Game</button>
          </div>
        ) : (
          <>
            <div className="stats">
              <p>Moves: {moves}</p>
              <p>Matched: {matched.length / 2} / {emojis.length}</p>
            </div>
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
            {matched.length === cards.length && (
              <div className="win-message">
                <h2>You Won! 🎉</h2>
                <p>Moves: {moves}</p>
                <button onClick={initializeGame} className="restart-btn">Play Again</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default MemoryGame;
