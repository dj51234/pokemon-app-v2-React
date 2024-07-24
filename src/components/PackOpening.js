import React, { useState, useEffect, useRef } from 'react';
import '../styles/PackOpening.css';
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
        if (isRare(siblingCard.rarity)) {
          siblingCard.class = 'rare-card';
        }
      }

      setTimeout(() => {
        const newCard = newLeftStack.splice(index, 1)[0];
        newLeftStack.push(newCard);
        newLeftStack.forEach((card, idx) => {
          card.zIndex = newLeftStack.length - idx;
        });

        if (index === 0 && newCard.class === 'rare-card') {
          newCard.class = '';
        }

        setLeftStack(newLeftStack);
        setMovingCard(null);
        setAnimating(false);
      }, 700);
    }
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
