// backend/src/routes/auth.js
import express from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/AuthController.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();
const authController = new AuthController();

const registerValidation = [
  body('username').isLength({ min: 3 }).trim(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
];

router.post('/register', registerValidation, handleValidationErrors, authController.register);
router.post('/login', loginValidation, handleValidationErrors, authController.login);

export default router;