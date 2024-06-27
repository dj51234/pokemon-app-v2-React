// src/components/PackOpening.js
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
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [shake, setShake] = useState(false);
  const [particles, setParticles] = useState([]);
  const [effectTriggered, setEffectTriggered] = useState(false);

  useEffect(() => {
    if (randomCards.length > 0) {
      setCardsToShow(randomCards);
      setHideStack(false); // Ensure the stack is visible when new cards are set
      setLeftStack(Array(10).fill({ back: defaultImage, front: null, flipped: false }));
      setAllFlipped(false);
      setButtonDisabled(false); // Enable the button when new pack is selected
      setEffectTriggered(false); // Reset effect trigger for new pack
    }
  }, [randomCards]);

  const handleCardClick = (index) => {
    if (animating) return;

    if (!effectTriggered) {
      setShake(true);
      createParticles(); // Create particles on shake
      setEffectTriggered(true);

      setTimeout(() => setShake(false), 500); // Duration should match the shake animation duration
    }

    setTimeout(() => {
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
    }, effectTriggered ? 0 : 500); // Delay flipping only if the effect was triggered
  };

  const handleBackClick = () => {
    setTimeout(() => {
      setLeftStack(Array(10).fill({ back: defaultImage, front: null, flipped: false }));
      setCardsToShow([]);
      setAllFlipped(false);
      setMovingCard(null);
      setHideStack(false); // Ensure the stack is visible when going back
    }, 500); // Adjust the delay to match the animation duration
    onBack();
  };

  const handleNextClick = () => {
    setButtonDisabled(true);
    setSendingToBinder(true);
    const newRevealedCards = leftStack.filter(card => card.flipped).map(card => ({ image: card.front }));
    addRevealedCards(newRevealedCards);

    // Wait for the animation to complete before hiding the stack
    setTimeout(() => {
      setSendingToBinder(false);
      setHideStack(true);
      onNext();
    }, 600); // Duration should match the CSS transition duration
  };

  const createParticles = () => {
    const particlesArray = [];
    const rect = document.querySelector('.card-stack').getBoundingClientRect();
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.random() * 150;
      const x = radius * Math.cos(angle) + rect.width / 2;
      const y = radius * Math.sin(angle) + rect.height / 2;
      particlesArray.push({ x, y });
    }
    setParticles(particlesArray);
    setTimeout(() => setParticles([]), 500); // Remove particles after the animation
  };

  return (
    <div className={`pack-opening ${show ? 'show' : ''}`}>
      <div className="pack-opening-content">
        <h2>Step 2: Open Your Pack</h2>
        <div className={`card-stack ${sendingToBinder ? 'move-to-binder' : ''} ${hideStack ? 'hide' : ''} ${!allFlipped ? 'pulse' : ''} ${shake ? 'shake' : ''}`}>
          {particles.map((particle, index) => (
            <div key={index} className="particle" style={{ left: `${particle.x}px`, top: `${particle.y}px` }}></div>
          ))}
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
          {allFlipped && <button className="next-button" onClick={handleNextClick} disabled={buttonDisabled}>Add to Binder</button>}
        </div>
      </div>
    </div>
  );
};

export default PackOpening;
