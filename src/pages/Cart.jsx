import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { StoreContext } from '../context/StoreContext';

function formatCurrency(priceCents) {
  return (priceCents / 100).toFixed(2);
}

function Cart() {
  const { cart, updateQuantity, removeFromCart, token } = useContext(StoreContext);
  const navigate = useNavigate();

  const itemCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  const subtotal = cart.reduce((total, item) => total + (item.priceCents || 0) * (item.quantity || 1), 0);
  const shipping = itemCount > 0 ? 5000 : 0; // ₹50 shipping if items exist
  const tax = Math.round(subtotal * 0.05); // 5% tax
  const total = subtotal + shipping + tax;

  const handleCheckoutNavigate = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    if (!token) {
      alert("Please login to proceed to checkout.");
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div>
      <Navbar />
      <div className="new-body js-cart-body" id="main">
        <div className="cart-body">
          <h1 className="cart-page-title">Shopping Cart</h1>
          <div className="cart-render">
            {cart.length === 0 ? (
              <div className="no-cart-div">
                <div className="no-cart-icon">
                  <img src="/assets/cart-icon.png" alt="cart-img" />
                </div>
                <div className="no-cart-text">
                  <h1>Your Cart is Empty</h1>
                  <p>Add some products to get started!</p>
                  <Link to="/"><button className="shop-now-btn" style={{backgroundColor: '#ee0652', color:'white', padding: '10px 20px', border:'none', borderRadius:'5px', cursor:'pointer', marginTop:'15px', fontWeight:'bold'}}>Shop Now</button></Link>
                </div>
              </div>
            ) : (
              cart.map((product) => (
                <div key={product._id} className="browse-card" style={{display: 'flex', flexDirection: 'row', gap: '20px', marginBottom: '20px'}}>
                  <Link to={`/product/${product._id}`} style={{ cursor: 'pointer', flexShrink: 0 }}>
                    <div className="browse-card-img" style={{ width: '150px', height: '150px' }}>
                      <img src={Array.isArray(product.image) ? product.image[0] : product.image} alt={product.name} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                    </div>
                  </Link>
                  <div className="browse-card-information" style={{ flex: 1, padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div className="browse-card-details">
                      <div className="browse-card-information-area-text">
                        <p className="browse-card-brand" style={{fontWeight: 'bold', color: '#ee0652'}}>{product.brandName}</p>
                        <p className="browse-card-about" style={{color: '#666'}}>{product.about || product.name}</p>
                        <p className="browse-card-size">Size: <strong>{product.selectedSize || 'M'}</strong></p>
                        <p className="browse-card-price" style={{fontWeight: 'bold', fontSize: '18px', marginTop: '10px'}}>{'\u20B9'}{formatCurrency(product.priceCents)}</p>
                      </div>
                    </div>
                    <div className="browse-card-actions" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px'}}>
                      <div className="cart-action-row" style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                        <div className="quantity-display">
                          <span style={{color: '#666'}}>Quantity: <strong>{product.quantity}</strong></span>
                        </div>
                        <div className="quantity-controls" style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                          <button className="quantity-btn minus-btn" onClick={() => updateQuantity(product._id, product.selectedSize, product.quantity - 1)} style={{padding:'5px 10px', cursor:'pointer'}}>-</button>
                          <input type="number" className="quantity-input" value={product.quantity} readOnly style={{width: '40px', textAlign: 'center', padding:'5px'}} />
                          <button className="quantity-btn plus-btn" onClick={() => updateQuantity(product._id, product.selectedSize, product.quantity + 1)} style={{padding:'5px 10px', cursor:'pointer'}}>+</button>
                        </div>
                      </div>
                      <div className="cart-buttons">
                        <button className="remove-product-cart-button" onClick={() => removeFromCart(product._id, product.selectedSize)} style={{backgroundColor: '#ffebee', color: '#ee0652', border: '1px solid #ee0652', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer'}}>Remove</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <aside className="cart-checkout">
          <div className="checkout-sticky">
            <h2 className="checkout-title">Order Summary</h2>
            <div className="checkout-item" style={{display: 'flex', justifyContent: 'space-between', margin: '15px 0'}}>
              <span>Items (<span>{itemCount}</span>):</span>
              <span>{'\u20B9'}<span>{formatCurrency(subtotal)}</span></span>
            </div>
            <div className="checkout-item" style={{display: 'flex', justifyContent: 'space-between', margin: '15px 0'}}>
              <span>Shipping:</span>
              <span>{'\u20B9'}<span>{formatCurrency(shipping)}</span></span>
            </div>
            <div className="checkout-item" style={{display: 'flex', justifyContent: 'space-between', margin: '15px 0'}}>
              <span>Tax (5%):</span>
              <span>{'\u20B9'}<span>{formatCurrency(tax)}</span></span>
            </div>
            <hr style={{borderTop: '1px solid #ccc', margin: '15px 0'}} />
            <div className="checkout-item total" style={{display: 'flex', justifyContent: 'space-between', margin: '15px 0', fontWeight: 'bold', fontSize: '18px'}}>
              <span>Total:</span>
              <span style={{color: '#ee0652'}}>{'\u20B9'}<span>{formatCurrency(total)}</span></span>
            </div>
            <button onClick={handleCheckoutNavigate} style={{width: '100%', padding: '15px', backgroundColor: '#ee0652', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '20px'}}>Proceed to Checkout</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
export default Cart;
