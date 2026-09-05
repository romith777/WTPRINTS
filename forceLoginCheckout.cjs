const fs = require('fs');

let checkout = fs.readFileSync('src/pages/Checkout.jsx', 'utf8');

checkout = checkout.replace(
  /const \{ cart \} = useContext\(StoreContext\);/,
  'const { cart, token } = useContext(StoreContext);'
);

// Inject redirect hook
const redirectHook = `
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);
`;

checkout = checkout.replace(
  /const \[loading, setLoading\] = useState\(false\);/,
  `const [loading, setLoading] = useState(false);\n${redirectHook}`
);

fs.writeFileSync('src/pages/Checkout.jsx', checkout, 'utf8');
