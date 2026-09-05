const fs = require('fs');

let login = fs.readFileSync('src/pages/Login.jsx', 'utf8');

login = login.replace(
  /const \{ setToken \} = useContext\(StoreContext\);/,
  'const { setToken, setCart, setFavorites } = useContext(StoreContext);'
);

login = login.replace(
  /setToken\(result\.token\);/,
  `setToken(result.token);
        
        // Merge Database Cart/Favorites with Local Session
        if (result.user.cart && result.user.cart.length > 0) {
          setCart(prev => {
            const newCart = [...prev];
            result.user.cart.forEach(dbItem => {
              if (!newCart.find(localItem => localItem._id === dbItem._id && localItem.selectedSize === dbItem.selectedSize)) {
                newCart.push(dbItem);
              }
            });
            return newCart;
          });
        }
        
        if (result.user.favorites && result.user.favorites.length > 0) {
          setFavorites(prev => {
            const newFavs = [...prev];
            result.user.favorites.forEach(dbItem => {
              if (!newFavs.find(localItem => localItem._id === dbItem._id)) {
                newFavs.push(dbItem);
              }
            });
            return newFavs;
          });
        }`
);

fs.writeFileSync('src/pages/Login.jsx', login, 'utf8');
