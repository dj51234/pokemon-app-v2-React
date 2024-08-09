// src/components/CustomAlert.js

import React from 'react';
import '../styles/CustomAlert.css';

const CustomAlert = ({ message, onClose }) => {
  return (
    <div className="custom-alert-overlay">
      <div className="custom-alert">
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default CustomAlert;
