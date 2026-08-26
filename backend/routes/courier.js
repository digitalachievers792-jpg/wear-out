const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/analyticsController');

router.get('/couriers', protect, ctrl.getCouriers);
router.post('/couriers/:id/toggle', protect, ctrl.toggleCourier);
router.get('/optimizer', protect, ctrl.getDeliveryOptimizer);

module.exports = router;
