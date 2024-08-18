import React, { useState, useEffect } from 'react';
import ProfileHeader from './ProfileHeader';
import MobileHeader from './MobileHeader';
import NormalCard from './NormalCard';
import SkeletonSetItem from './SkeletonSetItem'; // Import SkeletonSetItem
import '../styles/UserBinder.css';
import defaultImage from '../assets/default-image.png';
import { fetchUserSets } from '../js/api';
import { isRare } from './Overlay'; // Import isRare from Overlay

const UserBinder = ({ binderCards = [] }) => {
  const [sets, setSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [cardsToDisplay, setCardsToDisplay] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imgsLoaded, setImgsLoaded] = useState(false);
  const [loadingSets, setLoadingSets] = useState(true); // Track loading state for sets
  const [cardTally, setCardTally] = useState({ userCount: 0, totalCount: 0 }); // Track card tally

  useEffect(() => {
    const fetchSets = async () => {
      setLoadingSets(true);
      const fetchedSets = await fetchUserSets(binderCards);
      setSets(fetchedSets);
      setLoadingSets(false);
    };

    fetchSets();
  }, [binderCards]);

  useEffect(() => {
    const loadImage = (imageUrl) => {
      return new Promise((resolve, reject) => {
        const loadImg = new Image();
        loadImg.src = imageUrl;
        loadImg.onload = () => resolve(imageUrl);
        loadImg.onerror = (err) => reject(err);
      });
    };

    const fetchCardsForSet = async () => {
      setLoading(true);
      let cards = [];

      if (selectedSet === null || selectedSet === 'viewAll') {
        // View All: Show all cards
        cards = binderCards;
      } else {
        // Filter cards for the selected set
        cards = binderCards.filter(card => card.setId === selectedSet);
      }

      // Sort cards so that rare cards are at the top
      cards.sort((a, b) => {
        const isRareA = isRare(a.rarity);
        const isRareB = isRare(b.rarity);

        if (isRareA && !isRareB) {
          return -1;
        } else if (!isRareA && isRareB) {
          return 1;
        } else {
          return 0;
        }
      });

      // Calculate the user's card count for the selected set
      const userCardCount = cards.length;
      const totalCount = sets.find(set => set.id === selectedSet)?.totalCount || 0;
      setCardTally({ userCount: userCardCount, totalCount });

      try {
        // Preload all images
        await Promise.all(cards.map(card => loadImage(card.imageUrl)));
        setImgsLoaded(true);
      } catch (err) {
        console.log('Failed to load images', err);
      }

      setCardsToDisplay(cards);
      setLoading(false);
    };

    if (selectedSet) {
      fetchCardsForSet();
    }
  }, [selectedSet, binderCards, sets]);

  const handleSetClick = (setId) => {
    setSelectedSet(setId === null ? 'viewAll' : setId);
    setImgsLoaded(false); // Reset image loading state when switching sets
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
              {loadingSets ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonSetItem key={index} />
                ))
              ) : (
                sets.map((set) => (
                  <div
                    key={set.id}
                    className="set-card"
                    onClick={() => handleSetClick(set.id)}
                  >
                    <img src={set.logo} alt={set.name} className="set-logo" />
                  </div>
                ))
              )}
            </div>
            {selectedSet !== null && (
              <>
                <h1>
                  Cards ({cardTally.userCount} of {cardTally.totalCount})
                </h1>
                {loading || !imgsLoaded ? (
                  <p>Loading images...</p>
                ) : (
                  <div className="binder-grid">
                    {cardsToDisplay.map((card, index) => (
                      <NormalCard
                        key={`${card.id}-${index}`} // Ensure unique keys using index
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
                        count={card.count} 
                      />
                    ))}
                    {cardsToDisplay.length === 0 && <p>No cards available in this set</p>}
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
