import React from 'react';
import Header from './Header';
import Tilt from 'react-parallax-tilt';
import '../styles/Hero.css';

const Hero = () => {
  return (
    <div className="main-container">
      <Header />
      <main>
        <section className="hero-text">
          <h2>Experience the <span>Magic of Pokémon</span> Card Pack Openings Online!</h2>
          <p>Open, Collect, and Trade Pokémon cards with fans worldwide. Join our community and relive the excitement! Dive into the nostalgia of opening packs and discovering rare finds. Participate in events and challenges to showcase your collection. Become a part of a thriving community of Pokémon enthusiasts. Your adventure awaits—start collecting today!</p>
          <div className="hero-buttons">
            <a href="/">Start Your Collection</a>
            <a href="/">Learn More</a>
          </div>
        </section>
        <section className="hero-image">
            <Tilt tiltMaxAngleX={20} tiltMaxAngleY={20} transitionSpeed={1500}>
                <div className="pokemon-card">
                        <img src="https://images.pokemontcg.io/sv6/25_hires.png" alt="" style={{ visibility: 'hidden' }} />
                </div>
            </Tilt>
        </section>
      </main>
    </div>
  );
};

export default Hero;

