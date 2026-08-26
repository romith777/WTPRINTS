import React, { createContext, useState, useEffect } from 'react';

export const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = sessionStorage.getItem('wtp-react-cart');
      if (saved && saved !== 'undefined') return JSON.parse(saved);
    } catch (e) { console.error(e); }
    return [];
  });
  
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = sessionStorage.getItem('wtp-react-favs');
      if (saved && saved !== 'undefined') return JSON.parse(saved);
    } catch (e) { console.error(e); }
    return [];
  });

  const [allProducts, setAllProducts] = useState({
    tees: [], hoodies: [], cargos: [], shirts: [], jeans: [], joggers: []
  });
  
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    sessionStorage.setItem('wtp-react-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    sessionStorage.setItem('wtp-react-favs', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    fetch("http://localhost:5510/api/products")
      .then(res => res.json())
      .then(data => {
        if(data.success && data.products) {
          setAllProducts(data.products);
        }
      })
      .catch(err => console.error("Error fetching backend products:", err));
  }, []);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item => item._id === product._id ? { ...item, quantity: item.quantity + (product.quantity || 1) } : item);
      }
      return [...prev, { ...product, quantity: product.quantity || 1, selectedSize: product.selectedSize || 'M' }];
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    setCart(prev => prev.map(item => item._id === productId ? { ...item, quantity: newQuantity } : item));
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item._id !== productId));
  };

  const toggleFavorite = (product) => {
    setFavorites(prev => {
      const exists = prev.find(item => item._id === product._id);
      if (exists) return prev.filter(item => item._id !== product._id);
      return [...prev, product];
    });
  };

  return (
    <StoreContext.Provider value={{ 
      cart, favorites, addToCart, updateQuantity, removeFromCart, toggleFavorite,
      allProducts, searchQuery, setSearchQuery
    }}>
      {children}
    </StoreContext.Provider>
  );
}
