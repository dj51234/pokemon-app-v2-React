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

const rarityColors = {
  'ace spec rare': '#F700C1',
  'hyper rare': '#FFD913',
  'rare holo': '#FFFFFF',
  'rare secret': '#FFD913'
  // Add more colors for other rarities as needed
};

const getBoxShadowForRarity = (rarity) => {
  switch (rarity) {
    case 'ace spec rare':
      return '0 0 3px -1px #F700C1, 0 0 5px 1px #F700C1, 0 0 22px 2px #F700C1, 0px 10px 20px -5px black, 0 0 40px -30px #F700C1, 0 0 50px -20px #F700C1';
    case 'double rare':
      return '0 0 3px -1px white, 0 0 5px 1px white, 0 0 22px 2px white, 0px 10px 20px -5px black, 0 0 40px -30px white, 0 0 50px -20px white';
    case 'hyper rare':
      return '0 0 3px -1px #FFD913, 0 0 5px 1px #FFD913, 0 0 22px 2px #FFD913, 0px 10px 20px -5px black, 0 0 40px -30px #FFD913, 0 0 50px -20px #FFD913';
    case 'rare holo':
      return '0 0 3px -1px #FFFFFF, 0 0 5px 1px #FFFFFF, 0 0 22px 2px #FFFFFF, 0px 10px 20px -5px black, 0 0 40px -30px #FFFFFF, 0 0 50px -20px #FFFFFF';
    case 'rare secret':
      return '0 0 3px -1px #FFD913, 0 0 5px 1px #FFD913, 0 0 22px 2px #FFD913, 0px 10px 20px -5px black, 0 0 40px -30px #FFD913, 0 0 50px -20px #FFD913';
    // Add other cases for different rarities if needed
    default:
      return '0 0 3px -1px white, 0 0 5px 1px white, 0 0 22px 2px white, 0px 10px 20px -5px black, 0 0 40px -30px white, 0 0 50px -20px white';
  }
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
    zIndex: cards.length - cards.indexOf(card),
  })));
  const [allFlipped, setAllFlipped] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [movingCard, setMovingCard] = useState(null);
  const [nextTopCardRarity, setNextTopCardRarity] = useState(null);
  const cardStackRef = useRef(null);

  useEffect(() => {
    setCardStack(cards.map(card => ({
      back: defaultImage,
      front: card.imageUrl,
      flipped: false,
      rarity: card.rarity,
      subtypes: card.subtypes,
      setId: card.setId,
      supertypes: card.supertypes,
      zIndex: cards.length - cards.indexOf(card),
    })));
    setAllFlipped(false);
  }, [cards]);

  const createParticle = (explosionContainer, color) => {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const rect = explosionContainer.getBoundingClientRect();
    const cardWidth = rect.width;
    const cardHeight = rect.height;
    const centerX = cardWidth / 2;
    const centerY = cardHeight / 2;

    // Determine a random starting position along a circular path near the border
    const angle = Math.random() * 2 * Math.PI; // Random angle
    const borderRadius = (Math.min(cardWidth, cardHeight) / 2) * 1.2; // Larger radius close to the border
    const startX = centerX + borderRadius * Math.cos(angle);
    const startY = centerY + borderRadius * Math.sin(angle);

    // Calculate the target position
    const distance = Math.random() * 300 + 200; // Adjust the explosion distance
    const tx = Math.cos(angle) * distance + 'px';
    const ty = Math.sin(angle) * distance + 'px';

    const size = Math.random() * 10; // Random size up to 15px
    particle.style.setProperty('--start-x', `${startX}px`);
    particle.style.setProperty('--start-y', `${startY}px`);
    particle.style.setProperty('--tx', tx);
    particle.style.setProperty('--ty', ty);
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.background = color;

    explosionContainer.appendChild(particle);

    particle.style.animation = 'explosion 2.2s forwards'; // Animation duration

    particle.addEventListener('animationend', () => {
      particle.remove();
    });
  };

  const triggerExplosion = (explosionContainer, rarity) => {
    const color = rarityColors[rarity] || 'white'; // Default to white if no color specified
    const numberOfParticles = 250; // Adjust the number of particles
    for (let i = 0; i < numberOfParticles; i++) {
      createParticle(explosionContainer, color);
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
          triggerExplosion(nextTopCardElement.querySelector('.explosion-container'), nextTopCardRarity);
          setNextTopCardRarity(nextTopCardRarity);
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
        setNextTopCardRarity(null);
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
              className={`overlay-card ${card.flipped ? 'overlay-flipped' : ''} ${movingCard === index ? 'overlay-moving-to-back' : ''}`}
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
                applyBoxShadow={index === 1 && !!nextTopCardRarity}
                boxShadow={index === 1 && !!nextTopCardRarity ? getBoxShadowForRarity(card.rarity) : ''}
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
