import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import logo from '../assets/logo.png';
import '../styles/Header.css';
import { AuthContext } from '../App';
import { auth } from '../js/firebase';
import Sidebar from './Sidebar';

const Header = ({ username, secondary }) => {
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [initial, setInitial] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && currentUser.displayName) {
      setInitial(currentUser.displayName.charAt(0).toUpperCase());
    } else if (username) {
      setInitial(username.charAt(0).toUpperCase());
    }
  }, [currentUser, username]);

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
    if (currentUser || username) {
      return (
        <div className="nav-default-image-wrapper" onClick={() => setSidebarOpen(true)}>
          <div className="nav-default-image nav-profile-image">
            {initial}
          </div>
        </div>
      );
    }
    return null;
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
          <ul>
            {!currentUser && <li><Link to="/register">Register</Link></li>}
            {!currentUser && <li><Link to="/login">Login</Link></li>}
            {!currentUser && location.pathname !== '/pokedex' && (
              <li><Link to="/pokedex">Browse Cards</Link></li>
            )}
            {currentUser && getProfileImage()}
          </ul>
        </nav>
      </header>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={setSidebarOpen} handleLogout={handleLogout} />
    </div>
  );
};

export default Header;
