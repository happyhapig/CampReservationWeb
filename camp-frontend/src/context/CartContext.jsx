import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();
const initialCart = JSON.parse(localStorage.getItem('cartItems')) || [];

export const CartProvider = ({ children }) => {

  const [cartItems, setCartItems] = useState(initialCart);
    
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prev) => [...prev, item]);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);