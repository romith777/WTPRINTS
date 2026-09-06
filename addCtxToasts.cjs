const fs = require('fs');

let ctx = fs.readFileSync('src/context/StoreContext.jsx', 'utf8');

if (!ctx.includes('react-hot-toast')) {
  ctx = ctx.replace(
    /import React, \{ createContext, useState, useEffect, useRef \} from 'react';/,
    "import React, { createContext, useState, useEffect, useRef } from 'react';\nimport toast from 'react-hot-toast';"
  );
  
  // Update addToCart
  ctx = ctx.replace(
    /setCart\(prev => \[\.\.\.prev, \{ \.\.\.product, quantity: 1 \}\]\);/,
    "setCart(prev => [...prev, { ...product, quantity: 1 }]);\n      toast.success('Added to cart');"
  );
  ctx = ctx.replace(
    /setCart\(prev => prev\.map\(item => item\._id === product\._id \? \{ \.\.\.item, quantity: item\.quantity \+ 1 \} : item\)\);/,
    "setCart(prev => prev.map(item => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item));\n      toast.success('Cart updated');"
  );
  
  // Update removeFromCart
  ctx = ctx.replace(
    /setCart\(prev => prev\.filter\(item => item\._id !== productId\)\);/,
    "setCart(prev => prev.filter(item => item._id !== productId));\n    toast.success('Removed from cart');"
  );
  
  // Update toggleFavorite
  ctx = ctx.replace(
    /if \(exists\) return prev\.filter\(item => item\._id !== product\._id\);/,
    "if (exists) {\n        toast.success('Removed from favorites');\n        return prev.filter(item => item._id !== product._id);\n      }"
  );
  ctx = ctx.replace(
    /return \[\.\.\.prev, product\];/,
    "toast.success('Added to favorites');\n      return [...prev, product];"
  );
}

fs.writeFileSync('src/context/StoreContext.jsx', ctx, 'utf8');
