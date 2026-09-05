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
        const regex1 = new RegExp(`import\\s+['"]\\.\\/${css}['"];?`, 'g');
        const regex2 = new RegExp(`import\\s+['"]\\.\\.\\/${css}['"];?`, 'g');
        
        if (dir === 'src') {
          content = content.replace(regex1, `import './styles/${css}';`);
        } else {
          content = content.replace(regex1, `import '../styles/${css}';`);
          content = content.replace(regex2, `import '../styles/${css}';`);
        }
      });
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

updateImportsInDir('src');
