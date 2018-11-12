const Product = require('../models/product');
const Cart    = require('../models/cart');

const getCart = (req, res) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (let product of products) {
        const cartProduct = cart.products.find(p => p.id === product.id);
        if(cartProduct) {
          cartProducts.push({
            product: product,
            quantity: cartProduct.quantity
          });
        }
      }

      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        activeCart: true,
        products: cartProducts,
        hasProducts: cartProducts.length > 0
      });
    });
  });
};

const postCart = (req, res) => {
  const productId = req.body.productId;
  Product.findById(productId, product => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect('/cart');
};

const getCheckout = (req, res) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    activeCheckout: true
  });
};

const getOrders = (req, res) => {
  res.render('shop/orders', {
    pageTitle: 'Your Orders',
    activeOrders: true
  });
};

module.exports = {
  getCart,
  postCart,
  getCheckout,
  getOrders
};
