import React, { createContext, useContext, useState } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const addCardToWishlist = (cardId) => {
    setWishlist((prevWishlist) => [...prevWishlist, cardId]);
  };

  const removeCardFromWishlist = (cardId) => {
    setWishlist((prevWishlist) => prevWishlist.filter((id) => id !== cardId));
  };

  return (
    <WishlistContext.Provider value={{ wishlist, setWishlist, addCardToWishlist, removeCardFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
