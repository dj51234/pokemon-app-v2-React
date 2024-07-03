import React from 'react';
import GridItem from './GridItem';
import CardItem from './CardItem';
import '../styles/Grid.css';

const Grid = ({ sets, viewMode, cards = [], onSetClick }) => {
  const gridClass = viewMode === 'sets' ? 'sets-grid' : 'cards-grid';

  return (
    <div id="grid" className={gridClass}>
      {viewMode === 'sets' ? (
        sets.map(set => <GridItem key={set.id} set={set} onSetClick={onSetClick} />)
      ) : (
        cards.map(card => (
          <CardItem
            key={card.id}
            image={card.images.small}
            rarity={card.rarity}
          />
        ))
      )}
    </div>
  );
};

export default Grid;
