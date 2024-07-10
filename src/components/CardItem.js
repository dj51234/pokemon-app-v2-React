// src/components/CardItem.js
import React from 'react';

const CardItem = ({ image, rarity }) => {
  console.log("Card Item Props:", { image, rarity }); // Log props to check if rarity is received
  const lowerCaseRarity = rarity ? rarity.toLowerCase() : 'unknown';
  const isHolographic = lowerCaseRarity !== "rare" && lowerCaseRarity !== "common" && lowerCaseRarity !== "uncommon";

  return (
    <div
      className="grid-item--card"
      style={{ backgroundSize: 'contain', backgroundPosition: 'center' }}
    >
      <div className="card-wrapper" data-rarity={lowerCaseRarity}>
        <img src={image} alt="Card" className="card-image" />
      </div>
    </div>
  );
};

export default CardItem;
