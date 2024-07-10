// import pokemon from 'pokemontcgsdk';

// pokemon.configure({ apiKey: process.env.REACT_APP_API_KEY });

// // Function to fetch all sets
// async function fetchAllSets() {
//   try {
//     const response = await pokemon.set.all();
//     return response;
//   } catch (error) {
//     console.error('Error fetching all sets:', error);
//   }
// }

// // Function to fetch all cards in a set and group them by rarity
// async function fetchAndGroupCardsByRarity(setCode) {
//   try {
//     const response = await pokemon.card.where({
//       q: `set.id:${setCode}`,
//       pageSize: 250 // Maximum number of cards per page
//     });

//     // Initialize an object to store card IDs by rarity
//     const rarityGroups = {};

//     // Group card IDs by rarity
//     response.data.forEach(card => {
//       const rarity = card.rarity || 'Unknown';
//       if (!rarityGroups[rarity]) {
//         rarityGroups[rarity] = [];
//       }
//       rarityGroups[rarity].push(card.id);
//     });

//     return rarityGroups;
//   } catch (error) {
//     console.error(`Error fetching cards in set ${setCode}:`, error);
//   }
// }

// // Function to fetch and group cards for all sets
// async function fetchAndGroupCardsForAllSets() {
//   const allSets = await fetchAllSets();

//   const allSetsRarityGroups = {};

//   for (const set of allSets) {
//     console.log(`Processing set: ${set.id}`);
//     const rarityGroups = await fetchAndGroupCardsByRarity(set.id);
//     allSetsRarityGroups[set.id] = rarityGroups;

//     // Optional: Delay between requests to avoid rate limits (e.g., 1 second delay)
//     await new Promise(resolve => setTimeout(resolve, 1000));
//   }

//   console.log('All sets rarity groups:', allSetsRarityGroups);
//   return allSetsRarityGroups;
// }

// // Test the function to fetch and group cards for all sets
// fetchAndGroupCardsForAllSets();
