const Product = require('../models/product');

const getCart = (req, res) => {
  req.user
    .getCart()
    .then(cart => cart.getProducts())
    .then(products => {
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        activeCart: true,
        cartCSS: true,
        products: products,
        hasProducts: products.length > 0
      });
    })
    .catch(err => console.error(err));
};

const postCart = (req, res) => {
  const productId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;

  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId }});
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      } else {
        return Product.findByPk(productId);
      }
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
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
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: productId }});
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
        return product.cartItem.destroy();
      } else {
        return;
      }
    })
    .then(() => res.redirect('/cart'))
    .catch(err => console.error(err));
};

const postOrder = (req, res) => {
  let cartProducts;

  req.user
    .getCart()
    .then(cart => cart.getProducts())
    .then(products => {
      cartProducts = products;
      return req.user.createOrder();
    })
    .then(order => {
      return order.addProducts(
        cartProducts.map(product => {
          product.orderItem = { quantity: product.cartItem.quantity };
          return product;
        })
      );
    })
    .then(() => res.redirect('/orders'))
    .catch(err => console.error(err));
};

module.exports = {
  getCart,
  postCart,
  getCheckout,
  getOrders,
  postDeleteCartProduct,
  postOrder
};
