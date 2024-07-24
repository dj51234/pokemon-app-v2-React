import React, { useState, useEffect, useRef } from 'react';
import '../styles/Overlay.css';
import closeIcon from '../assets/close-icon.png'; // Import close icon image
import defaultImage from '../assets/default-image.png'; // Import default card image
import NormalCard from './NormalCard'; // Import the NormalCard component

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

  const handleCardClick = (index) => {
    if (animating) return;
    setAnimating(true);

    if (!allFlipped) {
      const updatedStack = cardStack.map(card => ({ ...card, flipped: true }));
      setCardStack(updatedStack);
      setAllFlipped(true);
    } else {
      setMovingCard(index);

      if (index === 0 && cardStack[1]) {
        const siblingCard = cardStack[1];
        if (isRare(siblingCard.rarity)) {
          siblingCard.class = 'rare-card';
        }
      }

      setTimeout(() => {
        const newCardStack = [...cardStack];
        const movingCard = newCardStack.splice(index, 1)[0];
        newCardStack.push(movingCard);

        if (index === 0 && newCardStack[0].class === 'rare-card') {
          newCardStack[0].class = '';
        }

        setCardStack(newCardStack);
        setMovingCard(null);
        setAnimating(false);
      }, 700);
    }

    setTimeout(() => {
      setAnimating(false);
    }, 600);
  };

  const isRare = (rarity) => {
    const rareRarities = [
      'special illustration rare', 'ace spec rare', 'amazing rare', 'hyper rare', 'double rare', 
      'radiant rare', 'illustration rare', 'rare ace', 'rare holo', 'rare break', 'rare holo ex',
      'rare holo gx', 'rare holo lv.x', 'rare holo star', 'rare v', 'rare holo vmax',
      'rare rare holo vstar', 'rare prime', 'rare prism star', 'rare rainbow', 'rare secret',
      'rare shining', 'rare holo shiny', 'rare shiny gx', 'rare ultra', 'shiny rare', 
      'shiny ultra rare', 'trainer gallery rare holo', 'ultra rare'
    ];
    return rareRarities.includes(rarity);
  };

  return (
    <div className="overlay">
      <img src={closeIcon} className="overlay-close-button" alt="Close" onClick={onClose} />
      <div className="overlay-content">
        <div className="overlay-card-stack" style={{ aspectRatio }}>
          {cardStack.map((card, index) => (
            <div
              key={index}
              className={`overlay-card ${card.flipped ? 'overlay-flipped' : ''} ${movingCard === index ? 'overlay-moving-to-back' : ''} ${card.class}`}
              style={{ zIndex: cardStack.length - index }}
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overlay;
