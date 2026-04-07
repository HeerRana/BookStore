const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/auth');

// All cart routes are protected
router.get('/', authMiddleware, cartController.getCart);
router.post('/add', authMiddleware, cartController.addToCart);
router.put('/update/:book_id', authMiddleware, cartController.updateCartQuantity);
router.delete('/remove/:book_id', authMiddleware, cartController.removeFromCart);
router.delete('/clear', authMiddleware, cartController.clearCart);

module.exports = router;
