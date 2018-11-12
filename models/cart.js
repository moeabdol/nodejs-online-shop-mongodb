const fs   = require('fs');
const path = require('path');

const file = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(file, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }

      const existingProductIndex = cart.products.findIndex(p => p.id === id);
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.quantity++;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, quantity: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;

      fs.writeFile(file, JSON.stringify(cart), err => console.error(err));
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(file, (err, fileContent) => {
      const cart = JSON.parse(fileContent);

      if (err) {
        console.error(err);
      } else {
        const updatedCart = { ...cart };
        const product = updatedCart.products.find(p => p.id === id);
        const productQuantity = product.quantity;

        updatedCart.products = updatedCart.products.filter(p => p.id !== id);
        updatedCart.totalPrice =
          updatedCart.totalPrice - +productPrice * productQuantity;

        fs.writeFile(file, JSON.stringify(updatedCart), err => {
          if (err) console.error(err);
        });
      }
    });
  }
}

module.exports = Cart;
