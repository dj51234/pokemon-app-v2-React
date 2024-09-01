import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { firestore } from '../js/firebase';
import { fetchCardData } from '../js/api';
import CustomAlert from './CustomAlert';
import '../styles/WishlistPage.css';

const CardItem = ({ card, cardId, onLoadComplete, removeCard }) => {
  const { currentUser, binderCards } = useContext(AuthContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cardData, setCardData] = useState(card || {});
  const [inWishlist, setInWishlist] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [borderRadius, setBorderRadius] = useState('0px');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (cardId && !card) {
        try {
          const fetchedCardInfo = await fetchCardData([cardId]);
          if (fetchedCardInfo && fetchedCardInfo.length > 0) {
            setCardData(fetchedCardInfo[0]);
          } else {
            setError('Failed to fetch card data');
          }
        } catch (error) {
          console.error('Error fetching card data:', error);
          setError('Failed to fetch card data');
        }
      }
    };
    fetchData();
  }, [cardId, card]);

  useEffect(() => {
    const checkWishlist = async () => {
      if (currentUser && cardData.id) {
        try {
          const userDocRef = doc(firestore, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setInWishlist(userData.wishlist?.some(item => 
              typeof item === 'string' ? item === cardData.id : item.id === cardData.id
            ));
          }
        } catch (error) {
          console.error('Error checking wishlist:', error);
        }
      }
    };
    checkWishlist();
  }, [currentUser, cardData.id]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    calculateBorderRadius();
    if (onLoadComplete) onLoadComplete();
  };

  const addToWishlist = async () => {
    if (currentUser && cardData.id && cardData.images?.large) {
      try {
        const userDocRef = doc(firestore, 'users', currentUser.uid);
        const wishlistItem = {
          id: cardData.id,
          imageUrl: cardData.images.large
        };
        await updateDoc(userDocRef, {
          wishlist: arrayUnion(wishlistItem),
        });
        setInWishlist(true);
        setAlertMessage('Card added to wishlist!');
      } catch (error) {
        console.error('Error adding to wishlist:', error);
        setAlertMessage('Failed to add card to wishlist');
      }
    }
  };

  const removeFromWishlist = async () => {
    if (currentUser && cardData.id) {
      try {
        const userDocRef = doc(firestore, 'users', currentUser.uid);
        const wishlistItem = {
          id: cardData.id,
          imageUrl: cardData.images?.large
        };
        await updateDoc(userDocRef, {
          wishlist: arrayRemove(wishlistItem),
        });
        setInWishlist(false);
        removeCard(cardData.id);
        setAlertMessage('Card removed from wishlist!');
      } catch (error) {
        console.error('Error removing from wishlist:', error);
        setAlertMessage('Failed to remove card from wishlist');
      }
    }
  };

  const closeAlert = () => {
    setAlertMessage(null);
  };

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

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="grid-item--card" style={{ backgroundSize: 'contain', backgroundPosition: 'center', background: 'var(--black)' }}>
      <div
        className={`card-wrapper ${isLoaded ? 'loaded' : ''} ${isInBinder ? 'pink-border' : ''}`}
        data-rarity={cardData.rarity ? cardData.rarity.toLowerCase() : 'unknown'}
        data-id={cardData.id}
        data-image={cardData.images?.large}
        data-name={cardData.name}
        style={{ borderRadius }}
      >
        {!isLoaded && <div className="skeleton-loader"></div>}
        {cardData.images?.large && (
          <img
            src={cardData.images.large}
            alt={cardData.name}
            className={`card-image ${isLoaded ? 'visible' : 'hidden'}`}
            onLoad={handleImageLoad}
            crossOrigin="anonymous"
          />
        )}
        {currentUser && (
          <button
            className="wishlist-button"
            onClick={isInBinder ? null : inWishlist ? removeFromWishlist : addToWishlist}
            disabled={isInBinder}
            style={{ cursor: isInBinder ? 'default' : 'pointer' }}
          >
            {isInBinder ? 'Card In Binder' : inWishlist ? 'Remove from Wishlist -' : 'Add to Wishlist +'}
          </button>
        )}
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
