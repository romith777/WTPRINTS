const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.jsx', 'utf8');

// 1. Fix Hover styles in Home categories
content = content.replace(/transition: 'transform 0\.3s', cursor: 'pointer', border: '1px solid #eaeaea'\}\} onMouseOver=\{\(e\)=>e\.currentTarget\.style\.transform='translateY\(-5px\)'\} onMouseOut=\{\(e\)=>e\.currentTarget\.style\.transform='none'\}/g, "transition: 'all 0.3s', cursor: 'pointer', border: '1px solid #eaeaea'}} onMouseOver={(e)=>{e.currentTarget.style.backgroundColor='#ee0652'; e.currentTarget.children[0].style.color='white';}} onMouseOut={(e)=>{e.currentTarget.style.backgroundColor='#f8f8f8'; e.currentTarget.children[0].style.color='#ee0652';}}");

// 2. Add Login/Logout Section
const loginSection = `
        <section className="login-to-access" style={{background: 'linear-gradient(135deg, #1a1a1a 0%, #000 100%)', color: 'white', padding: 'clamp(40px, 8vw, 80px) 20px', textAlign: 'center', marginTop: '60px'}}>
          <div className="login-to-access-text" style={{padding: '15px', maxWidth: '700px', margin: '0 auto', width: '100%'}}>
            <h1 style={{fontSize: 'clamp(24px, 5vw, 42px)', marginBottom: '10px', padding: 0, fontFamily: 'League Spartan, sans-serif'}}>
              {localStorage.getItem('wtp-token') ? 'LOGOUT TO !SEE YOUR DESIGNS' : 'LOGIN TO SEE YOUR DESIGNS'}
            </h1>
            <p style={{fontSize: 'clamp(14px, 2vw, 16px)', lineHeight: '1.8', opacity: 0.9, fontFamily: 'League Spartan, sans-serif'}}>
              {localStorage.getItem('wtp-token') ? 'Logout to !access your account and to see your designs, favourites and cart. And many more Designs.' : 'Login to access your account and to see your designs, favourites and cart. And many more Designs.'}
            </p>
            {localStorage.getItem('wtp-token') ? (
              <button 
                className="login-to-access-button" 
                style={{fontWeight: 1000, backgroundColor: '#ee0652', color: 'white', padding: '15px 60px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '18px', marginTop: '20px', transition: 'all 0.3s ease', fontFamily: 'League Spartan, sans-serif', boxShadow: '0 4px 20px rgba(255, 255, 255, 0.3)', width: '100%', maxWidth: '700px'}}
                onClick={() => { localStorage.removeItem('wtp-token'); window.location.reload(); }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f0f0f0'; e.currentTarget.style.color = '#000'; e.currentTarget.innerHTML = 'WHY LOGOUT ? JUST LOOK INTO THE NEW ARRIVALS'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#ee0652'; e.currentTarget.style.color = 'white'; e.currentTarget.innerHTML = 'LOGOUT'; }}
              >
                LOGOUT
              </button>
            ) : (
              <Link to="/login" style={{display: 'inline-block', width: '100%', maxWidth: '700px'}}>
                <button 
                  className="login-to-access-button" 
                  style={{fontWeight: 1000, backgroundColor: 'white', color: 'black', padding: '15px 60px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '18px', marginTop: '20px', transition: 'all 0.3s ease', fontFamily: 'League Spartan, sans-serif', boxShadow: '0 4px 20px rgba(255, 255, 255, 0.3)', width: '100%'}}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f0f0f0'; e.currentTarget.style.boxShadow = '0 6px 25px rgba(255, 255, 255, 0.5)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 255, 255, 0.3)'; }}
                >
                  LOGIN
                </button>
              </Link>
            )}
          </div>
        </section>
      </main>
`;

content = content.replace('</main>', loginSection);

fs.writeFileSync('src/pages/Home.jsx', content, 'utf8');
