const fs = require('fs');

function fixJwt(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/'fallback_secret'/g, "'fallback-secret-key-for-dev'");
  fs.writeFileSync(file, content, 'utf8');
}

fixJwt('api/my-orders.js');
fixJwt('api/place-order.js');
