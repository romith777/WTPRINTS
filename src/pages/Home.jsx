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
              <div style={{backgroundColor: '#f8f8f8', padding: '30px 20px', borderRadius: '12px', textAlign: 'center', transition: 'transform 0.3s', cursor: 'pointer', border: '1px solid #eaeaea'}} onMouseOver={(e)=>e.currentTarget.style.transform='translateY(-5px)'} onMouseOut={(e)=>e.currentTarget.style.transform='none'}>
                <h3 style={{fontFamily: 'League Spartan, sans-serif', color: '#ee0652', margin: 0, fontSize: '20px', fontWeight: 'bold'}}>T-Shirts</h3>
              </div>
            </Link>
            
            <Link to="/products?category=hoodies" style={{textDecoration: 'none'}}>
              <div style={{backgroundColor: '#f8f8f8', padding: '30px 20px', borderRadius: '12px', textAlign: 'center', transition: 'transform 0.3s', cursor: 'pointer', border: '1px solid #eaeaea'}} onMouseOver={(e)=>e.currentTarget.style.transform='translateY(-5px)'} onMouseOut={(e)=>e.currentTarget.style.transform='none'}>
                <h3 style={{fontFamily: 'League Spartan, sans-serif', color: '#ee0652', margin: 0, fontSize: '20px', fontWeight: 'bold'}}>Hoodies</h3>
              </div>
            </Link>
            
            <Link to="/products?category=cargos" style={{textDecoration: 'none'}}>
              <div style={{backgroundColor: '#f8f8f8', padding: '30px 20px', borderRadius: '12px', textAlign: 'center', transition: 'transform 0.3s', cursor: 'pointer', border: '1px solid #eaeaea'}} onMouseOver={(e)=>e.currentTarget.style.transform='translateY(-5px)'} onMouseOut={(e)=>e.currentTarget.style.transform='none'}>
                <h3 style={{fontFamily: 'League Spartan, sans-serif', color: '#ee0652', margin: 0, fontSize: '20px', fontWeight: 'bold'}}>Cargos</h3>
              </div>
            </Link>
            
            <Link to="/products?category=jeans" style={{textDecoration: 'none'}}>
              <div style={{backgroundColor: '#f8f8f8', padding: '30px 20px', borderRadius: '12px', textAlign: 'center', transition: 'transform 0.3s', cursor: 'pointer', border: '1px solid #eaeaea'}} onMouseOver={(e)=>e.currentTarget.style.transform='translateY(-5px)'} onMouseOut={(e)=>e.currentTarget.style.transform='none'}>
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
      </main>
      <Footer />
    </div>
  );
}
export default Home;


