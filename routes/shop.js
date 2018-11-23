const express = require('express');

const productsController  = require('../controllers/products');
const shopController      = require('../controllers/shop');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.get('/',                     productsController.getIndex);
router.get('/products',             productsController.getProducts);
router.get('/products/:productId',  productsController.getProduct);

router.post('/cart/:id/delete',
  isAuthenticated,
  shopController.postDeleteCartProduct);

router.get('/cart',
  isAuthenticated,
  shopController.getCart);

router.post('/cart',
  isAuthenticated,
  shopController.postCart);

router.get('/orders',
  isAuthenticated,
  shopController.getOrders);

router.post('/orders',
  isAuthenticated,
  shopController.postOrder);

module.exports = router;
