const Product = require('../models/product');

const getAddProduct = (req, res) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    activeAddProduct: true,
    productCSS: true,
    formsCSS: true
  });
};

const postAddProduct = (req, res) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect('/');
};

const getProducts = (req, res) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      pageTitle: 'Shop',
      prods: products,
      path: '/',
      hasProducts: products.length > 0,
      activeShop: true,
      productCss: true
    });
  });
};

module.exports = {
  getAddProduct,
  postAddProduct,
  getProducts
};
