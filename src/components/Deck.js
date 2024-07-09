import React, { useState, useEffect } from 'react';
import '../styles/Deck.css';
import cardBackImage from '../assets/default-image.png'; // Back of the card
import cardFront1 from '../assets/card-test-1.png';
import cardFront2 from '../assets/card-test-2.png';
import cardFront3 from '../assets/card-test-3.png';
import cardFront4 from '../assets/card-test-4.png';
import cardFront5 from '../assets/card-test-5.png';
import cardFront6 from '../assets/card-test-6.png';
import cardFront7 from '../assets/card-test-7.png';
import cardFront8 from '../assets/card-test-8.png';
import cardFront9 from '../assets/card-test-9.png';
import cardFront10 from '../assets/card-test-10.png';

const cardFrontImages = [
  cardFront1,
  cardFront2,
  cardFront3,
  cardFront4,
  cardFront5,
  cardFront6,
  cardFront7,
  cardFront8,
  cardFront9,
  cardFront10,
];

const cards = cardFrontImages.map((image, index) => ({
  front: image,
  back: cardBackImage,
}));

const Deck = () => {
  const [flippedCards, setFlippedCards] = useState(new Array(10).fill(false));
  const [deck, setDeck] = useState(cards);
  const [animating, setAnimating] = useState(false);
  const [movingCard, setMovingCard] = useState(null);
  const [allFlipped, setAllFlipped] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('200000 / 278367'); // Default aspect ratio

  useEffect(() => {
    // Calculate aspect ratio based on the first card front image
    const img = new Image();
    img.src = cards[0].front;
    img.onload = () => {
      setAspectRatio(`${img.naturalWidth} / ${img.naturalHeight}`);
    };
  }, []);

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
          setAspectRatio(`${nextImg.naturalWidth} / ${nextImg.naturalHeight}`);
        };
      }, 650); // Duration should match the CSS animation duration
    } else {
      flipAllCards();
    }
  };

  const flipAllCards = () => {
    setFlippedCards((prev) => prev.map((flipped) => !flipped));
    setAllFlipped(true);
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
    <div className={`deck-container ${allFlipped ? 'all-flipped' : ''}`} style={{ aspectRatio }}>
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
