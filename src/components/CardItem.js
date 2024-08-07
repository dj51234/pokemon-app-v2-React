// src/components/CardItem.js

import React, { useState } from 'react';

const CardItem = ({ image, rarity, onLoadComplete }) => {
  const [isLoaded, setIsLoaded] = useState(false); // Track image loading state

  const lowerCaseRarity = rarity ? rarity.toLowerCase() : 'unknown';

  // Set image loaded state to true when image finishes loading
  const handleImageLoad = () => {
    setIsLoaded(true);
    onLoadComplete(); // Notify parent that this image has loaded
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
        className={`card-wrapper ${isLoaded ? 'loaded' : ''}`} // Add a class for loaded state
        data-rarity={lowerCaseRarity}
      >
        {!isLoaded && <div className="skeleton-loader"></div>} {/* Show skeleton until image loads */}
        <img
          src={image}
          alt="Card"
          className={`card-image ${isLoaded ? 'visible' : 'hidden'}`} // Hide image until loaded
          onLoad={handleImageLoad} // Trigger image load handler
        />
      </div>
    </div>
  );
};

export default CardItem;
