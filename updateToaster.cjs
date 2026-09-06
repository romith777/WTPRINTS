const fs = require('fs');

let app = fs.readFileSync('src/App.jsx', 'utf8');

const newToaster = `<Toaster 
        position="top-right" 
        toastOptions={{ 
          duration: 3000,
          style: { 
            fontSize: '16px', 
            padding: '16px 24px',
            fontWeight: 'bold',
            background: '#111',
            color: '#fff',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          },
          success: {
            iconTheme: {
              primary: '#ee0652',
              secondary: '#fff',
            },
          }
        }} 
      />`;

app = app.replace(
  /<Toaster position="top-right" toastOptions=\{\{ style: \{ fontSize: '14px', fontWeight: 'bold' \} \}\} \/>/,
  newToaster
);

fs.writeFileSync('src/App.jsx', app, 'utf8');
