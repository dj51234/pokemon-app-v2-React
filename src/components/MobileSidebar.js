// File: /src/components/MobileSidebar.js

import React from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { FaTimes } from 'react-icons/fa'
import '../styles/MobileSidebar.css'

const MobileSidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleNavigation = (path) => {
    navigate(path)
    toggleSidebar()
  }

  const handleSetLinkClick = (setId) => {
    if (location.pathname === '/packs/view-all') {
      const event = new CustomEvent('openPackOverlay', { detail: { setId } })
      window.dispatchEvent(event)
    } else {
      navigate(`/packs/view-all?setId=${setId}`)
      toggleSidebar()
    }
  }

  return (
    <div className={`mobile-header-sidebar ${isOpen ? 'open' : 'closed'}`}>
      {location.pathname === '/' && (
        <button className="close-btn" onClick={() => toggleSidebar(false)}>
          <FaTimes />
        </button>
      )}

      <ul className="mobile-sidebar-menu">
        <li onClick={() => handleNavigation('/')}>Home</li>
        <li className="menu-header">Open Packs</li>
        <li
          className="menu-item menu-item--secondary"
          onClick={() => handleSetLinkClick('sv7')}
        >
          Stellar Crown <span className="gradient-text">NEW</span>
        </li>
        <li
          className="menu-item menu-item--secondary"
          onClick={() => handleSetLinkClick('sv6pt5')}
        >
          Shrouded Fable <span className="gradient-text">NEW</span>
        </li>
        <li
          className="menu-item menu-item--secondary"
          onClick={() => handleSetLinkClick('sv6')}
        >
          Twilight Masquerade
        </li>
        <li
          className="menu-item menu-item--secondary"
          onClick={() => handleSetLinkClick('sv5')}
        >
          Temporal Forces
        </li>
        <li
          className="menu-item menu-item--secondary"
          onClick={() => handleSetLinkClick('sv4pt5')}
        >
          Paldean Fates
        </li>
        <li
          className="menu-item menu-item--secondary"
          onClick={() => handleSetLinkClick('sv4')}
        >
          Paradox Rift
        </li>
        <li className="menu-item menu-item--secondary">
          <Link to="/packs/view-all">View All</Link>
        </li>
        <li onClick={() => handleNavigation('/pokedex')}>Browse All Sets</li>
      </ul>
    </div>
  )
}

export default MobileSidebar
