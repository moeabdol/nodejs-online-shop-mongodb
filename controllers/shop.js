const Product = require('../models/product');
const Order   = require('../models/order');

const getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        activeCart: true,
        cartCSS: true,
        products: user.cart.items,
        hasProducts: user.cart.items.length > 0
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product
    .findById(productId)
    .then(product => {
      req.user.addToCart(product, () => {
        res.redirect('/cart');
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const postDeleteCartProduct = (req, res) => {
  const productId = req.params.id;
  req.user
    .removeFromCart(productId, err => {
      if (err) return console.error(err);
      res.redirect('/cart');
    });
};

const getOrders = (req, res, next) => {
  Order
    .find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'Your Orders',
        activeOrders: true,
        orders: orders,
        hasOrders: orders.length > 0
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(item => {
        return {
          quantity: item.quantity,
          product: { ...item.productId._doc }
        };
      });

      const newOrder = new Order({
        user: {
          email: req.user.email,
          userId: req.user._id
        },
        products: products
      });
      return newOrder.save();
    })
    .then(() => req.user.clearCart(() => {
      res.redirect('/orders');
    }))
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

module.exports = {
  getCart,
  postCart,
  postDeleteCartProduct,
  getOrders,
  postOrder
};
