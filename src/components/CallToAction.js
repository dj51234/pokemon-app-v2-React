import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/CallToAction.css'

const CallToAction = () => {
  const navigate = useNavigate()

  const handleCallToAction = (e) => {
    e.preventDefault()
    navigate('/pokedex')
  }

  return (
    <div className="call-to-action">
      <h1>Let's Get Started</h1>
      <a href="/pokedex" onClick={handleCallToAction}>
        Browse Cards
      </a>
    </div>
  )
}

export default CallToAction
