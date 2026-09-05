const fs = require('fs');

// 1. Update StoreContext.jsx
let ctx = fs.readFileSync('src/context/StoreContext.jsx', 'utf8');
if (!ctx.includes('clearCart')) {
  ctx = ctx.replace(
    /const toggleFavorite =/,
    `const clearCart = () => setCart([]);\n\n  const toggleFavorite =`
  );
  ctx = ctx.replace(
    /removeFromCart, toggleFavorite,/,
    `removeFromCart, clearCart, toggleFavorite,`
  );
  fs.writeFileSync('src/context/StoreContext.jsx', ctx, 'utf8');
}

// 2. Update Checkout.jsx (email readOnly)
let checkout = fs.readFileSync('src/pages/Checkout.jsx', 'utf8');
checkout = checkout.replace(
  /<input type="email" id="email" name="email" value=\{formData\.email\} onChange=\{handleChange\} required placeholder="you@email.com" \/>/,
  `<input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@email.com" readOnly style={{backgroundColor: '#f5f5f5', color: '#888', cursor: 'not-allowed'}} />`
);
fs.writeFileSync('src/pages/Checkout.jsx', checkout, 'utf8');

// 3. Update PaymentStatus.jsx to use mock backend instead of Razorpay
let ps = fs.readFileSync('src/pages/PaymentStatus.jsx', 'utf8');
ps = ps.replace(
  /const initiateRazorpay = async \(\) => \{[\s\S]*?const renderContent = \(\) => \{/,
  `const initiatePaymentFlow = async () => {
    if (cart.length === 0) {
      navigate('/payment-status?status=failed');
      return;
    }

    const itemCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    const subtotal = cart.reduce((total, item) => total + (item.priceCents || 0) * (item.quantity || 1), 0);
    const shipping = itemCount > 0 ? 5000 : 0; 
    const tax = Math.round(subtotal * 0.05); 
    const total = subtotal + shipping + tax;

    let formData = {};
    try {
      formData = JSON.parse(localStorage.getItem('checkoutFormData')) || {};
    } catch(e) {}

    // --- MOCK RAZORPAY / PLACE ORDER DIRECTLY ---
    try {
      // We assume Razorpay is completed and just place the order in the database directly for now.
      const orderRes = await fetch('/api/place-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${localStorage.getItem('wtp-token') || ''}\` },
        body: JSON.stringify({ 
          amount: total,
          cart: cart,
          shippingDetails: formData
        })
      });
      const order = await orderRes.json();
      
      if (order.success) {
        // We simulate a secure gateway connection delay so the UI feels authentic
        setTimeout(() => {
          navigate('/payment-status?status=success');
        }, 1500);
      } else {
        setTimeout(() => {
          navigate('/payment-status?status=failed');
        }, 1500);
      }
    } catch (err) {
      navigate('/payment-status?status=failed');
    }
  };

  const renderContent = () => {`
);

ps = ps.replace(/initiateRazorpay\(\);/, 'initiatePaymentFlow();');

// Because we need clearCart, we should import it
if (!ps.includes('clearCart')) {
  ps = ps.replace(/const \{ cart \} = useContext\(StoreContext\);/, 'const { cart, clearCart } = useContext(StoreContext);');
  
  // Call clearCart on success
  ps = ps.replace(
    /if \(displayStatus === 'success'\) \{/,
    `if (displayStatus === 'success') {
      // Clear cart when viewing success page (safe to call multiple times if already empty)
      if (cart.length > 0) {
        setTimeout(() => clearCart(), 100);
      }`
  );
}

fs.writeFileSync('src/pages/PaymentStatus.jsx', ps, 'utf8');
