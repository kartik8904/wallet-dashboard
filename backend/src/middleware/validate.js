const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

const validateTransaction = [
  body('type')
    .notEmpty().withMessage('Type is required')
    .isIn(['credit', 'debit']).withMessage('Type must be credit or debit'),

  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({ min: 1 }).withMessage('Amount must be at least ₹1'),

  body('currency')
    .notEmpty().withMessage('Currency is required')
    .isIn(['INR', 'USD', 'EUR', 'GBP']).withMessage('Invalid currency'),

  body('description')
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 3, max: 100 }).withMessage('Description must be between 3 and 100 characters'),

  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['pending', 'completed', 'failed']).withMessage('Status must be pending, completed or failed'),

  handleValidationErrors
];

module.exports = { validateTransaction };