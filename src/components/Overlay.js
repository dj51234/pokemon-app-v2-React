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
    gradient: card.gradient,
    rarity: card.rarity,
    subtypes: card.subtypes,
    setId: card.setId,
    supertypes: card.supertypes
  })));
  const [allFlipped, setAllFlipped] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [movingCard, setMovingCard] = useState(null);
  const [topGradient, setTopGradient] = useState(cards[0].gradient);
  const imageRef = useRef();

  useEffect(() => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      setAspectRatio(naturalWidth / naturalHeight);
    }
  }, [imageRef]);

  const handleCardClick = (index) => {
    if (animating) return;
    setAnimating(true);

    if (!allFlipped) {
      const updatedStack = cardStack.map(card => ({ ...card, flipped: true }));
      setCardStack(updatedStack);
      setAllFlipped(true);
    } else {
      setMovingCard(index);
      setTimeout(() => {
        const newCardStack = [...cardStack];
        const movingCard = newCardStack.splice(index, 1)[0];
        newCardStack.push(movingCard);
        setCardStack(newCardStack);
        setTopGradient(newCardStack[0].gradient); // Update the gradient based on the top card
        setMovingCard(null);
      }, 600);
    }

    setTimeout(() => {
      setAnimating(false);
    }, 600);
  };

  return (
    <div className="overlay">
      <img src={closeIcon} className="overlay-close-button" alt="Close" onClick={onClose} />
      <div className="overlay-content">
        <div className="overlay-card-stack" style={{ aspectRatio, '--top-gradient': topGradient }}>
          {cardStack.map((card, index) => (
            <div
              key={index}
              className={`overlay-card ${card.flipped ? 'overlay-flipped' : ''} ${movingCard === index ? 'overlay-moving-to-back' : ''}`}
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
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overlay;
