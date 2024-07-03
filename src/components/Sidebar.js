import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar, handleLogout }) => {
  const handleLogoutClick = () => {
    handleLogout();
    toggleSidebar(false);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-content">
        <button className="close-btn" onClick={() => toggleSidebar(false)}>×</button>
        <ul className="menu-item-container">
          <li><Link className="menu-item" to="/profile">My Profile</Link></li>
          <li><Link className="menu-item" to="/my-binder">My Binder</Link></li>
          <li><Link className="menu-item" to="/open-packs">Open Packs</Link></li>
          <li><Link className="menu-item" to="/pokedex">Browse Cards</Link></li>
          <li><Link className="menu-item" to="/trade">Trade</Link></li>
          <li><Link className="menu-item" to="/settings">Settings</Link></li>
          <li><a className="menu-item" onClick={handleLogoutClick} href="#logout">Logout</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
