import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from './ProductCard';

describe('ProductCard Component', () => {
  const mockProduct = {
    _id: 'test-123',
    name: 'Vintage Wash Hoodie',
    brandName: 'raiz',
    about: 'Oversized heavy blend',
    priceCents: 499900,
    image: ['https://res.cloudinary.com/dkqc99bkj/image/upload/v1724213962/raiz_front.jpg']
  };

  test('renders correctly based on provided props', () => {
    render(
      <BrowserRouter>
        <ProductCard {...mockProduct} />
      </BrowserRouter>
    );
    
    // Renders brandName in the title
    expect(screen.getByText('raiz')).toBeInTheDocument();
    
    // Renders about description
    expect(screen.getByText('Oversized heavy blend')).toBeInTheDocument();
    
    // Renders formatted price
    expect(screen.getByText(/4999\.00/i)).toBeInTheDocument();
  });

  test('button changes text on click', () => {
    render(
      <BrowserRouter>
        <ProductCard {...mockProduct} />
      </BrowserRouter>
    );

    const button = screen.getByText('Add To Cart');
    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    // Button should briefly change to "Added!"
    expect(screen.getByText('Added!')).toBeInTheDocument();
  });
});
