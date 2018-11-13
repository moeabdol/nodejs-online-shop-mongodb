const Product = require('../models/product');
const Cart    = require('../models/cart');

const getCart = (req, res) => {
  req.user
    .getCart()
    .then(cart => cart.getProducts())
    .then(products => {
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        activeCart: true,
        products: products,
        hasProducts: products.length > 0
      });
    })
    .catch(err => console.error(err));
};

const postCart = (req, res) => {
  const productId = req.body.productId;
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId }});
    })
    .then(products => {
      let product;
      let newQuantity = 1;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        // ..
      } else {
        return Product.findByPk(productId)
          .then(product => {
            return fetchedCart.addProduct(product, { through: { quantity: 1 }});
          })
          .catch(err => console.error(err));
      }
    })
    .then(() => res.redirect('/cart'))
    .catch(err => console.error(err));
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

const postDeleteCartProduct = (req, res) => {
  const productId = req.params.id;
  Product.findById(productId, product => {
    Cart.deleteProduct(productId, product.price);
    res.redirect('/cart');
  });
};

module.exports = {
  getCart,
  postCart,
  getCheckout,
  getOrders,
  postDeleteCartProduct
};
