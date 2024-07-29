import React, { useEffect, useState, useRef, useCallback } from 'react';
import Header from '../components/Header';
import SetsSearchBar from '../components/SetsSearchBar';
import Footer from '../components/Footer';
import Overlay from '../components/Overlay';
import { fetchSetData } from '../js/api'; // Import fetchSetData function
import { openPack } from '../js/pack_algorithm/packAlgorithm'; // Import openPack function
import '../styles/OpenPacksPage.css';
import loadingGif from '../assets/loading-gif.gif';

const CHUNK_SIZE = 10; // Number of sets to load at a time

const OpenPacksPage = () => {
  const [sets, setSets] = useState([]);
  const [displayedSets, setDisplayedSets] = useState([]);
  const [currentChunk, setCurrentChunk] = useState(0); // Track the current chunk
  const [series, setSeries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSetId, setSelectedSetId] = useState(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [openedCards, setOpenedCards] = useState([]);
  const observer = useRef();

  useEffect(() => {
    fetchSetData()
      .then((data) => {
        const filteredData = data.filter(
          (set) => !['mcd14', 'mcd15', 'mcd17', 'mcd18'].includes(set.id)
        );
        const sortedData = filteredData.sort(
          (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)
        );
        setSets(sortedData);
        setSeries([...new Set(sortedData.map((set) => set.series))]);
        setDisplayedSets(sortedData.slice(0, CHUNK_SIZE)); // Load the initial chunk
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    let filteredSets = sets;
    if (selectedSeries !== 'all') {
      filteredSets = filteredSets.filter((set) => set.series === selectedSeries);
    }
    if (searchTerm) {
      filteredSets = filteredSets.filter((set) =>
        set.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setDisplayedSets(filteredSets.slice(0, (currentChunk + 1) * CHUNK_SIZE));
  }, [searchTerm, selectedSeries, sets, currentChunk]);

  const handleSetClick = async (setId) => {
    console.log(`Set ID: ${setId}`);
    setSelectedSetId(setId);
    const cards = await openPack(setId); // Call openPack with the selected set ID
    console.log(cards); // Log the fetched cards to the console
    setOpenedCards(cards);
    setIsOverlayVisible(true); // Show the overlay
  };

  const closeOverlay = () => {
    setIsOverlayVisible(false); // Hide the overlay
  };

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
    sortSets(order);
  };

  const handleSeriesChange = (e) => {
    setSelectedSeries(e.target.value);
  };

  const groupSetsBySeries = (sets) => {
    const seriesMap = sets.reduce((acc, set) => {
      if (!acc[set.series]) {
        acc[set.series] = [];
      }
      acc[set.series].push(set);
      return acc;
    }, {});
    return seriesMap;
  };

  const seriesSets = groupSetsBySeries(displayedSets);

  const loadMoreSets = useCallback(() => {
    setCurrentChunk((prevChunk) => prevChunk + 1);
  }, []);

  const lastSetElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMoreSets();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, loadMoreSets]
  );

  return (
    <div>
      <Header secondary />
      <SetsSearchBar
        setSearchTerm={setSearchTerm}
        series={series}
        setSelectedSeries={handleSeriesChange}
        handleReleaseDateSortChange={handleReleaseDateSortChange}
        sortSets={sortSets}
      />
      <div className="open-packs-page">
        {isLoading ? (
          <div className="loading">
            <img src={loadingGif} alt="Loading..." />
          </div>
        ) : (
          Object.keys(seriesSets).map((seriesName) => (
            <div className="open-packs-page-container" key={seriesName}>
              <h2 className="series-title">{seriesName}</h2>
              <div className="open-packs-page-grid">
                {seriesSets[seriesName].map((set, index) => {
                  if (index === seriesSets[seriesName].length - 1) {
                    return (
                      <div
                        key={set.id}
                        ref={lastSetElementRef}
                        className="open-packs-page-grid-item"
                        onClick={() => handleSetClick(set.id)}
                      >
                        <img
                          src={set.images.logo}
                          className="logo"
                          alt={`${set.name} logo`}
                        />
                        <div className="set-info">
                          <img
                            src={set.images.symbol}
                            className="symbol"
                            alt={`${set.name} symbol`}
                          />
                          <h2>{set.name}</h2>
                        </div>
                        <p>Release date: {set.releaseDate}</p>
                        <p>ID: {set.id}</p>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={set.id}
                        className="open-packs-page-grid-item"
                        onClick={() => handleSetClick(set.id)}
                      >
                        <img
                          src={set.images.logo}
                          className="logo"
                          alt={`${set.name} logo`}
                        />
                        <div className="set-info">
                          <img
                            src={set.images.symbol}
                            className="symbol"
                            alt={`${set.name} symbol`}
                          />
                          <h2>{set.name}</h2>
                        </div>
                        <p>Release date: {set.releaseDate}</p>
                        <p>ID: {set.id}</p>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          ))
        )}
      </div>
      {isOverlayVisible && <Overlay onClose={closeOverlay} cards={openedCards} />}
      <div className="footer-secondary">
        <Footer />
      </div>
    </div>
  );
};

export default OpenPacksPage;
