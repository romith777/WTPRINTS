import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';

function Home() {
  const tees = [
    { _id: 't1', image: ['/assets/Tees.jpg'], name: 'Gojo Tee', brandName: 'WTPRINTS', about: 'Oversized Anime Edition', priceCents: 129900 },
    { _id: 't2', image: ['/assets/tees1.jpg'], name: 'Goku Tee', brandName: 'WTPRINTS', about: 'Dragon Ball Z Exclusive', priceCents: 149900 },
    { _id: 't3', image: ['/assets/tees2.jpg'], name: 'Sanji Tee', brandName: 'WTPRINTS', about: 'One Piece Wanted Poster', priceCents: 99900 },
    { _id: 't4', image: ['/assets/tees3.jpg'], name: 'Luffy Tee', brandName: 'WTPRINTS', about: 'Vintage Anime Wash', priceCents: 119900 },
  ];
  
  const cargos = [
    { _id: 'c1', image: ['/assets/cargo.jpg'], name: 'Tactical Cargo', brandName: 'WTPRINTS', about: 'Multi-pocket Techwear', priceCents: 249900 },
    { _id: 'c2', image: ['/assets/cargo1.jpg'], name: 'Street Cargo', brandName: 'WTPRINTS', about: 'Baggy Y2K Fit', priceCents: 229900 },
    { _id: 'c3', image: ['/assets/cargo2.jpg'], name: 'Urban Cargo', brandName: 'WTPRINTS', about: 'Relaxed Fit Black', priceCents: 199900 },
    { _id: 'c4', image: ['/assets/cargo3.jpg'], name: 'Tech Cargo', brandName: 'WTPRINTS', about: 'Utility Jogger', priceCents: 269900 },
  ];
  
  const hoodies = [
    { _id: 'h1', image: ['/assets/hoodie.jpg'], name: 'Eren Hoodie', brandName: 'WTPRINTS', about: 'AOT Neon Glow', priceCents: 299900 },
    { _id: 'h2', image: ['/assets/hoodie1.jpg'], name: 'Demon Slayer', brandName: 'WTPRINTS', about: 'Tanjiro Checkered', priceCents: 349900 },
    { _id: 'h3', image: ['/assets/hoodie2.jpg'], name: 'Gengar Hoodie', brandName: 'WTPRINTS', about: 'Pokemon Oversized', priceCents: 279900 },
    { _id: 'h4', image: ['/assets/hoodie3.jpg'], name: 'Itachi Hoodie', brandName: 'WTPRINTS', about: 'Akatsuki Edition', priceCents: 319900 },
  ];

  return (
    <div>
      <Navbar />
      <main id="main">
        <section className="container">
          <div className="slide-wrapper">
            <div className="slides">
              <Link to="/products?category=tees"><img src="/assets/OversizeT.jpg" alt="OversizeT" id="slide-1" className="slide" /></Link>
              <Link to="/products?category=cargos"><img src="/assets/cargo.jpg" alt="cargo" id="slide-2" className="slide" /></Link>
              <Link to="/products?category=cargos"><img src="/assets/Joggers.jpg" alt="Joggers" id="slide-3" className="slide" /></Link>
              <Link to="/products?category=tees"><img src="/assets/Tshirt.jpg" alt="Tshirt" id="slide-4" className="slide" /></Link>
              <Link to="/products?category=jeans"><img src="/assets/Jeans.jpg" alt="Jeans" id="slide-5" className="slide" /></Link>
            </div>
                      </div>
<div className="slider-nav">
            <a href="#slide-1"><div></div></a>
            <a href="#slide-2"><div></div></a>
            <a href="#slide-3"><div></div></a>
            <a href="#slide-4"><div></div></a>
            <a href="#slide-5"><div></div></a>
          </div>
        </section>

        {/* Shop By Category Section */}
        <section style={{padding: '40px 20px', maxWidth: '1200px', margin: '0 auto'}}>
          <h2 style={{fontFamily: 'Boldonse, sans-serif', fontSize: 'clamp(24px, 4vw, 32px)', textAlign: 'center', marginBottom: '30px', color: '#111', textTransform: 'uppercase'}}>Shop By Category</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px'}}>
            
            <Link to="/products?category=tees" style={{textDecoration: 'none'}}>
              <div style={{backgroundColor: '#f8f8f8', padding: '30px 20px', borderRadius: '12px', textAlign: 'center', transition: 'all 0.3s', cursor: 'pointer', border: '1px solid #eaeaea'}} onMouseOver={(e)=>{e.currentTarget.style.backgroundColor='#ee0652'; e.currentTarget.children[0].style.color='white';}} onMouseOut={(e)=>{e.currentTarget.style.backgroundColor='#f8f8f8'; e.currentTarget.children[0].style.color='#ee0652';}}>
                <h3 style={{fontFamily: 'League Spartan, sans-serif', color: '#ee0652', margin: 0, fontSize: '20px', fontWeight: 'bold'}}>T-Shirts</h3>
              </div>
            </Link>
            
            <Link to="/products?category=hoodies" style={{textDecoration: 'none'}}>
              <div style={{backgroundColor: '#f8f8f8', padding: '30px 20px', borderRadius: '12px', textAlign: 'center', transition: 'all 0.3s', cursor: 'pointer', border: '1px solid #eaeaea'}} onMouseOver={(e)=>{e.currentTarget.style.backgroundColor='#ee0652'; e.currentTarget.children[0].style.color='white';}} onMouseOut={(e)=>{e.currentTarget.style.backgroundColor='#f8f8f8'; e.currentTarget.children[0].style.color='#ee0652';}}>
                <h3 style={{fontFamily: 'League Spartan, sans-serif', color: '#ee0652', margin: 0, fontSize: '20px', fontWeight: 'bold'}}>Hoodies</h3>
              </div>
            </Link>
            
            <Link to="/products?category=cargos" style={{textDecoration: 'none'}}>
              <div style={{backgroundColor: '#f8f8f8', padding: '30px 20px', borderRadius: '12px', textAlign: 'center', transition: 'all 0.3s', cursor: 'pointer', border: '1px solid #eaeaea'}} onMouseOver={(e)=>{e.currentTarget.style.backgroundColor='#ee0652'; e.currentTarget.children[0].style.color='white';}} onMouseOut={(e)=>{e.currentTarget.style.backgroundColor='#f8f8f8'; e.currentTarget.children[0].style.color='#ee0652';}}>
                <h3 style={{fontFamily: 'League Spartan, sans-serif', color: '#ee0652', margin: 0, fontSize: '20px', fontWeight: 'bold'}}>Cargos</h3>
              </div>
            </Link>
            
            <Link to="/products?category=jeans" style={{textDecoration: 'none'}}>
              <div style={{backgroundColor: '#f8f8f8', padding: '30px 20px', borderRadius: '12px', textAlign: 'center', transition: 'all 0.3s', cursor: 'pointer', border: '1px solid #eaeaea'}} onMouseOver={(e)=>{e.currentTarget.style.backgroundColor='#ee0652'; e.currentTarget.children[0].style.color='white';}} onMouseOut={(e)=>{e.currentTarget.style.backgroundColor='#f8f8f8'; e.currentTarget.children[0].style.color='#ee0652';}}>
                <h3 style={{fontFamily: 'League Spartan, sans-serif', color: '#ee0652', margin: 0, fontSize: '20px', fontWeight: 'bold'}}>Jeans</h3>
              </div>
            </Link>

          </div>
        </section>

        <section>
          <h1 style={{ textAlign: 'center', padding: '20px', fontFamily: 'Boldonse, sans-serif' }}>BROWSE TEES</h1>
          <div className="browsing-section">
            {tees.map(p => <ProductCard key={p._id} {...p} />)}
          </div>
        </section>

        <section>
          <h1 style={{ textAlign: 'center', padding: '20px', fontFamily: 'Boldonse, sans-serif' }}>BROWSE CARGOS</h1>
          <div className="browsing-section">
            {cargos.map(p => <ProductCard key={p._id} {...p} />)}
          </div>
        </section>

        <section>
          <h1 style={{ textAlign: 'center', padding: '20px', fontFamily: 'Boldonse, sans-serif' }}>BROWSE HOODIES</h1>
          <div className="browsing-section">
            {hoodies.map(p => <ProductCard key={p._id} {...p} />)}
          </div>
        </section>
      
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

      <Footer />
    </div>
  );
}
export default Home;


