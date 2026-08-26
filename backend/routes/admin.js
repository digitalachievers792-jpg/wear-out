const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { handleValidation } = require('../middleware/validate');
const { body } = require('express-validator');

router.post(
  '/login',
  authLimiter,
  [body('email').isEmail(), body('password').isString().notEmpty()],
  handleValidation,
  ctrl.login
);

router.get('/me', protect, ctrl.me);
router.get('/config', ctrl.getPublicConfig);

module.exports = router;
