// src/components/ThirdComponent.js
import React from 'react';
import '../styles/ThirdComponent.css';

const ThirdComponent = ({ show }) => {
  return (
    <div className={`third-component`}>
      <div className="third-component-content">
        <h2>Third Component</h2>
      </div>
    </div>
  );
};

export default ThirdComponent;
