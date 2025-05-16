const {body} = require('express-validator');

const menuItemValidationSchema = [
    body('product')
        .notEmpty()
        .withMessage('Product name is required')
        .isLength({min: 3})
        .withMessage('Product name must be at least 3 characters long'),
    body('description')
        .notEmpty()
        .withMessage('Description is required')
        .isLength({min: 10})
        .withMessage('Description must be at least 10 characters long'),
    body('category')
        .notEmpty()
        .withMessage('Category is required'),
    body('price')
        .notEmpty()
        .withMessage('Price is required')
        .isNumeric()
        .withMessage('Price must be a number'),
    body('image')
        .notEmpty()
        .withMessage('Image is required'),

    body('status')
        .optional()
        .isIn(['active', 'inactive'])
        .withMessage('Status must be either active or inactive'),
]

module.exports = menuItemValidationSchema;