// src/components/SearchBar.js
import React, { useRef, useEffect, useState } from 'react';
import '../styles/SearchBar.css';

const SearchBar = ({
  handleBackToSets,
  setSearchTerm,
  series,
  setSelectedSeries,
  viewMode,
  handleReleaseDateSortChange,
  searchBy,
  handleToggleSearchBy,
  handleSearch,
  sortSets,
  isAuthenticated
}) => {
  const inputRef = useRef(null);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && searchBy === 'pokemon') {
      handleSearch();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
      setSearchTerm('');
    }
  }, [searchBy, setSearchTerm]);

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
      <div id="search-container" className={`search-container ${isAuthenticated ? 'search-container--profile' : ''}`}>
        <div id="search-group">
          <select
            id="search-by-dropdown"
            value={searchBy}
            onChange={(e) => handleToggleSearchBy(e.target.value)}
          >
            <option value="set">Sets</option>
            <option value="pokemon">Pokémon</option>
          </select>
          <div className="search-input-container">
            <input
              type="search"
              id="search-bar"
              placeholder={`Search by ${searchBy === 'set' ? 'Set' : 'Pokémon'}`}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (searchBy === 'set') {
                  setSearchTerm(e.target.value);
                }
              }}
              onKeyDown={handleKeyDown}
              ref={inputRef}
            />
            {searchBy === 'pokemon' && (
              <button onClick={handleSearch} className="search-button">
                Search
              </button>
            )}
            {searchBy === 'set' && screenWidth <= 1200 && (
              <button onClick={toggleDropdown} className="search-button">
                Filters
              </button>
            )}
          </div>
        </div>
        {searchBy === 'set' && screenWidth >= 1200 && (
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
        {searchBy === 'set' && viewMode === 'cards' && (
          <button onClick={handleBackToSets} className="back-button">
            Back to Sets
          </button>
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

export default SearchBar;
