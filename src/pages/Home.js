// src/pages/Home.js
import React, { useState } from 'react';
import Hero from '../components/Hero';
import PackSelection from '../components/PackSelection';
import PackOpening from '../components/PackOpening';
import ThirdComponent from '../components/ThirdComponent';
import '../styles/Home.css';

const Home = () => {
  const [showPackOpening, setShowPackOpening] = useState(false);
  const [randomCards, setRandomCards] = useState([]);

  const handlePackSelect = (setId) => {
    console.log(`Selected pack: ${setId}`);
    setShowPackOpening(true);
  };

  const handleFetchCards = (cards) => {
    setRandomCards(cards);
  };

  const handleBack = () => {
    setShowPackOpening(false);
  };

  return (
    <div className="app">
      <Hero />
      <div className="main-container">
        <PackSelection onSelect={handlePackSelect} show={showPackOpening} onFetchCards={handleFetchCards} />
        <PackOpening onBack={handleBack} show={showPackOpening} randomCards={randomCards} />
        <ThirdComponent show={false} />
      </div>
    </div>
  );
};

export default Home;
