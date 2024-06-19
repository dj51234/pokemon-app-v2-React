// src/components/Sidebar.js
import React from 'react';
import '../styles/Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar, handleLogout }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-content">
        <button className="close-btn" onClick={() => toggleSidebar(false)}>×</button>
        <ul className="menu-item-container">
          <li><a className="menu-item" href="/profile">My Profile</a></li>
          <li><a className="menu-item" href="/my-binder">My Binder</a></li>
          <li><a className="menu-item" href="/open-packs">Open Packs</a></li>
          <li><a className="menu-item" href="/pokedex">Browse Cards</a></li>
          <li><a className="menu-item" href="/trade">Trade</a></li>
          <li><a className="menu-item" href="/settings">Settings</a></li>
          <li><a className="menu-item" onClick={handleLogout} href="#logout">Logout</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
