import React, { useState, useEffect } from 'react';
import '../styles/PackOpening.css';
import defaultImage from '../assets/default-image.png';

const PackOpening = ({ show, randomCards, onBack, onNext }) => {
  const [leftStack, setLeftStack] = useState(Array(10).fill({ back: defaultImage, front: null, flipped: false }));
  const [cardsToShow, setCardsToShow] = useState([]);
  const [animating, setAnimating] = useState(false);
  const [allFlipped, setAllFlipped] = useState(false);
  const [movingCard, setMovingCard] = useState(null);

  useEffect(() => {
    if (randomCards.length > 0) {
      setCardsToShow(randomCards);
    }
  }, [randomCards]);

  const handleCardClick = (index) => {
    if (animating) return;

    const newLeftStack = [...leftStack];
    const card = newLeftStack[index];

    if (!allFlipped && cardsToShow.length > 0) {
      setAnimating(true);

      const updatedStack = newLeftStack.map((card, i) => {
        if (!card.flipped && cardsToShow.length > 0) {
          const randomCard = cardsToShow.pop();
          return { ...card, front: randomCard.images.large, flipped: true };
        }
        return card;
      });

      setLeftStack(updatedStack);
      setCardsToShow(cardsToShow);
      setAllFlipped(true);

      setTimeout(() => {
        setAnimating(false);
      }, 600);
    } else if (card.flipped) {
      setAnimating(true);
      setMovingCard(index);

      setTimeout(() => {
        const newCard = newLeftStack.splice(index, 1)[0];
        newLeftStack.push(newCard);
        setLeftStack(newLeftStack);
        setMovingCard(null);
        setAnimating(false);
      }, 700);
    }
  };

  const handleBackClick = () => {
    // Set a delay to reset the state after the sliding animation has completed
    setTimeout(() => {
      setLeftStack(Array(10).fill({ back: defaultImage, front: null, flipped: false }));
      setCardsToShow([]);
      setAllFlipped(false);
      setMovingCard(null);
    }, 500); // Adjust the delay to match the animation duration
    onBack();
  };

  return (
    <div className={`pack-opening ${show ? 'show' : ''}`}>
      <div className="pack-opening-content">
        <h2>Step 2: Open Your Pack</h2>
        <div className="card-stack">
          {leftStack.map((card, index) => (
            <div
              key={index}
              id={`card-${index}`}
              className={`card ${card.flipped ? 'flipped' : ''} ${movingCard === index ? 'moving-to-back' : ''}`}
              style={{ zIndex: leftStack.length - index }}
              onClick={() => handleCardClick(index)}
            >
              <img src={card.back} alt="Card back" className="card-back" />
              {card.front && <img src={card.front} alt="Card front" className="card-front" />}
            </div>
          ))}
        </div>
        <div className="pack-opening-buttons">
          <button className="back-button" onClick={handleBackClick}>Back to Pack Selection</button>
          <button className="next-button" onClick={onNext}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default PackOpening;
