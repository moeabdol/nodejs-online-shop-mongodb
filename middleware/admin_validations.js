const { body } = require('express-validator/check');

const postAddProductValidation = () => {
  const validators = [];

  const titleValidator = body('title')
    .isString()
    .withMessage('Title must be a valid string')
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters')
    .trim();

  // const imageUrlValidator = body('imageUrl')
  //   .isURL()
  //   .withMessage('Image URL must be a fully qualified URL');

  const priceValidator = body('price')
    .isFloat()
    .withMessage('Price must be a number');

  const descriptionValidator = body('description')
    .isLength({ min: 8, max: 400 })
    .withMessage('Description must be at least 8 characters and at monst 800 characters')
    .trim();

  validators.push(titleValidator);
  // validators.push(imageUrlValidator);
  validators.push(priceValidator);
  validators.push(descriptionValidator);

  return validators;
};

const postEditProductValidation = () => {
  const validators = [];

  const titleValidator = body('title')
    .isString()
    .withMessage('Title must be a valid string')
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters')
    .trim();

  // const imageUrlValidator = body('imageUrl')
  //   .isURL()
  //   .withMessage('Image URL must be a fully qualified URL');

  const priceValidator = body('price')
    .isFloat()
    .withMessage('Price must be a number');

  const descriptionValidator = body('description')
    .isLength({ min: 8, max: 400 })
    .withMessage('Description must be at least 8 characters and at monst 800 characters')
    .trim();

  validators.push(titleValidator);
  // validators.push(imageUrlValidator);
  validators.push(priceValidator);
  validators.push(descriptionValidator);

  return validators;
};

module.exports = {
  postAddProductValidation,
  postEditProductValidation
};
