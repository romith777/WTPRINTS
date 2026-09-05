const fs = require('fs');

let checkout = fs.readFileSync('src/pages/Checkout.jsx', 'utf8');

// Replace both loadRazorpay and handleSubmit
checkout = checkout.replace(
  /const loadRazorpay = \(\) => \{[\s\S]*?const handleSubmit = async \(e\) => \{[\s\S]*?alert\("Failed to initiate payment"\);\s*setLoading\(false\);\s*\}\s*\};/,
  `const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    
    setLoading(true);
    localStorage.setItem('checkoutFormData', JSON.stringify(formData));
    
    setTimeout(() => {
      navigate('/payment-status?status=initiate');
    }, 100);
  };`
);

fs.writeFileSync('src/pages/Checkout.jsx', checkout, 'utf8');
