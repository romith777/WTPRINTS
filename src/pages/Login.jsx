import React, { useState } from 'react';
import Navbar from '../components/Navbar';

function Login() {
  const [isLogin, setIsLogin] = useState(true);

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
              
              {isLogin ? (
                <div className="login-box" style={{ display: 'block' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div><p style={{ fontSize: '25px' }}>Login</p></div>
                      <div><p style={{ color: 'grey', fontSize: '20px' }}>Login to resume your journey.</p></div>
                    </div>
                    
                    <form className="input-holder" style={{ gap: '20px' }} onSubmit={(e) => e.preventDefault()}>
                      <input name="username" type="text" placeholder="UserName" required />
                      <input name="password" type="password" placeholder="Password" required />
                      <button className="login-button" type="submit">Login</button>
                    </form>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px', marginTop: '50px' }}>
                    <hr style={{ height: '0.5px', width: '14.3vw', borderStyle: 'solid', marginTop: '4px', backgroundColor: 'black' }} />
                    <p>OR</p>
                    <hr style={{ height: '0.5px', width: '14.3vw', borderStyle: 'solid', marginTop: '4px', backgroundColor: 'black' }} />
                  </div>
                  
                  <div style={{ marginTop: '40px' }}>
                    <button className="login-button in-login-signup-button" onClick={() => setIsLogin(false)}>
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
                    
                    <form className="input-holder" style={{ gap: '20px' }} onSubmit={(e) => e.preventDefault()}>
                      <input name="username" type="text" placeholder="Name" required />
                      <input name="email" type="email" placeholder="Email" required />
                      <input name="password" type="password" placeholder="Password" required />
                      <button className="login-button" type="submit">Sign Up</button>
                    </form>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px', marginTop: '50px' }}>
                    <hr style={{ height: '0.5px', width: '14.3vw', borderStyle: 'solid', marginTop: '4px', backgroundColor: 'black' }} />
                    <p>OR</p>
                    <hr style={{ height: '0.5px', width: '14.3vw', borderStyle: 'solid', marginTop: '4px', backgroundColor: 'black' }} />
                  </div>
                  
                  <div style={{ marginTop: '40px' }}>
                    <button className="login-button in-signup-login-button" onClick={() => setIsLogin(true)}>
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
