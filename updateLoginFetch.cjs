const fs = require('fs');

let login = fs.readFileSync('api/login.js', 'utf8');

// Inject the fetch queries right before the token generation
const fetchQueries = `
    const userIdStr = user._id.toString();
    const cartDoc = await db.collection('cart').findOne({ userId: userIdStr });
    const favDoc = await db.collection('favorites').findOne({ userId: userIdStr });
    
    // Sign JWT
`;

login = login.replace(/\/\/\s*Sign JWT/, fetchQueries);

login = login.replace(
  /user: \{ username: user\.username, email: user\.email, cart: user\.cart \|\| \[\], favorites: user\.favorites \|\| \[\] \}/,
  'user: { username: user.username, email: user.email, cart: (cartDoc && cartDoc.items) || [], favorites: (favDoc && favDoc.items) || [] }'
);

fs.writeFileSync('api/login.js', login, 'utf8');
