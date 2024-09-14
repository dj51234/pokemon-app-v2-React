import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import MobileSidebar from './MobileSidebar';
import '../styles/MobileHeader.css';
import { AuthContext } from '../App';

const MobileHeader = ({ toggleMessagesSidebar }) => {
  const { currentUser } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMessagesIconClick = () => {
    if (typeof toggleMessagesSidebar === 'function') {
      toggleMessagesSidebar();
    }
  };

  if (!currentUser) return null;

  const isMessagesPage = location.pathname === '/messages';

  return (
    <div className="mobile-header">
      <Link to="/" className="mobileheader-mobile--logo">
        <h2><span className='gradient-text'>MASTERSET</span></h2>
      </Link>
      <div className="mobile-header-icons">
        {isMessagesPage && (
          <button className="messages-icon" onClick={handleMessagesIconClick}>
            <MessageSquare size={32} />
          </button>
        )}
        <div
          className={`profile-hamburger-menu ${isSidebarOpen ? 'open' : ''}`}
          onClick={toggleSidebar}
        >
          <div className="bar top-bar"></div>
          <div className="bar middle-bar"></div>
          <div className="bar bottom-bar"></div>
        </div>
      </div>
      <MobileSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </div>
  );
};

export default MobileHeader;