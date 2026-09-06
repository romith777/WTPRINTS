const fs = require('fs');

let ctx = fs.readFileSync('src/context/StoreContext.jsx', 'utf8');

const newFunctions = `const addToCart = (product) => {
    setCart(prev => {
      const selectedSize = product.selectedSize || 'M';
      const existing = prev.find(item => item._id === product._id && item.selectedSize === selectedSize);
      if (existing) {
        toast.success('Cart updated');
        return prev.map(item => (item._id === product._id && item.selectedSize === selectedSize) ? { ...item, quantity: item.quantity + (product.quantity || 1) } : item);
      }
      toast.success('Added to cart');
      return [...prev, { ...product, quantity: product.quantity || 1, selectedSize }];
    });
  };

  const updateQuantity = (productId, selectedSize, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prev => prev.map(item => (item._id === productId && item.selectedSize === selectedSize) ? { ...item, quantity: newQuantity } : item));
  };

  const removeFromCart = (productId, selectedSize) => {
    setCart(prev => prev.filter(item => !(item._id === productId && item.selectedSize === selectedSize)));
    toast.success('Removed from cart');
  };`;

const startIndex = ctx.indexOf('const addToCart');
const endIndex = ctx.indexOf('const clearCart');

if (startIndex !== -1 && endIndex !== -1) {
  const finalCtx = ctx.substring(0, startIndex) + newFunctions + "\\n\\n  " + ctx.substring(endIndex);
  fs.writeFileSync('src/context/StoreContext.jsx', finalCtx, 'utf8');
} else {
  console.error("Could not find boundaries");
}
