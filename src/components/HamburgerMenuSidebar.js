// src/components/HamburgerMenuSidebar.js
import React from 'react';
import '../styles/HamburgerMenuSidebar.css';

const HamburgerMenuSidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`hamburger-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="hamburger-sidebar-content">
        <button className="close-btn" onClick={() => toggleSidebar(false)}>×</button>
        <ul className="menu-item-container">
          <li><a className="menu-item" href="/register">Register</a></li>
          <li><a className="menu-item" href="/login">Login</a></li>
          <li><a className="menu-item" href="/pokedex">Browse Cards</a></li>
        </ul>
      </div>
    </div>
  );
};

export default HamburgerMenuSidebar;
