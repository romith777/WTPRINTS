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
            <div className="slider-nav">
                <div id="slide1"></div>
                <div id="slide2"></div>
                <div id="slide3"></div>
                <div id="slide4"></div>
                <div id="slide5"></div>
            </div>
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
