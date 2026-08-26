const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/analyticsController');

router.get('/dashboard', protect, ctrl.getDashboard);
router.get('/customers', protect, ctrl.getCustomers);
router.get('/logistics', protect, ctrl.getLogistics);

module.exports = router;
