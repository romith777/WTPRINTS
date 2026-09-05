import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function PaymentStatus() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status') || 'processing';
  
  const [displayStatus, setDisplayStatus] = useState(status);

  // If processing, artificially delay for a second to show a "checking" state
  useEffect(() => {
    if (status === 'processing') {
      const timer = setTimeout(() => {
        // In a real app we might poll the backend here. For now, it stays processing or falls back.
        setDisplayStatus('processing');
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setDisplayStatus(status);
    }
  }, [status]);

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
          <p style={{color: '#666', fontSize: '16px'}}>Please wait while we confirm your transaction. Do not close this window.</p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
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
