//  src/js/api.js
import pokemon from 'pokemontcgsdk';

pokemon.configure({ apiKey: process.env.REACT_APP_API_KEY });

export async function fetchSetData() {
  try {
    const response = await pokemon.set.all();
    return response;
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function fetchCardData(cardIDs) {
  try {
    const cardData = await Promise.all(cardIDs.map(id => pokemon.card.find(id)));
    return cardData;
  } catch (error) {
    console.error('Error:', error);
  }
}

async function fetchSetLength(setCode) {
  try {
    const setDetails = await pokemon.set.find(setCode);
    return setDetails.printedTotal;
  } catch (error) {
    console.error('Error fetching set details:', error);
    throw error;
  }
}

export async function fetchRandomPokemonCards() {
  try {
    const setCode = 'sv6'; // Set code for Twilight Masquerade set
    const numberOfCards = 10; // Number of random cards to fetch

    // Fetch the length of the set
    const totalCards = await fetchSetLength(setCode);

    // Generate random numbers based on the total number of cards in the set
    const randomCardNumbers = Array.from({ length: numberOfCards }, () => Math.floor(Math.random() * totalCards) + 1);
    // Fetch card data for each random card number
    const randomCardData = await Promise.all(randomCardNumbers.map(number => pokemon.card.find(`${setCode}-${number}`)));
    return randomCardData;
  } catch (error) {
    console.error('Error fetching random Pokémon cards:', error);
    throw error;
  }
}

export async function fetchPokemonCardsByName(name) {
  try {
    const response = await pokemon.card.where({ q: `name:${name}` });
    return response.data;
  } catch (error) {
    console.error('Error fetching Pokémon cards by name:', error);
    throw error;
  }
}

export async function fetchAllPokemonNames() {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10000');
    const data = await response.json();
    const names = data.results.map(pokemon => pokemon.name);
    console.log('All Pokémon names:', names);
    return names;
  } catch (error) {
    console.error('Error fetching Pokémon names from PokeAPI:', error);
    return [];
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// New function for fetching sets for the PackSelection component
export async function fetchSetsForPackSelection() {
  try {
    const twilightMasqueradeId = 'sv6'; // Twilight Masquerade set ID
    const popularSetIds = ['base1', 'neo1', 'gym1']; // Example popular set IDs

    // Fetch Twilight Masquerade set
    const twilightMasquerade = await pokemon.set.find(twilightMasqueradeId);

    // Fetch popular sets
    const popularSets = await Promise.all(popularSetIds.map(id => pokemon.set.find(id)));

    const sets = [twilightMasquerade, ...popularSets].map(set => ({
      name: set.name,
      id: set.id,
      logo: set.images.logo,
      releaseDate: set.releaseDate
    }));

    return sets;
  } catch (error) {
    console.error('Error fetching sets for pack selection:', error);
    return [];
  }
}
