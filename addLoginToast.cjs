const fs = require('fs');

let login = fs.readFileSync('src/pages/Login.jsx', 'utf8');

if (!login.includes('react-hot-toast')) {
  login = login.replace(
    /import \{ useNavigate \} from 'react-router-dom';/,
    "import { useNavigate } from 'react-router-dom';\nimport toast from 'react-hot-toast';"
  );
  
  login = login.replace(
    /navigate\('\/'\);/,
    "toast.success('Successfully logged in!');\n          navigate('/');"
  );
}

fs.writeFileSync('src/pages/Login.jsx', login, 'utf8');
