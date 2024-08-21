export const wishlistUtils = {
    wishlist: [],
    
    setWishlist: function(newWishlist) {
      this.wishlist = newWishlist;
      window.dispatchEvent(new Event('wishlistUpdated'));
    },
    
    isCardInWishlist: function(cardId) {
      return this.wishlist.includes(cardId);
    },
    
    removeCardFromWishlist: function(cardId) {
      this.wishlist = this.wishlist.filter(id => id !== cardId);
      window.dispatchEvent(new Event('wishlistUpdated'));
      window.dispatchEvent(new Event('cardRemovedFromWishlist'));
    }
  };
  