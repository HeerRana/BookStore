const pool = require('../config/database');

// Get all books with optional filtering and pagination
exports.getAllBooks = async (req, res) => {
  try {
    const { category_id, page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM books WHERE is_available = true';
    let countQuery = 'SELECT COUNT(*) FROM books WHERE is_available = true';
    let params = [];
    let paramCount = 1;

    if (category_id) {
      query += ` AND category_id = $${paramCount}`;
      countQuery += ` AND category_id = $${paramCount}`;
      params.push(category_id);
      paramCount++;
    }

    if (search) {
      query += ` AND (title ILIKE $${paramCount} OR author ILIKE $${paramCount})`;
      countQuery += ` AND (title ILIKE $${paramCount} OR author ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    // Get total count
    const countResult = await pool.query(countQuery, params);
    const total = countResult.rows[0].count;

    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    res.json({
      books: result.rows,
      pagination: {
        total: parseInt(total),
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get book by ID
exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const bookResult = await pool.query(
      `SELECT b.*, c.name as category_name 
       FROM books b 
       LEFT JOIN categories c ON b.category_id = c.id 
       WHERE b.id = $1`,
      [id]
    );

    if (bookResult.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const book = bookResult.rows[0];

    // Get reviews
    const reviewsResult = await pool.query(
      `SELECT r.*, u.first_name, u.last_name 
       FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.book_id = $1 
       ORDER BY r.created_at DESC`,
      [id]
    );

    res.json({
      ...book,
      reviews: reviewsResult.rows,
    });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add book review (Admin only)
exports.addReview = async (req, res) => {
  try {
    const { book_id, rating, review_text } = req.body;
    const user_id = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if user already reviewed this book
    const existingReview = await pool.query(
      'SELECT * FROM reviews WHERE book_id = $1 AND user_id = $2',
      [book_id, user_id]
    );

    if (existingReview.rows.length > 0) {
      return res.status(409).json({ message: 'You already reviewed this book' });
    }

    const result = await pool.query(
      'INSERT INTO reviews (book_id, user_id, rating, review_text, is_verified_purchase) VALUES ($1, $2, $3, $4, true) RETURNING *',
      [book_id, user_id, rating, review_text]
    );

    res.status(201).json({
      message: 'Review added successfully',
      review: result.rows[0],
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
