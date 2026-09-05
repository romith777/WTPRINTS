const fs = require('fs');

let up = fs.readFileSync('src/pages/UserProfile.jsx', 'utf8');

// The file now has two `case 'orders':`. 
// The first one looks like:
// case 'orders':
//   return (
//     <>
//       <h2 className="profile-header">My Orders</h2>
//       <div className="dashboard-card">...</div> ? Or something else.

// Let's just use regex to remove the FIRST instance of case 'orders' down to just before the SECOND instance of case 'orders'.
up = up.replace(/case 'orders':[\s\S]*?(?=case 'orders':)/, '');

fs.writeFileSync('src/pages/UserProfile.jsx', up, 'utf8');
