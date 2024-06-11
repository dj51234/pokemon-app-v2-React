import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../styles/Header.css';

const Header = ({ secondary }) => {
  const location = useLocation();

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
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
            {location.pathname !== '/pokedex' && (
              <li><Link to="/pokedex">Browse Cards</Link></li>
            )}
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Header;
