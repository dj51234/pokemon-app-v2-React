import React from 'react';
import '../styles/ThirdComponent.css';

const ThirdComponent = ({ show, onBack }) => {
  return (
    <div className={`third-component ${show ? 'show' : ''}`}>
      <div className="third-component-content">
        <h2>Step 3: Add To Binder</h2>
        <button className="back-button" onClick={onBack}>Back to Pack Opening</button>
      </div>
    </div>
  );
};

export default ThirdComponent;
