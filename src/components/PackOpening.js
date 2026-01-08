// File: /components/PackOpening.jsx

import React, { useState, useEffect, useRef } from 'react'
import '../styles/PackOpening.css'
import '../styles/explosion.css'
import defaultImage from '../assets/default-image.png'
import NormalCard from './NormalCard'

// Function to check if a rarity is considered rare
const isRare = (rarity) => {
  const rareRarities = [
    'special illustration rare',
    'ace spec rare',
    'amazing rare',
    'hyper rare',
    'double rare',
    'radiant rare',
    'illustration rare',
    'rare ace',
    'rare holo',
    'rare break',
    'rare holo ex',
    'rare holo gx',
    'rare holo lv.x',
    'rare holo vstar',
    'rare holo v',
    'rare v',
    'rare holo vmax',
    'rare rare holo vstar',
    'rare prime',
    'rare prism star',
    'rare rainbow',
    'rare shining',
    'rare holo shiny',
    'rare shiny gx',
    'rare ultra',
    'shiny rare',
    'shiny ultra rare',
    'trainer gallery rare holo',
    'ultra rare',
  ]
  return rareRarities.includes(rarity)
}

// Define rarity colors
const rarityColors = {
  'ace spec rare': '#F700C1',
  'hyper rare': '#FFD913',
  'rare holo': '#FFFFFF',
  'rare secret': '#FFD913',
  'illustration rare': '#FFFFFF',
  'special illustration rare': '#FFFFFF',
  'amazing rare': '#FFFFFF',
  'double rare': '#FFFFFF',
  'radiant rare': '#FFFFFF',
  'rare ace': '#FFFFFF',
  'rare break': '#FFFFFF',
  'rare holo ex': '#FFFFFF',
  'rare holo gx': '#FFFFFF',
  'rare holo lv.x': '#FFFFFF',
  'rare holo vstar': '#FFFFFF',
  'rare holo v': '#FFFFFF',
  'rare v': '#FFFFFF',
  'rare holo vmax': '#FFFFFF',
  'rare rare holo vstar': '#FFFFFF',
  'rare prime': '#FFFFFF',
  'rare prism star': '#FFFFFF',
  'rare rainbow': '#FFFFFF',
  'rare shining': '#FFFFFF',
  'rare holo shiny': '#FFFFFF',
  'rare shiny gx': '#FFFFFF',
  'rare ultra': '#FFFFFF',
  'shiny rare': '#FFFFFF',
  'shiny ultra rare': '#FFFFFF',
  'trainer gallery rare holo': '#FFFFFF',
  'ultra rare': '#FFFFFF',
  // Add more colors for other rarities as needed
}

