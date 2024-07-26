import React, { useState, useEffect, useRef } from 'react';
import '../styles/Overlay.css';
import '../styles/explosion.css';
import closeIcon from '../assets/close-icon.png'; // Import close icon image
import defaultImage from '../assets/default-image.png'; // Import default card image
import NormalCard from './NormalCard'; // Import the NormalCard component

const isRare = (rarity) => {
  const rareRarities = [
    'special illustration rare', 'ace spec rare', 'amazing rare', 'hyper rare', 'double rare', 
    'radiant rare', 'illustration rare', 'rare ace', 'rare holo', 'rare break', 'rare holo ex',
    'rare holo gx', 'rare holo lv.x', 'rare holo vstar', 'rare v', 'rare holo vmax',
    'rare rare holo vstar', 'rare prime', 'rare prism star', 'rare rainbow', 'rare secret',
    'rare shining', 'rare holo shiny', 'rare shiny gx', 'rare ultra', 'shiny rare', 
    'shiny ultra rare', 'trainer gallery rare holo', 'ultra rare'
  ];
  return rareRarities.includes(rarity);
};

const Overlay = ({ onClose, cards }) => {
  const [aspectRatio, setAspectRatio] = useState(640 / 892);
  const [cardStack, setCardStack] = useState(cards.map(card => ({
    back: defaultImage,
    front: card.imageUrl,
    flipped: false,
    rarity: card.rarity,
    subtypes: card.subtypes,
    setId: card.setId,
    supertypes: card.supertypes,
    class: '' // Track the class for box shadow
  })));
  const [allFlipped, setAllFlipped] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [movingCard, setMovingCard] = useState(null);
  const cardStackRef = useRef(null);

  useEffect(() => {
    // Handle initial setup or reset when cards are updated
  }, [cards]);

  const createParticle = (explosionContainer) => {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const angle = Math.random() * 360;
    const distance = Math.random() * 200 + 500; // Increased distance
    const tx = Math.cos(angle * (Math.PI / 180)) * distance + 'px';
    const ty = Math.sin(angle * (Math.PI / 180)) * distance + 'px';

    particle.style.setProperty('--tx', tx);
    particle.style.setProperty('--ty', ty);

    explosionContainer.appendChild(particle);

    particle.style.animation = 'explosion 2.5s forwards'; // Increased duration for a more gradual effect

    particle.addEventListener('animationend', () => {
      particle.remove();
    });
  };

  const triggerExplosion = (explosionContainer) => {
    const numberOfParticles = 250; // Adjust the number of particles
    for (let i = 0; i < numberOfParticles; i++) {
      createParticle(explosionContainer);
    }
  };

  const handleCardClick = (index) => {
    if (animating) return;
    setAnimating(true);

    if (!allFlipped) {
      const updatedStack = cardStack.map(card => ({ ...card, flipped: true }));
      setCardStack(updatedStack);
      setAllFlipped(true);

      setTimeout(() => {
        setAnimating(false);
      }, 600);
    } else {
      setMovingCard(index);

      const nextTopCardElement = Array.from(cardStackRef.current.children).find((child) =>
        parseInt(child.style.zIndex, 10) === 9
      );

      if (nextTopCardElement) {
        const nextTopCardRarity = nextTopCardElement.getAttribute('data-rarity');
        if (isRare(nextTopCardRarity)) {
          triggerExplosion(nextTopCardElement.querySelector('.explosion-container'));
        }
      }

      setTimeout(() => {
        const newCardStack = [...cardStack];
        const movingCard = newCardStack.splice(index, 1)[0];
        newCardStack.push(movingCard);

        newCardStack.forEach((card, idx) => {
          card.zIndex = newCardStack.length - idx;
        });

        setCardStack(newCardStack);
        setMovingCard(null);
        setAnimating(false);
      }, 700);
    }
  };

  return (
    <div className="overlay">
      <img src={closeIcon} className="overlay-close-button" alt="Close" onClick={onClose} />
      <div className="overlay-content">
        <div ref={cardStackRef} className="overlay-card-stack" style={{ aspectRatio }}>
          {cardStack.map((card, index) => (
            <div
              key={index}
              className={`overlay-card ${card.flipped ? 'overlay-flipped' : ''} ${movingCard === index ? 'overlay-moving-to-back' : ''} ${card.class}`}
              style={{ zIndex: cardStack.length - index }}
              data-rarity={card.rarity}
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
      </div>
    </div>
  );
};

export default Overlay;
