const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');

// All order routes are protected
router.post('/create', authMiddleware, orderController.createOrder);
router.get('/', authMiddleware, orderController.getUserOrders);
router.get('/:order_id', authMiddleware, orderController.getOrderDetails);
router.post('/:order_id/cancel', authMiddleware, orderController.cancelOrder);

module.exports = router;
