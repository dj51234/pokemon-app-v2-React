// src/components/PackSelection.js
import React, { useState, useEffect } from 'react';
import { fetchSetsForPackSelection, fetchRandomPokemonCards } from '../js/api';
import '../styles/PackSelection.css';

const PackSelection = ({ onSelect, show, onFetchCards }) => {
  const [sets, setSets] = useState([]);
  const [highlightedSetId, setHighlightedSetId] = useState('sv6'); // Default to Twilight Masquerade

  useEffect(() => {
    const getSets = async () => {
      try {
        const setData = await fetchSetsForPackSelection();
        const twilightMasquerade = setData.find(set => set.id === 'sv6');
        const popularSets = setData.filter(set => ["base1", "neo1", "gym1"].includes(set.id));
        setSets([twilightMasquerade, ...popularSets]);
      } catch (error) {
        console.error('Error fetching set data:', error);
      }
    };
    getSets();
  }, []);

  const handleHover = (setId) => {
    setHighlightedSetId(setId);
  };

  const handleClick = async (setId) => {
    const cards = await fetchRandomPokemonCards(setId);
    onFetchCards(cards);
    onSelect(setId);
  };

  return (
    <div className={`pack-selection ${show ? 'shift-left' : ''}`}>
      <h2>Step 1: Select Your Pack</h2>
      <div className="sets-container">
        {sets.map((set, index) => (
          set ? (
            <div
              key={index}
              className={`set ${set.id === highlightedSetId ? "highlighted" : ""}`}
              onMouseEnter={() => handleHover(set.id)}
              onClick={() => handleClick(set.id)}
              style={{ cursor: "pointer" }}
              data-set-id={set.id}
            >
              {set.id === highlightedSetId && <div className="arrow-indicator"></div>}
              <img src={set.logo} alt={set.name} />
              <div className="set-text">
                <h3>{set.name}</h3>
                <p>Release Date: {set.releaseDate}</p>
              </div>
            </div>
          ) : null
        ))}
      </div>
    </div>
  );
};

export default PackSelection;
