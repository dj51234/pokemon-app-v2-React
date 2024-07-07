import React, { useEffect, useState, useRef } from 'react';
import Header from '../components/Header';
import SetsSearchBar from '../components/SetsSearchBar';
import Footer from '../components/Footer';
import { fetchSetData } from '../js/api';
import '../styles/OpenPacksPage.css';
import loadingGif from '../assets/loading-gif.gif';
import AnimatedGridItem from '../components/AnimatedGridItem';
import Overlay from '../components/Overlay';

const OpenPacksPage = () => {
  const [sets, setSets] = useState([]);
  const [displayedSets, setDisplayedSets] = useState([]);
  const [series, setSeries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const gridRef = useRef(null);

  useEffect(() => {
    fetchSetData()
      .then(data => {
        const filteredData = data.filter(set => !['mcd14', 'mcd15', 'mcd17', 'mcd18'].includes(set.id));
        const sortedData = filteredData.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
        setSets(sortedData);
        setDisplayedSets(sortedData);
        setSeries([...new Set(sortedData.map(set => set.series))]);
        setIsLoading(false);
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    let filteredSets = sets;
    if (selectedSeries !== 'all') {
      filteredSets = filteredSets.filter(set => set.series === selectedSeries);
    }
    if (searchTerm) {
      filteredSets = filteredSets.filter(set => set.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setDisplayedSets(filteredSets);
  }, [searchTerm, selectedSeries, sets]);

  const handleSetClick = (id) => {
    setActiveId(id);
  };

  const handleClose = () => {
    setActiveId(null);
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
              <div className="open-packs-page-grid" ref={gridRef}>
                {seriesSets[seriesName].map((set) => (
                  <AnimatedGridItem
                    key={set.id}
                    set={set}
                    id={set.id}
                    isActive={activeId === set.id}
                    onClick={handleSetClick}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      <Overlay onClose={handleClose} isVisible={activeId !== null} />
      <div className="footer-secondary">
        <Footer />
      </div>
    </div>
  );
};

export default OpenPacksPage;