// File: /src/components/MobileHeader.js

import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import MobileSidebar from './MobileSidebar';
import '../styles/MobileHeader.css';
import { AuthContext } from '../App';

const MobileHeader = () => {
  const { currentUser } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!currentUser) return null;

  return (
    <div className="mobile-header">
      <Link to="/" className="mobileheader-mobile--logo">
        <h2><span className='gradient-text'>MASTERSET</span></h2>
      </Link>
      <div 
        className={`profile-hamburger-menu ${isSidebarOpen ? 'open' : ''}`} 
        onClick={toggleSidebar}
      >
        <div className="bar top-bar"></div>
        <div className="bar middle-bar"></div>
        <div className="bar bottom-bar"></div>
      </div>
      <MobileSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </div>
  );
};

export default MobileHeader;
