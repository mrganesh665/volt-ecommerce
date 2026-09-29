import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { storage } from '../services/storage.service';

const WISHLIST_STORAGE_KEY = '@volttech_wishlist_items';

interface WishlistContextType {
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType>({
  favorites: [],
  toggleFavorite: () => {},
  isFavorite: () => false,
  clearWishlist: () => {},
});

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Product[]>([]);

  useEffect(() => {
    storage.getItem<Product[]>(WISHLIST_STORAGE_KEY).then((saved) => {
      if (saved) setFavorites(saved);
    });
  }, []);

  const saveFavorites = (newFavs: Product[]) => {
    setFavorites(newFavs);
    storage.setItem(WISHLIST_STORAGE_KEY, newFavs);
  };

  const toggleFavorite = (product: Product) => {
    const exists = favorites.some((p) => p.id === product.id);
    if (exists) {
      saveFavorites(favorites.filter((p) => p.id !== product.id));
    } else {
      saveFavorites([product, ...favorites]);
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.some((p) => p.id === productId);
  };

  const clearWishlist = () => {
    saveFavorites([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
