import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './App.css';
import Card from './components/Card';
import GameStats from './components/GameStats';

function App() {
  const CARD_VALUES = useMemo(() => ['🌟', '🎨', '🚀', '🎭', '🌺', '🎸', '🍕', '⚽', '🌟', '🎨', '🚀', '🎭', '🌺', '🎸', '🍕', '⚽'], []);
  
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const initializeGame = useCallback(() => {
    const shuffled = [...CARD_VALUES].sort(() => Math.random() - 0.5);
    setCards(shuffled.map((value, index) => ({ id: index, value })));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
  }, [CARD_VALUES]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    if (matched.length === CARD_VALUES.length && matched.length > 0) {
      setGameWon(true);
    }
  }, [matched, CARD_VALUES.length]);

  const handleCardClick = (id) => {
    if (matched.includes(id) || flipped.includes(id) || flipped.length === 2 || gameWon) {
      return;
    }

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      checkMatch(newFlipped);
    }
  };

  const checkMatch = (flippedIds) => {
    const [id1, id2] = flippedIds;
    if (cards[id1].value === cards[id2].value) {
      setMatched([...matched, id1, id2]);
      setFlipped([]);
    } else {
      setTimeout(() => {
        setFlipped([]);
      }, 600);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>🎮 Memory Game</h1>
        <GameStats moves={moves} matched={matched} total={CARD_VALUES.length} />
        
        {gameWon && (
          <div className="win-message">
            <p>🎉 You Won! 🎉</p>
            <p>Completed in {moves} moves</p>
          </div>
        )}

        <div className="game-board">
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              isFlipped={flipped.includes(card.id) || matched.includes(card.id)}
              isMatched={matched.includes(card.id)}
              onClick={() => handleCardClick(card.id)}
            />
          ))}
        </div>

        <button className="reset-btn" onClick={initializeGame}>
          {gameWon ? 'Play Again' : 'Reset Game'}
        </button>
      </div>
    </div>
  );
}

export default App;
