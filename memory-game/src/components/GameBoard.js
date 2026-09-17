import React, { useState, useEffect } from 'react';
import Card from './Card';
import '../styles/GameBoard.css';

const EMOJIS = ['🎨', '🎭', '🎪', '🎯', '🎸', '🎲', '🎳', '🎮'];

export default function GameBoard() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  // Check for match when two cards are flipped
  useEffect(() => {
    if (flipped.length === 2) {
      const [firstIdx, secondIdx] = flipped;
      if (cards[firstIdx].id === cards[secondIdx].id) {
        // Match found
        setMatched([...matched, cards[firstIdx].id]);
      }
      setMoves(moves + 1);

      // Reset flipped cards after delay
      setTimeout(() => {
        setFlipped([]);
      }, 800);
    }
  }, [flipped, cards, matched, moves]);

  // Check for win condition
  useEffect(() => {
    if (matched.length === EMOJIS.length && matched.length > 0) {
      setGameWon(true);
    }
  }, [matched]);

  const initializeGame = () => {
    const shuffledCards = [...EMOJIS, ...EMOJIS]
      .map((emoji, index) => ({
        emoji,
        id: emoji + (index < EMOJIS.length ? '1' : '2'),
      }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffledCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
  };

  const handleCardClick = (index) => {
    // Prevent clicking if card is already flipped, matched, or if two cards are already flipped
    if (
      flipped.includes(index) ||
      matched.includes(cards[index].id) ||
      flipped.length === 2
    ) {
      return;
    }

    setFlipped([...flipped, index]);
  };

  return (
    <div className="game-board-container">
      <div className="stats">
        <div className="stat">
          <span className="label">Moves:</span>
          <span className="value">{moves}</span>
        </div>
        <div className="stat">
          <span className="label">Matched:</span>
          <span className="value">{matched.length}/{EMOJIS.length}</span>
        </div>
      </div>

      {gameWon && (
        <div className="win-message">
          🎉 You Won! Completed in {moves} moves! 🎉
        </div>
      )}

      <div className="game-board">
        {cards.map((card, index) => (
          <Card
            key={index}
            emoji={card.emoji}
            isFlipped={flipped.includes(index)}
            isMatched={matched.includes(card.id)}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>

      <button className="reset-button" onClick={initializeGame}>
        New Game
      </button>
    </div>
  );
}
