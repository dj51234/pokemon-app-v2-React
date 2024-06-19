import React, { useState } from 'react';
import '../styles/Pack.css';
import defaultImage from '../assets/default-image.png';

const Pack = ({ onOpen }) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    setIsOpening(true);
    setTimeout(() => {
      onOpen();
    }, 400); // Adjust timing as needed
  };

  return (
    <div className="pack-container" onClick={handleOpen}>
      <div className={`pack floating ${isOpening ? 'opening' : ''}`}>
        <img src={defaultImage} alt="Pack" />
      </div>
    </div>
  );
};

export default Pack;
