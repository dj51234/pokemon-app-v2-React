// src/components/Grid.js

import React, { useState, useEffect } from 'react';
import GridItem from './GridItem';
import CardItem from './CardItem';
import '../styles/Grid.css';

const Grid = ({ sets, viewMode, cards = [], onSetClick, isAuthenticated, removeCard }) => { // Add removeCard prop
  const [loadedCount, setLoadedCount] = useState(0); // State to track loaded images
  const totalCards = cards.length; // Total number of cards

  // Handle the image load complete event
  const handleImageLoadComplete = () => {
    setLoadedCount((prevCount) => prevCount + 1);
  };

  useEffect(() => {
    // Reset the loaded count when cards change
    setLoadedCount(0);
  }, [cards]);

  // Conditionally apply the sets-grid--profile class if authenticated
  const gridClass =
    viewMode === 'sets'
      ? `sets-grid ${isAuthenticated ? 'sets-grid--profile' : ''}`
      : `cards-grid ${isAuthenticated ? 'cards-grid--profile' : ''}`;

  return (
    <div id="grid" className={gridClass}>
      {viewMode === 'sets' ? (
        sets.map((set) => (
          <GridItem key={set.id} set={set} onSetClick={onSetClick} />
        ))
      ) : (
        cards.map((card) => (
          <CardItem
            key={card.id}
            card={card}
            onLoadComplete={handleImageLoadComplete} // Pass the onLoad handler
            removeCard={removeCard} // Pass the removeCard prop
          />
        ))
      )}

      
    </div>
  );
};

export default Grid;
