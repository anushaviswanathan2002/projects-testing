import React, { useState, useEffect } from 'react';

const CARD_VALUES = ['🍎', '🍌', '🍒', '🍇', '🍓', '🥝', '🍑', '🍊'];

function MemoryGame({ userId }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Initialize game
  const initializeGame = () => {
    const cardPairs = [...CARD_VALUES, ...CARD_VALUES];
    const shuffled = cardPairs.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameStarted(true);
    setGameOver(false);
    setStartTime(Date.now());
    setElapsedTime(0);
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (gameStarted && !gameOver && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameOver, startTime]);

  // Check for match
  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (cards[first] === cards[second]) {
        setMatched([...matched, first, second]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 600);
      }
      setMoves(moves + 1);
    }
  }, [flipped, cards, matched, moves]);

  // Check if game is over
  useEffect(() => {
    if (gameStarted && matched.length === cards.length && cards.length > 0) {
      setGameOver(true);
    }
  }, [matched, gameStarted, cards.length]);

  const handleCardClick = (index) => {
    if (
      !gameStarted ||
      gameOver ||
      flipped.includes(index) ||
      matched.includes(index) ||
      flipped.length === 2
    ) {
      return;
    }
    setFlipped([...flipped, index]);
  };

  const resetGame = () => {
    initializeGame();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-container">
      <h2>🧠 Memory Game</h2>
      
      {gameStarted && (
        <div className="game-stats">
          <div className="stat">
            <div className="stat-label">Moves</div>
            <div className="stat-value">{moves}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Time</div>
            <div className="stat-value">{formatTime(elapsedTime)}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Matched</div>
            <div className="stat-value">{matched.length / 2}/8</div>
          </div>
        </div>
      )}

      {!gameStarted ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
            Test your memory! Click on cards to find matching pairs.
          </p>
          <button className="btn" onClick={initializeGame} style={{ maxWidth: '200px', margin: '0 auto' }}>
            Start Game
          </button>
        </div>
      ) : (
        <>
          <div className="memory-grid">
            {cards.map((card, index) => (
              <button
                key={index}
                className={`memory-card ${
                  flipped.includes(index) || matched.includes(index) ? 'flipped' : ''
                } ${matched.includes(index) ? 'matched' : ''}`}
                onClick={() => handleCardClick(index)}
              >
                {flipped.includes(index) || matched.includes(index) ? card : '?'}
              </button>
            ))}
          </div>

          {gameOver && (
            <div className="game-over-message">
              🎉 Congratulations! You won in {moves} moves and {formatTime(elapsedTime)}!
            </div>
          )}

          <div className="game-buttons">
            <button className="start-btn" onClick={resetGame}>
              New Game
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default MemoryGame;
