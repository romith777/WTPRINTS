import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { StoreContext } from '../context/StoreContext';
import '../styles/profile.css';

function UserProfile() {
  const { token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: 'Guest', email: 'guest@example.com' });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toastMsg, setToastMsg] = useState('');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [fetchedOrders, setFetchedOrders] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
    const storedUser = localStorage.getItem('wt_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [token, navigate]);

  useEffect(() => {
    if (activeTab === 'orders' && !fetchedOrders && token) {
      setOrdersLoading(true);
      fetch('/api/my-orders', {
        headers: { 'Authorization': `Bearer ${token}` }
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

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem('wt_user');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  
  const handleSettingUpdate = async (e, type) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    if (type === 'Password') {
      if (data.newPassword !== data.confirmPassword) {
        toast.error("New passwords do not match!");
        return;
      }
    }

    const loadToast = toast.loading('Updating...');
    try {
      const res = await fetch('/api/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ type, ...data })
      });
      const result = await res.json();
      
      if (result.success) {
        toast.success(result.message, { id: loadToast });
        if (type === 'Email') {
          const updatedUser = { ...user, email: result.email };
          setUser(updatedUser);
          localStorage.setItem('wt_user', JSON.stringify(updatedUser));
        }
        e.target.reset(); // clear form
      } else {
        toast.error(result.message || 'Update failed', { id: loadToast });
      }
    } catch (err) {
      toast.error('Network error. Try again.', { id: loadToast });
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <h2 className="profile-header">Dashboard Overview</h2>
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h3>{orders.filter(o => o.status !== 'Delivered').length}</h3>
                <p>Active Orders</p>
              </div>
              <div className="dashboard-card">
                <h3>0</h3>
                <p>Saved Designs</p>
              </div>
              <div className="dashboard-card">
                <h3>0</h3>
                <p>Wishlist Items</p>
              </div>
            </div>
            <div className="settings-section">
              <h3>Recent Activity</h3>
              <p style={{color: '#666'}}>No recent activity on your account. Time to start designing!</p>
            </div>
          </>
        );
      
      case 'orders':
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
                            <Link to={`/product/${item._id}`} className="btn-secondary" style={{padding: '8px 15px', fontSize: '14px'}}>View Item</Link>
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

      case 'settings':
        return (
          <>
            <h2 className="profile-header">Account Settings</h2>
            
            {toastMsg && (
              <div style={{backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '15px', borderRadius: '8px', marginBottom: '20px', fontWeight: 'bold'}}>
                ✓ {toastMsg}
              </div>
            )}

            <div className="settings-section">
              <h3>Update Email Address</h3>
              <form onSubmit={(e) => handleSettingUpdate(e, 'Email')}>
                <div className="settings-form-group">
                  <label>Current Email</label>
                  <input type="email" value={user.email} disabled style={{backgroundColor: '#f5f5f5', color: '#888'}} />
                </div>
                <div className="settings-form-group">
                  <label>New Email</label>
                  <input type="email" name="newEmail" placeholder="Enter new email address" required />
                </div>
                <button type="submit" className="btn-primary">Save Email</button>
              </form>
            </div>

            <div className="settings-section">
              <h3>Change Password</h3>
              <form onSubmit={(e) => handleSettingUpdate(e, 'Password')}>
                <div className="settings-form-group">
                  <label>Current Password</label>
                  <input type="password" name="currentPassword" placeholder="••••••••" required />
                </div>
                <div className="settings-form-group">
                  <label>New Password</label>
                  <input type="password" name="newPassword" placeholder="••••••••" required />
                </div>
                <div className="settings-form-group">
                  <label>Confirm New Password</label>
                  <input type="password" name="confirmPassword" placeholder="••••••••" required />
                </div>
                <button type="submit" className="btn-primary">Update Password</button>
              </form>
            </div>
          </>
        );

      case 'designs':
        return (
          <>
            <h2 className="profile-header">My Custom Designs</h2>
            <div className="settings-section" style={{textAlign: 'center', padding: '50px 20px'}}>
              <div style={{fontSize: '50px', marginBottom: '15px'}}>🎨</div>
              <h3 style={{marginBottom: '10px'}}>WTPrints Design Studio</h3>
              <p style={{color: '#666', marginBottom: '30px', maxWidth: '400px', margin: '0 auto 30px'}}>
                Access your custom t-shirt and hoodie designs securely saved in our creative studio.
              </p>
              <a href="https://wtprints-de.vercel.app" className="btn-secondary">Open Design Studio</a>
            </div>
          </>
        );

      case 'help':
        return (
          <>
            <h2 className="profile-header">Help & Support</h2>
            <div className="faq-item">
              <h4>Where is my order?</h4>
              <p>You can track your order status directly in the "My Orders" tab. Once shipped, a tracking link will be provided.</p>
            </div>
            <div className="faq-item">
              <h4>How do I use the Design Studio?</h4>
              <p>Click on the "My Designs" tab or the "Open Design Studio" button. You can upload images, add text, and preview your clothing in 3D!</p>
            </div>
            <div className="faq-item">
              <h4>Return & Refund Policy</h4>
              <p>We accept returns within 14 days of delivery for unworn items. Custom printed designs are final sale unless there is a manufacturing defect.</p>
            </div>
            <div className="settings-section" style={{marginTop: '30px', backgroundColor: '#fff5f8', borderColor: '#ffcdd2'}}>
              <h3 style={{color: '#ee0652'}}>Need more help?</h3>
              <p style={{color: '#555', marginBottom: '15px'}}>Our support team is available 24/7 to assist you.</p>
              <button className="btn-primary" onClick={() => showToast('Support request sent! We will email you shortly.')}>Contact Support</button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <Navbar />
      
      <div className="profile-page">
        <div className="profile-layout">
          
          {/* Sidebar */}
          <aside className="profile-sidebar">
            <div className="profile-user-card">
              <div className="profile-avatar">
                {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </div>
              <h2 style={{fontSize: '20px', margin: '0 0 5px 0'}}>{user.username || user.name}</h2>
              <p style={{color: '#888', margin: 0, fontSize: '14px'}}>{user.email}</p>
            </div>
            
            <nav style={{paddingTop: '10px'}}>
              <div className={`profile-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                Dashboard 
              </div>
              <div className={`profile-nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                My Orders 
              </div>
              <div className={`profile-nav-item ${activeTab === 'designs' ? 'active' : ''}`} onClick={() => setActiveTab('designs')}>
                My Designs 
              </div>
              <div className={`profile-nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                Account Settings 
              </div>
              <div className={`profile-nav-item ${activeTab === 'help' ? 'active' : ''}`} onClick={() => setActiveTab('help')}>
                Help & Support 
              </div>
              
              <div className="profile-logout">
                <div className="profile-nav-item logout-btn" onClick={handleLogout}>
                  Logout
                </div>
              </div>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="profile-content">
            {renderContent()}
          </main>

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default UserProfile;