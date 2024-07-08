// src/components/Overlay.js
import React, { useEffect, useState } from 'react';
import '../styles/Overlay.css';

const Overlay = ({ onClose, isVisible, children }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      document.body.classList.add('no-scroll');
      document.documentElement.classList.add('overlay-visible');
      setTimeout(() => setVisible(true), 10); // Slight delay to trigger the transition
    } else {
      document.body.classList.remove('no-scroll');
      document.documentElement.classList.remove('overlay-visible');
      setVisible(false);
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('no-scroll');
      document.documentElement.classList.remove('overlay-visible');
    };
  }, [isVisible]);

  return (
    <div className={`overlay ${visible ? 'visible' : ''}`} onClick={onClose}>
      {children}
      <button className="close-button" onClick={onClose}>X</button>
    </div>
  );
};

export default Overlay;
