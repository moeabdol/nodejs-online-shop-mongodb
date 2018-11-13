const Product = require('../models/product');

const getIndex = (req, res) => {
  Product.fetchAll()
    .then(([rows]) => {
      res.render('shop/index', {
        pageTitle: 'Shop',
        prods: rows,
        hasProducts: rows.length > 0,
        activeShop: true,
        productCSS: true
      });
    })
    .catch(err => console.error(err));
};

const getProducts = (req, res) => {
  Product.fetchAll()
    .then(([rows]) => {
      res.render('shop/index', {
        pageTitle: 'All Products',
        prods: rows,
        hasProducts: rows.length > 0,
        activeProducts: true,
        productCSS: true
      });
    })
    .catch(err => console.error(err));
};

const getProduct = (req, res) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then(([product]) => {
      res.render('shop/product-details', {
        pageTitle: product[0].title,
        product: product[0]
      });
    })
    .catch(err => console.error(err));
};

module.exports = {
  getIndex,
  getProducts,
  getProduct
};
