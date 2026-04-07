const pool = require('../config/database');

// Generate unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${new Date().getFullYear()}-${timestamp.toString().slice(-6)}${random}`;
};

// Create order from cart
exports.createOrder = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { shipping_address, billing_address, payment_method } = req.body;

    if (!shipping_address) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    // Get cart items
    const cartResult = await pool.query(
      'SELECT * FROM cart WHERE user_id = $1',
      [user_id]
    );

    if (cartResult.rows.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total
    let total = 0;
    for (const cartItem of cartResult.rows) {
      const bookResult = await pool.query('SELECT price FROM books WHERE id = $1', [
        cartItem.book_id,
      ]);
      total += bookResult.rows[0].price * cartItem.quantity;
    }

    // Create order
    const orderNumber = generateOrderNumber();
    const orderResult = await pool.query(
      `INSERT INTO orders (user_id, order_number, total_amount, status, shipping_address, billing_address, payment_method, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        user_id,
        orderNumber,
        total,
        'confirmed',
        shipping_address,
        billing_address || shipping_address,
        payment_method || 'credit_card',
        'completed',
      ]
    );

    const order = orderResult.rows[0];

    // Add items to order_items
    for (const cartItem of cartResult.rows) {
      const bookResult = await pool.query('SELECT price FROM books WHERE id = $1', [
        cartItem.book_id,
      ]);
      const price = bookResult.rows[0].price;

      await pool.query(
        `INSERT INTO order_items (order_id, book_id, quantity, price_at_purchase)
         VALUES ($1, $2, $3, $4)`,
        [order.id, cartItem.book_id, cartItem.quantity, price]
      );

      // Update inventory
      await pool.query(
        `INSERT INTO inventory_log (book_id, quantity_changed, reason, order_id)
         VALUES ($1, $2, $3, $4)`,
        [cartItem.book_id, -cartItem.quantity, 'sale', order.id]
      );

      // Update book stock
      await pool.query(
        'UPDATE books SET stock_quantity = stock_quantity - $1 WHERE id = $2',
        [cartItem.quantity, cartItem.book_id]
      );
    }

    // Clear cart
    await pool.query('DELETE FROM cart WHERE user_id = $1', [user_id]);

    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's orders
exports.getUserOrders = async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await pool.query(
      `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
      [user_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get order details with items
exports.getOrderDetails = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { order_id } = req.params;

    // Get order
    const orderResult = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [order_id, user_id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orderResult.rows[0];

    // Get order items
    const itemsResult = await pool.query(
      `SELECT oi.*, b.title, b.author, b.cover_image_url 
       FROM order_items oi 
       JOIN books b ON oi.book_id = b.id 
       WHERE oi.order_id = $1`,
      [order_id]
    );

    res.json({
      order,
      items: itemsResult.rows,
    });
  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel order (only if pending)
exports.cancelOrder = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { order_id } = req.params;

    // Get order
    const orderResult = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [order_id, user_id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orderResult.rows[0];

    if (order.status !== 'pending' && order.status !== 'confirmed') {
      return res.status(400).json({ message: 'Cannot cancel order in this status' });
    }

    // Update order status
    const updateResult = await pool.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      ['cancelled', order_id]
    );

    res.json({
      message: 'Order cancelled successfully',
      order: updateResult.rows[0],
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
