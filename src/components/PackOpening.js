// src/components/PackOpening.js
import React from 'react';
import '../styles/PackOpening.css';

const PackOpening = ({ onBack, show }) => {
  return (
    <div className={`pack-opening ${show ? 'show' : ''}`}>
      <h1>page-2</h1>
      <button onClick={onBack}>Back to Pack Selection</button>
    </div>
  );
};

export default PackOpening;
