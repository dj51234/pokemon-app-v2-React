import React, { useState, useEffect } from 'react';
import '../styles/DemoBinder.css';

const getCardsPerPage = (width) => {
  if (width <= 480) return 1;
  if (width <= 788) return 2;
  if (width <= 1200) return 4;
  return 12;
};

const DemoBinder = ({ show, revealedCards, onBack }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(getCardsPerPage(window.innerWidth));

  useEffect(() => {
    const handleResize = () => {
      setCardsPerPage(getCardsPerPage(window.innerWidth));
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const totalPages = Math.ceil(revealedCards.length / cardsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 0 ? prevPage - 1 : totalPages - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage < totalPages - 1 ? prevPage + 1 : 0));
  };

  // Reverse the order of revealedCards
  const reversedCards = [...revealedCards].reverse();

  const currentCards = reversedCards.slice(currentPage * cardsPerPage, (currentPage + 1) * cardsPerPage);

  return (
    <div className={`demo-binder ${show ? 'show' : ''}`}>
      <div className="demo-binder-content">
        <h2>Step 3: Build Your Binder</h2>
        <div className="carousel">
          <button className="carousel-button" onClick={handlePrevPage}>{"<"}</button>
          <div className="card-grid">
            {currentCards.map((card, index) => (
              <div key={index} className="card-item">
                <img src={card.image} alt="Card" />
              </div>
            ))}
          </div>
          <button className="carousel-button" onClick={handleNextPage}>{">"}</button>
        </div>
        <button className="back-button" onClick={onBack}>Back to Pack Opening</button>
      </div>
    </div>
  );
};

export default DemoBinder;
