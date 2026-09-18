import { useState, useEffect } from 'react';
import './App.css';

const Card = ({ card, onClick, isFlipped, isMatched }) => {
  return (
    <div
      className={`card ${isFlipped || isMatched ? 'flipped' : ''}`}
      onClick={onClick}
    >
      <div className="card-inner">
        <div className="card-front">?</div>
        <div className="card-back">{card.emoji}</div>
      </div>
    </div>
  );
};

const MemoryGame = () => {
  const emojis = ['🎨', '🎭', '🎪', '🎬', '🎤', '🎧', '🎮', '🎲'];
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
    const gameCards = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, id) => ({ id, emoji }));
    setCards(gameCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
  };

  // Check for matches
  useEffect(() => {
    if (flipped.length !== 2) return;

    setMoves(m => m + 1);

    const [first, second] = flipped;
    if (cards[first].emoji === cards[second].emoji) {
      setMatched([...matched, first, second]);
      setFlipped([]);
    } else {
      setTimeout(() => setFlipped([]), 600);
    }
  }, [flipped, cards, matched]);

  // Check win condition
  useEffect(() => {
    if (matched.length > 0 && matched.length === cards.length && cards.length > 0) {
      setGameWon(true);
    }
  }, [matched, cards.length]);

  const handleCardClick = (id) => {
    if (flipped.includes(id) || matched.includes(id) || flipped.length === 2) return;
    setFlipped([...flipped, id]);
  };

  const isCardFlipped = (id) => flipped.includes(id);
  const isCardMatched = (id) => matched.includes(id);

  return (
    <div className="memory-game">
      <div className="header">
        <h1>Memory Game</h1>
        <div className="stats">
          <div className="stat">
            <span className="label">Moves:</span>
            <span className="value">{moves}</span>
          </div>
          <div className="stat">
            <span className="label">Matched:</span>
            <span className="value">{matched.length / 2}/{cards.length / 2}</span>
          </div>
        </div>
      </div>

      <div className="cards-grid">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            isFlipped={isCardFlipped(card.id)}
            isMatched={isCardMatched(card.id)}
            onClick={() => handleCardClick(card.id)}
          />
        ))}
      </div>

      {gameWon && (
        <div className="win-message">
          <h2>🎉 You Won!</h2>
          <p>Completed in {moves} moves</p>
          <button onClick={initializeGame} className="play-again">
            Play Again
          </button>
        </div>
      )}

      {!gameWon && (
        <button onClick={initializeGame} className="reset-btn">
          Reset Game
        </button>
      )}
    </div>
  );
};

export default MemoryGame;
