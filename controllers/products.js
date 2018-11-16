const Product = require('../models/product');

const getIndex = (req, res) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        pageTitle: 'Shop',
        prods: products,
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
      });
    })
    .catch(err => console.error(err));
};

const getProducts = (req, res) => {
  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        pageTitle: 'All Products',
        prods: products,
        hasProducts: products.length > 0,
        activeProducts: true,
        productCSS: true
      });
    })
    .catch(err => console.error(err));
};

const getProduct = (req, res) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then(product => {
      res.render('shop/product-details', {
        pageTitle: product.title,
        product: product
      });
    })
    .catch(err => console.error(err));
};

module.exports = {
  getIndex,
  getProducts,
  getProduct
};
