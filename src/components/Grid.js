// src/components/Grid.js

import React, { useState, useEffect } from 'react';
import GridItem from './GridItem';
import CardItem from './CardItem';
import '../styles/Grid.css';

const Grid = ({ sets, viewMode, cards = [], onSetClick }) => {
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

  const gridClass = viewMode === 'sets' ? 'sets-grid' : 'cards-grid';

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
            image={card.images.large}
            rarity={card.rarity}
            onLoadComplete={handleImageLoadComplete} // Pass the onLoad handler
          />
        ))
      )}

      {/* Show grid skeleton until all images are loaded */}
      {loadedCount !== totalCards && viewMode === 'cards' && (
        <div className="grid-skeleton-loader"></div>
      )}
    </div>
  );
};

export default Grid;
