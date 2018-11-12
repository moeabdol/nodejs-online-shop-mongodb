const Product = require('../models/product');
const Cart    = require('../models/cart');

const getCart = (req, res) => {
  res.render('shop/cart', {
    pageTitle: 'Your Cart',
    activeCart: true
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
