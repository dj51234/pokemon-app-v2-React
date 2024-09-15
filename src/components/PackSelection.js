// src/components/PackSelection.js
import React, { useState, useEffect } from 'react';
import { fetchSetsForPackSelection, fetchRandomPokemonCards } from '../js/api';
import '../styles/PackSelection.css';

const PackSelection = ({ onSelect, show, onFetchCards, onNext }) => {
  const [sets, setSets] = useState([]);
  const [highlightedSetId, setHighlightedSetId] = useState('sv7'); // Default to Twilight Masquerade

  useEffect(() => {
    const getSets = async () => {
      try {
        const setData = await fetchSetsForPackSelection();
        
        const popularSets = setData.filter(set => ["sv7",'sv6pt5', "sv6", "sv3pt5"].includes(set.id));
        setSets([...popularSets]);
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
    onNext();
  };

  return (
    <div className={`pack-selection ${show ? 'show' : ''}`}>
      <h2><span className='gradient-text'>Step 1:</span> Select Your Pack</h2>
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
