const fs = require('fs');

// 1. Restore the simple Cart behavior (navigate to /checkout instead of launching Razorpay)
let cart = fs.readFileSync('src/pages/Cart.jsx', 'utf8');

cart = cart.replace(
  /const loadRazorpay = \(\) => \{[\s\S]*?rzp\.open\(\);\s*\} catch \(err\) \{\s*alert\("Failed to create order"\);\s*\}\s*\};/,
  `const handleCheckoutNavigate = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate('/checkout');
  };`
);
cart = cart.replace(/onClick=\{handleCheckout\}/g, 'onClick={handleCheckoutNavigate}');
cart = cart.replace(/>Checkout securely with Razorpay<\/button>/g, '>Proceed to Checkout</button>');

fs.writeFileSync('src/pages/Cart.jsx', cart, 'utf8');

// 2. Add /checkout and /payment-status routes to App.jsx
let appJsx = fs.readFileSync('src/App.jsx', 'utf8');
if (!appJsx.includes('Checkout')) {
  appJsx = appJsx.replace(
    /import Cart from '\.\/pages\/Cart';/,
    `import Cart from './pages/Cart';\nimport Checkout from './pages/Checkout';\nimport PaymentStatus from './pages/PaymentStatus';`
  );
  appJsx = appJsx.replace(
    /<Route path="\/cart" element=\{<Cart \/>\} \/>/,
    `<Route path="/cart" element={<Cart />} />\n        <Route path="/checkout" element={<Checkout />} />\n        <Route path="/payment-status" element={<PaymentStatus />} />`
  );
  fs.writeFileSync('src/App.jsx', appJsx, 'utf8');
}
