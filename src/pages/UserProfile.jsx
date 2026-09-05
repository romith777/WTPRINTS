import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { StoreContext } from '../context/StoreContext';

function UserProfile() {
  const { token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: 'Guest', email: 'guest@example.com' });

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
    const storedUser = localStorage.getItem('wt_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [token, navigate]);

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem('wt_user');
    navigate('/');
  };

  return (
    <div>
      <Navbar />
      <div style={{minHeight: '60vh', paddingTop: '150px', paddingBottom: '80px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start'}}>
        <div style={{width: '90%', maxWidth: '800px', backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #eaeaea'}}>
          <h1 style={{fontFamily: 'Boldonse, sans-serif', fontSize: '32px', marginBottom: '10px', color: '#111'}}>MY ACCOUNT</h1>
          <p style={{color: '#666', fontSize: '16px', marginBottom: '40px', fontFamily: 'League Spartan, sans-serif'}}>Manage your details, view your orders, and access your designs.</p>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '30px'}}>
            <div style={{padding: '25px', backgroundColor: '#fdfdfd', borderRadius: '8px', border: '1px solid #eee'}}>
              <h2 style={{fontSize: '20px', marginBottom: '15px', color: '#333'}}>Profile Information</h2>
              <div style={{display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '16px'}}>
                <p><strong>Username:</strong> {user.username || user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
              </div>
            </div>

            <div style={{padding: '25px', backgroundColor: '#fdfdfd', borderRadius: '8px', border: '1px solid #eee'}}>
              <h2 style={{fontSize: '20px', marginBottom: '15px', color: '#333'}}>Your Designs</h2>
              <p style={{color: '#666', marginBottom: '20px', fontSize: '16px'}}>Access your custom designs saved in the WTPrints studio.</p>
              <a href="https://wtprints-de.vercel.app" style={{display: 'inline-block', backgroundColor: '#111', color: 'white', padding: '12px 25px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px'}}>Open Design Studio</a>
            </div>

            <div style={{marginTop: '10px'}}>
              <button 
                onClick={handleLogout}
                style={{backgroundColor: '#ee0652', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.3s'}}
                onMouseOver={(e) => e.target.style.backgroundColor = '#c00545'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#ee0652'}
              >
                LOGOUT
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
export default UserProfile;