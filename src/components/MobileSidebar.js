// File: /src/components/MobileSidebar.js

import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../App';
import { FaCog, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import '../styles/MobileSidebar.css';
import { auth } from '../js/firebase';

const MobileSidebar = ({ isOpen, toggleSidebar }) => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [initial, setInitial] = useState('');

  useEffect(() => {
    if (currentUser && currentUser.displayName) {
      setInitial(currentUser.displayName.charAt(0).toUpperCase());
    }
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
      toggleSidebar();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    toggleSidebar();
  };

  const handleSetLinkClick = (setId) => {
    if (location.pathname === '/packs/view-all') {
      const event = new CustomEvent('openPackOverlay', { detail: { setId } });
      window.dispatchEvent(event);
    } else {
      navigate(`/packs/view-all?setId=${setId}`);
      toggleSidebar();
    }
  };

  const getProfileImage = () => {
    if (currentUser && currentUser.photoURL) {
      return <img src={currentUser.photoURL} alt="Profile" className="profile-image" />;
    }
    return <div className="default-profile-image gradient-background">{initial}</div>;
  };

  return (
    <div className={`mobile-header-sidebar ${isOpen ? 'open' : 'closed'}`}>
      {location.pathname === '/' && (
        <button className="close-btn" onClick={() => toggleSidebar(false)}>
          <FaTimes />
        </button>
      )}
      <div className="user-info">
        {getProfileImage()} {/* Dynamic Profile Image */}
        <div className="user-email">
          <span className="user-name">{currentUser?.displayName || 'User Name'}</span>
        </div>
      </div>

      <ul className="mobile-sidebar-menu">
        <li onClick={() => handleNavigation('/')}>Home</li>
        <li onClick={() => handleNavigation('/profile')}>Profile (Detailed)</li>
        <li className="menu-header">Open Packs</li>
        <li className="menu-item menu-item--secondary" onClick={() => handleSetLinkClick('sv7')}>
          Stellar Crown <span className="gradient-text">NEW</span> 
        </li>
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
        <li onClick={() => handleNavigation('/settings')}>
          <FaCog /> Settings
        </li>
        <li onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </li>
      </ul>
    </div>
  );
};

export default MobileSidebar;
