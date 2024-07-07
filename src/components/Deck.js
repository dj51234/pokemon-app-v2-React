// src/components/Deck.js
import React, { useState } from 'react';
import Card from './Card';
import '../styles/Deck.css';

const Deck = ({ cards }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [deck, setDeck] = useState(cards);

  const handleFirstCardClick = () => {
    if (!isFlipped) {
      setIsFlipped(true);
    }
  };

  const handleCardClick = (index) => {
    if (isFlipped) {
      const updatedDeck = [...deck];
      const [movedCard] = updatedDeck.splice(index, 1);
      updatedDeck.push(movedCard);
      setDeck(updatedDeck);
    }
  };

  return (
    <div className="deck">
      {deck.map((card, index) => (
        <Card
          key={index}
          card={card}
          index={index}
          isFlipped={isFlipped}
          onClick={() => (index === 0 ? handleFirstCardClick() : handleCardClick(index))}
        />
      ))}
    </div>
  );
};

export default Deck;
