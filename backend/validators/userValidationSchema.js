const {body} = require('express-validator');


const userValidationSchema = [
    body('firstName')
        .notEmpty()
        .withMessage('First name is required')
        .isLength({min: 1, max: 50})
        .withMessage('First name must be between 1 and 50 characters long'),
    body('lastName')
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({min: 1, max: 50})
        .withMessage('Last name must be between 1 and 50 characters long'),
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format')
        .isLength({max: 100})
        .withMessage('Email must be less than 100 characters long'),
    body('username')
        .notEmpty()
        .withMessage('Username is required')
        .isLength({min: 3})
        .withMessage('Username must be at least 3 characters long')
        .isAlphanumeric()
        .withMessage('Username must be alphanumeric'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({min: 6})
        .withMessage('Password must be at least 6 characters long'),
    body('role')
        .optional()
        .isIn(['owner', 'cashier', 'customer'])
        .withMessage('Role must be one of the following: owner, cashier, customer')
        .default('customer'),
]

module.exports = userValidationSchema;