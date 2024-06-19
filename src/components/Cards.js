import React, { useState } from 'react';
import '../styles/Cards.css';
import defaultImage from '../assets/default-image.png';

const Cards = ({ cards }) => {
  const [flippedCards, setFlippedCards] = useState(Array(cards.length).fill(false));

  const handleCardClick = (index) => {
    setFlippedCards((prev) => {
      const newFlipped = [...prev];
      newFlipped[index] = !newFlipped[index];
      return newFlipped;
    });
  };

  return (
    <div className="cards-container">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`card-wrapper ${flippedCards[index] ? 'flipped' : ''}`}
          onClick={() => handleCardClick(index)}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className={`card ${flippedCards[index] ? 'flipped' : ''}`}>
            <img src={defaultImage} alt="Card Back" className="back" />
            <img src={card.images.small} alt={card.name} className="front" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cards;
