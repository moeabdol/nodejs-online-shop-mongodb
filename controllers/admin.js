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
  const price       = req.body.price;
  const description = req.body.description;
  const imageUrl    = req.body.imageUrl;

  Product.create({
    title,
    price,
    description,
    imageUrl
  }).then(() => res.redirect('/admin/products'))
    .catch(err => console.error(err));
};

const getProducts = (req, res) => {
  Product.findAll()
    .then(products => {
      res.render('admin/products', {
        pageTitle: 'Admin Products',
        prods: products,
        hasProducts: products.length > 0,
        activeAdminProducts: true,
        productCSS: true
      });
    })
    .catch(err => console.error(err));
};

const getEditProduct = (req, res) => {
  const productId = req.params.id;
  Product.findById(productId, product => {
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      productCSS: true,
      formsCSS: true,
      product: product
    });
  });
};

const postEditProduct = (req, res) => {
  const id          = req.params.id;
  const title       = req.body.title;
  const imageURL    = req.body.imageURL;
  const price       = req.body.price;
  const description = req.body.description;
  const product     = new Product(id, title, imageURL, description, price);
  product.save();
  res.redirect('/admin/products');
};

const postDeleteProduct = (req, res) => {
  const productId = req.params.id;
  Product.deleteById(productId);
  res.redirect('/admin/products');
};

module.exports = {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct
};
