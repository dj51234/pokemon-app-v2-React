// src/components/Header.js
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../styles/Header.css'
import HamburgerMenuSidebar from './HamburgerMenuSidebar'

const Header = ({ secondary }) => {
  const location = useLocation()
  const [hamburgerSidebarOpen, setHamburgerSidebarOpen] = useState(false)

  const toggleHamburgerMenu = () => {
    setHamburgerSidebarOpen(!hamburgerSidebarOpen)
  }

  return (
    <div className={`header-wrap ${secondary ? 'header-wrap--secondary' : ''}`}>
      <header>
        <div className="logo">
          <Link to="/">
            <h2>
              <span className="gradient-text">MASTERSET</span>
            </h2>
          </Link>
        </div>
        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/packs/view-all" className="btn-primary">
                Open Packs
              </Link>
            </li>
          </ul>
          <div className="hamburger" onClick={toggleHamburgerMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </nav>
      </header>
      <HamburgerMenuSidebar
        isOpen={hamburgerSidebarOpen}
        toggleSidebar={setHamburgerSidebarOpen}
      />
    </div>
  )
}

export default Header
