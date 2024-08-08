// src/components/CardItem.js

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { firestore } from '../js/firebase';
import { fetchCardData } from '../js/api';

const CardItem = ({ card, cardId, onLoadComplete, removeCard }) => {
  const { currentUser } = useContext(AuthContext); // Use AuthContext to get the current user
  const [isLoaded, setIsLoaded] = useState(false); // Track image loading state
  const [cardData, setCardData] = useState(card || {});
  const [inWishlist, setInWishlist] = useState(false); // Track if the card is in the wishlist

  useEffect(() => {
    const fetchData = async () => {
      if (cardId && !card) {
        const cardInfo = await fetchCardData([cardId]);
        setCardData(cardInfo[0]);
      }
    };
    fetchData();
  }, [cardId, card]);

  useEffect(() => {
    const checkWishlist = async () => {
      if (currentUser && cardData.id) {
        const userDocRef = doc(firestore, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setInWishlist(userData.wishlist?.includes(cardData.id));
        }
      }
    };
    checkWishlist();
  }, [currentUser, cardData.id]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    if (onLoadComplete) onLoadComplete(); // Notify parent that this image has loaded
  };

  const addToWishlist = async () => {
    if (currentUser && cardData.id) {
      const userDocRef = doc(firestore, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        wishlist: arrayUnion(cardData.id),
      });
      setInWishlist(true);
      alert('Card added to wishlist!');
    }
  };

  const removeFromWishlist = async () => {
    if (currentUser && cardData.id) {
      const userDocRef = doc(firestore, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        wishlist: arrayRemove(cardData.id),
      });
      setInWishlist(false);
      removeCard(cardData.id); // Call the removeCard function passed as a prop
      alert('Card removed from wishlist!');
    }
  };

  if (!cardData.id) {
    return null;
  }

  return (
    <div
      className="grid-item--card"
      style={{
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        background: 'var(--black)',
      }}
    >
      <div
        className={`card-wrapper ${isLoaded ? 'loaded' : ''}`}
        data-rarity={cardData.rarity ? cardData.rarity.toLowerCase() : 'unknown'}
      >
        {!isLoaded && <div className="skeleton-loader"></div>}
        <img
          src={cardData.images?.large}
          alt="Card"
          className={`card-image ${isLoaded ? 'visible' : 'hidden'}`}
          onLoad={handleImageLoad}
        />
        {currentUser && (
          <button
            className="wishlist-button"
            onClick={inWishlist ? removeFromWishlist : addToWishlist}
          >
            {inWishlist ? 'Remove from Wishlist -' : 'Add to Wishlist +'}
          </button>
        )}
      </div>
    </div>
  );
};

export default CardItem;
