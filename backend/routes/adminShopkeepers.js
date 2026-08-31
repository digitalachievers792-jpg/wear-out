const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/shopkeeperController');
const { protect } = require('../middleware/auth');
const Product = require('../models/Product');

// All routes require admin auth
router.use(protect);

router.get('/shopkeepers', ctrl.getAll);
router.get('/shopkeepers/pending', ctrl.getPending);
router.put('/shopkeepers/:id/status', ctrl.updateStatus);

// Featured product requests
router.get('/featured-requests', async (req, res) => {
  try {
    const products = await Product.find({ featuredPending: true }).populate('shopkeeper', 'shopName ownerName').sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/featured-requests/:id/approve', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { featured: true, featuredPending: false }, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/featured-requests/:id/reject', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { featuredPending: false }, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
