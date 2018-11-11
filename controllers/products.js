const Product = require('../models/product');

const getIndex = (req, res) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      pageTitle: 'Shop',
      prods: products,
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true
    });
  });
};

const getProducts = (req, res) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      pageTitle: 'All Products',
      prods: products,
      hasProducts: products.length > 0,
      activeProducts: true,
      productCSS: true
    });
  });
};

module.exports = {
  getIndex,
  getProducts
};
