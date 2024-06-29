import React from 'react';
import GridItem from './GridItem';
import CardItem from './CardItem';
import '../styles/Grid.css';

const Grid = ({ sets, viewMode, cards = [], onSetClick }) => (
  <div id="grid">
    {viewMode === 'sets' ? (
      sets.map(set => <GridItem key={set.id} set={set} onSetClick={onSetClick} />)
    ) : (
      cards.map(card => (
        <CardItem
          key={card.id}
          image={card.images.small}
          rarity={card.rarity} // Pass rarity to CardItem
        />
      ))
    )}
  </div>
);

export default Grid;
