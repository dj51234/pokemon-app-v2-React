// src/js/pack_algorithm/packAlgorithm.js

import { getCardsBySetId, getFullCardById } from '../api'

// Function to get random cards from an array
function getRandomCards(array, count) {
  const shuffled = array.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Function to simulate opening a pack
export async function openPack(setId) {
  try {
    const cards = await getCardsBySetId(setId)
    if (!cards || cards.length === 0) {
      console.error(`Set ID ${setId} not found.`)
      return []
    }

    // Group cards by rarity
    const rarityGroups = {}
    cards.forEach((card) => {
      const rarity = card.rarity?.toLowerCase() || 'unknown'
      if (!rarityGroups[rarity]) {
        rarityGroups[rarity] = []
      }
      rarityGroups[rarity].push(card)
    })

    let finalSelectedCards = []

    if (rarityGroups.common && rarityGroups.uncommon) {
      const selectedCommonCards = getRandomCards(rarityGroups.common, 6).map(
        (card) => ({
          ...card,
          rarity: 'common',
        })
      )
      const selectedUncommonCards = getRandomCards(
        rarityGroups.uncommon,
        3
      ).map((card) => ({
        ...card,
        rarity: 'uncommon',
      }))

      const remainingRarities = Object.keys(rarityGroups).filter(
        (rarity) => rarity !== 'common' && rarity !== 'uncommon'
      )

      const selectedRarity =
        remainingRarities[Math.floor(Math.random() * remainingRarities.length)]
      const selectedRareCard = {
        ...getRandomCards(rarityGroups[selectedRarity], 1)[0],
        rarity: selectedRarity,
      }

      finalSelectedCards = [
        ...selectedCommonCards,
        ...selectedUncommonCards,
        selectedRareCard,
      ]
    } else {
      // Fallback if set doesn't have standard rarity structure
      finalSelectedCards = getRandomCards(cards, 10).map((card) => ({
        ...card,
        rarity: card.rarity?.toLowerCase() || 'unknown',
      }))
    }

    // Map to the format your app expects
    const cardsWithDetails = finalSelectedCards.map((card) => ({
      id: card.id,
      rarity: card.rarity,
      imageUrl: card.images?.large,
      subtypes: card.subtypes,
      setId: setId,
      supertypes: card.supertype,
      type: card.types ? card.types[0] : 'unknown',
    }))

    cardsWithDetails.forEach((card) => {
      console.log(
        `Card ID: ${card.id}, Rarity: ${card.rarity}, Image URL: ${card.imageUrl}`
      )
    })

    return cardsWithDetails.filter((card) => card.imageUrl)
  } catch (error) {
    console.error(`Error opening pack for set ID ${setId}:`, error)
    return []
  }
}

export async function fetchExpandedCardData(cardId) {
  const card = await getFullCardById(cardId)

  if (!card) {
    console.error(`Card ${cardId} not found`)
    return null
  }

  const cardInfo = {
    name: card.name,
    supertype: card.supertype,
    subtypes: card.subtypes || [],
    types: card.types || [],
    rules: card.rules || [],
    hp: card.hp,
    abilities: card.abilities
      ? card.abilities.map((ability) => ({
          name: ability.name,
          text: ability.text,
        }))
      : [],
    attacks: card.attacks
      ? card.attacks.map((attack) => ({
          name: attack.name,
          cost: attack.cost,
          convertedEnergyCost: attack.convertedEnergyCost,
          damage: attack.damage,
          text: attack.text,
        }))
      : [],
    weaknesses: card.weaknesses
      ? card.weaknesses.map((weakness) => ({
          type: weakness.type,
          value: weakness.value,
        }))
      : [],
    resistances: card.resistances
      ? card.resistances.map((resistance) => ({
          type: resistance.type,
          value: resistance.value,
        }))
      : [],
    retreatCost: card.retreatCost,
    convertedRetreatCost: card.convertedRetreatCost,
    set: {
      name: card.set?.name || '',
    },
    rarity: card.rarity,
    number: card.number,
    tcgplayer: {}, // Empty for now since static data doesn't have pricing
  }

  return cardInfo
}
