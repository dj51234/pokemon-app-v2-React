// Grid.js
import React, { useState, useEffect, useRef } from 'react'
import GridItem from './GridItem'
import CardItem from './CardItem'
import '../styles/Grid.css'

const Grid = ({
  sets,
  viewMode,
  cards = [],
  binderCards = [],
  onSetClick,
  isAuthenticated,
  removeCard,
  selectedSet,
}) => {
  const [loadedCardIds, setLoadedCardIds] = useState(new Set())
  const [revealedCount, setRevealedCount] = useState(0)
  const prevFirstCardIdRef = useRef(null)

  // Reset logic when starting fresh (new set or search) vs appending
  useEffect(() => {
    const currentFirstId = cards.length > 0 ? cards[0].id : null

    if (cards.length === 0) {
      setLoadedCardIds(new Set())
      setRevealedCount(0)
      prevFirstCardIdRef.current = null
    } else if (currentFirstId !== prevFirstCardIdRef.current) {
      // New set context detected by first card change
      setLoadedCardIds(new Set())
      setRevealedCount(0)
      prevFirstCardIdRef.current = currentFirstId
    }
    // If first ID matches, we assume we are appending (or stable), so we preserve state
  }, [cards])

  const handleImageLoadComplete = (id) => {
    setLoadedCardIds((prev) => {
      const newSet = new Set(prev)
      newSet.add(id)
      return newSet
    })
  }

  // Check if current batch is ready to reveal
  useEffect(() => {
    if (cards.length > 0 && loadedCardIds.size >= cards.length) {
      setRevealedCount(cards.length)
    }
  }, [loadedCardIds, cards.length])

  // Conditionally apply the sets-grid--profile class if authenticated
  const gridClass =
    viewMode === 'sets'
      ? `sets-grid ${isAuthenticated ? 'sets-grid--profile' : ''}`
      : `cards-grid ${isAuthenticated ? 'cards-grid--profile' : ''}`

  return (
    <>
      {selectedSet && viewMode === 'cards' && (
        <h1 className="set-title-pokedex">
          Viewing: <span className="pink-text">{selectedSet.name}</span>
        </h1>
      )}
      <div id="grid" className={gridClass}>
        {viewMode === 'sets'
          ? sets.map((set) => (
              <GridItem key={set.id} set={set} onSetClick={onSetClick} />
            ))
          : cards.map((card, index) => (
              <CardItem
                key={card.id || `${card.name}-${Math.random()}`} // ensure generic key if id missing
                card={card}
                cardId={card.id}
                binderCards={binderCards}
                onLoadComplete={handleImageLoadComplete}
                removeCard={removeCard}
                reveal={index < revealedCount} // Reveal cards up to the count that have fully loaded
              />
            ))}
      </div>
    </>
  )
}

export default Grid
