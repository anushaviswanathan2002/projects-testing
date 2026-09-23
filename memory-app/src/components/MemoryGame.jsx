import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './MemoryGame.css';

const EMOJIS = ['🎮', '🎨', '🎭', '🎪', '🎬', '🎤', '🎧', '🎸', '🎹', '🎺', '🏆', '⚡'];

export default function MemoryGame() {
  const { user, logout, updateScore } = useContext(AuthContext);
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  // Check if game is won
  useEffect(() => {
    if (cards.length > 0 && matched.length === cards.length) {
      setGameWon(true);
      updateScore(moves);
    }
  }, [matched, cards.length, moves, updateScore]);

  const initializeGame = () => {
    let pairCount;
    if (difficulty === 'easy') pairCount = 6;
    else if (difficulty === 'medium') pairCount = 8;
    else pairCount = 12;

    const shuffled = [];
    const selected = EMOJIS.slice(0, pairCount);

    // Create pairs
    selected.forEach((emoji, idx) => {
      shuffled.push({ id: idx * 2, emoji, pairId: idx });
      shuffled.push({ id: idx * 2 + 1, emoji, pairId: idx });
    });

    // Shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
  };

  const handleCardClick = (id) => {
    if (flipped.includes(id) || matched.includes(id)) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;

      if (cards[first].pairId === cards[second].pairId) {
        // Match found
        setMatched([...matched, first, second]);
        setFlipped([]);
      } else {
        // No match, flip back
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <div>
          <h1>Memory Game</h1>
          <p className="welcome">Welcome, {user?.name}! 👋</p>
          <p className="best-score">Best Score: {user?.score || 0} moves</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="game-stats">
        <div className="stat">
          <span className="stat-label">Moves:</span>
          <span className="stat-value">{moves}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Matched:</span>
          <span className="stat-value">{matched.length / 2}/{cards.length / 2}</span>
        </div>
      </div>

      <div className="difficulty-selector">
        <label>Difficulty:</label>
        <select value={difficulty} onChange={(e) => handleDifficultyChange(e.target.value)}>
          <option value="easy">Easy (6 pairs)</option>
          <option value="medium">Medium (8 pairs)</option>
          <option value="hard">Hard (12 pairs)</option>
        </select>
      </div>

      {gameWon ? (
        <div className="win-message">
          <h2>🎉 You Won! 🎉</h2>
          <p>Completed in {moves} moves!</p>
        </div>
      ) : null}

      <div className={`game-board difficulty-${difficulty}`}>
        {cards.map((card) => (
          <div
            key={card.id}
            className={`card ${flipped.includes(card.id) || matched.includes(card.id) ? 'flipped' : ''}`}
            onClick={() => handleCardClick(card.id)}
          >
            <div className="card-inner">
              <div className="card-front">?</div>
              <div className="card-back">{card.emoji}</div>
            </div>
          </div>
        ))}
      </div>

      <button className="reset-btn" onClick={initializeGame}>
        New Game
      </button>
    </div>
  );
}
