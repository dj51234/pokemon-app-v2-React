// src/js/api.js

import sets from '../data/sets.json'
import allCardsSlim from '../data/allCardsSlim.json'

// Cache for loaded card sets
const cardCache = {}

// Get all sets
export function getAllSets() {
  return sets
}

// Alias for backwards compatibility
export async function fetchSetData() {
  return sets
}

// Get single set by ID
export function getSetById(setId) {
  return sets.find((s) => s.id === setId)
}

export async function getCardsBySetId(setId) {
  return allCardsSlim[setId] || []
}

// Get single card by ID
export async function getCardById(cardId) {
  const setId = cardId.split('-')[0]
  const cards = allCardsSlim[setId] || []
  return cards.find((c) => c.id === cardId)
}

export async function getFullCardById(cardId) {
  const setId = cardId.split('-')[0]

  // Load full set data if not cached
  if (!cardCache[setId]) {
    try {
      const data = await import(`../data/cards/${setId}.json`)
      cardCache[setId] = data.default
    } catch (error) {
      console.error(`Error loading full card data:`, error)
      return null
    }
  }

  return cardCache[setId].find((c) => c.id === cardId)
}

// Get all rarities in a set
export async function getSetRarities(setId) {
  const cards = await getCardsBySetId(setId)
  return [...new Set(cards.map((c) => c.rarity).filter(Boolean))]
}

// Get cards by rarity within a set
export async function getCardsByRarity(setId, rarity) {
  const cards = await getCardsBySetId(setId)
  return cards.filter((c) => c.rarity?.toLowerCase() === rarity.toLowerCase())
}

// Search cards by name within a set
export async function searchCardsByNameInSet(setId, name) {
  const cards = await getCardsBySetId(setId)
  return cards.filter((c) => c.name.toLowerCase().includes(name.toLowerCase()))
}

// Replaces old fetchCardData(cardIDs)
export async function fetchCardData(cardIDs) {
  try {
    const cardData = await Promise.all(cardIDs.map((id) => getCardById(id)))
    return cardData.filter(Boolean)
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}

// Replaces old fetchRandomPokemonCards(setCode)
export async function fetchRandomPokemonCards(setCode) {
  try {
    const numberOfCards = 10
    const cards = await getCardsBySetId(setCode)

    if (!cards || cards.length === 0) {
      console.error(`Set ID ${setCode} not found.`)
      return []
    }

    const shuffled = [...cards].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, numberOfCards)
  } catch (error) {
    console.error('Error fetching random Pokémon cards:', error)
    return []
  }
}

// Replaces old fetchPokemonCardsByName(name) - searches all sets
export async function fetchPokemonCardsByName(name) {
  try {
    const allCards = []
    for (const set of sets) {
      try {
        const cards = await getCardsBySetId(set.id)
        const matches = cards
          .filter((c) => c.name.toLowerCase().includes(name.toLowerCase()))
          .map((card) => ({ ...card, set: set })) // Enrich with set data
        allCards.push(...matches)
      } catch (e) {
        // Skip sets that fail to load
      }
    }
    return allCards
  } catch (error) {
    console.error('Error fetching Pokémon cards by name:', error)
    return []
  }
}

// Keep as-is - still uses PokeAPI
export async function fetchAllPokemonNames() {
  try {
    const response = await fetch(
      'https://pokeapi.co/api/v2/pokemon?limit=10000'
    )
    const data = await response.json()
    const names = data.results.map((pokemon) => pokemon.name)
    return names
  } catch (error) {
    console.error('Error fetching Pokémon names from PokeAPI:', error)
    return []
  }
}

// Replaces old fetchSetsForPackSelection()
export function fetchSetsForPackSelection() {
  try {
    const popularSetIds = ['sv7', 'sv6pt5', 'sv6', 'sv3pt5']

    const popularSets = popularSetIds
      .map((id) => getSetById(id))
      .filter(Boolean)
      .map((set) => ({
        name: set.name,
        id: set.id,
        logo: set.images.logo,
        releaseDate: set.releaseDate,
      }))

    return popularSets
  } catch (error) {
    console.error('Error fetching sets for pack selection:', error)
    return []
  }
}

// Replaces old fetchRandomPokemonCardsForPokedex()
export async function fetchRandomPokemonCardsForPokedex(numberOfCards = 10) {
  try {
    const randomSet = sets[Math.floor(Math.random() * sets.length)]
    const cards = await getCardsBySetId(randomSet.id)
    if (!cards || cards.length === 0) return []
    const shuffled = [...cards].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, numberOfCards)
  } catch (error) {
    console.error('Error fetching random Pokémon cards for Pokedex:', error)
    return []
  }
}
