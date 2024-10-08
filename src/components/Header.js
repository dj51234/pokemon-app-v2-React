// src/components/Header.js
import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import '../styles/Header.css';
import { AuthContext } from '../App';
import { auth } from '../js/firebase';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import HamburgerMenuSidebar from './HamburgerMenuSidebar';

const Header = ({ secondary }) => {
  const location = useLocation();
  const { currentUser, profileColor } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hamburgerSidebarOpen, setHamburgerSidebarOpen] = useState(false);
  const [initial, setInitial] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && currentUser.displayName) {
      setInitial(currentUser.displayName.charAt(0).toUpperCase());
    }
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getProfileImage = () => {
    if (currentUser && currentUser.photoURL) {
      return (
        <div className="nav-profile-image-wrapper" onClick={() => setSidebarOpen(true)}>
          <img src={currentUser.photoURL} alt="Profile" className="nav-profile-image" />
        </div>
      );
    }
    if (currentUser) {
      return (
        <div className="nav-default-image-wrapper" onClick={() => setSidebarOpen(true)}>
          <div className="nav-default-image nav-profile-image gradient-background">
            {initial}
          </div>
        </div>
      );
    }
    return null;
  };

  const toggleHamburgerMenu = () => {
    setHamburgerSidebarOpen(!hamburgerSidebarOpen);
  };

  return (
    <div className={`header-wrap ${secondary ? 'header-wrap--secondary' : ''}`}>
      <header>
        <div className="logo">
          <Link to="/">
            <h2><span className='gradient-text'>MASTERSET</span></h2>
          </Link>
        </div>
        <nav>
          {!currentUser ? (
            <>
              <ul className="nav-links">
                <li><Link to="/register" className='gradient-btn'>Register</Link></li>
                <li><Link to="/login" className='btn-primary'>Login</Link></li>
                {location.pathname !== '/pokedex' && (
                  <li><Link to="/pokedex" className='btn-primary'>Browse Cards</Link></li>
                )}
              </ul>
              <div className="hamburger" onClick={toggleHamburgerMenu}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </>
          ) : (
            getProfileImage()
          )}
        </nav>
      </header>
      {!currentUser ? (
        <Sidebar 
          isOpen={sidebarOpen} 
          toggleSidebar={setSidebarOpen} 
          handleLogout={handleLogout} 
          showCloseButton={location.pathname === '/'}
        />
      ) : (
        <MobileSidebar isOpen={sidebarOpen} toggleSidebar={setSidebarOpen} />
      )}
      <HamburgerMenuSidebar isOpen={hamburgerSidebarOpen} toggleSidebar={setHamburgerSidebarOpen} />
    </div>
  );
};

export default Header;
