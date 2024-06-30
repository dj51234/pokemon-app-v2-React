import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import logo from '../assets/logo.png';
import '../styles/Header.css';
import { AuthContext } from '../App';
import { auth } from '../js/firebase';
import Sidebar from './Sidebar';
import HamburgerMenuSidebar from './HamburgerMenuSidebar';
import { isLightColor } from '../utils/colorUtils';

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
      const textColor = isLightColor(profileColor) ? 'black' : 'white';
      return (
        <div className="nav-default-image-wrapper" onClick={() => setSidebarOpen(true)}>
          <div className="nav-default-image nav-profile-image" style={{ backgroundColor: profileColor, color: textColor }}>
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
            <img src={logo} alt="Pokemon logo" />
          </Link>
        </div>
        <nav>
          {!currentUser && (
            <>
              <ul className="nav-links">
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/login">Login</Link></li>
                {location.pathname !== '/pokedex' && (
                  <li><Link to="/pokedex">Browse Cards</Link></li>
                )}
              </ul>
              <div className="hamburger" onClick={toggleHamburgerMenu}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </>
          )}
          {currentUser && getProfileImage()}
        </nav>
      </header>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={setSidebarOpen} handleLogout={handleLogout} />
      <HamburgerMenuSidebar isOpen={hamburgerSidebarOpen} toggleSidebar={setHamburgerSidebarOpen} />
    </div>
  );
};

export default Header;
