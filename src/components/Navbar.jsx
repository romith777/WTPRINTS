import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const { cart, favorites, searchQuery, setSearchQuery } = useContext(StoreContext);
  const navigate = useNavigate();
  
  // Calculate total items in cart (accounting for quantities)
  const cartCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  const favoritesCount = favorites.length;

  return (
    <header className="navtotal">
      <div className="navbar">
        <Link to="/">
          <div className="nav-logo">
            <h1 className="nav-txt">WTPRINTS</h1>
          </div>
        </Link>
        <div className="search-bar">
          <div className="search-region">
            <form action="" className="search-form" onSubmit={(e) => { e.preventDefault(); navigate('/products'); }}>
              <input type="text" placeholder="search" className="search-area" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <button type="submit" className="search-button">
                <img src="/assets/search-icon.png" alt="search-icon" style={{width: '100%'}} />
              </button>
            </form>
          </div>
        </div>
        <div className="nav-components">
          <Link to="#">
            <div><div><p style={{ fontSize: 'large' }}>My Designs</p></div></div>
          </Link>
          <Link to="/login" className="login-token">
            <div><div><p style={{ fontSize: 'large' }} className="login-token-info">Sign in/up</p></div></div>
          </Link>
          <div className="nav-icons">
            <Link to="/cart">
              <div>
                <div>
                  <img src="/assets/cart-icon.png" alt="cart" />
                  <div className="icon-badge"><p><span style={{ color: 'white' }}>{cartCount}</span></p></div>
                </div>
              </div>
            </Link>
            <Link to="/favorites">
              <div>
                <div>
                  <img src="/assets/favourites-icon-unclick.png" alt="favourites" />
                  <div className="icon-badge"><p><span style={{ color: 'white' }}>{favoritesCount}</span></p></div>
                </div>
              </div>
            </Link>
          </div>
          <div className="mobile-menu-toggle">
              <span></span><span></span><span></span>
          </div>
        </div>
      </div>
      <nav className="nav-drop-down" id="navDropDown">
          <ul>
              <li><Link to="/products?category=tees"><div>T-Shirts</div></Link></li>
              <li><Link to="/products?category=hoodies"><div>Hoodies</div></Link></li>
              <li><Link to="/products?category=cargos"><div>Lower</div></Link></li>
              <li><Link to="#"><div>Bags</div></Link></li>
              <li><Link to="#"><div>Caps</div></Link></li>
              <li><Link to="#"><div>Visiting Cards</div></Link></li>
              <li><Link to="#"><div>Others</div></Link></li>
          </ul>
      </nav>
    </header>
  );
}
export default Navbar;

