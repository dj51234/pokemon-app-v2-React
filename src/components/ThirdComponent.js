import React, { useState } from 'react';
import '../styles/ThirdComponent.css';

const CARDS_PER_PAGE = 12; // Number of cards to display per page

const ThirdComponent = ({ show, revealedCards, onBack }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(revealedCards.length / CARDS_PER_PAGE);

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 0 ? prevPage - 1 : totalPages - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage < totalPages - 1 ? prevPage + 1 : 0));
  };

  // Reverse the order of revealedCards
  const reversedCards = [...revealedCards].reverse();

  const currentCards = reversedCards.slice(currentPage * CARDS_PER_PAGE, (currentPage + 1) * CARDS_PER_PAGE);

  return (
    <div className={`third-component ${show ? 'show' : ''}`}>
      <div className="third-component-content">
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

export default ThirdComponent;
