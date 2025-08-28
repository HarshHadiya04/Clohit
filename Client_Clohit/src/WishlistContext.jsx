import React, { createContext, useContext, useState } from 'react';

// Create Wishlist Context
const WishlistContext = createContext();

// Wishlist Provider that will wrap around components
export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);

    return (
        <WishlistContext.Provider value={{ wishlist, setWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

// Custom hook to use the Wishlist context
export const useWishlist = () => {
    const context = useContext(WishlistContext);

    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }

    return context;
};
