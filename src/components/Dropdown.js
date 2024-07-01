// src/components/Dropdown.js
import React from 'react';
import '../styles/Dropdown.css';

const Dropdown = ({ isOpen, toggleDropdown, children }) => {
  return (
    <div className="dropdown-container">
      <button className="dropdown-toggle" onClick={toggleDropdown}>
        Filters
      </button>
      {isOpen && <div className="dropdown-content">{children}</div>}
    </div>
  );
};

export default Dropdown;
