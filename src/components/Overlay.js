// src/components/Overlay.js
import React, { useEffect, useState } from 'react';
import '../styles/Overlay.css';

const Overlay = ({ onClose, isVisible }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      document.body.classList.add('no-scroll');
      setTimeout(() => setVisible(true), 10); // Slight delay to trigger the transition
    } else {
      document.body.classList.remove('no-scroll');
      setVisible(false);
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isVisible]);

  return (
    <div className={`overlay ${visible ? 'visible' : ''}`} onClick={onClose}>
      <button className="close-button" onClick={onClose}>X</button>
    </div>
  );
};

export default Overlay;
