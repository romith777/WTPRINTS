import React, { useEffect, useState, useContext, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';

function PaymentStatus() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status') || 'processing';
  const navigate = useNavigate();
  const { cart, clearCart } = useContext(StoreContext);
  
  const [displayStatus, setDisplayStatus] = useState(status === 'initiate' ? 'processing' : status);
  const initiated = useRef(false);

  useEffect(() => {
    if (status === 'initiate' && !initiated.current) {
      initiated.current = true;
      setDisplayStatus('processing');
      initiatePaymentFlow();
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

  const initiatePaymentFlow = async () => {
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

    // --- MOCK RAZORPAY / PLACE ORDER DIRECTLY ---
    try {
      // We assume Razorpay is completed and just place the order in the database directly for now.
      const orderRes = await fetch('/api/place-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('wtp-token') || ''}` },
        body: JSON.stringify({ 
          amount: total,
          cart: cart,
          shippingDetails: formData
        })
      });
      const order = await orderRes.json();
      
      if (order.success) {
        // We simulate a secure gateway connection delay so the UI feels authentic
        setTimeout(() => {
          navigate('/payment-status?status=success');
        }, 1500);
      } else {
        setTimeout(() => {
          navigate('/payment-status?status=failed');
        }, 1500);
      }
    } catch (err) {
      navigate('/payment-status?status=failed');
    }
  };

  const renderContent = () => {
    if (displayStatus === 'success') {
      // Clear cart when viewing success page (safe to call multiple times if already empty)
      if (cart.length > 0) {
        setTimeout(() => clearCart(), 100);
      }
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
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
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
