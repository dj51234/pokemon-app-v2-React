// src/pages/Home.js
import React, { useState } from 'react';
import Hero from '../components/Hero';
import PackSelection from '../components/PackSelection';
import PackOpening from '../components/PackOpening';
import '../styles/Home.css';

const Home = () => {
  const [showPackOpening, setShowPackOpening] = useState(false);

  const handlePackSelect = (setId) => {
    console.log(`Selected pack: ${setId}`);
    setShowPackOpening(true);
  };

  const handleBack = () => {
    setShowPackOpening(false);
  };

  return (
    <div className="app">
      <Hero />
      <div className="main-container">
        <PackSelection onSelect={handlePackSelect} show={showPackOpening} />
        <PackOpening onBack={handleBack} show={showPackOpening} />
      </div>
    </div>
  );
};

export default Home;

