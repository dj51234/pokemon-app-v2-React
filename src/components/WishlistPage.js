import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../js/firebase';
import CardItem from '../components/CardItem';
import Header from '../components/Header';
import ProfileHeader from '../components/ProfileHeader';
import MobileHeader from '../components/MobileHeader';
import CustomAlert from '../components/CustomAlert';
import '../styles/WishlistPage.css';

const WishlistPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState(null);

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

  const removeCard = async (cardId) => {
    try {
      setWishlist((prevWishlist) => prevWishlist.filter((id) => id !== cardId));
      const userDocRef = doc(firestore, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        wishlist: wishlist.filter((id) => id !== cardId),
      });
      setAlertMessage('Card removed from wishlist!');
    } catch (error) {
      console.error('Error removing card from wishlist:', error);
    }
  };

  const closeAlert = () => {
    setAlertMessage(null);
  };

  return (
    <>
      {currentUser ? <ProfileHeader /> : <Header />}
      <MobileHeader />

      <div className="wishlist-page">
        <div className="wishlist-container">
          <div className="wishlist-content">
            <h1>My Wishlist</h1>
            {!loading && wishlist.length > 0 && (
              <Link to="/pokedex" className='add-wishlist-link'>Add more cards +</Link>
            )}
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
        {alertMessage && <CustomAlert message={alertMessage} onClose={closeAlert} />}
      </div>
    </>
  );
};

export default WishlistPage;
