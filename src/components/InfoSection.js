import React, { useEffect, useRef } from 'react';
import bulbasaur from '../assets/bullbasaur.png';
import charmander from '../assets/charmander.png';
import squirtle from '../assets/squirtle.png';
import '../styles/InfoSection.css';

const InfoSection = () => {
  const infoRef = useRef(null);
  const leftCardRef = useRef(null);
  const rightCardRef = useRef(null);
  const centerCardRef = useRef(null);

  useEffect(() => {
    const infoSection = infoRef.current;
    const leftCard = leftCardRef.current;
    const rightCard = rightCardRef.current;

    const parallaxEffect = () => {
      const sectionTop = infoSection.offsetTop;
      const sectionHeight = infoSection.offsetHeight;
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      if (scrollY + windowHeight > sectionTop && scrollY < sectionTop + sectionHeight) {
        const progress = (scrollY + windowHeight - sectionTop) / windowHeight;
        const clampedProgress = Math.min(Math.max(progress, 0), 1);
        const moveDistance = 100 * (1 - clampedProgress);

        leftCard.style.transform = `translateX(${-moveDistance}%)`;
        rightCard.style.transform = `translateX(${moveDistance}%)`;
      } else {
        if (scrollY + windowHeight < sectionTop) {
          leftCard.style.transform = `translateX(-100%)`;
          rightCard.style.transform = `translateX(100%)`;
        } else {
          leftCard.style.transform = `translateX(0)`;
          rightCard.style.transform = `translateX(0)`;
        }
      }
    };

    window.addEventListener('scroll', parallaxEffect);
    parallaxEffect();

    return () => {
      window.removeEventListener('scroll', parallaxEffect);
    };
  }, []);

  return (
    <section className="info" ref={infoRef}>
      <h2>What Makes Us Stand Out?</h2>
      <div className="info-container">
        <div className="info-card left-card" ref={leftCardRef}>
          <img src={bulbasaur} alt="" />
          <h3>Realistic Pull Rates</h3>
          <p>Experience the thrill of opening Pokémon card packs with realistic pull rates...</p>
        </div>
        <div className="info-card center-card" ref={centerCardRef}>
          <img src={charmander} alt="" />
          <h3>Rarity Multiplier</h3>
          <p>Enhance your collection with our unique rarity multiplier system...</p>
        </div>
        <div className="info-card right-card" ref={rightCardRef}>
          <img src={squirtle} alt="" />
          <h3>Community Engagement</h3>
          <p>Join a vibrant community of Pokémon enthusiasts...</p>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;

