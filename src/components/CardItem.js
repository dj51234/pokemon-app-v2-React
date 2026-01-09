import React, { useState, useEffect } from 'react'
import { fetchCardData } from '../js/api'
import '../styles/WishlistPage.css'

const CardItem = ({ card, cardId, onLoadComplete, reveal, removeCard }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [cardData, setCardData] = useState(card || {})
  const [borderRadius, setBorderRadius] = useState('0px')
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      if (cardId && !card) {
        try {
          const fetchedCardInfo = await fetchCardData([cardId])
          if (fetchedCardInfo && fetchedCardInfo.length > 0) {
            setCardData(fetchedCardInfo[0])
          } else {
            setError('Failed to fetch card data')
          }
        } catch (error) {
          console.error('Error fetching card data:', error)
          setError('Failed to fetch card data')
        }
      }
    }
    fetchData()
  }, [cardId, card])

  useEffect(() => {
    // Only reset isLoaded if the underlying card data actually changes
    // This prevents flickering if the parent re-renders but passes the same card
    if (cardData.id) {
      // Check if images are already cached/loaded
      const img = new Image()
      img.src = cardData.images?.large
      if (img.complete) {
        setIsLoaded(true)
        calculateBorderRadius()
        if (onLoadComplete) onLoadComplete(cardData.id)
      } else {
        setIsLoaded(false)
      }
    }
  }, [cardData.id, cardData.images?.large])

  const handleImageLoad = () => {
    setIsLoaded(true)
    calculateBorderRadius()
    if (onLoadComplete) onLoadComplete(cardData.id)
  }

  // Calculate border radius using the image's transparent corners
  const calculateBorderRadius = () => {
    try {
      const img = new Image()
      img.crossOrigin = 'Anonymous'
      img.src = cardData.images?.large

      const processImage = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, img.width, img.height)

        const threshold = 10
        const sampleSize = 50
        const transparentPixelCount = {
          topLeft: 0,
          topRight: 0,
          bottomLeft: 0,
          bottomRight: 0,
        }

        const isTransparent = (pixelData) => pixelData[3] < threshold

        for (let y = 0; y < sampleSize; y++) {
          for (let x = 0; x < sampleSize; x++) {
            const pixelData = ctx.getImageData(x, y, 1, 1).data
            if (isTransparent(pixelData)) {
              transparentPixelCount.topLeft++
            }
          }
        }

        for (let y = 0; y < sampleSize; y++) {
          for (let x = img.width - sampleSize; x < img.width; x++) {
            const pixelData = ctx.getImageData(x, y, 1, 1).data
            if (isTransparent(pixelData)) {
              transparentPixelCount.topRight++
            }
          }
        }

        for (let y = img.height - sampleSize; y < img.height; y++) {
          for (let x = 0; x < sampleSize; x++) {
            const pixelData = ctx.getImageData(x, y, 1, 1).data
            if (isTransparent(pixelData)) {
              transparentPixelCount.bottomLeft++
            }
          }
        }

        for (let y = img.height - sampleSize; y < img.height; y++) {
          for (let x = img.width - sampleSize; x < img.width; x++) {
            const pixelData = ctx.getImageData(x, y, 1, 1).data
            if (isTransparent(pixelData)) {
              transparentPixelCount.bottomRight++
            }
          }
        }

        const totalTransparentPixels =
          transparentPixelCount.topLeft +
          transparentPixelCount.topRight +
          transparentPixelCount.bottomLeft +
          transparentPixelCount.bottomRight
        const borderRadiusValue = totalTransparentPixels > 0 ? '12px' : '0px'

        setBorderRadius(borderRadiusValue)
      }

      if (img.complete) {
        processImage()
      } else {
        img.onload = processImage
      }
    } catch (error) {
      console.error('Failed to calculate border radius', error)
    }
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  return (
    <div
      className="grid-item--card"
      style={{
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        background: 'var(--black)',
      }}
    >
      <div
        className={`card-wrapper ${reveal && isLoaded ? 'loaded' : ''}`}
        data-rarity={
          cardData.rarity ? cardData.rarity.toLowerCase() : 'unknown'
        }
        data-id={cardData.id}
        data-image={cardData.images?.large}
        data-name={cardData.name}
        style={{ borderRadius }}
      >
        {(!reveal || !isLoaded) && <div className="skeleton-loader"></div>}
        {cardData.images?.large && (
          <img
            src={cardData.images.large}
            alt={cardData.name}
            className={`card-image ${
              reveal && isLoaded ? 'visible' : 'hidden'
            }`}
            onLoad={handleImageLoad}
            crossOrigin="anonymous"
          />
        )}
        <style>{`
          .card-wrapper::after {
            border-radius: ${borderRadius};
          }
        `}</style>
      </div>
    </div>
  )
}

export default CardItem
