import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import NormalCard from './NormalCard';
import { AuthContext } from '../App';
import ParticlesBackground from './ParticlesBackground';
import '../styles/Hero.css';
import pikachu from '../assets/card-front.png'; // Replace with your back image path

const Hero = () => {
  const { currentUser, profileColor } = useContext(AuthContext);
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    const img = new Image();
    img.src = pikachu;
    img.onload = () => {
      setImageSrc(pikachu);
      setImageLoaded(true);
    };
    img.onerror = () => console.error("Image failed to load.");
  }, []);

  const handleStartCollection = (e) => {
    e.preventDefault();
    if (currentUser) {
      navigate('/profile');
    } else {
      navigate('/register');
    }
  };

  const handleNextPage = () => {
    navigate('/next-page'); // Adjust this to navigate to the next desired page or section
  };

  return (
    <div className="main-container">
      <Header />
      <ParticlesBackground />
      <main className="hero-grid">
        <section className="hero-text">
          <h2>Experience the <span className='gradient-text'>Magic of Pokémon</span> Card Pack Openings Online!</h2>
          <p>Open, Collect, and Trade Pokémon cards with fans worldwide. Join our community and relive the excitement! Dive into the nostalgia of opening packs and discovering rare finds. Participate in events and challenges to showcase your collection. Become a part of a thriving community of Pokémon enthusiasts. Your adventure awaits—start collecting today!</p>
          <div className="hero-buttons">
            <a href="/" className='btn-primary' onClick={handleStartCollection}>Start Your Collection</a>
            <a href="/" className='btn-primary'>Learn More</a>
          </div>
        </section>
        <div className="hero-card">
          <div className={`image-container ${imageLoaded ? 'loaded' : ''}`}>
            {imageSrc && (
              <NormalCard isFlipped={true} frontImage={imageSrc} startInteractive={true} heroCard={true} />
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
  );
};

export default Hero;
