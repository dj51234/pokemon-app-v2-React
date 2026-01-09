import React, { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { fetchSetData } from '../js/api'
import '../styles/ProfileHeader.css'

const ProfileHeader = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [latestSets, setLatestSets] = useState([])

  useEffect(() => {
    fetchSetData().then((data) => {
      const filteredData = data.filter(
        (set) =>
          !['mcd14', 'mcd15', 'mcd17', 'mcd18', 'sv3pt5'].includes(set.id) // Filter promos and special sets as needed
      )
      const sortedData = filteredData.sort(
        (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)
      )
      setLatestSets(sortedData.slice(0, 6))
    })
  }, [])

  const handleNavigation = (path) => {
    navigate(path)
  }

  const handleSetLinkClick = (setId) => {
    if (location.pathname === '/packs/view-all') {
      const event = new CustomEvent('openPackOverlay', { detail: { setId } })
      window.dispatchEvent(event)
    } else {
      navigate(`/packs/view-all?setId=${setId}`)
    }
  }

  return (
    <div className="profile-header-sidebar">
      <Link to="/" className="logo">
        <div className="logo">
          <h2>
            <span className="gradient-text">MASTERSET</span>
          </h2>
        </div>
      </Link>

      <ul className="sidebar-menu">
        <li onClick={() => handleNavigation('/')}>Home</li>
        <li className="menu-header">Open Packs</li>
        {latestSets.map((set, index) => (
          <li
            key={set.id}
            className="menu-item menu-item--secondary"
            onClick={() => handleSetLinkClick(set.id)}
          >
            {set.name}{' '}
            {index === 0 && <span className="gradient-text">NEW</span>}
          </li>
        ))}
        <li className="menu-item menu-item--secondary">
          <Link to="/packs/view-all">View All</Link>
        </li>
        <li onClick={() => handleNavigation('/pokedex')}>Browse All Sets</li>
      </ul>
    </div>
  )
}

export default ProfileHeader
