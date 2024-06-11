// api.js
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

export async function fetchRandomPokemonCards() {
  try {
    const setCode = 'base1'; // Set code for base1 set
    const numberOfCards = 5; // Number of random cards to fetch

    // Generate 5 random numbers between 1 and 102 (inclusive) for card indices
    const randomCardIndices = Array.from({ length: numberOfCards }, () => Math.floor(Math.random() * 102) + 1);

    // Fetch card data for each random index
    const randomCardData = await Promise.all(randomCardIndices.map(index => pokemon.card.find(`${setCode}-${index}`)));

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
