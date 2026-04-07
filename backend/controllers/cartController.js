const pool = require('../config/database');

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await pool.query(
      `SELECT c.*, b.title, b.author, b.price, b.cover_image_url 
       FROM cart c 
       JOIN books b ON c.book_id = b.id 
       WHERE c.user_id = $1 
       ORDER BY c.added_at DESC`,
      [user_id]
    );

    // Calculate total
    const total = result.rows.reduce((sum, item) => sum + item.price * item.quantity, 0);

    res.json({
      items: result.rows,
      total: total.toFixed(2),
      itemCount: result.rows.length,
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { book_id, quantity = 1 } = req.body;

    if (!book_id || quantity < 1) {
      return res.status(400).json({ message: 'Invalid book_id or quantity' });
    }

    // Check if book exists
    const bookResult = await pool.query('SELECT * FROM books WHERE id = $1', [book_id]);
    if (bookResult.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if item already in cart
    const existingItem = await pool.query(
      'SELECT * FROM cart WHERE user_id = $1 AND book_id = $2',
      [user_id, book_id]
    );

    if (existingItem.rows.length > 0) {
      // Update quantity
      const newQuantity = existingItem.rows[0].quantity + quantity;
      await pool.query(
        'UPDATE cart SET quantity = $1 WHERE user_id = $2 AND book_id = $3',
        [newQuantity, user_id, book_id]
      );
    } else {
      // Insert new item
      await pool.query(
        'INSERT INTO cart (user_id, book_id, quantity) VALUES ($1, $2, $3)',
        [user_id, book_id, quantity]
      );
    }

    res.status(201).json({ message: 'Item added to cart' });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { book_id } = req.params;

    const result = await pool.query(
      'DELETE FROM cart WHERE user_id = $1 AND book_id = $2 RETURNING *',
      [user_id, book_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update cart item quantity
exports.updateCartQuantity = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { book_id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const result = await pool.query(
      'UPDATE cart SET quantity = $1 WHERE user_id = $2 AND book_id = $3 RETURNING *',
      [quantity, user_id, book_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    res.json({
      message: 'Cart updated',
      item: result.rows[0],
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const user_id = req.user.id;

    await pool.query('DELETE FROM cart WHERE user_id = $1', [user_id]);

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
