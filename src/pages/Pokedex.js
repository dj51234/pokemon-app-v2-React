// Pokedex.js
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import Grid from '../components/Grid';
import Footer from '../components/Footer';
import loadingGif from '../assets/loading-gif.gif';
import { fetchSetData, fetchCardData} from '../js/api';
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
  const [releaseDateSortOrder, setReleaseDateSortOrder] = useState('');
  

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

  useEffect(() => {
    fetchSetData().then(data => {
      const updatedData = data.map(set => ({
        ...set,
        cardIDs: Array.from({ length: set.printedTotal }, (_, i) => `${set.id}-${i + 1}`)
      }));
      setSets(updatedData);
      setOriginalSets(updatedData); // Save original sets data
      setSeries([...new Set(updatedData.map(set => set.series))]);
    }).catch(error => {
      console.error(error);
    });
  }, []); // Run only once when the component mounts


  useEffect(() => {
    let filteredSets = sets;
    if (selectedSeries !== 'all') {
      filteredSets = filteredSets.filter(set => set.series === selectedSeries);
    }
    setDisplayedSets(filteredSets);
  }, [sets, selectedSeries]);

  useEffect(() => {
    const filteredSets = sets.filter(set => set.name.toLowerCase().includes(searchTerm.toLowerCase()));
    setDisplayedSets(filteredSets);
  }, [searchTerm, sets]);

  useEffect(() => {
    if (viewMode === 'cards') {
      setViewMode('sets'); // Change view mode back to sets when interacting with search bar or dropdowns
      setCards([]); // Clear the cards
    }
  }, [searchTerm, selectedSeries]); // Listen for changes in searchTerm and selectedSeries

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

  return (
    <div>
      <Header secondary />
      <SearchBar
        sortSets={sortSets}
        series={series}
        setSelectedSeries={setSelectedSeries}
        setSearchTerm={setSearchTerm}
        handleBackToSets={handleBackToSets}
        viewMode={viewMode}
        handleReleaseDateSortChange={handleReleaseDateSortChange}
      />
      {isLoading ? ( // Conditional rendering for loading state
        <img src={loadingGif} className='loading' alt="Loading" />
      ) : (
        <>
          <Grid
            sets={displayedSets}
            viewMode={viewMode}
            cards={cards}
            onSetClick={handleSetClick}
          />
          <Footer />
        </>
      )}
    </div>
  );
};

export default PokedexPage;