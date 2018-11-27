const mongoose = require('mongoose');

const Product = require('../models/product');

const { validationResult } = require('express-validator/check');

const getAddProduct = (req, res) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    activeAddProduct: true,
    productCSS: true,
    formsCSS: true,
    errorMessage: null,
    oldInput: {
      title: '',
      imageUrl: '',
      price: '',
      description: ''
    }
  });
};

const postAddProduct = (req, res, next) => {
  const title       = req.body.title;
  const price       = req.body.price;
  const description = req.body.description;
  const imageUrl    = req.file;
  const errors      = validationResult(req);

  console.log(imageUrl);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/add-product', {
      pageTitle: 'Add Product',
      activeAddProduct: true,
      productCSS: true,
      formsCSS: true,
      errorMessage: errors.array()[0].msg,
      oldInput: {
        title,
        imageUrl,
        price,
        description
      }
    });
  }

  const newProduct  = new Product({
    _id: mongoose.Types.ObjectId('5bfa5b3a6fd2021ee7e9ead6'),
    title,
    price,
    description,
    imageUrl,
    userId: req.user  // mongoose will conveniently pick _id from the user object
  });

  newProduct
    .save()
    .then(() => res.redirect('/admin/products'))
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const getProducts = (req, res, next) => {
  Product
    .find({ userId: req.user._id })
    .then(products => {
      res.render('admin/products', {
        pageTitle: 'Admin Products',
        prods: products,
        hasProducts: products.length > 0,
        activeAdminProducts: true,
        productCSS: true
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const getEditProduct = (req, res, next) => {
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
        errorMessage: null
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const postEditProduct = (req, res, next) => {
  const productId   = req.params.id;
  const title       = req.body.title;
  const price       = req.body.price;
  const description = req.body.description;
  const imageUrl    = req.body.imageUrl;
  const errors      = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      activeAddProduct: true,
      productCSS: true,
      formsCSS: true,
      errorMessage: errors.array()[0].msg,
      oldInput: {
        productId,
        title,
        imageUrl,
        price,
        description
      }
    });
  }

  Product
    .findById(productId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title       = title;
      product.price       = price;
      product.description = description;
      product.imageUrl    = imageUrl;
      return product
        .save()
        .then(() => res.redirect('/admin/products'))
        .catch(err => console.error(err));
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const postDeleteProduct = (req, res, next) => {
  const productId = req.params.id;
  Product.deleteOne({ _id: productId, userId: req.user._id })
    .then(() => res.redirect('/admin/products'))
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

module.exports = {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct
};
