// src/pages/Pokedex.js

import React, { useEffect, useState, useContext } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import Grid from '../components/Grid';
import Footer from '../components/Footer';
import SkeletonGridItem from '../components/SkeletonGridItem'; // Import SkeletonGridItem
import {
  fetchSetData,
  fetchCardData,
  fetchPokemonCardsByName,
  fetchAllPokemonNames,
  fetchRandomPokemonCardsForPokedex,
} from '../js/api';
import leven from 'leven';
import '../styles/Grid.css';
import { AuthContext } from '../App';
import allSetData from '../js/pack_algorithm/allSetData.json';

const PokedexPage = () => {
  const { profileColor } = useContext(AuthContext);
  const [sets, setSets] = useState([]);
  const [originalSets, setOriginalSets] = useState([]);
  const [series, setSeries] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedSets, setDisplayedSets] = useState([]);
  const [viewMode, setViewMode] = useState('sets');
  const [selectedSet, setSelectedSet] = useState(null);
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSets, setIsLoadingSets] = useState(true);
  const [releaseDateSortOrder, setReleaseDateSortOrder] = useState('asc');
  const [searchBy, setSearchBy] = useState('set');
  const [noResults, setNoResults] = useState(false);
  const [suggestedPokemon, setSuggestedPokemon] = useState([]);
  const [pokemonNames, setPokemonNames] = useState([]);

  useEffect(() => {
    fetchSetData()
      .then((data) => {
        const filteredData = data.filter(
          (set) => !['mcd14', 'mcd15', 'mcd17', 'mcd18'].includes(set.id)
        );
        const sortedData = filteredData.sort(
          (a, b) => new Date(a.releaseDate) - new Date(b.releaseDate)
        );

        setSets(sortedData);
        setOriginalSets(sortedData);
        setSeries([...new Set(sortedData.map((set) => set.series))]);
        setIsLoadingSets(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoadingSets(false);
      });

    const fetchNames = async () => {
      try {
        const names = await fetchAllPokemonNames();
        setPokemonNames(names);
      } catch (error) {
        console.error('Error fetching all Pokémon names:', error);
      }
    };

    fetchNames();
  }, []);

  useEffect(() => {
    if (searchBy === 'set') {
      let filteredSets = sets;
      if (selectedSeries !== 'all') {
        filteredSets = filteredSets.filter((set) => set.series === selectedSeries);
      }
      setDisplayedSets(filteredSets);
    }
  }, [sets, selectedSeries, searchBy]);

  useEffect(() => {
    if (searchBy === 'set') {
      const filteredSets = sets.filter((set) =>
        set.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setDisplayedSets(filteredSets);
    }
  }, [searchTerm, sets, searchBy]);

  useEffect(() => {
    if (viewMode === 'sets') {
      setCards([]);
    }
  }, [viewMode]);

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
    setViewMode('sets');
    setCards([]);
  };

  const handleSeriesChange = (e) => {
    setSelectedSeries(e.target.value);
    setViewMode('sets');
    setCards([]);
  };

  const specialCases = {
    farfetchd: "farfetch'd",
    sirfetchd: "sirfetch'd",
    'ho oh': 'ho-oh',
    'mr mime': 'mr. mime',
    'mime jr': 'mime jr.',
    porygon2: 'porygon2',
    porygonz: 'porygon-z',
    'type null': 'type: null',
    'nidoran f': 'nidoran♀',
    'nidoran m': 'nidoran♂',
    'wo chien': 'wo-chien',
    'chi yu': 'chi-yu',
    'chien pao': 'chien-pao',
    'ting lu': 'ting-lu',
  };

  const normalizeName = (name) => {
    const lowerCaseName = name.toLowerCase().replace(/\s+/g, '');
    return specialCases[lowerCaseName] || name;
  };

  const findBestMatches = (term, limit = 1) => {
    if (!pokemonNames.length) {
      console.error('Pokémon names list is empty.');
      return [];
    }

    const matches = pokemonNames.map((name) => ({
      name,
      distance: leven(term.toLowerCase(), name.toLowerCase()),
    }));

    matches.sort((a, b) => a.distance - b.distance);

    return matches.slice(0, limit).map((match) => match.name);
  };

  const handleSearch = async (term = searchTerm) => {
    if (searchBy === 'pokemon') {
      setIsLoading(true);
      try {
        const normalizedTerm = normalizeName(term);
        const specialSearchTerm = specialCases[normalizedTerm] || term;
        let cardData = await fetchPokemonCardsByName(specialSearchTerm);
        cardData = cardData.filter(
          (card) => !['mcd14', 'mcd15', 'mcd17', 'mcd18'].includes(card.set.id)
        );
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
    setIsLoading(true);

    const setCardData = allSetData[set.id];
    if (!setCardData) {
      console.error(`Set ID ${set.id} not found in JSON data.`);
      setIsLoading(false);
      return;
    }

    const cardIDs = Object.values(setCardData).flat();
    console.log(`Fetching card data for set ${set.id}:`, cardIDs);

    const cardData = await fetchCardData(cardIDs);
    setCards(cardData);
    setSelectedSet(set);
    setViewMode('cards');
    setIsLoading(false);
  };

  const handleBackToSets = () => {
    setViewMode('sets');
    setSelectedSet(null);
    setCards([]);
  };

  const handleToggleSearchBy = async (value) => {
    setSearchBy(value);
    setSearchTerm('');
    setNoResults(false);
    setSuggestedPokemon([]);
    setCards([]);
    if (value === 'pokemon') {
      setIsLoading(true);
      const randomPokemonCards = await fetchRandomPokemonCardsForPokedex(5);
      setCards(randomPokemonCards);
      setIsLoading(false);
    } else {
      setCards([]);
    }
    setViewMode(value === 'pokemon' ? 'cards' : 'sets');
  };

  const handleSuggestedPokemonClick = (name) => {
    const normalizedName = normalizeName(name);
    setSearchTerm(normalizedName);
    handleSearch(normalizedName);
  };

  const groupSetsBySeries = (sets) => {
    return sets.reduce((acc, set) => {
      if (!acc[set.series]) {
        acc[set.series] = [];
      }
      acc[set.series].push(set);
      return acc;
    }, {});
  };

  const seriesSets = groupSetsBySeries(displayedSets);

  return (
    <div className="container">
      <Header secondary />
      <div className="content" style={{ background: '#080B12' }}>
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
        {isLoading || isLoadingSets ? (
          <>
            <div className="series-title-placeholder"></div>
            <div id="grid" className="sets-grid">
              {Array.from({ length: 10 }).map((_, index) => (
                <SkeletonGridItem key={index} />
              ))}
            </div>
          </>
        ) : viewMode === 'sets' ? (
          Object.keys(seriesSets).map((seriesName) => (
            <div key={seriesName}>
              <h2 className="series-title-main">{seriesName}</h2>
              <Grid
                sets={seriesSets[seriesName]}
                viewMode={viewMode}
                onSetClick={handleSetClick}
              />
            </div>
          ))
        ) : noResults ? (
          <div className="no-results">
            No Pokémon found
            {suggestedPokemon.length > 0 && (
              <div>
                Did you mean
                {suggestedPokemon.map((name, index) => (
                  <span
                    key={index}
                    onClick={() => handleSuggestedPokemonClick(name)}
                    style={{
                      cursor: 'pointer',
                      color: '#BC4CCE',
                      marginLeft: '5px',
                      fontWeight: 500,
                    }}
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
      </div>
      <Footer />
    </div>
  );
};

export default PokedexPage;
