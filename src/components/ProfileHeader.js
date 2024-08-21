// src/components/ProfileHeader.js

import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import '../styles/ProfileHeader.css';
import { AuthContext } from '../App';
import { FaCog, FaSignOutAlt } from 'react-icons/fa';
import { auth } from '../js/firebase';

const ProfileHeader = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [initial, setInitial] = useState('');

  useEffect(() => {
    if (currentUser && currentUser.displayName) {
      setInitial(currentUser.displayName.charAt(0).toUpperCase());
    }
  }, [currentUser]);

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

  const handleSetLinkClick = (setId) => {
    if (location.pathname === '/packs/view-all') {
      const event = new CustomEvent('openPackOverlay', { detail: { setId } });
      window.dispatchEvent(event);
    } else {
      navigate(`/packs/view-all?setId=${setId}`);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getProfileImage = () => {
    if (currentUser && currentUser.photoURL) {
      return <img src={currentUser.photoURL} alt="Profile" className="profile-image" />;
    }
    return <div className="default-profile-image gradient-background">{initial}</div>;
  };

  return (
    <div className="profile-header-sidebar">
      <Link to="/" className="logo">
        <div className="logo">
          <h2><span className='gradient-text'>MASTERSET</span></h2>
        </div>
      </Link>

      <div className="user-info" ref={dropdownRef}>
        <div className={`user-email ${isDropdownOpen ? 'active' : ''}`} onClick={toggleDropdown}>
          {getProfileImage()} {/* Dynamic Profile Image */}
          <span className="user-name">{currentUser?.displayName || 'User Name'}</span>
          <span className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`}>▼</span>
        </div>

        {isDropdownOpen && (
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
            <div className="profile-dropdown-option" onClick={handleLogout}>
              <FaSignOutAlt className="profile-dropdown-option-icon" /> Logout
            </div>
          </div>
        )}
      </div>

      <ul className="sidebar-menu">
        <li onClick={() => handleNavigation('/')}>Home</li>
        <li onClick={() => handleNavigation('/profile')}>Profile (Detailed)</li>
        <li className="menu-header">Open Packs</li>
        <li className="menu-item menu-item--secondary" onClick={() => handleSetLinkClick('sv6pt5')}>
         Shrouded Fable <span className="gradient-text">NEW</span> 
        </li>
        <li className="menu-item menu-item--secondary" onClick={() => handleSetLinkClick('sv6')}>
          Twilight Masquerade
        </li>
        <li className="menu-item menu-item--secondary" onClick={() => handleSetLinkClick('sv5')}>
          Temporal Forces
        </li>
        <li className="menu-item menu-item--secondary" onClick={() => handleSetLinkClick('sv4pt5')}>
          Paldean Fates
        </li>
        <li className="menu-item menu-item--secondary" onClick={() => handleSetLinkClick('sv4')}>
          Paradox Rift
        </li>
        <li className="menu-item menu-item--secondary">
          <Link to="/packs/view-all">View All</Link>
        </li>
        <li className="menu-header">My Binder</li>
        <li className="menu-item menu-item--secondary" onClick={() => handleNavigation('/binder/view')}>View</li>
        <li className="menu-item menu-item--secondary" onClick={() => handleNavigation('/binder/wishlist')}>Wishlist</li>
        <li onClick={() => handleNavigation('/pokedex')}>Browse All Sets</li>
        <li onClick={() => handleNavigation('/messages')}>Messages</li>
        <li onClick={() => handleNavigation('/trade')}>Trade With Others</li>
      </ul>
    </div>
  );
};

export default ProfileHeader;
