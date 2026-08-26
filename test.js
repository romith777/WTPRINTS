import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';
import ProductCard from './src/components/ProductCard.jsx';
import { StoreContext } from './src/context/StoreContext.jsx';

const mockContext = { favorites: [], addToCart: () => {}, toggleFavorite: () => {} };
const props = { _id: 'p1', image: ['/assets/Tees.jpg'], name: 'Gojo Tee', brandName: 'WTPRINTS', about: 'Oversized', priceCents: 129900 };

try {
  const html = renderToString(
    React.createElement(
      StaticRouter,
      null,
      React.createElement(
        StoreContext.Provider,
        { value: mockContext },
        React.createElement(ProductCard, props)
      )
    )
  );
  console.log("SUCCESS:");
  console.log(html);
} catch (e) {
  console.error("CRASH:");
  console.error(e);
}
