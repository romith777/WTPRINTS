import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { StoreContext } from '../context/StoreContext';

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
    pincode: ''
  });
  const [loading, setLoading] = useState(false);

  const itemCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  const subtotal = cart.reduce((total, item) => total + (item.priceCents || 0) * (item.quantity || 1), 0);
  const shipping = itemCount > 0 ? 5000 : 0; 
  const tax = Math.round(subtotal * 0.05); 
  const total = subtotal + shipping + tax;

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    
    setLoading(true);
    localStorage.setItem('checkoutFormData', JSON.stringify(formData));
    
    setTimeout(() => {
      navigate('/payment-status?status=initiate');
    }, 100);
  };

  return (
    <div style={{backgroundColor: '#f9f9f9', minHeight: '100vh', paddingBottom: '50px'}}>
      <Navbar />
      <div style={{maxWidth: '1200px', margin: '140px auto 0', padding: '0 20px'}}>
        
        <div style={{display: 'flex', gap: '40px', flexWrap: 'wrap'}}>
          
          {/* Left: Shipping Form */}
          <div style={{flex: '1 1 600px', backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #eaeaea'}}>
            <h1 style={{fontFamily: 'Boldonse, sans-serif', fontSize: '28px', color: '#111', marginTop: 0, marginBottom: '30px'}}>Billing & Shipping</h1>
            
            <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                  <label style={{fontSize: '14px', fontWeight: 'bold', color: '#444'}}>Full Name *</label>
                  <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} style={{padding: '12px 15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px'}} />
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                  <label style={{fontSize: '14px', fontWeight: 'bold', color: '#444'}}>Phone Number *</label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} style={{padding: '12px 15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px'}} />
                </div>
              </div>

              <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                <label style={{fontSize: '14px', fontWeight: 'bold', color: '#444'}}>Email Address *</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} style={{padding: '12px 15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px'}} />
              </div>

              <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                <label style={{fontSize: '14px', fontWeight: 'bold', color: '#444'}}>Address Line 1 *</label>
                <input type="text" name="address1" placeholder="House/Flat No., Street" required value={formData.address1} onChange={handleChange} style={{padding: '12px 15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px'}} />
              </div>

              <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                <label style={{fontSize: '14px', fontWeight: 'bold', color: '#444'}}>Address Line 2</label>
                <input type="text" name="address2" placeholder="Landmark, Area (optional)" value={formData.address2} onChange={handleChange} style={{padding: '12px 15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px'}} />
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px'}}>
                <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                  <label style={{fontSize: '14px', fontWeight: 'bold', color: '#444'}}>City *</label>
                  <input type="text" name="city" required value={formData.city} onChange={handleChange} style={{padding: '12px 15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px'}} />
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                  <label style={{fontSize: '14px', fontWeight: 'bold', color: '#444'}}>State *</label>
                  <input type="text" name="state" required value={formData.state} onChange={handleChange} style={{padding: '12px 15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px'}} />
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                  <label style={{fontSize: '14px', fontWeight: 'bold', color: '#444'}}>Pincode *</label>
                  <input type="text" name="pincode" required value={formData.pincode} onChange={handleChange} style={{padding: '12px 15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px'}} />
                </div>
              </div>

              <button type="submit" disabled={loading} style={{marginTop: '20px', padding: '16px', backgroundColor: '#ee0652', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '18px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1}}>
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div style={{flex: '1 1 350px'}}>
            <div style={{backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #eaeaea', position: 'sticky', top: '140px'}}>
              <h2 style={{fontFamily: 'Boldonse, sans-serif', fontSize: '24px', color: '#111', marginTop: 0, marginBottom: '25px'}}>Order Summary</h2>
              
              <div style={{maxHeight: '300px', overflowY: 'auto', marginBottom: '20px', paddingRight: '10px'}}>
                {cart.map((item, idx) => (
                  <div key={idx} style={{display: 'flex', gap: '15px', marginBottom: '15px', alignItems: 'center'}}>
                    <img src={Array.isArray(item.image) ? item.image[0] : item.image} alt="product" style={{width: '60px', height: '60px', borderRadius: '6px', objectFit: 'cover'}} />
                    <div style={{flex: 1}}>
                      <p style={{margin: '0 0 5px', fontWeight: 'bold', fontSize: '14px', color: '#333'}}>{item.brandName || item.name}</p>
                      <p style={{margin: 0, fontSize: '12px', color: '#777'}}>Qty: {item.quantity}</p>
                    </div>
                    <p style={{margin: 0, fontWeight: 'bold', color: '#111'}}>{'\u20B9'}{formatCurrency(item.priceCents * item.quantity)}</p>
                  </div>
                ))}
              </div>
              
              <hr style={{borderTop: '1px solid #eaeaea', margin: '20px 0'}} />

              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#555'}}>
                <span>Subtotal ({itemCount} items)</span>
                <span>{'\u20B9'}{formatCurrency(subtotal)}</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#555'}}>
                <span>Shipping</span>
                <span>{'\u20B9'}{formatCurrency(shipping)}</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#555'}}>
                <span>Tax (5%)</span>
                <span>{'\u20B9'}{formatCurrency(tax)}</span>
              </div>
              
              <hr style={{borderTop: '1px solid #eaeaea', margin: '20px 0'}} />
              
              <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '22px', color: '#111'}}>
                <span>Total</span>
                <span style={{color: '#ee0652'}}>{'\u20B9'}{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Checkout;
