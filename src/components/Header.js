import React from 'react';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = ({ secondary }) => (
  <div className={`header-wrap ${secondary ? 'header-wrap--secondary' : ''}`}>
    <header>
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Pokemon logo" />
        </Link>
      </div>
      <nav>
        <ul>
          <li><a href="#">Sign Up</a></li>
          <li><a href="#">Login</a></li>
          <li><Link to={secondary ? "/" : "/pokedex"}>{secondary ? 'Go Back' : 'Browse Cards'}</Link></li>
        </ul>
      </nav>
    </header>
  </div>
);

export default Header;