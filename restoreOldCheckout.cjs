const fs = require('fs');

// 1. Restore Checkout.jsx
const checkoutCode = `import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import '../styles/payment.css'; // Uses the original payment.css

function formatCurrency(priceCents) {
  return (priceCents / 100).toFixed(2);
}

function Checkout() {
  const { cart } = useContext(StoreContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'online',
    orderNote: '',
    terms: false
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('wt_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setFormData(prev => ({
          ...prev,
          fullName: user.name || user.username || '',
          email: user.email || ''
        }));
      }
    } catch(e) {}
  }, []);

  const itemCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  const subtotal = cart.reduce((total, item) => total + (item.priceCents || 0) * (item.quantity || 1), 0);
  const shipping = itemCount > 0 ? 5000 : 0; 
  const tax = Math.round(subtotal * 0.05); 
  const total = subtotal + shipping + tax;

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({...formData, [e.target.name]: value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    if (!formData.terms) {
      alert("Please agree to the Terms & Conditions.");
      return;
    }
    
    setLoading(true);
    localStorage.setItem('checkoutFormData', JSON.stringify(formData));
    
    // If COD, skip Razorpay processing
    if (formData.paymentMethod === 'cod') {
      setTimeout(() => {
        navigate('/payment-status?status=success');
      }, 1000);
      return;
    }

    setTimeout(() => {
      navigate('/payment-status?status=initiate');
    }, 100);
  };

  return (
    <div className="payment-body">
      <main className="payment-form-wrap">
        <h1 className="payment-page-title">Checkout</h1>
        <form id="checkout-form" onSubmit={handleSubmit} noValidate>
          
          <div className="payment-card">
              <h2 className="payment-section-title">
                  <span className="section-num">1</span>
                  Delivery Information
              </h2>
              <div className="form-grid">
                  <div className="field-group">
                      <label htmlFor="fullName">Full Name *</label>
                      <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Name" />
                  </div>
                  <div className="field-group">
                      <label htmlFor="email">Email Address *</label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@email.com" />
                  </div>
                  <div className="field-group">
                      <label htmlFor="phone">Phone Number *</label>
                      <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+91 00000 00000" pattern="[0-9+\\\\s\\\\-]{7,15}" />
                  </div>
                  <div className="field-group field-full">
                      <label htmlFor="address1">Address Line 1 *</label>
                      <input type="text" id="address1" name="address1" value={formData.address1} onChange={handleChange} required placeholder="House / Flat No., Street Name" />
                  </div>
                  <div className="field-group field-full">
                      <label htmlFor="address2">Address Line 2</label>
                      <input type="text" id="address2" name="address2" value={formData.address2} onChange={handleChange} placeholder="Landmark, Area (optional)" />
                  </div>
                  <div className="field-group">
                      <label htmlFor="city">City *</label>
                      <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required placeholder="Guntur" />
                  </div>
                  <div className="field-group">
                      <label htmlFor="state">State *</label>
                      <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} required placeholder="Andhra Pradesh" />
                  </div>
                  <div className="field-group">
                      <label htmlFor="pincode">PIN Code *</label>
                      <input type="text" id="pincode" name="pincode" value={formData.pincode} onChange={handleChange} required placeholder="250202" maxLength="6" pattern="[0-9]{6}" />
                  </div>
              </div>
          </div>

          <div className="payment-card">
              <h2 className="payment-section-title">
                  <span className="section-num">2</span>
                  Payment Method
              </h2>
              <div className="payment-options">
                  <label className="payment-option">
                      <input type="radio" name="paymentMethod" value="online" checked={formData.paymentMethod === 'online'} onChange={handleChange} />
                      <div className="option-card">
                          <div className="option-icon">💳</div>
                          <div className="option-info">
                              <h4>Cards, UPI &amp; Wallets</h4>
                              <p>Pay online securely</p>
                          </div>
                          <div className="option-radio-dot"></div>
                      </div>
                  </label>
                  <label className="payment-option">
                      <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleChange} />
                      <div className="option-card">
                          <div className="option-icon">💵</div>
                          <div className="option-info">
                              <h4>Cash on Delivery</h4>
                              <p>Pay when you receive</p>
                          </div>
                          <div className="option-radio-dot"></div>
                      </div>
                  </label>
              </div>
          </div>

          <div className="payment-card">
              <h2 className="payment-section-title">
                  <span className="section-num">3</span>
                  Order Instructions <span className="optional-tag">(Optional)</span>
              </h2>
              <div className="field-group">
                  <label htmlFor="orderNote">Special instructions for your order</label>
                  <textarea id="orderNote" name="orderNote" rows="3" value={formData.orderNote} onChange={handleChange} placeholder="Special packaging? Gift wrap? Drop-off instructions?"></textarea>
              </div>
          </div>

          <div className="form-footer">
              <label className="checkbox-label">
                  <input type="checkbox" id="terms" name="terms" checked={formData.terms} onChange={handleChange} required />
                  <span className="checkbox-box"></span>
                  I agree to the <a href="#">Terms &amp; Conditions</a> and <a href="#">Privacy Policy</a>
              </label>
              <button type="submit" className="checkout-btn" disabled={loading}>
                  {loading ? 'Processing...' : \`Place Order & Pay  ₹\${formatCurrency(total)}\`}
              </button>
          </div>
        </form>
      </main>

      <aside className="payment-summary">
          <div className="summary-sticky">
              <h2 className="checkout-title">Order Summary</h2>

              <div className="summary-items">
                {cart.map((item, idx) => (
                  <div key={idx} style={{display: 'flex', gap: '15px', marginBottom: '15px', alignItems: 'center'}}>
                    <img src={Array.isArray(item.image) ? item.image[0] : item.image} alt="product" style={{width: '60px', height: '60px', borderRadius: '6px', objectFit: 'cover'}} />
                    <div style={{flex: 1}}>
                      <p style={{margin: '0 0 5px', fontWeight: 'bold', fontSize: '14px', color: '#333'}}>{item.brandName || item.name}</p>
                      <p style={{margin: 0, fontSize: '12px', color: '#777'}}>Qty: {item.quantity}</p>
                    </div>
                    <p style={{margin: 0, fontWeight: 'bold', color: '#111'}}>{'\\u20B9'}{formatCurrency(item.priceCents * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="coupon-row">
                  <input type="text" placeholder="Coupon code" />
                  <button type="button" className="coupon-btn">Apply</button>
              </div>

              <div className="checkout-item">
                  <span>Items (<span>{itemCount}</span>):</span>
                  <span>₹<span>{formatCurrency(subtotal)}</span></span>
              </div>
              <div className="checkout-item">
                  <span>Shipping:</span>
                  <span>₹<span>{formatCurrency(shipping)}</span></span>
              </div>
              <div className="checkout-item">
                  <span>Tax (5%):</span>
                  <span>₹<span>{formatCurrency(tax)}</span></span>
              </div>
              <div className="checkout-item total">
                  <span>Total:</span>
                  <span>₹<span>{formatCurrency(total)}</span></span>
              </div>

              <Link to="/cart" className="continue-shopping">← Back to Cart</Link>
          </div>
      </aside>
    </div>
  );
}

export default Checkout;
`;
fs.writeFileSync('src/pages/Checkout.jsx', checkoutCode, 'utf8');

