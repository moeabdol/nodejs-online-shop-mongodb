const getCart = (req, res) => {
  res.render('shop/cart', {
    pageTitle: 'Your Cart',
    activeCart: true
  });
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

module.exports = {
  getCart,
  getCheckout,
  getOrders
};
