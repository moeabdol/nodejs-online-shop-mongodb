const Product = require('../models/product');

const getAddProduct = (req, res) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    activeAddProduct: true,
    productCSS: true,
    formsCSS: true,
    isLoggedIn: req.session.isLoggedIn
  });
};

const postAddProduct = (req, res) => {
  const title       = req.body.title;
  const price       = req.body.price;
  const description = req.body.description;
  const imageUrl    = req.body.imageUrl;

  const newProduct  = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user  // mongoose will conveniently pick _id from the user object
  });

  newProduct
    .save()
    .then(() => res.redirect('/admin/products'))
    .catch(err => console.error(err));
};

const getProducts = (req, res) => {
  Product
    .find()
    .then(products => {
      res.render('admin/products', {
        pageTitle: 'Admin Products',
        prods: products,
        hasProducts: products.length > 0,
        activeAdminProducts: true,
        productCSS: true,
        isLoggedIn: req.session.isLoggedIn
      });
    })
    .catch(err => console.error(err));
};

const getEditProduct = (req, res) => {
  const productId = req.params.id;
  Product
    .findById(productId)
    .then(product => {
      if (!product) {
        return res.render('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        productCSS: true,
        formsCSS: true,
        product: product,
        isLoggedIn: req.session.isLoggedIn
      });
    })
    .catch(err => console.error(err));
};

const postEditProduct = (req, res) => {
  const productId   = req.params.id;
  const title       = req.body.title;
  const price       = req.body.price;
  const description = req.body.description;
  const imageUrl    = req.body.imageUrl;

  Product
    .findById(productId)
    .then(product => {
      product.title       = title;
      product.price       = price;
      product.description = description;
      product.imageUrl    = imageUrl;
      return product.save();
    })
    .then(() => res.redirect('/admin/products'))
    .catch(err => console.error(err));
};

const postDeleteProduct = (req, res) => {
  const productId = req.params.id;
  Product.findByIdAndRemove(productId)
    .then(() => res.redirect('/admin/products'))
    .catch(err => console.error(err));
};

module.exports = {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct
};
