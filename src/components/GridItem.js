// src/components/GridItem.js
import React from 'react';

const GridItem = ({ set, onSetClick }) => {
  const handleOnClick = () => {
    onSetClick(set);
  };

  return (
    <a className="grid-item" href="#" onClick={handleOnClick}>
      <div className="set-info">
        <img src={set.images.logo} className="logo" alt={`${set.name} logo`} />
        <h2>{set.name}</h2>
        <p>Release date: {set.releaseDate}</p>
        <p>ID: {set.id}</p>
      </div>
    </a>
  );
};

export default GridItem;