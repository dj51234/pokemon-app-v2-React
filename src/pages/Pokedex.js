import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import Grid from '../components/Grid';
import Footer from '../components/Footer';
import loadingGif from '../assets/loading-gif.gif';
import { fetchSetData, fetchCardData, fetchRandomPokemonCards, fetchPokemonCardsByName, fetchAllPokemonNames } from '../js/api';
import leven from 'leven';
import '../styles/Grid.css';

const PokedexPage = () => {
  const [sets, setSets] = useState([]);
  const [originalSets, setOriginalSets] = useState([]);
  const [series, setSeries] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedSets, setDisplayedSets] = useState([]);
  const [viewMode, setViewMode] = useState('sets'); // 'sets' or 'cards'
  const [selectedSet, setSelectedSet] = useState(null);
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isLoadingSets, setIsLoadingSets] = useState(true); // Loading state for sets
  const [releaseDateSortOrder, setReleaseDateSortOrder] = useState('');
  const [searchBy, setSearchBy] = useState('set'); // 'set' or 'pokemon'
  const [noResults, setNoResults] = useState(false); // No results state
  const [suggestedPokemon, setSuggestedPokemon] = useState([]); // Suggested Pokémon names
  const [pokemonNames, setPokemonNames] = useState([]); // List of all Pokémon names

  useEffect(() => {
    fetchSetData().then(data => {
      const filteredData = data.filter(set => !['mcd14', 'mcd15', 'mcd17', 'mcd18'].includes(set.id));
      const updatedData = filteredData.map(set => ({
        ...set,
        cardIDs: Array.from({ length: set.printedTotal }, (_, i) => `${set.id}-${i + 1}`)
      }));
      setSets(updatedData);
      setOriginalSets(updatedData); // Save original sets data
      setSeries([...new Set(updatedData.map(set => set.series))]);
      setIsLoadingSets(false); // Set loading state for sets to false
    }).catch(error => {
      console.error(error);
      setIsLoadingSets(false); // Set loading state for sets to false even if there's an error
    });

    const fetchNames = async () => {
      try {
        const names = await fetchAllPokemonNames();
        if (names.length > 0) {
          setPokemonNames(names);
          console.log('Fetched Pokémon names:', names); // Log the fetched names
        } else {
          console.error('No Pokémon names fetched');
        }
      } catch (error) {
        console.error('Error fetching all Pokémon names:', error);
      }
    };

    fetchNames();
  }, []); // Run only once when the component mounts

  useEffect(() => {
    if (searchBy === 'set') {
      let filteredSets = sets;
      if (selectedSeries !== 'all') {
        filteredSets = filteredSets.filter(set => set.series === selectedSeries);
      }
      setDisplayedSets(filteredSets);
    }
  }, [sets, selectedSeries, searchBy]);

  useEffect(() => {
    if (searchBy === 'set') {
      const filteredSets = sets.filter(set => set.name.toLowerCase().includes(searchTerm.toLowerCase()));
      setDisplayedSets(filteredSets);
    }
  }, [searchTerm, sets, searchBy]);

  const sortSets = (order) => {
    const sortedSets = [...sets];
    sortedSets.sort((a, b) => {
      const dateA = new Date(a.releaseDate);
      const dateB = new Date(b.releaseDate);
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setSets(sortedSets);
  };

  const handleReleaseDateSortChange = (e) => {
    const order = e.target.value;
    setReleaseDateSortOrder(order);
    sortSets(order);
    // Set the view mode back to 'sets'
    setViewMode('sets');
  };

  const handleSeriesChange = (e) => {
    setSelectedSeries(e.target.value);
    // Set the view mode back to 'sets'
    setViewMode('sets');
    setCards([]);
  };

  const findBestMatches = (term, limit = 1) => {
    if (!pokemonNames.length) {
      console.error('Pokémon names list is empty.');
      return [];
    }

    const matches = pokemonNames.map(name => ({
      name,
      distance: leven(term.toLowerCase(), name.toLowerCase())
    }));

    matches.sort((a, b) => a.distance - b.distance);

    return matches.slice(0, limit).map(match => match.name);
  };

  const handleSearch = async (term = searchTerm) => {
    if (searchBy === 'pokemon') {
      setIsLoading(true);
      try {
        let cardData = await fetchPokemonCardsByName(term);
        // Filter out cards from the excluded sets
        cardData = cardData.filter(card => !['mcd14', 'mcd15', 'mcd17', 'mcd18'].includes(card.set.id));
        setCards(cardData);
        setViewMode('cards');
        setIsLoading(false);
        setNoResults(cardData.length === 0);
        if (cardData.length === 0) {
          const bestMatches = findBestMatches(term);
          setSuggestedPokemon(bestMatches);
        }
      } catch (error) {
        console.error('Error fetching Pokémon cards:', error);
        setIsLoading(false);
        setNoResults(true);
        const bestMatches = findBestMatches(term);
        setSuggestedPokemon(bestMatches);
      }
    }
  };

  const handleSetClick = async (set) => {
    setIsLoading(true); // Set loading state
    const cardData = await fetchCardData(set.cardIDs);
    setCards(cardData);
    setSelectedSet(set);
    setViewMode('cards');
    setIsLoading(false); // Turn off loading state after fetching card data
  };

  const handleBackToSets = () => {
    setViewMode('sets');
    setSelectedSet(null);
    setCards([]);
  };

  const handleToggleSearchBy = async (value) => {
    setSearchBy(value);
    setSearchTerm(''); // Clear search term when toggling search by
    setNoResults(false); // Clear no results state
    setSuggestedPokemon([]); // Clear suggested Pokémon
    if (value === 'pokemon') {
      setIsLoading(true);
      const randomPokemonCards = await fetchRandomPokemonCards();
      setCards(randomPokemonCards);
      setViewMode('cards');
      setIsLoading(false);
    } else {
      setViewMode('sets');
      setCards([]);
    }
  };

  const handleSuggestedPokemonClick = (name) => {
    setSearchTerm(name);
    handleSearch(name);
  };

  return (
    <div className="container">
      <Header secondary />
      <div className="content">
        <SearchBar
          sortSets={sortSets}
          series={series}
          setSelectedSeries={handleSeriesChange}
          setSearchTerm={setSearchTerm}
          handleBackToSets={handleBackToSets}
          viewMode={viewMode}
          handleReleaseDateSortChange={handleReleaseDateSortChange}
          searchBy={searchBy}
          handleToggleSearchBy={handleToggleSearchBy}
          handleSearch={() => handleSearch(searchTerm)}
        />
        {isLoading || isLoadingSets ? ( // Conditional rendering for loading state
          <div className="loading-container">
            <img src={loadingGif} alt="Loading..." />
          </div>
        ) : (
          <>
            {noResults ? (
              <div className="no-results">
                No Pokémon found
                {suggestedPokemon.length > 0 && (
                  <div>
                    Did you mean 
                    {suggestedPokemon.map((name, index) => (
                      <span
                        key={index}
                        onClick={() => handleSuggestedPokemonClick(name)}
                        style={{ cursor: 'pointer', color: 'blue', marginLeft: '5px', fontWeight: 500}}
                      >
                        {name}
                        {index < suggestedPokemon.length - 1 ? ',' : ''}
                      </span>
                    ))}
                    ?
                  </div>
                )}
              </div>
            ) : (
              <Grid
                sets={displayedSets}
                viewMode={viewMode}
                cards={cards}
                onSetClick={handleSetClick}
              />
            )}
          </>
        )}
      </div>
      <div className="footer-secondary">
        <Footer />
      </div>
    </div>
  );
};

export default PokedexPage;
