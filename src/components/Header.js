// src/components/Header.js
import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import logo from '../assets/logo.png';
import '../styles/Header.css';
import { AuthContext } from '../App';
import { auth } from '../js/firebase';

const Header = ({ username, secondary }) => {
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();
  const [initial, setInitial] = useState('');

  useEffect(() => {
    if (currentUser && currentUser.displayName) {
      setInitial(currentUser.displayName.charAt(0).toUpperCase());
    } else if (username) {
      setInitial(username.charAt(0).toUpperCase());
    }
  }, [currentUser, username]);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

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
        <div className="nav-profile-image-wrapper">
          <img src={currentUser.photoURL} alt="Profile" className="nav-profile-image" onClick={toggleDropdown} />
        </div>
      );
    }
    if (currentUser || username) {
      return (
        <div className="nav-default-image-wrapper">
          <div className="nav-default-image nav-profile-image" onClick={toggleDropdown}>
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
            {currentUser && (
              <div className="profile-dropdown">
                {getProfileImage()}
                {dropdownVisible && (
                  <div className="dropdown-menu">
                    <Link to="/profile">My Profile</Link>
                    <Link to="/my-binder">My Binder</Link>
                    <Link to="/open-packs">Open Packs</Link>
                    <Link to="/pokedex">Browse Cards</Link>
                    <Link to="/trade">Trade</Link>
                    <Link to="/settings">Settings</Link>
                    <a href="#logout" onClick={handleLogout}>Logout</a>
                  </div>
                )}
              </div>
            )}
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Header;
