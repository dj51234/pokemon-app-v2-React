import React, { useState } from 'react';
import Hero from '../components/Hero';
import PackSelection from '../components/PackSelection';
import PackOpening from '../components/PackOpening';
import ThirdComponent from '../components/ThirdComponent';
import '../styles/Home.css';

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [randomCards, setRandomCards] = useState([]);

  const handlePackSelect = (setId) => {
    console.log(`Selected pack: ${setId}`);
  };

  const handleFetchCards = (cards) => {
    setRandomCards(cards);
  };

  const handleBack = () => {
    setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    setCurrentIndex(currentIndex + 1);
  };

  return (
    <div className="app">
      <Hero />
      <div className="carousel-container" style={{ transform: `translateX(-${currentIndex * 100}vw)` }}>
        <PackSelection onSelect={handlePackSelect} show={currentIndex === 0} onFetchCards={handleFetchCards} onNext={handleNext} />
        <PackOpening onBack={handleBack} show={currentIndex === 1} randomCards={randomCards} onNext={handleNext} />
        <ThirdComponent show={currentIndex === 2} onBack={handleBack} />
      </div>
    </div>
  );
};

export default Home;
