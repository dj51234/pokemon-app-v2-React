import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import MobileSidebar from './MobileSidebar'
import '../styles/MobileHeader.css'

const MobileHeader = ({ toggleMessagesSidebar }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="mobile-header">
      <Link to="/" className="mobileheader-mobile--logo">
        <h2>
          <span className="gradient-text">MASTERSET</span>
        </h2>
      </Link>
      <div className="mobile-header-icons">
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
  )
}

export default MobileHeader
