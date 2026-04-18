const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// Public routes
router.get('/', bookController.getAllBooks);
router.get('/categories', bookController.getCategories);
router.get('/:id', bookController.getBookById);

// Admin routes
router.post('/', authMiddleware, adminMiddleware, bookController.createBook);
router.put('/:id', authMiddleware, adminMiddleware, bookController.updateBook);
router.delete('/:id', authMiddleware, adminMiddleware, bookController.deleteBook);

// Protected routes
router.post('/:id/reviews', authMiddleware, bookController.addReview);

module.exports = router;
