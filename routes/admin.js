const express = require('express');

const adminController     = require('../controllers/admin');
const { isAuthenticated } = require('../middleware/auth');
const adminValidations    = require('../middleware/admin_validations');

const router = express.Router();

router.get('/add-product',
  isAuthenticated,
  adminController.getAddProduct);

router.post('/add-product',
  isAuthenticated,
  adminValidations.postAddProductValidation(),
  adminController.postAddProduct);

router.get('/products/:id/edit',
  isAuthenticated,
  adminController.getEditProduct);

router.post('/products/:id/delete',
  isAuthenticated,
  adminController.postDeleteProduct);

router.post('/products/:id',
  isAuthenticated,
  adminValidations.postEditProductValidation(),
  adminController.postEditProduct);

router.get('/products',
  isAuthenticated,
  adminController.getProducts);

module.exports = router;
