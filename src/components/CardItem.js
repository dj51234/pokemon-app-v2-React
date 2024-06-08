// CardItem.js
import React from 'react';

const CardItem = ({ image, rarity }) => {
  console.log("Card Item Props:", { image, rarity }); // Log props to check if rarity is received
  const lowerCaseRarity = rarity ? rarity.toLowerCase() : 'unknown';
  const isHolographic = lowerCaseRarity !== "rare" && lowerCaseRarity !== "common" && lowerCaseRarity !== "uncommon";
  return (
    <a
      className="grid-item--card"
      href="#"
      data-rarity={lowerCaseRarity}
      style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <img src={image} alt="Card" className="card-image" style={{ visibility: 'hidden' }} />
    </a>
  );
};

export default CardItem;
