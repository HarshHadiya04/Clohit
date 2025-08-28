import React, { createContext, useContext, useState } from 'react';

// Create Wishlist Context
const AddbagContext = createContext();

// Wishlist Provider that will wrap around components
export const AddbagProvider = ({ children }) => {
    const [Addbag, setAddbag] = useState([]);

    return (
        <AddbagContext.Provider value={{ Addbag, setAddbag }}>
            {children}
        </AddbagContext.Provider>
    );
};

// Custom hook to use the Wishlist context
export const useAddbag = () => {
    const context = useContext(AddbagContext);

    if (!context) {
        throw new Error('useAddbag must be used within a AddbagProvider');
    }

    return context;
};
