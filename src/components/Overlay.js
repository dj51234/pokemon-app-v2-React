import React, { useEffect, useState } from 'react';
import '../styles/Overlay.css';

const Overlay = ({ onClose, isVisible }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => setVisible(true), 10); // Slight delay to trigger the transition
    } else {
      setVisible(false);
    }
  }, [isVisible]);

  return (
    <div className={`overlay ${visible ? 'visible' : ''}`} onClick={onClose}>
      <button className="close-button" onClick={onClose}>X</button>
    </div>
  );
};

export default Overlay;
