const fs = require('fs');

let up = fs.readFileSync('src/pages/UserProfile.jsx', 'utf8');

// Add state for orders
up = up.replace(
  /const \[toastMsg, setToastMsg\] = useState\(''\);/,
  `const [toastMsg, setToastMsg] = useState('');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [fetchedOrders, setFetchedOrders] = useState(false);`
);

// Add useEffect to fetch orders
up = up.replace(
  /const handleLogout = \(\) => \{/,
  `useEffect(() => {
    if (activeTab === 'orders' && !fetchedOrders && token) {
      setOrdersLoading(true);
      fetch('/api/my-orders', {
        headers: { 'Authorization': \`Bearer \${token}\` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrders(data.orders);
        }
        setFetchedOrders(true);
        setOrdersLoading(false);
      })
      .catch(err => {
        console.error(err);
        setOrdersLoading(false);
      });
    }
  }, [activeTab, token, fetchedOrders]);

  const handleLogout = () => {`
);

// Update Dashboard Active Orders count
up = up.replace(
  /<h3>0<\/h3>[\s\S]*?<p>Active Orders<\/p>/,
  `<h3>{orders.filter(o => o.status !== 'Delivered').length}</h3>\n                <p>Active Orders</p>`
);
up = up.replace(
  /<h3>0<\/h3>[\s\S]*?<p>Total Purchases<\/p>/,
  `<h3>{orders.length}</h3>\n                <p>Total Purchases</p>`
);

// Add case 'orders': to switch statement
up = up.replace(
  /case 'settings':/,
  `case 'orders':
        return (
          <>
            <h2 className="profile-header">My Orders</h2>
            {ordersLoading ? (
              <p>Loading your orders...</p>
            ) : orders.length === 0 ? (
              <div style={{textAlign: 'center', padding: '50px 20px', backgroundColor: '#f9f9f9', borderRadius: '12px', border: '1px solid #eaeaea'}}>
                <div style={{fontSize: '40px', marginBottom: '15px'}}>📦</div>
                <h3 style={{marginBottom: '10px'}}>No orders yet</h3>
                <p style={{color: '#666', marginBottom: '20px'}}>Looks like you haven't made your first purchase.</p>
                <Link to="/" className="btn-primary">Start Shopping</Link>
              </div>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                {orders.map(order => (
                  <div key={order._id} style={{border: '1px solid #eaeaea', borderRadius: '12px', overflow: 'hidden'}}>
                    <div style={{backgroundColor: '#f9f9f9', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eaeaea'}}>
                      <div>
                        <p style={{margin: '0 0 5px 0', fontSize: '12px', color: '#666'}}>ORDER PLACED</p>
                        <p style={{margin: 0, fontWeight: 'bold'}}>{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p style={{margin: '0 0 5px 0', fontSize: '12px', color: '#666'}}>TOTAL</p>
                        <p style={{margin: 0, fontWeight: 'bold'}}>₹{(order.amount / 100).toFixed(2)}</p>
                      </div>
                      <div style={{textAlign: 'right'}}>
                        <p style={{margin: '0 0 5px 0', fontSize: '12px', color: '#666'}}>ORDER ID</p>
                        <p style={{margin: 0, fontWeight: 'bold', fontSize: '14px'}}>#{order._id.slice(-8).toUpperCase()}</p>
                      </div>
                    </div>
                    
                    <div style={{padding: '20px'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                        <h3 style={{margin: 0, color: order.status === 'Delivered' ? '#2e7d32' : '#ee0652'}}>
                          {order.status}
                        </h3>
                        <button className="btn-secondary" style={{padding: '8px 15px', fontSize: '14px'}}>Track Package</button>
                      </div>

                      <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                        {order.cart.map((item, idx) => (
                          <div key={idx} style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
                            <img src={Array.isArray(item.image) ? item.image[0] : item.image} alt="product" style={{width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover'}} />
                            <div style={{flex: 1}}>
                              <p style={{margin: '0 0 5px', fontWeight: 'bold', fontSize: '16px', color: '#111'}}>{item.brandName || item.name}</p>
                              <p style={{margin: '0 0 5px', fontSize: '14px', color: '#666'}}>{item.name}</p>
                              <p style={{margin: 0, fontSize: '14px', color: '#888'}}>Qty: {item.quantity} | Size: {item.selectedSize || 'M'}</p>
                            </div>
                            <Link to={\`/product/\${item._id}\`} className="btn-secondary" style={{padding: '8px 15px', fontSize: '14px'}}>View Item</Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        );

      case 'settings':`
);

fs.writeFileSync('src/pages/UserProfile.jsx', up, 'utf8');
