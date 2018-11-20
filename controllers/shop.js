const Product = require('../models/product');

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

// const getCheckout = (req, res) => {
//   res.render('shop/checkout', {
//     pageTitle: 'Checkout',
//     activeCheckout: true
//   });
// };

// const getOrders = (req, res) => {
//   req.user
//     .getOrders({ include: ['products'] })
//     .then(orders => {
//       res.render('shop/orders', {
//         pageTitle: 'Your Orders',
//         activeOrders: true,
//         orders: orders,
//         hasOrders: orders.length > 0
//       });
//     })
//     .catch(err => console.error(err));
// };

const postDeleteCartProduct = (req, res) => {
  const productId = req.params.id;
  req.user
    .removeFromCart(productId, err => {
      if (err) return console.error(err);
      res.redirect('/cart');
    });
};

// const postOrder = (req, res) => {
//   let cartProducts;
//   let fetchedCart;
//
//   req.user
//     .getCart()
//     .then(cart => {
//       fetchedCart = cart;
//       return cart.getProducts();
//     })
//     .then(products => {
//       cartProducts = products;
//       return req.user.createOrder();
//     })
//     .then(order => {
//       return order.addProducts(
//         cartProducts.map(product => {
//           product.orderItem = { quantity: product.cartItem.quantity };
//           return product;
//         })
//       );
//     })
//     .then(() => fetchedCart.setProducts(null))
//     .then(() => res.redirect('/orders'))
//     .catch(err => console.error(err));
// };

module.exports = {
  getCart,
  postCart,
  // getCheckout,
  // getOrders,
  postDeleteCartProduct,
  // postOrder
};
