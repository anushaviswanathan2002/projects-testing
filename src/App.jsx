import React, { useState, useEffect } from 'react';

const CARD_ICONS = ['🚀', '🌟', '🎨', '🎸', '🍕', '🎮', '🦄', '⚡'];

function createShuffledDeck() {
  const deck = [...CARD_ICONS, ...CARD_ICONS].map((icon, index) => ({
    id: index,
    icon,
    matched: false,
  }));

  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

export default function App() {
  const [cards, setCards] = useState(createShuffledDeck);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [time, setTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem('memory_best_moves');
    return saved ? parseInt(saved, 10) : null;
  });

  const isWon = matches === CARD_ICONS.length;

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && !isWon) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, isWon]);

  // Card click handling
  const handleCardClick = (index) => {
    // Prevent clicking if already two cards flipped, already matched, or clicking the same card
    if (
      flippedIndices.length >= 2 ||
      cards[index].matched ||
      flippedIndices.includes(index)
    ) {
      return;
    }

    if (!isTimerRunning && moves === 0 && flippedIndices.length === 0) {
      setIsTimerRunning(true);
    }

    const nextFlipped = [...flippedIndices, index];
    setFlippedIndices(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      const [firstIdx, secondIdx] = nextFlipped;

      if (cards[firstIdx].icon === cards[secondIdx].icon) {
        // Match found
        setCards((prev) =>
          prev.map((card, idx) =>
            idx === firstIdx || idx === secondIdx
              ? { ...card, matched: true }
              : card
          )
        );
        setMatches((prev) => {
          const newMatches = prev + 1;
          if (newMatches === CARD_ICONS.length) {
            setIsTimerRunning(false);
            const finalMoves = moves + 1;
            setBestScore((currentBest) => {
              if (currentBest === null || finalMoves < currentBest) {
                localStorage.setItem('memory_best_moves', finalMoves.toString());
                return finalMoves;
              }
              return currentBest;
            });
          }
          return newMatches;
        });
        setFlippedIndices([]);
      } else {
        // Not a match, flip back after brief delay
        setTimeout(() => {
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  const handleReset = () => {
    setCards(createShuffledDeck());
    setFlippedIndices([]);
    setMoves(0);
    setMatches(0);
    setTime(0);
    setIsTimerRunning(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="game-container">
      <header>
        <h1 style={{ margin: '0.2rem 0' }}>🧠 Memory Match</h1>
        <p style={{ color: '#64748b', margin: 0 }}>Find and match all the pairs!</p>
      </header>

      <div className="stats-bar">
        <div>⏳ Time: {formatTime(time)}</div>
        <div>🎯 Moves: {moves}</div>
        <div>🏆 Best: {bestScore !== null ? `${bestScore} moves` : '-'}</div>
      </div>

      {isWon && (
        <div className="win-banner">
          <h2>🎉 Congratulations! You won in {moves} moves and {formatTime(time)}!</h2>
        </div>
      )}

      <div className="grid">
        {cards.map((card, index) => {
          const isFlipped = flippedIndices.includes(index) || card.matched;
          return (
            <div
              key={card.id}
              className={`card ${isFlipped ? 'flipped' : ''} ${
                card.matched ? 'matched' : ''
              }`}
              onClick={() => handleCardClick(index)}
            >
              <div className="card-face card-back">?</div>
              <div className="card-face card-front">{card.icon}</div>
            </div>
          );
        })}
      </div>

      <div className="controls">
        <button className="btn" onClick={handleReset}>
          Restart Game
        </button>
      </div>
    </div>
  );
}
