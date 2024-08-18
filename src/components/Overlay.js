import React, { useState, useEffect, useRef } from 'react';
import '../styles/Overlay.css';
import '../styles/explosion.css';
import closeIcon from '../assets/close-icon.png';
import defaultImage from '../assets/default-image.png';
import NormalCard from './NormalCard';
import loadingGif from '../assets/loading-gif.gif';

import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../js/firebase';

export const isRare = (rarity) => {
  const rareRarities = [
    'special illustration rare', 'ace spec rare', 'amazing rare', 'hyper rare', 'double rare', 
    'radiant rare', 'illustration rare', 'rare ace', 'rare holo', 'rare break', 'rare holo ex',
    'rare holo gx', 'rare holo lv.x', 'rare holo vstar', 'rare v', 'rare holo vmax',
    'rare rare holo vstar', 'rare prime', 'rare prism star', 'rare rainbow', 'rare secret',
    'rare shining', 'rare holo shiny', 'rare shiny gx', 'rare ultra', 
    'shiny rare', 'shiny ultra rare', 'trainer gallery rare holo', 'ultra rare'
  ];
  return rareRarities.includes(rarity);
};

const rarityColors = {
  'ace spec rare': '#F700C1',
  'hyper rare': '#FFD913',
  'rare holo': '#FFFFFF',
  'rare secret': '#FFD913',
  'illustration rare': '#ffffff',
  'rare rainbow': 'rainbow',
  'amazing rare': '#FFFFFF',
  'double rare': '#FFFFFF',
  'radiant rare': '#FFFFFF',
  'rare ace': '#FFFFFF',
  'rare break': '#FFFFFF',
  'rare holo ex': '#FFFFFF',
  'rare holo gx': '#FFFFFF',
  'rare holo lv.x': '#FFFFFF',
  'rare holo vstar': '#FFFFFF',
  'rare holo v': '#FFFFFF',
  'rare v': '#FFFFFF',
  'rare holo vmax': '#FFFFFF',
  'rare rare holo vstar': '#FFFFFF',
  'rare prime': '#FFFFFF',
  'rare prism star': '#FFFFFF',
  'rare shining': '#FFFFFF',
  'rare holo shiny': '#FFFFFF',
  'rare shiny gx': '#FFFFFF',
  'rare ultra': '#FFFFFF',
  'shiny rare': '#FFFFFF',
  'shiny ultra rare': '#FFFFFF',
  'trainer gallery rare holo': '#FFFFFF',
  'ultra rare': '#FFFFFF',
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
    case 'rare holo v':
      return '0 0 3px -1px white, 0 0 5px 1px white, 0 0 22px 2px white, 0px 10px 20px -5px black, 0 0 40px -30px white, 0 0 50px -20px white';
    default:
      return '0 0 3px -1px white, 0 0 5px 1px white, 0 0 22px 2px white, 0px 10px 20px -5px black, 0 0 40px -30px white, 0 0 50px -20px white';
  }
};

