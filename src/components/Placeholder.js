import React, { useState, useEffect } from 'react';
import '../styles/OverlayCard.css';
import NormalCard from './NormalCard';
import grass from '../assets/types/grass.png';

const OverlayCard = ({ cardProps, onClose }) => {
  const [visible, setVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

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

  return (
    <div className={`binder-overlay-card ${visible ? 'show' : 'hide'}`}>
      <div className="binder-overlay-card-background" onClick={handleClose}></div>
      <div className="binder-overlay-card-content">
        <div className="binder-overlay-card-left">
          <NormalCard {...cardProps} isInUserBinder={false} />
        </div>
        <div className="binder-overlay-card-right">
          <div className='binder-overlay-card-right--info'>
            <h1 className='binder-overlay-card-right--title'>Joltik <span className='binder-overlay-card-right--subtitle'>(Pokémon - Basic)</span></h1>
            <div className='binder-overlay-card-right--attributes'>
              <p>HP: 30</p>
              <img src={grass} alt='Joltik' />
            </div>
          </div>
          <div className="card-prices">
            <h2>Prices</h2>
            <div className='binder-overlay-card-right--prices'>
              <div className='binder-overlay-card-right--prices-item'>
                  <h3>Low:</h3>
                  <p>$0.25</p>
                </div>
                <div className='binder-overlay-card-right--prices-item'>
                  <h3>Mid:</h3>
                  <p>$0.25</p>
                </div>
                <div className='binder-overlay-card-right--prices-item'>
                  <h3>High:</h3>
                  <p>$0.25</p>
                </div>
            </div>
          </div>
          <div className="card-attack">
            <h2>Poisonous Musculature</h2>
            <p>Search your deck for up to 2 Basic Darkness Energy cards and attach them to this Pokémon. Then, shuffle your deck. If you attached Energy to a Pokémon in this way, this Pokémon is now Poisoned.</p>
            <p>Damage: 10</p>
          </div>
          <div className="card-ability">
            <div className='card-ability--info'>
              <div className='card-ability--types'>
                <img src={grass} alt='Joltik' />
                <img src={grass} alt='Joltik' />
              </div>
              <div className='card-ability--ability'>
                <h2 className='card-ability--name'>Chain-Crazed</h2>
                <h2 className='card-ability--damage'>130+</h2>
              </div>
            </div>
            <p>If this Pokémon is Poisoned, this attack does 130 more damage.</p>
          </div>
          <div className="card-additional-info">
            <p>Weakness: ×2 to Fire</p>
            <p>Resistance: N/A</p>
            <p>Retreat Cost: 1</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverlayCard;
