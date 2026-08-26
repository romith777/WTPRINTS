import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import Products from './pages/Products';
import ProductSingle from './pages/ProductSingle';
import './App.css';
import './products-render.css';
import './cart.css';
import './login.css';
import './favPage.css';
import './productSinglePage.css';

function App() {
  return (
    <StoreProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductSingle />} />
        </Routes>
      </Router>
    </StoreProvider>
  );
}
export default App;




