import React from 'react';
import { useLocation } from 'react-router-dom';
import ProfileHeader from './ProfileHeader';
import NormalCard from './NormalCard';
import '../styles/ExpandedCardView.css';
import grass from '../assets/types/grass.png';

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
                <img src={grass} alt='Joltik' />
                </div>
            </div>
            <div className="card-prices">
                <h2>Prices</h2>
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
                <h2>Attacks</h2>
                <h2>Poisonous Musculature</h2>
                <p>Search your deck for up to 2 Basic Darkness Energy cards and attach them to this Pokémon. Then, shuffle your deck. If you attached Energy to a Pokémon in this way, this Pokémon is now Poisoned.</p>
                <p>Damage: 10</p>
            </div>
            <div className="card-ability">
                <div className='card-ability--info'>
                <div className='card-ability--types'>
                    <img src={grass} alt='Joltik' />
                    <img src={grass} alt='Joltik' />
                </div>
                <div className='card-ability--ability'>
                    <h2 className='card-ability--name'>Chain-Crazed</h2>
                    <h2 className='card-ability--damage'>130+</h2>
                </div>
                </div>
                <p>If this Pokémon is Poisoned, this attack does 130 more damage.</p>
            </div>
            <div className="card-attack">
                <h2>Rules</h2>
                <p>Search your deck for up to 2 Basic Darkness Energy cards and attach them to this Pokémon. Then, shuffle your deck. If you attached Energy to a Pokémon in this way, this Pokémon is now Poisoned.</p>
            </div>
            <div className="card-additional-info">
                <div className='weakness'>
                    <p>Weak x2</p>
                </div>
                <div className='weakness'>
                    <p>Weak x2</p>
                </div>
                <div className='weakness'>
                    <p>Weak x2</p>
                </div>
                <div className='weakness'>
                    <p>Weak x2</p>
                </div>
                <div className='weakness'>
                    <p>Weak x2</p>
                </div>
                <div className='weakness'>
                    <p>Weak x2</p>
                </div>
                <div className='weakness'>
                    <p>Weak x2</p>
                </div>
                <div className='weakness'>
                    <p>Weak x2</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandedCardView;
