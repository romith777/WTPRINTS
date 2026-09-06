const fs = require('fs');

let t = fs.readFileSync('src/pages/UserProfile.jsx', 'utf8');

t = t.replace(
  /<div className="settings-form-group">\s*<label>Current Password<\/label>\s*<input type="password" name="newPassword"/,
  '<div className="settings-form-group">\n                  <label>Current Password</label>\n                  <input type="password" name="currentPassword"'
);

t = t.replace(
  /<div className="settings-form-group">\s*<label>Confirm New Password<\/label>\s*<input type="password" name="newPassword"/,
  '<div className="settings-form-group">\n                  <label>Confirm New Password</label>\n                  <input type="password" name="confirmPassword"'
);

fs.writeFileSync('src/pages/UserProfile.jsx', t, 'utf8');
