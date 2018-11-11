const Product = require('../models/product');

const getAddProduct = (req, res) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    activeAddProduct: true,
    productCSS: true,
    formsCSS: true
  });
};

const postAddProduct = (req, res) => {
  const title       = req.body.title;
  const imageURL    = req.body.imageURL;
  const description = req.body.description;
  const price       = req.body.price;
  const product     = new Product(title, imageURL, description, price);
  product.save();
  res.redirect('/');
};

const getProducts = (req, res) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      pageTitle: 'Admin Products',
      prods: products,
      hasProducts: products.length > 0,
      activeAdminProducts: true,
      productCSS: true
    });
  });
};

module.exports = {
  getAddProduct,
  postAddProduct,
  getProducts
};
