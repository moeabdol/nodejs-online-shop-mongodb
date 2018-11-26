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

const postAddProduct = (req, res) => {
  const title       = req.body.title;
  const price       = req.body.price;
  const description = req.body.description;
  const imageUrl    = req.body.imageUrl;
  const errors      = validationResult(req);

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
        errorMessage: null
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
    .catch(err => console.error(err));
};

const postDeleteProduct = (req, res) => {
  const productId = req.params.id;
  Product.deleteOne({ _id: productId, userId: req.user._id })
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
