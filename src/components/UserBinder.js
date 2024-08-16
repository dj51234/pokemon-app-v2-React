import React, { useEffect, useState, useRef, useCallback } from 'react';
import ProfileHeader from './ProfileHeader';
import MobileHeader from './MobileHeader';
import NormalCard from './NormalCard';
import '../styles/UserBinder.css';
import defaultImage from '../assets/default-image.png';
import { fetchUserSets } from '../js/api';

const CHUNK_SIZE = 20; // Number of cards to load per batch

const UserBinder = ({ binderCards = [] }) => {
  const [sets, setSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [cardsToDisplay, setCardsToDisplay] = useState([]);
  const [displayedCards, setDisplayedCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allCardsLoaded, setAllCardsLoaded] = useState(false);
  const observer = useRef();

  useEffect(() => {
    const fetchSets = async () => {
      const fetchedSets = await fetchUserSets(binderCards);
      setSets(fetchedSets);
    };

    fetchSets();
  }, [binderCards]);

  useEffect(() => {
    const fetchCardsForSet = () => {
      setLoading(true);
      let cards = [];
      if (selectedSet === null) {
        // View All: Show all cards
        cards = binderCards;
      } else if (selectedSet === 'viewAll') {
        // View All: Show all cards
        cards = binderCards;
      } else {
        // Filter cards for the selected set
        cards = binderCards.filter(card => card.setId === selectedSet);
      }
      setCardsToDisplay(cards);
      setDisplayedCards([]);
      setAllCardsLoaded(false); // Reset the allCardsLoaded state
      setLoading(false);
    };

    fetchCardsForSet();
  }, [selectedSet, binderCards]);

  const loadMoreCards = useCallback(() => {
    if (loading || allCardsLoaded) return;

    const nextChunk = cardsToDisplay.slice(displayedCards.length, displayedCards.length + CHUNK_SIZE);

    if (nextChunk.length === 0) {
      setAllCardsLoaded(true); // No more cards to load
      return;
    }

    setDisplayedCards(prevDisplayedCards => [
      ...prevDisplayedCards,
      ...nextChunk
    ]);
  }, [cardsToDisplay, displayedCards.length, allCardsLoaded, loading]);

  const lastCardElementRef = useCallback(node => {
    if (loading || allCardsLoaded) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        loadMoreCards();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, allCardsLoaded, loadMoreCards]);

  useEffect(() => {
    loadMoreCards(); // Load the first chunk of cards
  }, [cardsToDisplay, loadMoreCards]);

  const handleSetClick = (setId) => {
    setSelectedSet(setId === null ? 'viewAll' : setId);
  };

  return (
    <>
      <ProfileHeader />
      <MobileHeader />

      <div className="binder-page">
        <div className="binder-container">
          <div className="binder-content">
            <h1>My Binder</h1>
            <div className="sets-container">
              {sets.map((set) => (
                <div
                  key={set.id}
                  className="set-card"
                  onClick={() => handleSetClick(set.id)}
                >
                  <img src={set.logo} alt={set.name} className="set-logo" />
                </div>
              ))}
            </div>
            {selectedSet !== null && (
              <>
                <h1>Cards</h1>
                {loading && displayedCards.length === 0 ? (
                  <p>Loading cards...</p>
                ) : (
                  <div className="binder-grid">
                    {displayedCards.map((card, index) => (
                      <NormalCard
                        key={card.id}
                        id={card.id}
                        isFlipped={true}
                        frontImage={card.imageUrl}
                        backImage={defaultImage}
                        rarity={card.rarity}
                        subtypes={card.subtypes}
                        setId={card.setId}
                        supertypes={card.supertypes}
                        startInteractive={true}
                        zIndex={10}
                        applyBoxShadow={false}
                        isTopCard={true}
                        heroCard={true}
                        ref={index === displayedCards.length - 1 ? lastCardElementRef : null}
                      />
                    ))}
                    {allCardsLoaded && displayedCards.length === 0 && <p>No cards available in this set</p>}
                  </div>
                )}
              </>
            )}
            {selectedSet === null && <p>Select a set to view the cards</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserBinder;
