const fs = require('fs');

let cart = fs.readFileSync('src/pages/Cart.jsx', 'utf8');

cart = cart.replace(
  /const \{ cart, updateQuantity, removeFromCart \} = useContext\(StoreContext\);/,
  'const { cart, updateQuantity, removeFromCart, token } = useContext(StoreContext);'
);

cart = cart.replace(
  /const handleCheckoutNavigate = \(\) => \{[\s\S]*?navigate\('\/checkout'\);\s*\};/,
  `const handleCheckoutNavigate = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    if (!token) {
      alert("Please login to proceed to checkout.");
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };`
);

fs.writeFileSync('src/pages/Cart.jsx', cart, 'utf8');