const PackOpening = ({
  show,
  randomCards,
  onBack,
  onNext,
  addRevealedCards,
  selectedSetId,
}) => {
  const [leftStack, setLeftStack] = useState(
    Array(10)
      .fill(null)
      .map((_, i) => ({
        back: defaultImage,
        front: null,
        flipped: false,
        instanceId: `card-${i}`,
      }))
  )
  const [cardsToShow, setCardsToShow] = useState([])
  const [animating, setAnimating] = useState(false)
  const [allFlipped, setAllFlipped] = useState(false)
  const [movingCard, setMovingCard] = useState(null)
  const [sendingToBinder, setSendingToBinder] = useState(false)
  const [hideStack, setHideStack] = useState(false)
  const [highlightBackButton, setHighlightBackButton] = useState(false)
  const [hideNextButton, setHideNextButton] = useState(false)
  const [nextTopCardRarity, setNextTopCardRarity] = useState(null)
  const topCardRef = useRef(null)
  const cardStackRef = useRef(null)

  useEffect(() => {
    if (randomCards.length > 0) {
      // Separate rare and non-rare cards
      const nonRareCards = randomCards.filter(
        (card) => !isRare(card.rarity?.toLowerCase())
      )
      const rareCards = randomCards.filter((card) =>
        isRare(card.rarity?.toLowerCase())
      )

      // Combine non-rare cards first, then rare cards
      const reorderedCards = [...rareCards, ...nonRareCards]

      setCardsToShow(reorderedCards)
      setHideStack(false)
      setLeftStack(
        Array(10)
          .fill(null)
          .map((_, i) => ({
            back: defaultImage,
            front: null,
            flipped: false,
            instanceId: `card-${i}-${Date.now()}`, // Unique ID for each pack opening session
          }))
      )
      setAllFlipped(false)
      setHideNextButton(false)
    }
  }, [randomCards])

  const createParticle = (explosionContainer, color) => {
    const particle = document.createElement('div')
    particle.classList.add('particle')

    const rect = explosionContainer.getBoundingClientRect()
    const cardWidth = rect.width
    const cardHeight = rect.height

    // Determine a random starting position around the border of the card
    let startX, startY
    const borderSide = Math.floor(Math.random() * 4)
    switch (borderSide) {
      case 0: // Top border
        startX = Math.random() * cardWidth
        startY = 0
        break
      case 1: // Right border
        startX = cardWidth
        startY = Math.random() * cardHeight
        break
      case 2: // Bottom border
        startX = Math.random() * cardWidth
        startY = cardHeight
        break
      case 3: // Left border
        startX = 0
        startY = Math.random() * cardHeight
        break
      default:
        startX = Math.random() * cardWidth
        startY = Math.random() * cardHeight
    }

    // Calculate the target position based on direction from center
    const centerX = cardWidth / 2
    const centerY = cardHeight / 2
    const directionX = startX - centerX
    const directionY = startY - centerY
    const distance = Math.random() * 500 + 300 // Increase the explosion distance
    const tx = (directionX * distance) / cardWidth + 'px'
    const ty = (directionY * distance) / cardHeight + 'px'

    const size = Math.random() * 12 // Random size between 10px and 30px
    particle.style.setProperty('--start-x', `${startX}px`)
    particle.style.setProperty('--start-y', `${startY}px`)
    particle.style.setProperty('--tx', tx)
    particle.style.setProperty('--ty', ty)
    particle.style.width = `${size}px`
    particle.style.height = `${size}px`
    particle.style.background = color // Use color for the particle background

    explosionContainer.appendChild(particle)

    particle.style.animation = 'explosion 1s forwards' // Shorter animation duration

    particle.addEventListener('animationend', () => {
      particle.remove()
    })
  }

  const triggerExplosion = (explosionContainer, rarity) => {
    const color = rarityColors[rarity] || 'white' // Default to white if no color specified
    const numberOfParticles = 450 // Adjust the number of particles
    for (let i = 0; i < numberOfParticles; i++) {
      createParticle(explosionContainer, color)
    }
  }

  const handleCardClick = (index) => {
    if (animating) return

    const newLeftStack = [...leftStack]
    const card = newLeftStack[index]

    if (!allFlipped && cardsToShow.length > 0) {
      setAnimating(true)

      const updatedStack = newLeftStack.map((card, i) => {
        if (!card.flipped && cardsToShow.length > 0) {
          const randomCard = cardsToShow.pop()
          const newCard = {
            ...card,
            front: randomCard.images.large,
            flipped: true,
            rarity: randomCard.rarity?.toLowerCase() || '',
            subtypes:
              randomCard.subtypes?.map((subtype) => subtype.toLowerCase()) ||
              [],
            setId: randomCard.setId?.toLowerCase() || '',
            supertypes:
              randomCard.supertypes?.map((supertype) =>
                supertype.toLowerCase()
              ) || [],
            id: randomCard.id, // Add the card id here
          }
          return newCard
        }
        return card
      })

      setLeftStack(updatedStack)
      setCardsToShow(cardsToShow)
      setAllFlipped(true)

      setTimeout(() => {
        setAnimating(false)
      }, 600)
    } else if (card.flipped) {
      setAnimating(true)
      setMovingCard(index)

      // Check the next top card's rarity before moving the current top card to the back
      const nextTopCardElement = Array.from(cardStackRef.current.children).find(
        (child) => parseInt(child.style.zIndex, 10) === 9
      ) // Select the second-to-top card
      if (nextTopCardElement) {
        const nextTopCardRarity = nextTopCardElement.getAttribute('data-rarity')
        if (isRare(nextTopCardRarity)) {
          // Set the next top card rarity to apply box shadow after the current top card is clicked
          setNextTopCardRarity(nextTopCardRarity)
          // Trigger the explosion animation on the next top card
          triggerExplosion(
            nextTopCardElement.querySelector('.explosion-container'),
            nextTopCardRarity
          )
        }
      }

      setTimeout(() => {
        const newCard = newLeftStack.splice(index, 1)[0]
        newLeftStack.push(newCard)
        newLeftStack.forEach((card, idx) => {
          card.zIndex = newLeftStack.length - idx
        })

        setLeftStack(newLeftStack)
        setMovingCard(null)
        setNextTopCardRarity(null)
        setAnimating(false)
      }, 700)
    }
  }

  const handleBackClick = () => {
    setTimeout(() => {
      setLeftStack(
        Array(10)
          .fill(null)
          .map((_, i) => ({
            back: defaultImage,
            front: null,
            flipped: false,
            instanceId: `card-${i}-reset`,
          }))
      )
      setCardsToShow([])
      setAllFlipped(false)
      setMovingCard(null)
      setHideStack(false)
      setHighlightBackButton(false)
    }, 500)
    onBack()
  }

  const handleNextClick = () => {
    setSendingToBinder(true)
    const newRevealedCards = leftStack
      .filter((card) => card.flipped)
      .map((card) => ({ image: card.front }))
    addRevealedCards(newRevealedCards)

    setTimeout(() => {
      setSendingToBinder(false)
      setHideStack(true)
      setHighlightBackButton(true)
      setHideNextButton(true)
      onNext()
    }, 600)
  }

  return (
    <div className={`pack-opening ${show ? 'show' : ''}`}>
      <div className="pack-opening-content">
        <h2>
          <span className="gradient-text">Step 2:</span> Open Your Pack
        </h2>
        <div
          ref={cardStackRef}
          className={`card-stack ${sendingToBinder ? 'move-to-binder' : ''} ${
            hideStack ? 'hide' : ''
          }`}
        >
          {leftStack.map((card, index) => (
            <div
              key={card.instanceId}
              ref={index === 0 ? topCardRef : null}
              className={`card ${movingCard === index ? 'moving-to-back' : ''}`}
              style={{ zIndex: leftStack.length - index }}
              data-rarity={card.rarity}
            >
              <NormalCard
                id={card.id}
                isFlipped={card.flipped}
                frontImage={card.front}
                backImage={card.back}
                onCardClick={() => handleCardClick(index)}
                rarity={card.rarity}
                subtypes={card.subtypes}
                setId={card.setId}
                supertypes={card.supertypes}
                isTopCard={index === 0}
                applyBoxShadow={index === 1 && !!nextTopCardRarity}
                isInteractable={leftStack.length - index === 10}
                selectedSetId={selectedSetId}
              />
              <div className="explosion-container"></div>
            </div>
          ))}
        </div>
        <div className="pack-opening-buttons">
          <button
            className={`back-button-home back-button btn-primary ${
              highlightBackButton ? 'highlighted' : ''
            }`}
            onClick={handleBackClick}
          >
            Open New Pack
          </button>
          {allFlipped && !hideNextButton && (
            <button
              className="next-button btn-primary"
              onClick={handleNextClick}
            >
              Add to Binder
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default PackOpening
