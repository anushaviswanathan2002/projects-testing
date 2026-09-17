import { useState, useEffect } from 'react';
import Card from './Card';
import '../styles/MemoryGame.css';

const EMOJIS = ['🎮', '🎨', '🎭', '🎪', '🎸', '🎯', '🎲', '🎳'];
const GRID_SIZE = 4;
const TOTAL_CARDS = GRID_SIZE * GRID_SIZE;
const PAIRS = TOTAL_CARDS / 2;

function MemoryGame() {
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
      setMoves(m => m + 1);

      if (cards[first].emoji === cards[second].emoji) {
        setMatched([...matched, first, second]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 600);
      }
    }
  }, [flipped]);

  // Check if game is won
  useEffect(() => {
    if (matched.length === TOTAL_CARDS && matched.length > 0) {
      setGameWon(true);
    }
  }, [matched]);

  const initializeGame = () => {
    const newCards = [];
    for (let i = 0; i < PAIRS; i++) {
      newCards.push({ id: i * 2, emoji: EMOJIS[i] });
      newCards.push({ id: i * 2 + 1, emoji: EMOJIS[i] });
    }
    // Shuffle cards
    setCards(newCards.sort(() => Math.random() - 0.5));
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
    <div className="memory-game">
      <div className="stats">
        <div className="stat">
          <span className="label">Moves:</span>
          <span className="value">{moves}</span>
        </div>
        <div className="stat">
          <span className="label">Matched:</span>
          <span className="value">{matched.length / 2} / {PAIRS}</span>
        </div>
      </div>

      <div className={`grid grid-${GRID_SIZE}`}>
        {cards.map((card, index) => (
          <Card
            key={index}
            emoji={card.emoji}
            isFlipped={flipped.includes(index) || matched.includes(index)}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>

      {gameWon && (
        <div className="win-message">
          <h2>🎉 You Won! 🎉</h2>
          <p>Completed in {moves} moves</p>
          <button className="reset-btn" onClick={initializeGame}>
            Play Again
          </button>
        </div>
      )}

      <button className="reset-btn" onClick={initializeGame}>
        {gameWon ? '' : 'Reset Game'}
      </button>
    </div>
  );
}

export default MemoryGame;
