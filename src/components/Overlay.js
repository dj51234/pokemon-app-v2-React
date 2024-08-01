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
  'rare secret': '#FFD913',
  'illustration rare': '#ffffff',
  'rare rainbow': 'rainbow'
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
    case 'illustration rare':
      return '0 0 3px -1px #FFFFFF, 0 0 5px 1px #FFFFFF, 0 0 22px 2px #FFFFFF, 0px 10px 20px -5px black, 0 0 40px -30px #FFFFFF, 0 0 50px -20px #FFFFFF';
    case 'rare secret':
      return '0 0 3px -1px #FFD913, 0 0 5px 1px #FFD913, 0 0 22px 2px #FFD913, 0px 10px 20px -5px black, 0 0 40px -30px #FFD913, 0 0 50px -20px #FFD913';
    case 'rare rainbow':
      return '0 0 3px -1px rgb(255, 56, 6), 0 0 5px 1px rgb(0, 110, 255), 0 0 22px 2px rgb(66, 255, 66), 0px 10px 20px -5px rgb(255, 51, 0), 0 0 40px -30px rgb(58, 255, 58), 0 0 50px -20px rgb(255, 80, 80)';
    case 'rare ultra':
      return '0 0 3px -1px white, 0 0 5px 1px white, 0 0 22px 2px white, 0px 10px 20px -5px black, 0 0 40px -30px white, 0 0 50px -20px white';
    case 'rare holo vmax':
      return '0 0 3px -1px white, 0 0 5px 1px white, 0 0 22px 2px white, 0px 10px 20px -5px black, 0 0 40px -30px white, 0 0 50px -20px white';
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
    id: card.id
  })));
  const [allFlipped, setAllFlipped] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [movingCard, setMovingCard] = useState(null);
  const [nextTopCardRarity, setNextTopCardRarity] = useState(null);
  const [initialAnimation, setInitialAnimation] = useState(true);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const cardStackRef = useRef(null);

  useEffect(() => {
    setOverlayVisible(true);
    const initialCardStack = cards.map(card => ({
      back: defaultImage,
      front: card.imageUrl,
      flipped: false,
      rarity: card.rarity,
      subtypes: card.subtypes,
      setId: card.setId,
      supertypes: card.supertypes,
      zIndex: cards.length - cards.indexOf(card),
      id: card.id
    }));
    setCardStack(initialCardStack);

    const timers = [];

    // Trigger the animation class addition with delays
    initialCardStack.forEach((card, index) => {
      const timer = setTimeout(() => {
        document.getElementById(card.id)?.classList.add('slide-down');
      }, index * 200 + 200); // Minimum 200ms delay for the first card
      timers.push(timer);
    });

    // Remove the initial animation class after the animation completes
    const clearInitialAnimation = setTimeout(() => {
      setInitialAnimation(false);
    }, (cards.length * 200) + 800); // Ensure all cards complete their animation

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(clearInitialAnimation);
    };
  }, [cards]);

  const handleClose = () => {
    setOverlayVisible(false);
    setTimeout(onClose, 500); // Match this duration with the overlay transition duration
  };

  const createParticle = (explosionContainer, color) => {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const rect = explosionContainer.getBoundingClientRect();
    const cardWidth = rect.width;
    const cardHeight = rect.height;

    // Determine a random starting position around the border of the card
    let startX, startY;
    const borderSide = Math.floor(Math.random() * 4);
    switch (borderSide) {
      case 0: // Top border
        startX = Math.random() * cardWidth;
        startY = 0;
        break;
      case 1: // Right border
        startX = cardWidth;
        startY = Math.random() * cardHeight;
        break;
      case 2: // Bottom border
        startX = Math.random() * cardWidth;
        startY = cardHeight;
        break;
      case 3: // Left border
        startX = 0;
        startY = Math.random() * cardHeight;
        break;
      default:
        startX = Math.random() * cardWidth;
        startY = Math.random() * cardHeight;
    }

    // Calculate the target position based on direction from center
    const centerX = cardWidth / 2;
    const centerY = cardHeight / 2;
    const directionX = startX - centerX;
    const directionY = startY - centerY;
    const distance = Math.random() * 350 + 400; // Adjust the explosion distance
    const tx = directionX * distance / cardWidth + 'px';
    const ty = directionY * distance / cardHeight + 'px';

    const size = Math.random() * 12; // Random size between 10px and 30px
    particle.style.setProperty('--start-x', `${startX}px`);
    particle.style.setProperty('--start-y', `${startY}px`);
    particle.style.setProperty('--tx', tx);
    particle.style.setProperty('--ty', ty);
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.background = color !== 'rainbow' ? color : 'linear-gradient(45deg, red, orange, yellow, green, blue, purple)';

    explosionContainer.appendChild(particle);

    particle.style.animation = 'explosion 1s forwards'; // Shorter animation duration

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
    <div className={`overlay ${overlayVisible ? 'visible' : 'hidden'}`}>
      <img src={closeIcon} className="overlay-close-button" alt="Close" onClick={handleClose} />
      <div className="overlay-content">
        <div ref={cardStackRef} className="overlay-card-stack" style={{ aspectRatio }}>
          {cardStack.map((card, index) => (
            <div
              key={index}
              id={card.id}
              className={`overlay-card ${initialAnimation ? '' : ''} ${card.flipped ? 'overlay-flipped' : ''} ${movingCard === index ? 'overlay-card-moving-to-back' : ''}`}
              data-rarity={card.rarity}
              style={{ zIndex: cardStack.length - index }}
            >
              <NormalCard
                id={card.id} // Pass the id to the NormalCard component
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
                isInteractable={cardStack.length - index === 10} // Pass interactable prop
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
