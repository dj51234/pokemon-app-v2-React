import React from 'react';
import '../styles/ThirdComponent.css';

const ThirdComponent = ({ show, revealedCards, onBack }) => {
  return (
    <div className={`third-component ${show ? 'show' : ''}`}>
      <div className="third-component-content">
        <h2>Card Grid</h2>
        <div className="card-grid">
          {revealedCards.map((card, index) => (
            <div key={index} className="card-item">
              <img src={card.image} alt="Card" />
            </div>
          ))}
        </div>
        <button className="back-button" onClick={onBack}>Back to Pack Opening</button>
      </div>
    </div>
  );
};

export default ThirdComponent;
