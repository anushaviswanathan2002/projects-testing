import React from 'react';
import Card from './Card.jsx';

export default function Board({ deck, flipped, matchedIds, onCardClick }) {
  const cols = deck.length <= 16 ? 4 : 6;
  return (
    <div className={`board cols-${cols}`} role="grid" aria-label="Memory board">
      {deck.map((card) => (
        <Card
          key={card.id}
          card={card}
          isFlipped={flipped.includes(card.id) || matchedIds.has(card.id)}
          isMatched={matchedIds.has(card.id)}
          onClick={onCardClick}
        />
      ))}
    </div>
  );
}
