// src/pages/Home.js
import React, { useState } from 'react';
import Hero from '../components/Hero';
import PackSelection from '../components/PackSelection';
import PackOpening from '../components/PackOpening';
import DemoBinder from '../components/DemoBinder';
import '../styles/Home.css';

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [randomCards, setRandomCards] = useState([]);
  const [revealedCards, setRevealedCards] = useState([]);

  const handlePackSelect = (setId) => setId;

  const handleFetchCards = (cards) => setRandomCards(cards);

  const handleBack = () => setCurrentIndex(currentIndex - 1);

  const handleNext = () => setCurrentIndex(currentIndex + 1);

  const handleAddRevealedCards = (newCards) => setRevealedCards([...revealedCards, ...newCards]);

  return (
    <div className="app">
      <Hero />
      <div className="carousel-container" style={{ transform: `translateX(-${currentIndex * 100}vw)` }}>
        <PackSelection onSelect={handlePackSelect} show={currentIndex === 0} onFetchCards={handleFetchCards} onNext={handleNext} />
        <PackOpening onBack={handleBack} show={currentIndex === 1} randomCards={randomCards} onNext={handleNext} addRevealedCards={handleAddRevealedCards} />
        <DemoBinder show={currentIndex === 2} revealedCards={revealedCards} onBack={handleBack} />
      </div>

    </div>
  );
};

export default Home;
