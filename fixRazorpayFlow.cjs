const fs = require('fs');

// 1. Fix create-order.js (Remove double tax/shipping)
const createOrderCode = `import Razorpay from 'razorpay';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy',
      key_secret: process.env.RAZORPAY_SECRET_KEY || 'dummy_secret'
    });

    // Amount sent from frontend already includes tax and shipping and is in paise/cents.
    const options = {
      amount: Math.round(amount),
      currency: "INR",
      receipt: "receipt_" + Date.now()
    };

    const order = await razorpay.orders.create(options);
    
    // Pass back the Key ID to the client
    res.status(200).json({ ...order, key_id: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error("Razorpay Create Order Error:", err);
    res.status(500).json({ error: err.message });
  }
}
`;
fs.writeFileSync('api/create-order.js', createOrderCode, 'utf8');


// 2. Refactor Checkout.jsx to navigate instead of launching razorpay
let checkout = fs.readFileSync('src/pages/Checkout.jsx', 'utf8');

checkout = checkout.replace(
  /const loadRazorpay[\s\S]*?alert\("Failed to initiate payment"\);\s*setLoading\(false\);\s*\}/,
  `const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    
    setLoading(true);
    localStorage.setItem('checkoutFormData', JSON.stringify(formData));
    
    // Navigate immediately to processing page, which will spawn Razorpay
    setTimeout(() => {
      navigate('/payment-status?status=initiate');
    }, 500);
  }`
);
fs.writeFileSync('src/pages/Checkout.jsx', checkout, 'utf8');


// 3. Refactor PaymentStatus.jsx to handle 'initiate' and open Razorpay
const paymentStatusCode = `import React, { useEffect, useState, useContext, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
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
          <p style={{color: '#666', fontSize: '16px'}}>Please wait while we connect to the secure payment gateway. Do not close this window.</p>
          <style>{\`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }\`}</style>
        </>
      );
    }
  };

  return (
    <div style={{backgroundColor: '#fafafa', minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
      <Navbar />
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '140px 20px 80px'}}>
        <div style={{backgroundColor: 'white', padding: '60px 40px', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', textAlign: 'center', maxWidth: '600px', width: '100%', border: '1px solid #eaeaea'}}>
          {renderContent()}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PaymentStatus;
`;
fs.writeFileSync('src/pages/PaymentStatus.jsx', paymentStatusCode, 'utf8');
