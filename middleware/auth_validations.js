const { body } = require('express-validator/check');

const postSignupValidation = () => {
  const validators = [];

  const emailValidator = body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom(value => {
      if (value === 'test@test.com') {
        throw new Error('This email address is forbidden.');
      }
      return true;
    });

  const passwordValidator = body('password',
    'Please enter a password that is alphanumeric and at least 5 characters long')
    .isLength({ min: 5 })
    .isAlphanumeric();

  const confirmPasswordValidator = body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords have to match');
      }
      return true;
    });

  validators.push(emailValidator);
  validators.push(passwordValidator);
  validators.push(confirmPasswordValidator);

  return validators;
};

module.exports = {
  postSignupValidation
};
