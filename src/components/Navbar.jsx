import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';

function Navbar() {
  const { cart, favorites, searchQuery, setSearchQuery } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.search]);
  
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
            
            {/* Hamburger Icon */}
            <div className="mobile-menu-toggle" style={{display: 'none'}} onClick={() => setMenuOpen(!menuOpen)}>
              <span style={{ transform: menuOpen ? 'rotate(45deg) translate(5px, 6px)' : 'none' }}></span>
              <span style={{ opacity: menuOpen ? 0 : 1 }}></span>
              <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px, -6px)' : 'none' }}></span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Categories Dropdown & Mobile Menu */}
      <nav className={"nav-drop-down " + (menuOpen ? "open" : "")} id="navDropDown">
        <ul>
          {/* Shown only on mobile inside the dropdown */}
          <div className="mobile-extra-links">
             <Link to="#" style={{textDecoration: 'none', color: '#111', fontWeight: 'bold'}}>My Designs</Link>
             <Link to="/login" style={{textDecoration: 'none', color: '#111', fontWeight: 'bold'}}>Sign in / up</Link>
          </div>
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
