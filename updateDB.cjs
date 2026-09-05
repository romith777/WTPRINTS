const fs = require('fs');

function updateDbCall(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/const db = (cachedClient|client)\.db\(\);/g, "const db = $1.db('wtprints');");
  fs.writeFileSync(file, content, 'utf8');
}

updateDbCall('api/login.js');
updateDbCall('api/signup.js');
updateDbCall('api/products.js');
