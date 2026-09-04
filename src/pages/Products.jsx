import React, { useState, useContext, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { StoreContext } from '../context/StoreContext';

function Products() {
  const [searchParams] = useSearchParams();
  const { allProducts, searchQuery, isLoading } = useContext(StoreContext);
  
  // Extract URL category (e.g. "?category=tees")
  const urlCategory = searchParams.get('category');
  const categoryTitle = urlCategory ? urlCategory.toUpperCase() : 'ALL PRODUCTS';

  // State for filters
  const [maxPrice, setMaxPrice] = useState(5000);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sortOption, setSortOption] = useState('Featured');

    const suggestedFallback = useMemo(() => {
    let all = [];
    Object.keys(allProducts).forEach(key => {
      if (Array.isArray(allProducts[key])) all = [...all, ...allProducts[key]];
    });
    return all.sort(() => 0.5 - Math.random()).slice(0, 4);
  }, [allProducts]);

  // 1. Flatten all categories into a single array, or just pick the requested one
  const baseProducts = useMemo(() => {
    let combined = [];
    if (urlCategory && allProducts[urlCategory]) {
      combined = allProducts[urlCategory];
    } else {
      // Merge all categories if no specific one is selected
      Object.keys(allProducts).forEach(key => {
        if (Array.isArray(allProducts[key])) {
          combined = [...combined, ...allProducts[key]];
        }
      });
    }
    return combined;
  }, [allProducts, urlCategory]);

  // Dynamically extract unique brands for the checkboxes
  const availableBrands = useMemo(() => {
    const brands = new Set();
    baseProducts.forEach(p => { if (p.brandName) brands.add(p.brandName); });
    return Array.from(brands);
  }, [baseProducts]);

  // 2. Apply Filters
  const filteredProducts = useMemo(() => {
    let result = baseProducts;

    // Filter by Search Query
    if (searchQuery.trim() !== '') {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(p => 
        (p.name && p.name.toLowerCase().includes(lowerQuery)) ||
        (p.brandName && p.brandName.toLowerCase().includes(lowerQuery)) ||
        (p.about && p.about.toLowerCase().includes(lowerQuery))
      );
    }

    // Filter by Price (backend is cents, UI slider is Rs)
    result = result.filter(p => {
      const priceRs = (p.priceCents || 0) / 100;
      return priceRs <= maxPrice;
    });

    // Filter by Brand
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brandName));
    }

    // 3. Apply Sorting
    if (sortOption === 'Price: Low to High') {
      result = result.sort((a, b) => (a.priceCents || 0) - (b.priceCents || 0));
    } else if (sortOption === 'Price: High to Low') {
      result = result.sort((a, b) => (b.priceCents || 0) - (a.priceCents || 0));
    } else if (sortOption === 'Newest Arrivals') {
      // Assuming newer products have higher _id strings or were pushed later
      result = result.reverse(); 
    }

    return result;
  }, [baseProducts, searchQuery, maxPrice, selectedBrands, sortOption]);

  const toggleBrand = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const clearFilters = () => {
    setMaxPrice(5000);
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSortOption('Featured');
  };

  return (
    <div>
      <Navbar />
      <div className="browse-content" id="main" style={{paddingTop: '80px', padding: '100px 5vw'}}>
        
        {/* SIDEBAR */}
        <aside className="filter-section">
          <div className="filter-sticky" style={{position: 'sticky', top: '100px'}}>
            <h2 className="filter-title" style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '20px'}}>Filters</h2>
            
            {/* Price Filter */}
            <div className="filter-group" style={{marginBottom: '30px'}}>
              <h3 className="filter-group-title" style={{fontSize: '16px', marginBottom: '15px'}}>Price Range (Max)</h3>
              <div className="price-filter">
                <input 
                  type="range" 
                  min="0" 
                  max="5000" 
                  step="100"
                  value={maxPrice} 
                  onChange={(e) => setMaxPrice(Number(e.target.value))} 
                  className="price-slider" 
                  style={{width: '100%'}}
                />
                <div className="price-display" style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '14px', color: '#666'}}>
                  <span>{'\u20B9'}0</span>
                  <span>{'\u20B9'}{maxPrice}.00</span>
                </div>
              </div>
            </div>

            {/* Brand Filter */}
            <div className="filter-group" style={{marginBottom: '30px'}}>
              <h3 className="filter-group-title" style={{fontSize: '16px', marginBottom: '15px'}}>Brands</h3>
              <div className="filter-options" style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                {availableBrands.length > 0 ? availableBrands.map(brand => (
                  <label key={brand} style={{display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '15px'}}>
                    <input 
                      type="checkbox" 
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                    /> 
                    {brand}
                  </label>
                )) : <span style={{color: '#999', fontSize: '14px'}}>No brands available</span>}
              </div>
            </div>

            {/* Size Filter */}
            <div className="filter-group" style={{marginBottom: '30px'}}>
              <h3 className="filter-group-title" style={{fontSize: '16px', marginBottom: '15px'}}>Size</h3>
              <div className="filter-options" style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                {['S', 'M', 'L', 'XL', 'XXL'].map(size => {
                  const isSel = selectedSizes.includes(size);
                  return (
                    <button 
                      key={size} 
                      onClick={() => toggleSize(size)}
                      style={{
                        padding: '6px 14px', 
                        border: isSel ? '1px solid #ee0652' : '1px solid #ddd', 
                        borderRadius: '5px', 
                        backgroundColor: isSel ? '#fff5f8' : 'white', 
                        color: isSel ? '#ee0652' : '#333',
                        cursor: 'pointer',
                        fontWeight: isSel ? 'bold' : 'normal',
                        transition: 'all 0.2s'
                      }}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Sort Filter */}
            <div className="filter-group" style={{marginBottom: '30px'}}>
              <h3 className="filter-group-title" style={{fontSize: '16px', marginBottom: '15px'}}>Sort By</h3>
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '15px', outline: 'none'}}
              >
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest Arrivals</option>
              </select>
            </div>

            <button 
              onClick={clearFilters}
              style={{
                width: '100%', padding: '12px', border: '2px solid #ee0652', 
                backgroundColor: 'transparent', color: '#ee0652', borderRadius: '5px', 
                fontWeight: 'bold', cursor: 'pointer', marginTop: '10px',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#fff5f8'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              Clear All Filters
            </button>
          </div>
        </aside>
        
        {/* MAIN PRODUCTS GRID */}
        <main className="products-main">
          <div className="products-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid #eee', marginBottom: '30px'}}>
            <h1 className="products-title js-products-title" style={{fontFamily: 'Boldonse, sans-serif', textTransform: 'uppercase', margin: 0, fontSize: '32px'}}>{categoryTitle}</h1>
            <p className="products-count" style={{color: '#666'}}><span>{filteredProducts.length}</span> Products</p>
          </div>
          
                    {filteredProducts.length === 0 ? (
            <div>
              <div style={{textAlign: 'center', padding: '60px 20px', backgroundColor: '#fafafa', borderRadius: '8px', color: '#666', marginBottom: '40px'}}>
                <h2>No products found matching your filters.</h2>
                <p style={{marginTop: '10px'}}>We couldn't find any items in this category or price range.</p>
                <button onClick={clearFilters} style={{marginTop: '20px', padding: '10px 20px', backgroundColor: '#ee0652', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}>Reset Filters</button>
              </div>
              
              {suggestedFallback.length > 0 && (
                <div>
                  <h2 style={{fontFamily: 'Boldonse, sans-serif', textTransform: 'uppercase', fontSize: '24px', marginBottom: '20px'}}>Check out these instead</h2>
                  <div className="browsing-section" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px'}}>
                    {suggestedFallback.map(p => <ProductCard key={p._id} {...p} />)}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="browsing-section" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px'}}>
              {filteredProducts.map(p => <ProductCard key={p._id} {...p} />)}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
export default Products;



