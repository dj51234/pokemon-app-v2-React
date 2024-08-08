// src/pages/WishlistPage.js

import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../js/firebase';
import CardItem from '../components/CardItem';
import Header from '../components/Header';
import ProfileHeader from '../components/ProfileHeader';
import '../styles/WishlistPage.css';

const WishlistPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (currentUser) {
        const userDocRef = doc(firestore, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const wishlistData = userData.wishlist || [];
          setWishlist(wishlistData);
        }
      }
      setLoading(false);
    };

    fetchWishlist();
  }, [currentUser]);

  const removeCard = (cardId) => {
    setWishlist((prevWishlist) => prevWishlist.filter((id) => id !== cardId));
  };

  return (
    <div className="wishlist-page">
      {currentUser ? <ProfileHeader /> : <Header />}
      <div className="wishlist-container">
        <div className="wishlist-content">
          <h1>Your Wishlist</h1>
          {loading ? (
            <div className="loading-container">
              <p>Loading...</p>
            </div>
          ) : wishlist.length === 0 ? (
            <p>No cards in your wishlist yet. <Link to="/pokedex">Add cards now <span>+</span></Link></p>
          ) : (
            <div className="wishlist-grid">
              {wishlist.map((cardId) => (
                <CardItem key={cardId} cardId={cardId} removeCard={removeCard} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
