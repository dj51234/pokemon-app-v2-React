// GridItem.js
import React from 'react';

const GridItem = ({ set, onSetClick }) => {
  const handleOnClick = () => {
    onSetClick(set);
  };

  return (
    <a className="grid-item" href="#" onClick={handleOnClick}>
      <img src={set.images.logo} className="logo" alt={`${set.name} logo`} />
      <div className="set-info">
        <img src={set.images.symbol} className="symbol" alt={`${set.name} symbol`} />
        <h2>{set.name}</h2>
      </div>
      <p>Release date: {set.releaseDate}</p>
      <p>ID: {set.id}</p>
    </a>
  );
};

export default GridItem;