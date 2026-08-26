const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { reviewLimiter } = require('../middleware/rateLimiter');
const { handleValidation } = require('../middleware/validate');
const { body } = require('express-validator');

router.post(
  '/',
  reviewLimiter,
  [
    body('product').isString(),
    body('rating').isInt({ min: 1, max: 5 }),
    body('comment').isString().trim().isLength({ min: 1, max: 1000 }),
  ],
  handleValidation,
  ctrl.submitReview
);

router.get('/product/:productId', ctrl.getApprovedReviews);
router.get('/product/:productId/rating', ctrl.getProductRating);

router.get('/pending', protect, ctrl.getPendingReviews);
router.put('/:id/status', protect, ctrl.setReviewStatus);
router.delete('/:id', protect, ctrl.deleteReview);

module.exports = router;
