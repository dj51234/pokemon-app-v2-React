import pokemon from 'pokemontcgsdk';

pokemon.configure({ apiKey: process.env.REACT_APP_API_KEY });

// Function to fetch and categorize cards by rarity
async function fetchSetDetails(setCode) {
  try {
    const cards = await pokemon.card.where({ q: `set.id:${setCode}`, pageSize: 250 });
    const cardRarities = {
      Common: [],
      Uncommon: [],
      Rare: [],
      RareHolo: [], // Corrected the rarity name to "Rare Holo"
    };

    cards.data.forEach(card => {
      const cardId = `${setCode}-${card.number}`;
      if (card.rarity === 'Common') cardRarities.Common.push({ id: cardId, rarity: 'Common' });
      if (card.rarity === 'Uncommon') cardRarities.Uncommon.push({ id: cardId, rarity: 'Uncommon' });
      if (card.rarity === 'Rare') cardRarities.Rare.push({ id: cardId, rarity: 'Rare' });
      if (card.rarity === 'Rare Holo') cardRarities.RareHolo.push({ id: cardId, rarity: 'Rare Holo' });
    });

    return cardRarities;
  } catch (error) {
    console.error('Error fetching set details:', error);
    throw error;
  }
}

// Function to get a random card from an array
function getRandomCard(cards) {
  const randomIndex = Math.floor(Math.random() * cards.length);
  return cards[randomIndex];
}

// Utility function to fetch card data by IDs
async function fetchCardData(cardIDs) {
  try {
    const ids = cardIDs.map(card => card.id);
    console.log('Fetching card data for IDs:', ids); // Log card IDs
    const cardData = await Promise.all(ids.map(id => pokemon.card.find(id)));
    return cardData;
  } catch (error) {
    console.error('Error fetching card data:', error);
    throw error;
  }
}

// Simulate opening a Base Set pack
async function openBaseSetPack() {
  try {
    const setCode = 'base1'; // Base Set code
    const cardRarities = await fetchSetDetails(setCode);

    const pack = [];

    // Add 1 Rare Holo or Rare card
    if (Math.random() < 1 / 3) {
      pack.push(getRandomCard(cardRarities.RareHolo));
    } else {
      pack.push(getRandomCard(cardRarities.Rare));
    }

    // Add 3 Uncommon cards
    for (let i = 0; i < 3; i++) {
      pack.push(getRandomCard(cardRarities.Uncommon));
    }

    // Add 6 Common cards
    for (let i = 0; i < 6; i++) {
      pack.push(getRandomCard(cardRarities.Common));
    }

    // Log card ID and rarity
    const packDetails = pack.map(card => ({ id: card.id, rarity: card.rarity }));
    console.log('Opened pack (ID and rarity):', packDetails); // Log the card ID and rarity

    const cardData = await fetchCardData(pack);
    return cardData;
  } catch (error) {
    console.error('Error opening pack:', error);
    throw error;
  }
}

// Call the function for testing
openBaseSetPack();

export { openBaseSetPack, fetchSetDetails, getRandomCard, fetchCardData };
