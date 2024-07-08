// src/components/Deck.js
import React, { useState } from 'react';
import '../styles/Deck.css';
import cardBackImage from '../assets/default-image.png'; // Back of the card
import cardFront1 from '../assets/card-test-1.png';
import cardFront2 from '../assets/card-test-2.png';
import cardFront3 from '../assets/card-test-3.png';
import cardFront4 from '../assets/card-test-4.png';
import cardFront5 from '../assets/card-test-5.png';
import cardFront6 from '../assets/card-test-6.png';
import cardFront7 from '../assets/card-test-7.png';
import cardFront8 from '../assets/card-test-8.png';
import cardFront9 from '../assets/card-test-9.png';
import cardFront10 from '../assets/card-test-10.png';

const cardFrontImages = [
  cardFront1,
  cardFront2,
  cardFront3,
  cardFront4,
  cardFront5,
  cardFront6,
  cardFront7,
  cardFront8,
  cardFront9,
  cardFront10,
];

const cards = cardFrontImages.map((image, index) => ({
  front: image,
  back: cardBackImage,
}));

const Deck = () => {
  const [flippedCards, setFlippedCards] = useState(new Array(10).fill(false));
  const [flipping, setFlipping] = useState(false);

  const handleCardClick = () => {
    if (!flipping) {
      setFlipping(true);
      flipCardsSequentially(0);
    }
  };

  const flipCardsSequentially = (index) => {
    if (index >= cards.length) {
      setFlipping(false);
      return;
    }

    setTimeout(() => {
      setFlippedCards((prev) => {
        const newFlippedCards = [...prev];
        newFlippedCards[index] = !newFlippedCards[index];
        return newFlippedCards;
      });
      flipCardsSequentially(index + 1);
    }, 100); // Delay between flips
  };

  return (
    <div className="deck-container">
      {cards.map((card, i) => (
        <div
          className={`deck-card ${flippedCards[i] ? 'flipped' : ''}`}
          key={i}
          onClick={handleCardClick}
        >
          <div className="card-face card-back" style={{ backgroundImage: `url(${card.back})` }}></div>
          <div className="card-face card-front" style={{ backgroundImage: `url(${card.front})` }}></div>
        </div>
      ))}
    </div>
  );
};

export default Deck;
