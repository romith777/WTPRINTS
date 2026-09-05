const fs = require('fs');

let cart = fs.readFileSync('src/pages/Cart.jsx', 'utf8');

const loadScriptFunc = `
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => { resolve(true); };
      script.onerror = () => { resolve(false); };
      document.body.appendChild(script);
    });
  };
`;

const handleCheckoutFunc = `
  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    
    const res = await loadRazorpay();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }) // total is already in cents/paise format
      });
      const order = await orderRes.json();
      
      if (!order.id) {
        alert("Server error. Are you running on Vercel with Razorpay keys configured?");
        return;
      }

      const options = {
        key: order.key_id || 'rzp_test_dummy', 
        amount: order.amount,
        currency: order.currency,
        name: "WTPRINTS",
        description: "Pay online to avoid cash on delivery",
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response)
            });
            const verify = await verifyRes.json();
            if (verify.status === "ok") {
              alert("Payment Successful! Order Placed.");
              // You can clear cart here if you had a clearCart function
              window.location.href = "/profile";
            } else {
              alert("Payment verification failed.");
            }
          } catch(e) {
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: "User",
          email: "user@example.com"
        },
        theme: { color: "#ee0652" }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Failed to create order");
    }
  };
`;

// Insert the functions right before `return (`
cart = cart.replace('return (', loadScriptFunc + '\n' + handleCheckoutFunc + '\n  return (');

// Update the Checkout button to trigger `handleCheckout`
cart = cart.replace(
  /<button style=\{\{width: '100%'.*?Checkout<\/button>/,
  "<button onClick={handleCheckout} style={{width: '100%', padding: '15px', backgroundColor: '#ee0652', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '20px'}}>Checkout securely with Razorpay</button>"
);

fs.writeFileSync('src/pages/Cart.jsx', cart, 'utf8');
