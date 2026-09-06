import React, { createContext, useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

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
  const [token, setToken] = useState(() => localStorage.getItem('wtp-token') || "");
  useEffect(() => { localStorage.setItem('wtp-token', token); }, [token]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    sessionStorage.setItem('wtp-react-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    sessionStorage.setItem('wtp-react-favs', JSON.stringify(favorites));
  }, [favorites]);

  
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (!token) return;

    const handler = setTimeout(() => {
      fetch('/api/sync-user-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cart, favorites })
      }).catch(err => console.error("Failed to sync data", err));
    }, 5000);

    return () => clearTimeout(handler);
  }, [cart, favorites, token]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if(data.success && data.products) {
          setAllProducts(data.products);
        }
        setIsLoading(false);
      })
      .catch(err => { console.error('Error fetching backend products:', err); setIsLoading(false); });
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
    toast.success('Removed from cart');
  };

  const clearCart = () => setCart([]);

  const toggleFavorite = (product) => {
    setFavorites(prev => {
      const exists = prev.find(item => item._id === product._id);
      if (exists) {
        toast.success('Removed from favorites');
        return prev.filter(item => item._id !== product._id);
      }
      toast.success('Added to favorites');
      return [...prev, product];
    });
  };

  return (
    <StoreContext.Provider value={{ 
      cart, setCart, favorites, setFavorites, addToCart, updateQuantity, removeFromCart, clearCart, toggleFavorite,
      allProducts, searchQuery, setSearchQuery, isLoading, token, setToken
    }}>
      {children}
    </StoreContext.Provider>
  );
}




