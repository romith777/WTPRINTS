const fs = require('fs');

// 1. Update UserProfile.jsx
let jsx = fs.readFileSync('src/pages/UserProfile.jsx', 'utf8');

// Remove door emoji and center logout text
jsx = jsx.replace(
  /Logout <span>🚪<\/span>/,
  'Logout'
);
// Make the logout div flex centered
jsx = jsx.replace(
  /<div className="profile-nav-item" onClick=\{handleLogout\} style=\{\{color: '#d32f2f'\}\}>/,
  '<div className="profile-nav-item logout-btn" onClick={handleLogout}>'
);

fs.writeFileSync('src/pages/UserProfile.jsx', jsx, 'utf8');

// 2. Update profile.css for OCD spacing and hover colors
let css = fs.readFileSync('src/styles/profile.css', 'utf8');

// The replacement CSS logic:
css = css.replace(/\.profile-page \{[\s\S]*?\}/, `.profile-page {
    min-height: 80vh;
    padding: 130px 5vw 80px;
    background-color: #f9f9f9;
    font-family: "League Spartan", sans-serif;
}`);

css = css.replace(/\.profile-layout \{[\s\S]*?\}/, `.profile-layout {
    display: flex;
    gap: 40px;
    max-width: 1300px;
    margin: 0 auto;
}`);

css = css.replace(/\.profile-sidebar \{[\s\S]*?\}/, `.profile-sidebar {
    width: 270px;
    flex-shrink: 0;
    background: white;
    border-radius: 12px;
    padding: 30px 0 15px 0;
    box-shadow: 0 4px 20px rgba(0,0,0,0.04);
    border: 1px solid #eaeaea;
    height: fit-content;
}`);

css = css.replace(/\.profile-user-card \{[\s\S]*?\}/, `.profile-user-card {
    padding: 0 20px 25px;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 15px;
    text-align: center;
}`);

css = css.replace(/\.profile-avatar \{[\s\S]*?\}/, `.profile-avatar {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background-color: #ee0652;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    font-weight: bold;
    margin: 0 auto 15px;
    font-family: "Boldonse", sans-serif;
}`);

css = css.replace(/\.profile-nav-item \{[\s\S]*?\}/, `.profile-nav-item {
    padding: 16px 30px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 600;
    color: #666;
    border-left: 3px solid transparent;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: space-between;
}`);

css = css.replace(/\.profile-nav-item\.active \{[\s\S]*?\}/, `.profile-nav-item.active {
    color: #ee0652;
    border-left: 3px solid #ee0652;
    background-color: #fff5f8;
}`);

css = css.replace(/\.profile-logout \{[\s\S]*?\}/, `.profile-logout {
    margin-top: 15px;
    border-top: 1px solid #f0f0f0;
    padding-top: 15px;
}`);

// Inject .logout-btn CSS instead of the old hover
css = css.replace(/\.profile-logout \.profile-nav-item:hover \{[\s\S]*?\}/, `.logout-btn {
    justify-content: center !important;
    color: #888 !important;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 14px;
}
.logout-btn:hover {
    color: #ee0652 !important;
    background-color: #fff5f8 !important;
}`);

css = css.replace(/\.profile-content \{[\s\S]*?\}/, `.profile-content {
    flex: 1;
    background: white;
    border-radius: 12px;
    padding: 50px 60px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.04);
    border: 1px solid #eaeaea;
    min-height: 500px;
}`);

css = css.replace(/\.profile-header \{[\s\S]*?\}/, `.profile-header {
    font-family: "Boldonse", sans-serif;
    font-size: 32px;
    margin-top: 0;
    margin-bottom: 35px;
    color: #111;
    text-transform: uppercase;
    border-bottom: 2px solid #f5f5f5;
    padding-bottom: 20px;
}`);

css = css.replace(/\.settings-section \{[\s\S]*?\}/, `.settings-section {
    margin-bottom: 40px;
    background: #fafafa;
    padding: 35px 40px;
    border: 1px solid #f0f0f0;
    border-radius: 12px;
}`);

css = css.replace(/\.settings-section h3 \{[\s\S]*?\}/, `.settings-section h3 {
    font-size: 18px;
    margin-top: 0;
    margin-bottom: 25px;
    color: #111;
}`);

css = css.replace(/\.settings-form-group label \{[\s\S]*?\}/, `.settings-form-group label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #555;
}`);

fs.writeFileSync('src/styles/profile.css', css, 'utf8');
