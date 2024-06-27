import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Tilt from 'react-parallax-tilt';
import { AuthContext } from '../App';
import ParticlesBackground from './ParticlesBackground';
import '../styles/Hero.css';

const Hero = () => {
  const { currentUser, profileColor } = useContext(AuthContext);
  const navigate = useNavigate();

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
      <main>
        <section className="hero-text">
          <h2>Experience the <span>Magic of Pokémon</span> Card Pack Openings Online!</h2>
          <p>Open, Collect, and Trade Pokémon cards with fans worldwide. Join our community and relive the excitement! Dive into the nostalgia of opening packs and discovering rare finds. Participate in events and challenges to showcase your collection. Become a part of a thriving community of Pokémon enthusiasts. Your adventure awaits—start collecting today!</p>
          <div className="hero-buttons">
            <a href="/" onClick={handleStartCollection}>Start Your Collection</a>
            <a href="/">Learn More</a>
          </div>
        </section>
        <section className="hero-image">
          <Tilt tiltMaxAngleX={20} tiltMaxAngleY={20} transitionSpeed={1500}>
            <div className="pokemon-card secret-rare">
              <img src="https://images.pokemontcg.io/sv6/25_hires.png" alt="" style={{ visibility: 'hidden' }} />
            </div>
          </Tilt>
        </section>
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
