const fs = require('fs');

let checkout = fs.readFileSync('src/pages/Checkout.jsx', 'utf8');

// Move the h1 outside of payment-body, wrapped in a matching container
checkout = checkout.replace(
  /<div className="payment-body">\s*<main className="payment-form-wrap">\s*<h1 className="payment-page-title">Checkout<\/h1>/,
  `<div>
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '40px clamp(15px, 3vw, 40px) 0' }}>
        <h1 className="payment-page-title" style={{ margin: 0 }}>Checkout</h1>
      </div>
      <div className="payment-body" style={{ paddingTop: '20px' }}>
        <main className="payment-form-wrap">`
);

// Close the new outer div at the end
checkout = checkout.replace(
  /<\/aside>\s*<\/div>\s*\);\s*\}\s*export default Checkout;/,
  `</aside>\n      </div>\n    </div>\n  );\n}\n\nexport default Checkout;`
);

fs.writeFileSync('src/pages/Checkout.jsx', checkout, 'utf8');
