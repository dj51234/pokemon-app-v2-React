// File: /src/components/ProfileHeader.js

import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/ProfileHeader.css';
import { AuthContext } from '../App';
import { FaCog, FaSignOutAlt } from 'react-icons/fa'; // Importing Font Awesome icons

const ProfileHeader = ({ onLogout }) => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [initial, setInitial] = useState('');

  // Get user initial
  useEffect(() => {
    if (currentUser && currentUser.displayName) {
      setInitial(currentUser.displayName.charAt(0).toUpperCase());
    }
  }, [currentUser]);

  // Handle click outside to close the dropdown
  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const getProfileImage = () => {
    if (currentUser && currentUser.photoURL) {
      return (
        <img src={currentUser.photoURL} alt="Profile" className="profile-image" />
      );
    }
    return (
      <div className="default-profile-image gradient-background">
        {initial}
      </div>
    );
  };

  return (
    <div className="profile-header-sidebar">
      <Link to="/" className="logo">
        <div className="logo">
            <h2><span className='gradient-text'>MASTERSET</span></h2>
        </div>
      </Link>
      <div className="user-info" ref={dropdownRef}>
        <div 
          className={`user-email ${isDropdownOpen ? 'active' : ''}`} 
          onClick={toggleDropdown}
        >
          {getProfileImage()} {/* Dynamic Profile Image */}
          <span className="user-name">{currentUser?.displayName || 'User Name'}</span>
          <span className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`}>▼</span>
        </div>

        <div className={`profile-dropdown-menu ${isDropdownOpen ? 'open' : ''}`}>
          <div className="profile-dropdown-header">
            {getProfileImage()} {/* Dynamic Profile Image */}
            <div className="profile-dropdown-user-info">
              <span className="profile-dropdown-user-name">{currentUser?.displayName || 'User Name'}</span>
              <span className="profile-dropdown-user-email">{currentUser?.email || 'User Email'}</span>
            </div>
          </div>
          <div className="profile-dropdown-option" onClick={() => handleNavigation('/settings')}>
            <FaCog className="profile-dropdown-option-icon" /> Settings
          </div>
          <div className="profile-dropdown-option" onClick={onLogout}>
            <FaSignOutAlt className="profile-dropdown-option-icon" /> Logout
          </div>
        </div>
      </div>

      <ul className="sidebar-menu">
        <li onClick={() => handleNavigation('/home')}>
          Home
        </li>

        <li onClick={() => handleNavigation('/profile')}>
          Profile (Detailed)
        </li>

        <li className="menu-header">
          Open Packs
        </li>
        <li className="menu-item menu-item--secondary" onClick={() => handleNavigation('/packs/pack1')}>
          Shrouded Fable
        </li>
        <li className="menu-item menu-item--secondary" onClick={() => handleNavigation('/packs/pack2')}>
          Twilight Masquerade
        </li>
        <li className="menu-item menu-item--secondary" onClick={() => handleNavigation('/packs/pack3')}>
          Temporal Forces
        </li>
        <li className="menu-item menu-item--secondary" onClick={() => handleNavigation('/packs/pack4')}>
          Paldean Fates
        </li>
        <li className="menu-item menu-item--secondary" onClick={() => handleNavigation('/packs/pack5')}>
          Paradox Rift
        </li>
        <li className="menu-item menu-item--secondary" onClick={() => handleNavigation('/packs/view-all')}>
          View All
        </li>

        <li className="menu-header">
          My Binder
        </li>
        <li className="menu-item menu-item--secondary" onClick={() => handleNavigation('/binder/view')}>
          View
        </li>
        <li className="menu-item menu-item--secondary" onClick={() => handleNavigation('/binder/organize')}>
          Organize
        </li>

        <li onClick={() => handleNavigation('/sets')}>
          Browse All Sets
        </li>

        <li onClick={() => handleNavigation('/messages')}>
          Messages
        </li>

        <li onClick={() => handleNavigation('/trade')}>
          Trade With Others
        </li>
      </ul>
    </div>
  );
};

export default ProfileHeader;
