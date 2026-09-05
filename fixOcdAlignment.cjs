const fs = require('fs');

// 1. Fix Checkout.jsx spacing
let checkout = fs.readFileSync('src/pages/Checkout.jsx', 'utf8');
checkout = checkout.replace(
  /<form id="checkout-form" onSubmit=\{handleSubmit\} noValidate>/,
  '<form id="checkout-form" onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "20px" }}>'
);

// 2. Wrap the whole thing in a container to ensure background color fills the screen if it wasn't
// (Actually it's fine, let's leave it unless needed)
fs.writeFileSync('src/pages/Checkout.jsx', checkout, 'utf8');

// 3. Fix payment.css H2 margin top
let css = fs.readFileSync('src/styles/payment.css', 'utf8');
css = css.replace(
  /\.payment-section-title \{/,
  '.payment-section-title {\n    margin-top: 0;'
);
fs.writeFileSync('src/styles/payment.css', css, 'utf8');
