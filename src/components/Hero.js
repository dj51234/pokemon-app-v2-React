import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './Header'
import NormalCard from './NormalCard'

import ParticlesBackground from './ParticlesBackground'
import '../styles/Hero.css'
import pikachu from '../assets/card-test-1.png' // Replace with your back image path

const Hero = () => {
  const navigate = useNavigate()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageSrc, setImageSrc] = useState('')

  useEffect(() => {
    const img = new Image()
    img.src = pikachu
    img.onload = () => {
      setImageSrc(pikachu)
      setImageLoaded(true)
    }
    img.onerror = () => console.error('Image failed to load.')
  }, [])

  const handleStartCollection = (e) => {
    e.preventDefault()
    navigate('/pokedex')
  }

  const handleNextPage = () => {
    navigate('/pokedex') // Navigate to Pokedex
  }

  return (
    <div className="main-container">
      <Header />
      <ParticlesBackground />
      <main className="hero-grid">
        <section className="hero-text">
          <h2>
            Discover the True Value:{' '}
            <span className="gradient-text">Smarter Pokémon Card</span>{' '}
            Collecting!
          </h2>
          <p>
            Build your dream deck while calculating the profit/risk ratio of
            opening real packs versus buying cards outright. Track the value of
            each pull to see if chasing rare finds is worth it, or if buying a
            PSA 10 is the smarter move. Explore safer options for collecting,
            and join a community dedicated to making informed decisions. Start
            your journey today!
          </p>
          <div className="hero-buttons">
            <a href="/packs/view-all" className="btn-primary">
              Open Packs
            </a>
          </div>
        </section>
        <div className="hero-card">
          <div className={`image-container ${imageLoaded ? 'loaded' : ''}`}>
            {imageSrc && (
              <NormalCard
                isFlipped={true}
                frontImage={imageSrc}
                startInteractive={true}
                heroCard={true}
              />
            )}
          </div>
        </div>
      </main>
      <div className="arrow" onClick={handleNextPage}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  )
}

export default Hero
