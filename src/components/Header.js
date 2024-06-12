import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import logo from '../assets/logo.png';
import defaultProfileImage from '../assets/game.png';
import '../styles/Header.css';
import { AuthContext } from '../App';
import { auth } from '../js/firebase';

const Header = ({ secondary }) => {
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

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
                <img
                  src={defaultProfileImage}
                  alt="Profile"
                  className="profile-image"
                  onClick={toggleDropdown}
                />
                {dropdownVisible && (
                  <div className="dropdown-menu">
                    <Link to="/profile">My Profile</Link>
                    <Link to="/pokedex">Browse Cards</Link>
                    <Link to="/my-binder">My Binder</Link>
                    <Link to="/open-packs">Open Packs</Link>
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
