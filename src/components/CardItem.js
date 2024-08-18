import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { firestore } from '../js/firebase';
import { fetchCardData } from '../js/api';
import CustomAlert from './CustomAlert'; // Import the CustomAlert component

const CardItem = ({ card, cardId, onLoadComplete, removeCard }) => {
  const { currentUser } = useContext(AuthContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cardData, setCardData] = useState(card || {});
  const [inWishlist, setInWishlist] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null); // State for custom alert message

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
      setAlertMessage('Card added to wishlist!'); // Trigger custom alert
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
      setAlertMessage('Card removed from wishlist!'); // Trigger custom alert
    }
  };

  const closeAlert = () => {
    setAlertMessage(null); // Close the alert
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
        data-id={cardData.id}
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
      {alertMessage && <CustomAlert message={alertMessage} onClose={closeAlert} />}
    </div>
  );
};

export default CardItem;
