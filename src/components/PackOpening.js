import React, { useState, useEffect } from 'react';
import '../styles/PackOpening.css';
import defaultImage from '../assets/default-image.png';
import NormalCard from './NormalCard';

const PackOpening = ({ show, randomCards, onBack, onNext, addRevealedCards }) => {
  const [leftStack, setLeftStack] = useState(Array(10).fill({ back: defaultImage, front: null, flipped: false, rarity: '', subtypes: [], supertypes: '', setId: '' }));
  const [cardsToShow, setCardsToShow] = useState([]);
  const [animating, setAnimating] = useState(false);
  const [allFlipped, setAllFlipped] = useState(false);
  const [movingCard, setMovingCard] = useState(null);
  const [sendingToBinder, setSendingToBinder] = useState(false);
  const [hideStack, setHideStack] = useState(false);
  const [highlightBackButton, setHighlightBackButton] = useState(false);
  const [hideNextButton, setHideNextButton] = useState(false);

  useEffect(() => {
    if (randomCards.length > 0) {
      setCardsToShow(randomCards);
      setHideStack(false);
      setLeftStack(Array(10).fill({ back: defaultImage, front: null, flipped: false, rarity: '', subtypes: [], supertypes: '', setId: '' }));
      setAllFlipped(false);
      setHideNextButton(false);
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
          return {
            ...card,
            front: randomCard.images.large,
            flipped: true,
            rarity: randomCard.rarity || '',
            subtypes: randomCard.subtypes || [],
            supertypes: randomCard.supertypes || '',
            setId: randomCard.set.id || ''
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
      setLeftStack(Array(10).fill({ back: defaultImage, front: null, flipped: false, rarity: '', subtypes: [], supertypes: '', setId: '' }));
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
              className={`card ${movingCard === index ? 'moving-to-back' : ''}`}
              style={{ zIndex: leftStack.length - index }}
            >
              <NormalCard
                isFlipped={card.flipped}
                frontImage={card.front}
                backImage={card.back}
                onCardClick={() => handleCardClick(index)}
                rarity={card.rarity.toLowerCase()}
                subtypes={card.subtypes.map(subtype => subtype.toLowerCase())}
                setId={card.setId}
                supertypes={card.supertypes.toLowerCase().replace('pokémon', 'pokemon')}
              />
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