const Overlay = ({ onClose, cards, setId, openSelectedPack, addCardsToBinder, currentUser }) => {
  const [aspectRatio, setAspectRatio] = useState(640 / 892);
  const [cardStack, setCardStack] = useState([]);
  const [allFlipped, setAllFlipped] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [movingCard, setMovingCard] = useState(null);
  const [nextTopCardRarity, setNextTopCardRarity] = useState(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastCardFlipped, setLastCardFlipped] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null); // State for alert message
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // State to disable button
  const cardStackRef = useRef(null);
  const lastCardIdRef = useRef(null);

  useEffect(() => {
    const scrollTop = document.documentElement.scrollTop;
    document.body.style.setProperty('--st', `-${scrollTop}px`);
    document.body.classList.add('noscroll');
    setOverlayVisible(true);

    setCardStack(cards.map(card => ({
      back: defaultImage,
      front: card.imageUrl,
      name: card.name, 
      flipped: false,
      rarity: card.rarity,
      subtypes: card.subtypes,
      setId: card.setId,
      supertypes: card.supertypes,
      zIndex: cards.length - cards.indexOf(card),
      id: card.id
    })));
    
    lastCardIdRef.current = cards[cards.length - 1].id;
    setIsLoading(false);

    return () => {
      document.body.classList.remove('noscroll');
      document.documentElement.scrollTop = scrollTop;
    };
  }, [cards]);

  const handleClose = () => {
    setOverlayVisible(false);
    setTimeout(onClose, 500);
  };

  const createParticle = (explosionContainer, color) => {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const rect = explosionContainer.getBoundingClientRect();
    const cardWidth = rect.width;
    const cardHeight = rect.height;

    let startX, startY;
    const borderSide = Math.floor(Math.random() * 4);
    switch (borderSide) {
      case 0: 
        startX = Math.random() * cardWidth;
        startY = 0;
        break;
      case 1: 
        startX = cardWidth;
        startY = Math.random() * cardHeight;
        break;
      case 2: 
        startX = Math.random() * cardWidth;
        startY = cardHeight;
        break;
      case 3: 
        startX = 0;
        startY = Math.random() * cardHeight;
        break;
      default:
        startX = Math.random() * cardWidth;
        startY = Math.random() * cardHeight;
    }

    const centerX = cardWidth / 2;
    const centerY = cardHeight / 2;
    const directionX = startX - centerX;
    const directionY = startY - centerY;
    const distance = Math.random() * 350 + 400; 
    const tx = directionX * distance / cardWidth + 'px';
    const ty = directionY * distance / cardHeight + 'px';

    const size = Math.random() * 12;
    particle.style.setProperty('--start-x', `${startX}px`);
    particle.style.setProperty('--start-y', `${startY}px`);
    particle.style.setProperty('--tx', tx);
    particle.style.setProperty('--ty', ty);
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.background = color !== 'rainbow' ? color : 'linear-gradient(45deg, red, orange, yellow, green, blue, purple)';

    explosionContainer.appendChild(particle);

    particle.style.animation = 'explosion 1s forwards';

    particle.addEventListener('animationend', () => {
      particle.remove();
    });
  };

  const triggerExplosion = (explosionContainer, rarity) => {
    const color = rarityColors[rarity] || 'white';
    const numberOfParticles = 250;
    for (let i = 0; i < numberOfParticles; i++) {
      createParticle(explosionContainer, color);
    }
  };

  const handleCardClick = (index) => {
    if (animating) return;

    if (!allFlipped) {
      const updatedStack = cardStack.map(card => ({ ...card, flipped: true }));
      setCardStack(updatedStack);
      setAllFlipped(true);
      setTimeout(() => {
        setAnimating(false);
      }, 600);
    } else {
      setAnimating(true);
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

        if (newCardStack[0].id === lastCardIdRef.current) {
          setLastCardFlipped(true);
        }
      }, 700);
    }
  };

  const handleAddToBinder = async () => {
    if (currentUser) {
      setIsButtonDisabled(true); // Disable the button immediately upon click

      const userDocRef = doc(firestore, 'users', currentUser.uid);
  
      try {
        // Fetch the user's current binder data
        const userDoc = await getDoc(userDocRef);
        const currentBinder = userDoc.exists() ? userDoc.data().binder : [];
  
        // Clean and prepare the new cards data
        const cleanedCards = cardStack.map(card => ({
          id: card.id || '',
          name: card.name || '',
          imageUrl: card.front || '',
          rarity: card.rarity || '',
          subtypes: card.subtypes || [],
          setId: card.setId || '',
          supertypes: card.supertypes || [],
          count: 1 // Default count for new cards
        }));
  
        // Merge new cards into the binder, updating the count if the card already exists
        const mergedBinder = [...currentBinder];
  
        cleanedCards.forEach(newCard => {
          const existingCard = mergedBinder.find(card => card.id === newCard.id);
          if (existingCard) {
            existingCard.count += 1; // Increment the count for existing cards
          } else {
            mergedBinder.push(newCard); // Add new card with count 1
          }
        });

        // Update Firestore with the merged binder data
        await updateDoc(userDocRef, { binder: mergedBinder });
  
        // Call the addCardsToBinder function to update the state in App.js
        addCardsToBinder(cleanedCards.filter(newCard => !currentBinder.find(card => card.id === newCard.id)));
        console.log('button not disabled');
        // Show alert message
        setAlertMessage('Cards added to binder');
        setTimeout(() => {
          setAlertMessage(null); // Hide alert message after 3 seconds
        }, 3000);
      } catch (error) {
        console.error('Error adding cards to binder:', error);
      }
    }
};

useEffect(() => {
  if (!lastCardFlipped) {
      setIsButtonDisabled(false); // Re-enable the button when a new pack is opened
  }
}, [lastCardFlipped]);

  

  const handleOpenAnotherPack = async () => {
    setAspectRatio(640 / 892);
    setCardStack([]);
    setAllFlipped(false);
    setAnimating(false);
    setMovingCard(null);
    setNextTopCardRarity(null);
    
    setIsLoading(true);
    setLastCardFlipped(false);

    await openSelectedPack(setId);
  };

  return (
    <div className={`overlay ${overlayVisible ? 'visible' : 'hidden'}`}>
      <img src={closeIcon} className="overlay-close-button" alt="Close" onClick={handleClose} />
      <div className="overlay-content">
        <div ref={cardStackRef} className="overlay-card-stack" style={{ aspectRatio }}>
          {isLoading && <div><img src={loadingGif} className="overlay-loading" alt="Loading" /></div>}
          {cardStack.map((card, index) => (
            <div
              key={index}
              id={card.id}
              className={`overlay-card ${card.flipped ? 'overlay-flipped' : ''} ${movingCard === index ? 'overlay-card-moving-to-back' : ''}`}
              data-rarity={card.rarity}
              style={{ zIndex: cardStack.length - index }}
            >
              <NormalCard
                id={card.id}
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
                isInteractable={cardStack.length - index === 10}
                boxShadow={index === 1 && !!nextTopCardRarity ? getBoxShadowForRarity(card.rarity) : ''}
              />
              <div className="explosion-container"></div>
            </div>
          ))}
        </div>
        <div className={`overlay-buttons ${lastCardFlipped ? 'visible' : ''}`}>
          <button className='btn-primary' onClick={handleAddToBinder} disabled={isButtonDisabled}>
            Add to Binder
          </button>
          <button className='gradient-btn btn-primary--pulse btn-open-again' onClick={handleOpenAnotherPack}>
            Open Another Pack
          </button>
        </div>
      </div>
      {alertMessage && <div className="custom-alert">{alertMessage}</div>}
    </div>
  );
};

export default Overlay;
