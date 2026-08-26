import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { StoreContext } from '../context/StoreContext';

function Favorites() {
  const { favorites } = useContext(StoreContext);

  return (
    <div>
      <Navbar />
      <div className="new-body" style={{paddingTop: '80px', minHeight: '80vh', padding: '100px 5vw'}}>
        <h1 style={{fontFamily: 'Boldonse, sans-serif', textAlign: 'center', marginBottom: '30px'}}>Your Favorites</h1>
        {favorites.length === 0 ? (
          <div style={{textAlign: 'center', marginTop: '50px'}}>
            <img src="/assets/favourites-icon-unclick.png" alt="No Favs" style={{width: '60px', opacity: 0.5}} />
            <h2 style={{color: '#666', marginTop: '20px'}}>No favorites yet!</h2>
            <Link to="/"><button className="shop-now-btn" style={{backgroundColor: '#ee0652', color:'white', padding: '10px 20px', border:'none', borderRadius:'5px', cursor:'pointer', marginTop:'15px', fontWeight:'bold'}}>Start Browsing</button></Link>
          </div>
        ) : (
          <div className="browsing-section">
            {favorites.map(p => <ProductCard key={p._id} {...p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
export default Favorites;
