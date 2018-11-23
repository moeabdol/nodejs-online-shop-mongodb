const express = require('express');

const adminController     = require('../controllers/admin');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.get('/add-product',
  isAuthenticated,
  adminController.getAddProduct);

router.post('/add-product',
  isAuthenticated,
  adminController.postAddProduct);

router.get('/products/:id/edit',
  isAuthenticated,
  adminController.getEditProduct);

router.post('/products/:id/delete',
  isAuthenticated,
  adminController.postDeleteProduct);

router.post('/products/:id',
  isAuthenticated,
  adminController.postEditProduct);

router.get('/products',
  isAuthenticated,
  adminController.getProducts);

module.exports = router;
