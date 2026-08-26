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
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ width: '100%', aspectRatio: '1/1', padding: 0, margin: 0, backgroundColor: '#fdfdfd', boxSizing: 'border-box' }}>
        <Link to={`/product/${_id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
          <img src={imageSrc} alt={name || 'Product'} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </Link>
      </div>
      
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', backgroundColor: '#fff', width: '100%', boxSizing: 'border-box', flex: 1 }}>
        
        {/* Top Row: Brand, Title, Wishlist */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', maxWidth: '85%' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{brandName || name}</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#777', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{about || 'Premium Quality'}</p>
          </div>
          <div 
            onClick={() => toggleFavorite({ _id, image, name, brandName, about, priceCents })} 
            style={{ cursor: 'pointer', padding: '0', flexShrink: 0 }}
          >
            <img 
              src={isFav ? "/assets/favourites-icon.png" : "/assets/favourites-icon-unclick.png"} 
              alt="wishlist" 
              style={{ width: '22px', height: '22px', transition: 'transform 0.2s' }} 
            />
          </div>
        </div>
        
        {/* Price Row */}
        <div style={{ marginTop: '16px', fontSize: '14px', color: '#666', width: '100%' }}>
          Price: <span style={{ color: '#ee0652', fontSize: '18px', fontWeight: 'bold', marginLeft: '2px' }}>{'\u20B9'}{formatCurrency(priceCents)}</span>
        </div>

        {/* Button */}
        <button 
          onClick={handleAddToCart}
          style={{
            marginTop: '16px',
            width: '100%',
            backgroundColor: '#ee0652',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '12px',
            fontSize: '15px',
            fontWeight: '600',
            fontFamily: '"League Spartan", sans-serif',
            cursor: 'pointer',
            transition: 'background-color 0.2s, opacity 0.2s, transform 0.1s',
            boxSizing: 'border-box'
          }}
          onMouseOver={(e) => e.target.style.opacity = '0.9'}
          onMouseOut={(e) => e.target.style.opacity = '1'}
          onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
          onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
        >
          {btnText}
        </button>
      </div>
    </div>
  );
}
export default ProductCard;
