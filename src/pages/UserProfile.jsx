import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
    const storedUser = localStorage.getItem('wt_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [token, navigate]);

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem('wt_user');
    navigate('/');
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleSettingUpdate = (e, type) => {
    e.preventDefault();
    showToast(`${type} successfully updated!`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <h2 className="profile-header">Dashboard Overview</h2>
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h3>0</h3>
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
            <div className="empty-state">
              <div style={{fontSize: '50px', marginBottom: '15px'}}>📦</div>
              <h3>No Orders Yet</h3>
              <p>You haven't placed any orders with us yet. Explore our collection!</p>
              <Link to="/products"><button className="btn-primary">Start Shopping</button></Link>
            </div>
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
                  <input type="email" placeholder="Enter new email address" required />
                </div>
                <button type="submit" className="btn-primary">Save Email</button>
              </form>
            </div>

            <div className="settings-section">
              <h3>Change Password</h3>
              <form onSubmit={(e) => handleSettingUpdate(e, 'Password')}>
                <div className="settings-form-group">
                  <label>Current Password</label>
                  <input type="password" placeholder="••••••••" required />
                </div>
                <div className="settings-form-group">
                  <label>New Password</label>
                  <input type="password" placeholder="••••••••" required />
                </div>
                <div className="settings-form-group">
                  <label>Confirm New Password</label>
                  <input type="password" placeholder="••••••••" required />
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
                Dashboard <span>→</span>
              </div>
              <div className={`profile-nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                My Orders <span>→</span>
              </div>
              <div className={`profile-nav-item ${activeTab === 'designs' ? 'active' : ''}`} onClick={() => setActiveTab('designs')}>
                My Designs <span>→</span>
              </div>
              <div className={`profile-nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                Account Settings <span>→</span>
              </div>
              <div className={`profile-nav-item ${activeTab === 'help' ? 'active' : ''}`} onClick={() => setActiveTab('help')}>
                Help & Support <span>→</span>
              </div>
              
              <div className="profile-logout">
                <div className="profile-nav-item" onClick={handleLogout} style={{color: '#d32f2f'}}>
                  Logout <span>🚪</span>
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