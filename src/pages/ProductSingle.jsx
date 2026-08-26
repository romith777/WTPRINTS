import React, { useContext, useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { StoreContext } from '../context/StoreContext';

function formatCurrency(priceCents) {
  if(!priceCents) return "0.00";
  return (priceCents / 100).toFixed(2);
}

function ProductSingle() {
  const { id } = useParams();
  const { cart, favorites, addToCart, toggleFavorite, allProducts } = useContext(StoreContext);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [btnText, setBtnText] = useState("Add To Cart");
  const [activeImg, setActiveImg] = useState('');

  const flatProducts = useMemo(() => {
    let combined = [];
    Object.keys(allProducts).forEach(key => {
      if (Array.isArray(allProducts[key])) {
        combined = [...combined, ...allProducts[key]];
      }
    });
    return combined;
  }, [allProducts]);

  const product = useMemo(() => {
    return flatProducts.find(p => p._id === id);
  }, [flatProducts, id]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const others = flatProducts.filter(p => p._id !== id);
    return others.sort(() => 0.5 - Math.random()).slice(0, 5);
  }, [flatProducts, id, product]);

  const images = useMemo(() => {
    if (!product) return ['/assets/logo1.png'];
    return Array.isArray(product.image) ? product.image : (product.image ? [product.image] : ['/assets/logo1.png']);
  }, [product]);

  useEffect(() => {
    if (product) {
      setActiveImg(images[0]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product, images]);

  if (flatProducts.length === 0) {
    return <div><Navbar /><div style={{padding: '150px 20px', textAlign: 'center'}}>Loading products...</div><Footer /></div>;
  }

  if (!product) {
    return <div><Navbar /><div style={{padding: '150px 20px', textAlign: 'center'}}><h2>Product not found</h2></div><Footer /></div>;
  }

  const isFav = Array.isArray(favorites) && favorites.some(item => item._id === product._id);

  const handleAddToCart = () => {
    for(let i = 0; i < quantity; i++){
      addToCart({ ...product, selectedSize });
    }
    setBtnText("Added to Cart!");
    setTimeout(() => setBtnText("Add To Cart"), 1500);
  };

  return (
    <div>
      <Navbar />
      <div className="new-body" style={{paddingTop: '80px', minHeight: '80vh'}}>
        <div className="product-detail-container">
          
          <div className="product-image-section">
            <img src={activeImg || images[0]} alt={product.name} className="product-main-image" id="mainImage" />
            <div className="product-thumbnails">
              {images.map((img, idx) => (
                <img 
                  key={idx} 
                  src={img} 
                  alt="Thumbnail" 
                  className={`product-thumbnail ${activeImg === img ? 'active' : ''}`} 
                  onClick={() => setActiveImg(img)}
                  style={{cursor: 'pointer'}}
                />
              ))}
            </div>
          </div>
          
          <div className="product-info-section">
            <p className="product-brand">{product.brandName || 'WTPRINTS'}</p>
            <h1 className="product-name">{product.name}</h1>
            <div className="product-price">{'\u20B9'}{formatCurrency(product.priceCents)}</div>
            
            <p className="product-description">{product.about}</p>
            
            <div className="size-selection">
              <h3>Select Size</h3>
              <div className="size-options">
                {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                  <button 
                    key={size}
                    className={`size-option ${selectedSize === size ? 'selected' : ''}`} 
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="quantity-selection">
              <h3>Quantity</h3>
              <div className="quantity-controls">
                <button className="quantity-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <input type="number" className="quantity-input" value={quantity} readOnly />
                <button className="quantity-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>
            
            <div className="product-actions">
              <button className="add-to-cart-btn" onClick={handleAddToCart}>{btnText}</button>
              <button 
                className={`add-to-favorites-btn ${isFav ? 'active' : ''}`} 
                onClick={() => toggleFavorite(product)}
              >
                <img 
                  src={isFav ? "/assets/favourites-icon.png" : "/assets/favourites-icon-unclick.png"} 
                  style={{width: '20px', verticalAlign: 'middle', filter: isFav ? 'brightness(0) invert(1)' : 'none'}} 
                /> 
                <span>{isFav ? 'Favorited' : 'Favorite'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* SUGGESTED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <div style={{padding: '0 5vw', marginBottom: '80px', marginTop: '50px'}}>
            <h2 style={{fontFamily: 'Boldonse, sans-serif', textTransform: 'uppercase', fontSize: '28px', marginBottom: '30px', textAlign: 'center'}}>You May Also Like</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              {relatedProducts.map(p => (
                <ProductCard key={p._id} {...p} />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
export default ProductSingle;
