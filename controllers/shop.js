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

module.exports = {
  getCart,
  getCheckout
};
