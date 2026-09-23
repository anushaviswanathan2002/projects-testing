import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './MemoryGame.css';

const EMOJIS = ['🎨', '🎭', '🎪', '🎬', '🎮', '🎯', '🎲', '🎸', '🎹', '🎺', '🎻', '🎤'];

export default function MemoryGame() {
  const { user, logout, updateScore } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState(new Set());
  const [matched, setMatched] = useState(new Set());
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  // Initialize game
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const startNewGame = () => {
    const shuffled = [];
    const selectedEmojis = EMOJIS.slice(0, 6);
    
    for (let emoji of selectedEmojis) {
      shuffled.push({ id: Math.random(), emoji });
      shuffled.push({ id: Math.random(), emoji });
    }

    shuffled.sort(() => Math.random() - 0.5);
    
    setCards(shuffled);
    setFlipped(new Set());
    setMatched(new Set());
    setMoves(0);
    setGameStarted(true);
    setGameWon(false);
  };

  // Check for matches
  useEffect(() => {
    if (flipped.size === 2) {
      const [first, second] = Array.from(flipped);
      const firstCard = cards[first];
      const secondCard = cards[second];

      if (firstCard.emoji === secondCard.emoji) {
        setMatched(prev => new Set([...prev, first, second]));
        setFlipped(new Set());
      } else {
        setTimeout(() => setFlipped(new Set()), 600);
      }

      setMoves(prev => prev + 1);
    }
  }, [flipped, cards]);

  // Check for win
  useEffect(() => {
    if (matched.size > 0 && matched.size === cards.length) {
      setGameWon(true);
      updateScore(moves);
    }
  }, [matched, cards, moves, updateScore]);

  const toggleFlip = (index) => {
    if (gameWon || flipped.size === 2 || matched.has(index) || flipped.has(index)) {
      return;
    }
    setFlipped(prev => new Set([...prev, index]));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="game-container">
      <header className="game-header">
        <div className="user-info">
          <h1>Memory Game</h1>
          <p>Welcome, {user?.name}! 👋</p>
          <p>Best Score: {user?.score || 0} moves</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="game-main">
        {!gameStarted ? (
          <div className="start-screen">
            <h2>Ready to play?</h2>
            <p>Match pairs of cards to win the game!</p>
            <button className="start-btn" onClick={startNewGame}>
              Start Game
            </button>
          </div>
        ) : (
          <>
            <div className="game-stats">
              <p>Moves: {moves}</p>
              {gameWon && <p className="win-message">You won! 🎉</p>}
            </div>

            <div className="game-board">
              {cards.map((card, index) => (
                <button
                  key={index}
                  className={`card ${flipped.has(index) || matched.has(index) ? 'flipped' : ''}`}
                  onClick={() => toggleFlip(index)}
                  disabled={matched.has(index) || gameWon}
                >
                  <div className="card-inner">
                    <div className="card-front">?</div>
                    <div className="card-back">{card.emoji}</div>
                  </div>
                </button>
              ))}
            </div>

            {gameWon && (
              <button className="start-btn" onClick={startNewGame}>
                Play Again
              </button>
            )}
          </>
        )}
      </main>
    </div>
  );
}
