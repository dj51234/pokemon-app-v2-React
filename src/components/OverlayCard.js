import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/OverlayCard.css';
import NormalCard from './NormalCard';

const OverlayCard = ({ cardProps, onClose }) => {
  const [visible, setVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();  // Initialize useNavigate hook

  useEffect(() => {
    const openTimeout = setTimeout(() => {
      setVisible(true);
    }, 10); // Small delay to ensure the component has mounted before starting the fade-in

    return () => {
      clearTimeout(openTimeout);
    };
  }, []);

  const handleClose = () => {
    if (!isClosing) {
      setIsClosing(true);
      setVisible(false); // Trigger fade-out
      setTimeout(() => {
        onClose();
        setIsClosing(false); // Reset the closing state after the transition
      }, 300); // Ensure this matches your CSS transition duration
    }
  };

  const handleCardClick = () => {
    navigate('/card-view', { state: { cardProps } });  // Navigate to the new page and pass the cardProps as state
  };

  return (
    <div className={`binder-overlay-card ${visible ? 'show' : 'hide'}`}>
      <div className="binder-overlay-card-background" onClick={handleClose}></div>
      <div className="binder-overlay-card-content">
        <NormalCard {...cardProps} isInUserBinder={false} isInCardOverlay={true} onCardClick={handleCardClick} />
      </div>
    </div>
  );
};

export default OverlayCard;
