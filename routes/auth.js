const express = require('express');

const authController  = require('../controllers/auth');
const authValidations = require('../middleware/auth_validations');

const router = express.Router();

router.get('/login',                  authController.getLogin);

router.post('/login',
  authValidations.postLoginValidation(),
  authController.postLogin);

router.post('/logout',                authController.postLogout);
router.get('/signup',                 authController.getSignup);

router.post('/signup',
  authValidations.postSignupValidation(),
  authController.postSignup);

router.get('/reset-password/:token',  authController.getNewPassword);
router.get('/reset-password',         authController.getReset);
router.post('/reset-password',        authController.postReset);
router.post('/new-password',          authController.postNewPassword);

module.exports = router;
