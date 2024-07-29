// src/js/pack_algorithm/packAlgorithm.js
import pokemon from 'pokemontcgsdk';
import allSetDataJson from './allSetData.json';

pokemon.configure({ apiKey: process.env.REACT_APP_API_KEY });

// Function to get random cards from an array
function getRandomCards(array, count) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Function to fetch individual card data by ID
async function fetchCardData(cardId) {
  try {
    const card = await pokemon.card.find(cardId);
    return card;
  } catch (error) {
    console.error(`Error fetching data for card ID ${cardId}:`, error);
  }
}

// Function to simulate opening a pack
export async function openPack(setId) {
  try {
    if (allSetDataJson[setId]) {
      const setData = allSetDataJson[setId];
      
      let finalSelectedCards = [];

      if (setData.common && setData.uncommon) {
        const selectedcommonCards = getRandomCards(setData.common, 6).map(id => ({
          id,
          rarity: 'common'
        }));
        const selecteduncommonCards = getRandomCards(setData.uncommon, 3).map(id => ({
          id,
          rarity: 'uncommon'
        }));

        const remainingRarities = Object.keys(setData).filter(
          (rarity) => rarity !== 'common' && rarity !== 'uncommon'
        );

        const selectedRarity = remainingRarities[Math.floor(Math.random() * remainingRarities.length)];
        const selectedRareCard = getRandomCards(setData[selectedRarity], 1).map(id => ({
          id,
          rarity: selectedRarity
        }))[0];

        finalSelectedCards = [
          ...selectedcommonCards,
          ...selecteduncommonCards,
          selectedRareCard
        ];
      } else {
        const allCards = Object.values(setData).flat();
        finalSelectedCards = getRandomCards(allCards, 10).map(id => {
          const rarity = Object.keys(setData).find(rarity => setData[rarity].includes(id));
          return { id, rarity: rarity || 'unknown' };
        });
      }

      const cardsWithDetails = await Promise.all(
        finalSelectedCards.map(async (card) => {
          const cardData = await fetchCardData(card.id);
          if (cardData) {
            return { 
              ...card, 
              imageUrl: cardData.images.large, 
              subtypes: cardData.subtypes,
              setId: cardData.set.id,
              supertypes: cardData.supertype,
              type: cardData.types ? cardData.types[0] : 'unknown',
            };
          }
          return card;
        })
      );

      // Log rarity and image URLs to the console
      cardsWithDetails.forEach(card => {
        console.log(`Card ID: ${card.id}, Rarity: ${card.rarity}, Image URL: ${card.imageUrl}`);
      });

      return cardsWithDetails.filter(card => card.imageUrl); // Ensure to return only cards with image URLs
    } else {
      console.error(`Set ID ${setId} not found in the JSON data.`);
      return [];
    }
  } catch (error) {
    console.error(`Error opening pack for set ID ${setId}:`, error);
    return [];
  }
}
