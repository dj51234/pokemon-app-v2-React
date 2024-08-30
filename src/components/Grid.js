// Grid.js
import React, { useState, useEffect } from 'react';
import GridItem from './GridItem';
import CardItem from './CardItem';
import '../styles/Grid.css';

const Grid = ({ sets, viewMode, cards = [], binderCards = [], onSetClick, isAuthenticated, removeCard, selectedSet }) => { 
  const [loadedCount, setLoadedCount] = useState(0); // State to track loaded images

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
    <>
      {selectedSet && viewMode === 'cards' && <h1 className='set-title-pokedex'>Viewing: <span className='pink-text'>{selectedSet.name}</span></h1>}
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
              binderCards={binderCards}
              onLoadComplete={handleImageLoadComplete}
              removeCard={removeCard}
            />
          ))
        )}
      </div>
    </>
  );
};

export default Grid;
