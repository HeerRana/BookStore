const pool = require('../config/database');

const transformBook = (book) => ({
  id: book.id,
  title: book.title,
  author: book.author,
  price: Number(book.price),
  stock: Number(book.stock_quantity ?? book.stock ?? 0),
  category: book.category_name || book.category || 'General',
  rating: Number(book.rating ?? 0),
  imageUrl: book.cover_image_url || book.imageUrl || book.image_url || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
  description: book.description || '',
  is_available: book.is_available,
});

const getCategoryId = async (categoryName) => {
  if (!categoryName || !categoryName.trim()) {
    return null;
  }

  const normalized = categoryName.trim();
  const existingCategory = await pool.query(
    'SELECT id FROM categories WHERE LOWER(name) = LOWER($1)',
    [normalized]
  );

  if (existingCategory.rows.length > 0) {
    return existingCategory.rows[0].id;
  }

  const result = await pool.query(
    'INSERT INTO categories (name) VALUES ($1) RETURNING id',
    [normalized]
  );

  return result.rows[0].id;
};

// Get all books with optional filtering and pagination
exports.getAllBooks = async (req, res) => {
  try {
    const { category_id, page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    const baseQuery = `SELECT b.*, c.name AS category_name
                       FROM books b
                       LEFT JOIN categories c ON b.category_id = c.id
                       WHERE b.is_available = true`;

    let query = baseQuery;
    let countQuery = 'SELECT COUNT(*) FROM books WHERE is_available = true';
    const params = [];
    let paramCount = 1;

    if (category_id) {
      query += ` AND b.category_id = $${paramCount}`;
      countQuery += ` AND category_id = $${paramCount}`;
      params.push(category_id);
      paramCount++;
    }

    if (search) {
      query += ` AND (b.title ILIKE $${paramCount} OR b.author ILIKE $${paramCount})`;
      countQuery += ` AND (title ILIKE $${paramCount} OR author ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    // Get total count
    const countResult = await pool.query(countQuery, params);
    const total = countResult.rows[0].count;

    query += ` ORDER BY b.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
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

exports.createBook = async (req, res) => {
  try {
    const { title, author, price, stock, category, rating, imageUrl, description } = req.body;

    if (!title || !author || price == null || stock == null) {
      return res.status(400).json({ message: 'Title, author, price, and stock are required' });
    }

    const categoryId = await getCategoryId(category);
    const result = await pool.query(
      `INSERT INTO books (title, author, price, stock_quantity, category_id, cover_image_url, description, is_available, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING *`,
      [title, author, price, stock, categoryId, imageUrl || '', description || '']
    );

    const createdBook = result.rows[0];
    const categoryResult = categoryId
      ? await pool.query('SELECT name FROM categories WHERE id = $1', [categoryId])
      : null;

    res.status(201).json({ book: transformBook({ ...createdBook, category_name: categoryResult?.rows[0]?.name }) });
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, price, stock, category, rating, imageUrl, description } = req.body;

    if (!title || !author || price == null || stock == null) {
      return res.status(400).json({ message: 'Title, author, price, and stock are required' });
    }

    const bookResult = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    if (bookResult.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const categoryId = await getCategoryId(category);
    const result = await pool.query(
      `UPDATE books
       SET title = $1,
           author = $2,
           price = $3,
           stock_quantity = $4,
           category_id = $5,
           cover_image_url = $6,
           description = $7,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [title, author, price, stock, categoryId, imageUrl || '', description || '', id]
    );

    const updatedBook = result.rows[0];
    const categoryResult = categoryId
      ? await pool.query('SELECT name FROM categories WHERE id = $1', [categoryId])
      : null;

    res.json({ book: transformBook({ ...updatedBook, category_name: categoryResult?.rows[0]?.name }) });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete book error:', error);
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
