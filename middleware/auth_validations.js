const { body } = require('express-validator/check');

const User = require('../models/user');

const postSignupValidation = () => {
  const validators = [];

  const emailValidator = body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom(value => {
      // if (value === 'test@test.com') {
      //   throw new Error('This email address is forbidden.');
      // }
      // return true;

      return User
        .findOne({ email: value })
        .then(user => {
          if (user) return Promise.reject('Email already exists!');
        });
    })
    .normalizeEmail({ gmail_remove_dots: false });

  const passwordValidator = body('password',
    'Please enter a password that is alphanumeric and at least 5 characters long')
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim();

  const confirmPasswordValidator = body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords have to match');
      }
      return true;
    })
    .trim();

  validators.push(emailValidator);
  validators.push(passwordValidator);
  validators.push(confirmPasswordValidator);

  return validators;
};

const postLoginValidation = () => {
  const validators = [];

  const emailValidator = body('email')
    .isEmail()
    .withMessage('Please enter a valid email address!')
    .normalizeEmail({ gmail_remove_dots: false });

  const passwordValidator = body('password',
    'Please enter a password that is alphanumeric and at least 5 characters long')
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim();

  validators.push(emailValidator);
  validators.push(passwordValidator);

  return validators;
};

module.exports = {
  postSignupValidation,
  postLoginValidation
};
