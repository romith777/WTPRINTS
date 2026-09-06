const fs = require('fs');

let cart = fs.readFileSync('src/pages/Cart.jsx', 'utf8');

cart = cart.replace(
  /updateQuantity\(product\._id, product\.quantity - 1\)/g,
  'updateQuantity(product._id, product.selectedSize, product.quantity - 1)'
);

cart = cart.replace(
  /updateQuantity\(product\._id, product\.quantity \+ 1\)/g,
  'updateQuantity(product._id, product.selectedSize, product.quantity + 1)'
);

cart = cart.replace(
  /removeFromCart\(product\._id\)/g,
  'removeFromCart(product._id, product.selectedSize)'
);

fs.writeFileSync('src/pages/Cart.jsx', cart, 'utf8');
