import { useState, useEffect } from 'react';
import './App.css';
import Card from './components/Card';

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

  // Check for match or reset flipped cards
  useEffect(() => {
    if (flipped.length === 2) {
      if (cards[flipped[0]].id === cards[flipped[1]].id) {
        setMatched([...matched, cards[flipped[0]].id]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
      setMoves(moves + 1);
    }
  }, [flipped]);

  // Check for win condition
  useEffect(() => {
    if (matched.length > 0 && matched.length === cards.length / 2) {
      setGameWon(true);
    }
  }, [matched, cards.length]);

  const initializeGame = () => {
    const symbols = ['🎨', '🎭', '🎪', '🎬', '🎤', '🎸', '🎹', '🎺'];
    const gameCards = [...symbols, ...symbols].map((symbol, index) => ({
      id: Math.floor(index / 2),
      symbol: symbol,
      index: index,
    }));

    // Shuffle cards
    const shuffled = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
  };

  const handleCardClick = (index) => {
    if (flipped.includes(index) || matched.includes(cards[index].id)) return;
    if (flipped.length < 2) {
      setFlipped([...flipped, index]);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Memory Game</h1>
        <div className="stats">
          <span>Moves: {moves}</span>
          <span>Matched: {matched.length}</span>
        </div>
      </header>

      {gameWon && (
        <div className="win-message">
          🎉 You won! Completed in {moves} moves!
        </div>
      )}

      <div className="game-board">
        {cards.map((card, index) => (
          <Card
            key={index}
            index={index}
            card={card}
            isFlipped={flipped.includes(index) || matched.includes(card.id)}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>

      <button className="reset-button" onClick={initializeGame}>
        {gameWon ? 'Play Again' : 'Reset Game'}
      </button>
    </div>
  );
}

export default App;
