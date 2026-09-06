const fs = require('fs');

let app = fs.readFileSync('src/App.jsx', 'utf8');

app = app.replace(
  /import \{ Toaster \} from 'react-hot-toast';/,
  "import { Toaster, ToastBar, toast } from 'react-hot-toast';"
);

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
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            cursor: 'pointer'
          },
          success: {
            iconTheme: {
              primary: '#ee0652',
              secondary: '#fff',
            },
          }
        }} 
      >
        {(t) => (
          <div onClick={() => toast.dismiss(t.id)}>
            <ToastBar toast={t} />
          </div>
        )}
      </Toaster>`;

app = app.replace(
  /<Toaster[\s\S]*?\/>/,
  newToaster
);

fs.writeFileSync('src/App.jsx', app, 'utf8');
