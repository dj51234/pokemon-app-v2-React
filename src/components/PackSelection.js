import React, { useState, useEffect } from 'react';
import { fetchSetsForPackSelection } from '../js/api';
import '../styles/PackSelection.css';

const PackSelection = ({ onSelect, show }) => {
  const [sets, setSets] = useState([]);
  const twilightMasqueradeId = "sv6"; // Update with the actual set ID for Twilight Masquerade

  useEffect(() => {
    const getSets = async () => {
      try {
        const setData = await fetchSetsForPackSelection();
        const twilightMasquerade = setData.find(set => set.id === twilightMasqueradeId);
        const popularSets = setData.filter(set => ["base1", "neo1", "gym1"].includes(set.id));
        setSets([twilightMasquerade, ...popularSets]);
      } catch (error) {
        console.error('Error fetching set data:', error);
      }
    };
    getSets();
  }, []);

  return (
    <div className={`pack-selection ${show ? 'shift-left' : ''}`}>
      <h2>Step 1: Select Your Pack</h2>
      <div className="sets-container">
        {sets.map((set, index) => (
          set ? (
            <div
              key={index}
              className={`set ${set.id === twilightMasqueradeId ? "highlighted" : ""}`}
              onClick={() => set.id === twilightMasqueradeId && onSelect(set.id)}
              style={set.id === twilightMasqueradeId ? { cursor: "pointer" } : { cursor: "default" }}
            >
              {set.id === twilightMasqueradeId && <div className="arrow-indicator"></div>}
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
