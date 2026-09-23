import React, { useState, useEffect } from 'react';
import Card from './Card';
import '../styles/MemoryGame.css';

const EMOJIS = ['🚀', '🎨', '🎭', '🎪', '🎸', '🎲', '⚽', '🏀'];

export default function MemoryGame({ token, username, onGameComplete }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  // Timer
  useEffect(() => {
    if (!startTime || gameOver) return;

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, gameOver]);

  // Check for matches
  useEffect(() => {
    if (flipped.length !== 2) return;

    const [first, second] = flipped;
    if (cards[first].emoji === cards[second].emoji) {
      setMatched([...matched, first, second]);
      setFlipped([]);
      setMoves(moves + 1);
    } else {
      setTimeout(() => {
        setFlipped([]);
      }, 800);
      setMoves(moves + 1);
    }
  }, [flipped]);

  // Check for game over
  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setGameOver(true);
      saveScore();
    }
  }, [matched]);

  const initializeGame = () => {
    const shuffled = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, revealed: false }));

    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setStartTime(Date.now());
    setElapsedTime(0);
    setGameOver(false);
  };

  const handleCardClick = (index) => {
    if (
      flipped.includes(index) ||
      matched.includes(index) ||
      flipped.length === 2
    ) {
      return;
    }

    setFlipped([...flipped, index]);
  };

  const saveScore = async () => {
    try {
      const score = Math.max(0, 100 - moves);
      await fetch('http://localhost:5000/scores/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          score,
          moves,
          time: elapsedTime,
        }),
      });
      onGameComplete(score);
    } catch (err) {
      console.error('Failed to save score:', err);
    }
  };

  return (
    <div className="memory-game">
      <div className="game-stats">
        <div className="stat">
          <span>Moves:</span>
          <strong>{moves}</strong>
        </div>
        <div className="stat">
          <span>Time:</span>
          <strong>{elapsedTime}s</strong>
        </div>
        <div className="stat">
          <span>Matched:</span>
          <strong>{matched.length / 2} / {cards.length / 2}</strong>
        </div>
      </div>

      <div className="cards-grid">
        {cards.map((card, index) => (
          <Card
            key={index}
            emoji={card.emoji}
            isFlipped={flipped.includes(index) || matched.includes(index)}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>

      {gameOver && (
        <div className="game-over">
          <div className="game-over-content">
            <h2>🎉 Game Complete!</h2>
            <p>Moves: {moves}</p>
            <p>Time: {elapsedTime}s</p>
            <p>Score: {Math.max(0, 100 - moves)}</p>
            <button onClick={initializeGame} className="play-again-btn">
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
