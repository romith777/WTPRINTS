import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';

function formatCurrency(priceCents) {
  if(!priceCents) return "0.00";
  return (priceCents / 100).toFixed(2);
}

function ProductCard({ _id, image, name, brandName, about, priceCents }) {
  const { favorites, addToCart, toggleFavorite } = useContext(StoreContext) || { favorites: [], addToCart: ()=>{}, toggleFavorite: ()=>{} };
  
  const isFav = Array.isArray(favorites) && favorites.some(item => item._id === _id);
  const [btnText, setBtnText] = useState("Add To Cart");

  const handleAddToCart = (e) => {
    e.preventDefault();
    if(addToCart) addToCart({ _id, image, name, brandName, about, priceCents });
    setBtnText("Added!");
    setTimeout(() => setBtnText("Add To Cart"), 1500);
  };

  const imageSrc = Array.isArray(image) ? image[0] : (image || '/assets/logo1.png');

  return (
    <div 
      className="browse-card" 
      style={{
        padding: 0,
        backgroundColor: '#fff',
        borderRadius: '8px',
        border: '1px solid #eaeaea',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ position: 'relative', width: '100%', paddingTop: '125%', backgroundColor: '#fdfdfd', overflow: 'hidden', flexShrink: 0 }}>
        <Link to={"/product/" + _id} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'block' }}>
          <img src={imageSrc} alt={name || 'Product'} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
        </Link>
      </div>
      
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', backgroundColor: '#fff', width: '100%', boxSizing: 'border-box', flex: 1 }}>
        
        {/* Top Row: Brand, Title, Wishlist */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', maxWidth: '85%' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{brandName || name}</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#777', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{about || 'Premium Quality'}</p>
          </div>
          
          <button 
            onClick={(e) => { e.preventDefault(); if(toggleFavorite) toggleFavorite({ _id, image, name, brandName, priceCents, about }); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Toggle Favorite"
          >
            {isFav ? (
              <img src="/assets/favourites-icon-click.png" alt="Favorited" style={{width: '20px', height: '20px'}} />
            ) : (
              <img src="/assets/favourites-icon-unclick.png" alt="Add to Favorites" style={{width: '20px', height: '20px'}} />
            )}
          </button>
        </div>

        {/* Bottom Row: Price, Add to Cart */}
        <div style={{ marginTop: 'auto', paddingTop: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>
            Price: <strong style={{color: '#ee0652', fontSize: '16px'}}>₹{formatCurrency(priceCents)}</strong>
          </p>
          <button 
            onClick={handleAddToCart}
            style={{
              backgroundColor: '#ee0652',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '10px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              width: '100%',
              fontFamily: 'inherit'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d00547'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ee0652'}
          >
            {btnText}
          </button>
        </div>

      </div>
    </div>
  );
}

export default ProductCard;
