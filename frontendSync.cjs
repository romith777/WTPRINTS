const fs = require('fs');

let ctx = fs.readFileSync('src/context/StoreContext.jsx', 'utf8');

// Ensure useRef is imported
if (!ctx.includes('useRef')) {
  ctx = ctx.replace(/import React, \{ createContext, useState, useEffect \} from 'react';/, "import React, { createContext, useState, useEffect, useRef } from 'react';");
}

// Inject Debounced Sync Effect
const syncEffect = `
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (!token) return;

    const handler = setTimeout(() => {
      fetch('/api/sync-user-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${token}\`
        },
        body: JSON.stringify({ cart, favorites })
      }).catch(err => console.error("Failed to sync data", err));
    }, 5000);

    return () => clearTimeout(handler);
  }, [cart, favorites, token]);
`;

// Insert the sync effect right before useEffect(() => { fetch('/api/products')
ctx = ctx.replace(
  /useEffect\(\(\) => \{\s*fetch\('\/api\/products'\)/,
  syncEffect + "\n  useEffect(() => {\n    fetch('/api/products')"
);

// Add setCart and setFavorites to the context Provider
ctx = ctx.replace(
  /cart, favorites, addToCart,/,
  'cart, setCart, favorites, setFavorites, addToCart,'
);

fs.writeFileSync('src/context/StoreContext.jsx', ctx, 'utf8');
