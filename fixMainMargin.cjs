const fs = require('fs');

let css = fs.readFileSync('src/styles/payment.css', 'utf8');

css = css.replace(
  /\.payment-form-wrap \{/,
  '.payment-form-wrap {\n    margin-top: 0;'
);

fs.writeFileSync('src/styles/payment.css', css, 'utf8');
