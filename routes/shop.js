const express = require('express');

const productsController = require('../controllers/products');
const shopController     = require('../controllers/shop');

const router = express.Router();

router.get('/',                     productsController.getIndex);
router.get('/products',             productsController.getProducts);
router.get('/products/:productId',  productsController.getProduct);
router.post('/cart/:id/delete',     shopController.postDeleteCartProduct);
router.get('/cart',                 shopController.getCart);
router.post('/cart',                shopController.postCart);
// router.get('/checkout',             shopController.getCheckout);
// router.get('/orders',               shopController.getOrders);
// router.post('/orders',              shopController.postOrder);

module.exports = router;
