import React, { useState, useEffect, useRef } from 'react';
import '../styles/PackOpening.css';
import '../styles/explosion.css';
import defaultImage from '../assets/default-image.png';
import NormalCard from './NormalCard';

const PackOpening = ({ show, randomCards, onBack, onNext, addRevealedCards }) => {
  const [leftStack, setLeftStack] = useState(Array(10).fill({ back: defaultImage, front: null, flipped: false }));
  const [cardsToShow, setCardsToShow] = useState([]);
  const [animating, setAnimating] = useState(false);
  const [allFlipped, setAllFlipped] = useState(false);
  const [movingCard, setMovingCard] = useState(null);
  const [sendingToBinder, setSendingToBinder] = useState(false);
  const [hideStack, setHideStack] = useState(false);
  const [highlightBackButton, setHighlightBackButton] = useState(false);
  const [hideNextButton, setHideNextButton] = useState(false);
  const topCardRef = useRef(null);

  useEffect(() => {
    if (randomCards.length > 0) {
      setCardsToShow(randomCards);
      setHideStack(false);
      setLeftStack(Array(10).fill({ back: defaultImage, front: null, flipped: false }));
      setAllFlipped(false);
      setHideNextButton(false);
    }
  }, [randomCards]);

  const createParticle = () => {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    // Randomize particle movement
    const angle = Math.random() * 360;
    const distance = Math.random() * 200 + 500; // Increased distance
    const tx = Math.cos(angle * (Math.PI / 180)) * distance + 'px';
    const ty = Math.sin(angle * (Math.PI / 180)) * distance + 'px';

    // Apply random properties to particle
    particle.style.setProperty('--tx', tx);
    particle.style.setProperty('--ty', ty);

    document.querySelector('.explosion-container').appendChild(particle);

    // Trigger animation
    particle.style.animation = 'explosion 1.5s forwards'; // Increased duration for a more gradual effect

    // Remove particle after animation
    particle.addEventListener('animationend', () => {
      particle.remove();
    });
  };

  const triggerExplosion = () => {
    const numberOfParticles = 250; // Adjust the number of particles
    for (let i = 0; i < numberOfParticles; i++) {
      createParticle();
    }
  };

  const handleCardClick = (index) => {
    if (animating) return;

    const newLeftStack = [...leftStack];
    const card = newLeftStack[index];

    if (!allFlipped && cardsToShow.length > 0) {
      setAnimating(true);

      const updatedStack = newLeftStack.map((card, i) => {
        if (!card.flipped && cardsToShow.length > 0) {
          const randomCard = cardsToShow.pop();
          return { 
            ...card, 
            front: randomCard.images.large, 
            flipped: true, 
            rarity: randomCard.rarity?.toLowerCase() || '',
            subtypes: randomCard.subtypes?.map(subtype => subtype.toLowerCase()) || [],
            setId: randomCard.setId?.toLowerCase() || '',
            supertypes: randomCard.supertypes?.map(supertype => supertype.toLowerCase()) || []
          };
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

      if (index === 0 && newLeftStack[1]) {
        const siblingCard = newLeftStack[1];
        siblingCard.class = siblingCard.rarity?.toLowerCase().replace(/ /g, '-') || '';
      }

      setTimeout(() => {
        const newCard = newLeftStack.splice(index, 1)[0];
        newLeftStack.push(newCard);
        newLeftStack.forEach((card, idx) => {
          card.zIndex = newLeftStack.length - idx;
        });

        if (index === 0 && newCard.class) {
          newCard.class = '';
        }

        setLeftStack(newLeftStack);
        setMovingCard(null);
        setAnimating(false);
        triggerExplosion(); // Trigger explosion on card click
      }, 700);
    }
  };

  const handleBackClick = () => {
    setTimeout(() => {
      setLeftStack(Array(10).fill({ back: defaultImage, front: null, flipped: false }));
      setCardsToShow([]);
      setAllFlipped(false);
      setMovingCard(null);
      setHideStack(false);
      setHighlightBackButton(false);
    }, 500);
    onBack();
  };

  const handleNextClick = () => {
    setSendingToBinder(true);
    const newRevealedCards = leftStack.filter(card => card.flipped).map(card => ({ image: card.front }));
    addRevealedCards(newRevealedCards);

    setTimeout(() => {
      setSendingToBinder(false);
      setHideStack(true);
      setHighlightBackButton(true);
      setHideNextButton(true);
      onNext();
    }, 600);
  };

  return (
    <div className={`pack-opening ${show ? 'show' : ''}`}>
      <div className="pack-opening-content">
        <h2>Step 2: Open Your Pack</h2>
        <div className={`card-stack ${sendingToBinder ? 'move-to-binder' : ''} ${hideStack ? 'hide' : ''}`}>
          {leftStack.map((card, index) => (
            <div
              key={index}
              ref={index === 0 ? topCardRef : null}
              className={`card ${movingCard === index ? 'moving-to-back' : ''} ${card.class || ''}`}
              style={{ zIndex: leftStack.length - index }}
            >
              <NormalCard
                isFlipped={card.flipped}
                frontImage={card.front}
                backImage={card.back}
                onCardClick={() => handleCardClick(index)}
                rarity={card.rarity}
                subtypes={card.subtypes}
                setId={card.setId}
                supertypes={card.supertypes}
                isTopCard={index === 0}
              />
              <div className="explosion-container"></div>
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
