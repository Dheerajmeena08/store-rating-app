const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const {
  signupSchema,
  loginSchema,
  updatePasswordSchema,
} = require('../validators/schemas');

router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.me);
router.put(
  '/update-password',
  authenticate,
  validate(updatePasswordSchema),
  authController.updatePassword
);

module.exports = router;
