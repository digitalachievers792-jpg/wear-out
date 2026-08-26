const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { handleValidation } = require('../middleware/validate');
const { body } = require('express-validator');

router.get('/', ctrl.getProducts);
router.get('/:id', ctrl.getProduct);

router.post(
  '/',
  protect,
  upload.single('image'),
  [
    body('name').isString().trim().notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('category').isIn(['Shirts', 'Trousers', 'Caps', 'Watches', 'Accessories', 'Shoes', 'Un Stitch']),
    body('rating').optional().isFloat({ min: 0, max: 5 }),
  ],
  handleValidation,
  ctrl.createProduct
);

router.put('/:id', protect, upload.single('image'), ctrl.updateProduct);

router.delete('/:id', protect, ctrl.deleteProduct);

module.exports = router;
