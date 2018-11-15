const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/add-product',           adminController.getAddProduct);
router.post('/add-product',          adminController.postAddProduct);
router.get('/products/:id/edit',     adminController.getEditProduct);
// router.post('/products/:id/delete',  adminController.postDeleteProduct);
router.post('/products/:id',         adminController.postEditProduct);
router.get('/products',              adminController.getProducts);

module.exports = router;
