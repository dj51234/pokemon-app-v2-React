import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProfileHeader from './ProfileHeader';
import NormalCard from './NormalCard';
import '../styles/ExpandedCardView.css';
import grass from '../assets/types/grass.png';
import { fetchExpandedCardData } from '../js/pack_algorithm/packAlgorithm'; // Import the function


const ExpandedCardView = () => {
  const location = useLocation();
  const { cardProps } = location.state || {};  // Retrieve the cardProps from the location state

  return (
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
                <h1 className='expanded-card-right--title'>Joltik <span className='expanded-card-right--subtitle'>(Pokémon - Basic)</span></h1>
                <div className='expanded-card-right--attributes'>
                    <p>HP: 30</p>
                    <img src={grass} alt='grass type' />
                </div>
            </div>
            <div className="card-prices">
                <div className='card-prices--header'>
                    <h2>PRICES</h2>
                    <a href={'/'}>Buy on TCGPlayer</a> 
                    <span> Updated: 2021/08/04</span>
                </div>
                <div className='expanded-card-right--prices'>
                <div className='expanded-card-right--prices-item'>
                    <h3>Low:</h3>
                    <p>$0.25</p>
                    </div>
                    <div className='expanded-card-right--prices-item'>
                    <h3>Mid:</h3>
                    <p>$0.25</p>
                    </div>
                    <div className='expanded-card-right--prices-item'>
                    <h3>High:</h3>
                    <p>$0.25</p>
                    </div>
                </div>
            </div>
            <div className="card-attack">
                <h2>ATTACKS/ABILITIES</h2>
            </div>
            <div className="card-ability">
                <div className='card-ability--info'>
                <div className='card-ability--types'>
                    <img src={grass} alt='grass type' />
                    <img src={grass} alt='grass type' />
                </div>
                <div className='card-ability--ability'>
                    <h2 className='card-ability--name'>Chain-Crazed</h2>
                    <h2 className='card-ability--damage'>130+</h2>
                </div>
                </div>
                <p>If this Pokémon is Poisoned, this attack does 130 more damage.</p>
            </div>
            <div className="card-ability">
                <div className='card-ability--info'>
                    <div className='card-ability--types'>
                        <img src={grass} alt='grass type' />
                        <img src={grass} alt='grass type' />
                    </div>
                    <div className='card-ability--ability'>
                        <h2 className='card-ability--name'>Chain-Crazed</h2>
                        <h2 className='card-ability--damage'>130+</h2>
                    </div>
                </div>
                <p>If this Pokémon is Poisoned, this attack does 130 more damage.</p>
            </div>
            <div className="card-rule">
                <h2>RULES</h2>
                <p>Search your deck for up to 2 Basic Darkness Energy cards and attach them to this Pokémon. Then, shuffle your deck. If you attached Energy to a Pokémon in this way, this Pokémon is now Poisoned.</p>
            </div>
            <div className="card-additional-info">
                <div className='weakness'>
                    <span>WEAKNESS</span>
                    <div className='card-additional-info--container'>
                        <img src={grass} alt='grass type' />
                        <p>x2</p>
                    </div>
                </div>
                <div className='weakness'>
                    <span>RESISTANCE</span>
                    <div className='card-additional-info--container'>
                        <img src={grass} alt='grass type' />
                        <p>-30</p>
                    </div>
                </div>
                <div className='weakness'>
                    <span>RETREAT COST</span>
                    <div className='card-additional-info--container'>
                        <img src={grass} alt='grass type' />
                    </div>
                </div>
                <div className='weakness'>
                    <span>RARITY</span>
                    <p>Rare</p>
                </div>
                <div className='weakness'>
                    <span>SET</span>
                    <a href={'/'}>Vivid Voltage</a>
                </div>
                <div className='weakness'>
                    <span>NUMBER</span>
                    <p>10</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandedCardView;
