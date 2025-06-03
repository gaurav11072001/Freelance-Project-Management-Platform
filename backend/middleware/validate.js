const { check } = require('express-validator');

exports.registerValidation = [
  check('username')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long'),
  check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Invalid email address'),
  check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  check('role')
    .isIn(['client', 'freelancer'])
    .withMessage('Invalid role')
];

exports.loginValidation = [
  check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Invalid email address'),
  check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Password is required')
];

exports.projectValidation = [
  check('title')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Project title is required'),
  check('description')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Project description is required'),
  check('budget')
    .isNumeric()
    .withMessage('Budget must be a number')
    .custom(value => value > 0)
    .withMessage('Budget must be greater than 0'),
  check('deadline')
    .isISO8601()
    .withMessage('Invalid deadline date')
    .custom(value => new Date(value) > new Date())
    .withMessage('Deadline must be in the future'),
  check('category')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Category is required'),
  check('skills')
    .isArray()
    .withMessage('Skills must be an array')
    .custom(value => value.length > 0)
    .withMessage('At least one skill is required')
];

exports.bidValidation = [
  check('amount')
    .isNumeric()
    .withMessage('Bid amount must be a number')
    .custom(value => value > 0)
    .withMessage('Bid amount must be greater than 0'),
  check('proposal')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Proposal is required'),
  check('timeframe')
    .isNumeric()
    .withMessage('Timeframe must be a number')
    .custom(value => value > 0)
    .withMessage('Timeframe must be greater than 0')
];
