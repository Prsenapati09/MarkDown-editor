import { body, validationResult } from 'express-validator';

// Runs after the validation chains below and returns 400 with details on failure
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }
  next();
};

export const registerValidation = [
  body('name')
  .trim()
  .notEmpty()
  .withMessage('Name is required')
  .isLength({ max: 50 }),

  body('email')
  .trim()
  .isEmail()
  .withMessage('A valid email is required')
  .normalizeEmail(),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/\d/)
    .withMessage('Password must contain at least one number'),
];

export const loginValidation = [
  body('email')
  .trim()
  .isEmail()
  .withMessage('A valid email is required')
  .normalizeEmail(),

  body('password')
  .notEmpty()
  .withMessage('Password is required'),
];

export const documentValidation = [
  body('title')
  .optional()
  .trim()
  .isLength({ max: 150 })
  .withMessage('Title too long'),


  body('content')
  .optional()
  .isLength({ max: 200000 })
  .withMessage('Document too large'),
];
