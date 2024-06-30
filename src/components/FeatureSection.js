import React from 'react';
import '../styles/FeatureSection.css';
import image1 from '../assets/bullbasaur.png';
import image2 from '../assets/squirtle.png';
import image3 from '../assets/charmander.png';

const FeatureSection = () => {
  return (
    <div className="feature-section">
      <div className="feature">
        <img src={image1} alt="Bulbasaur" />
        <h2>Realistic Pull Rates</h2>
        <p>Discover and select from a variety of card packs to start your journey.</p>
      </div>
      <div className="feature">
        <img src={image2} alt="Squirtle" />
        <h2>Unique Pack Opening Experience</h2>
        <p>Open your selected pack and reveal the cards inside with engaging animations.</p>
      </div>
      <div className="feature">
        <img src={image3} alt="Charmander" />
        <h2>Trade Cards With Others</h2>
        <p>Build your binder with the revealed cards and manage your collection.</p>
      </div>
    </div>
  );
};

export default FeatureSection;
