// src/components/SetsSearchBar.js
import React, { useRef, useEffect, useState } from 'react';
import '../styles/SearchBar.css';

const SetsSearchBar = ({
  setSearchTerm,
  series,
  setSelectedSeries,
  handleReleaseDateSortChange,
  sortSets,
}) => {
  const inputRef = useRef(null);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setSearchTerm(event.target.value);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
      setSearchTerm('');
    }
  }, [setSearchTerm]);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleSortOptionClick = (order) => {
    sortSets(order);
    setDropdownVisible(false);
  };

  const handleSeriesOptionClick = (series) => {
    setSelectedSeries({ target: { value: series } });
    setDropdownVisible(false);
  };

  return (
    <div className="search-wrapper">
      <div id="search-container" className='search-container--profile'>
        <div id="search-group">
          <div className="search-input-container">
            <input
              type="search"
              id="search-bar"
              placeholder="Search by Set"
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              ref={inputRef}
            />
            {screenWidth <= 1200 && (
              <button onClick={toggleDropdown} className="search-button">
                Filters
              </button>
            )}
          </div>
        </div>
        {screenWidth >= 1200 && (
          <>
            <select
              id="sort-options"
              defaultValue=""
              onChange={handleReleaseDateSortChange}
            >
              <option value="" disabled>
                Release Date
              </option>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
            <select
              id="series-options"
              defaultValue=""
              onChange={setSelectedSeries}
            >
              <option value="" disabled>
                Filter By Series
              </option>
              <option value="all">All Series</option>
              {series.map((series, index) => (
                <option key={index} value={series}>
                  {series}
                </option>
              ))}
            </select>
          </>
        )}
      </div>
      <div className={`dropdown-menu ${dropdownVisible ? 'visible' : ''}`}>
        <div className="dropdown-category">Search by Date</div>
        <div className="dropdown-item" onClick={() => handleSortOptionClick('asc')}>Ascending Release Date</div>
        <div className="dropdown-item" onClick={() => handleSortOptionClick('desc')}>Descending Release Date</div>
        <div className="dropdown-category">Search By Series</div>
        {series.map((seriesItem, index) => (
          <div key={index} className="dropdown-item" onClick={() => handleSeriesOptionClick(seriesItem)}>
            {seriesItem}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SetsSearchBar;
