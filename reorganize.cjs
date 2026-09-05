const fs = require('fs');
const path = require('path');

// 1. Create styles directory and move CSS files
if (!fs.existsSync('src/styles')) {
  fs.mkdirSync('src/styles');
}

const cssFiles = ['App.css', 'cart.css', 'favPage.css', 'index.css', 'login.css', 'products-render.css', 'productSinglePage.css'];
cssFiles.forEach(file => {
  if (fs.existsSync(path.join('src', file))) {
    fs.renameSync(path.join('src', file), path.join('src/styles', file));
  }
});

// 2. Update imports in all JSX files
function updateImportsInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      updateImportsInDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Update basic CSS imports
      cssFiles.forEach(css => {
        // Match import './App.css' or import '../App.css'
        const regex1 = new RegExp(\import\\\\s+['"]\\\\.\\\\/\['"];?\, 'g');
        const regex2 = new RegExp(\import\\\\s+['"]\\\\.\\\\.\\\\/\['"];?\, 'g');
        
        // Replace based on depth. 
        // If in src/ (main.jsx, App.jsx), it becomes ./styles/css
        // If in src/pages/ (Cart.jsx), it becomes ../styles/css
        if (dir === 'src') {
          content = content.replace(regex1, \import './styles/\';\);
        } else {
          // If already in a subdirectory
          content = content.replace(regex1, \import '../styles/\';\);
          content = content.replace(regex2, \import '../styles/\';\);
        }
      });
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

updateImportsInDir('src');
