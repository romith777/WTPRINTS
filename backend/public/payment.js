document.addEventListener('DOMContentLoaded', () => {
  
  const wt_user = JSON.parse(localStorage.getItem('wt_user'));

  document.getElementById('full-name').value = wt_user.name;
  document.getElementById('full-name').readOnly = true;
  document.getElementById('email').value = wt_user.email;
  document.getElementById('email').readOnly = true;
  
  const form = document.getElementById('checkout-form');

  form.addEventListener('submit', function (e) {
      e.preventDefault();

      const terms = document.getElementById('terms');
      if (!terms.checked) {
          terms.setCustomValidity('Please accept the Terms & Conditions to continue.');
      } else {
          terms.setCustomValidity('');
      }

      if (!form.checkValidity()) {
          form.reportValidity();
          return;
      }

      document.dispatchEvent(new Event('checkout:submit'));
  });

  document.getElementById('terms').addEventListener('change', function () {
      this.setCustomValidity('');
  });

  // Populate summary from localStorage cart
  function formatCurrency(priceCents) {
      return (priceCents / 100).toFixed(2);
  }

  function renderSummary() {
      const cart = JSON.parse(localStorage.getItem('cart') || '{}');
      const container = document.getElementById('summary-items');
      let html = '';
      let itemCount = 0;
      let subtotalCents = 0;

      for (const key in cart) {
          const item = cart[key];
          const qty = item.quantity || 1;
          itemCount += qty;
          subtotalCents += (item.priceCents || 0) * qty;

          html += `
              <div class="summary-item">
                  <div class="summary-item-img">
                      <img src="${item.image[0]}" alt="${item.brandName}">
                      <span class="summary-qty-badge">${qty}</span>
                  </div>
                  <div class="summary-item-info">
                      <p class="summary-item-name">${item.brandName}</p>
                      <p class="summary-item-meta">Size: ${item.selectedSize || 'M'}</p>
                  </div>
                  <p class="summary-item-price">₹${formatCurrency(item.priceCents * qty)}</p>
              </div>
          `;
      }

      container.innerHTML = html;

      const shipping = itemCount > 0 ? 5000 : 0;
      const tax = Math.round(subtotalCents * 0.05);
      const total = subtotalCents + shipping + tax;

      document.getElementById('itemCount').textContent = itemCount;
      document.getElementById('subtotal').textContent = formatCurrency(subtotalCents);
      document.getElementById('shipping').textContent = formatCurrency(shipping);
      document.getElementById('tax').textContent = formatCurrency(tax);
      document.getElementById('total').textContent = formatCurrency(total);
      document.getElementById('pay-amount').textContent = formatCurrency(total);
  }

  renderSummary();
  // console.log(window.RAZORPAY_KEY);

  // Listen for the custom event fired by the form ONLY after all fields are valid
  document.addEventListener('checkout:submit', async () => {

    const order = await fetch('/api/create-order', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: wt_user.name })
    }).then(res => res.json());

    console.log(order.amount);

    var options = {
      key: window.RAZORPAY_KEY,
      amount: order.amount,
      currency: order.currency,
      name: "WTPRINTS",
      description: "Pay online to avoid cash on delivery",
      order_id: order.id,
      handler: async function (response) {
        console.log(response);
        const verify = await fetch('/api/verify-payment', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response)
        });

        if (verify.ok) {
          window.location.href = "/payment-success";
        } else {
          alert("Payment failed, please retry.");
        }
      },
      theme: { color: "#ee0652" }
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
  });
});