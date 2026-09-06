import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Login from './pages/Login'
import UserProfile from './pages/UserProfile';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PaymentStatus from './pages/PaymentStatus';
import Favorites from './pages/Favorites';
import Products from './pages/Products';
import ProductSingle from './pages/ProductSingle';
import './styles/App.css';
import './styles/products-render.css';
import './styles/cart.css';
import './styles/login.css';
import './styles/favPage.css';
import './styles/productSinglePage.css';

function App() {
  return (
    <StoreProvider>
      <Toaster position="top-right" toastOptions={{ style: { fontSize: '14px', fontWeight: 'bold' } }} />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment-status" element={<PaymentStatus />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductSingle />} />
        </Routes>
      </Router>
    </StoreProvider>
  );
}
export default App;





