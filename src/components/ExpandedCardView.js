// src/components/ExpandedCardView.js

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProfileHeader from './ProfileHeader';
import NormalCard from './NormalCard';
import '../styles/ExpandedCardView.css';
import grass from '../assets/types/grass.png';
import fire from '../assets/types/fire.png';
import water from '../assets/types/water.png';
import colorless from '../assets/types/colorless.png';
import psychic from '../assets/types/psychic.png';
import lightning from '../assets/types/lightning.png';
import fighting from '../assets/types/fighting.png';
import darkness from '../assets/types/darkness.png';
import metal from '../assets/types/metal.png';
import dragon from '../assets/types/dragon.png';
import fairy from '../assets/types/fairy.png';
import abilityIcon from '../assets/ability-icon.png'; // Import the ability icon
import { fetchExpandedCardData } from '../js/pack_algorithm/packAlgorithm';

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
};

const ExpandedCardView = () => {
  const location = useLocation();
  const { cardProps } = location.state || {}; 

  const cardId = cardProps?.id;

  const [cardData, setCardData] = useState(null);

  useEffect(() => {
    if (cardId) {
      fetchExpandedCardData(cardId).then((data) => setCardData(data));
    }
  }, [cardId]);

  return (
    <>
      <div className="expanded-card-view">
        <ProfileHeader />
        <div className="expanded-card-content">
          <div className="expanded-card-left">
            {cardProps ? (
              <NormalCard {...cardProps} isInUserBinder={false} />
            ) : (
              <p>No card details available</p>
            )}
          </div>
          <div className="expanded-card-right">
            <div className='expanded-card-right--info'>
              {cardData ? (
                <>
                  <h1 className='expanded-card-right--title'>
                    {cardData.name}{' '}
                    <span className='expanded-card-right--subtitle'>
                      ({cardData.supertype} - {cardData.subtypes?.[0] || 'Unknown'})
                    </span>
                  </h1>
                  <div className='expanded-card-right--attributes'>
                    <p>HP: {cardData.hp}</p>
                    {cardData.types?.[0] ? (
                      <img 
                        src={typeImages[cardData.types[0]] || grass} 
                        alt={cardData.types[0]} 
                      />
                    ) : (
                      <span>N/A</span>
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
                  <div className='card-prices--header'>
                    <h2>PRICES</h2>
                    {cardData.tcgplayer.url ? (
                      <a href={cardData.tcgplayer.url}>
                        Buy on TCGPlayer
                      </a>
                    ) : (
                      <button disabled style={{ textDecoration: 'underline', background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>
                        Buy on TCGPlayer
                      </button>
                    )}
                    <span> Updated: {cardData.tcgplayer.updatedAt}</span>
                  </div>
                  <div className='expanded-card-right--prices'>
                    {['normal', 'reverseHolofoil'].map((condition, index) => (
                      cardData.tcgplayer.prices[condition] ? (
                        <div key={index} className='expanded-card-right--prices-item'>
                          <h3>{condition.charAt(0).toUpperCase() + condition.slice(1)}:</h3>
                          <p>Low: ${cardData.tcgplayer.prices[condition].low}</p>
                          <p>Mid: ${cardData.tcgplayer.prices[condition].mid}</p>
                          <p>High: ${cardData.tcgplayer.prices[condition].high}</p>
                        </div>
                      ) : (
                        <div key={index} className='expanded-card-right--prices-item'>
                          <h3>{condition.charAt(0).toUpperCase() + condition.slice(1)}:</h3>
                          <p>N/A</p>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div className='card-prices--header'>
                    <h2>PRICES</h2>
                    <button disabled style={{ textDecoration: 'underline', background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>
                      Buy on TCGPlayer
                    </button>
                    <span> Updated: N/A</span>
                  </div>
                  <div className='expanded-card-right--prices'>
                    <div className='expanded-card-right--prices-item'>
                      <h3>Normal:</h3>
                      <p>N/A</p>
                    </div>
                    <div className='expanded-card-right--prices-item'>
                      <h3>Reverse Holofoil:</h3>
                      <p>N/A</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="card-attack">
              <h2>ATTACKS/ABILITIES</h2>
              {/* Render abilities above attacks */}
              {cardData?.abilities?.length > 0 ? (
                cardData.abilities.map((ability, index) => (
                  <div className="card-ability" key={index}>
                    {/* Ability layout: icon and name above text */}
                    <div className='card-ability--header'>
                      <img src={abilityIcon} alt="Ability Icon" className="card-ability--icon" />
                      <h2 className='card-ability--name name-italic'>{ability.name}</h2>
                    </div>
                    <p className='card-ability--text'>{ability.text}</p>
                  </div>
                ))
              ) : (
                <p>N/A</p>
              )}
              {/* Render attacks below abilities */}
              {cardData?.attacks?.length > 0 ? (
                cardData.attacks.map((attack, index) => (
                  <div className="card-ability" key={index}>
                    <div className='card-ability--info'>
                      <div className='card-ability--types'>
                        {attack.cost.map((type, idx) => (
                          <img 
                            key={idx} 
                            src={typeImages[type] || grass} 
                            alt={type} 
                          />
                        ))}
                      </div>
                      <div className='card-ability--ability'>
                        <h2 className='card-ability--name'>{attack.name}</h2>
                        <h2 className='card-ability--damage'>{attack.damage}</h2>
                      </div>
                    </div>
                    <p>{attack.text}</p>
                  </div>
                ))
              ) : (
                <p>N/A</p>
              )}
            </div>
            <div className="card-rule">
              <h2>RULES</h2>
              {/* Add dynamic rules here if available in cardData */}
            </div>
            <div className="card-additional-info">
              {/* Always render Weakness box */}
              <div className='weakness'>
                <span>WEAKNESS</span>
                {cardData?.weaknesses?.length > 0 ? (
                  cardData.weaknesses.map((weakness, index) => (
                    <div key={index} className='card-additional-info--container'>
                      <img 
                        src={typeImages[weakness.type] || grass} 
                        alt={weakness.type} 
                      />
                      <p>{weakness.value}</p>
                    </div>
                  ))
                ) : (
                  <p>N/A</p>
                )}
              </div>
              {/* Always render Resistance box */}
              <div className='weakness'>
                <span>RESISTANCE</span>
                {cardData?.resistances?.length > 0 ? (
                  cardData.resistances.map((resistance, index) => (
                    <div key={index} className='card-additional-info--container'>
                      <img 
                        src={typeImages[resistance.type] || grass} 
                        alt={resistance.type} 
                      />
                      <p>{resistance.value}</p>
                    </div>
                  ))
                ) : (
                  <p>N/A</p>
                )}
              </div>
              {/* Always render Retreat Cost box */}
              <div className='weakness'>
                <span>RETREAT COST</span>
                {cardData?.retreatCost?.length > 0 ? (
                  <div className='card-additional-info--container'>
                    {cardData.retreatCost.map((type, index) => (
                      <img 
                        key={index} 
                        src={typeImages[type] || grass} 
                        alt={type} 
                      />
                    ))}
                  </div>
                ) : (
                  <p>N/A</p>
                )}
              </div>
              {/* Always render Rarity box */}
              <div className='weakness'>
                <span>RARITY</span>
                <p>{cardData?.rarity || 'N/A'}</p>
              </div>
              {/* Always render Set box with anchor tag */}
              <div className='weakness'>
                <span>SET</span>
                {cardData?.set?.name ? (
                  <a href={`/set/${cardData.set.name}`}>
                    {cardData.set.name}
                  </a>
                ) : (
                  <p>N/A</p>
                )}
              </div>
              {/* Always render Number box */}
              <div className='weakness'>
                <span>NUMBER</span>
                <p>{cardData?.number || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExpandedCardView;
