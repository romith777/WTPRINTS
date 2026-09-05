import React, { useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setToken, setCart, setFavorites } = useContext(StoreContext);

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const endpoint = type === 'login' ? '/api/login' : '/api/signup';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        setToken(result.token);
        
        // Merge Database Cart/Favorites with Local Session
        if (result.user.cart && result.user.cart.length > 0) {
          setCart(prev => {
            const newCart = [...prev];
            result.user.cart.forEach(dbItem => {
              if (!newCart.find(localItem => localItem._id === dbItem._id && localItem.selectedSize === dbItem.selectedSize)) {
                newCart.push(dbItem);
              }
            });
            return newCart;
          });
        }
        
        if (result.user.favorites && result.user.favorites.length > 0) {
          setFavorites(prev => {
            const newFavs = [...prev];
            result.user.favorites.forEach(dbItem => {
              if (!newFavs.find(localItem => localItem._id === dbItem._id)) {
                newFavs.push(dbItem);
              }
            });
            return newFavs;
          });
        }
        // Optional: Save user info if needed
        if (result.user) {
          localStorage.setItem('wt_user', JSON.stringify(result.user));
        }
        navigate('/');
      } else {
        setError(result.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-body">
      <Navbar />
      <div className="new-body-information">
        <div className="collab-image-box">
          <img className="collab-image" src="/assets/onepiece-collab.jpg" alt="collab" />
        </div>
        
        <div className="information">
          <div className="login-signup-change">
            <div className="login-signup-content">
              <div className="slider-change"></div>
              
              {error && (
                <div style={{color: 'red', textAlign: 'center', marginBottom: '15px', backgroundColor: '#ffeef0', padding: '10px', borderRadius: '5px'}}>
                  {error}
                </div>
              )}

              {isLogin ? (
                <div className="login-box" style={{ display: 'block' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div><p style={{ fontSize: '25px' }}>Login</p></div>
                      <div><p style={{ color: 'grey', fontSize: '20px' }}>Login to resume your journey.</p></div>
                    </div>
                    
                    <form className="input-holder" style={{ gap: '20px' }} onSubmit={(e) => handleSubmit(e, 'login')}>
                      <input name="username" type="text" placeholder="Username or Email" required />
                      <input name="password" type="password" placeholder="Password" required />
                      <button className="login-button" type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                      </button>
                    </form>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px', marginTop: '50px' }}>
                    <hr style={{ height: '0.5px', width: '14.3vw', borderStyle: 'solid', marginTop: '4px', backgroundColor: 'black' }} />
                    <p>OR</p>
                    <hr style={{ height: '0.5px', width: '14.3vw', borderStyle: 'solid', marginTop: '4px', backgroundColor: 'black' }} />
                  </div>
                  
                  <div style={{ marginTop: '40px' }}>
                    <button className="login-button in-login-signup-button" onClick={() => { setIsLogin(false); setError(''); }}>
                      Signup
                    </button>
                  </div>
                </div>
              ) : (
                <div className="signup-box" style={{ display: 'block' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div><p style={{ fontSize: '25px' }}>Signup</p></div>
                      <div><p style={{ color: 'grey', fontSize: '20px' }}>Join us to be a part of our family.</p></div>
                    </div>
                    
                    <form className="input-holder" style={{ gap: '20px' }} onSubmit={(e) => handleSubmit(e, 'signup')}>
                      <input name="username" type="text" placeholder="Username" required />
                      <input name="email" type="email" placeholder="Email" required />
                      <input name="password" type="password" placeholder="Password" required />
                      <button className="login-button" type="submit" disabled={loading}>
                        {loading ? 'Signing up...' : 'Sign Up'}
                      </button>
                    </form>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px', marginTop: '50px' }}>
                    <hr style={{ height: '0.5px', width: '14.3vw', borderStyle: 'solid', marginTop: '4px', backgroundColor: 'black' }} />
                    <p>OR</p>
                    <hr style={{ height: '0.5px', width: '14.3vw', borderStyle: 'solid', marginTop: '4px', backgroundColor: 'black' }} />
                  </div>
                  
                  <div style={{ marginTop: '40px' }}>
                    <button className="login-button in-signup-login-button" onClick={() => { setIsLogin(true); setError(''); }}>
                      Login
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;