// 2. Rewrite PaymentStatus.jsx
const paymentStatusCode = `import React, { useEffect, useState, useContext, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';

function PaymentStatus() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status') || 'processing';
  const navigate = useNavigate();
  const { cart } = useContext(StoreContext);
  
  const [displayStatus, setDisplayStatus] = useState(status === 'initiate' ? 'processing' : status);
  const initiated = useRef(false);

  useEffect(() => {
    if (status === 'initiate' && !initiated.current) {
      initiated.current = true;
      setDisplayStatus('processing');
      initiateRazorpay();
    } else if (status !== 'initiate') {
      setDisplayStatus(status);
    }
  }, [status]);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => { resolve(true); };
      script.onerror = () => { resolve(false); };
      document.body.appendChild(script);
    });
  };

  const initiateRazorpay = async () => {
    if (cart.length === 0) {
      navigate('/payment-status?status=failed');
      return;
    }

    const itemCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    const subtotal = cart.reduce((total, item) => total + (item.priceCents || 0) * (item.quantity || 1), 0);
    const shipping = itemCount > 0 ? 5000 : 0; 
    const tax = Math.round(subtotal * 0.05); 
    const total = subtotal + shipping + tax;

    let formData = {};
    try {
      formData = JSON.parse(localStorage.getItem('checkoutFormData')) || {};
    } catch(e) {}

    const res = await loadRazorpay();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      navigate('/payment-status?status=failed');
      return;
    }

    try {
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total })
      });
      const order = await orderRes.json();
      
      if (!order.id) {
        alert("Server error. Check your Razorpay keys.");
        navigate('/payment-status?status=failed');
        return;
      }

      const options = {
        key: order.key_id || 'rzp_test_dummy', 
        amount: order.amount,
        currency: order.currency,
        name: "WTPRINTS",
        description: "Secure Payment",
        order_id: order.id,
        handler: async function (response) {
          setDisplayStatus('processing');
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response)
            });
            const verify = await verifyRes.json();
            if (verify.status === "ok") {
              navigate('/payment-status?status=success');
            } else {
              navigate('/payment-status?status=failed');
            }
          } catch(e) {
            navigate('/payment-status?status=failed');
          }
        },
        modal: {
          ondismiss: function() {
            navigate('/payment-status?status=cancelled');
          }
        },
        prefill: {
          name: formData.fullName || "",
          email: formData.email || "",
          contact: formData.phone || ""
        },
        theme: { color: "#ee0652" }
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        navigate('/payment-status?status=failed');
      });
      rzp.open();
    } catch (err) {
      navigate('/payment-status?status=failed');
    }
  };

  const renderContent = () => {
    if (displayStatus === 'success') {
      return (
        <>
          <div style={{width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#e8f5e9', color: '#2e7d32', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', margin: '0 auto 20px'}}>
            ✓
          </div>
          <h1 style={{fontFamily: 'Boldonse, sans-serif', fontSize: '32px', color: '#111'}}>Payment Successful!</h1>
          <p style={{color: '#666', fontSize: '16px', maxWidth: '400px', margin: '0 auto 30px', lineHeight: '1.6'}}>
            Thank you for your order. We have received your payment and are currently processing your order. You'll receive an email confirmation shortly.
          </p>
          <div style={{display: 'flex', gap: '15px', justifyContent: 'center'}}>
            <Link to="/profile" style={{padding: '12px 25px', backgroundColor: '#ee0652', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold'}}>View My Orders</Link>
            <Link to="/" style={{padding: '12px 25px', backgroundColor: '#111', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold'}}>Continue Shopping</Link>
          </div>
        </>
      );
    } 
    else if (displayStatus === 'failed' || displayStatus === 'cancelled') {
      return (
        <>
          <div style={{width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#ffebee', color: '#c62828', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', margin: '0 auto 20px'}}>
            ✗
          </div>
          <h1 style={{fontFamily: 'Boldonse, sans-serif', fontSize: '32px', color: '#111'}}>Payment {displayStatus === 'cancelled' ? 'Cancelled' : 'Failed'}</h1>
          <p style={{color: '#666', fontSize: '16px', maxWidth: '400px', margin: '0 auto 30px', lineHeight: '1.6'}}>
            {displayStatus === 'cancelled' 
              ? "You cancelled the payment process. Your cart has been saved so you can complete your purchase later."
              : "We couldn't process your payment. Please check your payment details and try again, or use a different payment method."
            }
          </p>
          <div style={{display: 'flex', gap: '15px', justifyContent: 'center'}}>
            <Link to="/checkout" style={{padding: '12px 25px', backgroundColor: '#ee0652', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold'}}>Try Again</Link>
          </div>
        </>
      );
    }
    else {
      return (
        <>
          <div style={{width: '80px', height: '80px', borderRadius: '50%', border: '4px solid #f3f3f3', borderTop: '4px solid #ee0652', animation: 'spin 1s linear infinite', margin: '0 auto 20px'}} />
          <h1 style={{fontFamily: 'Boldonse, sans-serif', fontSize: '28px', color: '#111'}}>Processing Payment...</h1>
          <p style={{color: '#ee0652', fontSize: '18px', fontWeight: 'bold', margin: '15px 0'}}>Please do not press back or refresh the page.</p>
          <p style={{color: '#666', fontSize: '15px'}}>We are securely connecting to Razorpay to complete your order.</p>
          <style>{\`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }\`}</style>
        </>
      );
    }
  };

  return (
    <div style={{backgroundColor: '#fafafa', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'}}>
        <div style={{backgroundColor: 'white', padding: '60px 40px', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', textAlign: 'center', maxWidth: '600px', width: '100%', border: '1px solid #eaeaea'}}>
          {renderContent()}
        </div>
    </div>
  );
}

export default PaymentStatus;
`;
fs.writeFileSync('src/pages/PaymentStatus.jsx', paymentStatusCode, 'utf8');
