// src/js/api.js

import pokemon from 'pokemontcgsdk';
import allSetData from './pack_algorithm/allSetData.json';

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

// Removed fetchSetLength as it's no longer needed

export async function fetchRandomPokemonCards(setCode) {
  try {
    const numberOfCards = 10; // Number of random cards to fetch

    // Use allSetData.json to fetch card IDs
    const setData = allSetData[setCode];
    if (!setData) {
      console.error(`Set ID ${setCode} not found in JSON data.`);
      return [];
    }

    const allCardIds = Object.values(setData).flat();
    console.log(`Total cards in set ${setCode}:`, allCardIds.length);

    // Use a Set to ensure unique random numbers
    const uniqueCardIds = new Set();
    while (uniqueCardIds.size < numberOfCards) {
      const randomId = allCardIds[Math.floor(Math.random() * allCardIds.length)];
      uniqueCardIds.add(randomId);
      console.log(`Generated random card ID: ${randomId}, Unique IDs so far:`, [...uniqueCardIds]);
    }

    console.log('Final set of unique card IDs:', [...uniqueCardIds]);

    // Fetch card data for each random card ID
    const randomCardData = await Promise.all([...uniqueCardIds].map(id => pokemon.card.find(id)));

    console.log('Fetched card data:', randomCardData);

    return randomCardData;
  } catch (error) {
    console.error('Error fetching random Pokémon cards:', error);
    throw error;
  }
}

export async function fetchPokemonCardsByName(name) {
  try {
    const response = await pokemon.card.where({ q: `name:"${name}"` });
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
  
    const popularSetIds = ["sv7",'sv6pt5', "sv6", "sv3pt5"]; // Example popular set IDs

    // Fetch popular sets
    const popularSets = await Promise.all(popularSetIds.map(id => pokemon.set.find(id)));

    const sets = [...popularSets].map(set => ({
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

export async function logRarities() {
  try {
    const rarities = await pokemon.rarity.all();
    console.log('Rarities:', rarities);
  } catch (error) {
    console.error('Error fetching rarities:', error);
  }
}

// Call the function on page load
logRarities();

export async function fetchRandomPokemonCardsForPokedex(numberOfCards = 10) {
  try {
    // Fetch all sets
    const sets = await fetchSetData();

    // Select a random set
    const randomSet = sets[Math.floor(Math.random() * sets.length)];

    // Get the IDs of all cards in the selected set
    const cardIDs = Array.from({ length: randomSet.total }, (_, i) => `${randomSet.id}-${i + 1}`);

    // Select random card IDs from the set
    const randomCardIDs = Array.from({ length: numberOfCards }, () =>
      cardIDs[Math.floor(Math.random() * cardIDs.length)]
    );

    // Fetch data for the selected random card IDs
    const randomCardData = await fetchCardData(randomCardIDs);

    return randomCardData;
  } catch (error) {
    console.error('Error fetching random Pokémon cards for Pokedex:', error);
    throw error;
  }
}

// Function to fetch sets based on user binder data
export async function fetchUserSets(binderCards) {
  try {
    // Extract unique set IDs from binder cards
    const setIds = [...new Set(binderCards.map(card => card.id.split('-')[0]))];

    // Fetch set data for these set IDs
    const setsData = await Promise.all(setIds.map(id => pokemon.set.find(id)));

    // Map the fetched set data to desired format, including totalCount
    const sets = setsData.map(set => ({
      name: set.name,
      id: set.id,
      logo: set.images.logo,
      releaseDate: set.releaseDate,
      totalCount: set.total // Include totalCount property
    }));

    return sets;
  } catch (error) {
    console.error('Error fetching user-specific sets:', error);
    return [];
  }
}

