const fs = require('fs');
let content = fs.readFileSync('src/pages/Products.jsx', 'utf8');

const newRenderBlock = `          {isLoading ? (
            <div className="browsing-section" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px'}}>
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} style={{width: '100%', height: '420px', borderRadius: '8px', border: '1px solid #eaeaea', overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
                  <div className="shimmer-box" style={{width: '100%', paddingTop: '125%'}}></div>
                  <div style={{padding: '16px', flex: 1}}>
                    <div className="shimmer-box" style={{height: '20px', width: '70%', marginBottom: '10px', borderRadius: '4px'}}></div>
                    <div className="shimmer-box" style={{height: '15px', width: '40%', marginBottom: '20px', borderRadius: '4px'}}></div>
                    <div className="shimmer-box" style={{height: '40px', width: '100%', borderRadius: '6px'}}></div>
                  </div>
                </div>
              ))}
              <style>{\`
                .shimmer-box {
                  background: #f6f7f8;
                  background-image: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
                  background-repeat: no-repeat;
                  background-size: 800px 100%;
                  animation-duration: 1.5s;
                  animation-fill-mode: forwards; 
                  animation-iteration-count: infinite;
                  animation-name: placeholderShimmer;
                  animation-timing-function: linear;
                }
                @keyframes placeholderShimmer {
                  0% { background-position: -468px 0; }
                  100% { background-position: 468px 0; }
                }
              \`}</style>
            </div>
          ) : filteredProducts.length === 0 ? (`;

// Fix the bad block if it exists (my previous regex mistake)
content = content.replace(/\{isLoading \? \([\s\S]*?\) : filteredProducts\.length === 0 \? \(/, '{filteredProducts.length === 0 ? (');

// Apply the new block
content = content.replace('{filteredProducts.length === 0 ? (', newRenderBlock);
content = content.replace("padding: '100px 5vw'", "padding: '40px 5vw'");

fs.writeFileSync('src/pages/Products.jsx', content, 'utf8');
