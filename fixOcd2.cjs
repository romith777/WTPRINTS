const fs = require('fs');

// 1. Clean up UserProfile.jsx (Remove arrows, clean up logout)
let jsx = fs.readFileSync('src/pages/UserProfile.jsx', 'utf8');

// Remove the arrows "<span>→</span>"
jsx = jsx.replace(/<span>→<\/span>/g, '');

// Clean up Logout button in sidebar to perfectly match other items
jsx = jsx.replace(
  /<div className="profile-logout">[\s\S]*?<\/div>\s*<\/div>/,
  `<div className="profile-logout">
                <div className="profile-nav-item logout-btn" onClick={handleLogout}>
                  Logout
                </div>
              </div>`
);

fs.writeFileSync('src/pages/UserProfile.jsx', jsx, 'utf8');

// 2. Overhaul profile.css for the "Premium Clean" look
const newCss = `.profile-page {
    min-height: 80vh;
    padding: 100px 5vw 80px;
    background-color: #fafafa;
    font-family: "League Spartan", sans-serif;
}
.profile-layout {
    display: flex;
    gap: 30px;
    max-width: 1200px;
    margin: 0 auto;
    align-items: flex-start;
}

/* Sidebar */
.profile-sidebar {
    width: 280px;
    flex-shrink: 0;
    background: white;
    border-radius: 16px;
    padding: 40px 20px 30px 20px;
    box-shadow: 0 4px 25px rgba(0,0,0,0.03);
    border: 1px solid #f0f0f0;
}
.profile-user-card {
    text-align: center;
    margin-bottom: 35px;
}
.profile-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: #ee0652;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: bold;
    margin: 0 auto 15px;
    font-family: "Boldonse", sans-serif;
    box-shadow: 0 4px 15px rgba(238, 6, 82, 0.2);
}
.profile-user-card h2 {
    font-size: 20px;
    margin: 0 0 4px 0;
    color: #111;
}
.profile-user-card p {
    color: #888;
    margin: 0;
    font-size: 14px;
}

/* Nav Items (Pill Design) */
.profile-nav-item {
    padding: 14px 20px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 600;
    color: #555;
    border-radius: 10px;
    margin-bottom: 6px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
}
.profile-nav-item:hover {
    background-color: #f5f5f5;
    color: #111;
}
.profile-nav-item.active {
    color: #ee0652;
    background-color: #fff0f4;
}

/* Logout */
.profile-logout {
    margin-top: 40px;
}
.logout-btn {
    color: #666 !important;
}
.logout-btn:hover {
    color: #ee0652 !important;
    background-color: #fff0f4 !important;
}

/* Main Content */
.profile-content {
    flex: 1;
    background: white;
    border-radius: 16px;
    padding: 50px 60px;
    box-shadow: 0 4px 25px rgba(0,0,0,0.03);
    border: 1px solid #f0f0f0;
    min-height: 600px;
}
.profile-header {
    font-family: "Boldonse", sans-serif;
    font-size: 30px;
    margin-top: 0;
    margin-bottom: 40px;
    color: #111;
    text-transform: uppercase;
}

/* Dashboard Cards */
.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 25px;
    margin-bottom: 40px;
}
.dashboard-card {
    background: #ffffff;
    border: 1px solid #eaeaea;
    padding: 35px 20px;
    border-radius: 16px;
    text-align: center;
    transition: all 0.3s ease;
    box-shadow: 0 2px 10px rgba(0,0,0,0.01);
}
.dashboard-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.06);
    border-color: #f5f5f5;
}
.dashboard-card h3 {
    font-size: 38px;
    color: #ee0652;
    margin: 0 0 10px 0;
    line-height: 1;
    font-family: "Boldonse", sans-serif;
}
.dashboard-card p {
    color: #666;
    font-weight: 600;
    margin: 0;
    font-size: 15px;
}

/* Settings Forms */
.settings-section {
    margin-bottom: 45px;
    background: #fafafa;
    padding: 40px 45px;
    border: 1px solid #eaeaea;
    border-radius: 16px;
}
.settings-section h3 {
    font-size: 18px;
    margin-top: 0;
    margin-bottom: 25px;
    color: #111;
}
.settings-form-group {
    margin-bottom: 25px;
}
.settings-form-group label {
    display: block;
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 600;
    color: #444;
}
.settings-form-group input {
    width: 100%;
    padding: 14px 18px;
    border: 1px solid #ddd;
    border-radius: 10px;
    font-size: 15px;
    outline: none;
    transition: all 0.2s;
    font-family: inherit;
    background-color: white;
}
.settings-form-group input:focus {
    border-color: #ee0652;
    box-shadow: 0 0 0 3px rgba(238, 6, 82, 0.1);
}

/* Buttons */
.btn-primary {
    background-color: #ee0652;
    color: white;
    border: none;
    padding: 14px 28px;
    border-radius: 10px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
}
.btn-primary:hover {
    background-color: #c00545;
    transform: translateY(-1px);
}
.btn-secondary {
    background-color: #111;
    color: white;
    border: none;
    padding: 14px 28px;
    border-radius: 10px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
    text-decoration: none;
    display: inline-block;
}
.btn-secondary:hover {
    background-color: #333;
    transform: translateY(-1px);
}

/* Empty States */
.empty-state {
    text-align: center;
    padding: 80px 20px;
    background: #fafafa;
    border: 1px dashed #d0d0d0;
    border-radius: 16px;
}
.empty-state h3 {
    font-size: 22px;
    color: #111;
    margin-bottom: 12px;
}
.empty-state p {
    color: #666;
    margin-bottom: 30px;
}

/* Help Accordion */
.faq-item {
    border: 1px solid #eaeaea;
    border-radius: 12px;
    margin-bottom: 16px;
    padding: 24px;
    background: #fafafa;
}
.faq-item h4 {
    font-size: 17px;
    color: #111;
    margin-top: 0;
    margin-bottom: 12px;
}
.faq-item p {
    color: #555;
    line-height: 1.7;
    margin: 0;
}

@media (max-width: 900px) {
    .profile-layout {
        flex-direction: column;
    }
    .profile-sidebar {
        width: 100%;
        padding: 30px 20px;
    }
    .profile-content {
        padding: 30px 25px;
    }
    .profile-page {
        padding: 90px 15px 40px;
    }
}`;
fs.writeFileSync('src/styles/profile.css', newCss, 'utf8');
