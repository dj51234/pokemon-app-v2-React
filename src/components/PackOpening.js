// src/components/PackOpening.js
import React, { useState, useEffect } from 'react';
import '../styles/PackOpening.css';
import defaultImage from '../assets/default-image.png'; // Import the default card back image

const PackOpening = ({ onBack, show, randomCards }) => {
  const [leftStack, setLeftStack] = useState(Array(10).fill({ back: defaultImage, front: null, flipped: false }));
  const [rightStack, setRightStack] = useState([]);
  const [cardsToShow, setCardsToShow] = useState([]);

  useEffect(() => {
    if (randomCards.length > 0) {
      console.log('Random cards fetched:', randomCards);
      setCardsToShow(randomCards);
    }
  }, [randomCards]);

  const handleCardClick = (index) => {
    const newLeftStack = [...leftStack];
    const card = newLeftStack[index];

    if (!card.flipped && cardsToShow.length > 0) {
      // Get a random card from the pre-fetched random cards
      const randomCard = cardsToShow.pop();

      // Update the card to be flipped with the new front image
      newLeftStack[index] = { ...card, front: randomCard.images.large, flipped: true };
      setLeftStack(newLeftStack);
      setCardsToShow(cardsToShow); // Update the remaining random cards
    } else if (card.flipped) {
      // Move the card to the right stack
      const newCard = newLeftStack.splice(index, 1)[0];
      setLeftStack(newLeftStack);
      setRightStack([...rightStack, newCard]);
    }
  };

  return (
    <div className={`pack-opening ${show ? 'show' : ''}`}>
      <div className='pack-opening-content'>
        <div className="card-stack">
          {leftStack.map((card, index) => (
            <div
              key={index}
              className={`card ${card.flipped ? 'flipped' : ''}`}
              style={{ left: `${index * 1.2}px` }}
              onClick={() => handleCardClick(index)}
            >
              <img src={card.back} alt="Card back" className="card-back" />
              {card.front && <img src={card.front} alt="Card front" className="card-front" />}
            </div>
          ))}
        </div>
        <div className="card-stack">
          {rightStack.map((card, index) => (
            <img
              key={index}
              src={card.front}
              alt="Card front"
              className="card"
              style={{ left: `${index * 1.2}px` }}
            />
          ))}
        </div>
        <div className="pack-opening-buttons">
          <button onClick={onBack}>Open Another Pack?</button>
        </div>
      </div>
    </div>
  );
};

export default PackOpening;
