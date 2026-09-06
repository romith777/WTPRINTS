const fs = require('fs');

let app = fs.readFileSync('src/App.jsx', 'utf8');

// Add import if not exists
if (!app.includes('react-hot-toast')) {
  app = app.replace(
    /import \{ StoreProvider \} from '\.\/context\/StoreContext';/,
    "import { StoreProvider } from './context/StoreContext';\nimport { Toaster } from 'react-hot-toast';"
  );
  
  // Add Toaster inside App wrapper
  app = app.replace(
    /<StoreProvider>/,
    "<StoreProvider>\n      <Toaster position=\"top-right\" toastOptions={{ style: { fontSize: '14px', fontWeight: 'bold' } }} />"
  );
}

fs.writeFileSync('src/App.jsx', app, 'utf8');
