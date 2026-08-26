import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h2><span className="brand-highlight">WT</span>PRINTS</h2>
          <p>Your trusted fashion destination for bold, expressive, and stylish clothing. Stay unique. Stay printed.</p>
        </div>
        <div className="footer-links">
          <div>
            <h4>Men</h4>
            <ul>
              <li><a href="#">Oversized T-Shirts</a></li>
              <li><a href="#">T-Shirts</a></li>
              <li><a href="#">Joggers</a></li>
              <li><a href="#">Cargos</a></li>
            </ul>
          </div>
          <div>
            <h4>Women</h4>
            <ul>
              <li><a href="#">Oversized T-Shirts</a></li>
              <li><a href="#">T-Shirts</a></li>
              <li><a href="#">Joggers</a></li>
              <li><a href="#">Cargos</a></li>
            </ul>
          </div>
          <div>
            <h4>About</h4>
            <ul>
              <li><a href="#">Our Story</a></li>
              <li><a href="#">Sustainability</a></li>
            </ul>
          </div>  
          <div className="footer-extra">
            <div>
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms & Conditions</a></li>
              </ul>
            </div>
          </div>  
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 WTPRINTS. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
