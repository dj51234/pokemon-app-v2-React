import React, { useState, useEffect } from 'react';
import '../styles/PackOpening.css';
import defaultImage from '../assets/default-image.png';

const PackOpening = ({ show, randomCards, onBack, onNext, addRevealedCards }) => {
  const [leftStack, setLeftStack] = useState(Array(10).fill({ back: defaultImage, front: null, flipped: false }));
  const [cardsToShow, setCardsToShow] = useState([]);
  const [animating, setAnimating] = useState(false);
  const [allFlipped, setAllFlipped] = useState(false);
  const [movingCard, setMovingCard] = useState(null);
  const [sendingToBinder, setSendingToBinder] = useState(false);
  const [hideStack, setHideStack] = useState(false);
  const [highlightBackButton, setHighlightBackButton] = useState(false); // New state
  const [hideNextButton, setHideNextButton] = useState(false); // New state

  useEffect(() => {
    if (randomCards.length > 0) {
      setCardsToShow(randomCards);
      setHideStack(false); // Ensure the stack is visible when new cards are set
      setLeftStack(Array(10).fill({ back: defaultImage, front: null, flipped: false }));
      setAllFlipped(false);
      setHideNextButton(false); // Show the Add to Binder button when new cards are set
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
    setTimeout(() => {
      setLeftStack(Array(10).fill({ back: defaultImage, front: null, flipped: false }));
      setCardsToShow([]);
      setAllFlipped(false);
      setMovingCard(null);
      setHideStack(false); // Ensure the stack is visible when going back
      setHighlightBackButton(false); // Remove highlight when going back
    }, 500); // Adjust the delay to match the animation duration
    onBack();
  };

  const handleNextClick = () => {
    setSendingToBinder(true);
    const newRevealedCards = leftStack.filter(card => card.flipped).map(card => ({ image: card.front }));
    addRevealedCards(newRevealedCards);

    // Wait for the animation to complete before hiding the stack
    setTimeout(() => {
      setSendingToBinder(false);
      setHideStack(true);
      setHighlightBackButton(true); // Highlight the button when adding to binder
      setHideNextButton(true); // Hide the Add to Binder button after clicking
      onNext();
    }, 600); // Duration should match the CSS transition duration
  };

  return (
    <div className={`pack-opening ${show ? 'show' : ''}`}>
      <div className="pack-opening-content">
        <h2>Step 2: Open Your Pack</h2>
        <div className={`card-stack ${sendingToBinder ? 'move-to-binder' : ''} ${hideStack ? 'hide' : ''}`}>
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
          <button className={`back-button ${highlightBackButton ? 'highlighted' : ''}`} onClick={handleBackClick}>Open New Pack</button>
          {allFlipped && !hideNextButton && <button className="next-button" onClick={handleNextClick}>Add to Binder</button>}
        </div>
      </div>
    </div>
  );
};

export default PackOpening;
