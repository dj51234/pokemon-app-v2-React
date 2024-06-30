// src/js/api.js
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
    return setDetails.printedTotal; // Use printedTotal instead of totalCards
  } catch (error) {
    console.error('Error fetching set details:', error);
    throw error;
  }
}

export async function fetchRandomPokemonCards(setCode) {
  try {
    const numberOfCards = 10; // Number of random cards to fetch

    // Fetch the length of the set
    const totalCards = await fetchSetLength(setCode);
    console.log(`Total cards in set ${setCode}:`, totalCards);

    // Use a Set to ensure unique random numbers
    const uniqueCardNumbers = new Set();
    while (uniqueCardNumbers.size < numberOfCards) {
      const randomNum = Math.floor(Math.random() * totalCards) + 1;
      uniqueCardNumbers.add(randomNum);
      console.log(`Generated random number: ${randomNum}, Unique numbers so far:`, [...uniqueCardNumbers]);
    }

    console.log(`Final set of unique card numbers:`, [...uniqueCardNumbers]);

    // Convert Set to Array and fetch card data for each random card number
    const randomCardData = await Promise.all([...uniqueCardNumbers].map(number => pokemon.card.find(`${setCode}-${number}`)));

    console.log(`Fetched card data:`, randomCardData);

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

export async function fetchRandomPokemonCardsForPokedex(numberOfCards = 5) {
  try {
    // Fetch all sets
    const sets = await fetchSetData();

    // Select a random set
    const randomSet = sets[Math.floor(Math.random() * sets.length)];

    // Get the IDs of all cards in the selected set
    const cardIDs = Array.from({ length: randomSet.printedTotal }, (_, i) => `${randomSet.id}-${i + 1}`);

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

