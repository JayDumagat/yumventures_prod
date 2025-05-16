const {body} = require('express-validator');

const categoryValidationSchema = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({min: 3})
        .withMessage('Name must be at least 3 characters long'),
    body('description')
        .optional()
        .isLength({max: 255})
        .withMessage('Description must be at most 255 characters long'),
]

module.exports = categoryValidationSchema;