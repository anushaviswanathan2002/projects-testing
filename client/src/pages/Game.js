import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Game.css';

function Game({ onLogout }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const token = localStorage.getItem('token');

  const initializeGame = () => {
    const symbols = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
    const gameCards = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({ id: index, symbol }));
    
    setCards(gameCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
    setGameStarted(true);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      const firstCard = cards[first];
      const secondCard = cards[second];

      setMoves(moves + 1);

      if (firstCard.symbol === secondCard.symbol) {
        setMatched([...matched, first, second]);
        setFlipped([]);
      } else {
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  }, [flipped]);

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setGameWon(true);
      saveGameResult();
    }
  }, [matched]);

  const saveGameResult = async () => {
    try {
      await axios.post(
        '/api/games',
        {
          score: Math.max(0, 100 - moves * 5),
          moves,
          completed: true
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
    } catch (err) {
      console.error('Failed to save game result');
    }
  };

  const handleCardClick = (index) => {
    if (gameWon || flipped.includes(index) || matched.includes(index)) {
      return;
    }

    if (flipped.length < 2) {
      setFlipped([...flipped, index]);
    }
  };

  if (!gameStarted) {
    return <div className="loading">Loading game...</div>;
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>Memory Game</h2>
        <div className="game-stats">
          <span>Moves: {moves}</span>
          <span>Matched: {matched.length / 2}</span>
        </div>
      </div>

      {gameWon && (
        <div className="win-message">
          <h3>🎉 You Won! 🎉</h3>
          <p>Completed in {moves} moves with a score of {Math.max(0, 100 - moves * 5)}</p>
          <button onClick={initializeGame} className="btn btn-primary">
            Play Again
          </button>
        </div>
      )}

      <div className="game-board">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`card ${
              flipped.includes(index) || matched.includes(index) ? 'flipped' : ''
            }`}
            onClick={() => handleCardClick(index)}
          >
            <div className="card-inner">
              <div className="card-front">?</div>
              <div className="card-back">{card.symbol}</div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={onLogout} className="btn btn-secondary">
        Logout
      </button>
    </div>
  );
}

export default Game;
