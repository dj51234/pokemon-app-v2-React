import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { firestore } from '../js/firebase';
import { fetchCardData } from '../js/api';
import CustomAlert from './CustomAlert'; // Import the CustomAlert component
import '../styles/WishlistPage.css'; // Assuming the styles file is already linked

const CardItem = ({ card, cardId, onLoadComplete, removeCard }) => {
  const { currentUser, binderCards } = useContext(AuthContext); // Access binderCards from AuthContext
  const [isLoaded, setIsLoaded] = useState(false);
  const [cardData, setCardData] = useState(card || {});
  const [inWishlist, setInWishlist] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null); // State for custom alert message
  const [borderRadius, setBorderRadius] = useState('0px');

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
    calculateBorderRadius();
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

  // Check if this card exists in the user's binder
  const isInBinder = binderCards.some(binderCard => binderCard.id === cardData.id);

  // Calculate border radius using the image's transparent corners
  const calculateBorderRadius = () => {
    try {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = cardData.images?.large;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const threshold = 10;
        const sampleSize = 50;
        const transparentPixelCount = { topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0 };

        const isTransparent = (pixelData) => pixelData[3] < threshold;

        for (let y = 0; y < sampleSize; y++) {
          for (let x = 0; x < sampleSize; x++) {
            const pixelData = ctx.getImageData(x, y, 1, 1).data;
            if (isTransparent(pixelData)) {
              transparentPixelCount.topLeft++;
            }
          }
        }

        for (let y = 0; y < sampleSize; y++) {
          for (let x = img.width - sampleSize; x < img.width; x++) {
            const pixelData = ctx.getImageData(x, y, 1, 1).data;
            if (isTransparent(pixelData)) {
              transparentPixelCount.topRight++;
            }
          }
        }

        for (let y = img.height - sampleSize; y < img.height; y++) {
          for (let x = 0; x < sampleSize; x++) {
            const pixelData = ctx.getImageData(x, y, 1, 1).data;
            if (isTransparent(pixelData)) {
              transparentPixelCount.bottomLeft++;
            }
          }
        }

        for (let y = img.height - sampleSize; y < img.height; y++) {
          for (let x = img.width - sampleSize; x < img.width; x++) {
            const pixelData = ctx.getImageData(x, y, 1, 1).data;
            if (isTransparent(pixelData)) {
              transparentPixelCount.bottomRight++;
            }
          }
        }

        const totalTransparentPixels = transparentPixelCount.topLeft + transparentPixelCount.topRight + transparentPixelCount.bottomLeft + transparentPixelCount.bottomRight;
        const borderRadiusValue = totalTransparentPixels > 0 ? '12px' : '0px';

        setBorderRadius(borderRadiusValue);
      };
    } catch (error) {
      console.error("Failed to calculate border radius", error);
    }
  };

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
        className={`card-wrapper ${isLoaded ? 'loaded' : ''} ${isInBinder ? 'pink-border' : ''}`}
        data-rarity={cardData.rarity ? cardData.rarity.toLowerCase() : 'unknown'}
        data-id={cardData.id}
        style={{ borderRadius }}
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
            onClick={isInBinder ? null : inWishlist ? removeFromWishlist : addToWishlist}
            disabled={isInBinder} // Disable button if the card is in the binder
            style={{ cursor: isInBinder ? 'default' : 'pointer' }} // Conditionally set cursor style
          >
            {isInBinder ? 'Card In Binder' : inWishlist ? 'Remove from Wishlist -' : 'Add to Wishlist +'}
          </button>
        )}
        {/* Add dynamic border radius to ::after element */}
        <style>{`
          .card-wrapper::after {
            border-radius: ${borderRadius};
          }
        `}</style>
      </div>
      {alertMessage && <CustomAlert message={alertMessage} onClose={closeAlert} />}
    </div>
  );
};

export default CardItem;
