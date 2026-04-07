const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/', bookController.getAllBooks);
router.get('/categories', bookController.getCategories);
router.get('/:id', bookController.getBookById);

// Protected routes
router.post('/:id/reviews', authMiddleware, bookController.addReview);

module.exports = router;
