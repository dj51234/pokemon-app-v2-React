// SearchBar.js
import React, { useState } from 'react';
import '../styles/SearchBar.css';

const SearchBar = ({ handleBackToSets, setSearchTerm, series, setSelectedSeries, viewMode, handleReleaseDateSortChange }) => {
  const [searchBy, setSearchBy] = useState('set');

  const handleToggleSearchBy = (value) => {
    setSearchBy(value);
    setSearchTerm(''); // Clear search term when toggling search by
  };

  return (
    <div className="search-wrapper">
      <div id="search-container">
        <div id="search-group">
          <select id="search-by-dropdown" value={searchBy} onChange={e => handleToggleSearchBy(e.target.value)}>
            <option value="set">Sets</option>
            <option value="pokemon">Pokémon</option>
          </select>
          <input type="search" id="search-bar" placeholder={`Search by ${searchBy === 'set' ? 'Set' : 'Pokémon'}`} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        {searchBy === 'set' && (
          <>
            <select id="sort-options" defaultValue="" onChange={handleReleaseDateSortChange}>
              <option value="" disabled>Release Date</option>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
            <select id="series-options" defaultValue="" onChange={e => setSelectedSeries(e.target.value)}>
              <option value="" disabled>Filter By Series</option>
              <option value="all">All Series</option>
              {series.map((series, index) => <option key={index} value={series}>{series}</option>)}
            </select>
          </>
        )}
        {viewMode === 'cards' && (
          <button onClick={handleBackToSets} className='back-button'>Back to Sets</button>
        )}
      </div>
    </div>
  );
};


export default SearchBar;

