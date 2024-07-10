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
async function openPack(setId) {
  if (allSetDataJson[setId]) {
    const setData = allSetDataJson[setId];
    
    let finalSelectedCards = [];

    if (setData.Common && setData.Uncommon) {
      // Get random cards from each array
      const selectedCommonCards = getRandomCards(setData.Common, 6).map(id => ({
        id,
        rarity: 'Common'
      }));
      const selectedUncommonCards = getRandomCards(setData.Uncommon, 3).map(id => ({
        id,
        rarity: 'Uncommon'
      }));

      // Probability distribution: 30% chance for Rare Holo, 70% chance for Rare
      const isRareHolo = Math.random() < 0.3;
      const rareOrHoloRarity = isRareHolo ? 'Rare Holo' : 'Rare';
      
      let selectedRareCard;
      if (setData[rareOrHoloRarity]) {
        selectedRareCard = getRandomCards(setData[rareOrHoloRarity], 1).map(id => ({
          id,
          rarity: rareOrHoloRarity
        }))[0];
      } else {
        // Fallback to Rare if Rare Holo is not available
        selectedRareCard = getRandomCards(setData.Rare, 1).map(id => ({
          id,
          rarity: 'Rare'
        }))[0];
      }

      // Combine all selected cards into one array
      finalSelectedCards = [
        ...selectedCommonCards,
        ...selectedUncommonCards,
        selectedRareCard
      ];
    } else {
      // If there are no "Common" or "Uncommon" rarities, pull 10 random cards from available rarities
      const allCards = Object.values(setData).flat();
      finalSelectedCards = getRandomCards(allCards, 10).map(id => {
        // Determine the rarity of the card
        const rarity = Object.keys(setData).find(rarity => setData[rarity].includes(id));
        return { id, rarity: rarity || 'Unknown' };
      });
    }

    // Fetch image URLs for each selected card
    const cardsWithImages = await Promise.all(
      finalSelectedCards.map(async (card) => {
        const cardData = await fetchCardData(card.id);
        return { ...card, imageUrl: cardData.images.large };
      })
    );

    // Log the selected cards with their rarities and image URLs
    cardsWithImages.forEach(card => {
      console.log(`Rarity: ${card.rarity}, Image URL: ${card.imageUrl}`);
    });
  } else {
    console.error(`Set ID ${setId} not found in the JSON data.`);
  }
}

// Call the function to open a pack for testing
openPack('base1');
