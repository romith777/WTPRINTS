const fs = require('fs');
const path = require('path');

// 1. Remove Transform from login.css
let loginCss = fs.readFileSync('src/styles/login.css', 'utf8');
loginCss = loginCss.replace(/transform:\s*translateY\(-2px\);\s*/g, '');
fs.writeFileSync('src/styles/login.css', loginCss, 'utf8');

// 2. Create UserProfile.jsx
const userProfileCode = `
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
`;
fs.writeFileSync('src/pages/UserProfile.jsx', userProfileCode.trim(), 'utf8');

// 3. Update App.jsx to include UserProfile route
let appCode = fs.readFileSync('src/App.jsx', 'utf8');
if (!appCode.includes('UserProfile')) {
  appCode = appCode.replace("import Login from './pages/Login'", "import Login from './pages/Login'\nimport UserProfile from './pages/UserProfile'");
  appCode = appCode.replace("<Route path='/login' element={<Login/>}/>", "<Route path='/login' element={<Login/>}/><Route path='/profile' element={<UserProfile/>}/>");
  fs.writeFileSync('src/App.jsx', appCode, 'utf8');
}

// 4. Update Navbar.jsx to link to Profile instead of direct logout
let navCode = fs.readFileSync('src/components/Navbar.jsx', 'utf8');

const oldDesktopLogout = `{token ? (
            <div onClick={() => setToken("")} className="login-token" style={{cursor:"pointer"}}>
              <div><div><p style={{ fontSize: 'large' }} className="login-token-info">Logout</p></div></div>
            </div>
          ) :`;

const newDesktopLogout = `{token ? (
            <Link to="/profile" className="login-token" style={{cursor:"pointer", textDecoration: 'none', color: '#111'}}>
              <div><div><p style={{ fontSize: 'large' }} className="login-token-info">My Account</p></div></div>
            </Link>
          ) :`;

navCode = navCode.replace(oldDesktopLogout, newDesktopLogout);

const oldMobileLogout = `{token ? (
               <span onClick={() => { setToken(""); setMenuOpen(false); }} style={{textDecoration: "none", color: "#111", fontWeight: "bold", cursor: "pointer"}}>Logout</span>
             ) :`;
             
const newMobileLogout = `{token ? (
               <Link to="/profile" onClick={() => setMenuOpen(false)} style={{textDecoration: "none", color: "#111", fontWeight: "bold"}}>My Account</Link>
             ) :`;

navCode = navCode.replace(oldMobileLogout, newMobileLogout);

fs.writeFileSync('src/components/Navbar.jsx', navCode, 'utf8');
