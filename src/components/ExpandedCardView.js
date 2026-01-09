// src/components/ExpandedCardView.js

import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ProfileHeader from './ProfileHeader'
import NormalCard from './NormalCard'
import { MoveLeft } from 'lucide-react'
import '../styles/ExpandedCardView.css'
import grass from '../assets/types/grass.png'
import fire from '../assets/types/fire.png'
import water from '../assets/types/water.png'
import colorless from '../assets/types/colorless.png'
import psychic from '../assets/types/psychic.png'
import lightning from '../assets/types/lightning.png'
import fighting from '../assets/types/fighting.png'
import darkness from '../assets/types/darkness.png'
import metal from '../assets/types/metal.png'
import dragon from '../assets/types/dragon.png'
import fairy from '../assets/types/fairy.png'
import abilityIcon from '../assets/ability-icon.png' // Import the ability icon
import { fetchExpandedCardData } from '../js/pack_algorithm/packAlgorithm'

// Mapping type names to images
const typeImages = {
  Grass: grass,
  Fire: fire,
  Water: water,
  Colorless: colorless,
  Psychic: psychic,
  Lightning: lightning,
  Fighting: fighting,
  Darkness: darkness,
  Metal: metal,
  Dragon: dragon,
  Fairy: fairy,
}

const ExpandedCardView = () => {
  const location = useLocation()
  const { cardProps } = location.state || {}
  const navigate = useNavigate()
  const cardId = cardProps?.id

  const [cardData, setCardData] = useState(null)

  useEffect(() => {
    if (cardId) {
      fetchExpandedCardData(cardId).then((data) => setCardData(data))
    }
  }, [cardId])

  const handleSetClick = () => {
    if (cardId) {
      const setId = cardId.split('-')[0] // Extract set ID from cardId
      navigate(`/pokedex?setId=${setId}`, { replace: true }) // Navigate to PokedexPage with setId
    } else {
      console.error('cardId is undefined')
    }
  }

  const handleBackToBinder = () => {
    navigate('/binder/view')
  }

  return (
    <>
      <div className="expanded-card-view">
        <ProfileHeader />
        <div className="expanded-card-content">
          <span className="back-to-binder" onClick={() => navigate('/pokedex')}>
            <MoveLeft /> <a href="#">Back to Pokedex</a>
          </span>
          <div className="expanded-card-left">
            {cardProps ? (
              <>
                <div className="binder-normal-card-container">
                  <NormalCard {...cardProps} isInUserBinder={false} />
                </div>
                <div className="binder-card-details">
                  {cardProps.count > 1 ? (
                    <>
                      You have{' '}
                      <span className="pink-text bold-text">
                        {cardProps.count}
                      </span>{' '}
                      copies of this card.
                    </>
                  ) : (
                    <>
                      You have <span className="pink-text bold-text">1</span>{' '}
                      copy of this card.
                    </>
                  )}
                </div>
              </>
            ) : (
              <p>No card details available</p>
            )}
          </div>
          <div className="expanded-card-right">
            <div className="expanded-card-right--info">
              {cardData ? (
                <>
                  <div>
                    <h2 className="expanded-card-right--title">
                      {cardData.name}{' '}
                    </h2>
                    <span className="expanded-card-right--subtitle">
                      ({cardData.supertype} -{' '}
                      {cardData.subtypes
                        ? cardData.subtypes.join(', ')
                        : 'Unknown'}
                      )
                    </span>
                  </div>

                  <div className="expanded-card-right--attributes">
                    <p>HP: {cardData.hp}</p>
                    {cardData.types?.[0] ? (
                      <img
                        src={typeImages[cardData.types[0]] || grass}
                        alt={cardData.types[0]}
                      />
                    ) : (
                      <span className="na">N/A</span>
                    )}
                  </div>
                </>
              ) : (
                <p>Loading card data...</p>
              )}
            </div>
            <div className="card-prices">
              {cardData?.tcgplayer ? (
                <div>
                  <div className="card-prices--header">
                    <h2>PRICES</h2>
                    {cardData.tcgplayer.url ? (
                      <a href={cardData.tcgplayer.url}>Buy on TCGPlayer</a>
                    ) : (
                      <button
                        disabled
                        style={{
                          textDecoration: 'underline',
                          background: 'none',
                          border: 'none',
                          color: 'blue',
                          cursor: 'pointer',
                        }}
                      >
                        Buy on TCGPlayer
                      </button>
                    )}
                    <span className="card-prices--updated">
                      {' '}
                      Updated: {cardData.tcgplayer.updatedAt}
                    </span>
                  </div>
                  <div className="expanded-card-right--prices">
                    {Object.keys(cardData.tcgplayer.prices).map(
                      (condition, index) =>
                        cardData.tcgplayer.prices[condition] ? (
                          <React.Fragment key={condition}>
                            {' '}
                            {/* Update this line */}
                            <h3>
                              {condition.charAt(0).toUpperCase() +
                                condition.slice(1)}
                              :
                            </h3>
                            <div className="expanded-card-right--prices-item">
                              <p>
                                Low:{' '}
                                <span className="price-number">
                                  $
                                  {cardData.tcgplayer.prices[condition].low ||
                                    'N/A'}
                                </span>
                              </p>
                              <p>
                                Mid:{' '}
                                <span className="price-number">
                                  $
                                  {cardData.tcgplayer.prices[condition].mid ||
                                    'N/A'}
                                </span>
                              </p>
                              <p>
                                High:{' '}
                                <span className="price-number">
                                  $
                                  {cardData.tcgplayer.prices[condition].high ||
                                    'N/A'}
                                </span>
                              </p>
                              <p className="market-price">
                                Market: $
                                {cardData.tcgplayer.prices[condition].market ||
                                  'N/A'}
                              </p>
                            </div>
                          </React.Fragment>
                        ) : (
                          <div
                            key={condition}
                            className="expanded-card-right--prices-item"
                          >
                            {' '}
                            {/* Add key here */}
                            <h3>
                              {condition.charAt(0).toUpperCase() +
                                condition.slice(1)}
                              :
                            </h3>
                            <p className="na">N/A</p>
                          </div>
                        )
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="card-prices--header">
                    <h2>PRICES</h2>
                    <button
                      disabled
                      style={{
                        textDecoration: 'underline',
                        background: 'none',
                        border: 'none',
                        color: 'blue',
                        cursor: 'pointer',
                      }}
                    >
                      Buy on TCGPlayer
                    </button>
                    <span> Updated: N/A</span>
                  </div>
                  <div className="expanded-card-right--prices">
                    <div className="expanded-card-right--prices-item">
                      <h3>Normal:</h3>
                      <p>N/A</p>
                    </div>
                    <div className="expanded-card-right--prices-item">
                      <h3>Reverse Holofoil:</h3>
                      <p>N/A</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="card-attack">
              <h2>ATTACKS/ABILITIES</h2>
              {cardData?.abilities?.length > 0 ? (
                cardData.abilities.map((ability, index) => (
                  <div className="card-ability" key={`ability-${index}`}>
                    {' '}
                    {/* Update key here */}
                    <div className="card-ability--header">
                      <img
                        src={abilityIcon}
                        alt="Ability Icon"
                        className="card-ability--icon"
                      />
                      <h2 className="card-ability--name name-italic">
                        {ability.name}
                      </h2>
                    </div>
                    <p className="card-ability--text">{ability.text}</p>
                  </div>
                ))
              ) : (
                <p className="na">No Attacks</p>
              )}
              {cardData?.attacks?.length > 0 ? (
                cardData.attacks.map((attack, index) => (
                  <div className="card-ability" key={`attack-${index}`}>
                    <div className="card-ability--info">
                      <div className="card-ability--types">
                        {attack.cost.map((type, idx) => (
                          <img
                            key={`attack-cost-${idx}`}
                            src={typeImages[type] || grass}
                            alt={type}
                          />
                        ))}
                      </div>
                      <div className="card-ability--ability">
                        <h2 className="card-ability--name">{attack.name}</h2>
                        <h2 className="card-ability--damage">
                          {attack.damage}
                        </h2>
                      </div>
                    </div>
                    <p>{attack.text}</p>
                  </div>
                ))
              ) : (
                <p className="na">No Abilities</p>
              )}
            </div>
            <div className="card-rule">
              <h2>RULES</h2>
              <div className="card-rule--rules">
                {cardData?.rules?.length > 0 &&
                  cardData.rules.map((rule, index) => (
                    <p key={`rule-${index}`}>
                      <span className="card-rule--num">{index + 1}.</span>{' '}
                      {rule}
                    </p>
                  ))}
              </div>
            </div>
            <div className="card-additional-info">
              <div className="weakness">
                <span>WEAKNESS</span>
                {cardData?.weaknesses?.length > 0 ? (
                  cardData.weaknesses.map((weakness, index) => (
                    <div
                      key={`weakness-${index}`}
                      className="card-additional-info--container"
                    >
                      <img
                        src={typeImages[weakness.type] || grass}
                        alt={weakness.type}
                      />
                      <p>{weakness.value}</p>
                    </div>
                  ))
                ) : (
                  <p className="na">N/A</p>
                )}
              </div>
              <div className="weakness">
                <span>RESISTANCE</span>
                {cardData?.resistances?.length > 0 ? (
                  cardData.resistances.map((resistance, index) => (
                    <div
                      key={`resistance-${index}`}
                      className="card-additional-info--container"
                    >
                      {' '}
                      {/* Update key here */}
                      <img
                        src={typeImages[resistance.type] || grass}
                        alt={resistance.type}
                      />
                      <p>{resistance.value}</p>
                    </div>
                  ))
                ) : (
                  <p className="na">N/A</p>
                )}
              </div>
              <div className="weakness">
                <span>RETREAT COST</span>
                {cardData?.retreatCost?.length > 0 ? (
                  <div className="card-additional-info--container">
                    {cardData.retreatCost.map((type, index) => (
                      <img
                        key={`retreat-${index}`}
                        src={typeImages[type] || grass}
                        alt={type}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="na">N/A</p>
                )}
              </div>
              <div className="weakness">
                <span>RARITY</span>
                <p className="na">{cardData?.rarity || 'N/A'}</p>
              </div>
              <div className="weakness">
                <span>SET</span>
                {cardData?.set?.name ? (
                  <button
                    type="button"
                    onClick={handleSetClick}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      width: 'max-content',
                    }}
                  >
                    {cardData.set.name}
                  </button>
                ) : (
                  <p className="na">N/A</p>
                )}
              </div>
              <div className="weakness">
                <span>NUMBER</span>
                <p className="na">{cardData?.number || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ExpandedCardView
