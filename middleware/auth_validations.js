const { check } = require('express-validator/check');

const postSignupValidation = () => {
  const validators = [];

  const emailValidator = check('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom(value => {
      if (value === 'test@test.com') {
        throw new Error('This email address is forbidden.');
      }
      return true;
    });

  const passwordValidator = check('password',
    'Please enter a password that is alphanumeric and at least 5 characters long')
    .isLength({ min: 5 })
    .isAlphanumeric();

  validators.push(emailValidator);
  validators.push(passwordValidator);

  return validators;
};

module.exports = {
  postSignupValidation
};
