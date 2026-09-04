const fs = require('fs');

// --- 1. Fix Home.jsx Spacing ---
let homeContent = fs.readFileSync('src/pages/Home.jsx', 'utf8');
homeContent = homeContent.replace(/<h1 style=\{\{ textAlign: 'center', padding: '20px', fontFamily: 'Boldonse, sans-serif' \}\}>/g, "<h1 style={{ textAlign: 'center', padding: '10px 20px', margin: 0, fontFamily: 'Boldonse, sans-serif', marginTop: '10px' }}>");
fs.writeFileSync('src/pages/Home.jsx', homeContent, 'utf8');

// --- 2. Fix Products.jsx Search Logic, Layout & Related Products ---
let prodContent = fs.readFileSync('src/pages/Products.jsx', 'utf8');

// A. Fix baseProducts memo to search globally if searchQuery exists
const oldBaseProducts =     // 1. Flatten all categories into a single array, or just pick the requested one
    const baseProducts = useMemo(() => {
      let combined = [];
      if (urlCategory && allProducts[urlCategory]) {
        combined = [...allProducts[urlCategory]];
      } else {
        Object.keys(allProducts).forEach(key => {
          if (Array.isArray(allProducts[key])) {
            combined = [...combined, ...allProducts[key]];
          }
        });
      }
      return combined;
    }, [allProducts, urlCategory]);;

const newBaseProducts =     // 1. Flatten all categories into a single array, or just pick the requested one
    const baseProducts = useMemo(() => {
      let combined = [];
      // If there is an active search, ignore the urlCategory and search EVERYTHING
      if (searchQuery && searchQuery.trim().length > 0) {
        Object.keys(allProducts).forEach(key => {
          if (Array.isArray(allProducts[key])) {
            combined = [...combined, ...allProducts[key]];
          }
        });
      } else if (urlCategory && allProducts[urlCategory]) {
        combined = [...allProducts[urlCategory]];
      } else {
        Object.keys(allProducts).forEach(key => {
          if (Array.isArray(allProducts[key])) {
            combined = [...combined, ...allProducts[key]];
          }
        });
      }
      return combined;
    }, [allProducts, urlCategory, searchQuery]);;
prodContent = prodContent.replace(oldBaseProducts, newBaseProducts);

// B. Fix Header Title to say "SEARCH RESULTS" if searching
prodContent = prodContent.replace(/const categoryTitle = urlCategory \? urlCategory\.toUpperCase\(\) : 'ALL PRODUCTS';/, "const categoryTitle = (searchQuery && searchQuery.trim().length > 0) ? SEARCH: \ : (urlCategory ? urlCategory.toUpperCase() : 'ALL PRODUCTS');");

// C. Fix Max-Width Zoom Issue
prodContent = prodContent.replace(/className="browse-content" id="main" style=\{\{paddingTop: '80px', padding: '40px 5vw'\}\}/, "className=\\"browse-content\\" id=\\"main\\" style={{paddingTop: '80px', padding: '40px 5vw', maxWidth: '1600px', margin: '0 auto'}}");

// D. Make suggested fallback permanent at the bottom of the page
const oldFallbackBlock =               {suggestedFallback.length > 0 && (
                <div>
                  <h2 style={{fontFamily: 'Boldonse, sans-serif', textTransform: 'uppercase', fontSize: '24px', marginBottom: '20px'}}>Check out these instead</h2>
                  <div className="browsing-section" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px'}}>
                    {suggestedFallback.map(p => <ProductCard key={p._id} {...p} />)}
                  </div>
                </div>
              )};
prodContent = prodContent.replace(oldFallbackBlock, ""); // Remove from empty state

const newPermanentFallback = 
          {/* ALWAYS SHOW RELATED PRODUCTS AT BOTTOM */}
          {suggestedFallback.length > 0 && (
            <div style={{marginTop: '60px', paddingTop: '40px', borderTop: '1px solid #eee'}}>
              <h2 style={{fontFamily: 'Boldonse, sans-serif', textTransform: 'uppercase', fontSize: '24px', marginBottom: '30px', textAlign: 'center'}}>You Might Also Like</h2>
              <div className="browsing-section" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px'}}>
                {suggestedFallback.map(p => <ProductCard key={p._id} {...p} />)}
              </div>
            </div>
          )}
        </main>
;
prodContent = prodContent.replace("</main>", newPermanentFallback);

fs.writeFileSync('src/pages/Products.jsx', prodContent, 'utf8');
