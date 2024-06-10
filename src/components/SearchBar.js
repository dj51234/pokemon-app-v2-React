import React, { useRef, useEffect } from 'react';
import '../styles/SearchBar.css';

const SearchBar = ({ handleBackToSets, setSearchTerm, series, setSelectedSeries, viewMode, handleReleaseDateSortChange, searchBy, handleToggleSearchBy, handleSearch }) => {
  const inputRef = useRef(null);

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

  return (
    <div className="search-wrapper">
      <div id="search-container">
        <div id="search-group">
          <select id="search-by-dropdown" value={searchBy} onChange={e => handleToggleSearchBy(e.target.value)}>
            <option value="set">Sets</option>
            <option value="pokemon">Pokémon</option>
          </select>
          <div className="search-input-container">
            <input
              type="search"
              id="search-bar"
              placeholder={`Search by ${searchBy === 'set' ? 'Set' : 'Pokémon'}`}
              onChange={e => {
                setSearchTerm(e.target.value);
                if (searchBy === 'set') {
                  // Trigger set search on input change
                  setSearchTerm(e.target.value);
                }
              }}
              onKeyDown={handleKeyDown} // Replace onKeyPress with onKeyDown
              ref={inputRef} // Add ref here
            />
            {searchBy === 'pokemon' && (
              <button onClick={handleSearch} className="search-button">Search</button>
            )}
          </div>
        </div>
        {searchBy === 'set' && (
          <>
            <select id="sort-options" defaultValue="" onChange={handleReleaseDateSortChange}>
              <option value="" disabled>Release Date</option>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
            <select id="series-options" defaultValue="" onChange={setSelectedSeries}>
              <option value="" disabled>Filter By Series</option>
              <option value="all">All Series</option>
              {series.map((series, index) => <option key={index} value={series}>{series}</option>)}
            </select>
          </>
        )}
        {searchBy === 'set' && viewMode === 'cards' && (
          <button onClick={handleBackToSets} className='back-button'>Back to Sets</button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
