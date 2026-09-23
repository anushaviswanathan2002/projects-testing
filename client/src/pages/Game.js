import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Game.css';

function Game() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState(new Set());
  const [matched, setMatched] = useState(new Set());
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [saving, setSaving] = useState(false);

  const symbols = ['🌟', '🎨', '🎭', '🎪', '🎬', '🎤', '🎧', '🎮', '🎯', '🎲', '🎳', '🎰'];

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (matched.size === cards.length && cards.length > 0) {
      setGameWon(true);
      saveGameResult();
    }
  }, [matched, cards.length]);

  const initializeGame = () => {
    const shuffled = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({ id: index, symbol }));
    
    setCards(shuffled);
    setFlipped(new Set());
    setMatched(new Set());
    setMoves(0);
    setGameWon(false);
  };

  const handleCardClick = (index) => {
    if (flipped.has(index) || matched.has(index) || flipped.size === 2) {
      return;
    }

    const newFlipped = new Set(flipped);
    newFlipped.add(index);
    setFlipped(newFlipped);

    if (newFlipped.size === 2) {
      const [first, second] = Array.from(newFlipped);
      
      if (cards[first].symbol === cards[second].symbol) {
        const newMatched = new Set(matched);
        newMatched.add(first);
        newMatched.add(second);
        setMatched(newMatched);
        setFlipped(new Set());
      } else {
        setTimeout(() => {
          setFlipped(new Set());
        }, 1000);
      }
      
      setMoves(moves + 1);
    }
  };

  const saveGameResult = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/games',
        {
          score: 100 - moves,
          moves,
          completed: true
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
    } catch (error) {
      console.error('Failed to save game:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Memory Game</h1>
        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">Moves:</span>
            <span className="stat-value">{moves}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Matched:</span>
            <span className="stat-value">{matched.size / 2} / {cards.length / 2}</span>
          </div>
        </div>
      </div>

      <div className="game-board">
        {cards.map((card, index) => (
          <button
            key={index}
            className={`card ${flipped.has(index) || matched.has(index) ? 'flipped' : ''} ${matched.has(index) ? 'matched' : ''}`}
            onClick={() => handleCardClick(index)}
            disabled={matched.has(index)}
          >
            {flipped.has(index) || matched.has(index) ? card.symbol : '?'}
          </button>
        ))}
      </div>

      {gameWon && (
        <div className="game-over">
          <div className="game-over-content">
            <h2>🎉 You Won!</h2>
            <p>Completed in <strong>{moves}</strong> moves</p>
            <p>Score: <strong>{100 - moves}</strong> points</p>
            {saving && <p className="saving-message">Saving your score...</p>}
            <button onClick={initializeGame} className="play-again-btn">
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;
