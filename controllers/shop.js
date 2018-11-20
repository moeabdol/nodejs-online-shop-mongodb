const Product = require('../models/product');
const Order   = require('../models/order');

const getCart = (req, res) => {
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
    .catch(err => console.error(err));
};

const postCart = (req, res) => {
  const productId = req.body.productId;
  Product
    .findById(productId)
    .then(product => {
      req.user.addToCart(product, () => {
        res.redirect('/cart');
      });
    })
    .catch(err => console.error(err));
};

const postDeleteCartProduct = (req, res) => {
  const productId = req.params.id;
  req.user
    .removeFromCart(productId, err => {
      if (err) return console.error(err);
      res.redirect('/cart');
    });
};

const getOrders = (req, res) => {
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
    .catch(err => console.error(err));
};

const postOrder = (req, res) => {
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
          name: req.user.name,
          userId: req.user._id
        },
        products: products
      });
      return newOrder.save();
    })
    .then(() => req.user.clearCart(() => {
      res.redirect('/orders');
    }))
    .catch(err => console.error(err));

};

module.exports = {
  getCart,
  postCart,
  postDeleteCartProduct,
  getOrders,
  postOrder
};
