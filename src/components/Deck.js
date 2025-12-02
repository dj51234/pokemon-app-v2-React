// src/components/Deck.js
import React, { useState, useEffect } from 'react';
import '../styles/Deck.css';
import cardBackImage from '../assets/default-image.png';
import { openPack } from '../js/pack_algorithm/packAlgorithm';

const Deck = ({ setId }) => {
  const [flippedCards, setFlippedCards] = useState(new Array(10).fill(false));
  const [deck, setDeck] = useState([]);
  const [animating, setAnimating] = useState(true); // Start with animating as true to prevent clicks during fall animation
  const [movingCard, setMovingCard] = useState(null);
  const [allFlipped, setAllFlipped] = useState(false);

  useEffect(() => {
    const fetchCards = async () => {
      if (setId) {
        const cards = await openPack(setId);
        if (cards && cards.length > 0) {
          const cardsWithBackImage = cards.map((card) => ({
            front: card.imageUrl,
            back: cardBackImage,
            rarity: card.rarity,
          }));
          
          // Preload images in order (top card first)
          for (const card of cardsWithBackImage) {
            await new Promise((resolve) => {
              const img = new Image();
              img.onload = resolve;
              img.onerror = resolve;
              img.src = card.front;
            });
          }
          
          setDeck(cardsWithBackImage);
          // ... rest of your code
        }
      }
    };

    fetchCards();
  }, [setId]);

  const handleCardClick = (index) => {
    if (animating) return;

    if (flippedCards.every((flipped) => flipped)) {
      setAnimating(true);
      setMovingCard(index);

      // Move the clicked card to the back with animation
      setTimeout(() => {
        const newDeck = [...deck];
        const cardToMove = newDeck.splice(index, 1)[0];
        newDeck.push(cardToMove);
        setDeck(newDeck);

        const newFlippedCards = [...flippedCards];
        const flippedCardToMove = newFlippedCards.splice(index, 1)[0];
        newFlippedCards.push(flippedCardToMove);
        setFlippedCards(newFlippedCards);

        // Reset moving card and animating state after animation
        setMovingCard(null);
        setAnimating(false);

        // Update the aspect ratio based on the next card front image
        const nextImg = new Image();
        nextImg.src = newDeck[0].front;
        nextImg.onload = () => {
          const aspectRatio = `${nextImg.naturalWidth} / ${nextImg.naturalHeight}`;
          const containerWidth = `min(${nextImg.naturalWidth}px, 75vw)`;
          document.documentElement.style.setProperty('--aspect-ratio', aspectRatio);
          document.documentElement.style.setProperty('--container-width', containerWidth);
        };
      }, 650); // Duration should match the CSS animation duration
    } else {
      flipAllCards();
    }
  };

  const flipAllCards = () => {
    setAnimating(true);
    setFlippedCards((prev) => prev.map((flipped) => !flipped));
    setAllFlipped(true);

    setTimeout(() => {
      setAnimating(false);
    }, 1000); // Duration should match the flip animation duration
  };

  useEffect(() => {
    if (allFlipped) {
      const timer = setTimeout(() => {
        document.querySelectorAll('.deck-card').forEach((card) => {
          card.style.animation = 'none';
          card.style.top = '50%';
        });
      }, 1000); // Ensure this delay matches the flip animation duration

      return () => clearTimeout(timer);
    }
  }, [allFlipped]);

  useEffect(() => {
    if (movingCard !== null) {
      const card = document.querySelector(`.deck-card:nth-child(${movingCard + 1})`);
      if (card) {
        card.style.animation = ''; // Remove inline animation style
        card.classList.add('moving-to-back2');
      }
    }
  }, [movingCard]);

  return (
    <div className={`deck-container ${allFlipped ? 'all-flipped' : ''}`} style={{ aspectRatio: 'var(--aspect-ratio)', width: 'var(--container-width)' }}>
      {deck.map((card, i) => (
        <div
          className={`deck-card ${flippedCards[i] ? 'flipped' : ''} ${movingCard === i ? 'moving-to-back2' : ''}`}
          key={i}
          onClick={() => handleCardClick(i)}
          style={{ zIndex: deck.length - i }}
        >
          <div className="card-face card-back" style={{ backgroundImage: `url(${card.back})` }}></div>
          <div className="card-face card-front" style={{ backgroundImage: `url(${card.front})` }}></div>
        </div>
      ))}
    </div>
  );
};

export default Deck;
